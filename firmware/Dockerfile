ENV UID=ubuntu \
    GID=gpio \

FROM nvcr.io/nvidia/l4t-base:r32.3.1

RUN python3 -m pip install -r /firmware/requirements.txt


COPY . /firmware/
COPY ../firmware/src/valves.json /valves.json

ENTRYPOINT [bash]