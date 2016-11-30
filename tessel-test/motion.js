var tessel = require('tessel');
var PIR = tessel.port['GPIO'].pin['G3'];
var camera = require('camera-vc0706').use(tessel.port['A']);

var notificationLED = tessel.led[3]; // Set up an LED to notify when we're taking a picture

camera.on('ready', function() {
  notificationLED.high();
  // Take the picture

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

});



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
