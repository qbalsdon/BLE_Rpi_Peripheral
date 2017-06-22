var bleno = require('bleno');
var myId = '4afb720a-5214-4337-841b-d5f954214877';
var data = new Buffer('Send me some data to display');

// new characteristic added to the service
var output = new bleno.Characteristic({
    uuid : '53b3d9597dd3483994e17b0eaea9aac2',
    properties : ['read','writeWithoutResponse'],
    onReadRequest : function(offset, callback) {
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
            data = newData;
            callback(bleno.Characteristic.RESULT_SUCCESS);
        }
    }
});

bleno.on('stateChange', function(state) {
    console.log('on -> stateChange: ' + state);
    if (state === 'poweredOn') {
        bleno.startAdvertising('MyDevice',[myId]);
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
                    output
                ]
            })
        ]);
        console.log('service added');
    }
});
