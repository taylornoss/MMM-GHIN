/* Magic Mirror2
 * Module: GHIN
 *
 * By Taylor Nossokoff https://github.com/taylornoss
 * MIT Licensed.
 */
Module.register('MMM-GHIN', {
  handicap: 0.0,
  // Default module config.
  defaults: {
    updateInterval: (1000 * 60 * 60), //every hour
    ghinNumber: 0,
    email: '',
    password: ''
  },
  scores: [],
  loaded : false,

  getStyles: function () {
    return ['MMM-GHIN.css']
  },

  getTemplate() {
    return `templates/${this.name}.njk`;
  },

  getTemplateData() {
    return {
      loaded: this.loaded,
      scores: this.scores,
      handicap: this.handicap,    
      fns: { translate: this.translate.bind(this) }
    };
  },
  start: function () {
    Log.info('Starting module: ' + this.name)
    this.updateAll();
    setInterval(() => {
      console.log("Refreshing MMM-GHIN data...");
      this.updateAll();
  }, this.config.updateInterval);
  },

   loginUser: function () {
    Log.info("Called login");
    this.sendSocketNotification('MMM-GHIN-GET_TOKEN', { email: this.config.email, password: this.config.password, id: this.config.ghinNumber });
  },

  getHandicap: function () {
    this.sendSocketNotification('MMM-GHIN-GET_HANDICAP', { email: this.config.email, password: this.config.password, id: this.config.ghinNumber });
  },

  getScores: function () {
    Log.info("Called getScores");
    this.sendSocketNotification('MMM-GHIN-GET_SCORES', { email: this.config.email, password: this.config.password, id: this.config.ghinNumber });
  },

  updateAll: function () {
    this.sendSocketNotification('MMM-GHIN-REFRESH_ALL', { email: this.config.email, password: this.config.password, id: this.config.ghinNumber });
  },

  // Subclass socketNotificationReceived received.
  socketNotificationReceived: function (notification, payload) {
    // Login worked and we can now make proper requests
    Log.info("MMM-GHIN received: " + notification);
    if (notification === 'MMM-GHIN-LOGIN_SUCCESS') {
      this.getHandicap()

    } else if (notification === 'MMM-GHIN-HANDICAP_RESULT') {
      console.log("USER INFO: " + JSON.stringify(payload));
      this.handicap = payload.hi_value
      this.updateDom()
    }
    else if (notification == "MMM-GHIN-TOKEN_RECEIVED") {
      console.log("TOKEN RECEIVED: " + payload);
      this.getScores(payload);
    }
    else if (notification == "MMM-GHIN-SCORE_RESULT") {
      console.log("SCORES RECEIVED: " + JSON.stringify(payload));
      this.scores = payload.scores;
      this.stats = payload.stats;
      this.scores.forEach(score => {
        console.log(`You shot ${score.adjusted_gross_score} in ${score.number_of_played_holes} holes on ${score.played_at} at ${score.course_display_value} from the ${score.tee_name}`)
      });
      this.loaded = true;
      this.updateDom();
    }
  },
})
