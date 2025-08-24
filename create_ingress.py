# create_ingress.py
import asyncio
import os

from dotenv import load_dotenv
from livekit.api import CreateIngressRequest, IngressInput, LiveKitAPI

load_dotenv()


API_KEY = os.getenv("LIVEKIT_API_KEY", "")
API_SECRET = os.getenv("LIVEKIT_API_SECRET", "")
SERVER_URL = os.getenv("LIVEKIT_SERVER_URL", "wss://your-project.livekit.cloud")


async def main():
    async with LiveKitAPI(SERVER_URL, API_KEY, API_SECRET) as lk:
        info = await lk.ingress.create_ingress(
            CreateIngressRequest(
                input_type=IngressInput.WHIP_INPUT,  # 或 WHIP_INPUT
                name="Drone-RTC-01",
                room_name="Drone-RTC-01",
                participant_identity="Drone-RTC-01",  # ★ 固定
            )
        )
        print(info)
        print("Push to:", f"{info.url}/{info.stream_key}")


asyncio.run(main())
