"use client";

import { useEffect, useRef } from "react";

const EMERALD_RGB = "5, 150, 105";
const CONNECTION_DISTANCE = 220;
const MOUSE_DISTANCE = 250;

export function NetworkBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Respect reduced motion preference
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = canvas.parentElement?.offsetHeight || 640;
      initParticles();
    };

    const NODE_TYPES = [
      "database",
      "human",
      "ai",
      "domain",
      "domain",
      "domain",
    ];

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      type: string;
      size: number;

      constructor() {
        this.x = Math.random() * canvas!.width;
        this.y = Math.random() * canvas!.height;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
        this.type = NODE_TYPES[Math.floor(Math.random() * NODE_TYPES.length)];

        if (this.type === "human") this.size = 14;
        else if (this.type === "database") this.size = 16;
        else if (this.type === "ai") this.size = 13;
        else this.size = 4.5;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > canvas!.width) this.vx = -this.vx;
        if (this.y < 0 || this.y > canvas!.height) this.vy = -this.vy;
      }

      draw() {
        if (!ctx) return;
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.strokeStyle = `rgba(${EMERALD_RGB}, 0.7)`;
        ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
        ctx.lineWidth = 1.6;

        ctx.beginPath();
        if (this.type === "database") {
          const w = this.size;
          const h = this.size * 1.2;
          ctx.ellipse(0, -h / 3, w, w / 3, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(-w, -h / 3);
          ctx.lineTo(-w, h / 3);
          ctx.ellipse(0, h / 3, w, w / 3, 0, 0, Math.PI, true);
          ctx.lineTo(w, -h / 3);
          ctx.fill();
          ctx.stroke();

          ctx.beginPath();
          ctx.ellipse(0, 0, w, w / 3, 0, 0, Math.PI, true);
          ctx.strokeStyle = `rgba(${EMERALD_RGB}, 0.3)`;
          ctx.stroke();
        } else if (this.type === "human") {
          ctx.arc(0, -this.size / 2.5, this.size / 2.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          ctx.beginPath();
          ctx.arc(0, this.size, this.size, Math.PI, 0);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
        } else if (this.type === "ai") {
          ctx.moveTo(0, -this.size);
          for (let i = 1; i <= 6; i++) {
            ctx.lineTo(
              this.size * Math.sin((i * Math.PI) / 3),
              -this.size * Math.cos((i * Math.PI) / 3),
            );
          }
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          ctx.beginPath();
          ctx.arc(0, 0, 2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${EMERALD_RGB}, 0.8)`;
          ctx.fill();
        } else {
          ctx.arc(0, 0, this.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${EMERALD_RGB}, 0.2)`;
          ctx.fill();
          ctx.stroke();
        }

        ctx.restore();
      }
    }

    class Packet {
      startNode: Particle;
      endNode: Particle;
      progress: number;
      speed: number;

      constructor(start: Particle, end: Particle) {
        this.startNode = start;
        this.endNode = end;
        this.progress = 0;
        this.speed = Math.random() * 0.008 + 0.004; // smooth traveling speed
      }

      update() {
        this.progress += this.speed;
      }

      draw() {
        if (!ctx) return;
        const dx = this.endNode.x - this.startNode.x;
        const dy = this.endNode.y - this.startNode.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // If nodes move too far apart, terminate early
        if (dist > CONNECTION_DISTANCE * 1.5) {
          this.progress = 1;
          return;
        }

        const x = this.startNode.x + dx * this.progress;
        const y = this.startNode.y + dy * this.progress;

        // Peak opacity at the middle of the journey
        const alpha = Math.sin(this.progress * Math.PI);

        // Draw glowing data packet
        ctx.beginPath();
        ctx.arc(x, y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${EMERALD_RGB}, ${alpha})`;
        ctx.fill();

        // Outer glow
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${EMERALD_RGB}, ${alpha * 0.25})`;
        ctx.fill();
      }
    }

    let particles: Particle[] = [];
    let packets: Packet[] = [];

    const initParticles = () => {
      particles = [];
      packets = [];
      const particleCount = Math.floor((canvas.width * canvas.height) / 20000);
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    };

    let mouse = { x: -1000, y: -1000 };
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    const handleMouseLeave = () => {
      mouse = { x: -1000, y: -1000 };
    };

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", handleMouseMove);
    document.body.addEventListener("mouseleave", handleMouseLeave);

    resize();

    const animate = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Phase 1: Update positions and draw connection lines
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();

        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < CONNECTION_DISTANCE) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            const opacity =
              Math.pow(1 - distance / CONNECTION_DISTANCE, 2) * 0.4;
            ctx.strokeStyle = `rgba(${EMERALD_RGB}, ${opacity})`;
            ctx.lineWidth = 1.5;
            ctx.stroke();

            // Randomly spawn a data packet between actively connected nodes
            // Probability depends on frame rate, 0.2% per connection is a good balance
            if (Math.random() < 0.002) {
              if (Math.random() > 0.5)
                packets.push(new Packet(particles[i], particles[j]));
              else packets.push(new Packet(particles[j], particles[i]));
            }
          }
        }

        const dxMouse = particles[i].x - mouse.x;
        const dyMouse = particles[i].y - mouse.y;
        const distanceMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);

        if (distanceMouse < MOUSE_DISTANCE) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(mouse.x, mouse.y);
          const opacity = Math.pow(1 - distanceMouse / MOUSE_DISTANCE, 2) * 0.5;
          ctx.strokeStyle = `rgba(${EMERALD_RGB}, ${opacity})`;
          ctx.lineWidth = 1.5;
          ctx.stroke();

          // Organic pulling effect towards mouse
          particles[i].x += dxMouse * 0.012;
          particles[i].y += dyMouse * 0.012;

          // Occasionally send packets to the mouse position (treated as a virtual node)
          if (Math.random() < 0.005) {
            // Create a dummy particle for the mouse to allow packet to travel
            const mouseParticle = new Particle();
            mouseParticle.x = mouse.x;
            mouseParticle.y = mouse.y;
            mouseParticle.update = () => {
              mouseParticle.x = mouse.x;
              mouseParticle.y = mouse.y;
            };
            packets.push(new Packet(particles[i], mouseParticle));
          }
        }
      }

      // Phase 2: Update and draw flowing packets (underneath nodes)
      for (let p = packets.length - 1; p >= 0; p--) {
        packets[p].update();
        packets[p].draw();
        if (packets[p].progress >= 1) {
          packets.splice(p, 1);
        }
      }

      // Phase 3: Draw solid nodes on top of all lines and packets
      for (let i = 0; i < particles.length; i++) {
        particles[i].draw();
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      document.body.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
      <canvas ref={canvasRef} className="w-full h-full opacity-70" />
    </div>
  );
}
