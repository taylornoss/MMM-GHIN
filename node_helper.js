/* Magic Mirror2
 * Module: GHIN
 *
 * By Taylor Nossokoff https://github.com/taylornoss
 * MIT Licensed.
 */
var NodeHelper = require('node_helper')
var Notifcations = require('./Notifications')
const Log = require('logger');
const Endpoints = require('./Endpoints')

module.exports = NodeHelper.create({
  start: function () {
    Log.log('MMM-GHIN: started')
  },

  createGUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
      .replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0,
          v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
  },

  // Log In User
  async GetUserToken(email, password) {
    Log.log('Getting user token...');
    const url = `${Endpoints.GHIN_API_ENDPOINT}${Endpoints.LOGIN_ENDPOINT}`;
    const user = {
      email_or_ghin: email,
      password: password,
      remember_me: "false"
    }
    const requestBody = {
      user: user,
      token: this.createGUID()
    }
    try {
      let bodyData = JSON.stringify(requestBody);
      Log.debug("Calling " + url + " with body: " + bodyData);
      const response = await fetch(url, {
        method: "POST",
        body: bodyData,
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        var errors = await response.json();
        Log.error(errors);
        throw new Error(`Response status: ${response.status}`);
      }
      const json = await response.json();
      return json.golfer_user.golfer_user_token;
    } catch (error) {
      Log.error(error.message);
    }
  },

  async GetScores(token, id) {
    Log.log('Getting user scores...');
    try {
      let scoreURL =`${Endpoints.GHIN_API_ENDPOINT}golfers/${id}/scores.json` //`https://api2.ghin.com/api/v1/golfers/{ID}/scores.json`;
      Log.debug("Calling " + scoreURL);
      let response = await fetch(scoreURL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
      });
      if (!response.ok) {
        var errors = await response.text();
        Log.error(errors);
        throw new Error(`Response status: ${response.status}`);
      }
      const json = await response.json();
      var returnData = new Object();
      returnData.scores = json.revision_scores.scores;
      returnData.stats = json.score_history_stats;
      return returnData;
    } catch (error) {
      Log.error(error.message);
    }
  },
  async GetGolfer(token, id) {
    Log.log('Getting user information...');
    try {
      const params = new URLSearchParams();
      params.append("golfer_id", id);
      params.append("page", 1);
      params.append("per_page", 1);
      params.append("status", "Active");

      let golferURL = `${Endpoints.GHIN_API_ENDPOINT}${Endpoints.SEARCH_GOLFERS_ENDPOINT}?${params}` //`https://api2.ghin.com/api/v1/golfers/search.json?${params}`;
      Log.debug("Calling " + golferURL);
      let response = await fetch(golferURL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
      });
      if (!response.ok) {
        var errors = await response.text();
        Log.error(errors);
        throw new Error(`Response status: ${response.status}`);
      }
      const json = await response.json();
      return json.golfers[0];
    } catch (error) {
      Log.error(error.message);
    }
  },

  // Subclass socketNotificationReceived received.
  socketNotificationReceived: function (notification, data) {
    if (notification === Notifcations.GET_TOKEN) {
      Log.log('GET_TOKEN REQUEST RECEIVED');
      this.GetUserToken(data.email, data.password).then((token) => this.sendSocketNotification(Notifcations.TOKEN_RECEIVED, token))
    }
    else if (notification === Notifcations.GET_HANDICAP) {
      Log.log('GET_HANDICAP REQUEST RECEIVED');
      this.GetUserToken(data.email, data.password).then((token) => {
        Log.log('TOKEN ACQUIRED');
        this.GetGolfer(token, data.id).then((user) => {
          Log.log('Completed retrieving user');
          Log.debug(JSON.stringify(user));
          this.sendSocketNotification(Notifcations.HANDICAP_RESULT, user)
        });
      });
    }
    else if (notification === Notifcations.GET_SCORES) {
      Log.log('GET_SCORES REQUEST RECEIVED');
      this.GetUserToken(data.email, data.password).then((token) => {
        Log.log('TOKEN ACQUIRED');
        this.GetScores(token, data.id).then((scores) => {
          Log.log('Completed retrieving scores');
          Log.debug(JSON.stringify(scores));
          this.sendSocketNotification(Notifcations.SCORE_RESULT, scores)
        });
      });
    }
    else if (notification === Notifcations.REFRESH_ALL) {
      Log.log('REFRESH_ALL REQUEST RECEIVED');
      this.GetUserToken(data.email, data.password).then((token) => {
        Log.log('TOKEN ACQUIRED');
        this.GetScores(token, data.id).then((scores) => {
          Log.log('Completed retrieving scores');
          Log.debug(JSON.stringify(scores));
          this.sendSocketNotification(Notifcations.SCORE_RESULT, scores)
        });
        this.GetGolfer(token, data.id).then((user) => {
          Log.log('Completed retrieving user');
          Log.debug(JSON.stringify(user));
          this.sendSocketNotification(Notifcations.HANDICAP_RESULT, user)
        });
      });
    }
  },
});