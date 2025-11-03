import uuid
import os
import webbrowser
import asyncio
import aiohttp
import json
from dotenv import load_dotenv

load_dotenv()

class Key:
    def __init__(self):
        self.__path = "auth_token.txt"
        self.__keyValue = None

    async def __pollForKey(self, session_id):
        params = {"uuid": str(session_id)}
        async with aiohttp.ClientSession() as http_session:
            for _ in range(30):  # try for 90 seconds (30×3s - time gap between each poll is 3 seconds)
                await asyncio.sleep(3)
                async with http_session.get(os.getenv("BACKEND_URL_GETKEY"), params=params) as resp:
                    if resp.status == 200:
                        data = await resp.json()
                        token = data.get("token")
                        if token:
                            # Save token to file
                            with open(self.__path, "w") as file:
                                file.write(token)
                            self.__keyValue = token
                            print("Token received and saved successfully.")
                            return
            print("Timed out waiting for token. Please try signing in again.")

    async def __login(self):
        session_id = uuid.uuid4()
        auth_url = f"{os.getenv('BACKEND_URL_AUTHENTICATION')}?uuid={session_id}"
        
        # Open authentication link
        print(f"Opening authentication page: {auth_url}")
        webbrowser.open(auth_url)
        
        # Poll for token
        await self.__pollForKey(session_id)

    def __readTokenFromFile(self):
        with open(self.__path, "r") as file:
            return file.read().strip()

    async def initialize(self):
        if os.path.exists(self.__path):
            self.__keyValue = self.__readTokenFromFile()
        else:
            await self.__login()

    def getKeyValue(self):
        return self.__keyValue

