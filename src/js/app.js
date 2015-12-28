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
  var start;
  var time;
  var animationParams;

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
      originY: (canvas.height / 2) + cubeHeight
    });

    animationParams = {
      angle: {from: 0, to: -45, duration: 3000},
      vertical: {from: 0, to: 2, duration: 3000}
    };

    start = new Date().getTime();
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

  var tick = 1
  function animate() {
    animationTimer = setTimeout(function() {
      requestAnimationFrame(animate);
      iso.canvas.clear();

      time = new Date().getTime() - start;
      angle = easing(
        time,
        animationParams.angle.from,
        animationParams.angle.to - animationParams.angle.from,
        animationParams.angle.duration
      );

      for (var level=0; level < cubes.length; level++) {
        for (var i=0; i < cubes[level].length; i++) {
          iso.add(
            cubes[level][i].cube.rotateZ(cubes[level][i].center, angle * Math.PI / 90)
          );
        }
      }
      if (time >= animationParams.angle.duration) start = new Date().getTime();
    }, 1000 / fps);
  }

    // t - current time, b - start value, c - change in value, d - duration
  function easing(t, b, c, d) {
    if (t==0) return b;
		if (t==d) return b+c;
		if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
		return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
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
