import passport from 'passport';

export function googleAuth(req, res, next){

  // Extracts the queryId from the query string of the request URL.
  const queryId = req.query.queryId;

  // To understand the next line :- 
// A session is data stored on the server, typically associated with a unique session ID.
// The session ID is often stored in a cookie on the client, so the server can retrieve the corresponding session data.
  req.session.queryId = queryId;  // Store for later in callback

  console.log("Stored queryId in session:", req.session.queryId);

  req.session.save(err => {
  if (err) {

      console.error('Failed to save session before redirect:', err);
    
      return res.status(500).send('Internal Server Error');
    }
  passport.authenticate('google', { 
    scope: ['email', 'profile'],
    // ????? - state is used to pass the queryId during the whole authentication process or OAuth flow.
    state : queryId 
  })(req, res, next);
});
}