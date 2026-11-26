// NusaStat — pembuat grafik SVG murni (tanpa pustaka, tanpa jaringan).
// Semua grafik digambar dari data di data.js dan bisa diwarnai ulang lewat CSS.
// SVG inline di HTML tidak butuh atribut xmlns, jadi grafik tidak menyebut
// URL apa pun: situs ini tidak memuat apa pun dari jaringan.
import { fmt } from "./data.js";

const INK = "#0f2a43";
const ACCENT = "#d98e04";
const TEAL = "#0e7a6d";
const GRID = "#d9e2ea";
const MUTED = "#5b6b7a";

function el(tag, attrs = {}, text = "") {
  const a = Object.entries(attrs)
    .map(([k, v]) => `${k}="${v}"`)
    .join(" ");
  return `<${tag} ${a}>${text}</${tag}>`;
}

function niceMax(max) {
  const pow = Math.pow(10, Math.floor(Math.log10(max)));
  const n = max / pow;
  const step = n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10;
  return step * pow;
}

function axisLabels(min, max, count, format) {
  const out = [];
  for (let i = 0; i <= count; i++) {
    out.push(min + ((max - min) * i) / count);
  }
  return out.map((v) => ({ v, label: format(v) }));
}

// Grafik garis dengan titik dan label nilai.
export function lineChart(points, opts = {}) {
  const w = opts.width || 720;
  const h = opts.height || 300;
  const padL = 64;
  const padR = 16;
  const padT = 18;
  const padB = 34;
  const xs = points.map((p) => p.x);
  const ys = points.map((p) => p.y);
  let min = Math.min(...ys);
  let max = Math.max(...ys);
  if (opts.min !== undefined) min = opts.min;
  if (opts.max !== undefined) max = opts.max;
  if (max === min) max = min + 1;
  const span = max - min;
  min -= span * 0.08;
  max += span * 0.12;
  const xAt = (i) =>
    padL + ((w - padL - padR) * (points.length === 1 ? 0.5 : i / (points.length - 1)));
  const yAt = (v) => padT + (h - padT - padB) * (1 - (v - min) / (max - min));
  const color = opts.color || TEAL;
  const labels = axisLabels(min, max, 4, (v) => fmt(v, opts.decimals ?? 1));
  let s = `<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="${opts.aria || "Grafik garis"}">`;
  for (const l of labels) {
    s += el("line", { x1: padL, y1: yAt(l.v), x2: w - padR, y2: yAt(l.v), stroke: GRID, "stroke-width": 1 });
    s += el("text", { x: padL - 8, y: yAt(l.v) + 4, "text-anchor": "end", "font-size": 12, fill: MUTED }, l.label);
  }
  const path = points.map((p, i) => `${i === 0 ? "M" : "L"}${xAt(i).toFixed(1)},${yAt(p.y).toFixed(1)}`).join(" ");
  s += el("path", { d: path, fill: "none", stroke: color, "stroke-width": 3, "stroke-linejoin": "round" });
  s += el("path", {
    d: `${path} L${xAt(points.length - 1).toFixed(1)},${h - padB} L${xAt(0).toFixed(1)},${h - padB} Z`,
    fill: color, opacity: 0.08, stroke: "none",
  });
  points.forEach((p, i) => {
    s += el("circle", { cx: xAt(i), cy: yAt(p.y), r: 5, fill: "#ffffff", stroke: color, "stroke-width": 2.5 });
    if (opts.showValues !== false) {
      s += el("text", { x: xAt(i), y: yAt(p.y) - 11, "text-anchor": "middle", "font-size": 12, "font-weight": 700, fill: INK }, fmt(p.y, opts.decimals ?? 1));
    }
    s += el("text", { x: xAt(i), y: h - 12, "text-anchor": "middle", "font-size": 12, fill: MUTED }, String(p.x));
  });
  s += "</svg>";
  return s;
}

// Grafik batang vertikal.
export function barChart(points, opts = {}) {
  const w = opts.width || 720;
  const h = opts.height || 300;
  const padL = 64;
  const padR = 16;
  const padT = 26;
  const padB = 34;
  const max = niceMax(Math.max(...points.map((p) => p.y), 1));
  const min = opts.min !== undefined ? opts.min : 0;
  const slot = (w - padL - padR) / points.length;
  const bw = Math.min(64, slot * 0.62);
  const yAt = (v) => padT + (h - padT - padB) * (1 - (v - min) / (max - min));
  const color = opts.color || ACCENT;
  const labels = axisLabels(min, max, 4, (v) => fmt(v, opts.decimals ?? 0));
  let s = `<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="${opts.aria || "Grafik batang"}">`;
  for (const l of labels) {
    s += el("line", { x1: padL, y1: yAt(l.v), x2: w - padR, y2: yAt(l.v), stroke: GRID, "stroke-width": 1 });
    s += el("text", { x: padL - 8, y: yAt(l.v) + 4, "text-anchor": "end", "font-size": 12, fill: MUTED }, l.label);
  }
  points.forEach((p, i) => {
    const x = padL + slot * i + (slot - bw) / 2;
    const y = yAt(p.y);
    const barColor = opts.highlight === p.x ? "#b96f00" : color;
    s += el("rect", { x: x.toFixed(1), y: y.toFixed(1), width: bw.toFixed(1), height: (h - padB - y).toFixed(1), rx: 4, fill: barColor });
    s += el("text", { x: (x + bw / 2).toFixed(1), y: (y - 7).toFixed(1), "text-anchor": "middle", "font-size": 12, "font-weight": 700, fill: INK }, fmt(p.y, opts.decimals ?? 0));
    s += el("text", { x: (padL + slot * i + slot / 2).toFixed(1), y: h - 12, "text-anchor": "middle", "font-size": 12, fill: MUTED }, String(p.x));
  });
  s += "</svg>";
  return s;
}

