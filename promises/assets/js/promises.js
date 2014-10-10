/* Promises
 */

var P = (function(document) {

	var jsonPromise, chapterPromise; // chapterSequence;

	return {

		options: {
			url: 'assets/json/story.json'
		},

		init: function() {
			var self = this;

			jsonPromise = self.getJSON(self.options.url).then(function(json) {

				self.json = json;
				self.append('#title', json.title);

				// Take an array of promises and wait on them all
				return Promise.all(
					// Map our array of chapter urls to
					// an array of chapter html promises
					json.chapter.map(self.get)
				);

			}).then(function(chapters) {

				// Now we have the chapters html in order! Loop through...
				chapters.forEach(function(chapter) {
					// ...and add it to the page
					self.append('#story', self.mustache(chapter));
				})

				// And we're all done!
				self.append('#story', '<p><b>All done!</b></p>');
			}).catch(function(err) {
				// Catch any error that happened along the way
				self.append('#story', '<p><b>Argh, broken: ' + err.message + '</b></p>');
			}).then(function() {
				// Always hide the spinner
				document.querySelector('.spinner').style.display = 'none';
			});
		},

		init_style_seq: function() {
			var self = this;

			jsonPromise = self.getJSON(self.options.url).then(function(json) {

				self.json = json;
				self.append('#title', json.title);

				return json.chapter.reduce(function(sequence, chapterUrl) {
					// Once the last chapter's promise is done...
					return sequence.then(function() {
						// ...fetch the next chapter
						return self.get(chapterUrl);
					}).then(function(chapter) {
						// and add it to the page
						self.append('#story', self.mustache(chapter));
					});
				}, Promise.resolve());
			}).then(function() {
				// And we're all done!
				self.append('#story', '<p><b>All done!</b></p>');
			}).catch(function(err) {
				// Catch any error that happened along the way
				self.append('#story', '<p><b>Argh, broken: ' + err.message + '</b></p>');
			}).then(function() {
				// Always hide the spinner
				document.querySelector('.spinner').style.display = 'none';
			});
		},

		get: function(url) {

			// Return a new promise.
			return new Promise(function(resolve, reject) {

				// Do the usual XHR stuff
				var req = new XMLHttpRequest();
				req.open('GET', url);

				req.onload = function() {
					// This is called even on 404 etc
					// so check the status
					if (req.status == 200) {
						// Resolve the promise with the response text
						resolve(req.response);
					} else {
						// Otherwise reject with the status text
						// which will hopefully be a meaningful error
						reject(Error(req.statusText));
					}
				};

				// Handle network errors
				req.onerror = function() {
					reject(Error("Network Error"));
				};

				// Make the request
				req.send();
			});
		},

		getJSON: function(url) {
			return this.get(url).then(JSON.parse);
		},

		mustache: function(template) {
			if(this.json && this.json.mustache && typeof template === 'string') {
				for(var key in this.json.mustache) {
					template = template.replace('{' + key + '}', this.json.mustache[key]);
				}
			}
			return template;
		},

		append: function(target, html) {
			var elem = typeof target === 'string' ? document.querySelector(target) : target;
			var wrapper = document.createElement('section');
			wrapper.innerHTML = html;
			elem.appendChild(wrapper);
			return elem;
		}
	};

}(document));

window.addEventListener('load', function() {
	P.init();
}, false);
