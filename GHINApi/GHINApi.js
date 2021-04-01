const RequestBuilder = require('./RequestBuilder')
const Endpoints = require('./Endpoints')
const axios = require('axios')

let currentUser = null

const apiClient = axios.create({
  baseURL: Endpoints.GHIN_API_ENDPOINT,
  responseType: 'json',
  headers: {
    'Content-Type': 'application/json',
    'accept': 'application/json'
  }
})

// Try catch wrapper for basic api calls
const callTryCatch = async (fn, ...args) => {
  try {
    const response = await fn(...args)
    return response.data
  } catch (err) {
    if (err && err.response) {
      return err.response.data
    }

    throw err
  }
}

const loginUser = async (email, password) => {
  try {
    const response = await apiClient.post(Endpoints.LOGIN_ENDPOINT, {
      user: {
        email,
        password,
        remember_me: true
      }
    })
    currentUser = response.data.user

    apiClient.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`
    return response.status
  } catch (err) {
    console.log(err)
    if (err && err.response) {
      return err.response.data
    }

    throw err
  }
}

const getGolfer = async (ghinNumber) => {
  return callTryCatch(apiClient.get, '/FindGolfer.json' + RequestBuilder.buildGolferRequest(ghinNumber))
}

const getDates = () => {
  const today = new Date()
  let day = today.getDate()
  let month = today.getMonth() + 1
  const year = today.getFullYear()
  const year2 = today.getFullYear() - 1

  if (day < 10) {
    day = '0' + day
  }

  if (month < 10) {
    month = '0' + month
  }

  const date_end = month + '-' + day + '-' + year
  const date_start = month + '-' + day + '-' + year2

  return {
    date_end,
    date_start,
  }
}

const getHandicapHistory = async (ghinNumber) => {
  const dates = getDates()
  return callTryCatch(apiClient.get, RequestBuilder.buildHandicapHistoryRequest(ghinNumber, dates.date_start, dates.date_end))
}

const searchGolfers = async (ghinNumber, lastName) => {
  return callTryCatch(apiClient.get, RequestBuilder.buildSearchGolfersRequest(ghinNumber, lastName))
}

const searchCurrentGolfer = async (ghinNumber) => {
  if (currentUser == null) {
    return Promise.reject('No user session')
  }

  return callTryCatch(apiClient.get, RequestBuilder.buildSearchGolfersRequest(ghinNumber, currentUser.last_name))
}

const getFollowedGolfers = async (ghinNumber) => {
  return callTryCatch(apiClient.get, `${Endpoints.FOLLOWED_GOLFERS_ENDPOINT}${ghinNumber}.json`)
}

const lookupGolfers = async (searchCriteria) => {
  return callTryCatch(apiClient.get, RequestBuilder.buildLookupGolfersRequest(searchCriteria))
}

const getScores = async (ghinNumber) => {
  return callTryCatch(apiClient.get, RequestBuilder.buildScoresRequest(ghinNumber))
}

exports.getHandicapHistory = getHandicapHistory
exports.getGolfer = getGolfer
exports.loginUser = loginUser
exports.searchCurrentGolfer = searchCurrentGolfer
exports.searchGolfers = searchGolfers
exports.getFollowedGolfers = getFollowedGolfers
exports.lookupGolfers = lookupGolfers
exports.getScores = getScores