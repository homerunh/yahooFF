import React, { Component } from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

import {init} from 'FF/common/FluxIt';
import { CLIENT_ID2, REDIRECT_URI } from 'FF/common/StringConstants';

import AuthStore from 'FF/stores/AuthStore';
import AuthActions from 'FF/actions/AuthActions';

import MyButton from'FF/components/MyButton';

@init(() => {
  return {
    authToken: AuthStore.getToken(),
    authSecret: AuthStore.getSecret(),
    authData: AuthStore.getData(),
  };
}, [AuthStore])
export default class AuthManager extends Component {

  constructor(props) {
    super(props);

    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }

  saveCreds() {
    let queryParams = window.location.toString().split("?");
    if (queryParams.length > 1) {
      let tokenInfo = queryParams[1].split("&");
      console.log("oauth token: " + decodeURIComponent(tokenInfo[0].split("=")[1]) );
      AuthActions.updateAuthToken(decodeURIComponent(tokenInfo[0].split("=")[1]));
      console.log("secret: " + decodeURIComponent(tokenInfo[1].split("=")[1]));
      AuthActions.updateAuthSecret(decodeURIComponent(tokenInfo[1].split("=")[1]));
    }
  }

  render() {
    return (
      <div>
        <a href={`https://api.login.yahoo.com/oauth2/request_auth
          ?client_id=${CLIENT_ID2}&redirect_uri=${REDIRECT_URI}&response_type=code`} >AUTHENTICATE w/YAHOO</a>
        <MyButton className="btn add-btn" onClick={this.saveCreds} message="click to save creds"/>
      </div>
    );
  }
}
