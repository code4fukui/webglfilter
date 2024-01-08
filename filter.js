let gl;
let texture;
let imageSizeLocation;

export const init = (canvas, vertexShaderSource, fragmentShaderSource) => {
  gl = canvas.getContext("webgl");
  const vertexShader = compileShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
  const program = createProgram(gl, vertexShader, fragmentShader);

  const positionAttributeLocation = gl.getAttribLocation(program, "position");
  imageSizeLocation = gl.getUniformLocation(program, "imageSize");

  // binding the position buffer to positionBuffer
  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.useProgram(program);
  gl.enableVertexAttribArray(positionAttributeLocation);
  gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);
  const points = new Float32Array([-1, -1, -1, 1, 1, -1, 1, 1, 1, -1, -1, 1]);
  gl.bufferData(gl.ARRAY_BUFFER, points, gl.STATIC_DRAW);

  texture = initTexture(gl);
};

export function filterImage(canvas, video) {
  //gl.clearColor(1, 1, 0, 1);
  //gl.clear(gl.COLOR_BUFFER_BIT);
  const w = canvas.width;
  const h = canvas.height;
  gl.viewport(0, 0, w, h);
  updateTexture(gl, texture, video);

  // setting up the size of the image
  //gl.uniform2f(imageSizeLocation, canvas.width, canvas.height);
  gl.uniform2f(imageSizeLocation, w, h);

  gl.drawArrays(gl.TRIANGLES, 0, 6);
  return gl;
}

function compileShader(gl, type, shaderSource) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, shaderSource);
  gl.compileShader(shader);
  const res = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (!res) {
    // logging the error message on failure
    const err = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    console.log(err);
    throw new Exception(err);
  }
  return shader;
}

function createProgram(gl, vertexShader, fragmentShader) {
  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const err = gl.getProgramInfoLog(program);
    gl.deleteProgram(program);
    console.log(err);
    throw new Exception(err);
  }
  return program;
}

function initTexture(gl) {
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Because video has to be download over the internet
  // they might take a moment until it's ready so
  // put a single pixel in the texture so we can
  // use it immediately.
  const level = 0;
  const internalFormat = gl.RGBA;
  const width = 1;
  const height = 1;
  const border = 0;
  const srcFormat = gl.RGBA;
  const srcType = gl.UNSIGNED_BYTE;
  const pixel = new Uint8Array([0, 0, 255, 255]); // opaque blue
  gl.texImage2D(
    gl.TEXTURE_2D,
    level,
    internalFormat,
    width,
    height,
    border,
    srcFormat,
    srcType,
    pixel,
  );

  // Turn off mips and set wrapping to clamp to edge so it
  // will work regardless of the dimensions of the video.
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  return texture;
}
function updateTexture(gl, texture, video) {
  const level = 0;
  const internalFormat = gl.RGBA;
  const srcFormat = gl.RGBA;
  const srcType = gl.UNSIGNED_BYTE;
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(
    gl.TEXTURE_2D,
    level,
    internalFormat,
    srcFormat,
    srcType,
    video,
  );
}
