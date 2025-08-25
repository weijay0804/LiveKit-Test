# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Package Management
這個專案的套件管理是使用 PDM，所以有關套件的安裝是使用 `pdm install ...`，不要直接更改 pyproject.toml

## Common Commands
- `pdm install` - Install all dependencies
- `pdm add <package>` - Add new dependency
- `python main.py` - Run the FastAPI server locally (default port 8000)
- `uvicorn main:app --host 0.0.0.0 --port 8000` - Alternative way to run the server
- `python create_ingress.py` - Create a new LiveKit ingress endpoint
- `python info.py` - Check ingress status and information
- `python delete.py` - List and delete ingress endpoints

## Project Architecture
This is a LiveKit-based real-time communication (RTC) application with the following structure:

### Core Components
1. **FastAPI Server** (`main.py`) - Main web application serving:
   - `/` - Viewer frontend (static/index.html)
   - `/mobile` - Mobile publisher frontend (static/index2.html) 
   - `/api/token` - Generate viewer tokens for LiveKit rooms
   - `/api/publisher-token` - Generate publisher tokens for mobile streaming

2. **LiveKit Management Scripts**:
   - `create_ingress.py` - Creates WHIP ingress endpoints for streaming
   - `info.py` - Lists and monitors ingress status
   - `delete.py` - Manages ingress cleanup

3. **Frontend** (`static/`):
   - `index.html` - Viewer interface with room management
   - `index2.html` - Mobile publisher interface
   - Service worker and manifest for PWA functionality

### Key Configuration
- Uses `.env` file for LiveKit credentials (API_KEY, API_SECRET, SERVER_URL)
- Default room name: "Drone-RTC-01"
- Supports both viewer and publisher token generation
- CORS enabled for cross-origin requests

### Dependencies
- `livekit` - Core LiveKit SDK
- `livekit-api` - LiveKit API client
- `fastapi` - Web framework
- `uvicorn` - ASGI server
- Audio processing: `faster-whisper`, `resampy`, `numpy`, `scipy`, `numba`
- Environment: `python-dotenv`

The application follows a microservice pattern with separate scripts for different LiveKit operations, centered around a FastAPI web server that provides both frontend interfaces and API endpoints for token generation.