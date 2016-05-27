const vertexShader = require('./shaders/draw.vs');
const fragmShader = require('./shaders/draw.fs');

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
