from base1 import ClipboardClass
import tkinter as tk

class MacOSClass(ClipboardClass):
    def copyfromclipboard():
        # print("Copying from MacOS clipboard...")
        try:
            root = tk.Tk()
            root.withdraw()
            data = root.clipboard_get()
            root.destroy()
            return data
        except Exception as e:
            print(f"Error copying from clipboard: {e}")
            return None
    
    def pastetoclipboard(str):
        # print(f"Pasting '{str}' to MacOS clipboard...") 
        try:
            root = tk.Tk()
            root.withdraw()
            root.clipboard_clear()
            root.clipboard_append(str)
            root.update()  # Ensure the clipboard is updated
            root.destroy()
            return "Success"
        except Exception as e:
            print(f"Error pasting to clipboard: {e}")
            root.destroy()
            return None