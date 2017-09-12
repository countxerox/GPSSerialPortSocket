var socket = io();

socket.on('example-pong', function (data) {
    console.log("pong, " + data["timemsg"]);
    var mySpan = document.getElementById("messageGoesHere");
    mySpan.innerHTML=data["timemsg"]; 
});

window.addEventListener("load", function(){

  var button = document.getElementById('hello');

  button.addEventListener('click', function() {
      console.log("ping");
      socket.emit('example-ping', { duration: 2 });
  });

});
