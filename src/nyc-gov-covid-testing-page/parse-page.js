const { JSDOM } = require('jsdom')

const testingSite = (name, testsAvailable, street, neighborhood, dates, times, info) => 
({
  name: name,
  testsAvailable: testsAvailable,
  street: street,
  neighborhood: neighborhood,
  dates: dates,
  times: times,
  info: info
})

const parsePage = (page) => {
  let dom = new JSDOM(page)

  let sites = dom.window.document.getElementById('queens').children
  return Array.from(sites).map( site => {
    let [name, testsAvailable, street, neighborhood, dates, ...times] = site.textContent.split('\n').slice(0, -1)
    let info = Array.from(site.getElementsByTagName('i')).map(info => info.textContet)
    return testingSite(name, testsAvailable, street, neighborhood, dates, times, info)
  })
}

module.exports = parsePage