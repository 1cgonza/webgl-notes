attribute vec2 aPosition;
attribute vec2 aTexCoord;
attribute float aRotation;
attribute vec2 aTranslate;
varying vec2 vTexCoord;
uniform mat3 uMatrix;

void main(void) {
  vec2 pos = aPosition;
  vec3 grid;
  mediump vec4 newPos;

  float cosR = cos(aRotation);
  float sinR = sin(aRotation);
  pos.x = ((aPosition.x * cosR) - (aPosition.y * sinR));
  pos.y = ((aPosition.x * sinR) + (aPosition.y * cosR));
  pos = (pos + aTranslate);

  grid.z = 1.0;
  grid.xy = pos;

  newPos.zw = vec2(0.0, 1.0);
  newPos.xy = (uMatrix * grid).xy;
  gl_Position = newPos;
  vTexCoord = aTexCoord;
}