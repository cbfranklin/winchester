var five = require("johnny-five");
var io = require("socket.io").listen(8081);

var board = new five.Board();

board.on("ready", function() {
    console.log('ready')

    var sensor = new five.Sensor("A0");
    var touches = [];
    var average;

    sensor.scale([0, 100]).on("data", function() {
        touches.push(this.value * 10);
    });

    setInterval(function() {
        var sum = 0;
        for (i = 0; i < touches.length; i++) {
            sum += touches[i];
        }
        average = sum / touches.length;
        console.log(average)
        if (average > 2.1) {
            console.log('touch')
            isTouch = true;
        } else {
            console.log('no touch')
            isTouch = false;
        }
        touches = [];
    }, 100);

    io.sockets.on('connection', function(socket) {
        setInterval(function() {
            socket.emit('touch', isTouch);
        }, 100);
    });
});