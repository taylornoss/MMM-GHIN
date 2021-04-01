/* Magic Mirror2
 * Module: GHIN
 *
 * By Clint Decker https://github.com/C-DECK
 * MIT Licensed.
 */
var NodeHelper = require('node_helper')
var GHINApi = require('./GHINApi/GHINApi')
var Notifcations = require('./Notifications')

const SUCCESS_STATUS_CODE = 200

module.exports = NodeHelper.create({
  start: function () {
    console.log('MMM-GHIN: started')
  },

  getLoginResponse: function (data) {
    console.log(data)
    if (data == SUCCESS_STATUS_CODE) {
      this.sendSocketNotification(Notifcations.LOGIN_SUCCESS)
    } else {
      this.sendSocketNotification(Notifcations.LOGIN_FAILURE)
    }
  },

  // Subclass socketNotificationReceived received.
  socketNotificationReceived: function (notification, data) {
    console.log(notification)
    if (notification === Notifcations.LOGIN_USER) {
      GHINApi.loginUser(data.email, data.password).then((data) => this.getLoginResponse(data))
    } else if (notification === Notifcations.GET_HANDICAP) {
      GHINApi.searchCurrentGolfer(data).then((data) => this.sendSocketNotification(Notifcations.HANDICAP_RESULT, data))
    }
  },
})
