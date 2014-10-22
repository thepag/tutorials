/* Web Audio API
 */

var WAA = (function(document) {

	var WAA = {
		context: new (window.AudioContext || window.webkitAudioContext)(),
		toLinear: function(decibels) {
			return Math.pow(10, decibels / 10);
		},
		toDecibels: function(linear) {
			// log[x](y) is Math.log(y) / Math.log(x) so using the LN10 as we want log[10](linear)
			return 10 * Math.log(linear) / Math.LN10;
		},
		toUint: function(decibels, maxDecibels, minDecibels) {
			if(decibels < minDecibels) {
				return 0;
			} else if(decibels > maxDecibels) {
				return 255;
			} else {
				return Math.floor(256 * (decibels - minDecibels) / (maxDecibels - minDecibels));
			}
		}
	};

	var Probe = function(options) {
		this.init(options);
	};

	WAA.Probe = function(options) {
		return new Probe(options); // 
	};

	Probe.prototype = {
		init: function(options) {
			var self = this;
			// The default options
			this.options = {
				context: null,
				input: null, // The Node to connect to the input. Usually an AudioNode, but can be any object. [Rule: It must have the connect() method.]
				output: null,
				scriptSize: 512,
				fftSize: 512,
				maxDecibels: -30,
				minDecibels: -100,
				smoothingTimeConstant: 0.99,
				onaudioprocess: null
			};
			// Read in instancing options.
			for(var option in options) {
				if(options.hasOwnProperty(option)) {
					this.options[option] = options[option];
				}
			}
			// The Web Audio API context
			this.context = WAA && WAA.context ? WAA.context : this.options.context;

			// Create the audio map
			if(this.context) {

				this.scriptProcessor = this.context.createScriptProcessor(this.options.scriptSize, 1, 1);

				// setup an analyzer
				this.analyser = this.context.createAnalyser();
				this.analyser.smoothingTimeConstant = this.options.smoothingTimeConstant;
				this.analyser.fftSize = this.options.fftSize;

				this.analyser.maxDecibels = this.options.maxDecibels;
				this.analyser.minDecibels =  this.options.minDecibels;

				// Frequency data in dB. Read from analyser once per audioprocess event.
				this.byteFrequencyData = new Uint8Array(this.analyser.frequencyBinCount);
				this.floatFrequencyData = new Float32Array(this.analyser.frequencyBinCount);
				// Time domain data. Read from analyser once per audioprocess event.
				this.byteTimeDomainData = new Uint8Array(this.analyser.frequencyBinCount);

				this.scriptProcessor.onaudioprocess = function(event) {
					// Update the probe's data to avoid multiple calls to the analyser node. It affects the FFT info when multi reads per tick.
					self.analyser.getByteFrequencyData(self.byteFrequencyData);
					self.analyser.getFloatFrequencyData(self.floatFrequencyData);
					self.analyser.getByteTimeDomainData(self.byteTimeDomainData);
					// Execute the callback
					if(typeof self.options.onaudioprocess === 'function') {
						self.options.onaudioprocess.call(self, event);
					}
				};

				// Connect the audio map
				if(this.options.input) {
					this.options.input.connect(this.analyser);
				}
				this.analyser.connect(this.scriptProcessor);
				if(this.options.output) {
					this.scriptProcessor.connect(this.options.output);
				} else {
					// This map must go somewhere. Connect to the destination.
					this.scriptProcessor.connect(this.context.destination);
				}
			}
		}
	};

	var Spectrum = function(options) {
		this.init(options);
	};

	WAA.Spectrum = function(options) {
		return new Spectrum(options); // 
	};

	Spectrum.prototype = {
		init: function(options) {
			var self = this;
			// The default options
			this.options = {

				// Options as per the Probe class, with exceptions:
				// * onaudioprocess is ignored
				maxDecibels: -30,
				minDecibels: -100,

				// Spectrum options
				frequencyBands: [0,125,500,2000,8000], // Defines the lowest frequency of the band.
				onspectrumupdate: null // Callback executed when the spectrum has been changed.
			};
			// Read in instancing options.
			for(var option in options) {
				if(options.hasOwnProperty(option)) {
					this.options[option] = options[option];
				}
			}

			this.options.onaudioprocess = function(event) {

				// Copy the Probe array pointers to local properties.
				self.byteFrequencyData = this.byteFrequencyData;
				self.floatFrequencyData = this.floatFrequencyData;
				self.byteTimeDomainData = this.byteTimeDomainData;

				self.updateInputs();
				self.applyBands();
				self.updateOutputs();

				// Execute the callback
				if(typeof self.options.onspectrumupdate === 'function') {
					self.options.onspectrumupdate.call(self, event);
				}
			};

			// Create a Probe instance
			this.probe = WAA.Probe(this.options);

			// Now calculate FFT bin size
			this.frequencyPerBin = WAA.context.sampleRate / this.probe.analyser.fftSize;
			console.log('Spectrum.init: frequency/bin: ' + this.frequencyPerBin);

			// Create an array for the linear energy version of the FFT.
			this.floatFrequencyDataLinear = new Float32Array(this.probe.analyser.frequencyBinCount);

			// Create arrays for the banded frequency data.
			this.floatBandData = new Float32Array(this.options.frequencyBands.length); // dB
			this.floatBandDataLinear = new Float32Array(this.options.frequencyBands.length); // energy
			this.byteBandData = new Uint8Array(this.options.frequencyBands.length);
		},
		updateInputs: function() {
			// Update the Linear FFT data
			for(var i = 0, iLen = this.floatFrequencyData.length; i < iLen; i++) {
				this.floatFrequencyDataLinear[i] = this.floatFrequencyData[i] > this.options.minDecibels ? WAA.toLinear(this.floatFrequencyData[i]) : 0;
			}
		},
		updateOutputs: function() {
			// Update the decibel Band data
			for(var i = 0, iLen = this.options.frequencyBands.length; i < iLen; i++) {
				this.floatBandData[i] = WAA.toDecibels(this.floatBandDataLinear[i]);
				this.byteBandData[i] = WAA.toUint(this.floatBandData[i], this.options.maxDecibels, this.options.minDecibels);
			}
		},
		applyBands: function() {

			var band = 0;
			var bandRangeLower, bandRangeUpper;
			var binLower, binUpper;

			// Reset the array
			this.floatBandDataLinear = new Float32Array(this.options.frequencyBands.length);

			for(var i = 0, iLen = this.floatFrequencyDataLinear.length; i < iLen; i++) {

				// The range of the frequency bin.
				binLower = i * this.frequencyPerBin;
				binUpper = (i + 1) * this.frequencyPerBin;

				// The range of the frequency band.
				bandRangeLower = this.options.frequencyBands[band];
				bandRangeUpper = this.options.frequencyBands[band+1] ? this.options.frequencyBands[band+1] : Number.POSITIVE_INFINITY;

				if(binUpper <= bandRangeUpper) {
					this.floatBandDataLinear[band] += this.floatFrequencyDataLinear[i];
				} else {
					// Split the frequency bin between the bands
					var ratio = (bandRangeUpper % this.frequencyPerBin) / this.frequencyPerBin;
					this.floatBandDataLinear[band] += ratio * this.floatFrequencyDataLinear[i];
					this.floatBandDataLinear[band+1] += (1 - ratio) * this.floatFrequencyDataLinear[i];
					band++;
				}
			}
		}
	};

	return WAA;

}(document));
