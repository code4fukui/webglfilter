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
varying vec2 v_coordinate; // from vertex shader

uniform vec2 imageSize;
uniform sampler2D u_texture;

void main() {
  vec2 position = vec2(v_coordinate.x, 1.0 - v_coordinate.y);
  vec3 color = texture2D(u_texture, position).rgb;
  float gray = color.r * 0.299 + color.g * 0.587 + color.b * 0.114;
  float mono = gray < 0.5 ? 0.0 : 1.0;
  gl_FragColor = vec4(mono, mono, mono, 1.0);
}
`;
};
