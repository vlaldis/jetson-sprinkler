FROM nvcr.io/nvidia/l4t-base:r32.3.1

ENV uid=ubuntu \
    gid=gpio \
    gid_gpio=gid_gpio

RUN apt-get update -y

RUN apt-get install -y apt-utils python3-pip git

COPY . /firmware/
COPY ./src/valves.json /valves.json

RUN python3 -m pip install -r /firmware/requirements.txt

USER ${uid}
ENTRYPOINT python3 /firmware/test_gpio.py
