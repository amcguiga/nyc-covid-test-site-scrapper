import got from 'got'

const castlightUrl = "https://my.castlighthealth.com/corona-virus-testing-sites/data/result.php?lat=40.7595044&long=-73.9271644&state_lat_long=NY&from=NYCgov&testkitexpanded=false&guidelines=1&get_exact_zipcode=11106&for_which_id=&_v=31"

const loadPage = async () => {
  console.log(`loading from ${castlightUrl}`)
  let page = await got.get(castlightUrl)
  console.log(`page loaded`)
  return page
}
  

  export { loadPage }