import React, { Component } from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import MyButton from'FF/components/MyButton';
import AuthManager from 'FF/components/AuthManager';

import { //generateSignature,
  buildLeagueDataUrl,
  getLeagueData,
   } from 'FF/common/API';

export default class App extends Component {

  constructor(props) {
    super(props);

    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }

  hello() {
    console.log("helo!!");
  }

  apiCall() {
    console.log(buildLeagueDataUrl()) ;
  }

  leageData() {
    getLeagueData();
  }


  render() {

    return (
			<div>
				<h1>  Fantasy ! </h1>
        <MyButton className="btn add-btn" onClick={this.hello} message="print to console, helo!!!!"/>
        <AuthManager />
        <MyButton className="btn add-btn" onClick={this.apiCall} message="print the signature"/>
        <MyButton className="btn add-btn" onClick={this.leageData} message="get data"/>
			</div>
		);
  }
}
