from .base1 import ClipboardClass
import win32clipboard
import Polling_Upload_Download.polling_To_Clipboard_and_writing_To_File as clip_module

class WindowsClass(ClipboardClass):
    def copyfromclipboard(self):
        # print("Copying from Windows clipboard...")
        try:
            win32clipboard.OpenClipboard()
            data = win32clipboard.GetClipboardData()
            win32clipboard.CloseClipboard()
            return data
        except Exception as e:
            print(f"Error copying from clipboard: {e}")
            return None   
            
    def pastetoclipboard(self,str):
        # print(f"Pasting '{str}' to Windows clipboard...") 
        try:
            win32clipboard.OpenClipboard()
            win32clipboard.EmptyClipboard()
            win32clipboard.SetClipboardText(str)
            # assigning the same value to "t" that is one the clipboard
            clip_module.t = str
            win32clipboard.CloseClipboard()
            return "Success"
        except Exception as e:
            print(f"Error pasting to clipboard: {e}")
            win32clipboard.CloseClipboard()
            return None

