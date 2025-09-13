  # send_query.py

import requests
import time
import jwt
import webbrowser
import os

query_id = "1234"  # Any unique string or UUID
server_url = "http://localhost:5000"
token_file = "auth_token.txt"

# ******Approach before saving the token, locally on the sysytem*******

# # Step 1: Send query to backend
# requests.post(f"{server_url}/register-query", json={"queryId": query_id})
# # Step 2: Open browser for Google Login 
# webbrowser.open(f"{server_url}/auth/google?queryId={query_id}")

# **********************************************************

# Poll for auth completion
# jwt_token 

# function 1
def token_receiver(query_id):
    global jwt_token
    for _ in range(30):  # wait max ~30s
        time.sleep(1)
        response = requests.get(f"{server_url}/poll-auth?queryId={query_id}")
        if response.status_code == 200:
            jwt_token = response.json().get("token")
            with open(token_file, "w") as f:
                f.write(jwt_token)
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
 

# function 3
def authenticated_request():
    if not jwt_token:
        print("No JWT token available. Cannot make authenticated request.")
        return

    headers = {
        "Authorization": f"Bearer {jwt_token}"
    }

    response = requests.get(f"{server_url}/show-email", headers=headers)
    if response.status_code == 200:
        print("Made the successful authenticated request!")
    else:
        print("Access denied:")

# === Main flow ===

if os.path.exists(token_file):
    with open(token_file, "r") as f:
        jwt_token = f.read().strip()
    decoding_token()
    authenticated_request()
else:
    # register & open browser
    requests.post(f"{server_url}/register-query", json={"queryId": query_id})
    webbrowser.open(f"{server_url}/auth/google?queryId={query_id}")
    token_receiver(query_id)
    decoding_token()
    authenticated_request()
