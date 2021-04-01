const Endpoints = require('./Endpoints')

const addGHINNumber = (num) => {
  return `&ghinNumber=${num}`
}

const addAssociation = (association) => {
  return `&association=${association}`
}

const addClub = (club) => {
  return `&club=${club}`
}

const addLastName = (lastName) => {
  return `&lastName=${lastName}`
}

const addFirstName = (firstName) => {
  return `&firstName=${firstName}`
}

const addGender = (gender) => {
  return `&gender=M${gender}`
}

const addActiveOnly = (activeOnly) => {
  return `&activeOnly=${activeOnly}`
}

const addDateBegin = (dateBegin) => {
  return `&DateBegin=${dateBegin}`
}

const addGolferId = (golferId) => {
  return `golfer_id=${golferId}`
}

const addDateEnd = (dateEnd) => {
  return `&DateEnd=${dateEnd}`
}

const addRevCount = (revCount) => {
  return `&revCount=${revCount}`
}

const buildSearchGolfersRequest = (ghinNumber, lastName) => {
  let query = `${Endpoints.SEARCH_GOLFERS_ENDPOINT}?` + addGolferId(ghinNumber)

  if (lastName) {
    query += addLastName(lastName)
  }

  query += `&page=1&per_page=100`

  return query
}

const buildGolferRequest = (ghinNumber, association = 0, club = 0, lastName, firstName, gender, activeOnly) => {
  let query = `?` + addGHINNumber(ghinNumber) + addAssociation(association) + addClub(club)

  if (lastName) {
    query += addLastName(lastName)
  }

  if (firstName) {
    query += addFirstName(firstName)
  }

  if (gender) {
    query += addGender(gender)
  }

  if (activeOnly) {
    query += addActiveOnly(activeOnly)
  }

  // deprecated but still required in the request
  query += '&service=0&includeAffiliateClubs=false'

  return query
}

const buildHandicapHistoryRequest = (ghinNumber, dateBegin, dateEnd, revCount = 0) => {
  return (
    `golfers/${ghinNumber}/handicap_history.json?` + addDateBegin(dateBegin) + addDateEnd(dateEnd) + addRevCount(revCount)
  )
}

const buildScoresRequest = (ghinNumber) => {
  return (
    `golfers/${ghinNumber}/scores.json`
  )
}

const buildLookupGolfersRequest = (searchCriteria, stateCode = 'CA') => {
  let query = Endpoints.LOOKUP_GOLFERS_ENDPOINT + `?status=Active&from_ghin=true&per_page=25&sorting_criteria=full_name&order=asc&page=1&state=${stateCode}`

  if (isNaN) {
    query += addLastName(searchCriteria)
  } else {
    query += addGolferId(searchCriteria)
  }

  return query
}

exports.buildGolferRequest = buildGolferRequest
exports.buildHandicapHistoryRequest = buildHandicapHistoryRequest
exports.buildSearchGolfersRequest = buildSearchGolfersRequest
exports.buildLookupGolfersRequest = buildLookupGolfersRequest
exports.buildScoresRequest = buildScoresRequest