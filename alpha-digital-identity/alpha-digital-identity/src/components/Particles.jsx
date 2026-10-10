import { useEffect, useRef } from "react";

export default function Particles({ color = "185,152,100", link = 125, speed = 0.22, max = 80, className = "" }) {
  const ref = useRef(null);

  useEffect(() => {
    const c = ref.current;
    const ctx = c.getContext("2d");
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0, h = 0, raf = 0, pts = [];
    const mouse = { x: -9999, y: -9999 };

    function size() {
      const r = c.getBoundingClientRect();
      w = r.width; h = r.height;
      c.width = w * dpr; c.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.min(max, Math.round((w * h) / 15000));
      pts = Array.from({ length: n }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * speed * 2, vy: (Math.random() - 0.5) * speed * 2,
        r: Math.random() * 1.5 + 0.6
      }));
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        if (!reduce) {
          p.x += p.vx; p.y += p.vy;
          if (p.x < -10) p.x = w + 10; else if (p.x > w + 10) p.x = -10;
          if (p.y < -10) p.y = h + 10; else if (p.y > h + 10) p.y = -10;
          const dx = p.x - mouse.x, dy = p.y - mouse.y, d = Math.hypot(dx, dy);
          if (d < 140 && d > 0.1) { p.x += (dx / d) * 0.7; p.y += (dy / d) * 0.7; }
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, 6.283);
        ctx.fillStyle = `rgba(${color},.75)`;
        ctx.fill();
        for (let j = i + 1; j < pts.length; j++) {
          const q = pts[j], d = Math.hypot(p.x - q.x, p.y - q.y);
          if (d < link) {
            ctx.strokeStyle = `rgba(${color},${(1 - d / link) * 0.28})`;
            ctx.lineWidth = 0.7;
            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
          }
        }
      }
      if (!reduce) raf = requestAnimationFrame(draw);
    }

    function move(e) {
      const r = c.getBoundingClientRect();
      mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
    }
    function leave() { mouse.x = mouse.y = -9999; }

    size(); draw();
    addEventListener("resize", size);
    addEventListener("pointermove", move);
    addEventListener("pointerleave", leave);
    return () => {
      cancelAnimationFrame(raf);
      removeEventListener("resize", size);
      removeEventListener("pointermove", move);
      removeEventListener("pointerleave", leave);
    };
  }, [color, link, speed, max]);

  return <canvas ref={ref} className={`particles ${className}`} aria-hidden="true" />;
}
