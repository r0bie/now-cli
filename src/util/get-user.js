import fetch from 'node-fetch';
import debugFactory from 'debug';

const debug = debugFactory('now:sh:get-user');

const getUser = async ({ apiUrl, token }) => {
  debug('start');
  const url = `${apiUrl  }/www/user`;

  const headers = {
    Authorization: `Bearer ${token}`
  };

  debug('GET /www/user');
  let res;

  try {
    res = await fetch(url, { headers });
  } catch (err) {
    debug(`error fetching /www/user: $O`, err.stack);
    throw new Error(
      `An unexpected error occurred while trying to fetch your user information: ${err.message}`
    );
  }

  debug('parsing response from GET /www/user');
  let body;

  try {
    body = await res.json();
  } catch (err) {
    debug(
      `error parsing the response from /www/user as JSON – got %O`,
      err.stack
    );
    throw new Error(
      `An unexpected error occurred while trying to fetch your personal details: ${err.message}`
    );
  }

  if (body.error && body.error.code === 'forbidden') {
    const error = new Error('The specified token is not valid');
    error.code = 'not_authorized';
    throw error;
  }

  const { user } = body;

  // this is pretty much useless
  delete user.billingChecked;

  return user;
};

export default getUser;
