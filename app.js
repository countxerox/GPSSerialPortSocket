//test
//test2

var app = require('http').createServer(handler)
var io = require('socket.io')(app)
var url = require('url')
var fs = require('fs')


//This will open a server at localhost:5000. Navigate to this in your browser.
app.listen(5000);

// Http handler function
function handler (req, res) {

    // Using URL to parse the requested URL
    var path = url.parse(req.url).pathname;

    // Managing the root route
    if (path == '/') {
        index = fs.readFile(__dirname+'/public/index.html', 
            function(error,data) {

                if (error) {
                    res.writeHead(500);
                    return res.end("Error: unable to load index.html");
                }

                res.writeHead(200,{'Content-Type': 'text/html'});
                res.end(data);
            });
    // Managing the route for the javascript files
    } else if( /\.(js)$/.test(path) ) {
        index = fs.readFile(__dirname+'/public'+path, 
            function(error,data) {

                if (error) {
                    res.writeHead(500);
                    return res.end("Error: unable to load " + path);
                }

                res.writeHead(200,{'Content-Type': 'text/plain'});
                res.end(data);
            });
    } else {
        res.writeHead(404);
        res.end("Error: 404 - File not found.");
    }

}

// Web Socket Connection
io.sockets.on('connection', function (socket) {

  // If we recieved a command from a client to start watering lets do so
  socket.on('example-ping', function(data) {
       console.log("ping");

      delay = data["duration"];

      // Set a timer for when we should stop watering
      setTimeout(function(){
          socket.emit("example-pong");
      }, delay*1000);

  });

});


var SerialPort = require('serialport');
//var SerialPort = serialport.SerialPort;

var Readline = SerialPort.parsers.Readline;
var port = new SerialPort('/dev/ttyAMA0', {
    baudRate: 115200,
    databits: 8,
    parity: 'none',
    stopBits: 1,
    flowControl: false,
//    parser: serialport.parsers.readline("\n"),
});
var parser = new Readline();
port.pipe(parser);
parser.on('data', function(data) {
  if (data.substr(1, 5) === "GNGGA") {
    var time = "the time is " + data.substr(7, 2) + "." + data.substr(9, 2) + "." + data.substr(11, 2);
//    console.log(time);
    io.sockets.emit("example-pong", { timemsg: time });
    //io.sockets.emit('hello',{msg:'abc'});
  }
});
// port.write('ROBOT PLEASE RESPOND\n');

// Creating the parser and piping can be shortened to
// const parser = port.pipe(new Readline());

/*sp.on('open', function() {
    console.log('open');
    sp.on('data', function(data) {
        console.log('data received: ' + data);
    });
});*/
