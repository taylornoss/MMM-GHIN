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
    updateInterval: (1000 * 60 * 60) * 6, //every 6 hours
    ghinNumber: 0,
    email: '',
    password: ''
  },
  scores: [],
  pending_scores: [],
  loaded: false,
  user: {},
  stats: {},

  getStyles: function () {
    return ['MMM-GHIN.css']
  },

  getScripts: function () {
    return ["modules/MMM-GHIN/bootstrap/js/bootstrap.min.js"];
  },
  getTemplate() {
    return `templates/${this.name}.njk`;
  },

  getTemplateData() {
    return {
      loaded: this.loaded,
      scores: this.scores,
      pending_scores: this.pending_scores,
      stats: this.stats,
      user: this.user,
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
    Log.debug("Called login");
    this.sendSocketNotification('MMM-GHIN-GET_TOKEN', { email: this.config.email, password: this.config.password, id: this.config.ghinNumber });
  },

  getHandicap: function () {
    this.sendSocketNotification('MMM-GHIN-GET_HANDICAP', { email: this.config.email, password: this.config.password, id: this.config.ghinNumber });
  },

  getScores: function () {
    Log.debug("Called getScores");
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
      Log.debug("USER INFO: " + JSON.stringify(payload));
      this.user = payload;
      this.updateDom()
    }
    else if (notification == "MMM-GHIN-TOKEN_RECEIVED") {
      Log.debug("TOKEN RECEIVED: " + payload);
      this.getScores(payload);
    }
    else if (notification == "MMM-GHIN-SCORE_RESULT") {
      Log.debug("SCORES RECEIVED: " + JSON.stringify(payload));
      this.scores = payload.scores;
      this.pending_scores = payload.pending_scores;
      this.stats = payload.stats;
      this.scores.forEach(score => {
        var front = 0;
        var back = 0;
        Log.debug(`You shot ${score.adjusted_gross_score} in ${score.number_of_played_holes} holes on ${score.played_at} at ${score.course_display_value} from the ${score.tee_name}`)
        score.hole_details.forEach(hole => {
          if(hole.hole_number <= 9){
            front += hole.adjusted_gross_score;
          }
          else{
            back += hole.adjusted_gross_score;
          }
          score.front_total = front;
          score.back_total = back;
        });
      });
       this.pending_scores.forEach(score => {
        var front = 0;
        var back = 0;
        Log.debug(`You shot ${score.adjusted_gross_score} in ${score.number_of_played_holes} holes on ${score.played_at} at ${score.course_display_value} from the ${score.tee_name}`)
        score.hole_details.forEach(hole => {
          if(hole.hole_number <= 9){
            front += hole.adjusted_gross_score;
          }
          else{
            back += hole.adjusted_gross_score;
          }
          score.front_total = front;
          score.back_total = back;
        });
      });
      this.loaded = true;
      this.updateDom();
    }
  },
})
