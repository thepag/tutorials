/* Promises
 */

var P = (function() {

	var json_promise, template_promise;

	return {

		init: function() {
			var self = this;
			json_promise = self.getJSON('story.json').then(function(json) {
				console.log("json: ", json);
				return self.json = json;
			}).then(function(json) {
				template_promise = self.get(json.template).then(function(html) {
					console.log("html:\n", html);
					for(key in json.default) {
						html = html.replace('{' + key + '}', json.default[key]);
					}
					console.log("html:\n", html);
				});
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
		}
	};

}());

window.addEventListener('load', function() {
	P.init();
}, false);
