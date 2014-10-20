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
				height: 200,
				width: 200,
				chartHeight: 180,
				chartWidth: 180,
				elemPitch: 10,
				elemWidth: 6,
				guides: false, // Shows guides to help setup.
				maxDataValue: 200
			};

			for(var option in options) {
				if(options.hasOwnProperty(option)) {
					this.options[option] = options[option];
				}
			}

			this.target = typeof this.options.target === 'string' ? document.querySelector(this.options.target) : this.options.target;

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

			var outer_padding_x = (opts.width - opts.chartWidth) / 2;
			var outer_padding_y = (opts.height - opts.chartHeight) / 2;

			if(ctx) {

				ctx.strokeStyle = '#eee';
				ctx.fillStyle = '#000';

/*
				ctx.beginPath();

				ctx.moveTo(0.5 + outer_padding_x, 0.5 + outer_padding_y);
				ctx.lineTo(0.5 + outer_padding_x + opts.chartWidth, 0.5 + outer_padding_y);
				ctx.lineTo(0.5 + outer_padding_x + opts.chartWidth, 0.5 + outer_padding_y + opts.chartHeight);
				ctx.lineTo(0.5 + outer_padding_x, 0.5 + outer_padding_y + opts.chartHeight);

				ctx.closePath();
				// ctx.fill();
				ctx.stroke();
*/

				if(opts.guides) { 
					ctx.strokeRect(
						0.5 + outer_padding_x,
						0.5 + outer_padding_y,
						opts.chartWidth,
						opts.chartHeight
					);
				}

				for(var i = 0, iLen = data.length; i < iLen; i++) {
					normalized = Math.floor(opts.chartHeight * data[i] / opts.maxDataValue);
					ctx.fillRect(
						outer_padding_x + opts.elemPitch - opts.elemWidth + (i * opts.elemPitch),
						outer_padding_y + opts.chartHeight - normalized,
						opts.elemWidth,
						normalized
					);
				}

				ctx.strokeStyle = '#000';

				ctx.beginPath();
				ctx.moveTo(0.5 + outer_padding_x, 0.5 + outer_padding_y + opts.chartHeight);
				ctx.lineTo(0.5 + outer_padding_x + (data.length * opts.elemPitch) + opts.elemPitch - opts.elemWidth, 0.5 + outer_padding_y + opts.chartHeight);
				ctx.stroke();

			}
		},
		draw_barmirror: function(data) {

			var opts = this.options,
				ctx = this.context;

			var normalized;

			var outer_padding_x = (opts.width - opts.chartWidth) / 2;
			var outer_padding_y = (opts.height - opts.chartHeight) / 2;

			if(ctx) {

				ctx.strokeStyle = '#eee';
				ctx.fillStyle = '#000';

				if(opts.guides) { 
					ctx.strokeRect(
						0.5 + outer_padding_x,
						0.5 + outer_padding_y,
						opts.chartWidth,
						opts.chartHeight
					);
				}

				for(var i = 0, iLen = data.length; i < iLen; i++) {
					normalized = Math.floor(opts.chartHeight * data[i] / opts.maxDataValue / 2);
					ctx.fillRect(
						outer_padding_x + opts.elemPitch - opts.elemWidth + (i * opts.elemPitch),
						opts.height / 2 - normalized,
						opts.elemWidth,
						normalized
					);
					ctx.fillRect(
						outer_padding_x + opts.elemPitch - opts.elemWidth + (i * opts.elemPitch),
						1 + opts.height / 2,
						opts.elemWidth,
						normalized
					);
				}

				ctx.strokeStyle = '#000';

				ctx.beginPath();
				ctx.moveTo(0.5 + outer_padding_x, 0.5 + opts.height / 2);
				ctx.lineTo(0.5 + outer_padding_x + (data.length * opts.elemPitch) + opts.elemPitch - opts.elemWidth, 0.5 + opts.height / 2);
				ctx.stroke();
			}
		}
	};

	return Graph;

}(document));
