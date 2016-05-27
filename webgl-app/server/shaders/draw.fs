precision lowp float;
uniform sampler2D uImage;
varying vec2 vTexCoord;

void main() {
  vec4 color = texture2D(uImage, vTexCoord);
  if (color.a == 0.0) discard;
  gl_FragColor = color;
}