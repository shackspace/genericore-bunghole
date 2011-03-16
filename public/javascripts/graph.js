$(document).ready(function () {

    function log(msg) {
      try {
        console.log(msg);
      } catch (e) { }
    }

    function update(data) {
      $.plot($("#container"), [ data ]);
    }

    function connect() {
      socket = new io.Socket(window.location.hostname, { port: window.location.port });
      socket.connect();

      socket.on('message', function (data) {
          try {
            var msg = JSON.parse(data);
            update(msg);
          } catch (err) {
            log('Error while parsing data:' + err);
          }

        });

      socket.on('disconnect', function () {
          log('Connection closed');
          setTimeout(1000, connect);
        });
    }

    connect();
  });
