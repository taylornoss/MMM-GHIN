import { USERNAME, PASSWORD } from './Constants'

const addLogin = () => {
  return `username=${USERNAME}&password=${PASSWORD}`
}

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

const addDateEnd = (dateEnd) => {
  return `&DateEnd=${dateEnd}`
}

const addRevCount = (revCount) => {
  return `&revCount=${revCount}`
}

export function buildGolferRequest(ghinNumber, association = 0, club = 0, lastName, firstName, gender, activeOnly) {
  let query = `?` + addLogin() + addGHINNumber(ghinNumber) + addAssociation(association) + addClub(club)

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

export function buildHandicapHistoryRequest(ghinNumber, dateBegin, dateEnd, revCount = 0) {
  return (
    `?` + addLogin() + addGHINNumber(ghinNumber) + addDateBegin(dateBegin) + addDateEnd(dateEnd) + addRevCount(revCount)
  )
}
