# BLE_Rpi_Peripheral
## Allows a Raspberry Pi to be used as a Bluetooth Low Energy Peripheral
### THE EASY WAY:
Download the pre-defined SD card image and deploy.

### THE SLIGHTLY LESS EASY WAY:

```
wget -O - https://raw.githubusercontent.com/qbalsdon/BLE_Rpi_Peripheral/master/scripts/setup.sh | sudo sh
```

### THE HARD WAY:
Pre-Requisites:


All you need to do is make sure the Pi is up to date, with NPM (NODE needs to be version 8.9.0 - I have had problems with 10+) installed. You do not need any pre-requisites from older Pi builds that did not include Bluetooth. Please do not manually install any of these: 

- bluetooth
- bluez
- libbluetooth-dev
- libudev-dev

These are older pre-requisites from [bleno](https://github.com/sandeepmistry/bleno) that cause issues when connecting with Android devices.

Then you can checkout this repo and run 'npm install'

#### DEPRECATED
After installing NPM, you will need to update /usr/include/nodejs/deps/v8/include/v8.h from:

```
  enum WriteOptions {
    NO_OPTIONS = 0,
    HINT_MANY_WRITES_EXPECTED = 1,
    NO_NULL_TERMINATION = 2,
    PRESERVE_ASCII_NULL = 4,
  };
```

to

```
  enum WriteOptions {
    NO_OPTIONS = 0,
    HINT_MANY_WRITES_EXPECTED = 1,
    NO_NULL_TERMINATION = 2,
    PRESERVE_ASCII_NULL = 4,
    REPLACE_INVALID_UTF8 = 0
  };
```

