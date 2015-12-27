(function(){
  var canvas = document.getElementById('canvas');
  var context = canvas.getContext('2d');

  var iso;
  var Point = Isomer.Point;
  var Path = Isomer.Path;
  var Shape = Isomer.Shape;

  var cubeWidth = 120;
  var cubeHeight = 140;
  var dimensions;
  var center;

  var counterOnScreen;
  var counterNotOnScreen;

  var animationTimer;
  var angle;
  var cubes = [];

  var fps = 30;

  init();

  var debounceInit = debounce(init, 250);
  window.addEventListener('resize', function() {
    iso.canvas.clear();
    clearTimeout(animationTimer);
    debounceInit();
  });

  function init() {
    clearTimeout(animationTimer);

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    dimensions = {
      x: Math.ceil(canvas.width / cubeWidth),
      y: Math.ceil(canvas.height / cubeHeight)
    };

    // always even
    dimensions.x = (dimensions.x & 1) ? dimensions.x : dimensions.x + 1;
    dimensions.y = (dimensions.y & 1) ? dimensions.y : dimensions.y + 1;

    iso = new Isomer(canvas, {
      originX: canvas.width / 2,
      originY: (canvas.height / 2) + cubeHeight / 2
    });

    angle = 0;

    prepareCubes();

    animate();
  }

  function cube (origin) {
    return Shape.Prism(origin);
  }

  function isOnScreen(point) {
    var translatedPoint = iso._translatePoint(point);
    var isVisible =
      (translatedPoint.x <= iso.canvas.width + cubeWidth/2) &&
      (translatedPoint.y <= iso.canvas.height + cubeHeight) &&
      (translatedPoint.x >= -cubeWidth/2) &&
      (translatedPoint.y >= 0);
    if (isVisible) { counterOnScreen++; } else { counterNotOnScreen++ };
    return isVisible;
  }

  function prepareCubes() {
    cubes = [];
    counterOnScreen = counterNotOnScreen = 0;
    var centerX = Math.ceil(dimensions.x / 2);
    var centerY = Math.ceil(dimensions.y / 2);
    var levelsNum = Math.max(centerX, centerY) + 2;

    // very first level with only central cube
    var x = y = z = 0;
    cubes.push([{
      cube: cube(new Point(x, y, z)),
      center: new Point(x+0.5, y+0.5, z+0.5)
    }]);

    for (var i=1; i < levelsNum; i++) {
      var level = [];

      for (var j=i; j > -i; j--) {
        var origin = new Point(j*2, i*2, z);
        if (isOnScreen(origin)) {
          level.push({
            cube: cube(origin),
            center: origin.translate(0.5, 0.5, 0.5)
          });
        }
      }
      for (var j=i; j > -i; j--) {
        var origin = new Point(-i*2, j*2, z);
        if (isOnScreen(origin)) {
          level.push({
            cube: cube(origin),
            center: origin.translate(0.5, 0.5, 0.5)
          });
        }
      }
      for (var j=-i; j < i; j++) {
        var origin = new Point(j*2, -i*2, z);
        if (isOnScreen(origin)) {
          level.push({
            cube: cube(origin),
            center: origin.translate(0.5, 0.5, 0.5)
          });
        }
      }
      for (var j=-i; j < i; j++) {
        var origin = new Point(i*2, j*2, z);
        if (isOnScreen(origin)) {
          level.push({
            cube: cube(origin),
            center: origin.translate(0.5, 0.5, 0.5)
          });
        }
      }

      cubes.push(level);
    }
    console.log('On:', counterOnScreen + 1, '; Out:', counterNotOnScreen, '; Total:', counterOnScreen + counterNotOnScreen + 1);
  }

  function animate() {
    animationTimer = setTimeout(function() {
      requestAnimationFrame(animate);
      iso.canvas.clear();

      for (var level=0; level < cubes.length; level++) {
        for (var i=0; i < cubes[level].length; i++) {
          iso.add(
            cubes[level][i].cube.rotateZ(cubes[level][i].center, angle * Math.PI / 180)
          );
        }
      }

      // for (var x = 0; x < dimension; x++) {
      //   for (var y = 0; y < dimension; y++) {
      //     var dx = (x - center) * 2;
      //     var dy = (y - center) * 2;
      //     iso.add(
      //       cube(dx, dy, 0)
      //       .rotateZ(Point(dx + 0.5, dy + 0.5, 0.5), angle * Math.PI / 180)
      //     );
      //
      //   }
      // }

      angle = angle === 180 ? 2 : angle + 2;
    }, 1000 / fps);
  }

  // easeInCirc
  // t - current time, b - start value, c - change in value, d - duration
  function easing(t, b, c, d) {
		return -c * (Math.sqrt(1 - (t/=d)*t) - 1) + b;
	};

  function debounce(func, wait, immediate) {
  	var timeout;
  	return function() {
  		var context = this, args = arguments;
  		var later = function() {
  			timeout = null;
  			if (!immediate) func.apply(context, args);
  		};
  		var callNow = immediate && !timeout;
  		clearTimeout(timeout);
  		timeout = setTimeout(later, wait);
  		if (callNow) func.apply(context, args);
  	};
  };
})();
