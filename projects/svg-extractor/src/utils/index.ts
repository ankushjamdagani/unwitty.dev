// Color & ΔE utilities
export function rgbToHex(r, g, b) {
  return "#" + [r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("");
}
export function hexToRgbObj(hex) {
  const m = /^#([0-9a-f]{6})$/i.exec(hex);
  if (!m) return { r: 0, g: 0, b: 0 };
  const n = parseInt(m[1], 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}
export function srgbToLinear(c) {
  c /= 255;
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}
export function rgbToXyz(r, g, b) {
  const R = srgbToLinear(r),
    G = srgbToLinear(g),
    B = srgbToLinear(b);
  const X = R * 0.4124564 + G * 0.3575761 + B * 0.1804375;
  const Y = R * 0.2126729 + G * 0.7151522 + B * 0.072175;
  const Z = R * 0.0193339 + G * 0.119192 + B * 0.9503041;
  return { X, Y, Z };
}
export function xyzToLab(X, Y, Z) {
  const Xn = 0.95047,
    Yn = 1.0,
    Zn = 1.08883;
  let x = X / Xn,
    y = Y / Yn,
    z = Z / Zn;
  const e = 216 / 24389,
    k = 24389 / 27;
  function f(t) {
    return t > e ? Math.cbrt(t) : (k * t + 16) / 116;
  }
  const fx = f(x),
    fy = f(y),
    fz = f(z);
  return { L: 116 * fy - 16, a: 500 * (fx - fy), b: 200 * (fy - fz) };
}
export function rgbToLab(r, g, b) {
  const xyz = rgbToXyz(r, g, b);
  return xyzToLab(xyz.X, xyz.Y, xyz.Z);
}
export function deltaE76(l1, l2) {
  const dL = l1.L - l2.L,
    da = l1.a - l2.a,
    db = l1.b - l2.b;
  return Math.sqrt(dL * dL + da * da + db * db);
}
export function deltaE00(lab1, lab2) {
  const { L: L1, a: a1, b: b1 } = lab1,
    { L: L2, a: a2, b: b2 } = lab2;
  const avgLp = (L1 + L2) / 2;
  const C1 = Math.sqrt(a1 * a1 + b1 * b1),
    C2 = Math.sqrt(a2 * a2 + b2 * b2);
  const avgC = (C1 + C2) / 2;
  const G =
    0.5 *
    (1 - Math.sqrt(Math.pow(avgC, 7) / (Math.pow(avgC, 7) + Math.pow(25, 7))));
  const a1p = (1 + G) * a1,
    a2p = (1 + G) * a2;
  const C1p = Math.sqrt(a1p * a1p + b1 * b1),
    C2p = Math.sqrt(a2p * a2p + b2 * b2);
  const avgCp = (C1p + C2p) / 2;
  const h1p = Math.atan2(b1, a1p);
  const h2p = Math.atan2(b2, a2p);
  const h1pDeg = ((h1p >= 0 ? h1p : h1p + 2 * Math.PI) * 180) / Math.PI;
  const h2pDeg = ((h2p >= 0 ? h2p : h2p + 2 * Math.PI) * 180) / Math.PI;
  let dhp = h2pDeg - h1pDeg;
  if (dhp > 180) dhp -= 360;
  if (dhp < -180) dhp += 360;
  const dHp = 2 * Math.sqrt(C1p * C2p) * Math.sin((dhp * Math.PI) / 180 / 2);
  const dLp = L2 - L1;
  const dCp = C2p - C1p;
  const avgHp =
    Math.abs(h1pDeg - h2pDeg) > 180
      ? (h1pDeg + h2pDeg + 360) / 2
      : (h1pDeg + h2pDeg) / 2;
  const T =
    1 -
    0.17 * Math.cos(((avgHp - 30) * Math.PI) / 180) +
    0.24 * Math.cos((2 * avgHp * Math.PI) / 180) +
    0.32 * Math.cos(((3 * avgHp + 6) * Math.PI) / 180) -
    0.2 * Math.cos(((4 * avgHp - 63) * Math.PI) / 180);
  const Sl =
    1 +
    (0.015 * Math.pow(avgLp - 50, 2)) / Math.sqrt(20 + Math.pow(avgLp - 50, 2));
  const Sc = 1 + 0.045 * avgCp;
  const Sh = 1 + 0.015 * avgCp * T;
  const delTheta = 30 * Math.exp(-Math.pow((avgHp - 275) / 25, 2));
  const Rc =
    2 * Math.sqrt(Math.pow(avgCp, 7) / (Math.pow(avgCp, 7) + Math.pow(25, 7)));
  const Rt = -Rc * Math.sin((2 * delTheta * Math.PI) / 180);
  const dE = Math.sqrt(
    Math.pow(dLp / Sl, 2) +
      Math.pow(dCp / Sc, 2) +
      Math.pow(dHp / Sh, 2) +
      Rt * (dCp / Sc) * (dHp / Sh)
  );
  return dE;
}

// Mask building (multi-target)
export function selectColorMaskMulti(imgData, hexList, tol, metric, invert) {
  const w = imgData.width,
    h = imgData.height,
    data = imgData.data;
  const out = new Uint8Array(w * h);
  const de = new Float32Array(w * h);
  const labs = hexList.map((hx) => {
    const { r, g, b } = hexToRgbObj(hx);
    return rgbToLab(r, g, b);
  });
  let iPix = 0;
  let minDE = 1e9,
    maxDE = -1e9;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++, iPix++) {
      const i = (y * w + x) * 4;
      const r = data[i],
        g = data[i + 1],
        b = data[i + 2],
        a = data[i + 3];
      if (a <= 10) {
        de[iPix] = 0;
        out[iPix] = 0;
        continue;
      }
      let dMin = 1e9;
      const lab = rgbToLab(r, g, b);
      for (const t of labs) {
        const d = metric === "de2000" ? deltaE00(lab, t) : deltaE76(lab, t);
        if (d < dMin) dMin = d;
      }
      de[iPix] = dMin;
      if (dMin < minDE) minDE = dMin;
      if (dMin > maxDE) maxDE = dMin;
      const match = dMin <= tol;
      const keep = invert ? !match : match;
      out[iPix] = keep ? 1 : 0;
    }
  }
  return { w, h, data: out, de, minDE, maxDE };
}

