export const getVertexShaderSource = () => `
attribute vec2 position;
varying vec2 v_coordinate;

void main() {
  gl_Position = vec4(position, 0, 1);
  v_coordinate = gl_Position.xy * 0.5 + 0.5;
}
`;

export const getFragmentShaderSource = () => {
  return `
precision mediump float;
// the varible defined in the vertex shader above
varying vec2 v_coordinate;

uniform vec2 imageSize;
uniform sampler2D u_texture;

void main() {
  vec2 position = vec2(v_coordinate.x, 1.0 - v_coordinate.y);
  const float dot = 20.0;
  float dotw = dot / imageSize.x;
  float doth = dot / imageSize.y;
  vec2 p2 = vec2(floor(position.x / dotw) * dotw + dotw / 2.0, floor(position.y / doth) * doth + doth / 2.0);
  if (distance(p2, vec2(0.5, 0.5)) < 0.2) {
    vec3 color = texture2D(u_texture, p2).rgb;
    gl_FragColor = vec4(color, 1.0);
  } else {
    vec3 color = texture2D(u_texture, position).rgb;
    gl_FragColor = vec4(color, 1.0);
  }
}
`;
};

