#!/bin/sh

NUM=$(sudo awk '/'$1'/{ print NR; exit }' /etc/wpa_supplicant/wpa_supplicant.conf)
START=$(($NUM-1))
if [ $START -gt 0 ]
then
    echo "Connection already exists"
    exit 1;
fi

wpa_passphrase $1 $2 | awk '(NR != 3)' | sudo tee -a /etc/wpa_supplicant/wpa_supplicant.conf > /dev/null && sudo wpa_cli reconfigure
