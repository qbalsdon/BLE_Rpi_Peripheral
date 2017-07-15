#!/bin/sh
NUM=$(sudo awk '/'$1'/{ print NR; exit }' /etc/wpa_supplicant/wpa_supplicant.conf)
START=$(($NUM-1))
END=$(($NUM+2))

if [ $START -lt 0 ]
then
    echo "No such connection"
    exit 0;
fi
sudo sed -i "${START},${END}d" /etc/wpa_supplicant/wpa_supplicant.conf
sudo wpa_cli reconfigure
