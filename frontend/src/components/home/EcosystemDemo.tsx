"use client";

import { useEffect, useRef } from "react";

const EMERALD_RGB = "16, 185, 129"; // A bit brighter for demo
const BLUE_RGB = "59, 130, 246";
const AMBER_RGB = "245, 158, 11";

type NodeType = "brain" | "data" | "bio" | "env" | "city" | "human";

class Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  type: NodeType;
  size: number;
  pulse = 0;
  pulseSpeed = 0.02 + Math.random() * 0.02;

  constructor(w: number, h: number, type: NodeType) {
    this.x = Math.random() * w;
    this.y = Math.random() * h;
    this.vx = (Math.random() - 0.5) * 0.3;
    this.vy = (Math.random() - 0.5) * 0.3;
    this.type = type;

    switch (type) {
      case "brain":
        this.size = 18;
        break;
      case "data":
        this.size = 16;
        break;
      case "human":
        this.size = 14;
        break;
      default:
        this.size = 12;
        break;
    }
  }

  update(w: number, h: number) {
    this.x += this.vx;
    this.y += this.vy;
    this.pulse += this.pulseSpeed;

    if (this.x < 0 || this.x > w) this.vx *= -1;
    if (this.y < 0 || this.y > h) this.vy *= -1;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.translate(this.x, this.y);

    const glow = Math.sin(this.pulse) * 0.3 + 0.7;
    ctx.strokeStyle = `rgba(${EMERALD_RGB}, ${0.8 * glow})`;
    ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
    ctx.lineWidth = 2;

    switch (this.type) {
      case "brain":
        this.drawBrain(ctx);
        break;
      case "data":
        this.drawData(ctx);
        break;
      case "bio":
        this.drawBio(ctx);
        break;
      case "env":
        this.drawEnv(ctx);
        break;
      case "city":
        this.drawCity(ctx);
        break;
      case "human":
        this.drawHuman(ctx);
        break;
    }

    ctx.restore();
  }

  drawBrain(ctx: CanvasRenderingContext2D) {
    const s = this.size;
    ctx.beginPath();
    // Neural network style center
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI) / 3;
      ctx.lineTo(s * Math.cos(angle), s * Math.sin(angle));
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Core dots
    ctx.fillStyle = `rgb(${EMERALD_RGB})`;
    ctx.beginPath();
    ctx.arc(0, 0, 3, 0, Math.PI * 2);
    ctx.fill();

    for (let i = 0; i < 3; i++) {
      const angle = (i * Math.PI * 2) / 3 + this.pulse;
      ctx.beginPath();
      ctx.arc(
        s * 0.6 * Math.cos(angle),
        s * 0.6 * Math.sin(angle),
        2,
        0,
        Math.PI * 2,
      );
      ctx.fill();
    }
  }

  drawData(ctx: CanvasRenderingContext2D) {
    const w = this.size * 0.8;
    const h = this.size;
    // Cylinder
    ctx.beginPath();
    ctx.ellipse(0, -h / 3, w, w / 2.5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(-w, -h / 3);
    ctx.lineTo(-w, h / 3);
    ctx.ellipse(0, h / 3, w, w / 2.5, 0, 0, Math.PI, true);
    ctx.lineTo(w, -h / 3);
    ctx.fill();
    ctx.stroke();

    // Pulsing data bars
    const barW = w * 0.6;
    const offset = Math.sin(this.pulse) * 2;
    ctx.strokeStyle = `rgba(${EMERALD_RGB}, 0.3)`;
    ctx.beginPath();
    ctx.moveTo(-barW, 0 + offset);
    ctx.lineTo(barW, 0 + offset);
    ctx.stroke();
  }

  drawBio(ctx: CanvasRenderingContext2D) {
    const s = this.size;
    // Leaf shape
    ctx.beginPath();
    ctx.moveTo(0, s);
    ctx.bezierCurveTo(s, s, s, -s, 0, -s);
    ctx.bezierCurveTo(-s, -s, -s, s, 0, s);
    ctx.fill();
    ctx.stroke();
    // Vein
    ctx.beginPath();
    ctx.moveTo(0, s);
    ctx.lineTo(0, -s);
    ctx.strokeStyle = `rgba(${EMERALD_RGB}, 0.4)`;
    ctx.stroke();
  }

  drawEnv(ctx: CanvasRenderingContext2D) {
    const s = this.size;
    // Water drop
    ctx.beginPath();
    ctx.moveTo(0, -s);
    ctx.bezierCurveTo(s, 0, s, s, 0, s);
    ctx.bezierCurveTo(-s, s, -s, 0, 0, -s);
    ctx.fill();
    ctx.stroke();
  }

  drawCity(ctx: CanvasRenderingContext2D) {
    const s = this.size;
    // Simple building silhouettes in a grid-like box
    ctx.beginPath();
    ctx.rect(-s / 2, -s / 2, s, s);
    ctx.stroke();

    ctx.fillStyle = `rgba(${EMERALD_RGB}, 0.1)`;
    ctx.fillRect(-s / 2, -s / 2, s, s);

    ctx.beginPath();
    ctx.moveTo(-s / 4, s / 2);
    ctx.lineTo(-s / 4, -s / 8);
    ctx.lineTo(0, -s / 2);
    ctx.lineTo(s / 4, -s / 4);
    ctx.lineTo(s / 4, s / 2);
    ctx.stroke();
  }

  drawHuman(ctx: CanvasRenderingContext2D) {
    const s = this.size;
    ctx.beginPath();
    ctx.arc(0, -s / 3, s / 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, s, s, Math.PI, 0);
    ctx.fill();
    ctx.stroke();
  }
}

