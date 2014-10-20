/* Web Audio API
 */

var WAA = (function(document) {

	var WAA = {
		context: new (window.AudioContext || window.webkitAudioContext)()
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

				this.byteFrequencyData = new Uint8Array(this.analyser.frequencyBinCount);
				this.floatFrequencyData = new Float32Array(this.analyser.frequencyBinCount);
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

	return WAA;

}(document));
