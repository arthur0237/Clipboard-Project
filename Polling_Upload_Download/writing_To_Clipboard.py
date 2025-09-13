# here we are reading from the file 
# which is most recent uploaded file on S3 
# and writing to the clipboard so 
# that paste can be facilitated 

# Note:- python -m Polling_action.writing_To_Clipboard
# this command is need to be executed 
# from the root directory 
# ie:- of project in order to run this script 

# that's why two lines of code is written 
# which doesn't seems usual apart from import code 

from Clipboard_fetching.factory import Factory
import platform

import os
# This creates a full path to a 
# file named "server.txt" that resides
# in the same directory as where script.
# this piece of code make sure that python
# script always finds server.txt which is 
# just next to it no matter from where we 
# run the script.
file_path = os.path.join(os.path.dirname(__file__), "server.txt")

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

operating_system = platform.system()
ptr = Factory(operating_system)
ptr.pastetoclipboard(content)
