var bleno = require('bleno');
var exec = require('child_process').exec;
var Gpio = require('pigpio').Gpio;

var CHUNK_SIZE = 20;

var Descriptor = bleno.Descriptor;

var deviceName = 'RaspberrPi3';
var myId = '4afb720a-5214-4337-841b-d5f954214877';
var data = new Buffer('Send me some data to display');
var output = "";
var updateCallback;

var terminalCallback;
var terminalResponse;

var START_CHAR = String.fromCharCode(002); //START OF TEXT CHAR
var END_CHAR = String.fromCharCode(003);   //END OF TEXT CHAR

m1_en = 5;
m1_p  = 24;
m1_n  = 27;

m2_en = 17;
m2_p  = 6;
m2_n  = 22;

m3_en = 12;
m3_p  = 23;
m3_n  = 16;

m4_en = 25;
m4_p  = 13;
m4_n  = 18;

var EN = [];
var FWD = [];
var BCK = [];
var MOTOR_COUNT = 4;

var LMOTOR = 3;
var RMOTOR = 0;
var TMOTOR = 1;

function getOutputPin(pinNumber) {
    return new Gpio(pinNumber, {mode: Gpio.OUTPUT});
}

function initMotors() {
    EN.push(getOutputPin(m1_en));
    EN.push(getOutputPin(m2_en));
    EN.push(getOutputPin(m3_en));
    EN.push(getOutputPin(m4_en));

    FWD.push(getOutputPin(m1_p));
    FWD.push(getOutputPin(m2_p));
    FWD.push(getOutputPin(m3_p));
    FWD.push(getOutputPin(m4_p));

    BCK.push(getOutputPin(m1_n));
    BCK.push(getOutputPin(m2_n));
    BCK.push(getOutputPin(m3_n));
    BCK.push(getOutputPin(m4_n));

    for (var i=0, l=MOTOR_COUNT; i<l; i++) {
        EN[i].digitalWrite(1);
        FWD[i].pwmWrite(0);
        BCK[i].pwmWrite(0);
    }
}

function driveMotor(instruction) {
    driveMotor(instruction, 0);
}

function driveMotor(instruction, speed) {
        switch(instruction) {
        case "F":
            BCK[RMOTOR].pwmWrite(0);
            FWD[RMOTOR].pwmWrite(speed);
            BCK[LMOTOR].pwmWrite(0);
            FWD[LMOTOR].pwmWrite(speed);
        break;
        case "B":
            FWD[RMOTOR].pwmWrite(0);
            BCK[RMOTOR].pwmWrite(speed);
            FWD[LMOTOR].pwmWrite(0);
            BCK[LMOTOR].pwmWrite(speed);
        break;
        case "L":
            FWD[RMOTOR].pwmWrite(0);
            BCK[RMOTOR].pwmWrite(speed);
            BCK[LMOTOR].pwmWrite(0);
            FWD[LMOTOR].pwmWrite(speed);
        break;
        case "R":
            BCK[RMOTOR].pwmWrite(0);
            FWD[RMOTOR].pwmWrite(speed);
            FWD[LMOTOR].pwmWrite(0);
            BCK[LMOTOR].pwmWrite(speed);
        break;
        case "C":
            BCK[TMOTOR].pwmWrite(0);
            FWD[TMOTOR].pwmWrite(speed);
        break;
        case "A":
            FWD[TMOTOR].pwmWrite(0);
            BCK[TMOTOR].pwmWrite(speed);
        break;
        case "S":
        case "STOP":
            for (var i = 0; i < MOTOR_COUNT; i++) {
                BCK[i].pwmWrite(0);
                FWD[i].pwmWrite(0);
            }
        break;
    }
}

function sliceUpResponse(callback, responseText) {
  if (!responseText || !responseText.trim()) return;
  callback(new Buffer(START_CHAR));
  while(responseText !== '') {
      callback(new Buffer(responseText.substring(0, CHUNK_SIZE)));
      responseText = responseText.substring(CHUNK_SIZE);
  }
  callback(new Buffer(END_CHAR));
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
            console.log("Command received: [" + data + "]");
            dir = exec(data, function(err, stdout, stderr) {
                if (err) {
                    var stringError = JSON.stringify(err);
                    console.log(stringError);
                    callback(bleno.Characteristic.RESULT_SUCCESS);
                    terminalResponse = stringError;
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
    }
});

var motor = new bleno.Characteristic({
    uuid : 'd23157c4-8416-44ff-b41d-a548c2d28653',
    properties : ['writeWithoutResponse','read'],
    onReadRequest : function(offset, callback) {
        console.log("Read request");
        callback(bleno.Characteristic.RESULT_SUCCESS, new Buffer(terminalResponse).slice(offset));
    },
    onWriteRequest : function(newData, offset, withoutResponse, callback) {
        if(offset) {
            callback(bleno.Characteristic.RESULT_ATTR_NOT_LONG);
        } else {
            var data = newData.toString('utf8');
            console.log("Motor instuction: [" + data + "]");
            var params = data.split(' ');
            if (params.length >= 2) {
                driveMotor(params[0], params[1]);
            } else {
                driveMotor(params[0]);
            }
        }
    }
});

bleno.on('stateChange', function(state) {
    console.log('on -> stateChange: ' + state);
    if (state === 'poweredOn') {
        initMotors();
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
                    terminal, motor
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
