const testingSite = ({ name, providerType, locationType, testsAvailable, address, schedule, info, url, phone, updated }) => 
  ({
    name: name,
    providerType: providerType,
    locationType: locationType,
    testsAvailable: siteTestsAvailable({ raw: testsAvailable.raw, siteTests: testsAvailable.siteTests }),
    address: siteAddress({ 
      raw: address.raw, 
      street: address.street, 
      neighborhood: 
      address.neighborhood, 
      borough: address.borough, 
      postal: address.postal, 
      googleMapUrl: address.googleMapUrl, 
      info: address.info
    }),
    schedules: siteSchedule({ raw: schedule.raw, days: schedule.days }),
    info: info,
    url: url,
    phone: phone,
    updated: updated,
  })

const siteTestsAvailable = ({ raw, siteTests }) => 
  ({
    raw: raw,
    siteTests: siteTests?.map(test => siteTest({ testType: test.testType, resultTimeline: test.resultTimeline }))
  })

const siteTest = ({ testType, resultTimeline }) =>
  ({
    testType: testType,
    resultTimeline: resultTimeline
  })

const siteAddress = ({ raw, street, neighborhood, borough, postal, googleMapUrl, info }) => 
  ({
    raw: raw,
    street: street,
    neighborhood: neighborhood,
    borough: borough,
    postal: postal,
    googleMapUrl: googleMapUrl,
    info: info
  })

const siteSchedule = ({ raw, days }) => 
  ({
    raw: raw,
    days: days?.map(day => scheduleDay({ date: day.date, start: day.start, end: day.end }))
  })

const siteScheduleDay = ({ date, start, end }) => 
  ({
    date: date,
    start: start,
    end: end
  })

export {
  testingSite,
  siteTestsAvailable,
  siteAddress,
  siteSchedule,
  siteScheduleDay,
  siteTest
}