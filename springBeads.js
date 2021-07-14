let W = 1200 //background canvas width
let H = 500 //background canvas height
let Wsim = W * 0.8 - 20 //sim canvas width
let Hsim = H - 20 //sim canvas height
let Wplot = 0.25 * W //plotting canvas width
let Hplot = 0.875 * H //plotting canvas height
let dt = 0.1
let beads = [];
let springs = [];
let fSlider;
let nbeads = 20;
let strlen = 900;

class Particle {
  constructor(x, y, m, id) {
    this.pos = createVector(x, y)
    this.m = m;
    this.id = id
    this.v = createVector(0, 0)
    this.f = createVector(0, 0)
    this.r = 25 * (m) ** 0.25
  }

  draw(canv) {
    canv.stroke(230)
    canv.strokeWeight(2)
    canv.fill(20)
    canv.ellipse(this.pos.x, this.pos.y, this.r, this.r)
  }

  addForce(force) {
    this.f.add(force);
  }

  update() {
    this.v.add(p5.Vector.mult(this.f, dt / this.m))
    this.pos.add(p5.Vector.mult(this.v, dt))[this.f.x, this.f.y] = [0, 0];
    this.f = createVector(0, 0)
  }

  isInside(d) {
    if ((mouseX - this.pos.x) ** 2 + (mouseY - this.pos.y) ** 2 <= (this.r + d) ** 2) {
      return true
    } else {
      return false
    }

  }

}

class Wall {
  constructor(x, y, len, id) {
    this.pos = createVector(x, y)
    this.id = id
    this.l = len
  }

  draw(canv) {
    canv.stroke(200)
    canv.strokeWeight(2)
    canv.fill(100)
    canv.rect(this.pos.x - this.l / 2, this.pos.y - this.l / 2, this.l, this.l)
  }

  update() {};

  addForce() {};

  isInside(d) {
    if ((mouseX < this.pos.x + this.l / 2 + d) && (mouseX > this.pos.x - this.l / 2 - d) && (mouseY < this.pos.y + this.l / 2 + d) && (mouseY > this.pos.y - this.l / 2 - d)) {
      return true
    } else {
      return false
    }
  }
}

class Spring {
  constructor(k, id1, id2, blist) {
    this.k = k;
    this.links = [id1, id2];
    this.pos1 = blist[id1].pos.copy();
    this.pos2 = blist[id2].pos.copy();
    this.l0 = p5.Vector.sub(blist[0].pos, blist[blist.length - 1].pos).mag() / (blist.length - 1)
    this.l = p5.Vector.sub(this.pos1, this.pos2).mag();

  }

  draw(canv) {
    let xa, xb, ya, yb;
    [xa, ya, xb, yb] = [this.pos1.x, this.pos1.y, this.pos2.x, this.pos2.y]
    let n = parseInt(20 * this.l0 / 100)
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

  update(blist) {
    this.pos1 = blist[this.links[0]].pos.copy();
    this.pos2 = blist[this.links[1]].pos.copy();
    this.l = p5.Vector.sub(this.pos1, this.pos2).mag();


    let fdir = p5.Vector.sub(this.pos1, this.pos2);
    let fmag = this.k * (this.l - this.l0);
    fdir.setMag(fmag);
    blist[this.links[0]].addForce(p5.Vector.mult(fdir, -1));
    blist[this.links[1]].addForce(p5.Vector.mult(fdir, 1));
  }

}


function setup() {

  let bgCanvas = createCanvas(W, H)
  fSlider = createSlider(0, 1000, 50, 1); //frameskip slider
  fSlider.position(500, 100);
  fSlider.style('width', '90px');

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


  beads.push(new Wall(20, Hsim / 2, 25, 0))
  for (let i = 1; i < nbeads; i++) {
    //beads.push(new Particle(20 + 100 * i, Hsim / 2, 1, i))
    beads.push(new Particle(20 + strlen / nbeads * i, Hsim / 2, 1, i))
  }
  beads.push(new Wall(20 + strlen, Hsim / 2, 25, nbeads))

  for (let i = 0; i < nbeads; i++) {
    springs.push(new Spring(0.005, i, i + 1, beads))
  }

}

function draw() {
  background(20)
  simCanvas.clear()
  simCanvas.stroke(255)
  simCanvas.strokeWeight(2)
  simCanvas.noFill()
  simCanvas.rect(2, 2, Wsim - 4, Hsim - 4)


  for (i = 0; i < fSlider.value(); i++) {
    for (s of springs) {
      s.update(beads)
    }

    for (b of beads) {
      b.update()
    }
  }

  for (s of springs) {
    s.draw(simCanvas)
  }

  for (b of beads) {
    b.draw(simCanvas)
  }



  //grid lines
  image(gridCanvas, 10, 10)
  //sim canvas
  image(simCanvas, 10, 10);
}

function mouseDragged() {
  for (b of beads) {
    if (b.isInside(0)) {
      b.pos = createVector(mouseX, mouseY)
      break;
    }
  }
}