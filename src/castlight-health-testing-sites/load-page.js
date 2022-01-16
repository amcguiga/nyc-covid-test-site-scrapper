import got from 'got'

const castlightPrefix = "https://my.castlighthealth.com"
const castlightUrl = "https://my.castlighthealth.com/corona-virus-testing-sites/data/result.php?lat=40.7595044&long=-73.9271644&state_lat_long=NY&from=NYCgov&testkitexpanded=false&guidelines=1&get_exact_zipcode=11106&for_which_id=&_v=31"
const headers = {
  "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
  "Accept-Encoding": "gzip, deflate, br",
  "Accept-Language": "en-US,en-GB;q=0.9,en;q=0.8",
  "Host": "my.castlighthealth.com",
  "sec-ch-ua": " Not;A Brand\";v=\"99\", \"Google Chrome\";v=\"97\", \"Chromium\";v=\"97\"",
  "sec-ch-ua-mobile": "?0",
  "sec-ch-ua-platform": "macOS",
  "Sec-Fetch-Dest": "document",
  "Sec-Fetch-Mode": "navigate",
  "Sec-Fetch-Site": "none",
  "Sec-Fetch-User": "?1",
  "Upgrade-Insecure-Requests": "1",
  "Connection": "keep-alive",
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.121 Safari/537.36"
}

const loadPage = async () => {
  console.log(`loading from ${castlightUrl}`)
  let page = await got(castlightUrl, { headers })
  console.log(`page loaded`)
  return page
}
  
export { loadPage }