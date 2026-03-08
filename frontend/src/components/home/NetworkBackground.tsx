"use client";

import { useEffect, useRef } from "react";

export function NetworkBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      // Use the parent height to fill the hero section properly
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
    ]; // more domains than specific icons

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
        this.vx = (Math.random() - 0.5) * 0.4; // Slower, elegant floating
        this.vy = (Math.random() - 0.5) * 0.4;
        this.type = NODE_TYPES[Math.floor(Math.random() * NODE_TYPES.length)];

        if (this.type === "human") this.size = 11;
        else if (this.type === "database") this.size = 12;
        else if (this.type === "ai") this.size = 9;
        else this.size = 4; // domain/normal node
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
        ctx.strokeStyle = "rgba(5, 150, 105, 0.7)"; // Emerald stroke
        ctx.fillStyle = "rgba(255, 255, 255, 0.95)"; // Solid white inside
        ctx.lineWidth = 1.6;

        ctx.beginPath();
        if (this.type === "database") {
          // Draw a stylized database cylinder
          const w = this.size;
          const h = this.size * 1.2;
          // Top lid
          ctx.ellipse(0, -h / 3, w, w / 3, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          // Body
          ctx.beginPath();
          ctx.moveTo(-w, -h / 3);
          ctx.lineTo(-w, h / 3);
          ctx.ellipse(0, h / 3, w, w / 3, 0, 0, Math.PI, true);
          ctx.lineTo(w, -h / 3);
          ctx.fill();
          ctx.stroke();

          // Internal line representation
          ctx.beginPath();
          ctx.ellipse(0, 0, w, w / 3, 0, 0, Math.PI, true);
          ctx.strokeStyle = "rgba(5, 150, 105, 0.3)";
          ctx.stroke();
        } else if (this.type === "human") {
          // Draw a person/user icon (Problem owner / Customer)
          ctx.arc(0, -this.size / 2.5, this.size / 2.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          ctx.beginPath();
          ctx.arc(0, this.size, this.size, Math.PI, 0); // shoulders
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
        } else if (this.type === "ai") {
          // Draw an AI model node (Hexagon)
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

          // Inner core
          ctx.beginPath();
          ctx.arc(0, 0, 2, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(5, 150, 105, 0.8)";
          ctx.fill();
        } else {
          // Domain / normal node connection
          ctx.arc(0, 0, this.size, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(5, 150, 105, 0.2)";
          ctx.fill();
          ctx.stroke();
        }

        ctx.restore();
      }
    }

    let particles: Particle[] = [];
    const initParticles = () => {
      particles = [];
      const particleCount = Math.floor((canvas.width * canvas.height) / 20000); // Sparsity allows icons to breathe
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

      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();

        // Connect nodes to each other
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 220) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            // Non-linear opacity for smoother fade
            const opacity = Math.pow(1 - distance / 220, 2);
            ctx.strokeStyle = `rgba(5, 150, 105, ${opacity * 0.4})`;
            ctx.lineWidth = 1.5;
            ctx.stroke();
          }
        }

        // Connect nodes to mouse interaction
        const dxMouse = particles[i].x - mouse.x;
        const dyMouse = particles[i].y - mouse.y;
        const distanceMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);

        if (distanceMouse < 250) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(mouse.x, mouse.y);
          const opacity = Math.pow(1 - distanceMouse / 250, 2);
          ctx.strokeStyle = `rgba(5, 150, 105, ${opacity * 0.5})`;
          ctx.lineWidth = 1.5;
          ctx.stroke();

          // Organic pulling effect towards mouse
          particles[i].x += dxMouse * 0.012;
          particles[i].y += dyMouse * 0.012;
        }
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
      {/* Adds a slight opacity layer and blur to integrate deeply with the hero */}
      <canvas ref={canvasRef} className="w-full h-full opacity-70" />
    </div>
  );
}
