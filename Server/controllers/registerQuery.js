export function registerQuery(req, res) {
  const { queryId } = req.body; 
  //  In an Express.js server, req.body contains the data sent by the client (e.g., frontend, Python script) in the body of a POST request.
  if (!queryId) {
    return res.status(400).json({ error: 'Query ID is required' });
  }
  queryStore.set(queryId, { authenticated: false, token: null });
  // This line stores the queryId in an in-memory JavaScript Map called queryStore.
  res.sendStatus(200);
}