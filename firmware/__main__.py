import time
import json

import argparse
import Jetson.GPIO as GPIO

from src.valve import Valve

parser = argparse.ArgumentParser(description='Sprinkler execution for NVIDIA Jetson Nano.')
parser.add_argument('-v', '--valves', metavar='1 3 4', type=int, nargs='+', default=-1,
                    help='IDs of valves to run. Default -1 (all).')
parser.add_argument('-c', '--valves-configuration', metavar='FILE.json', type=str, default='/valves.json',
                    help='Json file with configuration of valves. Default /valves.json.')
parser.add_argument('-r', '--rounds', metavar='N', type=int, default=2,
                    help='How many times should be the routine repeated. Default 2.')
parser.add_argument('-d', '--duration', metavar='N', type=int, default=900,
                    help='Run each <--valves> for <-d> seconds. Default 900.')
parser.add_argument('--round-delay', metavar='N', type=int, default=2,
                    help='Delay between opening valves. In seconds. Default 2.')

args = parser.parse_args()


def load_valves(file='/valves.json'):
    with open(file) as json_file:
        return [Valve(**valve) for valve in json.load(json_file)]


def init():
    GPIO.setmode(GPIO.BOARD)


if __name__ == '__main__':
    print("Sprinkler routine started {}".format(time.asctime()))
    print(args.__dict__)

    init()
    valves = load_valves(args.valves_configuration)
    enabled = [valve for valve in valves if valve.enabled]
    master = next((valve for valve in enabled if valve.master), None)
    filterCleanup = next((valve for valve in enabled if valve.filterCleanup), None)
    valves_for_zones = [valve for valve in enabled if not valve.master and not valve.filterCleanup]
    valves_to_run = [valve for valve in enabled if valve.id in args.valves] if args.valves != -1 else valves_for_zones
    
    try:
        if master:
            master.open()

        for i in range(0, args.rounds):
            for valve in valves_to_run:
                valve.open()
                time.sleep(args.duration)
                valve.close()
                time.sleep(args.round_delay)  # let the previous valve close to start zone at full preasure

            # This is usefull for cleaning filter in my setup, as there is some sand in the water
            # I have water filter with cleanup valve connected before the expansion tank
            # so when filter's valve is opened after reaching full presure, backward flow from tank clears the filter
            if filterCleanup:
                time.sleep(10)  # wait for expansion tank to fill in
                filterCleanup.open()
                time.sleep(5)
                filterCleanup.close()

        if master:
            master.close()

    finally:
        [valve.close() for valve in enabled]  # close everything in case of failure
        GPIO.cleanup()
