/**
 * creates a rectangle at the given position with corners of radius r
 * @link https://stackoverflow.com/questions/1255512/how-to-draw-a-rounded-rectangle-using-html-canvas
 * used second answer
 * @param {CanvasRenderingContext2D} ctx the current rendering context to use
 * @param {number} x start x position
 * @param {number} y start y position
 * @param {number} w rectangle width
 * @param {number} h rectangle height
 * @param {number} r the radius for the rounded corners
 */
function roundRect(ctx, x, y, w, h, r) {
  if (w < 2 * r) r = w / 2;
  if (h < 2 * r) r = h / 2;
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}