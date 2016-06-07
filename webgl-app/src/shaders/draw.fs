precision mediump float;
uniform sampler2D uImage;
varying vec2 vTexCoord;
void main ()
{
  mediump vec4 color;
  color = texture2D(uImage, vTexCoord);
  if (color.w == 0.0) {
    discard;
  }
  gl_FragColor = color;
}
