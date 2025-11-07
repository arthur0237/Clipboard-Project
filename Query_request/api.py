import requests
from typing import Optional, Any, Dict
from key import Key

class Api:

    def __init__(self, base_url: str, key_instance: Optional[Key] = None):
        self.base_url = base_url.rstrip('/')
        self.key = key_instance or Key()

    def _get_jwt(self) -> str:
        # Using Key.getKeyValue() from Key class directly.
        if not hasattr(self.key, "getKeyValue"):
            raise AttributeError("Key instance must implement getKeyValue()")
        token = self.key.getKeyValue()
        if not token:
            raise RuntimeError("JWT not available. Call await key.initialize() or ensure auth_token.txt exists.")
        return token

    def _headers(self) -> Dict[str, str]:
        token = self._get_jwt()
        return {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}

    def get_upload_url(self, data: Optional[Dict[str, Any]] = None) -> requests.Response:
        return requests.post(f"{self.base_url}/get-upload-url", json=data or {}, headers=self._headers())

    def get_download_url(self, data: Optional[Dict[str, Any]] = None) -> requests.Response:
        return requests.post(f"{self.base_url}/get-download-url", json=data or {}, headers=self._headers())

    def check_update(self, params: Optional[Dict[str, Any]] = None) -> requests.Response:
        return requests.get(f"{self.base_url}/check-update", params=params or {}, headers=self._headers())

    def trigger(self, data: Optional[Dict[str, Any]] = None) -> requests.Response:
        return requests.post(f"{self.base_url}/trigger", json=data or {}, headers=self._headers())