// Points / masks helpers
export function pointsFromMask(mask) {
  const { w, h, data } = mask;
  const pts = [];
  let i = 0;
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++, i++) if (data[i]) pts.push({ x, y });
  return pts;
}
export function maskFromLabels(cc, set) {
  const out = new Uint8Array(cc.w * cc.h);
  for (let i = 0; i < out.length; i++) if (set.has(cc.labels[i])) out[i] = 1;
  return { w: cc.w, h: cc.h, data: out };
}

// Morphology
export function erode(mask) {
  const { w, h, data } = mask;
  const out = new Uint8Array(w * h);
  for (let y = 1; y < h - 1; y++)
    for (let x = 1; x < w - 1; x++) {
      let ok = 1;
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (data[(y + dy) * w + (x + dx)] === 0) {
            ok = 0;
            break;
          }
        }
        if (!ok) break;
      }
      out[y * w + x] = ok;
    }
  return { w, h, data: out };
}
export function dilate(mask) {
  const { w, h, data } = mask;
  const out = new Uint8Array(w * h);
  for (let y = 1; y < h - 1; y++)
    for (let x = 1; x < w - 1; x++) {
      let any = 0;
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (data[(y + dy) * w + (x + dx)]) {
            any = 1;
            break;
          }
        }
        if (any) break;
      }
      out[y * w + x] = any;
    }
  return { w, h, data: out };
}

