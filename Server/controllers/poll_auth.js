import { queryStore } from "../services/storage.js";

export function pollAuth(req, res){

  // Extracting the queryId from the query string of request URL.
  const queryId = req.query.queryId;

 // Add validation
  if (!queryId) {
    return res.status(400).json({ error: 'Query ID is required' });
  }

  // entry holds the record (from queryStore) for a given queryId.
  // it will be something like - 
  // {
//   authenticated: true or false,
//   token: 'JWT_TOKEN_STRING'
//   }

// Try to access the token from Redis ????? 
// ***********What is the use of async and await here ?????***********

  const entry = queryStore.get(queryId);
//  ----> just to debug
  // console.log(entry);   

  // in conditional bracket whether the entry exist or not as well whether the user is authenticated or not is being checked.
  if (entry?.authenticated) {
    return res.json({"token": entry.token });
  }
  res.sendStatus(204); // not yet authenticated
}