import request from 'request';
import oauthSignature from 'oauth-signature';
import AuthStore from 'FF/stores/AuthStore';

let random = 0,
  now = 0;

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

export function generateSignature(){
  let httpMethod = 'GET',
    localRandom = getRandomInt(1, 1472603836),
    localNow = Math.round(Date.now()/1000),
    url = 'http://fantasysports.yahooapis.com/fantasy/v2/league/314.l.75102',
    parameters = {
      format: 'json',
      oauth_consumer_key: 'dj0yJmk9QUdublNzWFZaWGhSJmQ9WVdrOWJXcE1jR3h1Tm5VbWNHbzlNQS0tJnM9Y29uc3VtZXJzZWNyZXQmeD00Zg--',
      oauth_nonce: localRandom,
      oauth_signature_method: 'HMAC-SHA1',
      oauth_timestamp: localNow,
      oauth_token: AuthStore.getToken(), //store
      oauth_version: '1.0',
    },
    consumerSecret = '7dc2d7943d8bdbc9f85094213cddb6a99b1d3c1d',
    tokenSecret = AuthStore.getSecret(), //store

    // generates a RFC 3986 encoded, BASE64 encoded HMAC-SHA1 hash
    encodedSignature = oauthSignature.generate(httpMethod, url, parameters, consumerSecret, tokenSecret);
    // generates a BASE64 encode HMAC-SHA1 hash
    //signature = oauthSignature.generate(httpMethod, url, parameters, consumerSecret, tokenSecret,
        //{ encodeSignature: false});
  //console.log(Date.now());
  random = localRandom;
  now = localNow;
  return encodedSignature;
}

export function buildLeagueDataUrl() {
  let signature = generateSignature();
  return 'http://localhost:1337/fantasysports.yahooapis.com/fantasy/v2/league/314.l.75102?' +
    'format=json&' +
    'oauth_consumer_key=dj0yJmk9QUdublNzWFZaWGhSJmQ9WVdrOWJXcE1jR3h1Tm5VbWNHbzlNQS0tJnM9Y29uc3VtZXJzZWNyZXQmeD00Zg--&' +
    'oauth_nonce=' + random + '&' +
    'oauth_signature_method=HMAC-SHA1&' +
    'oauth_timestamp=' + now + '&' +
    'oauth_token=' + encodeURIComponent(AuthStore.getToken()) + '&' +
    'oauth_version=1.0&' +
    'oauth_signature=' + signature;
}

export function getLeagueData() {
  let options = {
    url: buildLeagueDataUrl(),
    headers: {
      'Origin': 'http://fantasysports.yahooapis.com/',
    },
  };
  request(options, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      console.log(body); // Show the HTML for the Google homepage.
    }
  });
}

// http://fantasysports.yahooapis.com/fantasy/v2/league/314.l.75102
// ?format=json
// &oauth_consumer_key=dj0yJmk9QUdublNzWFZaWGhSJmQ9WVdrOWJXcE1jR3h1Tm5VbWNHbzlNQS0tJnM9Y29uc3VtZXJzZWNyZXQmeD00Zg--
// &oauth_nonce=601399878
// &oauth_signature_method=HMAC-SHA1
// &oauth_timestamp=1472610034
// &oauth_token=A%3DQbsduvXG5xlBOqcGouiyJ0ZZGJmlZqZeRbqF.vBcfiWWb.BzFVhdx5NbJJj5M7pl3fuwn0_YwYFXwDu4fwIPOXf4YdU6OH_LkrFd7ZccmdM7EvoKcwH6do4ApVjWSpQA.iy3TLt2HPU6g1sKR.ALrlp6avIxSZI_kAo6Ymuc91qEeJAnRPCIlFjhk.6dYioqI.M7mnKgx0xXF81RHWfvvVqzzX9BGSP..qDp_tH8ikk2NmlHzw0ZB_gI7Ok39V5eXZQ9IvQ.RxNa6GmFVN_5Mb9uG3mS1Ciau3ZivUsn8xcPA8C2W8WVhpqtKKuU2gGZcymfMLTgJQnkXi1r6.UVmIAMv3G1Dju6gOPgKJ8uZUH7VYp_9IRi_.7gFQ7TV94xLCxVplru143Pw4p7Z5pZ4MIJvlJ1wk6jfXsAkXIdpJEVA6VPGLqDkGLxx2lxRq4fTzdwQGiNwYWrKTnv872ESWYfFDomJoloEXJiqbU_XZWa9ydMUH1Fym57bNIM_6M163syIzuO_Ee7RQrakQynMMyUL0WE5qQK23UjziVxtfL7DG1Ag30DYZ4BrPmbE41j7hm9P4t_c5IMYT5cePjfLtxXgzWSsrIersGs9jKc6x7oKJz9MZ3K6.XoatlGHyF8WV4EamPs9ilcHlpMjRnR.b.6bo4ZDwcF92nv7lJ3CuzERVC3Zo0MgW_av_qGsvODXltzPe0HPtAt1vwtBsW4z0HBpddO_azSShz0JE5jdAn.l9Gj3LLYM.s4kLiO42X4o_bDx._7u2eeHDCN.FFkxcZO35126DM9AY4_7G3jyAUERNhDe2PM98fxGEA3yN1xS_wXtTGdcpgQSwyJ4xE2HFlZvPN6h04wTBUh.YWRHVxSRtHB2e_6Rh7y
// &oauth_version=1.0
// &oauth_signature=%2B2Qc%2FF7Hp4FHVs80TyzZrn76IB0%3D