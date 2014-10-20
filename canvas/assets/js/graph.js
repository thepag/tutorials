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
				chartHeight: 100,
				chartWidth: 100,
				elemPitch: 5,
				elemWidth: 3
			};

			for(var option in options) {
				if(options.hasOwnProperty(option)) {
					this.option[option] = options[option];
				}
			}

			this.target = typeof this.options.target === 'string' ? document.querySelector(this.options.target) : this.options.target;

			this.create();

			// Register the graph style as a type
			this.draw_type = {
				barchart: this.draw_barchart
			};
		},
		create: function() {
			// Create the canvas.
			this.canvas = document.createElement('canvas');
			this.canvas.width = this.options.width;
			this.canvas.height = this.options.height;
			// Add the canvas to the page.
			this.target.appendChild(this.canvas);
			// Get the 2d context of the canvas.
			this.context = this.canvas.getContext('2d');
		},
		draw: function(data) {
			this.clear();
			if(this.draw_type[this.options.type]) {
				this.draw_type[this.options.type].call(this, data);
			} else {
				console.log('draw: Graph type not found.');
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
			if(ctx) {
				ctx.fillStyle = '#000000';
				for(var i = 0, iLen = data.length; i < iLen; i++) {
					ctx.fillRect(
						i * opts.elemPitch,
						opts.chartHeight - data[i],
						opts.elemWidth,
						data[i]
					);
				}
			}
		}
	};

	return Graph;

}(document));
