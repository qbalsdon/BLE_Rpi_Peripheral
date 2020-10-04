#!/bin/sh

DIR=$(pwd)
EXEC_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

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
sudo npm install

echo "System is ready to be rebooted"

#cd ~
#sudo mkdir repo
#cd repo
#git clone https://github.com/qbalsdon/BLE_Rpi_Peripheral.git
#sudo ./repo/BLE_Rpi_Peripheral/scripts/setup.sh
