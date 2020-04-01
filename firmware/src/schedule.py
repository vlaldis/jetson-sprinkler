DAILY = "daily"
DAYS = [
    "monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"
]


def weekdays(routine):
    return list(range(0, 7)) if routine == DAILY \
        else sorted([DAYS.index(day) for d in routine.lower().split() for day in DAYS if day.startswith(d)])


class Schedule(object):
    def __init__(self, valve_ids, routine, start_time, duration=900, rounds=2):
        self.valve_ids = valve_ids
        self.routine = weekdays(routine)
        self.start_time = start_time
        self.duration = duration
        self.rounds = rounds


