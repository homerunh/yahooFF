import AppDispatcher from 'FF/common/AppDispatcher';
import AuthConstants from 'FF/actionConstants/AuthConstants';

export default {
  /**
   *
   */
  updateAuthToken(data) {
    AppDispatcher.handleAction({
      actionType: AuthConstants.AUTH_UPDATE_TOKEN,
      data: data,
    });
  },

  updateAuthSecret(data) {
    AppDispatcher.handleAction({
      actionType: AuthConstants.AUTH_UPDATE_SECRET,
      data: data,
    });
  },
};
