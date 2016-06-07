/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _draw = __webpack_require__(1);
	
	var _draw2 = _interopRequireDefault(_draw);
	
	var _draw3 = __webpack_require__(2);
	
	var _draw4 = _interopRequireDefault(_draw3);
	
	var _Shader = __webpack_require__(3);
	
	var _Shader2 = _interopRequireDefault(_Shader);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
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
	  var shader = new _Shader2.default(gl, _draw2.default, _draw4.default);
	
	  shader.bind();
	
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

	module.exports = "attribute vec2 aPosition;\nattribute vec2 aTexCoord;\nattribute float aRotation;\nattribute vec2 aTranslate;\nvarying vec2 vTexCoord;\nuniform mat3 uMatrix;\n\nvoid main(void) {\n  vec2 pos = aPosition;\n  vec3 grid;\n  mediump vec4 newPos;\n\n  float cosR = cos(aRotation);\n  float sinR = sin(aRotation);\n  pos.x = ((aPosition.x * cosR) - (aPosition.y * sinR));\n  pos.y = ((aPosition.x * sinR) + (aPosition.y * cosR));\n  pos = (pos + aTranslate);\n\n  grid.z = 1.0;\n  grid.xy = pos;\n\n  newPos.zw = vec2(0.0, 1.0);\n  newPos.xy = (uMatrix * grid).xy;\n  gl_Position = newPos;\n  vTexCoord = aTexCoord;\n}"

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = "precision mediump float;\nuniform sampler2D uImage;\nvarying vec2 vTexCoord;\nvoid main ()\n{\n  vec4 color = texture2D(uImage, vTexCoord);\n  if (color.a == 0.0) {\n    discard;\n  }\n  gl_FragColor = color;\n}"

/***/ },
/* 3 */
/***/ function(module, exports) {

	'use strict';
	
	var glToGlsl = { // webgl types    uniform method
	  // Floats
	  'FLOAT': 'float', // 5126           gl.uniform1f (loc, v);        || gl.uniform1fv (loc, [1x]);
	  'FLOAT_VEC2': 'vec2', // 35664          gl.uniform2f (loc, v0, ...);  || gl.uniform2fv (loc, [2x]);
	  'FLOAT_VEC3': 'vec3', // 35665          gl.uniform3f (loc, v0, ...);  || gl.uniform3fv (loc, [3x]);
	  'FLOAT_VEC4': 'vec4', // 35666          gl.uniform4f (loc, v0, ...);  || gl.uniform4fv (loc, [4x]);
	
	  // Matrices
	  'FLOAT_MAT2': 'mat2', // 35674          gl.uniformMatrix2fv (loc, false, [ 2x2 ]);
	  'FLOAT_MAT3': 'mat3', // 35675          gl.uniformMatrix3fv (loc, false, [ 3x3 ]);
	  'FLOAT_MAT4': 'mat4', // 35676          gl.uniformMatrix4fv (loc, false, [ 4x4 ]);
	
	  // Integers
	  'INT': 'int', // 5124           gl.uniform1i (loc, v);        || gl.uniform1iv (loc, [1x]);
	  'INT_VEC2': 'ivec2', // 35667          gl.uniform2i (loc, v0, ...);  || gl.uniform2iv (loc, [2x]);
	  'INT_VEC3': 'ivec3', // 35668          gl.uniform3i (loc, v0, ...);  || gl.uniform3iv (loc, [3x]);
	  'INT_VEC4': 'ivec4', // 35669          gl.uniform4i (loc, v0, ...);  || gl.uniform4iv (loc, [4x]);
	
	  // Booleans
	  'BOOL': 'bool', // 35670          TODO: gl.uniform1f
	  'BOOL_VEC2': 'bvec2', // 35671          TODO: gl.uniform2f
	  'BOOL_VEC3': 'bvec3', // 35672          TODO: gl.uniform3f
	  'BOOL_VEC4': 'bvec4', // 35673          TODO: gl.uniform4f
	
	  // Samplers (textures)
	  'SAMPLER_2D': 'sampler2D', // 35678          gl.uniform1i (loc, v); || gl.uniform1iv(loc, [x]);
	  'SAMPLER_CUBE': 'samplerCube' // 35680          gl.uniform1i (loc, v); || gl.uniform1iv(loc, [x]);
	};
	
	var glslTypes = {};
	
	function getTypes(gl) {
	  var glTypes = Object.keys(glToGlsl);
	  for (var i = 0; i < glTypes.length; i++) {
	    var glslType = gl[glTypes[i]];
	    glslTypes[glslType] = glToGlsl[glTypes[i]];
	  }
	}
	
	var Shader = function Shader(gl, vertS, fragS) {
	  var program = gl.createProgram();
	  var vShader = gl.createShader(gl.VERTEX_SHADER);
	  var fShader = gl.createShader(gl.FRAGMENT_SHADER);
	
	  gl.shaderSource(vShader, vertS);
	  gl.compileShader(vShader);
	  gl.attachShader(program, vShader);
	
	  gl.shaderSource(fShader, fragS);
	  gl.compileShader(fShader);
	  gl.attachShader(program, fShader);
	
	  gl.linkProgram(program);
	
	  // delete shaders from memory
	  gl.deleteShader(vShader);
	  gl.deleteShader(fShader);
	
	  var linked = gl.getProgramParameter(program, gl.LINK_STATUS);
	  if (!linked) {
	    var lastError = gl.getProgramInfoLog(program);
	    console.error('Error in program linking:' + lastError);
	
	    gl.deleteProgram(program);
	    return null;
	  }
	  this.gl = gl;
	  this.program = program;
	  this.stride = 0;
	  this.attributes = {};
	  this.uniforms = {};
	
	  getTypes(gl);
	  var attribsCount = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);
	
	  for (var i = 0; i < attribsCount; i++) {
	    var attrib = gl.getActiveAttrib(program, i);
	    this.attributes[attrib.name] = {
	      loc: gl.getAttribLocation(program, attrib.name),
	      type: glslTypes[attrib.type]
	    };
	    var type = this.attributes[attrib.name].type;
	    var typeSize = type.charAt(type.length - 1) | 0;
	    typeSize = typeSize === 0 ? 1 : typeSize;
	    this.attributes[attrib.name].size = typeSize;
	    this.stride += typeSize;
	  }
	
	  var uniformCount = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
	
	  for (var i = 0; i < uniformCount; i++) {
	    var uniform = gl.getActiveUniform(program, i);
	    this.uniforms[uniform.name] = {
	      loc: gl.getUniformLocation(program, uniform.name),
	      type: glslTypes[uniform.type]
	    };
	  }
	};
	
	module.exports = Shader;
	
	Shader.prototype.bind = function () {
	  this.gl.useProgram(this.program);
	};

/***/ }
/******/ ]);
//# sourceMappingURL=scripts.js.map