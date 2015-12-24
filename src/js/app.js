(function(){
  var canvas = document.getElementById('canvas');
  var context = canvas.getContext('2d');
  context.globalCompositeOperation = 'destination-atop';

  var iso;
  var Point = Isomer.Point;
  var Path = Isomer.Path;
  var Shape = Isomer.Shape;

  var scale = 0.5;
  var cubeWidth = 62;
  var cubeHeight = 71;
  var cubeEdge = 37;
  var dimension;

  init();

  function init() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // make it square
    var maxDimension = Math.max(canvas.width, canvas.height);

    var diameter = Math.sqrt(Math.pow(maxDimension, 2) * 2);

    // dimension of matrix
    dimension = Math.ceil(diameter / (cubeEdge * 2)) + 5; // 5 - extra

    // always even dimension
    dimension = (dimension & 1) ? dimension : dimension + 1;

    iso = new Isomer(canvas, {
      originX: canvas.width / 2,
      originY: (canvas.height / 2) + (cubeEdge)
    });

    drawField();
  }

  function cube (x, y, z) {
    return Shape.Prism(new Point(x, y, z)).scale(Point.ORIGIN, scale);
  }

  function drawField() {
    var center = Math.floor(dimension / 2);

    for (var x = 0; x < dimension; x++) {
      for (var y = 0; y < dimension; y++) {
        iso.add(cube((x - center) * 2, (y - center) * 2, 0));
      }
    }

    // iso.add(cube(0, 0, 0));
  }

  window.addEventListener('resize', function(event){
    init();
  });
})();
