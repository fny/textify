// A simple shim for `requestAnimationFrame`
window.requestAnimationFrame = window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.msRequestAnimationFrame ||
  window.oRequestAnimationFrame ||
  function(f) {
    window.setTimeout(f, 1e3/60);
  };