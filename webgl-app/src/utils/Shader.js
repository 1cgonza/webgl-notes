// I am learning from the ground up, so this is incomplete and far from ready to use
// For a solid NPM module, use gl-shader instead: https://www.npmjs.com/package/gl-shader
// I am looking at their code to do what you see here.

var glToGlsl = {                // webgl types    uniform method
  // Floats
  'FLOAT':        'float',      // 5126           gl.uniform1f (loc, v);        || gl.uniform1fv (loc, [1x]);
  'FLOAT_VEC2':   'vec2',       // 35664          gl.uniform2f (loc, v0, ...);  || gl.uniform2fv (loc, [2x]);
  'FLOAT_VEC3':   'vec3',       // 35665          gl.uniform3f (loc, v0, ...);  || gl.uniform3fv (loc, [3x]);
  'FLOAT_VEC4':   'vec4',       // 35666          gl.uniform4f (loc, v0, ...);  || gl.uniform4fv (loc, [4x]);

  // Matrices
  'FLOAT_MAT2':   'mat2',       // 35674          gl.uniformMatrix2fv (loc, false, [ 2x2 ]);
  'FLOAT_MAT3':   'mat3',       // 35675          gl.uniformMatrix3fv (loc, false, [ 3x3 ]);
  'FLOAT_MAT4':   'mat4',       // 35676          gl.uniformMatrix4fv (loc, false, [ 4x4 ]);

  // Integers
  'INT':          'int',        // 5124           gl.uniform1i (loc, v);        || gl.uniform1iv (loc, [1x]);
  'INT_VEC2':     'ivec2',      // 35667          gl.uniform2i (loc, v0, ...);  || gl.uniform2iv (loc, [2x]);
  'INT_VEC3':     'ivec3',      // 35668          gl.uniform3i (loc, v0, ...);  || gl.uniform3iv (loc, [3x]);
  'INT_VEC4':     'ivec4',      // 35669          gl.uniform4i (loc, v0, ...);  || gl.uniform4iv (loc, [4x]);

  // Booleans
  'BOOL':         'bool',       // 35670          TODO: gl.uniform1f
  'BOOL_VEC2':    'bvec2',      // 35671          TODO: gl.uniform2f
  'BOOL_VEC3':    'bvec3',      // 35672          TODO: gl.uniform3f
  'BOOL_VEC4':    'bvec4',      // 35673          TODO: gl.uniform4f

  // Samplers (textures)
  'SAMPLER_2D':   'sampler2D',  // 35678          gl.uniform1i (loc, v); || gl.uniform1iv(loc, [x]);
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

var Shader = function(gl, vertS, fragS) {
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

Shader.prototype.bind = function() {
  this.gl.useProgram(this.program);
};
