import os
import sys
import subprocess
import logging
from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.cron import CronTrigger
from app.storage import get_schedules, get_valves
import pytz
from datetime import datetime

logger = logging.getLogger(__name__)

# Setup paths to existing firmware
# In Docker container, firmware is at /app/firmware
FIRMWARE_DIR = "/app/firmware"
MAIN_SCRIPT = os.path.join(FIRMWARE_DIR, "__main__.py")

# Get local timezone from environment or use system default
try:
    tz_name = os.environ.get('TZ', 'Europe/Prague')
    LOCAL_TZ = pytz.timezone(tz_name)
    logger.info(f"Using timezone: {tz_name}")
except:
    LOCAL_TZ = pytz.timezone('UTC')
    logger.warning("Failed to load timezone, using UTC")

scheduler = BackgroundScheduler(timezone=LOCAL_TZ)

def run_sprinkler_routine(valve_ids, duration, rounds):
    """
    Executes the original firmware script via subprocess.
    """
    logger.info(f"Starting sprinkler routine: valves={valve_ids}, duration={duration}, rounds={rounds}")
    try:
        # Path to valves.json in Docker container
        valves_config = "/app/firmware/src/valves.json"
        
        cmd = [
            sys.executable, MAIN_SCRIPT, 
            "-c", valves_config,
            "-r", str(rounds), 
            "-d", str(duration)
        ]
        
        if valve_ids:
            cmd.extend(["-v"] + [str(v) for v in valve_ids])
            
        # Run asynchronously
        subprocess.Popen(cmd, cwd=FIRMWARE_DIR)
        logger.info("Sprinkler routine started successfully.")
    except Exception as e:
        logger.error(f"Failed to start sprinkler routine: {e}")

def reload_jobs():
    """
    Reads schedules.json and configures APScheduler jobs.
    """
    scheduler.remove_all_jobs()
    schedules = get_schedules()
    
    # Map typical string days to cron days
    # Example "Mo Tu We" -> "mon,tue,wed"
    day_map = {
        "Mo": "mon", "Tu": "tue", "We": "wed", "Th": "thu",
        "Fr": "fri", "Sa": "sat", "Su": "sun"
    }

    for idx, schedule in enumerate(schedules):
        try:
            # Parse start time (e.g. "05:00")
            hour, minute = schedule.get("start_time", "05:00").split(":")
            
            # Parse days
            routine_days = schedule.get("routine", "Mo Tu We Th Fr Sa Su")
            cron_days = ",".join([day_map.get(d, "mon") for d in routine_days.split() if d in day_map])
            
            trigger = CronTrigger(
                day_of_week=cron_days,
                hour=int(hour),
                minute=int(minute),
                timezone=LOCAL_TZ
            )
            
            scheduler.add_job(
                run_sprinkler_routine,
                trigger=trigger,
                args=[schedule.get("valve_ids"), schedule.get("duration", 900), schedule.get("rounds", 2)],
                id=f"schedule_{idx}",
                name=f"Routine {schedule.get('name', idx)}",
                replace_existing=True
            )
            logger.info(f"Loaded schedule: {schedule} -> {cron_days} at {hour}:{minute}")
        except Exception as e:
            logger.error(f"Failed to parse schedule {schedule}: {e}")

def start_scheduler():
    reload_jobs()
    scheduler.start()
    logger.info("Scheduler started.")

def stop_scheduler():
    scheduler.shutdown()
    logger.info("Scheduler stopped.")
