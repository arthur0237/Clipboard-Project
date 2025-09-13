# Event listening is not exposed by operating system. -->> Imp. --->> Try to do some research.

# Initially we agreed upon polling the server as well as to the clipboard.

# Idea of polling to the server is still with us, 
# but we have dropped the idea of polling to the clipboard.
# We were polling to the clipboard in order 
# to get notified about the change on the clipboard...
# so that we can perform further actions. Like copy and paste.

# The idea of polling to the clipboard is dropped
# becoz we have shifted to - Keyboard shortcuts for copy and paste.

# Now how the flow will be ---->> like if "Ctrl+C" is pressed the 
# clipboard will be updated with the new content and 
# the python script will fetch and will upadate to the server.

# Now flow for pasting from clipboard will be like --->> 
# We will be having a python script that will be constantly polling to the server
# if any changes occur at the server it will 
# update our clipboard and
# when the user will hit "Ctrl+V" content will be available to the user from clipboard.

# *****Twist ----->>> After working for keyboard shortcuts. *****

    # Now we are back to the approach of polling to the clipboard.

# Why we are back ? -> becoz we can listen 
# the keyboard shortcuts for copy and paste but 
# we can't listen if the copy and paste 
# action is being done using mouse --
# --- at the OS level ----
# clipboard get updated(in case of copy) or content
# form clipboard is copied(in case of paste) but
# at low level thers is nothing like listening 
# the mouse like keyboard shortcuts.


# This is polling done to clipboard.
# As well as writing to file which 
# will be pushed to the S3 is also being done, 
# which will facilitate the user to paste the same 
# content to another device which is copied from ohter device.

import platform
from Clipboard_fetching.factory import Factory
# . used for relative import
from .upload_To_Server import upload 
import time

import os
file_path = os.path.join(os.path.dirname(__file__), "server.txt")

def write(content):
    with open(file_path, "w") as f:
        f.write(content)

def polling():
    t = ""
    operating_system = platform.system()
    ptr = Factory(operating_system)
    while(True):
        content = ptr.copyfromclipboard()
        if(t != content):

        #    how to know that these part should not be executed 
        #    ie:- how to know that the content on 
        #    clipboard is for paste action 
        #    not for copy action 

            t = content
            write(content)
            # here we need to import the function 
            # which will upload the file to S3
            upload()
        # polling after each 4 sec.
        time.sleep(4)

polling()
