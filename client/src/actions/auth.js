import axios from 'axios';
import { setAlert } from './alert';
import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL
} from './types';
import setAuthToken from '../utils/setAuthToken';

// Action to Register User
export const register =
  ({ name, email, password }) =>
  async (dispatch) => {
    // Variable to store the data sent to the database
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const body = JSON.stringify({ name, email, password });

    // Attempt to save data to the database
    try {
      const res = await axios.post('/api/users', body, config);

      dispatch({
        type: REGISTER_SUCCESS,
        payload: res.data
      });

      dispatch(loadUser());
    } catch (err) {
      const errors = err.response.data.errors;

      if (errors) {
        errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
      }

      dispatch({
        type: REGISTER_FAIL
      });
    }
  };

// Action to Login User
export const login = (email, password) => async (dispatch) => {
  // Variable to store the data sent to the database
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  const body = JSON.stringify({ email, password });

  // Attempt to save data to the database
  try {
    const res = await axios.post('/api/auth', body, config);

    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data
    });

    dispatch(loadUser());
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: LOGIN_FAIL
    });
  }
};

// Action to Load User
export const loadUser = () => async (dispatch) => {
  if (localStorage.token) {
    try {
      setAuthToken(localStorage.token);

      const res = await axios.get('/api/auth');

      dispatch({
        type: USER_LOADED,
        payload: res.data
      });
    } catch (err) {
      dispatch({
        type: AUTH_ERROR
      });
    }
  }
};
