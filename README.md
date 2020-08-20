# jetson-sprinkler
Simple sprinkler system for NVIDIA Jetson Nano developer kit.
Should work with raspberry as well, just replace ```Jetson.GPIO``` with ```RPi.GPIO```

## Introduction
Current architecture:
1. firmware (Python)
    - runs one time sprinkler routine based on configuration
    - working version available
0. crontab
    - triggers firmware at specific time
    - [currently] need to create manualy

## How to run
1. Install packages:
    ```
    pip install -r firmware/requirements.txt
    ```

0. See help:
    ```
    python3 firmware -h
    ```
0. Configure valves in ```valves.json```:
    ```
    [
        {
            "id": 0,  // [required] valves are sorted by id and opened in the order
            "master": true,  // [optional] master valve is opened at start of routine and closed on the end
            "enabled": false,  // [optional] if false, valve is ignored during routine
            "gpio": 40,  // [required] gpio for opening valve
            "active": "high",  // [required] gpio value for opening of valve
            "filterCleanup": true  // [optional] open valve on water filter after each round to clean all dirt/sand 
        },
        {
            "id": 1,
            "gpio": 38,
            "active": "high"
        },

        ...
    ]
    ```

0. Test all valves for 10 seconds:
    ```
    /usr/bin/python3 /<gitpath>/jetson-sprinkler/firmware -c /<gitpath>/jetson-sprinkler/firmware/src/valves.json -d 10 -r 1
    ```

0. Create schedulle in cron:

    Each Monday and Thursday at 4:00am do two rounds for valves 1, 2, 3, 4 for 15 minutes
    ```
    0 4 * * 1,4 <username> /usr/bin/python3 /<gitpath>/jetson-sprinkler/firmware -c /<gitpath>/jetson-sprinkler/firmware/src/valves.json -d 900 -r 2 -v 1 2 3 4
    ```

## Weather from online sources
I'm using rain sensor and don't plan to implement this feature.
Maybe I'll change my mind sometimes.

## Photos of my solution
... Comming soon ...