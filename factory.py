def Factory(operating_system):
    if operating_system == "Windows":
        from windowsclass import WindowsClass    
        return WindowsClass()
    elif operating_system == "Linux":   # Linux/Ubuntu 
        from ubuntuclass import UbuntuClass
        return UbuntuClass()
    elif operating_system == "Darwin":  # macOS
        from macOSclass import MacOSClass
        return MacOSClass()
    else:
        raise ValueError(f"Unsupported operating system: {operating_system}")