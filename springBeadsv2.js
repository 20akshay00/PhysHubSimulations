let W = 1200 //width of bgCanvas
let H = 500 //height of bgCanvas
let Wsim = W * 0.69
let Hsim = H
let Wplot = 0.25 * W
let Hplot = 0.875 * H
let bgCanvas, simCanvas, plotCanvas;
let dt = 0.001
let fSlider;
let rWall, lWall;

class Beads {
  constructor(x, y, m) {
    this.pos = createVector(x, y);
    this.vel = createVector(0, 0);
    this.force = createVector(0, 0);
    this.mass = m;
    this.radius = 20 * m ** 0.25;
    Beads.instances.push(this);
  }

  draw(canv) {
    canv.stroke(230)
    canv.strokeWeight(2)
    canv.fill(20)
    canv.ellipse(this.pos.x, this.pos.y, this.radius, this.radius)
  }

  addForce(f) {
    this.force.add(f);
  }

  updatePos() {
    this.vel.add(p5.Vector.mult(this.force, dt / this.mass))
    this.pos.add(p5.Vector.mult(this.vel, dt))
    this.force = createVector(0, 0);
  }
}

class Springs {

  constructor(k, id1, id2) {
    this.k = k;
    this.links = [id1, id2];
    this.pos1 = Beads.instances[id1].pos.copy();
    this.pos2 = Beads.instances[id2].pos.copy();
    this.l0 = p5.Vector.sub(Beads.instances[0].pos, Beads.instances[Beads.instances.length - 1].pos).mag() / (Beads.instances.length - 1)
    this.l = p5.Vector.sub(this.pos1, this.pos2).mag();
    Springs.instances.push(this);
  }

  draw(canv) {
    let xa, xb, ya, yb;
    [xa, ya, xb, yb] = [this.pos1.x, this.pos1.y, this.pos2.x, this.pos2.y]
    let n = parseInt(20 * this.l0 / 400)
    let step = ((xa - xb) ** 2 + (ya - yb) ** 2) ** 0.5 / n; //steps between vertices
    let ang = atan((yb - ya) / (xb - xa)); //angle between two points
    step = (xa > xb) ? (-step) : step; //step is increased from a to b
    let flag = (xa > xb) ? -1 : 1;

    canv.noFill();

    canv.push();
    canv.translate(xa, ya);
    canv.rotate(ang, createVector(0, 0, 1));

    canv.beginShape();
    canv.vertex(0, 0);
    canv.vertex(step / 2, 0);
    for (let i = 1; i < n; i++) {
      canv.vertex(step * i, flag * 5 * (-1) ** i)
    }
    canv.vertex((n - 0.5) * step, 0);
    canv.vertex(n * step, 0);
    canv.endShape();

    canv.pop();

  }

  updateLength() {
    this.pos1 = Beads.instances[this.links[0]].pos.copy();
    this.pos2 = Beads.instances[this.links[1]].pos.copy();
    this.l = p5.Vector.sub(this.pos1, this.pos2).mag();
  }

  applyForce() {
    let fdir = p5.Vector.sub(this.pos1, this.pos2);
    let fmag = this.k * (this.l - this.l0);
    fdir.setMag(fmag);
    Beads.instances[this.links[0]].addForce(p5.Vector.mult(fdir, -1));
    Beads.instances[this.links[1]].addForce(fdir);
  }
}

class Wall {
  constructor(l, direction) {
    this.length = l;
    this.pos = (direction === "r") ? (createVector(30, Hsim / 2)) : (createVector(Wsim - 50, Hsim / 2))
  }

  draw(canv) {
    canv.strokeWeight(3)
    canv.line(this.pos.x, this.pos.y - this.length / 2, this.pos.x, this.pos.y + this.length / 2)
  }

  addForce(f) {}
  updatePos() {}
}


function setup() {
  bgCanvas = createCanvas(W, H)
  bgCanvas.background(20)


  fSlider = createSlider(1, 1000, 50, 1); //frameskip slider
  fSlider.position(500, 100);
  fSlider.style('width', '90px');

  simCanvas = createGraphics(Wsim - 20, Hsim - 20)

  plotCanvas = createGraphics(Wplot, Hplot)

  gridCanvas = createGraphics(Wsim, Hsim)

  let nDiv = 8
  gridCanvas.stroke(255)
  gridCanvas.strokeWeight(0.5)
  for (let i = 0; i < nDiv; i++) {
    gridCanvas.line(10 + i * Wsim / nDiv, 10, 10 + i * Wsim / nDiv, Hsim - 10)
    gridCanvas.line(10, 10 + i * Hsim / nDiv, Wsim - 10, 10 + i * Hsim / nDiv)
  }

  gridCanvas.stroke(255)
  gridCanvas.strokeWeight(2)
  gridCanvas.noFill()
  gridCanvas.rect(10, 10, Wsim - 20, Hsim - 20)


  Beads.instances = [];
  Springs.instances = [];


  rWall = new Wall(150, "r")
  lWall = new Wall(150, "l")
  stepsize = (lWall.pos.x + rWall.pos.x) / 3
  Beads.instances.push(rWall)
  let bead1 = new Beads(stepsize,
    Hsim / 2 - stepsize, 100);
  let bead2 = new Beads(2 * stepsize,
    Hsim / 2 + stepsize, 100);
  Beads.instances.push(lWall)

  let spring1 = new Springs(1, 0, 1)
  let spring2 = new Springs(1, 1, 2)
  let spring3 = new Springs(1, 2, 3)
}

function draw() {
  //border of simCanvas
  simCanvas.background(20)
  simCanvas.stroke(255)
  simCanvas.strokeWeight(2)


  for (i = 0; i < fSlider.value(); i++) {

    for (spring of Springs.instances) {
      spring.updateLength();
      spring.applyForce();
    }

    for (bead of Beads.instances) {
      bead.updatePos()
    }
  }
  for (spring of Springs.instances) {
    spring.draw(simCanvas);
  }

  for (bead of Beads.instances) {
    bead.draw(simCanvas)
  }


  //sim canvas
  image(simCanvas, 10, 10);
  image(gridCanvas, 0, 0);
}