let W = 1200 //background canvas width
let H = 500 //background canvas height
let Wsim = W * 0.69 - 20 //sim canvas width
let Hsim = H - 20 //sim canvas height
let Wplot = 0.25 * W //plotting canvas width
let Hplot = 0.875 * H //plotting canvas height

function setup() {

  let bgCanvas = createCanvas(W, H)


  gridCanvas = createGraphics(Wsim, Hsim)
  let nDiv = 10 // #gridlines

  gridCanvas.clear()
  gridCanvas.stroke(150)
  gridCanvas.strokeWeight(1)
  for (let i = 0; i < nDiv; i++) {
    gridCanvas.line(i * Wsim / nDiv, 0, i * Wsim / nDiv, Hsim)
    gridCanvas.line(0, i * Hsim / nDiv, Wsim, i * Hsim / nDiv)
  }

  simCanvas = createGraphics(Wsim, Hsim)
}

function draw() {
  background(20)
  simCanvas.clear()
  simCanvas.stroke(255)
  simCanvas.strokeWeight(2)
  simCanvas.noFill()
  simCanvas.rect(2, 2, Wsim - 4, Hsim - 4)


  //grid lines
  image(gridCanvas, 10, 10)
  //sim canvas
  image(simCanvas, 10, 10);
}