from base1 import ClipboardClass
try:
    from AppKit import NSPasteboard, NSStringPboardType
except ImportError:
    print("AppKit not available - install with: pip install pyobjc-framework-Cocoa")

class MacOSClass(ClipboardClass):
    def copyfromclipboard(self):
        try:
            pb = NSPasteboard.generalPasteboard()
            content = pb.stringForType_(NSStringPboardType)
            print(f"Copied from macOS clipboard: '{content}'")
            return content
        except Exception as e:
            print(f"Error: {e}")
            return None
    
    def pastetoclipboard(self, text):
        try:
            pb = NSPasteboard.generalPasteboard()
            pb.clearContents()
            pb.setString_forType_(text, NSStringPboardType)
            print(f"Pasted '{text}' to macOS clipboard...")
        except Exception as e:
            print(f"Error: {e}")