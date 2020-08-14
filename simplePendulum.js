let W = 1200
let H = 500
let Wsim = W * 0.69
let Hsim = H
let Wplot = 0.25 * W
let Hplot = 0.875 * H
let timestep = 0
let numP = 0
let scale = 200;
let dd14, dd15;

let tSlider, mSlider, FSlider, wSlider, gSlider, bSlider, pSlider, checkbox1, sSlider, fSlider;
let par = {
  theta: 0.785, // Angle
  omega: 0, // Angular velocity
  alpha: 0, // Angular acceleration
  dt: 0.001, // Initial time step size
  mass: 0.5, // Mass in kg
  length: 1, // Pendulum length
  hinge: [217, 136], // Hinge location
  g: 9.8 / 3600, // g adjusted
  radius: 30,
  b: 0
};


function setup() {
  let bgCanvas = createCanvas(W, H)
  let dd = makeDropdown(bgCanvas);
  dd.parentElement.children[1].innerHTML = "Options";
  let dd1 = makeItem(dd);
  dd1.parentElement.children[1].innerHTML = "Parameters";

  //Length
  dd14 = makeRow(dd1)
  dd14.innerHTML = "Length (m) = " + Number(par.length).toFixed(2);
  //mass
  let dd11 = makeRow(dd1);
  let mSliderContainer = makeSlider(dd11);
  mSlider = mSliderContainer['slider'];
  mSliderContainer['valueLabel'].innerHTML = mSlider.value;
  mSliderContainer['label'].innerHTML = "Mass";
  [mSlider.min, mSlider.max, mSlider.step, mSlider.value] = [0.1, 10, 0.1, 1]
  mSlider.oninput = () => {
    mSliderContainer["valueLabel"].innerHTML = Number(mSlider.value).toFixed(2)
    par.mass = mSlider.value
    par.radius = 30 * par.mass ** 0.25
  }

  //gravity
  let dd12 = makeRow(dd1);
  let gSliderContainer = makeSlider(dd12);
  gSlider = gSliderContainer['slider'];
  gSliderContainer['valueLabel'].innerHTML = gSlider.value;
  gSliderContainer['label'].innerHTML = "g (m/s^2)";
  [gSlider.min, gSlider.max, gSlider.step, gSlider.value] = [0, 100, 0.1, 9.8]
  gSlider.oninput = () => {
    gSliderContainer["valueLabel"].innerHTML = Number(gSlider.value).toFixed(2)
    par.g = gSlider.value / 3600
  }

  //drag
  let dd13 = makeRow(dd1);
  let bSliderContainer = makeSlider(dd13);
  bSlider = bSliderContainer['slider'];
  bSliderContainer['valueLabel'].innerHTML = bSlider.value;
  bSliderContainer['label'].innerHTML = "Drag coefficient";
  [bSlider.min, bSlider.max, bSlider.step, bSlider.value] = [0, 0.02, 0.0005, 0]
  bSlider.oninput = () => {
    bSliderContainer["valueLabel"].innerHTML = Number(bSlider.value).toFixed(2)
    par.b = bSlider.value
  }

  //driving frequency
  // let dd141 = makeRow(dd1);
  // let wSliderContainer = makeSlider(dd141);
  // wSlider = wSliderContainer['slider'];
  // wSliderContainer['valueLabel'].innerHTML = wSlider.value;
  // wSliderContainer['label'].innerHTML = "Angular frequency";
  // [wSlider.min, wSlider.max, wSlider.step, wSlider.value] = [20, 120, 1, 50]
  // wSlider.oninput = () => {
  //   wSliderContainer["valueLabel"].innerHTML = Number(wSlider.value).toFixed(3)
  // }
  //
  // let dd142 = makeRow(dd1);
  // //driving amplitude
  // let FSliderContainer = makeSlider(dd142);
  // FSlider = FSliderContainer['slider'];
  // FSliderContainer['valueLabel'].innerHTML = FSlider.value;
  // wSliderContainer['label'].innerHTML = "Amplitude";
  // [FSlider.min, FSlider.max, FSlider.step, FSlider.value] = [0, 10, 0.01, 0]
  // FSlider.oninput = () => {
  //   FSliderContainer["valueLabel"].innerHTML = Number(FSlider.value).toFixed(3)
  // }
  //
  // let dd143 = makeRow(dd1);
  // //driving phase
  // let pSliderContainer = makeSlider(dd143);
  // pSlider = pSliderContainer['slider'];
  // pSliderContainer['valueLabel'].innerHTML = pSlider.value;
  // pSliderContainer['label'].innerHTML = "Phase";
  // [pSlider.min, pSlider.max, pSlider.step, pSlider.value] = [0, 2 * PI, 0.001, 0]
  // pSlider.oninput = () => {
  //   pSliderContainer["valueLabel"].innerHTML = Number(pSlider.value).toFixed(3)
  // }

  let dd2 = makeItem(dd);
  dd2.parentElement.children[1].innerHTML = "UI";
  let dd21 = makeRow(dd2);
  let checkboxContainer = makeCheckbox(dd21);
  checkbox1 = checkboxContainer['checkbox'];
  checkboxContainer['label'].innerHTML = "Show plots";
  checkbox1.checked = true

  let dd22 = makeRow(dd2);
  let sSliderContainer = makeSlider(dd22);
  sSlider = sSliderContainer['slider'];
  sSliderContainer['valueLabel'].innerHTML = sSlider.value;
  sSliderContainer['label'].innerHTML = "Scale";
  [sSlider.min, sSlider.max, sSlider.step, sSlider.value] = [1, 300, 1, 200]
  sSlider.oninput = () => {
    sSliderContainer["valueLabel"].innerHTML = Number(sSlider.value).toFixed(2)
    scale = sSlider.value
  }

  let dd23 = makeRow(dd2);
  let fSliderContainer = makeSlider(dd23);
  fSlider = fSliderContainer['slider'];
  fSliderContainer['valueLabel'].innerHTML = fSlider.value;
  fSliderContainer['label'].innerHTML = "Speed";
  [fSlider.min, fSlider.max, fSlider.step, fSlider.value] = [1, 5000, 5, 1000]
  fSlider.oninput = () => {
    fSliderContainer["valueLabel"].innerHTML = Number(fSlider.value).toFixed(2)
  }


  setPedroStyle(bgCanvas)

  simCanvas = createGraphics(Wsim, Hsim)
  plotCanvas = createGraphics(Wplot, Hplot)
  plotCanvas.background(20)
  plotCanvas.stroke(255)
  plotCanvas.strokeWeight(3)
  plotCanvas.noFill()
  plotCanvas.rect(0, 0, Wplot, Hplot)

  plot1 = new GPlot(plotCanvas);
  plot1.setLineColor(255);
  plot1.setBoxBgColor(20);
  plot1.title.fontColor = 255;
  plot1.title.fontSize = 15
  plot1.title.fontStyle = NORMAL
  plot1.title.fontName = "sans-serif"
  plot1.title.offset = 2

  plot1.setPos(0, 0);
  plot1.setMar(10, 10, 22, 10);
  plot1.setOuterDim(Wplot, Hplot / 2);
  plot1.setTitleText("KE vs. time")

  plot2 = new GPlot(plotCanvas);
  plot2.setLineColor(255);
  plot2.setBoxBgColor(20);
  plot2.setPointColor(255);
  plot2.title.fontColor = 255;
  plot2.title.fontSize = 15
  plot2.title.fontStyle = NORMAL
  plot2.title.fontName = "sans-serif"
  plot2.title.offset = 2

  plot2.setPos(0, Hplot / 2);
  plot2.setMar(10, 10, 22, 10);
  plot2.setOuterDim(Wplot, Hplot / 2);
  plot2.setTitleText("Phase space (w/Q)")

  gridCanvas = createGraphics(Wsim, Hsim)
  let nDiv = 8
  gridCanvas.clear()
  gridCanvas.stroke(150)
  gridCanvas.strokeWeight(1)
  for (let i = 0; i < nDiv; i++) {
    gridCanvas.line(10 + i * Wsim / nDiv, 10, 10 + i * Wsim / nDiv, Hsim - 10)
    gridCanvas.line(10, 10 + i * Hsim / nDiv, Wsim - 10, 10 + i * Hsim / nDiv)
  }
}

