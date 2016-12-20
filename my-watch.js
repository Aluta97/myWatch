var tessel = require('tessel');
var PIR = tessel.port['GPIO'].pin['G3'];
var camera = require('camera-vc0706').use(tessel.port['A']);
var hardware = tessel.port['D'];
var gprslib = require('gprs-sim900');

var phoneNumber = '+27829278734'; // Replace the #s with the String representation of the phone number, including country code (1 for USA)
var message = 'Text from a Tessel!';
var url = 'http://172.18.0.32:5000/alerts'

var gprs = gprslib.use(hardware);
var notificationLED = tessel.led[3]; // Set up an LED to notify when we're taking a picture

camera.on('ready', function() {
  notificationLED.high();
  // Take the picture
  gprs.on('ready', function() {
    console.log('GPRS module connected to Tessel. Searching for network...')
    //  Give it 10 more seconds to connect to the network, then try to send an SMS
    PIR.on('rise', function(time){
      console.log('Motion detected! Taking picture');
      notificationLED.high();

      camera.takePicture(function(err, image) {
        if (err) {
          console.log('error taking image', err);
        } else {
          notificationLED.low();
          // Name the image
          var name = 'picture-' + Math.floor(Date.now()*1000) + '.jpg';
          // Save the image
          console.log('Picture saving as', name, '...');
          process.sendfile(name, image);
          console.log('done.');
          // Turn the camera off to end the script
          //camera.disable();
        }
      });

      });

    setTimeout(function() {
      console.log('Sending', message, url, 'to', phoneNumber, '...');
      // Send message
      gprs.sendSMS(phoneNumber, url, function smsCallback(err, data) {
        if (err) {
          return console.log(err);
        }
        var success = data[0] !== -1;
        console.log('Text sent:', success);
        if (success) {
          // If successful, log the number of the sent text
          console.log('GPRS Module sent text #', data[0]);
        }
      });
    }, 10000);
  });


  });
  //  Port, callback






PIR.on('fall', function(time){
  console.log('zzz...');
  notificationLED.low();
});

// PIR.on('change', function(time){
//   console.log('All quiet now');
//   notificationLED.low();
// });

// Wait for the camera module to say it's ready
// camera.on('ready', function() {
//   notificationLED.high();
//   // Take the picture
//   camera.takePicture(function(err, image) {
//     if (err) {
//       console.log('error taking image', err);
//     } else {
//       notificationLED.low();
//       // Name the image
//       var name = 'picture-' + Math.floor(Date.now()*1000) + '.jpg';
//       // Save the image
//       console.log('Picture saving as', name, '...');
//       process.sendfile(name, image);
//       console.log('done.');
//       // Turn the camera off to end the script
//       camera.disable();
//     }
//   });
// });
