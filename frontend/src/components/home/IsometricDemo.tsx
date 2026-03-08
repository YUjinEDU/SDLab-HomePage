"use client";

import { useEffect, useRef } from "react";

const EMERALD_HEX = "#10b981"; // Primary
const EMERALD_DARK = "#047857";
const BLUE_HEX = "#3b82f6"; // Data Source
const AMBER_HEX = "#f59e0b"; // Applied Value

// Simple 3D to 2D Isometric Projection
// X: right-down, Z: left-down, Y: straight up
function isoProject(x: number, y: number, z: number) {
  const angle = Math.PI / 6; // 30 degrees
  const px = (x - z) * Math.cos(angle);
  const py = (x + z) * Math.sin(angle) - y;
  return { x: px, y: py };
}

type NodeType = "data" | "core" | "domain";

class WorldNode {
  x: number;
  y: number;
  z: number;
  type: NodeType;
  label: string;
  pulse: number = 0;

  constructor(
    x: number,
    y: number,
    z: number,
    type: NodeType,
    label: string = "",
  ) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.type = type;
    this.label = label;
  }
}

class Packet {
  path: { x: number; y: number; z: number }[];
  progress: number = 0;
  speed: number = 0.005 + Math.random() * 0.005;
  color: string;

  constructor(startNode: WorldNode, endNode: WorldNode, coreNode: WorldNode) {
    // Packets travel: Start -> turn toward Core X -> turn toward Core Z -> Core -> jump to Y -> End
    this.path = [
      { x: startNode.x, y: startNode.y, z: startNode.z },
      { x: coreNode.x, y: startNode.y, z: startNode.z },
      { x: coreNode.x, y: startNode.y, z: coreNode.z },
      { x: coreNode.x, y: coreNode.y, z: coreNode.z },
      { x: endNode.x, y: endNode.y, z: coreNode.z }, // Orthogonal to domain Z
      { x: endNode.x, y: endNode.y, z: endNode.z },
    ];
    this.color = EMERALD_HEX;
  }

  update() {
    this.progress += this.speed;
    if (this.progress > 0.5) {
      // Turning to value after passing core
      this.color = AMBER_HEX;
    }
  }

  getCurrentPos() {
    // Interpolate through the 5 segments
    const totalSegments = this.path.length - 1;
    const scaledProgress = this.progress * totalSegments;
    const currentSegment = Math.min(
      Math.floor(scaledProgress),
      totalSegments - 1,
    );
    const segmentProgress = scaledProgress - currentSegment;

    const p1 = this.path[currentSegment];
    const p2 = this.path[currentSegment + 1];

    if (!p1 || !p2) return this.path[this.path.length - 1]; // Fallback

    return {
      x: p1.x + (p2.x - p1.x) * segmentProgress,
      y: p1.y + (p2.y - p1.y) * segmentProgress,
      z: p1.z + (p2.z - p1.z) * segmentProgress,
    };
  }
}

