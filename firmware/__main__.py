import time

import argparse
import Jetson.GPIO as GPIO

from src import app

parser = argparse.ArgumentParser(description='Sprinkler system for NVIDIA Jetson NANO.')
parser.add_argument('-t', '--test', type=bool, default=False,
                    help='Test all configured valves for 20 seconds')
args = parser.parse_args()


# do not forget to set
# sudo groupadd -f -r gpio
# sudo usermod -a -G gpio your_user_name

#https://github.com/NVIDIA/jetson-gpio


if __name__ == '__main__':
    print("Sprinkler system started {}".format(time.asctime()))
    print(args.__dict__)

    if args.test:
        app.test(20)
    else:
        app.run()

    GPIO.cleanup()
