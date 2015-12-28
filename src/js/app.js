/**
  Be aware of reading this code. I didn't care about how this code looks or even works.
  All I wanted was to make cubes move, so don't judge me.

  Seriously, you had better go away.
*/

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

  var animationTimer;

  var angle;
  var vertical;

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

    prepareCubes();

    setZeroHour();
    animate();
  }

  function setZeroHour() {
    start = new Date().getTime();
    var delayBeforeStart = 2000;
    var delayBetweenTides = 350;
    var angleDuration = 2000;
    var verticalDuration = 2000;
    var cubeDuration = Math.max(angleDuration, verticalDuration);
    var duration = delayBeforeStart + cubes.length * delayBetweenTides + cubeDuration;

    animationParams = {
      duration: duration,
      delayBeforeStart: delayBeforeStart,
      delayBetweenTides: delayBetweenTides,
      cubeDuration: cubeDuration,
      angle: {from: 0, to: -90, duration: angleDuration},
      vertical: {from: 0, to: 4, duration: verticalDuration}
    };
  }

  function cube (origin) {
    return Shape.Prism(origin);
  }

  function isOnScreen(point) {
    var translatedPoint = iso._translatePoint(point);
    var isVisible =
      (translatedPoint.x <= iso.canvas.width + cubeWidth/2) &&
      (translatedPoint.y <= iso.canvas.height + cubeHeight*3) &&
      (translatedPoint.x >= -cubeWidth/2) &&
      (translatedPoint.y >= 0);
    return isVisible;
  }

  function prepareCubes() {
    cubes = [];
    counterOnScreen = counterNotOnScreen = 0;
    var centerX = Math.ceil(dimensions.x / 2);
    var centerY = Math.ceil(dimensions.y / 2);
    var levelsNum = Math.max(centerX, centerY) + 4;

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
  }

  function animate() {
    animationTimer = setTimeout(function() {
      requestAnimationFrame(animate);
      iso.canvas.clear();

      time = new Date().getTime() - start;

      for (var level = cubes.length-1; level >= 0; level--) {
        var levelTime = time - animationParams.delayBeforeStart - level * animationParams.delayBetweenTides;
        levelTime = levelTime > 0 ? levelTime : 0;
        var angleTime = levelTime < animationParams.angle.duration ? levelTime : animationParams.angle.duration;
        var verticalTime = levelTime < animationParams.vertical.duration ? levelTime : animationParams.vertical.duration;
        angle = easeInOutCubic(
          angleTime,
          animationParams.angle.from,
          animationParams.angle.to - animationParams.angle.from,
          animationParams.angle.duration
        );
        vertical = easeInOutCubic(
          verticalTime,
          animationParams.vertical.from,
          animationParams.vertical.to - animationParams.vertical.from,
          animationParams.vertical.duration
        );


        for (var i=0; i < cubes[level].length; i++) {
          iso.add(
            cubes[level][i].cube
            .rotateZ(cubes[level][i].center, angle * Math.PI / 180)
            .translate(0, 0, vertical)
          );
        }
      }
      if (time >= animationParams.duration) {
        setZeroHour();
      }
    }, 1000 / fps);
  }

    // t - current time, b - start value, c - change in value, d - duration
  function easeInOutCubic(t, b, c, d) {
    if ((t/=d/2) < 1) return c/2*t*t*t + b;
		return c/2*((t-=2)*t*t + 2) + b;
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