// Connected Components (8-neighborhood)
export function connectedComponents(mask) {
  const { w, h, data } = mask;
  const labels = new Int32Array(w * h);
  labels.fill(0);
  const sizes = [0];
  let label = 0;
  const qx = new Int32Array(w * h),
    qy = new Int32Array(w * h);
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) {
      const idx = y * w + x;
      if (!data[idx] || labels[idx]) continue;
      label++;
      let head = 0,
        tail = 0;
      labels[idx] = label;
      qx[tail] = x;
      qy[tail] = y;
      tail++;
      let area = 0;
      while (head < tail) {
        const cx = qx[head],
          cy = qy[head];
        head++;
        area++;
        for (let dy = -1; dy <= 1; dy++)
          for (let dx = -1; dx <= 1; dx++) {
            if (dx === 0 && dy === 0) continue;
            const nx = cx + dx,
              ny = cy + dy;
            if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
            const nidx = ny * w + nx;
            if (data[nidx] && !labels[nidx]) {
              labels[nidx] = label;
              qx[tail] = nx;
              qy[tail] = ny;
              tail++;
            }
          }
      }
      sizes[label] = area;
    }
  return { w, h, labels, sizes };
}

// Skeletonization (Zhang–Suen)
export function zhangSuenThinning(mask) {
  const { w, h } = mask;
  let data = mask.data.slice();
  let changed;
  const idx = (x, y) => y * w + x;
  const Nsum = (x, y) => {
    let n = 0;
    for (let dy = -1; dy <= 1; dy++)
      for (let dx = -1; dx <= 1; dx++) {
        if (dx || dy) {
          const nx = x + dx,
            ny = y + dy;
          if (nx >= 0 && ny >= 0 && nx < w && ny < h)
            n += data[idx(nx, ny)] ? 1 : 0;
        }
      }
    return n;
  };
  const Atrans = (x, y) => {
    const p = (dx, dy) => {
      const nx = x + dx,
        ny = y + dy;
      return nx >= 0 && ny >= 0 && nx < w && ny < h ? data[idx(nx, ny)] : 0;
    };
    const p2 = p(0, -1),
      p3 = p(1, -1),
      p4 = p(1, 0),
      p5 = p(1, 1),
      p6 = p(0, 1),
      p7 = p(-1, 1),
      p8 = p(-1, 0),
      p9 = p(-1, -1);
    const seq = [p2, p3, p4, p5, p6, p7, p8, p9, p2];
    let A = 0;
    for (let i = 0; i < seq.length - 1; i++) {
      if (seq[i] === 0 && seq[i + 1] === 1) A++;
    }
    return A;
  };
  do {
    changed = false;
    const del = [];
    for (let y = 1; y < h - 1; y++)
      for (let x = 1; x < w - 1; x++) {
        if (!data[idx(x, y)]) continue;
        const N = Nsum(x, y);
        if (N < 2 || N > 6) continue;
        const A = Atrans(x, y);
        if (A !== 1) continue;
        const p2 = data[idx(x, y - 1)],
          p4 = data[idx(x + 1, y)],
          p6 = data[idx(x, y + 1)],
          p8 = data[idx(x - 1, y)];
        if (p2 * p4 * p6 !== 0) continue;
        if (p4 * p6 * p8 !== 0) continue;
        del.push(idx(x, y));
      }
    for (const i of del) data[i] = 0;
    if (del.length) changed = true;
    const del2 = [];
    for (let y = 1; y < h - 1; y++)
      for (let x = 1; x < w - 1; x++) {
        if (!data[idx(x, y)]) continue;
        const N = Nsum(x, y);
        if (N < 2 || N > 6) continue;
        const A = Atrans(x, y);
        if (A !== 1) continue;
        const p2 = data[idx(x, y - 1)],
          p4 = data[idx(x + 1, y)],
          p6 = data[idx(x, y + 1)],
          p8 = data[idx(x - 1, y)];
        if (p2 * p4 * p8 !== 0) continue;
        if (p2 * p6 * p8 !== 0) continue;
        del2.push(idx(x, y));
      }
    for (const i of del2) data[i] = 0;
    if (del2.length) changed = true;
  } while (changed);
  return { w, h, data };
}

