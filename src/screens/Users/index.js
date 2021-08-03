import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Page from '../../components/Page';
import UserListing from '../../components/UserListing';
import { getAllUsersList } from '../../modules/actions/UserActions';
import Loader from '../../components/Loader';

const Users = () => {
  const dispatch = useDispatch();

  const {
    allUsersList: { loading, success },
  } = useSelector(({ user }) => user);

  useEffect(() => {
    if (!loading && !success) {
      dispatch(getAllUsersList({ limit: 10, offset: 0 }));
    }
  }, []);

  return (
    <Page title="USER MANAGEMENT - admin">
      {loading ? <Loader /> : <UserListing />}
    </Page>
  );
};
export default Users;
