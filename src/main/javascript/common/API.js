import request from 'request';
import oauthSignature from 'oauth-signature';
import { fromJS } from 'immutable';
import AuthStore from 'FF/stores/AuthStore';
import { urlify, join } from 'FF/utils/APIUtils';
import AuthActions from 'FF/actions/AuthActions';
import { BASE_API_URL, CLIENT_ID, CLIENT_SECRET, LEAGUE_LOOKUP } from 'FF/common/StringConstants';

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

function generateSignature(verb, url, random, timestamp ){
  let httpMethod = verb,
    parameters = {
      format: 'json',
      oauth_consumer_key: CLIENT_ID,
      oauth_nonce: random,
      oauth_signature_method: 'HMAC-SHA1',
      oauth_timestamp: timestamp,
      oauth_token: AuthStore.getToken(),
      oauth_version: '1.0',
    },
    consumerSecret = CLIENT_SECRET,
    tokenSecret = AuthStore.getSecret(),

    // generates a RFC 3986 encoded, BASE64 encoded HMAC-SHA1 hash
    encodedSignature = oauthSignature.generate(httpMethod, url, parameters, consumerSecret, tokenSecret);
    // generates a BASE64 encode HMAC-SHA1 hash
    //signature = oauthSignature.generate(httpMethod, url, parameters, consumerSecret, tokenSecret,
        //{ encodeSignature: false});
  return encodedSignature;
}

function buildQueryString(random, timestamp, signature) {
  return join('&',
    'format=json',
    'oauth_consumer_key=' + CLIENT_ID,
    'oauth_nonce=' + random,
    'oauth_signature_method=HMAC-SHA1',
    'oauth_timestamp=' + timestamp,
    'oauth_token=' + encodeURIComponent(AuthStore.getToken()),
    'oauth_version=1.0',
    'oauth_signature=' + signature
    );
}

function buildRequest(verb, url) {
  let someRandomInt = getRandomInt(1, 1472603836),
    now = Math.round(Date.now()/1000),
    signature = generateSignature(verb, 'http://' + url, someRandomInt, now);

  return urlify('http://localhost:1337', url) + "?" + buildQueryString(someRandomInt, now, signature);
}

// *****************************  League URLs ******************************************************* //

/**
 * Build URL to get League Metadata:
 * Includes league key, id, name, url, draft status, number of teams, and current week information.
 *
 * URI: /fantasy/v2/league/{league_key}/metadata
 * Example: http://fantasysports.yahooapis.com/fantasy/v2/league/223.l.431/metadata
 *
 */
function buildLeagueMetadataUrl(year) {
  return urlify(BASE_API_URL, 'league', LEAGUE_LOOKUP[year], 'metadata');
}

/**
 * Build URL to get League Settings:
 * League settings. For instance, draft type, scoring type, roster positions, stat categories and modifiers, divisions.
 *
 * URI: /fantasy/v2/league/{league_key}/settings
 * Example: http://fantasysports.yahooapis.com/fantasy/v2/league/223.l.431/settings
 */
function buildLeagueSettingsUrl(year) {
  return urlify(BASE_API_URL, 'league', LEAGUE_LOOKUP[year], 'settings');
}

/**
 * Build URL to get League Standings:
 * Ranking of teams within the league. Accepts Teams as a sub-resource, and includes team_standings data by default beneath the teams
 *
 * URI: /fantasy/v2/league/{league_key}/standings
 * Example: http://fantasysports.yahooapis.com/fantasy/v2/league/223.l.431/standings
 */
function buildLeagueStandingsUrl (year) {
  return urlify(BASE_API_URL, 'league', LEAGUE_LOOKUP[year], 'standings');
}

/**
 * Build URL to get League Scoreboard:
 * League scoreboard. Accepts Matchups as a sub-resource, which in turn accept Teams as a sub-resource. Includes team_stats data by default.
 *
 * URI: current week    -->  /fantasy/v2/league/{league_key}/scoreboard
 *      particular week -->  /fantasy/v2/league/{league_key}/scoreboard;week={week}
 *
 * Example: http://fantasysports.yahooapis.com/fantasy/v2/league/223.l.431/scoreboard;week=2
 */
function buildLeagueScoreboardUrl(year, week = 'curent') {
  return urlify(BASE_API_URL, 'league', LEAGUE_LOOKUP[year], 'scoreboard;week=' + week);
}

/**
 * Build URL to get League Teams:
 * All teams in the league.
 *
 * URI: /fantasy/v2/league/{league_key}/teams
 * Example: http://fantasysports.yahooapis.com/fantasy/v2/league/223.l.431/teams
 */
function buildLeagueTeamsUrl(year) {
  return urlify(BASE_API_URL, 'league', LEAGUE_LOOKUP[year], 'teams' );
}

/**
 * Build URL to get League Players:
 * The league's eligible players
 *
 * URI: /fantasy/v2/league/{league_key}/players
 * Example: http://fantasysports.yahooapis.com/fantasy/v2/league/223.l.431/players
 */
