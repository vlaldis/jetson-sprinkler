import Jetson.GPIO as GPIO

HIGH = "high"
LOW = "low"


class Valve(object):
    def __init__(self, id, gpio, active, master=False):
        self.id = id
        self.gpio = gpio
        self.active = GPIO.HIGH if active == HIGH else GPIO.LOW
        self.master = master

        self.inactive = GPIO.LOW if active == GPIO.HIGH else GPIO.HIGH
        GPIO.setup(self.gpio, GPIO.OUT)

    def open(self):
        GPIO.output(self.gpio, self.active)

    def close(self):
        GPIO.output(self.gpio, self.inactive)
