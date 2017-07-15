#!/bin/sh
IP="$(hostname -I)"
sudo update-rc.d ssh enable && sudo invoke-rc.d ssh start && echo "SSH started: $IP" && exit 0
echo "SSH could not be started"
