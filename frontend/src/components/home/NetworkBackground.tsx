"use client";

import { useEffect, useRef } from "react";

const EMERALD_RGB = "5, 150, 105";
const COLORS = {
  domain: "148, 163, 184", // Slate 400 (Input/Neutral)
  human: "148, 163, 184", // Slate 400 (Input/Neutral)
  database: "16, 185, 129", // Emerald 500 (Brand/Storage)
  model: "5, 150, 105", // Emerald 600 (Core/Output)
  dot: "203, 213, 225", // Slate 300 (Relay)
};
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
      "model",
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
      stage: number;
      rotation: number;
      rotationSpeed: number;
      anchorX: number;
      anchorY: number;

      constructor(isRespawn = false) {
        const rand = Math.random();

        // Reduce neutral relay dots to 15% to avoid a cluttered "dizzying" look
        if (rand < 0.15) {
          this.stage = -1; // -1 means neutral dot
          this.type = "dot";
          this.anchorX = Math.random() * canvas!.width;
        } else {
          const zoneRand = Math.random();
          if (zoneRand < 0.35)
            this.stage = 0; // 35% domain/human
          else if (zoneRand < 0.7)
            this.stage = 1; // 35% database
          else this.stage = 2; // 30% ai

          if (this.stage === 0) {
            this.type = Math.random() > 0.4 ? "domain" : "human";
            // Zone 0 anchor spans 0% to 45%
            this.anchorX = Math.random() * 0.45 * canvas!.width;
          } else if (this.stage === 1) {
            this.type = "database";
            // Zone 1 anchor spans 25% to 75%
            this.anchorX = (0.25 + Math.random() * 0.5) * canvas!.width;
          } else {
            this.type = "model";
            // Zone 2 anchor spans 55% to 100%
            this.anchorX = (0.55 + Math.random() * 0.45) * canvas!.width;
          }
        }

        this.anchorY = Math.random() * canvas!.height;
        // Start particle near its anchor
        this.x = this.anchorX + (Math.random() - 0.5) * 50;
        this.y = this.anchorY + (Math.random() - 0.5) * 50;

        this.vx = (Math.random() - 0.5) * 1.5;
        this.vy = (Math.random() - 0.5) * 1.5;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.02;

        if (this.type === "human") this.size = 14;
        else if (this.type === "database") this.size = 16;
        else if (this.type === "model") this.size = 14;
        else if (this.type === "domain") this.size = 4.5;
        else this.size = 2.5; // neutral dot
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.rotation += this.rotationSpeed;

        // 1. Brownian motion to keep nodes feeling alive and constantly jiggling - much softer
        this.vx += (Math.random() - 0.5) * 0.03;
        this.vy += (Math.random() - 0.5) * 0.03;

        // 2. Gentle spring force toward stationary anchor
        this.vx += (this.anchorX - this.x) * 0.0002;
        this.vy += (this.anchorY - this.y) * 0.0002;

        // 3. Damping (Friction) allows them to settle into a soft orbit around anchor
        this.vx *= 0.95;
        this.vy *= 0.95;
      }

      draw() {
        if (!ctx) return;
        const color = COLORS[this.type as keyof typeof COLORS];
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.strokeStyle = `rgba(${color}, 0.8)`;
        ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
        ctx.lineWidth = 1.6;

        // Add a beautiful soft glowing effect around the nodes
        ctx.shadowBlur = 15;
        ctx.shadowColor = `rgba(${color}, 0.6)`;

        ctx.beginPath();
        if (this.type === "database") {
          const w = this.size;
          const h = this.size * 1.2;

          // Top ellipse
          ctx.ellipse(0, -h / 3, w, w / 3, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          // Body: Start from top-left, go down, arc counterclockwise from PI to 0, go up to top-right
          ctx.beginPath();
          ctx.moveTo(-w, -h / 3);
          ctx.lineTo(-w, h / 3);
          ctx.ellipse(0, h / 3, w, w / 3, 0, Math.PI, 0, true);
          ctx.lineTo(w, -h / 3);
          ctx.fill();
          ctx.stroke();

          // Middle rib for database drum (draw bottom half curve only)
          ctx.beginPath();
          ctx.ellipse(0, 0, w, w / 3, 0, 0, Math.PI, false);
          ctx.strokeStyle = `rgba(${color}, 0.3)`;
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
        } else if (this.type === "model") {
          ctx.rotate(this.rotation * 0.4); // apply very gentle rotation

          // Draw a professional, geometric Diamond/Rhombus for "Data Model / Insight"
          const r = this.size * 1.1;
          ctx.beginPath();
          ctx.moveTo(0, -r);
          ctx.lineTo(r, 0);
          ctx.lineTo(0, r);
          ctx.lineTo(-r, 0);
          ctx.closePath();

          ctx.fill();
          ctx.stroke();

          // Solid inner diamond core
          ctx.beginPath();
          ctx.moveTo(0, -r * 0.4);
          ctx.lineTo(r * 0.4, 0);
          ctx.lineTo(0, r * 0.4);
          ctx.lineTo(-r * 0.4, 0);
          ctx.closePath();
          ctx.fillStyle = `rgba(${color}, 0.95)`;
          ctx.fill();
        } else {
          ctx.arc(0, 0, this.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${color}, 0.2)`;
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
        // Make packets flow slightly slower for a premium feel
        this.speed = Math.random() * 0.006 + 0.003;
      }

      update() {
        this.progress += this.speed;
      }

      draw() {
        if (!ctx) return;
        const dx = this.endNode.x - this.startNode.x;
        const dy = this.endNode.y - this.startNode.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist > CONNECTION_DISTANCE * 1.5) {
          this.progress = 1;
          return;
        }

        const x = this.startNode.x + dx * this.progress;
        const y = this.startNode.y + dy * this.progress;

        const alpha = Math.sin(this.progress * Math.PI);
        const color = COLORS[this.startNode.type as keyof typeof COLORS];

        // Draw a beautiful glowing comet tail
        const tailLength = 0.15; // length of the tail as a percentage of the total distance
        const tailProgress = Math.max(0, this.progress - tailLength);
        const tailX = this.startNode.x + dx * tailProgress;
        const tailY = this.startNode.y + dy * tailProgress;

        ctx.save();
        const grad = ctx.createLinearGradient(tailX, tailY, x, y);
        grad.addColorStop(0, `rgba(${color}, 0)`);
        grad.addColorStop(1, `rgba(${color}, ${alpha})`);

        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(x, y);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 2.5;
        ctx.lineCap = "round";

        ctx.shadowBlur = 10;
        ctx.shadowColor = `rgba(${color}, ${alpha})`;
        ctx.stroke();

        // Draw the bright leading point of the packet
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.9})`;
        ctx.fill();
        ctx.restore();
      }
    }

    let particles: Particle[] = [];
    let packets: Packet[] = [];

    const initParticles = () => {
      particles = [];
      packets = [];
      // Greatly reduce particle count (divide by 36000 instead of 18000) for a highly simplistic, uncluttered look
      const particleCount = Math.floor((canvas.width * canvas.height) / 36000);
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

          if (distance > 0 && distance < CONNECTION_DISTANCE) {
            // Apply magnetic repulsion if particles get too close
            const MIN_DISTANCE = 80;
            if (distance < MIN_DISTANCE) {
              const repulsion = (MIN_DISTANCE - distance) / MIN_DISTANCE;
              const forceX = (dx / distance) * repulsion * 0.03;
              const forceY = (dy / distance) * repulsion * 0.03;

              particles[i].vx += forceX;
              particles[i].vy += forceY;
              particles[j].vx -= forceX;
              particles[j].vy -= forceY;
            }

            // Make the fade out much softer and more elegant
            const opacity =
              Math.pow(1 - distance / CONNECTION_DISTANCE, 2.5) * 0.35;

            // Create elegant gradient line
            const grad = ctx.createLinearGradient(
              particles[i].x,
              particles[i].y,
              particles[j].x,
              particles[j].y,
            );
            grad.addColorStop(
              0,
              `rgba(${COLORS[particles[i].type as keyof typeof COLORS]}, ${opacity})`,
            );
            grad.addColorStop(
              1,
              `rgba(${COLORS[particles[j].type as keyof typeof COLORS]}, ${opacity})`,
            );

            ctx.save();
            ctx.beginPath();
            // Draw a subtle curved Bézier line instead of a rigid straight line for an organic feel
            const midX = (particles[i].x + particles[j].x) / 2;
            const midY =
              (particles[i].y + particles[j].y) / 2 + distance * 0.15;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.quadraticCurveTo(midX, midY, particles[j].x, particles[j].y);

            ctx.strokeStyle = grad;
            ctx.lineWidth = distance < 80 ? 1.5 : 0.8; // Distinct thickness variation
            ctx.stroke();
            ctx.restore();

            // Randomly spawn a data packet between actively connected nodes
            // Probability increased to emphasize constant data flow across zones
            if (Math.random() < 0.008) {
              // FLOW RULE: Packets always travel from left to right (Pipeline Flow)
              if (particles[i].x < particles[j].x) {
                packets.push(new Packet(particles[i], particles[j]));
              } else {
                packets.push(new Packet(particles[j], particles[i]));
              }
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
          const color = COLORS[particles[i].type as keyof typeof COLORS];
          ctx.strokeStyle = `rgba(${color}, ${opacity})`;
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
    <div
      className="absolute inset-0 pointer-events-none z-0 overflow-hidden"
      style={{
        maskImage:
          "radial-gradient(ellipse at center, black 40%, transparent 95%)",
        WebkitMaskImage:
          "radial-gradient(ellipse at center, black 40%, transparent 95%)",
      }}
    >
      <canvas ref={canvasRef} className="w-full h-full opacity-80" />
    </div>
  );
}
