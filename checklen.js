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
  const int w = 640; //textureSize(u_texture, 0).x;
  const float th = .3;
  int max = 0;
  int cnt = 0;
  int x = 0;
  int state = 0;
  for (int i = 0; i < w; i++) {
    vec2 pos = vec2(float(i) / float(w), position.y);
    vec3 color = texture2D(u_texture, pos).rgb;
    float gray = color.r * 0.299 + color.g * 0.587 + color.b * 0.114;
    float mono = gray < th ? 0.0 : 1.0;
    if (mono == 1.0) {
      cnt++;
    } else {
      if (cnt > max) {
        max = cnt;
        if (max > 0) {
          x = i - max / 2;
        }
      }
      cnt = 0;
    }
  }
  int n = x;
  float r = mod(float(n), 255.0) / 255.0;
  float g = float(n / 256) / 255.0;
  gl_FragColor = vec4(r, g, position.x - 0.5, 1.0);
}
`;
};
