#!/bin/sh

sudo apt-get -y install npm
sudo sed -i 's/PRESERVE_ASCII_NULL = 4/PRESERVE_ASCII_NULL = 4,\n    REPLACE_INVALID_UTF8 = 0/' /usr/include/nodejs/deps/v8/include/v8.h

sudo echo "@sudo lxterminal -e sudo node /home/pi/repo/BLE_Rpi_Peripheral/peripheral.js" | sudo tee -a ~/.config/lxsession/LXDE-pi/autostart

cd /home/pi/repo/BLE_Rpi_Peripheral/
sudo npm install

echo "System is ready to be rebooted"

#cd ~
#sudo mkdir repo
#cd repo
#git clone https://github.com/qbalsdon/BLE_Rpi_Peripheral.git
#sudo ./repo/BLE_Rpi_Peripheral/scripts/setup.sh
