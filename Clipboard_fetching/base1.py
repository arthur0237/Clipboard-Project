from  abc import ABC, abstractmethod
import platform

# abstract base class for clipboard operations
class ClipboardClass(ABC):
    @abstractmethod
    def copyfromclipboard(self):
        """Copy content from the clipboard."""
        pass

    @abstractmethod
    def pastetoclipboard(self, text):
        """Paste text to the clipboard."""
        pass

# Moved imports to the end to avoid circular import
if __name__ == "__main__":
    from factory import Factory
    operating_system = platform.system()
    ptr = Factory(operating_system)
    # Copying from clipboard
    ptr.copyfromclipboard()
    print(ptr.copyfromclipboard())
    # Pasting to clipboard
    ptr.pastetoclipboard("My name is Gurpreet Singh")  
    # Verifying the paste operation 
    print(ptr.copyfromclipboard())