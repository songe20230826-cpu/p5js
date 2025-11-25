const sketch2 = function (p) {
  p.setup = function () {
    p.createCanvas(600, 400);
    p.noLoop();
  };

  p.draw = function () {
    p.background(248, 242, 228);
    const cx = 220,
      cy = 190;
    const headW = 160,
      headH = 190;
    const hairCol = p.color(65, 48, 43);
    p.fill(hairCol);
    p.push();
    p.translate(cx, cy + 6);
    p.beginShape();
    p.vertex(-94, -60);
    p.bezierVertex(-120, 10, -128, 120, -90, 160);
    p.bezierVertex(-92, 178, -70, 188, -54, 170);
    p.bezierVertex(-15, 205, 15, 205, 54, 170);
    p.bezierVertex(70, 188, 92, 178, 90, 160);
    p.bezierVertex(128, 120, 120, 10, 94, -60);
    p.bezierVertex(60, -80, -60, -80, -94, -60);
    p.endShape(p.CLOSE);
    p.pop();
    const deskY = 310;
    p.noStroke();
    p.fill(220, 214, 204);
    p.rect(0, deskY, p.width, 90);
    const cupW = 110,
      cupH = 180;
    const cupBottomOffset = 20 + (0.75 * cupH) / 2;
    drawIcedCoffee(p, 500, deskY - cupBottomOffset - 2, cupW, cupH);
    p.fill(253, 229, 210);
    p.rect(cx - 22, cy + 70, 44, 35, 12);
    p.fill(76, 85, 102);
    p.rect(cx - 130, cy + 90, 260, 120, 30);
    p.fill(230);
    p.triangle(cx - 24, cy + 90, cx + 24, cy + 90, cx, cy + 128);
    p.noStroke();
    p.fill(255, 233, 217);
    p.ellipse(cx, cy, headW, headH);
    const leftEarX = cx - headW * 0.48,
      leftEarY = cy + 5;
    const rightEarX = cx + headW * 0.48,
      rightEarY = cy + 5;
    p.ellipse(leftEarX, leftEarY, 26, 36);
    p.ellipse(rightEarX, rightEarY, 26, 36);
    drawFlowerPiercing(p, leftEarX, leftEarY);
    const Lx = cx - 93.9,
      Rx = cx + 93.9;
    const yEdge = cy - 54;
    const sideY = yEdge + 1.5;
    const bangsBottom = cy - 16;
    const domeH = 58;
    const k = 0.5522847498;
    const c = k * 0.88;
    const rx = (Rx - Lx) / 2;
    const ry = domeH;
    p.fill(hairCol);
    p.noStroke();
    p.beginShape();
    p.vertex(Lx, sideY);
    p.bezierVertex(Lx, sideY - c * ry, cx - c * rx, sideY - ry, cx, sideY - ry);
    p.bezierVertex(cx + c * rx, sideY - ry, Rx, sideY - c * ry, Rx, sideY);
    p.vertex(Rx, bangsBottom);
    p.vertex(Lx, bangsBottom);
    p.endShape(p.CLOSE);
    p.noStroke();
    p.fill(255);
    p.ellipse(cx - 38, cy - 6, 46, 28);
    p.ellipse(cx + 38, cy - 6, 46, 28);
    p.fill(60, 70, 80);
    p.ellipse(cx - 38, cy - 6, 18, 18);
    p.ellipse(cx + 38, cy - 6, 18, 18);
    p.fill(255);
    p.circle(cx - 32, cy - 10, 6);
    p.circle(cx + 44, cy - 10, 6);
    p.noFill();
    p.stroke(40);
    p.strokeWeight(4);
    p.circle(cx - 38, cy - 6, 62);
    p.circle(cx + 38, cy - 6, 62);
    p.line(cx - 7, cy - 8, cx + 7, cy - 8);
    p.noStroke();
    p.fill(220, 240, 255, 60);
    p.circle(cx - 38, cy - 6, 58);
    p.circle(cx + 38, cy - 6, 58);
    p.stroke(200, 120, 120);
    p.strokeWeight(2);
    p.noFill();
    p.arc(cx, cy + 12, 14, 10, p.PI * 0.1, p.PI * 0.9);
    p.stroke(160, 60, 80);
    p.strokeWeight(3);
    p.arc(cx, cy + 34, 54, 26, 0, p.PI, p.OPEN);
    p.noStroke();
    p.fill(255, 188, 200, 120);
    p.ellipse(cx - 64, cy + 24, 26, 14);
    p.ellipse(cx + 64, cy + 24, 26, 14);
    p.noFill();
    p.stroke(220);
    p.strokeWeight(2);
    p.arc(cx, cy + 140, 100, 60, p.PI, p.TWO_PI);
    p.noStroke();
    p.fill(255, 90, 120);
    heart(p, cx, cy + 150, 16);
  };

  function drawFlowerPiercing(p, x, y) {
    p.push();
    p.translate(x, y);
    p.fill(255, 208, 230);
    for (let i = 0; i < 5; i++) {
      const a = (p.TWO_PI * i) / 5;
      p.ellipse(6 * p.cos(a), 6 * p.sin(a), 6, 9);
    }
    p.fill(255, 240, 120);
    p.circle(0, 0, 5);
    p.pop();
  }

  function drawIcedCoffee(p, x, y, w, h) {
    p.push();
    p.translate(x, y);
    p.stroke(60);
    p.strokeWeight(2);
    p.fill(255, 255, 255, 120);
    p.rectMode(p.CENTER);
    p.rect(0, 20, w * 0.8, h * 0.75, 18);
    p.noStroke();
    p.fill(120, 78, 52, 200);
    const liquidH = h * 0.45;
    p.rect(0, 20 + (h * 0.75 - liquidH) / 2 - 2, w * 0.8 - 10, liquidH, 12);
    p.fill(255, 255, 255, 180);
    for (let i = 0; i < 6; i++) {
      const ix = p.random(-w * 0.28, w * 0.28);
      const iy = p.random(10, 20 + liquidH / 2);
      p.push();
      p.translate(ix, iy);
      p.rotate(p.random(-0.5, 0.5));
      p.rectMode(p.CENTER);
      p.rect(0, 0, 16, 16, 3);
      p.pop();
    }
    p.stroke(60);
    p.strokeWeight(2);
    p.noFill();
    p.arc(0, -50, w * 0.9, 60, p.PI, p.TWO_PI);
    p.stroke(50);
    p.strokeWeight(6);
    p.line(0, -90, 0, 30);
    p.pop();
  }

  function heart(p, x, y, s) {
    p.push();
    p.translate(x, y);
    p.beginShape();
    p.fill(255, 90, 120);
    p.noStroke();
    const r = s;
    p.vertex(0, r);
    p.bezierVertex(1.6 * r, -0.3 * r, 0.9 * r, -1.2 * r, 0, -0.4 * r);
    p.bezierVertex(-0.9 * r, -1.2 * r, -1.6 * r, -0.3 * r, 0, r);
    p.endShape(p.CLOSE);
    p.pop();
  }

  p.keyPressed = function () {
    if (p.key === "s" || p.key === "S")
      p.saveCanvas("p5_caricature_v4_bangs_dome58_width93.9", "png");
  };
};

new p5(sketch2, "canvas2");
