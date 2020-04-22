# jetson-sprinkler
Sprinkler system for NVIDIA Jetson Nano developer kit

## Introduction
My goal is to create simple sprinkler system (probably dockerized) which will be configured using web/mobile app.

Current architecture:
1. firmware (Python)
    - runs one time sprinkler routine based on configuration
    - working version available
0. crontab
    - triggers firmware at specific time
    - [currently] need to create manualy
0. backend (nodejs)
    - schedules crontab based on API calls
    - supplies FE current configuration/state/statistics/whatever
0. UI (React)
    - Used for some friendly configuration
    - far far future, but I hope to get there

## How to run
Install packages:
```
pip install -r firmware/requirements.txt
```

Run:
```
python3 firmware -h
```

## Weather from online sources
As I'm going to use rain sensor I don't planing to implement this feature.
Maybe I'll change my mind sometimes.

## Photos of my solution
... Comming soon ...