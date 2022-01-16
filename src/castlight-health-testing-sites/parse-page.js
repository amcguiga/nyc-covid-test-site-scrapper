import { JSDOM } from 'jsdom'
import { testingSite, siteTestsAvailable, siteAddress, siteSchedule, siteTest } from '../testing-site.js'

const testingMatcher = new Map([
  ['rapid', { matches: ['rapid testing'] }],
  ['pcr', { matches: ['non-rapid testing'] }],
  ['saliva', { matches: ['saliva testing'] }],
  ['antibody', { matches: ['antibody'] }]
])

const costMatcher = new Map([
  ['free', { matches: ['free diagnostic testing'] }]
])

const visitMatcher = new Map([
  ['appointment', { matches: ['appointment required'] }]
])

const parsePage = (page) => {
  let dom = new JSDOM(page)

  let sites = dom.window.document.querySelectorAll('div.facility_wrapper > div.result_box')
  return Array.from(sites).map( site => {
    let name = site.getElementsByClassName('provider_url')[0]?.textContent
    let url = site.getElementsByClassName('provider_url')[0]?.href
    let locationType = site.getElementsByClassName('type-of-center')[0]?.textContent
    let googleMapUrl = site.getElementsByClassName('google-link')[0]?.children[0]?.href
    let rawAddress = site.querySelectorAll('img[alt="Icon pin"] ~ a')[0]?.textContent
    let phone = site.querySelectorAll('img[alt="Icon call"] ~ a')[0]?.textContent
    let schedules = Array.from(site.querySelectorAll('div.open_days > div')).map(day => {
      let dayName = day.getElementsByClassName('day-name')[0]?.textContent
      let hours = day.getElementsByClassName('open-day')[0]?.textContent
      let daySchedule = {
        name: dayName,
        hours: hours
      }
      return daySchedule
    })
    let mainTest = Array.from(site.querySelectorAll('div.rapid-testing-row > span')).map(test => test.textContent)
    let antibody = Array.from(site.querySelectorAll('div.anti-body-testing > img[alt="Antibody testing icon"] + span')).map(test => test.textContent)
    let info = Array.from(site.querySelectorAll('div.guidelines_text > span')).map(line => line.textContent)
    let cost = Array.from(site.querySelectorAll('div.cost-row > span')).map(line => line.textContent)
    let requirements = Array.from(site.querySelectorAll('div.checked-content > span')).map(line => line.textContent)

    let initialTestList = antibody.find((contents) => (contents.includes('Available'))) ? [{ testType: 'antibody', resultTimeline: 'unknown' }] : []
    let tests = mainTest.reduce((acc, test) => {
      let [testName, timeline] = test.split('Results in').map(part => part.trim())
      return Array.from(testingMatcher.entries()).reduce((acc1, [key, { matches }]) => {
        let matcher = new RegExp(`^${matches.join('|')}`)
        if (matcher.test(testName.toLowerCase()))
          return [...acc1, { testType: key, resultTimeline: timeline }]
        else 
          return acc1
      }, acc)
    }, initialTestList)
    let testsAvailable = siteTestsAvailable({ raw: [...mainTest, ...antibody], siteTests: tests })

    let [statePostal, neighborhood, ...lines] = rawAddress.split(',').map(part => part.trim()).reverse()
    let postal = statePostal?.match(/\d{5}/)[0]
    let address = siteAddress({
      raw: rawAddress,
      street: lines[0],
      neighborhood: neighborhood,
      postal: postal,
      googleMapUrl: googleMapUrl
    })

    let schedule = siteSchedule({ raw: schedules })

    let paymentType = cost.find((contents) => (contents.toLowerCase().includes('free diagnostic testing'))) ? 'free' : 'unknown'

    let visitOptions = requirements.find((contents) => (contents.toLowerCase().includes('appointment required'))) ? ['appointment'] : []
    
    return testingSite({
      name: name,
      providerType: 'private',
      locationType: locationType,
      testsAvailable: testsAvailable,
      address: address,
      schedule: schedule,
      paymentType: paymentType,
      visitOptions: visitOptions,
      info: info,
      url: url,
      phone: phone
    })
  })
}

export { parsePage }