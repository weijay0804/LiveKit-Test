# check_ingress_state.py
import asyncio
import os

from dotenv import load_dotenv
from livekit.api import ListIngressRequest, LiveKitAPI

load_dotenv()

API_KEY = os.getenv("LIVEKIT_API_KEY", "")
API_SECRET = os.getenv("LIVEKIT_API_SECRET", "")
SERVER_URL = os.getenv("LIVEKIT_SERVER_URL", "wss://your-project.livekit.cloud")


async def main():
    async with LiveKitAPI(SERVER_URL, API_KEY, API_SECRET) as lk:
        resp = await lk.ingress.list_ingress(ListIngressRequest())
        for i in resp.items:
            if i.ingress_id != "IN_vt6dHqP2MTNi":
                continue
            st = i.state
            print("id:", i.ingress_id)
            print("type:", i.input_type, "room:", i.room_name, "identity:", i.participant_identity)
            if st:
                print("status:", st.status)  # e.g. ENDPOINT_PUBLISHED / ACTIVE / ERROR / ...
                print("error:", getattr(st, "error", ""))  # 若有錯會在這裡
                print("started_at:", getattr(st, "started_at", ""))
                print("updated_at:", getattr(st, "updated_at", ""))
            else:
                print("state: <empty>")


asyncio.run(main())
