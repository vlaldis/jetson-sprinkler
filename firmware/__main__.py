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
args = parser.parse_args()


def load_valves(file='/valves.json'):
    with open(file) as json_file:
        return [Valve(**valve) for valve in json.load(json_file)]


def init():
    GPIO.setmode(GPIO.BOARD)


if __name__ == '__main__':
    print("Sprinkler routine started {}".format(time.asctime()))
    print(args.__dict__)

    try:
        init()

        valves = load_valves(args.valves_configuration)
        only_enabled = [valve for valve in valves if valve.enabled]
        master = next((valve for valve in only_enabled if valve.master), None)
        without_master = [valve for valve in only_enabled if not valve.master]
        valves_to_run = [valve for valve in only_enabled if valve.id in args.valves] if args.valves != -1 else without_master

        if master:
            master.open()

        for i in range(0, args.rounds):
            for valve in valves_to_run:
                valve.open()
                time.sleep(args.duration)
                valve.close()

        if master:
            master.close()

    finally:
        GPIO.cleanup()
