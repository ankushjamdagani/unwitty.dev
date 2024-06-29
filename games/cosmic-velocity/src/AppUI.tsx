import { Leva } from "leva";
import useDebugState, { DebugLevels } from "./state/Debug";

function StatusPanel() {
  const { debugLevel, setNoDebug, setFullDebug } = useDebugState();
  const isFullDebug = debugLevel === DebugLevels.FULL;

  return (
    <>
      <Leva collapsed hidden={!isFullDebug} />
      <div id="status-bar__container" className="panel__overlay">
        <button onClick={isFullDebug ? setNoDebug : setFullDebug}>
          {isFullDebug ? "Preview" : "Debug"}
        </button>
        <p>Status Bar</p>
      </div>
    </>
  );
}

export default function AppUI() {
  return (
    <div id="UIApp">
      <StatusPanel />
    </div>
  );
}
