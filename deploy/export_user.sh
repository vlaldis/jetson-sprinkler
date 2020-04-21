export GID=$(cut -d: -f3 < <(getent group dialout))
export GID_GPIO=$(cut -d: -f3 < <(getent group gpio))
