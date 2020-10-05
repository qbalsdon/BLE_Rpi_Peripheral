#!/bin/sh

DIR=$(pwd)

cleanup () {
    cd $DIR
} 
trap cleanup EXIT

cd ~
sudo apt-get -y install npm

echo "!! NOTE !! - This requires a lower version of node"
echo "    Current node version: $(node -v)"
sudo npm install -g n
sudo n 8.9.0

mkdir repo
cd repo
git clone https://github.com/qbalsdon/BLE_Rpi_Peripheral
cd /home/pi/repo/BLE_Rpi_Peripheral/
sudo npm install --unsafe-perm

echo "System is ready to be rebooted"

