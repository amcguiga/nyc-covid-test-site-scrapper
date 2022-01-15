import got from 'got'

const nycGovUrl = "https://www1.nyc.gov/site/coronavirus/get-tested/covid-19-testing.page"

const loadPage = async () => 
  (await got.get(nycGovUrl))

  export { loadPage }