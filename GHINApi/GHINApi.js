import { GOLFER_SEARCH_ENDPOINT } from "./Constants"
import { buildGolferRequest, buildHandicapHistoryRequest } from './RequestBuilder'
const axios = require('axios')

const apiClient = axios.create({
  baseURL: GOLFER_SEARCH_ENDPOINT,
  responseType: 'json',
  headers: {
    'Content-Type': 'application/json'
  }
});

export const getGolfer = async (ghinNumber) => {
  try {
    const response = await apiClient.get('/FindGolfer.json' + buildGolferRequest(ghinNumber));
    return response.data
  } catch (err) {
    if (err && err.response) {
      return err.response.data
    }
    
    throw err
  }
};

const getDates = () => {
  const today = new Date()
  const day = today.getDate()
  const month = today.getMonth() + 1
  const year = today.getFullYear()
  const year2 = today.getFullYear() - 1

  if (day < 10) {
    day = '0' + day
  }

  if (month < 10) {
    month = '0' + month
  }

  const date_end = (month + '-' + day + '-' + year)
  const date_start = (month + '-' + day + '-' + year2)

  return {
    date_end,
    date_start
  }
}

export const getHandicapHistory = async (ghinNumber) => {
  try {
    const dates = getDates()
    const response = await apiClient.get(`HandicapHistory.json` + buildHandicapHistoryRequest(ghinNumber, dates.date_start, dates.date_end))
    return response.data
  } catch (err) {
    if (err && err.response) {
      return err.response.data
    }
    
    throw err;
  }
}