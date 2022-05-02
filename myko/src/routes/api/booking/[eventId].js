// Register booking for user authenticated via Bearer token
export async function post({ params: { eventId }, request }) {
  const auth = request.headers.get('Authorization');

  // TODO can the userid be extracted directly from the access token?
  const userinfoResponse = await fetch('https://relationsinstitutet.eu.auth0.com/userinfo', {
    headers: {
      Authorization: auth,
    },
  });
  const userinfo = await userinfoResponse.json();
  console.log(userinfo.sub);
  console.log(`eventId: ${eventId}`);

  // TODO add user with id from `userinfo.sub` to event with id `eventId` in Sanity

  const data = {};
  if (data) {
    return {
      status: 200,
      body: data,
    };
  }

  return {
    status: 500,
    body: new Error('Internal Server Error'),
  };
}
