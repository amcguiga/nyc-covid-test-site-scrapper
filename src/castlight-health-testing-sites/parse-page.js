import { JSDOM } from 'jsdom'
import { testingSite, siteTestsAvailable, siteAddress, siteSchedule } from '../testing-site.js'

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
    let testing = [...mainTest, ...antibody]

    let [statePostal, neighborhood, ...lines] = rawAddress.split(',').map(part => part.trim()).reverse()
    let postal = statePostal?.match(/\d{5}/)[0]
    let address = siteAddress(rawAddress, lines[0], neighborhood, undefined, postal, googleMapUrl, undefined)
    let schedule = siteSchedule(schedules)
    let tests = siteTestsAvailable(testing)
    return testingSite(name, 'private', locationType, tests, address, schedule, undefined, url, phone)
  })
}

export { parsePage }