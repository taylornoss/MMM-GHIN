var Notifcations = require('./Notifications')

/* Magic Mirror2
 * Module: GHIN
 *
 * By Clint Decker https://github.com/C-DECK
 * MIT Licensed.
 */
Module.register('MMM-NFL', {
  handicap: 0.0,
  // Default module config.
  defaults: {
    updateInterval: 1000 * 60,
    ghinNumber: 0,
    email: '',
    password: ''
  },

  getStyles: function () {
    return ['MMM-GHIN.css']
  },

  start: function () {
    Log.info('Starting module: ' + this.name)
    this.loginUser()
  },

  scheduleUpdate: function (delay) {
    var nextLoad = this.config.updateInterval
    if (typeof delay !== 'undefined' && delay >= 0) {
      nextLoad = delay
    }

    var self = this
    setInterval(function () {
      self.getHandicap()
    }, nextLoad)
  },

  getDom: function () {
    var wrapper = document.createElement('div')

    wrapper.innerHTML = `${this.handicap}`
    wrapper.className = 'handicap-score'

    // pass the created content back to MM to add to DOM.
    return wrapper
  },

  loginUser: function () {
    this.sendSocketNotification(Notifcations.LOGIN_USER, this.config.ghinNumber)
  },

  getHandicap: function () {
    this.sendSocketNotification(Notifcations.GET_HANDICAP, this.config.ghinNumber)
  },

  // Subclass socketNotificationReceived received.
  socketNotificationReceived: function (notification, payload) {
    // Login worked and we can now make proper requests
    if (notification === Notifcations.LOGIN_SUCCESS) {
      this.getHandicap()
      this.scheduleUpdate()
    } else if (notification === Notifcations.HANDICAP_RESULT) {
      this.handicap = payload
      this.updateDom()
    }
  },
})
