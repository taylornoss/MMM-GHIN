Module.register('MMM-NFL', {
  // Default module config.
	defaults: {
        updateInterval: 1000 * 60, // every minute
		initialLoadDelay: 0,
		animationSpeed: 1000 * 0.25,
  },
  
  // Define start sequence.
	start: function() {
        Log.info("Starting module: " + this.name);
        // Loop infinitely
		this.loop();
  },
  
  getDom: function() {
		var wrapper = document.createElement("div");

		// if user supplied message text in its module config, use it
		if(this.config.hasOwnProperty("message")){
			// using text from module config block in config.js
			wrapper.innerHTML = this.config.message;
		}
		else{
		// use hard coded text
			wrapper.innerHTML = "Hello world!";
		}

		// pass the created content back to MM to add to DOM.
		return wrapper;
	},
})