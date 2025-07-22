  # send_query.py

import requests
import time
import jwt
import webbrowser

query_id = "1234"  # Any unique string or UUID
server_url = "http://localhost:5000"

# Step 1: Send query to backend
requests.post(f"{server_url}/register-query", json={"queryId": query_id})

# Step 2: Open browser for Google Login 
webbrowser.open(f"{server_url}/auth/google?queryId={query_id}")

# Poll for auth completion
jwt_token = None

# function 1
def token_receiver(query_id):
    for _ in range(30):  # wait max ~30s
        time.sleep(1)
        response = requests.get(f"{server_url}/poll-auth?queryId={query_id}")
        if response.status_code == 200:
            jwt_token = response.json().get("token")
            break

# function 2 
def decoding_token():
    if jwt_token:
        print("✅ Authenticated! JWT token received.")
        print("JWT:", jwt_token)
        # Decode and print email
        decoded = jwt.decode(jwt_token, options={"verify_signature": False})
        print("User Email:", decoded.get("email"))
    else:
        print("❌ Timeout: User not authenticated.")
 