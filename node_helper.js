/* Magic Mirror2
 * Module: GHIN
 *
 * By Clint Decker https://github.com/C-DECK
 * MIT Licensed.
 */
var NodeHelper = require('node_helper')
var GHINApi = require('./GHINApi/GHINApi')

module.exports = NodeHelper.create({
  start: function () {
    console.log('MMM-GHIN: started')
  },

  //Subclass socketNotificationReceived received.
  socketNotificationReceived: function (notification, ghinId) {
    if (notification === 'GET_HANDICAP') {
      GHINApi.getGolfer(ghinId).then((data) => this.sendSocketNotification('STOCKS_RESULT', data.value))
    }
  },
})
