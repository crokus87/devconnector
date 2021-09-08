import React, { Fragment, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import Alert from './components/layout/Alert';
import Dashboard from './components/dashboard/Dashboard';
import ProfileForm from './components/profile-forms/ProfileForm';
import PrivateRoute from './components/routing/PrivateRoute';
import store from './store';
import setAuthToken from './utils/setAuthToken';
import { loadUser } from './actions/auth';
import { LOGOUT } from './actions/types';
import './App.css';

const App = () => {
  useEffect(() => {
    // Check if user is logged in
    if (localStorage.token) {
      setAuthToken(localStorage.token);
    }

    store.dispatch(loadUser());

    // log user out of all tabs if they log out in one tab
    window.addEventListener('storage', () => {
      if (!localStorage.token) {
        store.dispatch({ type: LOGOUT });
      }
    });
  }, []);

  return (
    <Provider store={store}>
      <Router>
        <Fragment>
          <Navbar />
          <Route exact path="/" component={Landing} />
          <section className="container">
            <Alert />
            <Switch>
              <Route exact path="/register" component={Register} />
              <Route exact path="/login" component={Login} />
              <PrivateRoute exact path="/dashboard" component={Dashboard} />
              <PrivateRoute
                exact
                path="/create-profile"
                component={ProfileForm}
              />
              <PrivateRoute
                exact
                path="/edit-profile"
                component={ProfileForm}
              />
            </Switch>
          </section>
        </Fragment>
      </Router>
    </Provider>
  );
};

export default App;
