const { JSDOM } = require('jsdom')

const testingSite = (name, url, locationType, googleMapUrl, address, phone, schedules, testing) => 
  ({
    name: name,
    url: url,
    locationType: locationType,
    googleMapUrl: googleMapUrl,
    address: address,
    phone: phone,
    schedules: schedules,
    testing: testing
  })

const parsePage = (page) => {
  let dom = new JSDOM(page)

  let sites = dom.window.document.querySelectorAll('div.facility_wrapper > div.result_box')
  return Array.from(sites).map( site => {
    let name = site.getElementsByClassName('provider_url')[0]?.textContent
    let url = site.getElementsByClassName('provider_url')[0]?.href
    let locationType = site.getElementsByClassName('type-of-center')[0]?.textContent
    let googleMapUrl = site.getElementsByClassName('google-link')[0]?.children[0]?.href
    let address = site.querySelectorAll('img[alt="Icon pin"] ~ a')[0]?.textContent
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
    return testingSite(name, url, locationType, googleMapUrl, address, phone, schedules, testing)
  })
}

module.exports = parsePage