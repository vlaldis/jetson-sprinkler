import Jetson.GPIO as GPIO

GPIO.setmode(GPIO.BOARD)
GPIO.setup(40, GPIO.OUT)
GPIO.output(40, GPIO.HIGH)
time.sleep(30)
GPIO.output(40, GPIO.LOW)

GPIO.cleanup()
