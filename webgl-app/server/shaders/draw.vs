attribute vec2 aPosition;
attribute vec2 aTexCoord;
attribute float aRotation;
attribute vec2 aTranslate;
varying vec2 vTexCoord;
uniform mat3 uMatrix;

void main(void) {
  vec2 pos = aPosition;
  pos.x = aPosition.x * cos(aRotation) - aPosition.y * sin(aRotation);
  pos.y = aPosition.x * sin(aRotation) + aPosition.y * cos(aRotation);
  pos = pos + aTranslate;
  gl_Position = vec4((uMatrix * vec3(pos, 1)).xy, 0.0, 1.0);
  vTexCoord = aTexCoord;
}