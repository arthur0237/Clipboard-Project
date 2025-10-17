// 🔹 Function  to handle Google login from Android

import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";

const oauthClient = new OAuth2Client(process.env.GOOGLE_WEB_CLIENT_ID);

export async function androidAuth(req, res) {
  const { id_token } = req.body;
  if (!id_token) {
    return res.status(400).json({ error: "Missing id_token" });
  }

  try {
    // Verify the ID token issued by Google for your Web client
    const ticket = await oauthClient.verifyIdToken({
      idToken: id_token,
      audience: process.env.GOOGLE_WEB_CLIENT_ID, // Must be your Web Client ID
    });

    const payload = ticket.getPayload(); // Contains email, sub, name, picture, etc.
    const email = payload?.email;
    if (!email) {
      return res.status(400).json({ error: "No email in id_token" });
    }
    // Issue your app JWT
    const appToken = jwt.sign(
      { email, device: "android", sub: payload.sub },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({ token: appToken, email });
  } catch (err) {
    return res.status(401).json({ error: "Invalid id_token" });
  }
}