# BLE_Rpi_Peripheral
Allows a Raspberry Pi to be used as a Bluetooth Low Energy Peripheral

Pre-Requisites:

On the Raspberry Pi you will need to update /usr/include/nodejs/deps/v8/include/v8.h from:

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
