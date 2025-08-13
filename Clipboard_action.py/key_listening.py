# Not moving with this approach.
# The approach of keyboard shortcuts.


import keyboard
import os
import time
import platform

import shortcuts_macOS

running = True 

# To terminate the listening process.
def terminate():
    global running 
    print("Quitting...")
    keyboard.unhook_all_hotkeys() 
    keyboard.unhook_all() 
    running = False
    os._exit(0)  # Immediately terminate the process

def pasteToserver():
    print("I have to paste the new content from clipboard to server")
    # This will be basically the python script.
    terminate()

def copyFromserver():
    print("I have to keep on polling the server and update the clipboard of user if the new content comes to the server")
    # Task to be done by python script.
    terminate()


operating_system = platform.system()

if operating_system == "Windows" or operating_system == "Linux":
    # To copy 
    for hotkey in ['ctrl+c', 'ctrl+shift+c']:
        keyboard.add_hotkey(hotkey, pasteToserver)
    # To paste
    for hotkey in ['ctrl+v', 'ctrl+shift+v']:
        keyboard.add_hotkey(hotkey, copyFromserver)
else:
    # macOs logic for listening the keyboard shortcuts.
    shortcuts_macOS.start_listener() 


while running:
    time.sleep(0.1)

