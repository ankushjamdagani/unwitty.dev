import { ComponentType, MetricColor } from "../types";
import * as Utils from "../utils";

type PayloadProps = {
  width: number;
  height: number;
  tolerance: number;
  colorMetric: MetricColor;
  invert: boolean;
  erodeIter: number;
  dilateIter: number;
  compMode: ComponentType;
  selectedLabels: number[];
  method: "skeleton" | "pca";
  smoothIter: number;
  epsilon: number;
  wantPath: boolean;
  hexList: string[];
};

function postProgress(jobId: string, message: string) {
  self.postMessage({ type: "progress", jobId, message });
}

self.onmessage = function (e) {
  const { type, jobId, payload, buffer } = e.data || {};
  if (type !== "compute" || !payload || !buffer) return;
  const {
    width,
    height,
    tolerance,
    colorMetric,
    invert,
    erodeIter,
    dilateIter,
    compMode,
    selectedLabels,
    method,
    smoothIter,
    epsilon,
    wantPath,
    hexList,
  }: PayloadProps = payload;

  const rgba = new Uint8ClampedArray(buffer);

  // 1) Color mask
  postProgress(jobId, "Selecting colors…");
  const sel = Utils.selectColorMaskMulti(
    { width, height, data: rgba },
    hexList,
    tolerance,
    colorMetric,
    invert
  );

  // 2) Morphology
  postProgress(jobId, "Cleaning mask…");
  let cleaned: { w: number; h: number; data: Uint8Array } = sel;
  for (let i = 0; i < erodeIter; i++) cleaned = Utils.erode(cleaned);
  for (let i = 0; i < dilateIter; i++) cleaned = Utils.dilate(cleaned);

  // 3) Components
  postProgress(jobId, "Labeling components…");
  const cc = Utils.connectedComponents(cleaned);

  // 4) Component mode -> final mask
  let autoSelected = false;
  let finalMask = cleaned;
  if (compMode === "largest") {
    let keepLabel = -1,
      maxArea = -1;
    for (let l = 1; l < cc.sizes.length; l++) {
      const sz = cc.sizes[l] || 0;
      if (sz > maxArea) {
        maxArea = sz;
        keepLabel = l;
      }
    }
    finalMask =
      keepLabel > 0 ? Utils.maskFromLabels(cc, new Set([keepLabel])) : cleaned;
  } else if (compMode === "manual") {
    const set = new Set(selectedLabels || []);
    if (!set.size) {
      autoSelected = true;
      for (let l = 1; l < cc.sizes.length; l++) set.add(l);
    }
    finalMask = set.size
      ? Utils.maskFromLabels(cc, set)
      : { w: cc.w, h: cc.h, data: new Uint8Array(cc.w * cc.h) };
  }

  const selectedCount = finalMask.data.reduce((a, b) => a + b, 0);

  // 5) Path extraction
  let dList = [];
  let skeleton = null;
  if (wantPath && selectedCount >= 2) {
    if (method === "skeleton") {
      postProgress(jobId, "Skeletonizing…");
      const skAll = Utils.zhangSuenThinning(finalMask);
      skeleton = { w: skAll.w, h: skAll.h, buffer: skAll.data.buffer };
      const ccSk = Utils.connectedComponents(skAll);
      for (let l = 1; l < ccSk.sizes.length; l++) {
        if (ccSk.sizes[l] < 2) continue;
        const skL = Utils.maskFromLabels(ccSk, new Set([l]));
        let poly = Utils.longestSkeletonPath(skL);
        if (poly && poly.length >= 2) {
          for (let it = 0; it < smoothIter; it++) poly = Utils.smoothOnce(poly);
          if (epsilon > 0 && poly.length > 2)
            poly = Utils.rdpSimplify(poly, epsilon);
          dList.push(Utils.polylinePath(poly));
        }
      }
    } else {
      postProgress(jobId, "Extracting PCA median…");
      const ccKeep = Utils.connectedComponents(finalMask);
      for (let l = 1; l < ccKeep.sizes.length; l++) {
        if (ccKeep.sizes[l] < 2) continue;
        const mL = Utils.maskFromLabels(ccKeep, new Set([l]));
        const pts = Utils.pointsFromMask(mL);
        const out = Utils.computeMedianPathPCA(
          pts,
          { bins: 120, minPerBin: 30, smoothIter, epsilon, curved: false },
          width,
          height
        );
        let poly = out.points;
        if (poly && poly.length >= 2) {
          for (let it = 0; it < smoothIter; it++) poly = Utils.smoothOnce(poly);
          if (epsilon > 0 && poly.length > 2)
            poly = Utils.rdpSimplify(poly, epsilon);
          dList.push(Utils.polylinePath(poly));
        }
      }
    }
  }

  postProgress(jobId, "Finalizing…");
  self.postMessage(
    {
      type: "result",
      jobId,
      result: {
        dList,
        selectedCount,
        autoSelected,
        finalMask: {
          w: finalMask.w,
          h: finalMask.h,
          buffer: finalMask.data.buffer,
        },
        de: {
          w: sel.w,
          h: sel.h,
          buffer: sel.de.buffer,
          min: sel.minDE,
          max: sel.maxDE,
        },
        cc: {
          w: cc.w,
          h: cc.h,
          labelsBuffer: cc.labels.buffer,
          sizes: cc.sizes,
        },
        skeleton,
      },
    },
    [finalMask.data.buffer, sel.de.buffer, cc.labels.buffer].concat(
      skeleton ? [skeleton.buffer] : []
    )
  );
};

// let code = ExtractorWorker.toString();
// code = code.substring(code.indexOf("{") + 1, code.lastIndexOf("}"));
// const blob = new Blob([code], { type: "application/javascript" });
// const workerScript = URL.createObjectURL(blob);

// export default workerScript;
