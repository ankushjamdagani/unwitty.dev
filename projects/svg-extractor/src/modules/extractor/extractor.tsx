import { useState, useRef, useCallback } from "react";

import "./styles.css";

import useDebounce from "../../hooks/use-debounce";
import useWorker from "../../hooks/use-worker";
import {
  selectColorMaskMulti,
  connectedComponents,
  erode,
  dilate,
  maskFromLabels,
  extractPathsFromFinalMask,
} from "../../utils";

import {
  CCResult,
  ComponentType,
  DEMatrix,
  MaskBitmap,
  MetricColor,
  SkelBitmap,
  Stats,
} from "../../types";

import ExtractorWorker from "../../workers/extractor-worker?worker";

import { CenterPreview } from "./components/center-preview";
import { RightControls } from "./components/right-controls";
import { LeftControls } from "./components/left-controls";

const kpiOptions: { label: string; key: Stats }[] = [
  {
    label: "Canvas",
    key: Stats.canvas,
    // value: "canvas width*height",
  },
  {
    label: "Pixels",
    key: Stats.pixels,
    // value: "pixels",
  },
  {
    label: "Matched",
    key: Stats.selected,
    // value: "selected",
  },
  {
    label: "Components",
    key: Stats.components,
    // value: "components",
  },
  {
    label: "Segments",
    key: Stats.segments,
    // value: "segments",
  },
  {
    label: "Targets",
    key: Stats.targets,
    // value: "targets",
  },
];

const DEFAULT_TARGET_COLOR = "#00cc66";

