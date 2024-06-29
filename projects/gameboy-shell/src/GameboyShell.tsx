import React, { ReactNode, useState } from "react";

import "./GameboyShell.css";

function GameboyShell({ children }: { children: ReactNode }) {
  const [isDebug, setDebug] = useState(false);
  const [deg, setDeg] = useState([20, 20]);

  return (
    <>
      {isDebug && (
        <div style={{ background: "#000" }}>
          <label>
            <input
              style={{
                background: "#ddd",
                margin: "8px",
              }}
              type="range"
              step={0.1}
              max={360}
              min={0}
              onChange={(e) =>
                setDeg((curr) => [curr[0] || 0, parseFloat(e.target.value)])
              }
              defaultValue={deg[1]}
            />
          </label>
          <label>
            <input
              style={{
                background: "#ddd",
                margin: "8px",
              }}
              type="range"
              step={0.1}
              max={360}
              min={0}
              onChange={(e) =>
                setDeg((curr) => [parseFloat(e.target.value), curr[1] || 0])
              }
              defaultValue={deg[0]}
            />
          </label>
        </div>
      )}
      <article
        className="gameboy-shell gs-container"
        style={{
          transform: `rotateX(-${deg[1]}deg) rotateY(-${deg[0]}deg)`,
        }}
      >
        <div className="gs-back" />
        <div className="gs-left" />
        <div className="gs-right" />
        <div className="gs-top" />
        <div className="gs-top-left" />
        <div className="gs-top-right" />
        <div className="gs-bottom" />
        <div className="gs-bottom-left" />
        <div className="gs-bottom-right" />
        <article className="gs-front">
          <section className="gs-head">
            <div className="gs-head-left" />
            <div className="gs-head-center">
              <div className="gs-device-indicator">
                <div>&lt;OFF</div>
                <div className="seperator-dot" />
                <div>ON&gt;</div>
              </div>
            </div>
            <div className="gs-head-right" />
          </section>
          <section className="gs-screen">
            <div className="gs-screen-head">
              <span>DCB MASTER WITH STEREO SOUND</span>
            </div>
            <div className="gs-screen-aside">
              <div className="gs-battery-indicator" />
              LIVE
            </div>
            <div className="gs-screen-content">
              <div className="gs-screen-content-wrapper">
                {children}
              </div>
            </div>
          </section>
          <section className="gs-brand">
            # ANKUSH <em>Unwitty.dev</em> TM
          </section>
          <section className="gs-foot">
            <div className="gs-arr-btns">
              <button className="gs-arr-btn-top" />
              <button className="gs-arr-btn-left" />
              <button className="gs-arr-btn-right" />
              <button className="gs-arr-btn-bottom" />
            </div>
            <div></div>
            <div className="gs-action-btns">
              <button
                className="gs-action-btn-left"
                onClick={() => setDebug((e) => !e)}
              />
              <button className="gs-action-btn-right" />
            </div>
            <div></div>
            <div className="gs-primary-btns">
              <button className="gs-primary-btn-left">
                <span className="gs-primary-btn-handle" />
                <span className="gs-primary-btn-label">SELECT</span>
              </button>
              <button className="gs-primary-btn-right">
                <span className="gs-primary-btn-handle" />
                <span className="gs-primary-btn-label">START</span>
              </button>
            </div>
            <div className="gs-charging-indicator">
              <div />
              <div />
              <div />
              <div />
              <div />
              <div />
            </div>
          </section>
          <section className="gs-connection">
            <div className="label">PHONES</div>
            <div className="indicator">
              <div />
              <div />
              <div />
            </div>
          </section>
        </article>
      </article>
    </>
  );
}

export { GameboyShell };
