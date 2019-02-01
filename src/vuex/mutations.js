export const userStatus = (state, user) => {
  if (user) {
    state.currentUser = user;
    state.isLogin = true;
  } else if (user === null) {
    sessionStorage.setItem('userName', null);
    sessionStorage.setItem('userToken', '');
    state.currentUser = null;
    state.isLogin = false;
    state.token = '';
  }
};

export const userToken = (state,userToken) => {
  if (userToken) {
    state.token = userToken;
  } else {
    state.token = null;
  }
};