class Packet {
  x: number;
  y: number;
  progress = 0;
  start: Particle;
  end: Particle;
  color: string;

  constructor(start: Particle, end: Particle) {
    this.start = start;
    this.end = end;
    this.x = start.x;
    this.y = start.y;

    // Color depends on destination
    if (["bio", "env", "city"].includes(end.type)) {
      this.color = `rgb(${AMBER_RGB})`; // Value creation color
    } else {
      this.color = `rgb(${EMERALD_RGB})`;
    }
  }

  update() {
    this.progress += 0.01;
    this.x = this.start.x + (this.end.x - this.start.x) * this.progress;
    this.y = this.start.y + (this.end.y - this.start.y) * this.progress;
  }

  draw(ctx: CanvasRenderingContext2D) {
    const alpha = Math.sin(this.progress * Math.PI);
    ctx.fillStyle = this.color
      .replace("rgb", "rgba")
      .replace(")", `, ${alpha})`);
    ctx.beginPath();
    ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
    ctx.fill();

    // Glow
    ctx.shadowBlur = 10;
    ctx.shadowColor = this.color;
    ctx.fill();
    ctx.shadowBlur = 0;
  }
}

export function EcosystemDemo() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let particles: Particle[] = [];
    let packets: Packet[] = [];
    let frame: number;

    const init = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;

      particles = [];
      const types: NodeType[] = [
        "brain",
        "data",
        "bio",
        "env",
        "city",
        "human",
      ];
      types.forEach((t) => {
        for (let i = 0; i < 3; i++)
          particles.push(new Particle(canvas.width, canvas.height, t));
      });
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw Connections first
      particles.forEach((p1) => {
        particles.forEach((p2) => {
          const d = Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
          if (d < 200) {
            ctx.strokeStyle = `rgba(${EMERALD_RGB}, ${0.1 * (1 - d / 200)})`;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();

            if (Math.random() < 0.001) packets.push(new Packet(p1, p2));
          }
        });
        p1.update(canvas.width, canvas.height);
      });

      packets = packets.filter((p) => {
        p.update();
        p.draw(ctx);
        return p.progress < 1;
      });

      particles.forEach((p) => p.draw(ctx));
      frame = requestAnimationFrame(animate);
    };

    init();
    animate();
    window.addEventListener("resize", init);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", init);
    };
  }, []);

  return (
    <div className="w-full h-[500px] bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden relative">
      <canvas ref={canvasRef} className="w-full h-full" />
      <div className="absolute top-4 left-4 p-4 bg-white/80 backdrop-blur rounded-xl border border-white shadow-xl max-w-xs">
        <h4 className="font-bold text-slate-900 mb-2">
          Ecosystem Concept Demo
        </h4>
        <p className="text-xs text-slate-600 leading-relaxed">
          연구실의 3대 도메인(**Bio, Env, City**)이 데이터 허브와 AI 브레인을
          통해 연결되어 실질적인 가치(황색 패킷)를 창출하는 흐름입니다.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <span className="text-[10px] px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full font-bold">
            🧠 AI Brain
          </span>
          <span className="text-[10px] px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full font-bold">
            🗄️ Data Hub
          </span>
          <span className="text-[10px] px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full font-bold">
            🌱 Bio / 💧 Env / 🏢 City
          </span>
        </div>
      </div>
    </div>
  );
}
