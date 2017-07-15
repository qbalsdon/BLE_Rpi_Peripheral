#!/bin/sh

sudo systemctl disable vncserver-x11-serviced.service && sudo systemctl stop vncserver-x11-serviced.service && echo "VNC stopped" && exit 0

echo "VNC could not be stopped"
