#!/bin/sh

IP="$(hostname -I)"

sudo systemctl enable vncserver-x11-serviced.service && systemctl start vncserver-x11-serviced.service && echo "VNC started: $IP" && exit 0

echo "VNC could not be started"
