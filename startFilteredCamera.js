import { Camera } from "https://code4fukui.github.io/Camera/Camera.js";

export const startFilteredCamera = (videoElement, canvas, filterImage, linemode = false, callback) => {
  const camera = new Camera(videoElement, {
    onFrame: async () => {
      const img = videoElement;
      if (linemode) {
        const w = img.videoWidth;
        const h = img.videoHeight;
        if (h != canvas.height) {
          canvas.width = 1;
          canvas.height = h
          canvas.style.width = w + "px";
          canvas.style.height = h + "px";
        }
      } else {
        const w = img.videoWidth;
        const h = img.videoHeight;
        if (w != canvas.width || h != canvas.height) {
          canvas.width = w;
          canvas.height = h
          canvas.style.width = w + "px";
          canvas.style.height = h + "px";
        }
      }
      const gl = filterImage(canvas, img);
      if (callback) callback(gl);
    },
    width: 1280,
    height: 720,
    backcamera: backcameramode?.checked,
  });
  camera.start();
  if (window.backcameramode) backcameramode.onchange = () => camera.flip();
};