// Longest path on skeleton
export function longestSkeletonPath(sk) {
  const { w, h, data } = sk;
  const idx = (x, y) => y * w + x;
  const neighbors = (x, y) => {
    const out = [];
    for (let dy = -1; dy <= 1; dy++)
      for (let dx = -1; dx <= 1; dx++) {
        if (!dx && !dy) continue;
        const nx = x + dx,
          ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
        if (data[idx(nx, ny)]) out.push({ x: nx, y: ny });
      }
    return out;
  };
  const nodes = [];
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++)
      if (data[idx(x, y)]) {
        const deg = neighbors(x, y).length;
        if (deg !== 2) nodes.push({ x, y });
      }
  let seed = null;
  for (const n of nodes) {
    const deg = neighbors(n.x, n.y).length;
    if (deg === 1) {
      seed = n;
      break;
    }
  }
  if (!seed) {
    for (let y = 0; y < h; y++) {
      let found = false;
      for (let x = 0; x < w; x++) {
        if (data[idx(x, y)]) {
          seed = { x, y };
          found = true;
          break;
        }
      }
      if (found) break;
    }
    if (!seed) return [];
  }
  const a = farthestFrom(seed);
  const b = farthestFrom(a.node);
  return reconstructPath(a.node, b.node);

  function farthestFrom(start) {
    const q = [];
    const seen = new Int8Array(w * h);
    const prev = new Int32Array(w * h);
    prev.fill(-1);
    const sidx = idx(start.x, start.y);
    q.push(sidx);
    seen[sidx] = 1;
    let last = sidx;
    while (q.length) {
      const cur = q.shift();
      last = cur;
      const cx = cur % w,
        cy = (cur / w) | 0;
      const nb = neighbors(cx, cy);
      for (const p of nb) {
        const id = idx(p.x, p.y);
        if (!seen[id]) {
          seen[id] = 1;
          prev[id] = cur;
          q.push(id);
        }
      }
    }
    const lx = last % w,
      ly = (last / w) | 0;
    return { node: { x: lx, y: ly }, prev };
  }
  function reconstructPath(start, end) {
    const q = [];
    const seen = new Int8Array(w * h);
    const prev = new Int32Array(w * h);
    prev.fill(-1);
    const sidx = idx(start.x, start.y),
      eidx = idx(end.x, end.y);
    q.push(sidx);
    seen[sidx] = 1;
    while (q.length) {
      const cur = q.shift();
      if (cur === eidx) break;
      const cx = cur % w,
        cy = (cur / w) | 0;
      const nb = neighbors(cx, cy);
      for (const p of nb) {
        const id = idx(p.x, p.y);
        if (!seen[id]) {
          seen[id] = 1;
          prev[id] = cur;
          q.push(id);
        }
      }
    }
    const path = [];
    let cur = eidx;
    if (prev[cur] === -1 && cur !== sidx) {
      return path;
    }
    while (cur !== -1) {
      const cx = cur % w,
        cy = (cur / w) | 0;
      path.push({ x: cx, y: cy });
      if (cur === sidx) break;
      cur = prev[cur];
    }
    path.reverse();
    const step = Math.max(1, Math.floor(path.length / 800));
    const out = [];
    for (let i = 0; i < path.length; i += step) out.push(path[i]);
    return out;
  }
}

