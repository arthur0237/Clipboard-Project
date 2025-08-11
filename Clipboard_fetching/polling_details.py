# Event listening is not exposed by operating system. -->> Imp. --->> Try to do some research.

# Initially we agreed upon polling the server as well as to the clipboard.

# Idea of polling to the server is still with us, buy we have dropped the idea of polling to the clipboard.
# We were polling to the clipboard in order to get notified about the change on the clipboard...so that we can perform further actions. Like copy and paste.

# The idea of polling to the clipboard is dropped becoz we have shifted to - Keyboard shortcuts for copy and paste.

# Now how the flow will be ---->> like if "Ctrl+C" is pressed the clipboard will be updated with the new content and the python script will fetch and will upadate to the server.

# Now flow for pasting from clipboard will be like --->> We will be having a python script that will be constantly polling to the server if any changes occur at the server it will update our clipboard and when the user will hit "Ctrl+V" content will be available to the user from clipboard.

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
            #BussinessLogic(t)
        # we need to make while loop sleep.
        time.sleep(4)


polling()
