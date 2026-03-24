# jetson-sprinkler
Web-based sprinkler control system for NVIDIA Jetson Nano developer kit.
Should work with Raspberry Pi as well, just replace ```Jetson.GPIO``` with ```RPi.GPIO```

## Features

- 🌐 **Web Interface** - Modern React-based UI for easy configuration
- 📅 **Automated Scheduling** - Create routines with custom schedules
- 🎯 **Drag & Drop** - Enable/disable routines with intuitive drag and drop
- 🌧️ **Rain Sensor Support** - Skip watering when rain is detected
- 🔐 **Authentication** - Secure access with JWT authentication
- 🐳 **Docker Ready** - Easy deployment with Docker Compose

## Quick Start

### Prerequisites

- NVIDIA Jetson Nano with Docker and Docker Compose installed
- Network connection to the Jetson Nano

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/vlaldis/jetson-sprinkler.git
   cd jetson-sprinkler
   ```

2. Start the application:
   ```bash
   docker-compose up -d
   ```

3. Access the web interface:
   - Open your browser and navigate to: `http://<jetson-ip>:5173`
   - Default credentials: `admin` / `admin`

## Documentation

📖 **[User Manual](USER_MANUAL.md)** - Complete guide for configuring valves and routines

📸 **[Screenshots](docs/SCREENSHOTS.md)** - Visual guide to the user interface

## Architecture

The system consists of three main components:

1. **Frontend** (React + Vite)
   - Modern web interface for configuration and control
   - Runs on port 5173

2. **Backend** (FastAPI)
   - REST API for managing valves and schedules
   - JWT authentication
   - APScheduler for automated routine execution
   - Runs on port 8000

3. **Firmware** (Python)
   - GPIO control for valve operation
   - Executes sprinkler routines
   - Rain sensor integration

## Configuration

### Timezone

Edit `docker-compose.yml` to set your timezone:
```yaml
environment:
  - TZ=Europe/Prague  # Change to your timezone
```

### Credentials

Change default credentials in `docker-compose.yml`:
```yaml
environment:
  - ADMIN_USERNAME=admin
  - ADMIN_PASSWORD=your_secure_password
```

## Manual Firmware Usage (Advanced)

If you want to run the firmware directly without the web interface:

1. Install packages:
   ```bash
   pip install -r firmware/requirements.txt
   ```

2. See help:
   ```bash
   python3 firmware -h
   ```

3. Test all valves for 10 seconds:
   ```bash
   python3 firmware -c firmware/src/valves.json -d 10 -r 1
   ```

## Technology Stack

- **Frontend:** React, TypeScript, Vite, TailwindCSS, shadcn/ui
- **Backend:** Python 3.6+, FastAPI, APScheduler, JWT
- **Hardware:** Jetson.GPIO for valve control
- **Deployment:** Docker, Docker Compose

## License

This project is open source and available for personal and educational use.

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.