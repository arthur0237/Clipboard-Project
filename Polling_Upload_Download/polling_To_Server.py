# 1. need to poll from here
# 2. need to fetch the downloadURL.
# 3. needs to download the file from here or we can 
# trigger the download from anywhere else --- using the URL we will have


# Not of this file work --- but can be done here as well 
# we need to read the donwloaded file and needs to update the 
# clipboard with the content of the downloaded file.   


import time
import requests
import os

SERVER_URL = "http://localhost:5000/check-update"
SERVER_URL_2 = "http://localhost:5000/trigger"

def download_using_presigned_url(presigned_url, filename):

# requesting S3 for the file - 
# corresponding to - presigned_url
# stream = True ????
    response = requests.get(presigned_url, stream=True)

    if response.status_code == 200:

    # ******************************
 
# to keep inside the same directory 
# as python polling script

# must dig how things are working ?????????????
 
        save_path = os.path.join(os.getcwd(), filename)  
        with open(save_path, "wb") as f:
            for chunk in response.iter_content(chunk_size=8192):
                if chunk:
                    f.write(chunk)
        print(f"File downloaded successfully: {save_path}")

    # ******************************
    else:
        print(f"Failed to download file: {response.status_code}")

def poll_server():
    while True:
        try:
            response = requests.get(SERVER_URL)
            data = response.json()
            
            if data.get("newFile"):
                filename = data["fileName"]
                print(f"New file detected: {filename}")

                # Calling /trigger to get pre-signed URL
                trigger_res = requests.post(SERVER_URL_2, json={"fileName": filename})

                trigger_data = trigger_res.json()   # expecting something { "url": "..." }

            # now we will have the presigned-url 
            # for the most recent uploaded file to S3
                presigned_url = trigger_data.get("url")

                if presigned_url:
                    download_using_presigned_url(presigned_url, filename)
                else:
                    print("No presigned URL received from /trigger.")
            else:
                print("No new file...")

        except Exception as e:
            print(f"Error while polling: {e}")

        time.sleep(5)

if __name__ == "__main__":
    poll_server()
