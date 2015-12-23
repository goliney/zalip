var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');
context.globalCompositeOperation = 'destination-atop';

var Point = Isomer.Point;
var Path = Isomer.Path;
var Shape = Isomer.Shape;

var scale = 0.5;

init();

function init() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  var iso = new Isomer(canvas, {
    originX: canvas.width / 2,
    originY: canvas.height / 2
  });

  iso.add(cube(0, 0, 0));
  iso.add(cube(0, 2, 0));
  iso.add(cube(2, 0, 0));
}

function cube (x, y, z) {
  return Shape.Prism(new Point(x, y, z)).scale(Point.ORIGIN, scale);
}

window.addEventListener('resize', function(event){
  init();
});
