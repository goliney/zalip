(function(){
  var canvas = document.getElementById('canvas');
  var context = canvas.getContext('2d');
  context.globalCompositeOperation = 'destination-atop';

  var iso;
  var Point = Isomer.Point;
  var Path = Isomer.Path;
  var Shape = Isomer.Shape;

  var scale = 0.75;
  var cubeWidth = 62;
  var cubeHeight = 71;
  var cubeEdge = 37;
  var dimension;
  var center;

  var animationTimer;
  var angle;

  init();

  function init() {
    clearTimeout(animationTimer);

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // make it square
    var maxDimension = Math.max(canvas.width, canvas.height);

    var diameter = Math.sqrt(Math.pow(maxDimension, 2) * 2);

    // dimension of matrix
    dimension = Math.ceil(diameter / (cubeEdge * 2)) + 5; // 5 - extra

    // always even dimension
    dimension = (dimension & 1) ? dimension : dimension + 1;

    center = Math.floor(dimension / 2);

    iso = new Isomer(canvas, {
      originX: canvas.width / 2,
      originY: (canvas.height / 2) + (cubeEdge)
    });

    angle = 0;
    animationTimer = setInterval(animate, 1000/30);
  }

  function cube (x, y, z) {
    return Shape.Prism(new Point(x, y, z));
  }

  function animate() {
      iso.canvas.clear();

      for (var x = 0; x < dimension; x++) {
        for (var y = 0; y < dimension; y++) {
          var dx = (x - center) * 2;
          var dy = (y - center) * 2;
          iso.add(
            cube(dx, dy, 0)
            .rotateZ(Point(dx + 0.5, dy + 0.5, 0.5), angle * Math.PI / 180)
            .scale(Point.ORIGIN, scale)
          );

        }
      }
      angle = angle === 180 ? 2 : angle + 2;
  }

  // easeInCirc
  // t - current time, b - start value, c - change in value, d - duration
  function easing(t, b, c, d) {
		return -c * (Math.sqrt(1 - (t/=d)*t) - 1) + b;
	};

  window.addEventListener('resize', function(event){
    init();
  });
})();