// Batang berkelompok: dua seri berdampingan per tahun.
export function groupedBarChart(seriesA, seriesB, opts = {}) {
  const w = opts.width || 720;
  const h = opts.height || 300;
  const padL = 64;
  const padR = 16;
  const padT = 26;
  const padB = 34;
  const years = seriesA.map((p) => p.x);
  const max = niceMax(Math.max(...seriesA.map((p) => p.y), ...seriesB.map((p) => p.y), 1));
  const slot = (w - padL - padR) / years.length;
  const bw = Math.min(34, slot * 0.32);
  const yAt = (v) => padT + (h - padT - padB) * (1 - v / max);
  const labels = axisLabels(0, max, 4, (v) => fmt(v, 0));
  let s = `<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="${opts.aria || "Grafik batang berkelompok"}">`;
  for (const l of labels) {
    s += el("line", { x1: padL, y1: yAt(l.v), x2: w - padR, y2: yAt(l.v), stroke: GRID, "stroke-width": 1 });
    s += el("text", { x: padL - 8, y: yAt(l.v) + 4, "text-anchor": "end", "font-size": 12, fill: MUTED }, l.label);
  }
  years.forEach((year, i) => {
    const cx = padL + slot * i + slot / 2;
    const a = seriesA[i];
    const b = seriesB[i];
    s += el("rect", { x: (cx - bw - 3).toFixed(1), y: yAt(a.y).toFixed(1), width: bw, height: (h - padB - yAt(a.y)).toFixed(1), rx: 3, fill: TEAL });
    s += el("rect", { x: (cx + 3).toFixed(1), y: yAt(b.y).toFixed(1), width: bw, height: (h - padB - yAt(b.y)).toFixed(1), rx: 3, fill: ACCENT });
    s += el("text", { x: cx.toFixed(1), y: h - 12, "text-anchor": "middle", "font-size": 12, fill: MUTED }, String(year));
  });
  s += "</svg>";
  return s;
}

// Batang horizontal untuk peringkat / pangsa.
export function hbarChart(items, opts = {}) {
  const rowH = opts.rowHeight || 40;
  const w = opts.width || 720;
  const h = rowH * items.length + 16;
  const labelW = opts.labelWidth || 210;
  const max = Math.max(...items.map((d) => d.value), 1);
  let s = `<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="${opts.aria || "Grafik batang horizontal"}">`;
  items.forEach((d, i) => {
    const y = 8 + i * rowH;
    const bw = ((w - labelW - 70) * d.value) / max;
    s += el("text", { x: 0, y: y + 19, "font-size": 13, fill: INK }, d.name);
    s += el("rect", { x: labelW, y: y + 4, width: Math.max(2, bw).toFixed(1), height: 20, rx: 4, fill: opts.color || TEAL });
    s += el("text", { x: labelW + Math.max(2, bw) + 8, y: y + 19, "font-size": 13, "font-weight": 700, fill: INK }, d.label);
  });
  s += "</svg>";
  return s;
}

// Donat sederhana untuk dua bagian (mis. Jawa vs luar Jawa).
export function donut(parts, opts = {}) {
  const size = opts.size || 220;
  const r = 84;
  const c = 2 * Math.PI * r;
  const cx = size / 2;
  const cy = size / 2;
  const total = parts.reduce((a, p) => a + p.value, 0);
  let s = `<svg viewBox="0 0 ${size} ${size}" role="img" aria-label="${opts.aria || "Grafik donat"}">`;
  s += el("circle", { cx, cy, r, fill: "none", stroke: "#e8eef3", "stroke-width": 30 });
  let offset = c * 0.25;
  for (const p of parts) {
    const len = (p.value / total) * c;
    s += el("circle", {
      cx, cy, r, fill: "none", stroke: p.color, "stroke-width": 30,
      "stroke-dasharray": `${len.toFixed(1)} ${(c - len).toFixed(1)}`,
      "stroke-dashoffset": offset.toFixed(1),
    });
    offset -= len;
  }
  s += el("text", { x: cx, y: cy - 4, "text-anchor": "middle", "font-size": 26, "font-weight": 800, fill: INK }, parts[0].label);
  s += el("text", { x: cx, y: cy + 20, "text-anchor": "middle", "font-size": 12, fill: MUTED }, parts[0].sub || "");
  s += "</svg>";
  return s;
}
