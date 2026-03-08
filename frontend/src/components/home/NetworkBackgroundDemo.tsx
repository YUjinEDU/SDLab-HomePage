"use client";

import { useEffect, useRef } from "react";

// Zone Colors
const PROBLEM_BG = "241, 245, 249"; // slate-100
const DATA_BG = "236, 253, 245"; // emerald-50
const LAB_BG = "240, 253, 244"; // green-50

const PROBLEM_RGB = "71, 85, 105"; // slate-600
const PROBLEM_LIGHT_RGB = "100, 116, 139"; // slate-500
const ALERT_RGB = "239, 68, 68"; // red-500

const DATA_RGB = "16, 185, 129"; // emerald-500
const DATA_LIGHT_RGB = "52, 211, 153"; // emerald-400

const LAB_RGB = "5, 150, 105"; // emerald-600
const LAB_LIGHT_RGB = "16, 185, 129"; // emerald-500

const SOLUTION_RGB = "59, 130, 246"; // blue-500

const GRID_SIZE = 120;
const HERO_ZONE_HEIGHT = 450;
const HERO_ZONE_WIDTH = 900;

type ZoneType = "problem" | "data" | "lab";
type DomainType = "city" | "bio" | "env";

export function NetworkBackgroundDemo() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = Math.max(
        canvas.parentElement?.offsetHeight || 720,
        window.innerHeight,
      );
      initNetwork();
    };

    const snapToGrid = (val: number) => Math.round(val / GRID_SIZE) * GRID_SIZE;

    class Particle {
      x: number;
      y: number;
      type: string;
      subType?: DomainType;
      zone: ZoneType;
      baseSize: number;
      size: number;
      rotation: number;
      pulseOffset: number;
      id: string;

      constructor(
        type: string,
        x: number,
        y: number,
        zone: ZoneType,
        subType?: DomainType,
      ) {
        this.id = Math.random().toString(36).substr(2, 9);
        this.x = x;
        this.y = y;
        this.type = type;
        this.zone = zone;
        this.subType = subType;
        this.rotation = Math.random() * Math.PI * 2;
        this.pulseOffset = Math.random() * Math.PI * 2;

        if (this.type === "institute") this.baseSize = 40;
        else if (this.type === "human") this.baseSize = 22;
        else if (this.type === "database") this.baseSize = 20;
        else if (this.type === "ai") this.baseSize = 20;
        else if (this.type === "domain") this.baseSize = 24;
        else this.baseSize = 10;

        this.size = this.baseSize;
      }

      draw(alphaMult: number = 1) {
        if (!ctx) return;
        ctx.save();
        ctx.translate(this.x, this.y);

        const baseRGB = this.zone === "problem" ? PROBLEM_RGB : DATA_RGB;
        const lightRGB =
          this.zone === "problem" ? PROBLEM_LIGHT_RGB : DATA_LIGHT_RGB;

        ctx.strokeStyle = `rgba(${baseRGB}, ${0.9 * alphaMult})`;
        ctx.fillStyle = `rgba(255, 255, 255, ${0.95 * alphaMult})`;
        ctx.lineWidth = 2.5;

        const drawAlert = () => {
          const alertPulse = Math.abs(Math.sin(time * 0.05 + this.pulseOffset));
          ctx.beginPath();
          ctx.arc(this.size, -this.size, 5 + alertPulse * 3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${ALERT_RGB}, ${(0.4 + alertPulse * 0.6) * alphaMult})`;
          ctx.fill();
          ctx.beginPath();
          ctx.arc(this.size, -this.size, 3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${alphaMult})`;
          ctx.fill();
        };

        if (this.type === "institute") {
          // Central Lab icon (Server / Building)
          ctx.fillStyle = `rgba(255, 255, 255, ${0.9 * alphaMult})`;
          ctx.strokeStyle = `rgba(${LAB_RGB}, ${alphaMult})`;
          ctx.lineWidth = 3;

          // Main Building Hexagon
          ctx.beginPath();
          for (let i = 0; i < 6; i++) {
            ctx.lineTo(
              this.size * Math.cos((i * Math.PI) / 3),
              this.size * Math.sin((i * Math.PI) / 3),
            );
          }
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          // Inner Brain / Network Core
          ctx.strokeStyle = `rgba(${LAB_LIGHT_RGB}, ${alphaMult})`;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(0, 0, this.size * 0.4, 0, Math.PI * 2);
          ctx.stroke();

          // Node pulses
          const pulse = Math.abs(Math.sin(time * 0.03));
          ctx.beginPath();
          ctx.arc(0, 0, this.size * 0.4 * pulse, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${LAB_LIGHT_RGB}, ${0.3 * alphaMult})`;
          ctx.fill();

          // Text mark
          ctx.fillStyle = `rgba(${LAB_RGB}, ${alphaMult})`;
          ctx.font = "bold 12px Arial";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText("SDL", 0, 0);
        } else if (this.type === "database") {
          const w = this.size;
          const h = this.size * 1.4;
          ctx.beginPath();
          ctx.ellipse(0, -h / 3, w, w / 3, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(-w, -h / 3);
          ctx.lineTo(-w, h / 3);
          ctx.ellipse(0, h / 3, w, w / 3, 0, Math.PI, 0, true);
          ctx.lineTo(w, -h / 3);
          ctx.fill();
          ctx.stroke();
          const scanY = (Math.sin(time * 0.05 + this.pulseOffset) * h) / 3;
          ctx.beginPath();
          ctx.ellipse(
            0,
            scanY,
            w * 0.9,
            w * 0.3,
            0,
            Math.PI,
            2 * Math.PI,
            false,
          );
          ctx.strokeStyle = `rgba(${lightRGB}, ${0.9 * alphaMult})`;
          ctx.lineWidth = 2;
          ctx.stroke();
        } else if (this.type === "human") {
          ctx.beginPath();
          ctx.arc(0, -this.size / 2.5, this.size / 2.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(0, this.size, this.size, Math.PI, 0);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
        } else if (this.type === "ai") {
          ctx.rotate(this.rotation);
          ctx.beginPath();
          for (let i = 0; i < 6; i++)
            ctx.lineTo(
              this.size * Math.sin((i * Math.PI) / 3),
              -this.size * Math.cos((i * Math.PI) / 3),
            );
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
          const pulse = Math.abs(Math.sin(time * 0.05 + this.pulseOffset));
          ctx.beginPath();
          ctx.arc(0, 0, 3 + pulse * 3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${lightRGB}, ${(0.6 + pulse * 0.4) * alphaMult})`;
          ctx.fill();
        } else if (this.type === "domain") {
          // Problem Domain Icons
          ctx.fillStyle = `rgba(255, 255, 255, ${0.9 * alphaMult})`;
          ctx.lineWidth = 2;

          if (this.subType === "city") {
            // Smart City Skyline
            ctx.beginPath();
            ctx.moveTo(-15, 10);
            ctx.lineTo(-15, -5);
            ctx.lineTo(-5, -5);
            ctx.lineTo(-5, -15);
            ctx.lineTo(5, -15);
            ctx.lineTo(5, -2);
            ctx.lineTo(15, -2);
            ctx.lineTo(15, 10);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
          } else if (this.subType === "env") {
            // Environment Leaf
            ctx.beginPath();
            ctx.moveTo(0, 15);
            ctx.quadraticCurveTo(20, 10, 0, -15);
            ctx.quadraticCurveTo(-20, 10, 0, 15);
            ctx.fill();
            ctx.stroke();
          } else {
            // Bio / DNA / Health (Cross)
            ctx.beginPath();
            ctx.moveTo(-5, -15);
            ctx.lineTo(5, -15);
            ctx.lineTo(5, -5);
            ctx.lineTo(15, -5);
            ctx.lineTo(15, 5);
            ctx.lineTo(5, 5);
            ctx.lineTo(5, 15);
            ctx.lineTo(-5, 15);
            ctx.lineTo(-5, 5);
            ctx.lineTo(-15, 5);
            ctx.lineTo(-15, -5);
            ctx.lineTo(-5, -5);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
          }
          drawAlert();
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, 4, 0, Math.PI * 2);
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
      path: { x: number; y: number }[];
      isSolution: boolean;

      constructor(
        start: Particle,
        end: Particle,
        path: { x: number; y: number }[],
        isSolution: boolean = false,
      ) {
        this.startNode = start;
        this.endNode = end;
        this.progress = 0;
        this.path = path;
        this.isSolution = isSolution;
        // Faster data packets to emphasize flow
        this.speed = isSolution ? 0.015 : 0.01;
      }

      update() {
        this.progress += this.speed;
      }

      draw() {
        if (!ctx || this.progress >= 1 || this.path.length < 2) return;
        const totalSegments = this.path.length - 1;
        const scaledProgress = this.progress * totalSegments;
        const segmentIndex = Math.floor(scaledProgress);
        if (segmentIndex >= totalSegments) return;
        const p1 = this.path[segmentIndex];
        const p2 = this.path[segmentIndex + 1];
        const segmentProgress = scaledProgress - segmentIndex;
        const currentX = p1.x + (p2.x - p1.x) * segmentProgress;
        const currentY = p1.y + (p2.y - p1.y) * segmentProgress;
        const alpha = Math.sin(this.progress * Math.PI);

        ctx.beginPath();
        if (this.isSolution) {
          ctx.arc(currentX, currentY, 6, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
          ctx.fill();
          ctx.beginPath();
          ctx.arc(currentX, currentY, 12, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${SOLUTION_RGB}, ${alpha * 0.8})`;
          ctx.fill();
        } else {
          ctx.arc(currentX, currentY, 3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
          ctx.fill();
          ctx.beginPath();
          ctx.arc(currentX, currentY, 6, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${DATA_RGB}, ${alpha * 0.6})`;
          ctx.fill();
        }
      }
    }

    let nodes: Particle[] = [];
    let packets: Packet[] = [];
    let edges: {
      a: Particle;
      b: Particle;
      path: { x: number; y: number }[];
      isSolution: boolean;
    }[] = [];

    const generateOrthogonalPath = (
      a: { x: number; y: number },
      b: { x: number; y: number },
      avoidY?: number,
    ) => {
      let midX = snapToGrid(a.x + (b.x - a.x) / 2);
      // Simple obstruction avoidance for hero zone
      if (
        avoidY !== undefined &&
        Math.abs(midX - canvas.width / 2) < HERO_ZONE_WIDTH / 2
      ) {
        if (a.y > avoidY) {
          return [
            { x: a.x, y: a.y },
            { x: a.x, y: avoidY + HERO_ZONE_HEIGHT / 2 },
            { x: b.x, y: avoidY + HERO_ZONE_HEIGHT / 2 },
            { x: b.x, y: b.y },
          ];
        } else {
          return [
            { x: a.x, y: a.y },
            { x: a.x, y: avoidY - HERO_ZONE_HEIGHT / 2 },
            { x: b.x, y: avoidY - HERO_ZONE_HEIGHT / 2 },
            { x: b.x, y: b.y },
          ];
        }
      }
      return [
        { x: a.x, y: a.y },
        { x: midX, y: a.y },
        { x: midX, y: b.y },
        { x: b.x, y: b.y },
      ];
    };

    const initNetwork = () => {
      nodes = [];
      packets = [];
      edges = [];
      const cols = Math.floor(canvas.width / GRID_SIZE);
      const rows = Math.floor(canvas.height / GRID_SIZE);
      const taken = new Set<string>();

      const getFreePt = (minX: number, maxX: number) => {
        let x,
          y,
          attempts = 0;
        do {
          x = snapToGrid(
            Math.floor(Math.random() * (cols * (maxX - minX)) + cols * minX) *
              GRID_SIZE,
          );
          y = snapToGrid(
            Math.floor(Math.random() * (rows - 2) + 1) * GRID_SIZE,
          );
          // Avoid Hero Center Left
          const inHeroX = x > canvas.width * 0.1 && x < canvas.width * 0.55;
          const inHeroY =
            y > canvas.height / 2 - HERO_ZONE_HEIGHT / 2 &&
            y < canvas.height / 2 + HERO_ZONE_HEIGHT / 2;
          if (inHeroX && inHeroY && attempts < 150) continue;
          attempts++;
        } while (taken.has(`${x},${y}`) && attempts < 200);
        taken.add(`${x},${y}`);
        return { x, y };
      };

      // Zone 1: Problems
      const domainTypes: DomainType[] = ["city", "bio", "env", "city"];
      const problems = domainTypes.map((type) => {
        const pt = getFreePt(0.05, 0.25);
        return new Particle("domain", pt.x, pt.y, "problem", type);
      });

      // Zone 2: DB Pipeline
      const dbs = Array.from({ length: 4 }, () => {
        const pt = getFreePt(0.4, 0.6);
        return new Particle("database", pt.x, pt.y, "data");
      });

      // Zone 3: Lab Core
      // Central Institute Node
      const instPt = getFreePt(0.8, 0.9);
      const institute = new Particle("institute", instPt.x, instPt.y, "lab");

      // Lab Workers around Institute
      const labs = Array.from({ length: 5 }, (_, i) => {
        const pt = getFreePt(0.7, 0.95);
        return new Particle(i < 2 ? "human" : "ai", pt.x, pt.y, "lab");
      });

      nodes = [...problems, ...dbs, institute, ...labs];

      // Explicit Story Wiring
      // 1. Problems -> DB (Raw Data)
      problems.forEach((p) => {
        // Connect to 1 or 2 DBs
        dbs
          .sort(() => 0.5 - Math.random())
          .slice(0, 1 + Math.floor(Math.random() * 2))
          .forEach((db) => {
            edges.push({
              a: p,
              b: db,
              path: generateOrthogonalPath(p, db, canvas.height / 2),
              isSolution: false,
            });
          });
      });

      // 2. DB -> Institute (Aggregated Data routing to Lab)
      dbs.forEach((db) => {
        edges.push({
          a: db,
          b: institute,
          path: generateOrthogonalPath(db, institute),
          isSolution: false,
        });
      });

      // 3. Institute <-> AI/Humans (Internal Processing)
      labs.forEach((lab) => {
        edges.push({
          a: institute,
          b: lab,
          path: generateOrthogonalPath(institute, lab),
          isSolution: false,
        });
      });

      // 4. Institute -> Problems (Thick Solution Feedback)
      problems.forEach((p) => {
        // Not every problem gets a solution path to keep it readable, maybe 75%
        if (Math.random() < 0.75) {
          // Path from Institute straight to Problem
          edges.push({
            a: institute,
            b: p,
            path: generateOrthogonalPath(institute, p, canvas.height / 2),
            isSolution: true,
          });
        }
      });
    };

    const drawBackgroundZones = () => {
      const zones = [
        {
          title: "Real-World Problems",
          xStart: 0,
          xEnd: 0.3,
          bg: `rgba(241, 245, 249, 1)`,
        }, // Slate 100
        {
          title: "Data Ingestion",
          xStart: 0.3,
          xEnd: 0.65,
          bg: `rgba(248, 250, 252, 0.5)`,
        }, // Slate 50
        {
          title: "SDL Research Lab",
          xStart: 0.65,
          xEnd: 1,
          bg: `rgba(236, 253, 245, 0.8)`,
        }, // Emerald 50
      ];

      // Draw Background panels
      zones.forEach((z) => {
        const start = canvas.width * z.xStart;
        const width = canvas.width * (z.xEnd - z.xStart);
        ctx.fillStyle = z.bg;
        ctx.fillRect(start, 0, width, canvas.height);
      });

      // Draw bold physical dividers
      ctx.strokeStyle = `rgba(${PROBLEM_LIGHT_RGB}, 0.2)`;
      ctx.lineWidth = 2;
      ctx.setLineDash([8, 8]);

      ctx.beginPath();
      ctx.moveTo(canvas.width * 0.3, 0);
      ctx.lineTo(canvas.width * 0.3, canvas.height);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(canvas.width * 0.65, 0);
      ctx.lineTo(canvas.width * 0.65, canvas.height);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw Headers
      ctx.font = "bold 14px Inter, sans-serif";
      ctx.textAlign = "center";
      ctx.fillStyle = `rgba(${PROBLEM_RGB}, 0.6)`;
      ctx.fillText("Step 1. PROBLEM IDENTIFICATION", canvas.width * 0.15, 40);

      ctx.fillStyle = `rgba(${DATA_RGB}, 0.6)`;
      ctx.fillText("Step 2. DATA AGGREGATION", canvas.width * 0.475, 40);

      ctx.fillStyle = `rgba(${LAB_RGB}, 0.8)`;
      ctx.fillText("Step 3. AI RESEARCH & SOLUTION", canvas.width * 0.825, 40);
    };

    let mouse = { x: -1000, y: -1000 };
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", handleMouseMove);
    resize();

    const animate = () => {
      if (!ctx) return;
      time++;
      const panX = Math.sin(time * 0.001) * 20;
      const panY = Math.cos(time * 0.001) * 10;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawBackgroundZones();

      ctx.save();
      ctx.translate(panX, panY);

      // Draw pipelines
      edges.forEach((edge) => {
        ctx.beginPath();
        ctx.moveTo(edge.path[0].x, edge.path[0].y);
        edge.path.slice(1).forEach((p) => ctx.lineTo(p.x, p.y));

        if (edge.isSolution) {
          // Thick glowing solution pipeline
          ctx.strokeStyle = `rgba(${SOLUTION_RGB}, 0.8)`;
          ctx.lineWidth = 4;
          ctx.shadowColor = `rgba(${SOLUTION_RGB}, 0.8)`;
          ctx.shadowBlur = 10;
          ctx.stroke();

          // Inner glowing dash traveling backward
          ctx.strokeStyle = "#ffffff";
          ctx.lineWidth = 2;
          ctx.setLineDash([15, 30]);
          ctx.lineDashOffset = -time * 1.5;
          ctx.stroke();
          ctx.setLineDash([]);
          ctx.shadowBlur = 0;
        } else {
          // Normal data pipeline
          ctx.strokeStyle = `rgba(${DATA_RGB}, 0.2)`;
          ctx.lineWidth = 2;
          ctx.stroke();

          // Flowing dashed effect traveling forward
          ctx.strokeStyle = `rgba(${DATA_RGB}, 0.5)`;
          ctx.setLineDash([5, 15]);
          ctx.lineDashOffset = time * 0.5;
          ctx.stroke();
          ctx.setLineDash([]);
        }

        if (Math.random() < (edge.isSolution ? 0.001 : 0.005)) {
          // fewer solution packets, more data packets
          packets.push(new Packet(edge.a, edge.b, edge.path, edge.isSolution));
        }
      });

      // Packets
      packets = packets.filter((p) => p.progress < 1);
      packets.forEach((p) => {
        p.update();
        p.draw();
      });

      // Nodes
      nodes.forEach((node) => {
        const dist = Math.hypot(
          mouse.x - (node.x + panX),
          mouse.y - (node.y + panY),
        );
        if (node.type === "ai") node.rotation += 0.01;

        // Hover effect
        node.size += (node.baseSize + (dist < 100 ? 5 : 0) - node.size) * 0.1;
        node.draw(1);
      });

      ctx.restore();
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();
    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
      <canvas ref={canvasRef} className="w-full h-full opacity-90" />
    </div>
  );
}
