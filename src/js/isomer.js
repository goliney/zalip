/**
	This excellent library was disfigured by me, and I ask God and @jdan for forgiveness

	I'm so sorry...
*/


/*!
 * Isomer v0.2.5
 * http://jdan.github.io/isomer/
 *
 * Copyright 2014 Jordan Scales
 * Released under the MIT license
 * http://jdan.github.io/isomer/license.txt
 *
 * Date: 2015-12-26
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["Isomer"] = factory();
	else
		root["Isomer"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Entry point for the Isomer API
	 */
	module.exports = __webpack_require__(4);


/***/ },
/* 1 */
/***/ function(module, exports) {

	function Point(x, y, z) {
	  if (this instanceof Point) {
	    this.x = (typeof x === 'number') ? x : 0;
	    this.y = (typeof y === 'number') ? y : 0;
	    this.z = (typeof z === 'number') ? z : 0;
	  } else {
	    return new Point(x, y, z);
	  }
	}


	Point.ORIGIN = new Point(0, 0, 0);


	/**
	 * Translate a point from a given dx, dy, and dz
	 */
	Point.prototype.translate = function(dx, dy, dz) {

	  dx = (typeof dx === 'number') ? dx : 0;
	  dy = (typeof dy === 'number') ? dy : 0;
	  dz = (typeof dz === 'number') ? dz : 0;

	  return new Point(
	    this.x + dx,
	    this.y + dy,
	    this.z + dz);
	};


	/**
	 * Scale a point about a given origin
	 */
	Point.prototype.scale = function(origin, dx, dy, dz) {
	  var p = this.translate(-origin.x, -origin.y, -origin.z);

	  if (dy === undefined && dz === undefined) {
	    /* If both dy and dz are left out, scale all coordinates equally */
	    dy = dz = dx;
	    /* If just dz is missing, set it equal to 1 */
	  } else {
	    dz = (typeof dz === 'number') ? dz : 1;
	  }

	  p.x *= dx;
	  p.y *= dy;
	  p.z *= dz;

	  return p.translate(origin.x, origin.y, origin.z);
	};

	/**
	 * Rotate about origin on the X axis
	 */
	Point.prototype.rotateX = function(origin, angle) {
	  var p = this.translate(-origin.x, -origin.y, -origin.z);

	  var z = p.z * Math.cos(angle) - p.y * Math.sin(angle);
	  var y = p.z * Math.sin(angle) + p.y * Math.cos(angle);
	  p.z = z;
	  p.y = y;

	  return p.translate(origin.x, origin.y, origin.z);
	};

	/**
	 * Rotate about origin on the Y axis
	 */
	Point.prototype.rotateY = function(origin, angle) {
	  var p = this.translate(-origin.x, -origin.y, -origin.z);

	  var x = p.x * Math.cos(angle) - p.z * Math.sin(angle);
	  var z = p.x * Math.sin(angle) + p.z * Math.cos(angle);
	  p.x = x;
	  p.z = z;

	  return p.translate(origin.x, origin.y, origin.z);
	};

	/**
	 * Rotate about origin on the Z axis
	 */
	Point.prototype.rotateZ = function(origin, angle) {
	  var p = this.translate(-origin.x, -origin.y, -origin.z);

	  var x = p.x * Math.cos(angle) - p.y * Math.sin(angle);
	  var y = p.x * Math.sin(angle) + p.y * Math.cos(angle);
	  p.x = x;
	  p.y = y;

	  return p.translate(origin.x, origin.y, origin.z);
	};


	/**
	 * The depth of a point in the isometric plane
	 */
	Point.prototype.depth = function() {
	  /* z is weighted slightly to accomodate |_ arrangements */
	  return this.x + this.y - 2 * this.z;
	};


	/**
	 * Distance between two points
	 */
	Point.distance = function(p1, p2) {
	  var dx = p2.x - p1.x;
	  var dy = p2.y - p1.y;
	  var dz = p2.z - p1.z;

	  return Math.sqrt(dx * dx + dy * dy + dz * dz);
	};


	module.exports = Point;


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var Point = __webpack_require__(1);

	/**
	 * Path utility class
	 *
	 * An Isomer.Path consists of a list of Isomer.Point's
	 */
	function Path(points) {
	  if (Object.prototype.toString.call(points) === '[object Array]') {
	    this.points = points;
	  } else {
	    this.points = Array.prototype.slice.call(arguments);
	  }
	}


	/**
	 * Pushes a point onto the end of the path
	 */
	Path.prototype.push = function(point) {
	  this.points.push(point);
	};


	/**
	 * Returns a new path with the points in reverse order
	 */
	Path.prototype.reverse = function() {
	  var points = Array.prototype.slice.call(this.points);

	  return new Path(points.reverse());
	};


	/**
	 * Translates a given path
	 *
	 * Simply a forward to Point#translate
	 */
	Path.prototype.translate = function() {
	  var args = arguments;

	  return new Path(this.points.map(function(point) {
	    return point.translate.apply(point, args);
	  }));
	};

	/**
	 * Returns a new path rotated along the X axis by a given origin
	 *
	 * Simply a forward to Point#rotateX
	 */
	Path.prototype.rotateX = function() {
	  var args = arguments;

	  return new Path(this.points.map(function(point) {
	    return point.rotateX.apply(point, args);
	  }));
	};

	/**
	 * Returns a new path rotated along the Y axis by a given origin
	 *
	 * Simply a forward to Point#rotateY
	 */
	Path.prototype.rotateY = function() {
	  var args = arguments;

	  return new Path(this.points.map(function(point) {
	    return point.rotateY.apply(point, args);
	  }));
	};

	/**
	 * Returns a new path rotated along the Z axis by a given origin
	 *
	 * Simply a forward to Point#rotateZ
	 */
	Path.prototype.rotateZ = function() {
	  var args = arguments;

	  return new Path(this.points.map(function(point) {
	    return point.rotateZ.apply(point, args);
	  }));
	};


	/**
	 * Scales a path about a given origin
	 *
	 * Simply a forward to Point#scale
	 */
	Path.prototype.scale = function() {
	  var args = arguments;

	  return new Path(this.points.map(function(point) {
	    return point.scale.apply(point, args);
	  }));
	};


	/**
	 * The estimated depth of a path as defined by the average depth
	 * of its points
	 */
	Path.prototype.depth = function() {
	  var i, total = 0;
	  for (i = 0; i < this.points.length; i++) {
	    total += this.points[i].depth();
	  }

	  return total / (this.points.length || 1);
	};


	/**
	 * Some paths to play with
	 */

	/**
	 * A rectangle with the bottom-left corner in the origin
	 */
	Path.Rectangle = function(origin, width, height) {
	  if (width === undefined) width = 1;
	  if (height === undefined) height = 1;

	  var path = new Path([
	    origin,
	    new Point(origin.x + width, origin.y, origin.z),
	    new Point(origin.x + width, origin.y + height, origin.z),
	    new Point(origin.x, origin.y + height, origin.z)
	  ]);

	  return path;
	};


	/**
	 * A circle centered at origin with a given radius and number of vertices
	 */
	Path.Circle = function(origin, radius, vertices) {
	  vertices = vertices || 20;
	  var i, path = new Path();

	  for (i = 0; i < vertices; i++) {
	    path.push(new Point(
	      radius * Math.cos(i * 2 * Math.PI / vertices),
	      radius * Math.sin(i * 2 * Math.PI / vertices),
	      0));
	  }

	  return path.translate(origin.x, origin.y, origin.z);
	};


	/**
	 * A star centered at origin with a given outer radius, inner
	 * radius, and number of points
	 *
	 * Buggy - concave polygons are difficult to draw with our method
	 */
	Path.Star = function(origin, outerRadius, innerRadius, points) {
	  var i, r, path = new Path();

	  for (i = 0; i < points * 2; i++) {
	    r = (i % 2 === 0) ? outerRadius : innerRadius;

	    path.push(new Point(
	      r * Math.cos(i * Math.PI / points),
	      r * Math.sin(i * Math.PI / points),
	      0));
	  }

	  return path.translate(origin.x, origin.y, origin.z);
	};


	/* Expose the Path constructor */
	module.exports = Path;


/***/ },
/* 3 */
/***/ function(module, exports) {

	function Canvas(elem) {
	  this.elem = elem;
	  this.ctx = this.elem.getContext('2d');

	  this.width = elem.width;
	  this.height = elem.height;

		this.ctx.lineWidth = 1,
	  this.ctx.fillStyle = '#000000';
	  this.ctx.strokeStyle = '#ffffff';
	}

	Canvas.prototype.clear = function() {
	  this.ctx.clearRect(0, 0, this.width, this.height);
	};

	Canvas.prototype.path = function(points) {
	  this.ctx.beginPath();
	  this.ctx.moveTo(points[0].x, points[0].y);

	  for (var i = 1; i < points.length; i++) {
	    this.ctx.lineTo(points[i].x, points[i].y);
	  }

	  this.ctx.closePath();

	  /* Set the strokeStyle and fillStyle */

		this.ctx.fill();
		this.ctx.stroke();
	};

	Canvas.prototype.draw = function() {
	}

	module.exports = Canvas;


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var Canvas = __webpack_require__(3);
	var Path = __webpack_require__(2);
	var Point = __webpack_require__(1);
	var Shape = __webpack_require__(5);


	/**
	 * The Isomer class
	 *
	 * This file contains the Isomer base definition
	 */
	function Isomer(canvasId, options) {
	  options = options || {};

	  this.canvas = new Canvas(canvasId);
	  this.angle = Math.PI / 6;

	  this.scale = options.scale || 70;

	  this._calculateTransformation();

	  this.originX = options.originX || this.canvas.width / 2;
	  this.originY = options.originY || this.canvas.height * 0.9;
	}



	Isomer.prototype._translatePoint = function(point) {
	  /**
	   * X rides along the angle extended from the origin
	   * Y rides perpendicular to this angle (in isometric view: PI - angle)
	   * Z affects the y coordinate of the drawn point
	   */
	  var xMap = new Point(point.x * this.transformation[0][0],
	                       point.x * this.transformation[0][1]);

	  var yMap = new Point(point.y * this.transformation[1][0],
	                       point.y * this.transformation[1][1]);

	  var x = this.originX + xMap.x + yMap.x;
	  var y = this.originY - xMap.y - yMap.y - (point.z * this.scale);
	  return new Point(x, y);
	};


	/**
	 * Adds a shape or path to the scene
	 *
	 * This method also accepts arrays
	 */
	Isomer.prototype.add = function(item) {
	  if (Object.prototype.toString.call(item) == '[object Array]') {
	    for (var i = 0; i < item.length; i++) {
	      this.add(item[i]);
	    }
	  } else if (item instanceof Path) {
	    this._addPath(item);
	  } else if (item instanceof Shape) {
	    /* Fetch paths ordered by distance to prevent overlaps */
	    var paths = item.orderedPaths();

	    for (var j = 0; j < paths.length; j++) {
	      this._addPath(paths[j]);
	    }
	  }
	};


	/**
	 * Adds a path to the scene
	 */
	Isomer.prototype._addPath = function(path) {
	  this.canvas.path(path.points.map(this._translatePoint.bind(this)));
	};

	/**
	 * Precalculates transformation values based on the current angle and scale
	 * which in theory reduces costly cos and sin calls
	 */
	Isomer.prototype._calculateTransformation = function() {
	  this.transformation = [
	    [
	      this.scale * Math.cos(this.angle),
	      this.scale * Math.sin(this.angle)
	    ],
	    [
	      this.scale * Math.cos(Math.PI - this.angle),
	      this.scale * Math.sin(Math.PI - this.angle)
	    ]
	  ];
	};

	/* Namespace our primitives */
	Isomer.Canvas = Canvas;
	Isomer.Path = Path;
	Isomer.Point = Point;
	Isomer.Shape = Shape;

	/* Expose Isomer API */
	module.exports = Isomer;


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var Path = __webpack_require__(2);
	var Point = __webpack_require__(1);

	/**
	 * Shape utility class
	 *
	 * An Isomer.Shape consists of a list of Isomer.Path's
	 */
	function Shape(paths) {
	  if (Object.prototype.toString.call(paths) === '[object Array]') {
	    this.paths = paths;
	  } else {
	    this.paths = Array.prototype.slice.call(arguments);
	  }
	}


	/**
	 * Pushes a path onto the end of the Shape
	 */
	Shape.prototype.push = function(path) {
	  this.paths.push(path);
	};


	/**
	 * Translates a given shape
	 *
	 * Simply a forward to Path#translate
	 */
	Shape.prototype.translate = function() {
	  var args = arguments;

	  return new Shape(this.paths.map(function(path) {
	    return path.translate.apply(path, args);
	  }));
	};

	/**
	 * Rotates a given shape along the X axis around a given origin
	 *
	 * Simply a forward to Path#rotateX
	 */
	Shape.prototype.rotateX = function() {
	  var args = arguments;

	  return new Shape(this.paths.map(function(path) {
	    return path.rotateX.apply(path, args);
	  }));
	};

	/**
	 * Rotates a given shape along the Y axis around a given origin
	 *
	 * Simply a forward to Path#rotateY
	 */
	Shape.prototype.rotateY = function() {
	  var args = arguments;

	  return new Shape(this.paths.map(function(path) {
	    return path.rotateY.apply(path, args);
	  }));
	};

	/**
	 * Rotates a given shape along the Z axis around a given origin
	 *
	 * Simply a forward to Path#rotateZ
	 */
	Shape.prototype.rotateZ = function() {
	  var args = arguments;

	  return new Shape(this.paths.map(function(path) {
	    return path.rotateZ.apply(path, args);
	  }));
	};

	/**
	 * Scales a path about a given origin
	 *
	 * Simply a forward to Point#scale
	 */
	Shape.prototype.scale = function() {
	  var args = arguments;

	  return new Shape(this.paths.map(function(path) {
	    return path.scale.apply(path, args);
	  }));
	};


	/**
	 * Produces a list of the shape's paths ordered by distance to
	 * prevent overlaps when drawing
	 */
	Shape.prototype.orderedPaths = function() {
	  var paths = this.paths.slice();

	  /**
	   * Sort the list of faces by distance then map the entries, returning
	   * only the path and not the added "further point" from earlier.
	   */
	  return paths.sort(function(pathA, pathB) {
	    return pathB.depth() - pathA.depth();
	  });
	};


	/**
	 * Utility function to create a 3D object by raising a 2D path
	 * along the z-axis
	 */
	Shape.extrude = function(path, height) {
	  height = (typeof height === 'number') ? height : 1;

	  var i, topPath = path.translate(0, 0, height);
	  var shape = new Shape();

	  /* Push the top and bottom faces, top face must be oriented correctly */
	  shape.push(path.reverse());
	  shape.push(topPath);

	  /* Push each side face */
	  for (i = 0; i < path.points.length; i++) {
	    shape.push(new Path([
	      topPath.points[i],
	      path.points[i],
	      path.points[(i + 1) % path.points.length],
	      topPath.points[(i + 1) % topPath.points.length]
	    ]));
	  }

	  return shape;
	};


	/**
	 * Some shapes to play with
	 */

	/**
	 * A prism located at origin with dimensions dx, dy, dz
	 */
	Shape.Prism = function(origin, dx, dy, dz) {
	  dx = (typeof dx === 'number') ? dx : 1;
	  dy = (typeof dy === 'number') ? dy : 1;
	  dz = (typeof dz === 'number') ? dz : 1;

	  /* The shape we will return */
	  var prism = new Shape();

	  /* Squares parallel to the x-axis */
	  var face1 = new Path([
	    origin,
	    new Point(origin.x + dx, origin.y, origin.z),
	    new Point(origin.x + dx, origin.y, origin.z + dz),
	    new Point(origin.x, origin.y, origin.z + dz)
	  ]);

	  /* Push this face and its opposite */
	  prism.push(face1);
	  prism.push(face1.reverse().translate(0, dy, 0));

	  /* Square parallel to the y-axis */
	  var face2 = new Path([
	    origin,
	    new Point(origin.x, origin.y, origin.z + dz),
	    new Point(origin.x, origin.y + dy, origin.z + dz),
	    new Point(origin.x, origin.y + dy, origin.z)
	  ]);
	  prism.push(face2);
	  prism.push(face2.reverse().translate(dx, 0, 0));

	  /* Square parallel to the xy-plane */
	  var face3 = new Path([
	    new Point(origin.x, origin.y, origin.z + dz),
	    new Point(origin.x + dx, origin.y, origin.z + dz),
	    new Point(origin.x + dx, origin.y + dy, origin.z + dz),
	    new Point(origin.x, origin.y + dy, origin.z + dz)
	  ]);
	  /* This surface is oriented backwards, so we need to reverse the points */
	  prism.push(face3);
	  // prism.push(face3.translate(0, 0, dz));

	  return prism;
	};


	module.exports = Shape;


/***/ }
/******/ ])
});
;
