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
  },

  getStyles: function () {
    return ['MMM-GHIN.css']
  },

  start: function () {
    Log.info('Starting module: ' + this.name)
    this.getHandicap()
    this.scheduleUpdate()
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

  getHandicap: function () {
    this.sendSocketNotification('GET_HANDICAP', this.config.ghinNumber)
  },

  socketNotificationReceived: function (notification, payload) {
    if (notification === 'HANDICAP_RESULT') {
      this.handicap = payload
      this.updateDom()
    }
  },
})
