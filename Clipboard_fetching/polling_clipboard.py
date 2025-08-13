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

import platform
from factory import Factory
import time

def fun(s):
    print(s)

def polling():
    t = ""
    operating_system = platform.system()
    ptr = Factory(operating_system)
    while(True):
        s = ptr.copyfromclipboard()
        if(t != s):
            t = s
            fun(s)
            #BussinessLogic(t) - 
            # - logic that will throw the content to the server in case of copy('ctrl+c').
        # we need to make while loop sleep.
        time.sleep(4)

polling()
