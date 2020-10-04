# BLE_Rpi_Peripheral
<h2>Allows a Raspberry Pi to be used as a Bluetooth Low Energy Peripheral</h2>
<h3>THE EASY WAY:</h3>
Download the pre-defined SD card image and deploy.

<h3>THE SLIGHTLY LESS EASY WAY:</h3>
```
wget -O - https://raw.githubusercontent.com/qbalsdon/BLE_Rpi_Peripheral/master/scripts/setup.sh | sudo sh
```

<h3>THE HARD WAY:</h3>
Pre-Requisites:


All you need to do is make sure the Pi is up to date, with NPM (NODE needs to be version 8.9.0 - I have had problems with 10+) installed. You do not need any pre-requisites from older Pi builds that did not include Bluetooth. Please do not manually install any of these: 

<ul>
<li>bluetooth</li><li>bluez</li><li>libbluetooth-dev</li><li>libudev-dev</li>
</ul>
These are older pre-requisites from <a href="https://github.com/sandeepmistry/bleno">bleno</a> that cause issues when connecting with Android devices.<br/><br/>

After installing NPM, you will need to update /usr/include/nodejs/deps/v8/include/v8.h from:

<div class="highlight highlight-source-c"><pre>  <span class="pl-k">enum</span> WriteOptions {
    NO_OPTIONS = <span class="pl-c1">0</span>,
    HINT_MANY_WRITES_EXPECTED = <span class="pl-c1">1</span>,
    NO_NULL_TERMINATION = <span class="pl-c1">2</span>,
    PRESERVE_ASCII_NULL = <span class="pl-c1">4</span>,
  };</pre></div>

<p>to</p>

<div class="highlight highlight-source-c"><pre>  <span class="pl-k">enum</span> WriteOptions {
    NO_OPTIONS = <span class="pl-c1">0</span>,
    HINT_MANY_WRITES_EXPECTED = <span class="pl-c1">1</span>,
    NO_NULL_TERMINATION = <span class="pl-c1">2</span>,
    PRESERVE_ASCII_NULL = <span class="pl-c1">4</span>,
    REPLACE_INVALID_UTF8 = <span class="pl-c1">0</span>
  };</pre></div>

Then you can checkout this repo and run 'npm install'
