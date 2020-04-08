import time
import Jetson.GPIO as GPIO

HIGH = "high"
LOW = "low"


class Valve(object):
    def __init__(self, id, gpio, active, master=False):
        self.id = id
        self.gpio = gpio
        self.master = master
        self.active = GPIO.HIGH if active == HIGH else GPIO.LOW
        self.inactive = GPIO.LOW if active == HIGH else GPIO.HIGH
        GPIO.setup(self.gpio, GPIO.OUT)

    def open(self):
        set(self.active)
        self.notify("opened")

    def close(self):
        set(self.inactive)
        self.notify("closed")

    def set(self, state):
        GPIO.output(self.gpio, state)

    def notify(self, action):
        print("Valve {} {} at {}.".format(self.id, action, time.asctime()))


