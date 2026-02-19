(function () {
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();

(function () {
  var canvas = document.getElementById("atom");
  if (!canvas) return;
  var dpr = window.devicePixelRatio || 2;
  var W = 300, H = 140;
  canvas.width = W * dpr;
  canvas.height = H * dpr;
  var ctx = canvas.getContext("2d");
  ctx.scale(dpr, dpr);

  var centerX = W / 2, centerY = H / 2;
  var bhHomeX = 145, bhY = H / 2;
  var solarHomeX = 200, solarHomeY = H / 2;
  var t = 0;

  function easeInOut(x) { return x < 0.5 ? 2*x*x : 1 - Math.pow(-2*x+2, 2) / 2; }
  function easeIn(x) { return x*x*x; }
  function easeOut(x) { return 1 - Math.pow(1 - x, 3); }

  var bhParticles = [];
  for (var i = 0; i < 40; i++) {
    bhParticles.push({
      angle: Math.random() * Math.PI * 2,
      dist: 14 + Math.random() * 25,
      speed: 0.02 + Math.random() * 0.03,
      size: 0.4 + Math.random() * 0.8,
      bright: 0.4 + Math.random() * 0.6
    });
  }

  var galaxyStars = [];
  for (var i = 0; i < 120; i++) {
    var armIdx = i % 3;
    var armOffset = armIdx * (Math.PI * 2 / 3);
    var r = 8 + Math.random() * 55;
    var spread = (0.3 + 0.5 * (r / 60)) * (Math.random() - 0.5);
    galaxyStars.push({
      baseAngle: armOffset + r * 0.06 + spread,
      dist: r,
      speed: 0.003 + 0.008 * (1 - r / 65),
      size: 0.3 + Math.random() * 1.0,
      hue: 200 + Math.random() * 60 + armIdx * 40,
      bright: 0.3 + Math.random() * 0.7,
      twinkleSpeed: 0.02 + Math.random() * 0.04
    });
  }

  var suckDone = false;
  var bhDotX = centerX, bhDotY = centerY;

  function draw() {
    ctx.clearRect(0, 0, W, H);
    t += 1;

    // --- PHASE 1-4: SOLAR SYSTEM + BLACK HOLE ---
    if (t <= 600) {
      var pull = 0, solarScale = 1, bhScale = 1, spinMultiplier = 1;

      if (t < 180) {
      } else if (t < 260) {
        var p = (t - 180) / 80;
        pull = easeIn(p) * 0.5;
        spinMultiplier = 1 + 15 * easeIn(p);
      } else if (t < 360) {
        var p = (t - 260) / 100;
        pull = 0.5 + 0.5 * easeIn(p);
        solarScale = 1 - easeIn(p);
        spinMultiplier = 16 + 30 * p;
      } else {
        pull = 1;
        solarScale = 0;
        suckDone = true;
        var p = (t - 360) / 240;
        bhScale = 1 - 0.92 * easeInOut(p);
        bhDotX = bhHomeX + (centerX - bhHomeX) * easeInOut(p);
        bhDotY = bhY + (centerY - bhY) * easeInOut(p);
      }

      var solarX = solarHomeX + (bhHomeX - solarHomeX) * pull;
      var solarY = solarHomeY + (bhY - solarHomeY) * pull;
      var curBhX = suckDone ? bhDotX : bhHomeX;
      var curBhY = suckDone ? bhDotY : bhY;
      var bhR = 7 * bhScale;

      if (bhScale > 0.15) {
        var distR = bhR * 5;
        var distGlow = ctx.createRadialGradient(curBhX, curBhY, bhR, curBhX, curBhY, distR);
        distGlow.addColorStop(0, "rgba(60, 0, 120, 0.12)");
        distGlow.addColorStop(0.4, "rgba(40, 0, 80, 0.06)");
        distGlow.addColorStop(1, "rgba(20, 0, 40, 0)");
        ctx.beginPath(); ctx.arc(curBhX, curBhY, distR, 0, Math.PI * 2); ctx.fillStyle = distGlow; ctx.fill();
      }

      for (var i = 0; i < bhParticles.length; i++) {
        var pt = bhParticles[i];
        pt.angle += pt.speed * (1 + (1 - bhScale) * 3);
        var d = pt.dist * bhScale * (0.8 + 0.2 * Math.sin(t * 0.01 + i));
        var px = curBhX + d * Math.cos(pt.angle) * 1.8;
        var py = curBhY + d * Math.sin(pt.angle) * 0.4;
        var alpha = pt.bright * bhScale * (0.5 + 0.3 * Math.sin(t * 0.05 + i));
        if (t >= 260 && t < 360) alpha *= 2;
        ctx.beginPath(); ctx.arc(px, py, pt.size * bhScale, 0, Math.PI * 2);
        ctx.fillStyle = "hsla(" + (15 + pt.dist * 2.5) + ", 85%, 55%, " + alpha + ")"; ctx.fill();
      }

      if (bhScale > 0.15) {
        ctx.save(); ctx.translate(curBhX, curBhY); ctx.scale(1.8, 0.4);
        ctx.beginPath(); ctx.arc(0, 0, bhR * 2.2, 0, Math.PI * 2); ctx.restore();
        ctx.strokeStyle = "rgba(255, 150, 50, " + (0.3 * bhScale) + ")";
        ctx.lineWidth = 1.5 * bhScale; ctx.stroke();
      }

      var bhGrad = ctx.createRadialGradient(curBhX, curBhY, 0, curBhX, curBhY, Math.max(bhR, 1));
      bhGrad.addColorStop(0, "#000"); bhGrad.addColorStop(0.6, "#050510");
      bhGrad.addColorStop(1, "rgba(20, 5, 50, 0.9)");
      ctx.beginPath(); ctx.arc(curBhX, curBhY, Math.max(bhR, 1), 0, Math.PI * 2);
      ctx.fillStyle = bhGrad; ctx.fill();

      if (bhR > 1.5) {
        ctx.beginPath(); ctx.arc(curBhX, curBhY, bhR + 1.5, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(255, 160, 60, " + ((0.4 + 0.2 * Math.sin(t * 0.06)) * bhScale) + ")";
        ctx.lineWidth = 1.5 * bhScale; ctx.stroke();
      }

      if (pull > 0.05 && solarScale > 0.05) {
        for (var s = 0; s < 8; s++) {
          var sa = t * 0.05 + s * 0.785;
          var sx1 = solarX + 20 * solarScale * Math.cos(sa);
          var sy1 = solarY + 20 * solarScale * Math.sin(sa);
          ctx.beginPath(); ctx.moveTo(sx1, sy1);
          ctx.quadraticCurveTo(
            (sx1 + curBhX) / 2 + 5 * Math.sin(sa + t * 0.02),
            (sy1 + curBhY) / 2 + 10 * Math.sin(sa),
            curBhX + bhR * Math.cos(sa + 1), curBhY + bhR * Math.sin(sa + 1));
          ctx.strokeStyle = "rgba(255, 180, 80, " + (pull * 0.5) + ")";
          ctx.lineWidth = 0.8; ctx.stroke();
        }
      }

      if (solarScale > 0.02) {
        ctx.save(); ctx.translate(solarX, solarY); ctx.scale(solarScale, solarScale);
        var sunR = 10 * (1 + 0.06 * Math.sin(t * 0.03));
        var sunGlow = ctx.createRadialGradient(0, 0, 0, 0, 0, sunR * 3);
        sunGlow.addColorStop(0, "rgba(255, 200, 50, 0.5)"); sunGlow.addColorStop(0.5, "rgba(255, 180, 40, 0.15)");
        sunGlow.addColorStop(1, "rgba(255, 160, 30, 0)");
        ctx.beginPath(); ctx.arc(0, 0, sunR * 3, 0, Math.PI * 2); ctx.fillStyle = sunGlow; ctx.fill();
        var sGrad = ctx.createRadialGradient(-2, -2, 0, 0, 0, sunR);
        sGrad.addColorStop(0, "#fff4b0"); sGrad.addColorStop(0.4, "#ffd540"); sGrad.addColorStop(1, "#f0a000");
        ctx.beginPath(); ctx.arc(0, 0, sunR, 0, Math.PI * 2); ctx.fillStyle = sGrad; ctx.fill();
        ctx.beginPath(); ctx.arc(0, 0, 35, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(100, 160, 220, 0.15)"; ctx.lineWidth = 0.5; ctx.stroke();

        var eA = t * 0.012 * spinMultiplier;
        var eX = 35 * Math.cos(eA), eY = 35 * Math.sin(eA);
        var eGrad = ctx.createRadialGradient(eX - 1, eY - 1, 0, eX, eY, 5);
        eGrad.addColorStop(0, "#6db3f2"); eGrad.addColorStop(0.5, "#3a8fd4"); eGrad.addColorStop(1, "#1a5f9a");
        ctx.beginPath(); ctx.arc(eX, eY, 5, 0, Math.PI * 2); ctx.fillStyle = eGrad; ctx.fill();
        ctx.beginPath(); ctx.arc(eX + 1, eY - 1, 2, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(60, 160, 80, 0.5)"; ctx.fill();

        var mA = t * 0.04 * spinMultiplier;
        var mX = eX + 11 * Math.cos(mA), mY = eY + 11 * Math.sin(mA);
        var mGrad = ctx.createRadialGradient(mX - 0.5, mY - 0.5, 0, mX, mY, 2);
        mGrad.addColorStop(0, "#e8e8e8"); mGrad.addColorStop(1, "#aaa");
        ctx.beginPath(); ctx.arc(mX, mY, 2, 0, Math.PI * 2); ctx.fillStyle = mGrad; ctx.fill();
        ctx.restore();
      }
    }

    // --- PHASE 5: GALAXY FORMS AND STAYS ---
    if (t > 600) {
      var gT = t - 600;
      var fadeIn = Math.min(gT / 300, 1);

      ctx.beginPath(); ctx.arc(centerX, centerY, 1.5, 0, Math.PI * 2);
      ctx.fillStyle = "#000"; ctx.fill();
      ctx.beginPath(); ctx.arc(centerX, centerY, 2.5, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(200, 150, 255, " + (0.2 + 0.1 * Math.sin(gT * 0.02)) + ")";
      ctx.lineWidth = 0.5; ctx.stroke();

      var cGlow = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 12 * fadeIn);
      cGlow.addColorStop(0, "rgba(220, 200, 255, " + (0.25 * fadeIn) + ")");
      cGlow.addColorStop(1, "rgba(150, 120, 220, 0)");
      ctx.beginPath(); ctx.arc(centerX, centerY, 12 * fadeIn, 0, Math.PI * 2);
      ctx.fillStyle = cGlow; ctx.fill();

      for (var i = 0; i < galaxyStars.length; i++) {
        var s = galaxyStars[i];
        var starFadeIn = Math.min(Math.max((gT - s.dist * 2) / 200, 0), 1) * fadeIn;
        if (starFadeIn <= 0) continue;

        var angle = s.baseAngle + gT * s.speed;
        var tilt = 0.35;
        var rx = s.dist * fadeIn;
        var ry = s.dist * fadeIn * tilt;
        var sx = centerX + rx * Math.cos(angle);
        var sy = centerY + ry * Math.sin(angle);

        var twinkle = 0.6 + 0.4 * Math.sin(gT * s.twinkleSpeed + i);
        var alpha = s.bright * starFadeIn * twinkle;

        ctx.beginPath(); ctx.arc(sx, sy, s.size * starFadeIn, 0, Math.PI * 2);
        ctx.fillStyle = "hsla(" + s.hue + ", 70%, 75%, " + alpha + ")"; ctx.fill();
      }
    }

    requestAnimationFrame(draw);
  }
  draw();
})();