function buildLeaguePlayersUrl(year) {
  return urlify(BASE_API_URL, 'league', LEAGUE_LOOKUP[year], 'players');
}

/**
 * Build URL to get League Draft Results:
 * Draft results for all teams in the league.
 *
 * URI: /fantasy/v2/league/{league_key}/draftresults
 * Example: http://fantasysports.yahooapis.com/fantasy/v2/league/223.l.431/draftresults
 */
function buildLeagueDraftResultsUrl(year) {
  return urlify(BASE_API_URL, 'league', LEAGUE_LOOKUP[year], 'draftresults');
}

/**
 * Build URL to get League Tranactions:
 * League transactions -- adds, drops, and trades
 *
 * URI: /fantasy/v2/league/{league_key}/transactions
 * Example: http://fantasysports.yahooapis.com/fantasy/v2/league/223.l.431/transactions
 */
function buildLeagueTransactionUrl(year) {
  return urlify(BASE_API_URL, 'league', LEAGUE_LOOKUP[year], 'transactions');
}

// *****************************  Team URLs ******************************************************* //


/**
 * Build URL to get Team Metadata:
 * Includes team key, id, name, url, division ID, logos, and team manager information.
 *
 * URI: /fantasy/v2/team/{team_key}/metadata
 * Example: http://fantasysports.yahooapis.com/fantasy/v2/team/223.l.431.t.9/metadata
 */
function buildTeamMetadataUrl(teamId) {
  return urlify(BASE_API_URL, 'team', teamId, 'metadata');
}

/**
 * Build URL to get Team Stats for an entire season:
 * Team statistical data and points.
 *
 * URI: /fantasy/v2/team/{team_key}/stats
 * Example: http://fantasysports.yahooapis.com/fantasy/v2/team/223.l.431.t.9/stats
 */
function buildTeamStatsBySeasonUrl(teamId) {
  return urlify(BASE_API_URL, 'team', teamId, 'stats');
}

/**
 * Build URL to get Team Stats for a particular week in a season:
 * Team statistical data and points.
 *
 * URI: /fantasy/v2/team/{team_key}/stats;type=week;week={week}
 * Example: http://fantasysports.yahooapis.com/fantasy/v2/team/223.l.431.t.9/stats;type=week;week=2
 */
function buildTeamStatsByWeekUrl(teamId, week) {
  return urlify(BASE_API_URL, 'team', teamId, 'stats;type=week;week=' + week);
}

/**
 * Build URL to get Team Standings:
 * Team rank, wins, losses, ties, and winning percentage (as well as divisional data if applicable).
 *
 * URI: /fantasy/v2/team/{team_key}/standings
 * Example: http://fantasysports.yahooapis.com/fantasy/v2/team/223.l.431.t.9/standings
 */
function buildTeamStandingsUrl(teamId) {
  return urlify(BASE_API_URL, 'team', teamId, 'standings');
}

/**
 * Build URL to get Team Roster:
 * Team roster. Accepts a week parameter. Also accepts Players as a sub-resource (included by default)
 *
 * URI: /fantasy/v2/team/{team_key}/roster;week={week}
 * Example:  http://fantasysports.yahooapis.com/fantasy/v2/team/223.l.431.t.9/roster;week=2 - The week 2 roster for team 223.l.431.t.9
 */
function buildTeamRosterUrl(teamId, week) {
  return urlify(BASE_API_URL, 'team', teamId, 'roster;week=' + week);
}

/**
 * Build URL to get Team Draft Results:
 * List of players drafted by the team.
 *
 * URI: /fantasy/v2/team/{team_key}/draftresults
 * Example: http://fantasysports.yahooapis.com/fantasy/v2/team/223.l.431.t.9/draftresults
 */
function buildTeamDraftResultsUrl(teamId) {
  return urlify(BASE_API_URL, 'team', teamId, 'draftresults');
}

/**
 * Build URL to get Team Matchups:
 * All the matchups this team has scheduled (for H2H leagues).
 *
 * URI:  all matchups    --> /fantasy/v2/team/{team_key}/matchups
 *       particular week --> /fantasy/v2/team/{team_key}/matchups;weeks=1,3,6
 * Example: http://fantasysports.yahooapis.com/fantasy/v2/team/223.l.431.t.9/matchups;weeks=1,3,6
 */
function buildTeamMatchupsUrl(teamId) {
  return urlify(BASE_API_URL, 'team', teamId, 'matchups');
}


/**
 * Build URL to get Roster:
 *
 * URI: /fantasy/v2/team/{team_key}/roster
 * Example: http://fantasysports.yahooapis.com/fantasy/v2/team/223.l.431.t.9/roster/
 */
function buildRosterUrl(teamId) {
  return urlify(BASE_API_URL, 'team', teamId, 'roster');
}


