/******/ (function(modules) { // webpackBootstrap
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

	const vertexShader = __webpack_require__(1);
	const fragmShader = __webpack_require__(2);

	var canvas = document.getElementById('canvas');
	var gl = canvas.getContext('webgl');
	var stageW;
	var stageH;
	var centerX;
	var centerY;
	var animReq;
	var worldMatrix = new Float32Array(9);

	function resize() {
	  stageW = canvas.width = window.innerWidth;
	  stageH = canvas.height = window.innerHeight;
	  centerX = stageW / 2;
	  centerY = stageH / 2;

	  worldMatrix[0] = 2 / stageW;
	  worldMatrix[4] = -2 / stageH;
	  worldMatrix[6] = -1;
	  worldMatrix[7] = 1;
	  worldMatrix[8] = 1;

	  gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
	}

	function init() {
	  gl.disable(gl.DEPTH_TEST);
	  gl.disable(gl.CULL_FACE);
	  gl.enable(gl.BLEND);
	  gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
	  gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

	  // ...

	  resize();

	  draw();
	}

	function draw() {

	  animReq = requestAnimationFrame(draw);
	}

	init();

	window.onresize = resize;


/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = "attribute vec2 aPosition;\nattribute vec2 aTexCoord;\nattribute float aRotation;\nattribute vec2 aTranslate;\nvarying vec2 vTexCoord;\nuniform mat3 uMatrix;\n\nvoid main(void) {\n  vec2 pos = aPosition;\n  pos.x = aPosition.x * cos(aRotation) - aPosition.y * sin(aRotation);\n  pos.y = aPosition.x * sin(aRotation) + aPosition.y * cos(aRotation);\n  pos = pos + aTranslate;\n  gl_Position = vec4((uMatrix * vec3(pos, 1)).xy, 0.0, 1.0);\n  vTexCoord = aTexCoord;\n}"

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = "precision lowp float;\nuniform sampler2D uImage;\nvarying vec2 vTexCoord;\n\nvoid main() {\n  vec4 color = texture2D(uImage, vTexCoord);\n  if (color.a == 0.0) discard;\n  gl_FragColor = color;\n}"

/***/ }
/******/ ]);