function draw() {
  background(20)

  //outer rectangle
  simCanvas.clear()
  simCanvas.stroke(255)
  simCanvas.strokeWeight(2)
  simCanvas.noFill()
  simCanvas.rect(10, 10, Wsim - 20, Hsim - 20)

  //hinge
  simCanvas.push()
  simCanvas.translate(...par.hinge)
  simCanvas.rect(-15, -15, 30)
  simCanvas.fill(255)
  simCanvas.stroke(0)
  simCanvas.strokeWeight(1)
  simCanvas.ellipse(0, 0, 15, 15)


  simCanvas.stroke(255)
  simCanvas.fill(20)
  simCanvas.strokeWeight(2)

  //vertical normal
  simCanvas.drawingContext.setLineDash([5]); // set the "dashed line" mode
  simCanvas.line(0, 15, 0, 0.5 * scale * par.length); // draw the line
  simCanvas.drawingContext.setLineDash([]); // reset into "solid line" mode

  //pendulum
  simCanvas.line(0, 0, scale * par.length * Math.sin(par.theta), scale * par.length * Math.cos(par.theta))

  simCanvas.ellipse(scale * par.length * Math.sin(par.theta), scale * par.length * Math.cos(par.theta), par.radius, par.radius)

  simCanvas.pop()

  //grid lines
  image(gridCanvas, 0, 0)
  //sim canvas
  image(simCanvas, 0, 0);


  //plotting Updates
  plot1.addPoint(new GPoint(timestep, 0.5 * par.mass * par.omega ** 2 * par.length ** 2));

  plot1.beginDraw();
  plot1.drawBox();
  plot1.drawTitle();
  plot1.drawLines();
  plot1.endDraw();

  let newPoint = new GPoint(par.theta, par.omega)
  plot2.addPoint(newPoint);

  plot2.beginDraw();
  plot2.drawBox();
  plot2.drawTitle();
  plot2.drawLines();
  plot2.drawPoint(newPoint);
  plot2.endDraw();

  numP++;
  if (numP > 200) {
    plot1.removePoint(0)
  }

  //plotting window toggle
  if (checkbox1.checked) {
    image(plotCanvas, Wsim - Wplot - 30, 30)
  }

  //euler scheme to solve differential equation
  for (let i = 0; i < fSlider.value; i++) {
    par.alpha = -par.g * Math.sin(par.theta) / par.length - par.b * par.omega / par.mass;
    par.omega += par.alpha * par.dt;
    par.theta += par.omega * par.dt;
    timestep++
  }

}

function mouseClicked() {
  if (mouseX > 0 && mouseX < Wsim && mouseY > 0 && mouseY < Hsim) {
    par.length = ((mouseX - par.hinge[0]) ** 2 + (mouseY - par.hinge[1]) ** 2) ** 0.5 / scale
    par.theta = PI / 2 - Math.atan2((mouseY - par.hinge[1]), (mouseX - par.hinge[0]))
    par.omega = 0
    par.alpha = 0
    plot1.getMainLayer().points = []
    plot2.getMainLayer().points = []
    numP = 0;
    dd14.innerHTML = "Length (m) = " + Number(par.length).toFixed(2);
  }
}