import time
import Jetson.GPIO as GPIO


def init():
    GPIO.setmode(GPIO.BOARD)
    GPIO.setup(38, GPIO.OUT)
    GPIO.output(38, GPIO.HIGH)
    time.sleep(20)
    GPIO.output(38, GPIO.LOW)


if __name__ == '__main__':
    try:
        init()
    finally:
        GPIO.cleanup()
