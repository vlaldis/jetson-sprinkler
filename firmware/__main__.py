import time

import argparse
import Jetson.GPIO as GPIO

from src import app

parser = argparse.ArgumentParser(description='Sprinkler system for NVIDIA Jetson Nano.')
parser.add_argument('-t', '--test', metavar='N', type=int, default=900,
                    help='Test all configured valves for N seconds. Default 900.')
args = parser.parse_args()


def init():
    GPIO.setmode(GPIO.BOARD)


if __name__ == '__main__':
    print("Sprinkler system started {}".format(time.asctime()))
    print(args.__dict__)

    try:
        init()

        if args.test:
            app.test(args.test)
        else:
            app.run()
    finally:
        GPIO.cleanup()
