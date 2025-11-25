const backgroundSketch5 = (p) => {
  let startTime;
  let captured = false;
  console.log("ass4.js loaded");
  p.setup = () => {
    p.createCanvas(600, 400);
    p.frameRate(30);
    p.smooth();
    p.colorMode(p.RGB);
    startTime = p.millis();
  };

  p.draw = () => {
    let t = (p.millis() - startTime) / 1000.0;
    p.background(252, 248, 255);

    // GIF 저장 로직 (원하는 경우 주석 해제하여 사용)
    if (p.frameCount === 2 && !captured) {
      captured = true;
      // p.saveGif('aurora_dream_10sec', 10);
    }

    let haloOffset = p.sin(t * 0.5) * 6;
    let haloAlpha = 80 + (40 * (p.sin(t * 0.7) + 1)) / 2;

    p.noStroke();
    p.fill(220, 235, 255, haloAlpha + 30);
    p.ellipse(-36 + haloOffset, -28, 220, 220);
    p.fill(255, 240, 248, haloAlpha);
    p.ellipse(-20 + haloOffset * 0.7, -16, 160, 160);

    // 배경 사각형들
    p.fill(240, 245, 255);
    p.rect(0, 0, 360, 400);
    p.fill(255, 240, 245);
    p.rect(360, 0, 240, 400);

    // 그리드 라인
    p.fill(230, 230, 240, 180);
    p.rect(200, 0, 2, 400);
    p.rect(400, 0, 2, 400);
    p.rect(0, 140, 600, 2);
    p.rect(0, 280, 600, 2);

    // 움직이는 가로줄
    let yShift1 = p.sin(t * 1.0) * 6;
    let yShift2 = p.sin(t * 1.3 + p.PI / 3) * 6;
    let yShift3 = p.sin(t * 1.5 + p.PI * 0.9) * 6;
    let yShift4 = p.sin(t * 1.8 + p.PI * 1.2) * 6;

    let c1a = p.color(200, 225, 255, 60);
    let c1b = p.color(180, 210, 255, 130);
    let c2a = p.color(255, 210, 230, 60);
    let c2b = p.color(255, 170, 220, 130);
    let c3a = p.color(220, 255, 235, 60);
    let c3b = p.color(180, 245, 220, 130);
    let c4a = p.color(255, 240, 210, 60);
    let c4b = p.color(255, 220, 170, 130);

    let amt = (p.sin(t * 0.8) + 1) / 2;

    p.fill(p.lerpColor(c1a, c1b, amt));
    p.rect(0, 90 + yShift1, 600, 50);
    p.fill(p.lerpColor(c2a, c2b, amt));
    p.rect(0, 130 + yShift2, 600, 60);
    p.fill(p.lerpColor(c3a, c3b, amt));
    p.rect(0, 190 + yShift3, 600, 60);
    p.fill(p.lerpColor(c4a, c4b, amt));
    p.rect(0, 250 + yShift4, 600, 60);

    // 중앙 원형 펄스
    let pulse = 1 + 0.08 * p.sin(t * 1.1);
    let pulse2 = 1 + 0.06 * p.sin(t * 1.1 + p.PI / 3);
    let pulse3 = 1 + 0.05 * p.sin(t * 1.1 + p.PI * 0.7);

    let cx = 360 + p.sin(t * 0.4) * 8;
    let cy = 200 + p.cos(t * 0.4) * 6;

    let coreAmt = (p.sin(t * 0.5) + 1) / 2;
    let core1A = p.color(255, 230, 240, 140);
    let core1B = p.color(180, 190, 255, 200);
    let core2A = p.color(200, 230, 255, 140);
    let core2B = p.color(190, 255, 230, 200);
    let core3A = p.color(210, 255, 230, 140);
    let core3B = p.color(255, 220, 210, 200);

    p.fill(p.lerpColor(core1A, core1B, coreAmt));
    p.ellipse(cx, cy, 240 * pulse);
    p.fill(p.lerpColor(core2A, core2B, coreAmt));
    p.ellipse(cx - 40, cy - 20, 200 * pulse2);
    p.fill(p.lerpColor(core3A, core3B, 1 - coreAmt));
    p.ellipse(cx + 30, cy + 30, 180 * pulse3);

    p.noFill();
    p.stroke(170, 140, 200, 160);
    p.strokeWeight(2);
    p.ellipse(cx, cy, 270 * pulse);
    p.noStroke();

    // 부유하는 블록들
    let float1 = p.sin(t * 0.9) * 4;
    let float2 = p.cos(t * 1.1) * 4;
    let blockPulse1 = 1 + 0.06 * p.sin(t * 1.2);
    let blockPulse2 = 1 + 0.05 * p.sin(t * 1.3 + p.PI / 4);

    p.push();
    p.translate(0, float1);
    p.fill(255, 228, 236, 180);
    p.rect(110, 110, 110, 110, 20);
    p.fill(210, 240, 255, 150);
    p.ellipse(165, 165, 80 * blockPulse1);
    p.fill(255, 240, 210, 130);
    p.rect(135, 135, 60 * blockPulse1, 60 * blockPulse1, 12);
    p.pop();

    p.push();
    p.translate(0, float2);
    p.fill(230, 250, 238, 180);
    p.rect(430, 260, 110, 90, 20);
    p.fill(255, 215, 230, 150);
    p.ellipse(485, 300, 70 * blockPulse2);
    p.fill(210, 225, 255, 120);
    p.rect(455, 275, 80 * blockPulse2, 50 * blockPulse2, 12);
    p.pop();

    // 회전하는 삼각형들
    let triAngle1 = p.sin(t * 0.6) * 0.4;
    let triAngle2 = p.cos(t * 0.7) * 0.4;

    p.fill(200, 180, 255, 180);
    p.push();
    p.translate(200, 300);
    p.rotate(triAngle1);
    p.triangle(-68, 34, 8, -52, 63, 52);
    p.pop();

    p.fill(255, 185, 210, 180);
    p.push();
    p.translate(480, 120);
    p.rotate(triAngle2);
    p.triangle(-62, -36, 12, 48, 58, -58);
    p.pop();

    // 반짝이는 별 효과 (HSB 모드)
    p.push();
    p.colorMode(p.HSB, 360, 100, 100, 255);
    let hueBase = (p.frameCount * 2) % 360;
    p.noStroke();
    p.fill(hueBase, 40, 100, 220);
    p.ellipse(330, 100, 4);
    p.fill(hueBase, 30, 100, 220);
    p.ellipse(340, 108, 2);

    let twinkle = 180 + 70 * p.sin(t * 5);
    p.fill(hueBase + 60, 50, 100, twinkle);
    p.ellipse(520, 300, 5);
    p.fill(hueBase + 120, 30, 100, 220);
    p.ellipse(140, 90, 3);

    p.randomSeed(10);
    for (let i = 0; i < 18; i++) {
      let sx = p.random(40, 560);
      let sy = p.random(40, 360);
      let alphaStar = p.random(80, 200);
      p.fill((hueBase + p.random(-20, 20)) % 360, 30, 100, alphaStar);
      p.ellipse(sx, sy, 2);
    }
    p.pop(); // RGB 모드로 복귀 (push/pop 덕분)

    // 전면 장식 요소
    p.fill(255, 245, 210, 200);
    p.triangle(350, 70, 360, 90, 370, 72);
    p.triangle(352, 68, 340, 80, 366, 86);

    p.noFill();
    p.stroke(150, 160, 210, 90 + (60 * (p.sin(t * 1.4) + 1)) / 2);
    p.strokeWeight(1.5);
    p.rect(558, 40 + p.sin(t * 0.8) * 6, 2, 300, 1);

    p.noFill();
    p.stroke(180, 170, 200, 120 + (40 * (p.sin(t * 0.5) + 1)) / 2);
    p.strokeWeight(3);
    p.rect(20, 20, 560, 360, 16);
  };
};

// 사용 예시:
// new p5(backgroundSketch, 'bg-canvas');
new p5(backgroundSketch5, "canvas4");
