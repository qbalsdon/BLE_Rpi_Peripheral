#!/bin/sh
EXEC_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
# Create the symlink
sudo ln -s $EXEC_DIR/bleserver.service /lib/systemd/system

sudo systemctl daemon-reload
sudo systemctl enable bleserver.service

echo "~~ Service set up to run at boot ~~"

echo "~~ To start it now, run: ~~"
echo "    sudo service bleserver start"
