import {
  useEffect,
  useReducer
} from 'react';

import dataReducer, { SET_USERS, SET_MATCHES } from '../reducers/dataReducer';

import axios from 'axios';

const useApplicationData = () => {
  const [state, dispatch] = useReducer(dataReducer, {
    users: [],
    matches: [],
    loading: true,
  });

  useEffect(() => {
    // Promise.all([
    //   axios({ method: 'GET', url: '/api/users', })
    // ])
    //   .then(({
    //     data
    //   }) => {
    //     console.log("inside useApplicationData! ", data);
    //     dispatch({
    //       type: SET_USERS,
    //       users: data
    //     });
    //   })
    //   .catch((err) => console.log(err));
    Promise.all([
      axios({ method: 'GET', url: '/api/users' }),
      axios({ method: 'GET', url: '/api/matches' })
    ])
      .then(all => {
        dispatch({ type: SET_USERS, users: all[0].data });
        dispatch({ type: SET_MATCHES, matches: all[1].data });
      })
      .catch((err) => console.log(err));
  }, []);

  return {
    state,
    dispatch,
  };
};

export default useApplicationData;