function Extractor() {
  // Refs
  const previewRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const miniSvgRef = useRef<SVGSVGElement>(null);

  const imgCanvasRef = useRef<HTMLCanvasElement>(null);
  const maskCanvasRef = useRef<HTMLCanvasElement>(null);
  const debugCanvasRef = useRef<HTMLCanvasElement>(null);
  const overlaySvgRef = useRef<SVGSVGElement>(null);

  // UI state
  const [zoomPct, setZoomPct] = useState(100);
  const [processScale, setProcessScale] = useState(60);
  const [livePreview, setLivePreview] = useState(true);
  const [invertMask, setInvertMask] = useState(false);
  const [maskOpacity, setMaskOpacity] = useState(50);
  const [colorMetric, setColorMetric] = useState<MetricColor>(MetricColor.p2);
  const [tolerance, setTolerance] = useState(20);

  // Targets (fully controlled) — no window deps
  const [primaryColor, setPrimaryColor] = useState(DEFAULT_TARGET_COLOR);
  const [extraTargets, setExtraTargets] = useState<string[]>([]);

  // Components selection (fully controlled)
  const [compMode, setCompMode] = useState<ComponentType>(ComponentType.all);
  const [selectedLabels, setSelectedLabels] = useState<Set<number>>(new Set());

  const [erodeIter, setErodeIter] = useState(0);
  const [dilateIter, setDilateIter] = useState(1);
  const [method, setMethod] = useState<"skeleton" | "pca">("skeleton");
  const [smoothIter, setSmoothIter] = useState(0);
  const [epsilon, setEpsilon] = useState(0);

  const [viewMask, setViewMask] = useState(true);
  const [viewPath, setViewPath] = useState(true);
  const [viewComponents, setViewComponents] = useState(false);
  const [viewPoints, setViewPoints] = useState(false);
  const [viewSkeleton, setViewSkeleton] = useState(false);

  const [dbgEndpoints, setDbgEndpoints] = useState(false);
  const [dbgHeatmap, setDbgHeatmap] = useState(false);
  const [dbgPCA, setDbgPCA] = useState(false);
  const [heatOpacity, setHeatOpacity] = useState(40);

  const [busyMessage, setBusyMessage] = useState("");
  const [pathLines, setPathLines] = useState<string[]>([]);
  const [stats, setStats] = useState<Record<Stats, any>>({
    canvas: 0,
    selected: 0,
    pixels: 0,
    components: 0,
    segments: 0,
    targets: 1,
  });

  // Internal state mirrors
  const imgRef = useRef(new Image());
  const loadedRef = useRef(false);
  const lastMaskRef = useRef<MaskBitmap>(null);
  const lastDERef = useRef<DEMatrix>(null);
  const lastCCRef = useRef<CCResult>(null);
  const lastSkelRef = useRef<SkelBitmap>(null);

  // View transform
  const viewRef = useRef({ scale: 1, x: 0, y: 0 });
  const debounce = useDebounce();
  const { post } = useWorker(ExtractorWorker);

  const cx = () => imgCanvasRef.current?.getContext("2d")!;
  const mx = () => maskCanvasRef.current?.getContext("2d")!;
  const dx = () => debugCanvasRef.current?.getContext("2d")!;

  /* ---- Rendering helpers ---- */
  const renderMask = useCallback(
    (mask: NonNullable<MaskBitmap>) => {
      const m = mx();
      if (!m) return;
      const { w, h, data } = mask;
      m.clearRect(0, 0, w, h);
      const id = m.createImageData(w, h);
      for (let i = 0; i < w * h; i++) {
        const on = data[i] ? 255 : 0;
        id.data[i * 4 + 0] = on;
        id.data[i * 4 + 1] = on;
        id.data[i * 4 + 2] = on;
        id.data[i * 4 + 3] = on ? 255 : 0;
      }
      m.putImageData(id, 0, 0);
      if (maskCanvasRef.current) {
        maskCanvasRef.current.style.display = viewMask ? "block" : "none";
        maskCanvasRef.current.style.opacity = String(maskOpacity / 100);
      }
    },
    [viewMask, maskOpacity]
  );

  const renderOverlay = useCallback(
    (dList: string[]) => {
      const svg = overlaySvgRef.current;
      if (!svg) return;
      svg.innerHTML = "";
      if (!viewPath || !dList?.length) return;
      for (const d of dList) {
        const p = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "path"
        );
        p.setAttribute("d", d);
        p.setAttribute("fill", "none");
        p.setAttribute("stroke", "#6be675");
        p.setAttribute("stroke-width", "2");
        p.setAttribute("stroke-linecap", "round");
        p.setAttribute("stroke-linejoin", "round");
        svg.appendChild(p);
      }
    },
    [viewPath]
  );

  const renderMini = useCallback((dList: string[]) => {
    const mini = miniSvgRef.current;
    const imgC = imgCanvasRef.current;
    if (!mini || !imgC) return;
    const has = dList && dList.length > 0 && imgC.width && imgC.height;
    if (!has) {
      mini.innerHTML = "";
      mini.removeAttribute("width");
      mini.removeAttribute("height");
      mini.removeAttribute("viewBox");
      return;
    }
    const W = imgC.width,
      H = imgC.height;
    const paths = dList
      .map(
        (d) =>
          `<path d="${d}" fill="none" stroke="#6be675" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`
      )
      .join("\r\n");
    mini.setAttribute("viewBox", `0 0 ${W} ${H}`);
    mini.setAttribute("width", "220");
    mini.setAttribute(
      "height",
      String(Math.max(80, Math.round((H * 220) / Math.max(1, W))))
    );
    mini.innerHTML = paths;
  }, []);

  /* ---- Canvas sizing ---- */
  const applyView = useCallback(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const v = viewRef.current;
    stage.style.transform = `translate(${v.x}px, ${v.y}px) scale(${v.scale})`;
    setZoomPct(Math.round(v.scale * 100));
  }, []);

  const fitToCanvas = useCallback(
    (w: number, h: number, scalePct: number) => {
      const s = Math.max(0.05, Math.min(1, Number(scalePct) / 100));
      const W = Math.round(w * s),
        H = Math.round(h * s);
      const canvases = [
        imgCanvasRef.current,
        maskCanvasRef.current,
        debugCanvasRef.current,
      ];
      canvases.forEach((c) => {
        if (c) {
          c.width = W;
          c.height = H;
        }
      });
      if (overlaySvgRef.current) {
        overlaySvgRef.current.setAttribute("width", String(W));
        overlaySvgRef.current.setAttribute("height", String(H));
        overlaySvgRef.current.setAttribute("viewBox", `0 0 ${W} ${H}`);
      }
      applyView();
    },
    [applyView]
  );

  const doZoomFit = useCallback(() => {
    const imgC = imgCanvasRef.current;
    const preview = previewRef.current;
    if (!imgC || !preview) return;
    const pw = preview.clientWidth,
      ph = preview.clientHeight;
    const s = Math.min(pw / imgC.width, ph / imgC.height);
    const v = viewRef.current;
    v.scale = Math.max(0.1, Math.min(4, s));
    v.x = Math.max((pw - imgC.width * v.scale) / 2, 0);
    v.y = Math.max((ph - imgC.height * v.scale) / 2, 0);
    applyView();
  }, [applyView]);

  const setZoom = useCallback(
    (pct: number) => {
      const v = viewRef.current;
      v.scale = Math.max(0.25, Math.min(4, pct / 100));
      applyView();
    },
    [applyView]
  );

  /* ---- Load image ---- */
  const drawImageToCanvas = useCallback(() => {
    const img = imgRef.current;
    const c = imgCanvasRef.current;
    if (!img || !c) return;
    const s = processScale / 100;
    const w = Math.round(img.naturalWidth * s);
    const h = Math.round(img.naturalHeight * s);
    fitToCanvas(img.naturalWidth, img.naturalHeight, processScale);
    const ctx = cx();
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight, 0, 0, w, h);
    doZoomFit();
    debouncedCompute(livePreview);
  }, [processScale, livePreview, fitToCanvas, doZoomFit]);

  /* ---- Image picking ---- */
  const onFile = useCallback(
    (file?: File) => {
      if (!file) return;
      const fr = new FileReader();
      fr.onload = () => {
        const img = new Image();
        img.onload = () => {
          imgRef.current = img;
          loadedRef.current = true;
          drawImageToCanvas();
        };
        img.src = fr.result as string;
      };
      fr.readAsDataURL(file);
    },
    [drawImageToCanvas]
  );

  /* ---- Compute pipeline ---- */
  const setBusy = (msg?: string) => setBusyMessage(msg || "Computing…");
  const clearBusy = () => setBusyMessage("");

  const onWorkerMessage = useCallback(
    (e: MessageEvent) => {
      const msg: any = e.data;
      if (!msg || !msg.type) return;
      if (msg.type === "progress") {
        setBusy(msg.message || "Working…");
        return;
      }
      if (msg.type === "result") {
        clearBusy();
        const r = msg.result;
        lastDERef.current = r.de
          ? {
              w: r.de.w,
              h: r.de.h,
              de: new Float32Array(r.de.buffer),
              min: r.de.min,
              max: r.de.max,
            }
          : null;
        lastCCRef.current = r.cc
          ? {
              w: r.cc.w,
              h: r.cc.h,
              labels: new Int32Array(r.cc.labelsBuffer),
              sizes: r.cc.sizes,
            }
          : null;
        lastMaskRef.current = r.finalMask
          ? {
              w: r.finalMask.w,
              h: r.finalMask.h,
              data: new Uint8Array(r.finalMask.buffer),
            }
          : null;
        lastSkelRef.current = r.skeleton
          ? {
              w: r.skeleton.w,
              h: r.skeleton.h,
              data: new Uint8Array(r.skeleton.buffer),
            }
          : null;
        const dList: string[] = r.dList || [];
        setPathLines(dList);
        if (lastMaskRef.current) renderMask(lastMaskRef.current);
        renderOverlay(dList);
        renderMini(dList);
        setStats({
          canvas: imgCanvasRef.current
            ? imgCanvasRef.current.width * imgCanvasRef.current.height
            : 0,
          pixels:
            (imgCanvasRef.current?.width || 0) *
            (imgCanvasRef.current?.height || 0),
          selected: r.selectedCount || 0,
          components: lastCCRef.current
            ? lastCCRef.current.sizes.length - 1
            : 0,
          segments: dList.length,
          targets: 1 + extraTargets.length,
        });
        // For manual mode, keep selection separate — it's fully controlled; do not auto-change selectedLabels
      }
    },
    [renderMask, renderOverlay, renderMini, extraTargets.length]
  );

  const compute = useCallback(
    (wantPath = false) => {
      if (!loadedRef.current) return;
      const imgC = imgCanvasRef.current;
      if (!imgC) return;
      const ctx = cx();
      if (!/^#([0-9a-f]{6})$/i.test(primaryColor)) return;
      const allHex = [primaryColor, ...extraTargets];

      const payload = {
        width: imgC.width,
        height: imgC.height,
        tolerance,
        colorMetric,
        invert: invertMask,
        erodeIter,
        dilateIter,
        compMode,
        selectedLabels: Array.from(selectedLabels),
        method,
        smoothIter,
        epsilon,
        wantPath: !!wantPath,
        hexList: allHex,
      };
      const imgData = ctx.getImageData(0, 0, imgC.width, imgC.height);
      const posted = post(payload, imgData.data.buffer, onWorkerMessage, () => {
        clearBusy();
      });
      if (posted) {
        setBusy("Building mask…");
        return;
      }

      const mask = selectColorMaskMulti(
        imgData,
        allHex,
        Number(tolerance),
        colorMetric,
        invertMask
      );
      lastDERef.current = {
        w: mask.w,
        h: mask.h,
        de: mask.de,
        min: mask.minDE,
        max: mask.maxDE,
      };
      let cleaned: {
        w: any;
        h: any;
        data: Uint8Array<ArrayBuffer>;
      } = mask;
      for (let i = 0; i < Number(erodeIter); i++) cleaned = erode(cleaned);
      for (let i = 0; i < Number(dilateIter); i++) cleaned = dilate(cleaned);
      const cc = connectedComponents(cleaned);
      lastCCRef.current = cc;
      let finalMask = cleaned;
      if (compMode === ComponentType.largest) {
        let keep = -1,
          maxA = -1;

        for (let l = 1; l < cc.sizes.length; l++) {
          const lItem = cc.sizes[l];

          if (!lItem) {
            console.log("Error - cc.sizes[l]", cc.sizes, l);
            break;
          }

          if (lItem > maxA) {
            maxA = lItem;
            keep = l;
          }
        }
        finalMask = keep > 0 ? maskFromLabels(cc, new Set([keep])) : cleaned;
      } else if (compMode === ComponentType.manual) {
        finalMask = selectedLabels.size
          ? maskFromLabels(cc, selectedLabels)
          : { w: cc.w, h: cc.h, data: new Uint8Array(cc.w * cc.h) };
      }

      lastMaskRef.current = finalMask;
      renderMask(finalMask as any);
      const selectedCount = finalMask.data.reduce((a, b) => a + b, 0);

      let dList: string[] = [];
      if (wantPath && selectedCount >= 2) {
        const res = extractPathsFromFinalMask(
          finalMask,
          method,
          { smoothIter: Number(smoothIter), epsilon: Number(epsilon) },
          imgC.width,
          imgC.height
        );
        dList = res.dList.slice();
        lastSkelRef.current = res.skeletonForDebug || null;
      }
      setPathLines(dList);
      renderOverlay(dList);
      renderMini(dList);
      setStats({
        canvas: imgCanvasRef.current
          ? imgCanvasRef.current.width * imgCanvasRef.current.height
          : 0,
        pixels: imgC.width * imgC.height,
        selected: selectedCount,
        components: cc.sizes.length - 1,
        segments: dList.length,
        targets: 1 + extraTargets.length,
      });
    },
    [
      primaryColor,
      extraTargets,
      tolerance,
      colorMetric,
      invertMask,
      erodeIter,
      dilateIter,
      compMode,
      selectedLabels,
      method,
      smoothIter,
      epsilon,
      post,
      onWorkerMessage,
      renderMask,
      renderOverlay,
      renderMini,
    ]
  );

  const debouncedCompute = useCallback(
    (wantPath = false) => debounce(() => compute(wantPath), 120),
    [debounce, compute]
  );

  return (
    <div className="extractor-container">
      <h1>SVG Editor (Polyline)</h1>
      <div className="sub">
        Drop an image → choose one or more target colors → tune tolerance. Paths
        use only <b>M/L</b>. Region picking and alignment snapping are removed.
      </div>
      <div className="panels-container">
        <div className="panel-container panel-left">
          <LeftControls
            processScale={processScale}
            setProcessScale={setProcessScale}
            livePreview={livePreview}
            setLivePreview={setLivePreview}
            zoomPct={zoomPct}
            setZoom={setZoom}
            doZoomFit={doZoomFit}
            debouncedCompute={debouncedCompute}
            onFile={onFile}
            compMode={compMode}
            setCompMode={setCompMode}
            selectedLabels={selectedLabels}
            setSelectedLabels={setSelectedLabels}
            lastCCRef={lastCCRef}
            invertMask={invertMask}
            setInvertMask={setInvertMask}
            maskOpacity={maskOpacity}
            setMaskOpacity={setMaskOpacity}
            colorMetric={colorMetric}
            setColorMetric={setColorMetric}
            tolerance={tolerance}
            setTolerance={setTolerance}
            primaryColor={primaryColor}
            setPrimaryColor={setPrimaryColor}
            extraTargets={extraTargets}
            setExtraTargets={setExtraTargets}
          />
        </div>
        <div className="panel-container panel-center">
          <CenterPreview
            previewRef={previewRef}
            stageRef={stageRef}
            imgCanvasRef={imgCanvasRef}
            maskCanvasRef={maskCanvasRef}
            debugCanvasRef={debugCanvasRef}
            overlaySvgRef={overlaySvgRef}
            onFile={onFile}
            viewMask={viewMask}
            viewPath={viewPath}
            busyMessage={busyMessage}
            loadedFile={loadedRef.current}
          />
        </div>
        <div className="panel-container panel-right">
          <RightControls
            busyMessage={busyMessage}
            erodeIter={erodeIter}
            setErodeIter={setErodeIter}
            dilateIter={dilateIter}
            setDilateIter={setDilateIter}
            method={method}
            setMethod={setMethod}
            smoothIter={smoothIter}
            setSmoothIter={setSmoothIter}
            epsilon={epsilon}
            setEpsilon={setEpsilon}
            viewMask={viewMask}
            setViewMask={setViewMask}
            viewPath={viewPath}
            setViewPath={setViewPath}
            viewComponents={viewComponents}
            setViewComponents={setViewComponents}
            viewPoints={viewPoints}
            setViewPoints={setViewPoints}
            viewSkeleton={viewSkeleton}
            setViewSkeleton={setViewSkeleton}
            dbgEndpoints={dbgEndpoints}
            setDbgEndpoints={setDbgEndpoints}
            dbgHeatmap={dbgHeatmap}
            setDbgHeatmap={setDbgHeatmap}
            dbgPCA={dbgPCA}
            setDbgPCA={setDbgPCA}
            heatOpacity={heatOpacity}
            setHeatOpacity={setHeatOpacity}
            debouncedCompute={debouncedCompute}
            pathLines={pathLines}
            miniSvgRef={miniSvgRef}
            imgCanvasRef={imgCanvasRef}
            maskCanvasRef={maskCanvasRef}
            debugCanvasRef={debugCanvasRef}
            overlaySvgRef={overlaySvgRef}
            lastMask={lastMaskRef.current}
            lastSkel={lastSkelRef.current}
            setPathLines={setPathLines}
            kpiOptions={kpiOptions.map((op) => ({
              ...op,
              value: stats[op.key],
            }))}
          />
        </div>
      </div>
    </div>
  );
}

export default Extractor;