/**
 * Build URL to get Roster Players:
 *
 *
 * URI: /fantasy/v2/team/{team_key}/roster/players
 * Example: http://fantasysports.yahooapis.com/fantasy/v2/team/223.l.431.t.9/roster/players
 */
function buildRosterPlayersUrl(teamId) {
  return urlify(BASE_API_URL, 'team', teamId, 'roster', 'players');
}


//player (nfl player)

//player metadata
/**
 * Build URL to get Player Metadata:
 * Includes player key, id, name, editorial information, image, eligible positions, etc.
 *
 * URI: /fantasy/v2/player/{player_key}/metadata
 * Example: http://fantasysports.yahooapis.com/fantasy/v2/player/223.p.5479 - Drew Brees's info in the 2009 season:
 */
function buildPlayerMetadataUrl(playerId) {
  return urlify(BASE_API_URL, 'player', playerId);
}

//player season stats
/**
 * Build URL to get Player Stats:
 * Player stats and points (if in a league context).
 *
 * URI: Season stats --> /fantasy/v2/player/{player_key}/stats
 *      Week Stats   --> /fantasy/v2/player/{player_key}/stats;type=week;week={week}
 * Example: http://fantasysports.yahooapis.com/fantasy/v2/player/223.p.5479/stats - Drew Brees's info and stats in the 2009 season
 */
function buildPlayerSeasonStatsUrl(playerId) {
  return urlify(BASE_API_URL, 'player', playerId, 'stats');
}

//player particular-week stats
/**
 * Build URL to get Player Stats:
 * Player stats and points (if in a league context).
 *
 * URI: Season stats --> /fantasy/v2/player/{player_key}/stats
 *      Week Stats   --> /fantasy/v2/player/{player_key}/stats;type=week;week={week}
 * Example: http://fantasysports.yahooapis.com/fantasy/v2/player/223.p.5479/stats;type=week;week=1 - Drew Brees's info and stats in the 2009 week 1
 */
function buildPlayerWeekStatsUrl(playerId, week) {
  return urlify(BASE_API_URL, 'player', playerId, 'stats;type=week;week=' + week);
}

//player ownership
/**
 * Build URL to get Player Ownership:
 * The player ownership status within a league (whether they're owned by a team, on waivers, or free agents). Only relevant within a league.
 *
 * URI: /fantasy/v2/league/{league_key}/players;player_keys={player_key}/ownership
 * Example: http://fantasysports.yahooapis.com/fantasy/v2/league/223.l.431/players;player_keys=223.p.5479/ownership
 */
function buildPlayerOwnershipUrl(year, playerId) {
  return urlify(BASE_API_URL, 'league', LEAGUE_LOOKUP[year], 'players;player_keys=' + playerId, 'ownership');
}

//player percent owned
/**
 * Build URL to get Player Percent Owned:
 * Data about ownership percentage of the player
 *
 * URI: /fantasy/v2/player/{player_key}/percent_owned
 * Example: http://fantasysports.yahooapis.com/fantasy/v2/player/223.p.5479/percent_owned
 */
function buildPlayerPercentOwned(playerId) {
  return urlify(BASE_API_URL, 'player', playerId, 'percent_owned');
}

//player draft analysis
/**
 * Build URL to get Player Draft Analysis:
 * Average pick, Average round and Percent Drafted.
 *
 * URI: /fantasy/v2/player/{player_key}/draft_analysis
 * Example: http://fantasysports.yahooapis.com/fantasy/v2/player/223.p.5479/draft_analysis
 */
function buildPlayerDraftAnalysis(playerId) {
  return urlify(BASE_API_URL, 'player', playerId, 'draft_analysis');
}


//

export function testAddTable() {
  request.post('http://localhost:3000/testDB', {form: {someKey: 'someValue'}});
}

//buildLeagueStandingsUrl
export function getLeagueStandings(year) {
  request(buildRequest('GET', buildLeagueStandingsUrl(year)), function(error, response, body){
    if(!error && response.statusCode === 200) {
      console.log(body);
      AuthActions.updateAuthData(fromJS(JSON.parse(body)));
    } else{
      console.log("error: " + error);
      console.log("body: " + body);
    }
  });
}

export function getLeagueTeamData(year) {

  request(buildRequest('GET', buildLeagueTeamsUrl(year)), function (error, response, body) {
    if (!error && response.statusCode === 200) {
      console.log(body);
      AuthActions.updateAuthData(fromJS(JSON.parse(body)));
    } else{
      console.log("error: " + error);
      console.log("body: " + body);
    }
  });
}

export function getLeagueScoreboard(year, week) {

  request(buildRequest('GET', buildLeagueScoreboardUrl(year, week)), function (error, response, body) {
    if (!error && response.statusCode === 200) {
      console.log(body);
      AuthActions.updateAuthData(fromJS(JSON.parse(body)));
    } else{
      console.log("error: " + error);
      console.log("body: " + body);
    }
  });
}