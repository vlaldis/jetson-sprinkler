FROM node:20 AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

FROM nvcr.io/nvidia/l4t-base:r32.3.1
# Alternatively, if not running strictly on Jetson for dev, use: FROM python:3.9-slim

ENV uid=ubuntu \
    gid=gpio \
    gid_gpio=gid_gpio

# Avoid interactive prompts during apt-get install
ENV DEBIAN_FRONTEND=noninteractive

# Install OS-level dependencies for cryptography (Rust compiler needed for newer versions, or libffi-dev for older)
RUN apt-get update -y && \
    apt-get install -y apt-utils python3-pip git curl libffi-dev libssl-dev python3-dev && \
    rm -rf /var/lib/apt/lists/*

# Upgrade pip and install rust compiler for setuptools_rust (needed by cryptography)
RUN pip3 install --no-cache-dir --upgrade pip && \
    pip3 install --no-cache-dir setuptools setuptools_rust

WORKDIR /app

# Install backend dependencies
COPY backend/requirements.txt ./backend/
RUN pip3 install --no-cache-dir -r backend/requirements.txt

# Copy firmware
COPY firmware/ ./firmware/
RUN pip3 install --no-cache-dir -r firmware/requirements.txt

# Copy backend
COPY backend/ ./backend/

# Copy compiled frontend from builder
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

# Expose the API port
EXPOSE 8000

# Set environment variables for the FastAPI app
ENV VALVES_FILE=/app/firmware/src/valves.json
ENV SCHEDULES_FILE=/app/firmware/src/schedules.json

# Fix for Click/Uvicorn locale crash
ENV LC_ALL=C.UTF-8
ENV LANG=C.UTF-8

# Start the FastAPI server using Uvicorn
WORKDIR /app/backend
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
