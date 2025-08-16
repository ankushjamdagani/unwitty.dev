import Panel from "../../../../components/panel";

function ComponentsPanel({
  livePreview,
  debouncedCompute,
  compMode,
  setCompMode,
  selectedLabels,
  setSelectedLabels,
  lastCC,
}) {
  const selectAll = () => {
    if (!lastCC) return;
    const L = lastCC.sizes.length - 1;
    setSelectedLabels(new Set(Array.from({ length: L }, (_, i) => i + 1)));
    if (livePreview) debouncedCompute();
  };
  const selectNone = () => {
    setSelectedLabels(new Set());
    if (livePreview) debouncedCompute();
  };
  const selectLargest = () => {
    if (!lastCC) return;
    let keep = -1,
      max = -1;
    for (let l = 1; l < lastCC.sizes.length; l++) {
      const sz = lastCC.sizes[l] || 0;
      if (sz > max) {
        max = sz;
        keep = l;
      }
    }
    setSelectedLabels(keep > 0 ? new Set([keep]) : new Set());
    if (livePreview) debouncedCompute();
  };

  return (
    <Panel title="🧩 Components" open>
      <div className="rowline">
        <select
          style={{ flex: 1 }}
          value={compMode}
          onChange={(e) => {
            setCompMode(e.target.value as any);
            if (livePreview) debouncedCompute();
          }}
        >
          <option value="all">Keep all</option>
          <option value="largest">Keep largest</option>
          <option value="manual">Manual (use list)</option>
        </select>
      </div>
      <div>
        <button className="small" onClick={selectAll}>
          Select All
        </button>
        <button className="small" onClick={selectNone}>
          Select None
        </button>
        <button className="small" onClick={selectLargest}>
          Only Largest
        </button>
      </div>
      <div id="compList">
        {!lastCC?.length && <div className="small">No components yet.</div>}
        {lastCC?.length &&
          (() => {
            const items: { l: number; sz: number }[] = [];
            const sizes = lastCC.sizes;
            for (let l = 1; l < sizes.length; l++) {
              const sz = sizes[l] || 0;
              if (sz === 0) continue;
              items.push({ l, sz });
            }
            items.sort((a, b) => b.sz - a.sz);
            return items.map((it) => (
              <div className="row" key={it.l}>
                <input
                  type="checkbox"
                  checked={
                    selectedLabels.size ? selectedLabels.has(it.l) : true
                  }
                  onChange={(e) => {
                    const next = new Set(selectedLabels);
                    if (e.target.checked) next.add(it.l);
                    else next.delete(it.l);
                    setSelectedLabels(next);
                    if (livePreview) debouncedCompute();
                  }}
                />
                <span
                  className="swatch"
                  style={{ background: `hsl(${(it.l * 53) % 360}deg 80% 60%)` }}
                />
                <span>{`Label ${it.l}`}</span>
                <span className="badge">{it.sz.toLocaleString()} px</span>
              </div>
            ));
          })()}
      </div>
    </Panel>
  );
}

export default ComponentsPanel;