// PCA median path
export function computeMedianPathPCA(points, settings, W, H) {
  const N = points.length;
  if (N === 0) return { points: [] };
  let mx = 0,
    my = 0;
  for (let i = 0; i < N; i++) {
    mx += points[i].x;
    my += points[i].y;
  }
  mx /= N;
  my /= N;
  let sxx = 0,
    syy = 0,
    sxy = 0;
  for (let i = 0; i < N; i++) {
    const dx = points[i].x - mx;
    const dy = points[i].y - my;
    sxx += dx * dx;
    syy += dy * dy;
    sxy += dx * dy;
  }
  sxx /= N;
  syy /= N;
  sxy /= N;
  const tr = sxx + syy;
  const det = sxx * syy - sxy * sxy;
  const disc = Math.max(0, tr * tr - 4 * det);
  const lambda1 = 0.5 * (tr + Math.sqrt(disc));
  const evx = sxy;
  const evy = lambda1 - sxx;
  let u = normalize(
    Math.abs(evx) + Math.abs(evy) < 1e-8 ? { x: 1, y: 0 } : { x: evx, y: evy }
  );
  const v = { x: -u.y, y: u.x };
  const ts = new Array(N),
    ss = new Array(N);
  let tMin = Infinity,
    tMax = -Infinity;
  for (let i = 0; i < N; i++) {
    const dx = points[i].x - mx;
    const dy = points[i].y - my;
    const t = dx * u.x + dy * u.y;
    const s = dx * v.x + dy * v.y;
    ts[i] = t;
    ss[i] = s;
    if (t < tMin) tMin = t;
    if (t > tMax) tMax = t;
  }
  const B = Math.max(10, Math.min(1000, settings.bins ?? 120));
  const binW = (tMax - tMin) / B;

  function buildMedPts(minPerBin) {
    const arr = [];
    for (let b = 0; b < B; b++) {
      const t0 = tMin + b * binW;
      const t1 = t0 + binW;
      let sumT = 0;
      let count = 0;
      const sVals = [];
      for (let i = 0; i < N; i++) {
        const t = ts[i];
        if (t >= t0 && t < t1) {
          sumT += t;
          count++;
          sVals.push(ss[i]);
        }
      }
      if (count >= minPerBin) {
        const tC = sumT / count;
        sVals.sort((a, b) => a - b);
        const mid = (sVals.length - 1) / 2;
        const sMed =
          sVals.length % 2 === 1
            ? sVals[mid | 0]
            : 0.5 * (sVals[mid | 0] + sVals[(mid + 1) | 0]);
        const px = mx + u.x * tC + v.x * sMed;
        const py = my + u.y * tC + v.y * sMed;
        arr.push({ x: clamp(px, 0, W - 1), y: clamp(py, 0, H - 1) });
      }
    }
    return arr;
  }

  const minPerBin = settings.minPerBin ?? 30;
  let medPts = buildMedPts(minPerBin);
  if (medPts.length < 3) {
    medPts = buildMedPts(Math.max(1, Math.floor(minPerBin / 3)));
    if (medPts.length < 3) {
      medPts = buildMedPts(1);
    }
  }

  let P = medPts;
  for (let it = 0; it < (settings.smoothIter ?? 0); it++) {
    P = smoothOnce(P);
  }
  if ((settings.epsilon ?? 0) > 0 && P.length > 2) {
    P = rdpSimplify(P, settings.epsilon);
  }
  return { points: P };
}

// Compute PCA info (debug helper)
export function computePCAOnMask(mask, bins) {
  const pts = pointsFromMask(mask);
  const N = pts.length;
  if (N === 0) return null;
  let mx = 0,
    my = 0;
  for (let p of pts) {
    mx += p.x;
    my += p.y;
  }
  mx /= N;
  my /= N;
  let sxx = 0,
    syy = 0,
    sxy = 0;
  for (let p of pts) {
    const dx = p.x - mx,
      dy = p.y - my;
    sxx += dx * dx;
    syy += dy * dy;
    sxy += dx * dy;
  }
  sxx /= N;
  syy /= N;
  sxy /= N;
  const tr = sxx + syy;
  const det = sxx * syy - sxy * sxy;
  const disc = Math.max(0, tr * tr - 4 * det);
  const lambda1 = 0.5 * (tr + Math.sqrt(disc));
  const evx = sxy,
    evy = lambda1 - sxx;
  const u = normalize(
    Math.abs(evx) + Math.abs(evy) < 1e-8 ? { x: 1, y: 0 } : { x: evx, y: evy }
  );
  const v = { x: -u.y, y: u.x };
  let tMin = Infinity,
    tMax = -Infinity;
  for (let p of pts) {
    const dx = p.x - mx,
      dy = p.y - my;
    const t = dx * u.x + dy * u.y;
    if (t < tMin) tMin = t;
    if (t > tMax) tMax = t;
  }
  return { mx, my, u, v, tMin, tMax, bins };
}

// Geometry helpers
export function clamp(v, a, b) {
  return Math.max(a, Math.min(b, v));
}

