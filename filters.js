// https://img.ly/blog/how-to-add-image-filters-in-webgl/

export const filters = {
  Identity: [0, 0, 0, 0, 1, 0, 0, 0, 0],
  "Box Blur": [0.111, 0.111, 0.111, 0.111, 0.111, 0.111, 0.111, 0.111, 0.111],
  "Gaussian Blur": [
    0.0625,
    0.125,
    0.0625,
    0.125,
    0.25,
    0.125,
    0.0625,
    0.125,
    0.0625
  ],
  Sharpen: [0, -1, 0, -1, 5, -1, 0, -1, 0],
  Unsharpen: [-1, -1, -1, -1, 9, -1, -1, -1, -1],
  "Edge Detection": [-1, -1, -1, -1, 8, -1, -1, -1, -1],
  Emboss: [-2, -1, 0, -1, 1, 1, 0, 1, 2]
};

export const getVertexShaderSource = () => `
attribute vec2 position;
varying vec2 v_coordinate;

void main() {
  gl_Position = vec4(position, 0, 1);
  v_coordinate = gl_Position.xy * 0.5 + 0.5;
}
`;

export const getFragmentShaderSource = (kernel) => {
  // assuming the kernel is a square matrix
  const kernelSize = Math.sqrt(kernel.length);
  return `
precision mediump float;
// the varible defined in the vertex shader above
varying vec2 v_coordinate;

uniform vec2 imageSize;
uniform sampler2D u_texture;

void main() {
  vec2 position = vec2(v_coordinate.x, 1.0 - v_coordinate.y);
  //vec2 onePixel = vec2(1, 1) / imageSize;
  vec2 onePixel = vec2(1, 1) / imageSize;
  vec4 color = vec4(0);
  mat3 kernel = mat3(
    ${kernel.join(",")}
  );

  // implementing the convolution operation
  for (int i = 0; i < ${kernelSize}; i++) {
    for (int j = 0; j < ${kernelSize}; j++) {
      // retrieving the sample position pixel
      vec2 samplePosition = position + vec2(i - 1 , j - 1) * onePixel;
      // retrieving the sample color
      vec4 sampleColor = texture2D(u_texture, samplePosition);
      sampleColor *= kernel[i][j];
      color += sampleColor;
    }
  }
  color.a = 1.0;
  gl_FragColor = color;
}
`;
};

