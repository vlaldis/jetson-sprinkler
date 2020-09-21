import time
import Jetson.GPIO as GPIO
import logging
import json

from src.valve import Valve

rainMessage = "It's raining man. Routine exited." 
 
class Sprinkler(object):
    def __init__(self, valvesToRun, valvesFile, rounds, duration, roundDelay, rainSensorPin):
        self.valvesToRun = valvesToRun
        self.valvesFile = valvesFile
        self.rounds = rounds
        self.duration = duration
        self.roundDelay = roundDelay
        self.rainSensorPin = rainSensorPin
        self.useRainSensor = rainSensorPin > -1

        if self.useRainSensor:
            GPIO.setup(self.rainSensorPin, GPIO.IN)

    def load_valves(self, file='/valves.json'):
        with open(file) as json_file:
            return [Valve(**valve) for valve in json.load(json_file)]

    def rains(self):
        return self.useRainSensor and GPIO.input(self.rainSensorPin) == GPIO.HIGH

    def exitOnRain(self):
        if self.rains():
            logging.warning(rainMessage)
            GPIO.cleanup()
            exit()

    def Run(self):
        self.exitOnRain()

        valves = self.load_valves(self.valvesFile)
        enabled = [valve for valve in valves if valve.enabled]
        master = next((valve for valve in enabled if valve.master), None)
        filterCleanup = next((valve for valve in enabled if valve.filterCleanup), None)
        valves_for_zones = [valve for valve in enabled if not valve.master and not valve.filterCleanup]
        valves_to_run = [valve for valve in enabled if valve.id in self.valvesToRun] if self.valvesToRun != -1 else valves_for_zones
        
        try:
            if master:
                master.open()

            for i in range(0, self.rounds):
                for valve in valves_to_run:                
                    valve.open()
                    time.sleep(self.duration)
                    valve.close()
                    self.exitOnRain()
                    time.sleep(self.roundDelay)  # let the previous valve close to start zone at full preasure

                # This is usefull for cleaning filter in my setup, as there is some sand in the water
                # I have water filter with cleanup valve connected before the expansion tank
                # so when filter's valve is opened after reaching full presure, backward flow from tank clears the filter
                if filterCleanup:
                    time.sleep(10)  # wait for expansion tank to fill in
                    filterCleanup.open()
                    time.sleep(5)
                    filterCleanup.close()

            if master:
                master.close()

        finally:
            [valve.close() for valve in enabled]  # close everything in case of failure
            GPIO.cleanup()
