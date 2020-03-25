import time

import argparse
import Jetson.GPIO as GPIO

from src import app

parser = argparse.ArgumentParser(description='Sprinkler system for NVIDIA Jetson NANO.')
parser.add_argument('-t', '--test', action='store_true',
                    help='Test all configured valves for 5 seconds (will be 20 for live sprinkler)')
args = parser.parse_args()


if __name__ == '__main__':
    print("Sprinkler system started {}".format(time.asctime()))
    print(args.__dict__)

    GPIO.setmode(GPIO.BOARD)
    
    if args.test:
        app.test(5)
    else:
        app.run()

    GPIO.cleanup()
