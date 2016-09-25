import AppDispatcher from 'FF/common/AppDispatcher';
import immutable from 'immutable';
import installDevTools from 'immutable-devtools';
installDevTools(immutable);
import { Map } from 'immutable';

import FluxStore from 'FF/stores/FluxStore';
import AuthConstants from 'FF/actionConstants/AuthConstants';

let _token = '';
let _secret = '';
let _data = Map({
  some_data: Map(),
});

class _AuthStore extends FluxStore {
  getToken() {
    return _token;
  }

  getSecret() {
    return _secret;
  }

  getData() {
    return _data;
  }
}

let AuthStore = new _AuthStore();
export default AuthStore;

AppDispatcher.register(payload => {
  const action = payload.action;
  switch(action.actionType) {
    case AuthConstants.AUTH_UPDATE_TOKEN:
      _token = action.data;
      break;
    case AuthConstants.AUTH_UPDATE_SECRET:
      _secret = action.data;
      break;
    case AuthConstants.AUTH_UPDATE_DATA:
      _data = _data.set('some_data', action.data);
      break;
    default:
      return;
  }
  AuthStore.emitChange();
});
