const mySketch = (p) => {
  let playing = true,
    manualBlink = 0,
    saveRequested = false;
  const FPS = 30,
    DURATION = 10,
    TOTAL_FRAMES = FPS * DURATION;

  p.setup = () => {
    p.createCanvas(600, 400);
    p.frameRate(FPS);
  };

  p.draw = () => {
    if (!playing) return;

    const f = p.frameCount % TOTAL_FRAMES;
    const t = f / TOTAL_FRAMES;

    p.background(248, 242, 228);

    // 좌표 및 기본 설정
    const cx = 220,
      cy = 190;
    const headW = 160,
      headH = 190;
    const hairCol = p.color(65, 48, 43);
    const skin = p.color(255, 233, 217);
    const cloth = p.color(76, 85, 102);

    // 타이밍 상수
    const A0 = 0.0,
      A1 = 0.2; // 눈
    const B0 = 0.2,
      B1 = 0.4; // 입
    const C0 = 0.4,
      C1 = 0.65; // 왼팔
    const D0 = 0.65,
      D1 = 1.0; // 오른팔

    // 눈 깜빡임 계산
    let blink = 0;
    if (t > A0 && t < A1) {
      const x = p.map(t, A0, A1, 0, 1),
        center = 0.4,
        w = 0.12;
      const d = p.abs(x - center);
      blink = p.constrain(1.0 - p.pow(d / w, 2), 0, 1);
    }
    if (manualBlink > 0) {
      blink = p.max(
        blink,
        easeOutCubic(p.constrain(manualBlink / (0.35 * FPS), 0, 1))
      );
      manualBlink--;
    }

    // 입 벌림 계산
    let mouthO = 0;
    if (t > B0 && t < B1) {
      const u = p.norm(t, B0, B1); // p5의 norm 사용
      mouthO = smoothstep(0, 0.45, u) * (1 - smoothstep(0.55, 1, u)) * 1.2;
    }

    // 책상
    const deskY = 310;
    p.noStroke();
    p.fill(220, 214, 204);
    p.rect(0, deskY, p.width, 90);
    const cupBase = p.createVector(500, deskY - (20 + (0.75 * 180) / 2) - 2);

    // 뒷머리
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

    // 몸통
    const BODY_W = 240,
      BODY_H = 120;
    p.fill(cloth);
    p.noStroke();
    p.rect(cx - BODY_W / 2, cy + 90, BODY_W, BODY_H, 30);

    // 팔 설정
    const shoulderL = p.createVector(cx - BODY_W / 2 + 10, cy + 96);
    const shoulderR = p.createVector(cx + BODY_W / 2 - 10, cy + 96);
    const ARM_THICK = 26;
    const HAND_R = 30;
    const L1 = 78,
      L2 = 70;

    // 왼팔 애니메이션
    const leftRestIn = p.createVector(cx - 60, cy + 150);
    const leftExtend = p.createVector(cx - 185, cy + 120);
    let leftTarget = leftRestIn.copy();

    if (t >= C0 && t < C1) {
      const u = p.norm(t, C0, C1);
      if (u < 0.18) {
        // 인사
        leftTarget = vLerp(leftRestIn, leftExtend, easeInOut(u / 0.18));
      } else if (u < 0.88) {
        const k = p.norm(u, 0.18, 0.88); // 사용자 정의 norm 대신 p.norm 사용 가능 (동일 동작)
        const ampX = 24,
          ampY = 10;
        const sway = p.sin(k * p.TWO_PI * 1.2) * ampX;
        const bob = -p.abs(p.sin(k * p.PI)) * ampY;
        leftTarget = leftExtend.copy().add(sway, bob);
      } else {
        const k = p.norm(u, 0.88, 1.0);
        leftTarget = vLerp(leftExtend, leftRestIn, easeInOut(k));
      }
    }
    const ikL = solveIK(shoulderL, leftTarget, L1, L2);
    drawArm(shoulderL, ikL.elbow, ikL.hand, cloth, skin, ARM_THICK, HAND_R);

    // 셔츠 카라
    p.fill(230);
    p.triangle(cx - 24, cy + 90, cx + 24, cy + 90, cx, cy + 128);

    // 얼굴
    p.noStroke();
    p.fill(skin);
    p.ellipse(cx, cy, headW, headH);
    const leftEarX = cx - headW * 0.48,
      leftEarY = cy + 5;
    const rightEarX = cx + headW * 0.48,
      rightEarY = cy + 5;
    p.ellipse(leftEarX, leftEarY, 26, 36);
    p.ellipse(rightEarX, rightEarY, 26, 36);
    drawFlowerPiercing(leftEarX, leftEarY);

    // 앞머리
    const Lx = cx - 93.9,
      Rx = cx + 93.9;
    const yEdge = cy - 54;
    const sideY = yEdge + 1.5;
    const bangsBottom = cy - 16;
    const domeH = 58;
    const kEll = 0.5522847498,
      cEll = kEll * 0.88;
    const rx = (Rx - Lx) / 2,
      ry = domeH;

    p.fill(hairCol);
    p.noStroke();
    p.beginShape();
    p.vertex(Lx, sideY);
    p.bezierVertex(
      Lx,
      sideY - cEll * ry,
      cx - cEll * rx,
      sideY - ry,
      cx,
      sideY - ry
    );
    p.bezierVertex(
      cx + cEll * rx,
      sideY - ry,
      Rx,
      sideY - cEll * ry,
      Rx,
      sideY
    );
    p.vertex(Rx, bangsBottom);
    p.vertex(Lx, bangsBottom);
    p.endShape(p.CLOSE);

    // 눈 그리기
    const eyeBaseH = 28,
      eyeW = 46;
    const eyeH = p.lerp(eyeBaseH, 2, blink);
    p.noStroke();
    p.fill(255);
    p.ellipse(cx - 38, cy - 6, eyeW, eyeH);
    p.ellipse(cx + 38, cy - 6, eyeW, eyeH);

    p.fill(60, 70, 80);
    const irisSize = p.lerp(18, 4, blink);
    p.ellipse(cx - 38, cy - 6, irisSize, irisSize);
    p.ellipse(cx + 38, cy - 6, irisSize, irisSize);

    p.fill(255);
    p.circle(cx - 32, cy - 10, p.lerp(6, 2, blink));
    p.circle(cx + 44, cy - 10, p.lerp(6, 2, blink));

    // 안경
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

    // 입 그리기
    if (mouthO < 0.5) {
      const w = p.lerp(54, 34, mouthO * 2),
        h = p.lerp(26, 10, mouthO * 2);
      p.stroke(160, 60, 80);
      p.strokeWeight(3);
      p.noFill();
      p.arc(cx, cy + 34, w, h, 0, p.PI, p.OPEN);
    } else {
      const prog = (mouthO - 0.5) * 2,
        r = p.lerp(8, 14, prog);
      p.noStroke();
      p.fill(200, 80, 100);
      p.ellipse(cx, cy + 34, r * 1.2, r);
      p.fill(skin);
      p.ellipse(cx, cy + 34, r * 0.8, r * 0.6);
      p.stroke(160, 60, 80);
      p.strokeWeight(2);
      p.noFill();
      p.ellipse(cx, cy + 34, r * 1.2, r);
    }

    // 오른팔 애니메이션 (컵 들기)
    const shoulderR_rest = p.createVector(cx + 160, cy + 140);
    let targetR = shoulderR_rest.copy();
    let holding = false;

    if (t >= D0 && t < D1) {
      const u = p.norm(t, D0, D1);
      if (u < 0.18) {
        targetR = vLerp(
          shoulderR_rest,
          cupBase.copy().add(0, 10),
          easeInOut(u / 0.18)
        );
      } else if (u < 0.35) {
        const k2 = p.norm(u, 0.18, 0.35);
        targetR = vLerp(
          cupBase.copy().add(0, 10),
          cupBase.copy().add(0, -55),
          easeInOut(k2)
        );
        holding = true;
      } else if (u < 0.85) {
        const k3 = p.norm(u, 0.35, 0.85);
        const sway = p.sin(k3 * p.TWO_PI * 2.0) * 18;
        targetR = cupBase.copy().add(sway, -55);
        holding = true;
      } else if (u < 0.95) {
        const k4 = p.norm(u, 0.85, 0.95);
        targetR = vLerp(
          cupBase.copy().add(0, -55),
          cupBase.copy().add(0, 10),
          easeInOut(k4)
        );
        holding = true;
      } else {
        const k5 = p.norm(u, 0.95, 1.0);
        targetR = vLerp(
          cupBase.copy().add(0, 10),
          shoulderR_rest,
          easeInOut(k5)
        );
      }
    }
    const ikR = solveIK(shoulderR, targetR, L1, L2);
    drawArm(shoulderR, ikR.elbow, ikR.hand, cloth, skin, ARM_THICK, HAND_R);

    // 컵 그리기
    if (holding) {
      p.push();
      p.translate(ikR.hand.x, ikR.hand.y);
      drawIcedCoffee(0, 0, 110, 180);
      p.pop();
    } else {
      drawIcedCoffee(500, cupBase.y, 110, 180);
    }

    // 악세서리 및 꾸미기
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
    heart(cx, cy + 150, 16);

    // GIF 저장 (p5.js saveGif 메서드 사용 시)
    if (saveRequested && f === 0 && typeof p.saveGif === "function") {
      p.saveGif("caricature_motion_10s", DURATION, { units: "seconds" });
      saveRequested = false;
    }
  };

  // --- 내부 헬퍼 함수들 (p 객체를 사용하므로 내부에 정의) ---

  function drawArm(shoulder, elbow, hand, cloth, skin, thick, handR) {
    p.stroke(cloth);
    p.strokeWeight(thick);
    p.strokeCap(p.ROUND);
    p.noFill();
    p.line(shoulder.x, shoulder.y, elbow.x, elbow.y);
    p.line(elbow.x, elbow.y, hand.x, hand.y);
    p.noStroke();
    p.fill(skin);
    p.circle(hand.x, hand.y, handR);
  }

  function solveIK(shoulder, target, L1, L2) {
    const dx = target.x - shoulder.x,
      dy = target.y - shoulder.y;
    const d = p.sqrt(dx * dx + dy * dy);
    const clamped = p.constrain(d, 0.0001, L1 + L2 - 0.0001);
    const a = p.atan2(dy, dx);
    const cosB = (L1 * L1 + L2 * L2 - clamped * clamped) / (2 * L1 * L2);
    const B = p.acos(p.constrain(cosB, -1, 1));
    const cosA = (L1 * L1 + clamped * clamped - L2 * L2) / (2 * L1 * clamped);
    const A = p.acos(p.constrain(cosA, -1, 1));
    const theta1 = a + A;
    const elbow = p.createVector(
      shoulder.x + L1 * p.cos(theta1),
      shoulder.y + L1 * p.sin(theta1)
    );
    const theta2 = theta1 + p.PI - B;
    const hand = p.createVector(
      elbow.x + L2 * p.cos(theta2),
      elbow.y + L2 * p.sin(theta2)
    );
    return { elbow, hand };
  }

  function drawFlowerPiercing(x, y) {
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

  function drawIcedCoffee(x, y, w, h) {
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
    p.randomSeed(1);
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

  function heart(x, y, s) {
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

  // 수학 유틸리티 함수 (p 의존성이 없는 순수 수학 함수는 그대로 둬도 되지만,
  // p.pow 등을 사용하기 위해 p5 함수로 변경했습니다.)
  function easeInOut(x) {
    return x < 0.5 ? 2 * x * x : 1 - p.pow(-2 * x + 2, 2) / 2;
  }
  function easeOutCubic(x) {
    return 1 - p.pow(1 - x, 3);
  }
  function smoothstep(a, b, x) {
    x = p.constrain((x - a) / (b - a), 0, 1);
    return x * x * (3 - 2 * x);
  }
  function vLerp(v1, v2, t) {
    // p5.Vector.sub는 static 메서드이므로 그대로 사용 가능하거나, 인스턴스 메서드로 변경
    return v1.copy().add(p5.Vector.sub(v2, v1).mult(p.constrain(t, 0, 1)));
  }

  // 키보드/마우스 이벤트
  p.keyPressed = () => {
    if (p.key === " ") playing = !playing;
    if (p.key === "g" || p.key === "G") saveRequested = true;
    if (p.key === "r" || p.key === "R") manualBlink = p.int(0.35 * FPS);
  };

  p.mousePressed = () => {
    manualBlink = p.int(0.35 * FPS);
  };
};

// 사용법: 특정 div ID(예: 'p5-container')에 넣으려면 아래처럼 사용하세요.
new p5(mySketch, "canvas3");
