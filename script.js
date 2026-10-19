/**
 * 20/10 GREETING CARD SCRIPT
 * - Hiệu ứng cánh hoa hồng & bụi sao lung linh
 * - Bấm nút nhận thêm thông điệp ngọt ngào + hiệu ứng tim nổ tung
 */

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // 1. TƯƠNG TÁC THÔNG ĐIỆP NGỌT NGÀO
  // ==========================================
  const btnSweetHeart = document.getElementById('btn-sweet-heart');
  const sweetQuotePopup = document.getElementById('sweet-quote-popup');

  const sweetQuotes = [
    "Mong thế giới này luôn dịu dàng với cậu 🌷",
    "Hôm nay cậu chính là bông hoa rạng rỡ nhất! ✨",
    "Chúc cậu luôn giữ nụ cười tỏa nắng trên môi 💖",
    "Mọi dự định sắp tới của cậu đều sẽ thành công rực rỡ 🍀",
    "Ăn ngon, ngủ ngoan và lúc nào cũng thật yêu đời nhé 🍰",
    "Cảm ơn vì đã luôn là một người bạn tuyệt vời trong đời tớ 🌸",
    "Xinh đẹp, tự tin và tỏa sáng theo cách riêng của cậu! 🌟",
    "Dù có bận rộn đến đâu, nhớ luôn yêu chiều bản thân nha ☕"
  ];

  let quoteIndex = 0;

  btnSweetHeart.addEventListener('click', (e) => {
    // Đổi câu chúc ngẫu nhiên
    let nextIndex;
    do {
      nextIndex = Math.floor(Math.random() * sweetQuotes.length);
    } while (nextIndex === quoteIndex && sweetQuotes.length > 1);
    quoteIndex = nextIndex;

    // Hiệu ứng chuyển chữ mượt mà
    sweetQuotePopup.style.opacity = '0';
    sweetQuotePopup.style.transform = 'translateY(6px)';

    setTimeout(() => {
      sweetQuotePopup.textContent = `"${sweetQuotes[quoteIndex]}"`;
      sweetQuotePopup.style.opacity = '1';
      sweetQuotePopup.style.transform = 'translateY(0)';
    }, 180);

    // Bắn pháo hoa trái tim từ vị trí nút bấm
    const rect = btnSweetHeart.getBoundingClientRect();
    createBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 28);
  });


  // ==========================================
  // 2. CANVAS CÁNH HOA & BỤI SAO LUNG LINH
  // ==========================================
  const canvas = document.getElementById('petal-canvas');
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  // Hạt cánh hoa hồng
  class Petal {
    constructor() {
      this.reset();
      this.y = Math.random() * height;
    }

    reset() {
      this.x = Math.random() * width;
      this.y = -20 - Math.random() * 40;
      this.size = 11 + Math.random() * 14;
      this.speedY = 1.0 + Math.random() * 1.6;
      this.speedX = -0.8 + Math.random() * 1.6;
      this.rotation = Math.random() * Math.PI * 2;
      this.rotationSpeed = (Math.random() - 0.5) * 0.03;
      this.flutterAngle = Math.random() * Math.PI * 2;
      this.flutterSpeed = 0.02 + Math.random() * 0.03;
      this.opacity = 0.55 + Math.random() * 0.35;
      const hues = [340, 345, 350, 355, 335];
      this.hue = hues[Math.floor(Math.random() * hues.length)];
    }

    update() {
      this.y += this.speedY;
      this.flutterAngle += this.flutterSpeed;
      this.x += Math.sin(this.flutterAngle) * 1.2 + this.speedX;
      this.rotation += this.rotationSpeed;

      if (this.y > height + 30 || this.x < -40 || this.x > width + 40) {
        this.reset();
      }
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.scale(Math.cos(this.flutterAngle * 0.8), 1);

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(-this.size * 0.6, -this.size * 0.8, -this.size * 0.8, this.size * 0.5, 0, this.size);
      ctx.bezierCurveTo(this.size * 0.8, this.size * 0.5, this.size * 0.6, -this.size * 0.8, 0, 0);

      const grad = ctx.createRadialGradient(0, this.size * 0.3, 2, 0, this.size * 0.3, this.size);
      grad.addColorStop(0, `hsla(${this.hue}, 100%, 85%, ${this.opacity})`);
      grad.addColorStop(0.7, `hsla(${this.hue}, 90%, 65%, ${this.opacity * 0.85})`);
      grad.addColorStop(1, `hsla(${this.hue}, 80%, 48%, ${this.opacity * 0.6})`);

      ctx.fillStyle = grad;
      ctx.shadowColor = `rgba(255, 105, 140, 0.35)`;
      ctx.shadowBlur = 8;
      ctx.fill();
      ctx.restore();
    }
  }

  // Hạt tim & bụi sao khi bấm nút
  class Sparkle {
    constructor(x, y, isHeart = false) {
      this.x = x;
      this.y = y;
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 5;
      this.vx = Math.cos(angle) * speed;
      this.vy = Math.sin(angle) * speed - 1.5;
      this.size = isHeart ? 14 : 3 + Math.random() * 3;
      this.isHeart = isHeart;
      this.alpha = 1;
      this.decay = 0.015 + Math.random() * 0.02;
      const colors = ['#ffd1dc', '#ff6584', '#f6d365', '#ffffff', '#ff9ebb'];
      this.color = colors[Math.floor(Math.random() * colors.length)];
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.vy += 0.08; // trọng lực nhẹ
      this.alpha -= this.decay;
    }

    draw() {
      if (this.alpha <= 0) return;
      ctx.save();
      ctx.globalAlpha = Math.max(0, this.alpha);

      if (this.isHeart) {
        ctx.fillStyle = this.color;
        ctx.font = `${this.size}px sans-serif`;
        ctx.fillText('💖', this.x, this.y);
      } else {
        ctx.fillStyle = this.color;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }
  }

  const petals = Array.from({ length: 30 }, () => new Petal());
  const sparkles = [];

  function createBurst(x, y, count = 25) {
    for (let i = 0; i < count; i++) {
      const isHeart = Math.random() > 0.65;
      sparkles.push(new Sparkle(x, y, isHeart));
    }
  }

  // Vệt sao nhẹ theo chuột
  let lastTrail = 0;
  window.addEventListener('mousemove', (e) => {
    const now = Date.now();
    if (now - lastTrail > 60) {
      lastTrail = now;
      sparkles.push(new Sparkle(e.clientX, e.clientY, false));
    }
  });

  // Vòng lặp vẽ
  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Vẽ cánh hoa
    petals.forEach(p => {
      p.update();
      p.draw();
    });

    // Vẽ bụi sao / tim
    for (let i = sparkles.length - 1; i >= 0; i--) {
      sparkles[i].update();
      sparkles[i].draw();
      if (sparkles[i].alpha <= 0) {
        sparkles.splice(i, 1);
      }
    }

    requestAnimationFrame(animate);
  }
  animate();

});
