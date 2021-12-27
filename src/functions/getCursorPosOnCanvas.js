/**
 * Gets the x, y cords on the given canvas element where clicked
 * @param {HTMLCanvasElement} canvas 
 * @param {MouseEvent} event 
 * @returns {[number, number]}
 */
function getCursorPosition(canvas, event) {
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  return [x, y];
}