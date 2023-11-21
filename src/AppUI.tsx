import useDebugState, { DebugLevels } from "./state/Debug";

function StatusPanel() {
  const { debugLevel, setNoDebug, setFullDebug } = useDebugState();
  const isFullDebug = debugLevel === DebugLevels.FULL;

  return (
    <div>
      <button onClick={isFullDebug ? setNoDebug : setFullDebug}>
        {isFullDebug ? "Preview" : "Debug"}
      </button>
    </div>
  );
}

export default function AppUI() {
  return (
    <div id="UIApp">
      <StatusPanel />
    </div>
  );
}