export function smoothOnce(P) {
  if (P.length <= 2) return P.slice();
  const Q = [P[0]];
  for (let i = 1; i < P.length - 1; i++) {
    Q.push({
      x: (P[i - 1].x + 2 * P[i].x + P[i + 1].x) / 4,
      y: (P[i - 1].y + 2 * P[i].y + P[i + 1].y) / 4,
    });
  }
  Q.push(P[P.length - 1]);
  return Q;
}

export function normalize(v) {
  const n = Math.hypot(v.x, v.y) || 1;
  return { x: v.x / n, y: v.y / n };
}

export function rdpSimplify(pts, eps) {
  const dmax = (p, a, b) => {
    const ABx = b.x - a.x,
      ABy = b.y - a.y;
    const len2 = ABx * ABx + ABy * ABy || 1e-9;
    let t = ((p.x - a.x) * ABx + (p.y - a.y) * ABy) / len2;
    t = Math.max(0, Math.min(1, t));
    const X = a.x + t * ABx,
      Y = a.y + t * ABy;
    return Math.hypot(p.x - X, p.y - Y);
  };
  function rdp(arr) {
    if (arr.length <= 2) return arr;
    const a = arr[0],
      b = arr[arr.length - 1];
    let idx = -1,
      maxd = -1;
    for (let i = 1; i < arr.length - 1; i++) {
      const d = dmax(arr[i], a, b);
      if (d > maxd) {
        maxd = d;
        idx = i;
      }
    }
    if (maxd > eps) {
      const L = rdp(arr.slice(0, idx + 1));
      const R = rdp(arr.slice(idx));
      return L.slice(0, -1).concat(R);
    } else return [a, b];
  }
  return rdp(pts);
}

export function polylinePath(pts) {
  if (!pts.length) return "";
  let d = `M ${pts[0].x.toFixed(2)} ${pts[0].y.toFixed(2)}`;
  for (let i = 1; i < pts.length; i++)
    d += ` L ${pts[i].x.toFixed(2)} ${pts[i].y.toFixed(2)}`;
  return d;
}

// Extraction orchestrator
export function extractPathsFromFinalMask(finalMask, method, settings, W, H) {
  const dList = [];
  const pointsList = [];
  let skeletonForDebug = null;
  if (method === "skeleton") {
    const skAll = zhangSuenThinning(finalMask);
    skeletonForDebug = skAll;
    const ccSk = connectedComponents(skAll);
    for (let l = 1; l < ccSk.sizes.length; l++) {
      if (ccSk.sizes[l] < 2) continue;
      const skL = maskFromLabels(ccSk, new Set([l]));
      let poly = longestSkeletonPath(skL);
      if (poly && poly.length >= 2) {
        for (let it = 0; it < settings.smoothIter; it++)
          poly = smoothOnce(poly);
        if (settings.epsilon > 0 && poly.length > 2)
          poly = rdpSimplify(poly, settings.epsilon);
        pointsList.push(poly.slice());
        dList.push(polylinePath(poly));
      }
    }
  } else {
    const ccKeep = connectedComponents(finalMask);
    for (let l = 1; l < ccKeep.sizes.length; l++) {
      if (ccKeep.sizes[l] < 2) continue;
      const mL = maskFromLabels(ccKeep, new Set([l]));
      const pts = pointsFromMask(mL);
      const out = computeMedianPathPCA(
        pts,
        {
          bins: 120,
          minPerBin: 30,
          smoothIter: settings.smoothIter,
          epsilon: settings.epsilon,
          curved: false,
        },
        W,
        H
      );
      let poly = out.points;
      if (poly && poly.length >= 2) {
        for (let it = 0; it < settings.smoothIter; it++)
          poly = smoothOnce(poly);
        if (settings.epsilon > 0 && poly.length > 2)
          poly = rdpSimplify(poly, settings.epsilon);
        pointsList.push(poly.slice());
        dList.push(polylinePath(poly));
      }
    }
  }
  return { dList, pointsList, skeletonForDebug };
}
