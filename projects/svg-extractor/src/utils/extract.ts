import type { BinaryMask, Skeleton, ExtractSettings, Point } from "./types";
import { zhangSuenThinning, longestSkeletonPath } from "./skeleton";
import {
  connectedComponents,
  pointsFromMask,
  maskFromLabels,
} from "./components";
import { smoothOnce, rdpSimplify, polylinePath } from "./geometry";
import { computeMedianPathPCA } from "./pca";

export function extractPathsFromFinalMask(
  finalMask: BinaryMask,
  method: "skeleton" | "pca",
  settings: ExtractSettings,
  W: number,
  H: number
): {
  dList: string[];
  pointsList: Point[][];
  skeletonForDebug: Skeleton | null;
} {
  const dList: string[] = [];
  const pointsList: Point[][] = [];
  let skeletonForDebug: Skeleton | null = null;

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