export function IsometricDemo() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let frameId: number;
    let globalTime = 0;

    // Fixed architecture
    const GRID_SIZE = 800; // Total world size
    const coreNode = new WorldNode(
      GRID_SIZE / 2,
      50,
      GRID_SIZE / 2,
      "core",
      "AI Core",
    );

    // Level 1: Data sources (Grid intersections)
    const dataNodes = [
      new WorldNode(100, 0, 100, "data", "Sensor"),
      new WorldNode(700, 0, 150, "data", "DB"),
      new WorldNode(200, 0, 700, "data", "Logs"),
      new WorldNode(650, 0, 650, "data", "User"),
    ];

    // Level 3: Applied Domains (Floating)
    const domainNodes = [
      new WorldNode(250, 300, 250, "domain", "Bio"),
      new WorldNode(250, 250, 600, "domain", "Env"),
      new WorldNode(650, 350, 400, "domain", "City"),
    ];

    let packets: Packet[] = [];

    const drawGrid = (
      ctx: CanvasRenderingContext2D,
      cx: number,
      cy: number,
      scale: number,
    ) => {
      ctx.strokeStyle = "rgba(200, 210, 220, 0.3)";
      ctx.lineWidth = 1;

      // Base floor grid logic
      const step = 100;
      for (let i = 0; i <= GRID_SIZE; i += step) {
        // Lines parallel to Z
        ctx.beginPath();
        let p1 = isoProject(i, 0, 0);
        let p2 = isoProject(i, 0, GRID_SIZE);
        ctx.moveTo(cx + p1.x * scale, cy + p1.y * scale);
        ctx.lineTo(cx + p2.x * scale, cy + p2.y * scale);
        ctx.stroke();

        // Lines parallel to X
        ctx.beginPath();
        p1 = isoProject(0, 0, i);
        p2 = isoProject(GRID_SIZE, 0, i);
        ctx.moveTo(cx + p1.x * scale, cy + p1.y * scale);
        ctx.lineTo(cx + p2.x * scale, cy + p2.y * scale);
        ctx.stroke();
      }
    };

    const drawCube = (
      ctx: CanvasRenderingContext2D,
      cx: number,
      cy: number,
      scale: number,
      node: WorldNode,
      size: number,
    ) => {
      const base = isoProject(node.x, node.y, node.z);
      const top = isoProject(node.x, node.y + size, node.z);
      const bx1 = isoProject(node.x + size / 2, node.y, node.z - size / 2);
      const bx2 = isoProject(node.x - size / 2, node.y, node.z + size / 2);
      // Isometric drawing math requires full 8 point mapping, simplifying to just drawing planes

      const rx = cx + base.x * scale;
      const ry = cy + base.y * scale;

      // Draw a glowing isometric box for the core
      const w = size * scale;
      const h = size * scale * 0.8;

      const hoverOffset = Math.sin(globalTime * 0.05) * 10;

      ctx.save();
      ctx.translate(rx, ry - hoverOffset);

      // Left face
      ctx.fillStyle = EMERALD_DARK;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(-w, -h / 2);
      ctx.lineTo(-w, -h / 2 - h);
      ctx.lineTo(0, -h);
      ctx.fill();
      ctx.stroke();

      // Right face
      ctx.fillStyle = EMERALD_HEX;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(w, -h / 2);
      ctx.lineTo(w, -h / 2 - h);
      ctx.lineTo(0, -h);
      ctx.fill();
      ctx.stroke();

      // Top face
      ctx.fillStyle = "#34d399";
      ctx.beginPath();
      ctx.moveTo(0, -h);
      ctx.lineTo(-w, -h / 2 - h);
      ctx.lineTo(0, -h * 2);
      ctx.lineTo(w, -h / 2 - h);
      ctx.fill();
      ctx.stroke();

      // Label
      ctx.fillStyle = "black";
      ctx.font = "bold 14px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("AI ENGINE", 0, -h * 2 - 15);

      ctx.restore();
    };

    const drawDomainNode = (
      ctx: CanvasRenderingContext2D,
      cx: number,
      cy: number,
      scale: number,
      node: WorldNode,
    ) => {
      const p = isoProject(node.x, node.y, node.z);
      const rx = cx + p.x * scale;
      const ry = cy + p.y * scale;

      const hover = Math.sin(globalTime * 0.03 + node.x) * 5;

      ctx.save();
      ctx.translate(rx, ry + hover);

      // Connecting beam to ground
      const groundP = isoProject(node.x, 0, node.z);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo((groundP.x - p.x) * scale, (groundP.y - p.y) * scale);
      ctx.strokeStyle = "rgba(245, 158, 11, 0.15)"; // Amber beam
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Platform
      ctx.fillStyle = "white";
      ctx.strokeStyle = AMBER_HEX;
      ctx.lineWidth = 2;

      ctx.beginPath();
      ctx.ellipse(0, 0, 30, 15, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "#333";
      ctx.font = "bold 12px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(`[${node.label}]`, 0, 5);

      ctx.restore();
    };

    const drawDataNode = (
      ctx: CanvasRenderingContext2D,
      cx: number,
      cy: number,
      scale: number,
      node: WorldNode,
    ) => {
      const p = isoProject(node.x, node.y, node.z);
      const rx = cx + p.x * scale;
      const ry = cy + p.y * scale;

      ctx.save();
      ctx.translate(rx, ry);

      ctx.fillStyle = BLUE_HEX;
      ctx.beginPath();
      ctx.ellipse(0, 0, 8, 4, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#666";
      ctx.font = "10px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(node.label, 0, 15);

      ctx.restore();
    };

    const init = () => {
      canvas.width = canvas.parentElement!.offsetWidth;
      canvas.height = 600;
    };

    const animate = () => {
      globalTime++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = canvas.height * 0.7; // Lower center to fit tall Y axis
      const scale = 0.55;

      // Draw Base Grid
      drawGrid(ctx, cx, cy, scale);

      // Randomly spawn packets
      if (Math.random() < 0.03) {
        const start = dataNodes[Math.floor(Math.random() * dataNodes.length)];
        const end = domainNodes[Math.floor(Math.random() * domainNodes.length)];
        packets.push(new Packet(start, end, coreNode));
      }

      // Draw hardcoded orthogonal connection lines softly
      dataNodes.forEach((start) => {
        domainNodes.forEach((end) => {
          const dummy = new Packet(start, end, coreNode);
          ctx.beginPath();
          ctx.strokeStyle = "rgba(0,0,0,0.02)";
          ctx.lineWidth = 1;
          for (let i = 0; i < dummy.path.length; i++) {
            const p = isoProject(
              dummy.path[i].x,
              dummy.path[i].y,
              dummy.path[i].z,
            );
            if (i === 0) ctx.moveTo(cx + p.x * scale, cy + p.y * scale);
            else ctx.lineTo(cx + p.x * scale, cy + p.y * scale);
          }
          ctx.stroke();
        });
      });

      // Draw Packets
      for (let i = packets.length - 1; i >= 0; i--) {
        const p = packets[i];
        p.update();
        if (p.progress >= 1) {
          packets.splice(i, 1);
          continue;
        }

        const pos3d = p.getCurrentPos();
        // Hover core offset sync
        if (
          pos3d.x === coreNode.x &&
          pos3d.z === coreNode.z &&
          pos3d.y === coreNode.y
        ) {
          pos3d.y += Math.sin(globalTime * 0.05) * (10 / scale);
        }

        const screenPos = isoProject(pos3d.x, pos3d.y, pos3d.z);

        ctx.beginPath();
        ctx.arc(
          cx + screenPos.x * scale,
          cy + screenPos.y * scale,
          4,
          0,
          Math.PI * 2,
        );
        ctx.fillStyle = p.color;
        ctx.fill();

        ctx.shadowBlur = 10;
        ctx.shadowColor = p.color;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // Draw Nodes
      dataNodes.forEach((n) => drawDataNode(ctx, cx, cy, scale, n));
      drawCube(ctx, cx, cy, scale, coreNode, 80);
      domainNodes.forEach((n) => drawDomainNode(ctx, cx, cy, scale, n));

      frameId = requestAnimationFrame(animate);
    };

    init();
    animate();

    const handleResize = () => init();
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="w-full h-[600px] bg-white rounded-2xl border border-slate-200 overflow-hidden relative shadow-inner">
      <canvas ref={canvasRef} className="w-full h-full" />
      <div className="absolute top-6 left-6 max-w-sm">
        <h4 className="font-bold text-slate-900 text-lg mb-2">
          Structural Value Stack
        </h4>
        <p className="text-sm text-slate-500 leading-relaxed mb-4">
          **3계층 위계(L1-L2-L3)** 설계. 데이터가 중앙의 큐브(AI 엔진)에 직각
          배선으로 유입되고, 가공된 결과가 상층부의 플로팅 돔(Bio/Env/City)으로
          상승하는 공간적 구조를 보여줍니다.
        </p>
      </div>

      <div className="absolute bottom-6 right-6 space-y-2 text-right">
        <div className="flex items-center justify-end gap-2 text-sm font-semibold text-slate-700">
          <span className="w-3 h-3 rounded-full bg-amber-500"></span>
          L3: Applied Domain
        </div>
        <div className="flex items-center justify-end gap-2 text-sm font-semibold text-slate-700">
          <span className="w-3 h-3 rounded-sm bg-emerald-500"></span>
          L2: AI Core Process
        </div>
        <div className="flex items-center justify-end gap-2 text-sm font-semibold text-slate-700">
          <span className="w-3 h-3 rounded-full bg-blue-500"></span>
          L1: Raw Data Bed
        </div>
      </div>
    </div>
  );
}
