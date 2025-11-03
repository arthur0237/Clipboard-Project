import { queryStore }from "../../services/storage.js";


//Python client polls this to get token
export function tokenAskey(req, res){
  const queryId = req.query.uuid;
  if (!queryId) return res.status(400).send("UUID is required.");

  if (queryStore.has(queryId)) {
    const storedData = queryStore.get(queryId);
    const token = storedData.token;
    queryStore.delete(queryId);
    return res.status(200).json({ token });
  }

  return res.status(404).json({ message: "Token not ready" });
}


 