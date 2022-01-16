import got from 'got'
import { CookieJar } from 'tough-cookie'
import { promisify } from 'node:util'

const castlightPrefix = "https://my.castlighthealth.com"
const castlightUrl = "https://my.castlighthealth.com/corona-virus-testing-sites/data/result.php?lat=40.7595044&long=-73.9271644&state_lat_long=NY&from=NYCgov&testkitexpanded=false&guidelines=1&get_exact_zipcode=11106&for_which_id=&_v=31"
const castlightCookieString = "_ga=GA1.2.24012521.1641435233; rw_entry_url=https://www.castlighthealth.com/covid-19-resources/; rw_entry_url-p=https://www.castlighthealth.com/covid-19-resources/; rw_current_url=https://www.castlighthealth.com/covid-19-resources/; rw_current_url-p=https://www.castlighthealth.com/covid-19-resources/; rw_refer_url=https://www1.nyc.gov/; rw_refer_url-p=https://www1.nyc.gov/; rw_source=referral; rw_source-p=referral; rw_channel=www1.nyc; rw_channel-p=www1.nyc; _mkto_trk=id:598-XVD-020&token:_mch-castlighthealth.com-1641435234335-24650; OptanonConsent=isIABGlobal=false&datestamp=Wed+Jan+05+2022+21%3A13%3A54+GMT-0500+(Eastern+Standard+Time)&version=6.28.0&landingPath=https%3A%2F%2Fwww.castlighthealth.com%2Fcovid-19-resources%2F&groups=1%3A1; PHPSESSID=c20108936e39904b2fe5df6148c8a7d0; _gid=GA1.2.1351313667.1642284650; _hjSessionUser_1428874=eyJpZCI6ImNmZGRhOWI5LWNhMjctNTUxOS04OTBjLTExMzM1ZmQ4MDhmZSIsImNyZWF0ZWQiOjE2NDE0MzUyMzM3MzMsImV4aXN0aW5nIjp0cnVlfQ==; RT=\"z=1&dm=castlighthealth.com&si=iv1varcwa1i&ss=ky3kazpi&sl=0&tt=0\"; _abck=4A3B09164136175B7A6302D70826B3EB~-1~YAAQyfkxF5ZBdrR9AQAAS8o0ZAd8RSj/IdqAWqqDy5eToZPYr95SAJS4/SCM7XHTwXYoVgxQPWL1J12EI/VDOfkRjBEyMMWSGLjYhPJwL1C64Kl/y0DMBpq1A3Wko/mipMA9Nk2Nux+tOse8i81BiAQmhMlU6Rw5QfDmpdSr+tC55uCR0hSODQAZkfZSbRWyEhtXUw6qhIPBZTYgm5XFI7RTJSKRjsT9Jk+DusvqmaN61yinGJ7LTwqiKXva+gdG1c3C6RBum3YKiYMW160XxGgLAj07Jn5oKmTYJFyLPregIx5AoHINWYW0eS9FxzOojnwJvH36p0vMAp/dtDt4UD1MBI1T3CsrEXsJotveqgKJXeNIjWDEMH9LoNs3/KXy5U+eEQ8Hqg7ipIcAhqyDEbgFpw==~-1~-1~-1; ak_bmsc=96B302D9E215D1590B5F1FDA10B47C3B~000000000000000000000000000000~YAAQyfkxF5dBdrR9AQAAS8o0ZA66TWQd+M0iYDOWQjbegInOUjYiUAOWCRoMfAtEEXOlt34uA8oi9iRAGT0eRjRyvIw4JIOHYTTvzT82peLme4ukZ5ror8/PKeyzr7mME9o6iMpJB1FsDBN7BYbRU7Aojgvo6S4WIkCjZQjN4SFNBQxjdTZt9rcphGb4DALScjJwMCMuuexlRS5KL/ep0KdVNjHX4FVT+5FlUWyFTVA1jDmubQmLLkqMLjwXCDWRKp224/ReEazcy/GU6lyZQyq7GVduoO7Fj197B0GSCRysOPzQNdANYxPh6AQqg309GSvh4RSI8w8Os2PW8KG2GxCDuQHphhzpRkZrMStaPKsh5rbZ6BoEijL+cqANCi8Wydoke3k5F0A=; bm_sz=061D372B03084AA01AF6CB693D9DECBB~YAAQyfkxF5hBdrR9AQAAS8o0ZA6WLhHgHEKOtP+2t80UaSWxTF4a7Uc3Usc00a3R+VXa+1UkK2pQh7s4H8hubBBlEKccNVNZMPeXm8SAxBNVlvWpAgJLixoyedeIqLPPn64tBVkkZG9eyVXPleuVoX7+FoQJnlTPdqMcVEFl/SE5/NF/ykGRVHZze5YhWpBOagJO2xBY7OntJZ2vulSWp8KG86hY4jKwywLm6cwW1nBYVAxaxL7r3ZvhDDeE7hH5SRKA5xVBTtN0Qjye2gSH97w7PJ/KUKiDRqKfL5cSd278dOXqiSrQvRWVE10=~4604980~4469299; _gat=1; _gat_UA-163357883-1=1"
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
  "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36"
}

const loadPage = async () => {
  let cookieJar = new CookieJar()
  const setCookie = promisify(cookieJar.setCookie.bind(cookieJar))
  await setCookie(castlightCookieString, castlightPrefix)
  console.log(`loading from ${castlightUrl}`)
  let page = await got(castlightUrl, { cookieJar, headers })
  console.log(`page loaded`)
  return page
}
  

  export { loadPage }