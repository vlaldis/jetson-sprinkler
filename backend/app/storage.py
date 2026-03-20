import json
import os
from typing import List

# Setup paths
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FIRMWARE_DIR = os.path.join(os.path.dirname(BASE_DIR), "firmware", "src")
VALVES_FILE = os.environ.get("VALVES_FILE", os.path.join(FIRMWARE_DIR, "valves.json"))
SCHEDULES_FILE = os.environ.get("SCHEDULES_FILE", os.path.join(FIRMWARE_DIR, "schedules.json"))

def read_json_file(filepath):
    if not os.path.exists(filepath):
        return []
    with open(filepath, 'r') as f:
        return json.load(f)

def write_json_file(filepath, data):
    # Ensure directory exists
    os.makedirs(os.path.dirname(filepath), exist_ok=True)
    with open(filepath, 'w') as f:
        json.dump(data, f, indent=2)

def get_valves():
    return read_json_file(VALVES_FILE)

def save_valves(valves_data):
    write_json_file(VALVES_FILE, valves_data)

def get_schedules():
    return read_json_file(SCHEDULES_FILE)

def save_schedules(schedules_data):
    write_json_file(SCHEDULES_FILE, schedules_data)
