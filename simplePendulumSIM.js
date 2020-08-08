let W = 1200
let H = 500
let Wsim = W * 0.69
let Hsim = H
let Wplot = 0.25 * W
let Hplot = 0.4 * H

let mSlider, lSlider, aSlider, gSlider, bSlider, checkbox1, sSlider, fSlider;
let par = {
  theta: 0.785, // Angle
  omega: 0, // Angular velocity
  alpha: 0, // Angular acceleration
  dt: 0.001, // Initial time step size
  mass: 0.5, // Mass in kg
  length: 1, // Pendulum length
  hinge: [250, 175], // Hinge location
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

  let dd12 = makeRow(dd1);
  let lSliderContainer = makeSlider(dd12);
  lSlider = lSliderContainer['slider'];
  lSliderContainer['valueLabel'].innerHTML = lSlider.value;
  lSliderContainer['label'].innerHTML = "Initial Length (in m)";
  [lSlider.min, lSlider.max, lSlider.step, lSlider.value] = [0.1, 5, 0.1, 1]
  lSlider.oninput = () => {
    lSliderContainer["valueLabel"].innerHTML = Number(lSlider.value).toFixed(2)
    par.length = lSlider.value
    par.omega = 0
    par.alpha = 0
  }

  let dd13 = makeRow(dd1);
  let aSliderContainer = makeSlider(dd13);
  aSlider = aSliderContainer['slider'];
  aSliderContainer['valueLabel'].innerHTML = aSlider.value;
  aSliderContainer['label'].innerHTML = "Initial angle (in deg)";
  [aSlider.min, aSlider.max, aSlider.step, aSlider.value] = [-90, 90, 0.1, 45]
  aSlider.oninput = () => {
    aSliderContainer["valueLabel"].innerHTML = Number(aSlider.value).toFixed(2)
    par.theta = radians(aSlider.value)
    par.omega = 0
    par.alpha = 0
  }

  let dd14 = makeRow(dd1);
  let gSliderContainer = makeSlider(dd14);
  gSlider = gSliderContainer['slider'];
  gSliderContainer['valueLabel'].innerHTML = gSlider.value;
  gSliderContainer['label'].innerHTML = "g (m/s^2)";
  [gSlider.min, gSlider.max, gSlider.step, gSlider.value] = [0, 100, 0.1, 9.8]
  gSlider.oninput = () => {
    gSliderContainer["valueLabel"].innerHTML = Number(gSlider.value).toFixed(2)
    par.g = gSlider.value
  }

  let dd15 = makeRow(dd1);
  let bSliderContainer = makeSlider(dd15);
  bSlider = bSliderContainer['slider'];
  bSliderContainer['valueLabel'].innerHTML = bSlider.value;
  bSliderContainer['label'].innerHTML = "Drag coefficient";
  [bSlider.min, bSlider.max, bSlider.step, bSlider.value] = [0, 0.01, 0.001, 0]
  bSlider.oninput = () => {
    bSliderContainer["valueLabel"].innerHTML = Number(bSlider.value).toFixed(2)
    par.b = bSlider.value
  }

  let dd2 = makeItem(dd);
  dd2.parentElement.children[1].innerHTML = "Toggle";
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
  }

  let dd23 = makeRow(dd2);
  let fSliderContainer = makeSlider(dd23);
  fSlider = fSliderContainer['slider'];
  fSliderContainer['valueLabel'].innerHTML = fSlider.value;
  fSliderContainer['label'].innerHTML = "Speed";
  [fSlider.min, fSlider.max, fSlider.step, fSlider.value] = [1, 10000, 5, 1000]
  fSlider.oninput = () => {
    fSliderContainer["valueLabel"].innerHTML = Number(fSlider.value).toFixed(2)
  }

  setPedroStyle(bgCanvas)
  console.log(document.body)

  simCanvas = createGraphics(Wsim, Hsim)
  plotCanvas = createGraphics(Wplot, Hplot)
  plotCanvas.background(20)
  plotCanvas.stroke(255)
  plotCanvas.strokeWeight(3)
  plotCanvas.noFill()
  plotCanvas.rect(0, 0, Wplot, Hplot)

}

function draw() {
  background(20)
  //outer rectangle
  simCanvas.background(20)
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

  //pendulum
  simCanvas.scale(sSlider.value)
  simCanvas.stroke(255)
  simCanvas.fill(20)
  simCanvas.strokeWeight(2 / sSlider.value)
  simCanvas.line(0, 0, par.length * sin(par.theta), par.length * cos(par.theta))

  simCanvas.ellipse(par.length * sin(par.theta), par.length * cos(par.theta), par.radius / sSlider.value, par.radius / sSlider.value)

  simCanvas.pop()
  image(simCanvas, 0, 0)

  //plotting window toggle
  if (checkbox1.checked) {
    image(plotCanvas, Wsim - Wplot - 30, 30)
  }

  for (let i = 0; i < fSlider.value; i++) {
    par.alpha = -par.g * sin(par.theta) / par.length - par.b * par.omega * par.length / par.mass;
    par.omega += par.alpha * par.dt;
    par.theta += par.omega * par.dt;
  }

  console.log(mouseX, mouseY)
}

function mouseDragged() {
  if (mouseX > 0 && mouseX < Wsim && mouseY > 0 && mouseY < Hsim) {
    [...par.hinge] = [mouseX, mouseY];
  }
}