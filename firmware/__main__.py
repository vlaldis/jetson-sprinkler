import time

import argparse
import Jetson.GPIO as GPIO
import logging

from src.sprinkler import Sprinkler


parser = argparse.ArgumentParser(description='Sprinkler execution for NVIDIA Jetson Nano.')
parser.add_argument('-v', '--valves', metavar='1 3 4', type=int, nargs='+', default=-1,
                    help='IDs of valves to run. Default -1 (all).')
parser.add_argument('-c', '--valves-configuration', metavar='FILE.json', type=str, default='/valves.json',
                    help='Json file with configuration of valves. Default /valves.json.')
parser.add_argument('-r', '--rounds', metavar='N', type=int, default=2,
                    help='How many times should be the routine repeated. Default 2.')
parser.add_argument('-d', '--duration', metavar='N', type=int, default=900,
                    help='Run each <--valves> for <-d> seconds. Default 900.')
parser.add_argument('--round-delay', metavar='N', type=int, default=5,
                    help='Delay between opening valves. In seconds. Default 5.')
parser.add_argument('--rain-sensor', metavar='N', type=int, default=-1,
                    help='Use rain sensor. Value specifies input GPIO. \
                        If set to High, routine won\'t execute. \
                        If routine is already in progress it will be interupted when switching valves finishes. \
                        Default -1 (do not use).')
parser.add_argument('--log-file', metavar='/path/to/log/file.log', type=str, default="",
                    help='Logging file path. If not specified, log file is not produced. Default no log file')

args = parser.parse_args()
GPIO.setmode(GPIO.BOARD)

if args.log_file is not None:
    logging.basicConfig(filename=args.log_file, level=logging.DEBUG)


if __name__ == '__main__':
    logging.info("Sprinkler routine started {}".format(time.asctime()))
    logging.info(args.__dict__)

    sprinkler = Sprinkler(
        valvesToRun=args.valves,
        valvesFile=args.valves_configuration,
        rounds=args.rounds,
        duration=args.duration,
        roundDelay=args.round_delay,
        rainSensorPin=args.rain_sensor 
        )

    sprinkler.Run()
