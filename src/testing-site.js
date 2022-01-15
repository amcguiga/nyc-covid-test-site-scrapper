const testingSite = (name, providerType, locationType, testsAvailable, address, schedule, info, url, phone, updated) => 
  ({
    name: name,
    providerType: providerType,
    locationType: locationType,
    testsAvailable: siteTestsAvailable(testsAvailable.raw, testsAvailable.testType, testsAvailable.resultTimeline),
    address: siteAddress(address.raw, address.street, address.neighborhood, address.borough, address.postal, address.googleMapUrl, address.info),
    schedules: siteSchedule(schedule.raw, schedule.days),
    info: info,
    url: url,
    phone: phone,
    updated: updated,
  })

const siteTestsAvailable = (raw, testType, resultTimeline) => 
  ({
    raw: raw,
    testType: testType,
    resultTimeline: resultTimeline
  })

const siteAddress = (raw, street, neighborhood, borough, postal, googleMapUrl, info) => 
  ({
    raw: raw,
    street: street,
    neighborhood: neighborhood,
    borough: borough,
    postal: postal,
    googleMapUrl: googleMapUrl,
    info: info
  })

const siteSchedule = (raw, days) => 
  ({
    raw: raw,
    days: days.map(day => scheduleDay(day.date, day.start, day.end))
  })

const siteScheduleDay = (date, start, end) => 
  ({
    date: date,
    start: start,
    end: end
  })

module.exports = {
  testingSite: testingSite,
  siteTestsAvailable: siteTestsAvailable,
  siteAddress: siteAddress,
  siteSchedule: siteSchedule,
  siteScheduleDay: siteScheduleDay
}