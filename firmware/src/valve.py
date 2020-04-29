import time
import Jetson.GPIO as GPIO

HIGH = "high"
LOW = "low"
DISABLED_MESSAGE = "Valve disabled. No action exwcuted."


class Valve(object):
    def __init__(self, id, gpio, active, master=False, enabled=True, filterCleanup=False):
        self.id = id
        self.gpio = gpio
        self.master = master
        self.active = GPIO.HIGH if active == HIGH else GPIO.LOW
        self.inactive = GPIO.LOW if active == HIGH else GPIO.HIGH
        self.filterCleanup = filterCleanup
        self.enabled = enabled
        if self.enabled:
            GPIO.setup(self.gpio, GPIO.OUT)

    def open(self):
        if not self.enabled:
            self.notify(DISABLED_MESSAGE)
            return

        self.set(self.active)
        self.notify("opened")

    def close(self):
        if not self.enabled:
            self.notify(DISABLED_MESSAGE)
            return
            
        self.set(self.inactive)
        self.notify("closed")

    def set(self, state):
        GPIO.output(self.gpio, state)

    def notify(self, action):
        print("Valve {} {} at {}.".format(self.id, action, time.asctime()))


