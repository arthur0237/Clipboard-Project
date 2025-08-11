from pynput import keyboard
import os

# Server logic of copy and paste needs to brought here.

pressed_keys = set()

def on_press(key):
    pressed_keys.add(key)

    if keyboard.Key.cmd in pressed_keys and key == keyboard.KeyCode.from_char('c'):
        # Logic related to copy will come in action here.
        os._exit(0)  # Immediately kill script

    if keyboard.Key.cmd in pressed_keys and key == keyboard.KeyCode.from_char('v'):
        # Logic related to paste will come in action here.
        os._exit(0)  # Immediately kill script

def on_release(key):
    pressed_keys.discard(key)

with keyboard.Listener(on_press=on_press, on_release=on_release) as listener:
    listener.join()
