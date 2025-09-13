def Factory(operating_system):
    if operating_system == "Windows":
        # . indicates the relative import
        # done when we try to run the scripts 
        # from project root directory 
        # where this function is imported.
        # Imported this function into 
        # writing_To_Clipboard.py and writing_To_File.py
        from .windowsclass import WindowsClass    
        return WindowsClass()
    elif operating_system == "Linux":   # Linux/Ubuntu 
        from .ubuntuclass import UbuntuClass
        return UbuntuClass()
    elif operating_system == "Darwin":  # macOS
        from .macOSclass import MacOSClass
        return MacOSClass()
    else:
        raise ValueError(f"Unsupported operating system: {operating_system}")