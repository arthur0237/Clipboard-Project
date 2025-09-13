import requests

import os
filename = "server.txt"
file_path = os.path.join(os.path.dirname(__file__), "server.txt")

def upload():
    # Asking backend for presigned URL
    res = requests.get(
    "http://localhost:5000/get-upload-url",
    params={"filename": filename, "contentType": "text/plain"}
    )
    data = res.json()
    url = data["url"]
    
    # Uploading file to S3 using presigned-URL

    # a "PUT" request is being made 
    # in order to upload the file 

    # Read and get how the things are happening ?????????

    with open(file_path, "rb") as f:
        upload = requests.put(url, data=f, headers={"Content-Type": "text/plain"})

    if upload.status_code == 200:
        print("Upload successful!")
    else:
        print("Upload failed:", upload.text)


