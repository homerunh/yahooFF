import React, { Component } from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import MyButton from'FF/components/MyButton';
import AuthManager from 'FF/components/AuthManager';

import { //generateSignature,
  getLeagueTeamData,
  getLeagueScoreboard,
   } from 'FF/common/API';

export default class App extends Component {

  constructor(props) {
    super(props);

    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }

  hello() {
    console.log("helo!!");
  }

  // var a = $r.props.authData.getIn(['some_data', 'fantasy_content', 'league']).get(1).getIn(['teams'])
  // a.map( (value, key) => console.log('key:  ' + key + '\nvalue:  ' + value))
  //                                                                                         (id here)
  // $r.props.authData.getIn(['some_data', 'fantasy_content', 'league']).get(1).getIn(['teams', '0', 'team']).get(0).get(19).getIn(['managers']).get(0).getIn(['manager'])
  leagueTeamData() {
    getLeagueTeamData(2005);
  }

  scoreboard() {
    getLeagueScoreboard(2005, 1);
  }


  render() {

    return (
			<div>
				<h1>  Fantasy ! </h1>
        <MyButton className="btn add-btn" onClick={this.hello} message="print to console, helo!!!!"/>
        <AuthManager />
        <MyButton className="btn add-btn" onClick={this.leagueTeamData} message="Get Team Data"/>
        <MyButton className="btn add-btn" onClick={this.scoreboard} message="Get scoreboard Data"/>
			</div>
		);
  }
}
