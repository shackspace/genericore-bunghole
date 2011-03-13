$(document).ready(function () {
    var d1 = [];

    var i = 0;

    function update() {
      i += 0.2;
      d1.push([i, Math.sin(i)]);
      $.plot($("#container"), [ d1 ]);
      setTimeout(update, 200);
    }
    
    update();

  });
