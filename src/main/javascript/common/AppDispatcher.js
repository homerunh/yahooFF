import { Dispatcher } from 'flux';
import { EventEmitter } from 'events';

EventEmitter.defaultMaxListeners = 0;

class AppDispatcher extends Dispatcher {
  handleAction(action) {
    this.dispatch({
      source: 'VIEW_ACTION',
      action: action,
    });
  }
}

export default new AppDispatcher();
