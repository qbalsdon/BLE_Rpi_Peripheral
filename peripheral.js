var bleno = require('bleno');
var exec = require('child_process').exec;

var CHUNK_SIZE = 20;

var Descriptor = bleno.Descriptor;

var deviceName = 'RaspberrPi3';
var myId = '4afb720a-5214-4337-841b-d5f954214877';
var data = new Buffer('Send me some data to display');
var output = "";
var updateCallback;

var terminalCallback;
var terminalResponse;

var descriptor = new Descriptor({
    uuid: 'febf57a0-b80e-4f28-98c3-d361cb374171',
    value: 'value' // static value, must be of type Buffer or string if set
});

// new characteristic added to the service
var output = new bleno.Characteristic({
    uuid : '53b3d9597dd3483994e17b0eaea9aac2',
    properties : ['read','write','notify', 'indicate'],
    descriptors : [descriptor],
    onReadRequest : function(offset, callback) {
        console.log("Read request");
        if(offset > data.length) {
            callback(bleno.Characteristic.RESULT_INVALID_OFFSET);
        } else {
            callback(bleno.Characteristic.RESULT_SUCCESS, data.slice(offset));
        }
    },
    onWriteRequest : function(newData, offset, withoutResponse, callback) {
        if(offset > 0) {
            callback(bleno.Characteristic.RESULT_INVALID_OFFSET);
        } else {
            var data = newData.toString('utf8');
            console.log(data);
            callback(bleno.Characteristic.RESULT_SUCCESS);
            if (updateCallback)
                updateCallback(new Buffer('success Quintin').slice(offset));
        }
    },
    onSubscribe: function(maxValueSize, updateValueCallback) { 
       console.log("onSubscribe called");
       updateCallback = updateValueCallback; 
    },
    onUnsubscribe: function() { 
        console.log("onUnsubscribe");
    },
    onNotify: function() { 
        console.log("onNotify");
    },
    onIndicate: function() { 
        console.log("onIndicate");
    }
});

function sliceUpResponse(callback, responseText) {
  if (!responseText) return;
  callback(new Buffer("α"));
  while(responseText !== '') {
      callback(new Buffer(responseText.substring(0, CHUNK_SIZE)));
      responseText = responseText.substring(CHUNK_SIZE);
  }
  callback(new Buffer("ω"));
}

var terminal = new bleno.Characteristic({
    uuid : '8bacc104-15eb-4b37-bea6-0df3ac364199',
    properties : ['write','read','notify'],
    onReadRequest : function(offset, callback) {
        console.log("Read request");
        callback(bleno.Characteristic.RESULT_SUCCESS, new Buffer(terminalResponse).slice(offset));
    },
    onWriteRequest : function(newData, offset, withoutResponse, callback) {
        if(offset) {
            callback(bleno.Characteristic.RESULT_ATTR_NOT_LONG);
        } else {
            var data = newData.toString('utf8');
            console.log("Command received: [" + data + "] Without Response: [" + withoutResponse + "]");
            dir = exec(data, function(err, stdout, stderr) {
                if (err) {
                    console.log(err);
                    callback(bleno.Characteristic.RESULT_SUCCESS);
                    terminalResponse = err;
                } else {
                    console.log(stdout);
                    callback(bleno.Characteristic.RESULT_SUCCESS);
                    terminalResponse = stdout;
                }
                if (terminalCallback) sliceUpResponse(terminalCallback, terminalResponse);
            });
        }
    },
    onSubscribe: function(maxValueSize, updateValueCallback) {
       console.log("onSubscribe called");
       terminalCallback = updateValueCallback;
    },
    onUnsubscribe: function() {
        terminalCallback = null;
        console.log("onUnsubscribe");
    },
    onNotify: function() {
        console.log("onNotify");
    }
});

bleno.on('stateChange', function(state) {
    console.log('on -> stateChange: ' + state);
    if (state === 'poweredOn') {
        bleno.startAdvertising(deviceName,[myId]);
    } else {
        bleno.stopAdvertising();
    }
});

bleno.on('advertisingStart', function(error) {
    console.log('on -> advertisingStart: ' + (error ? 'error ' + error : 'success'));
    if (!error) {
        bleno.setServices([
            new bleno.PrimaryService({
                uuid : myId,
                characteristics : [
                    // add characteristics here
                    output, terminal
                ]
            })
        ]);
        console.log('service added');
    }
});

bleno.on('accept', function(clientAddress) {
    console.log("Accepted connection from: " + clientAddress);
});

bleno.on('disconnect', function(clientAddress) {
    console.log("Disconnected from: " + clientAddress);
});
