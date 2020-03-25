import json
import time

from valve import Valve
# from sprinkler import Sprinkler


def load_valves(file="valves.json"):
    with open(file) as json_file:
        return [Valve(valve) for valve in json.load(json_file)]


def run():
    pass
    # valves = load_valves()
    # sprinkler = Sprinkler(valves)
    # sprinkler.run()


def test():
    valves = load_valves()
    master = next((valve for valve in valves if valve.master), valves[0])
    master.open()
    for valve in valves:
        if valve == master:
            continue
        valve.open()
        time.sleep(2000)
        valve.close()

    master.close()
