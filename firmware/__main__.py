import time
import argparse

from src import app

parser = argparse.ArgumentParser(description='Sprinkler system for NVIDIA Jetson NANO.')
parser.add_argument('-t', '--test', type=bool, default=False,
                    help='Test all configured valves for 20 seconds')
args = parser.parse_args()

if __name__ == '__main__':
    print("Sprinkler system started {}".format(time.asctime()))
    print(args.__dict__)
    app.run()
