/* Graph using canvas
 */

var Graph = (function(document) {

	var Graph = function(options) {
		this.init(options);
	};

	Graph.prototype = {
		init: function(options) {
			this.options = {
				target: '#graph',
				type: 'barchart',

				bins: 5,
				trimBins: false, // Trims data arrays longer than the bins option, to bins.
				maxDataValue: 255,

				height: 200,
				width: null, // [optional] Defaults to automatic calculation

				padding: 10,

				elemPitch: 10,
				elemWidth: 6,

				color: '#aaf',

				guides: false // Shows guides to help setup.
			};

			for(var option in options) {
				if(options.hasOwnProperty(option)) {
					this.options[option] = options[option];
				}
			}

			this.target = typeof this.options.target === 'string' ? document.querySelector(this.options.target) : this.options.target;

			this.chartHeight = this.options.height - (2 * this.options.padding);
			this.chartWidth = (this.options.bins * this.options.elemPitch) + (this.options.elemPitch - this.options.elemWidth);

			// If no width given, update the width option with automatic value.
			this.options.width = typeof this.options.width === 'number' ? this.options.width : this.chartWidth + (2 * this.options.padding);

			this.create();

			// Register the graph style as a type
			this.draw_type = {
				barchart: this.draw_barchart,
				barmirror: this.draw_barmirror
			};
		},
		create: function() {
			// Create the canvas.
			this.canvas = document.createElement('canvas');
			this.canvas.width = this.options.width;
			this.canvas.height = this.options.height;
			// Add the canvas to the page.
			if(this.target && this.target.appendChild) {
				this.target.appendChild(this.canvas);
			} else {
				console.log('create: Target not found: ' + this.options.target);
			}
			// Get the 2d context of the canvas.
			this.context = this.canvas.getContext('2d');
		},
		draw: function(data) {
			this.clear();
			if(this.draw_type[this.options.type]) {
				this.draw_type[this.options.type].call(this, data);
			} else {
				console.log('draw: Graph type not found: ' + this.options.type);
			}
		},
		clear: function() {
			if(this.context) {
				// Clear the current state
				this.context.clearRect(0, 0, this.options.width, this.options.height);
			}
		},
		draw_barchart: function(data) {

			var opts = this.options,
				ctx = this.context;

			var normalized;

			var bins = opts.trimBins && data.length > opts.bins ? opts.bins : data.length;

			if(ctx) {

				ctx.strokeStyle = this.options.color;
				ctx.fillStyle = this.options.color;

				if(opts.guides) { 
					ctx.strokeRect(
						0.5 + opts.padding,
						0.5 + opts.padding,
						this.chartWidth,
						this.chartHeight
					);
				}

				for(var i = 0, iLen = bins; i < iLen; i++) {
					normalized = Math.floor(this.chartHeight * data[i] / opts.maxDataValue);
					ctx.fillRect(
						opts.padding + opts.elemPitch - opts.elemWidth + (i * opts.elemPitch),
						opts.padding + this.chartHeight - normalized,
						opts.elemWidth,
						normalized
					);
				}

				ctx.beginPath();
				ctx.moveTo(0.5 + opts.padding, 0.5 + opts.padding + this.chartHeight);
				ctx.lineTo(0.5 + opts.padding + (bins * opts.elemPitch) + opts.elemPitch - opts.elemWidth, 0.5 + opts.padding + this.chartHeight);
				ctx.stroke();

			}
		},
		draw_barmirror: function(data) {

			var opts = this.options,
				ctx = this.context;

			var normalized;

			if(ctx) {

				ctx.strokeStyle = this.options.color;
				ctx.fillStyle = this.options.color;

				if(opts.guides) { 
					ctx.strokeRect(
						0.5 + opts.padding,
						0.5 + opts.padding,
						this.chartWidth,
						this.chartHeight
					);
				}

				for(var i = 0, iLen = data.length; i < iLen; i++) {
					normalized = Math.floor(this.chartHeight * data[i] / opts.maxDataValue / 2);
					ctx.fillRect(
						opts.padding + opts.elemPitch - opts.elemWidth + (i * opts.elemPitch),
						opts.height / 2 - normalized,
						opts.elemWidth,
						normalized
					);
					ctx.fillRect(
						opts.padding + opts.elemPitch - opts.elemWidth + (i * opts.elemPitch),
						1 + opts.height / 2,
						opts.elemWidth,
						normalized
					);
				}

				ctx.beginPath();
				ctx.moveTo(0.5 + opts.padding, 0.5 + opts.height / 2);
				ctx.lineTo(0.5 + opts.padding + (data.length * opts.elemPitch) + opts.elemPitch - opts.elemWidth, 0.5 + opts.height / 2);
				ctx.stroke();
			}
		}
	};

	return Graph;

}(document));
