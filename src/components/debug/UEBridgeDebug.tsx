import { useState, useEffect, useCallback } from "react";
import { getEventLog } from "@/lib/ue-bridge";

/**
 * On-screen debug overlay for UE Bridge events.
 * Shows the last 10 events with direction, name, and serialized data.
 * Toggle with the bug icon button (bottom-left).
 */
export function UEBridgeDebug() {
  const [visible, setVisible] = useState(true);
  const [logs, setLogs] = useState<ReturnType<typeof getEventLog>>([]);

  const refresh = useCallback(() => {
    setLogs([...getEventLog()].reverse().slice(0, 10));
  }, []);

  useEffect(() => {
    const interval = setInterval(refresh, 500);
    return () => clearInterval(interval);
  }, [refresh]);

  if (!visible) {
    return (
      <button
        onClick={() => setVisible(true)}
        style={{
          position: "fixed",
          bottom: 8,
          left: 8,
          zIndex: 99999,
          background: "#000c",
          color: "#0f0",
          border: "1px solid #0f04",
          borderRadius: 6,
          padding: "4px 10px",
          fontSize: 12,
          cursor: "pointer",
        }}
      >
        🐛 UE Debug
      </button>
    );
  }

  return (
    <div
      style={{
        position: "fixed",
        bottom: 8,
        left: 8,
        zIndex: 99999,
        background: "#000d",
        color: "#0f0",
        border: "1px solid #0f04",
        borderRadius: 8,
        padding: 10,
        fontSize: 11,
        fontFamily: "monospace",
        maxWidth: 420,
        maxHeight: 300,
        overflow: "auto",
        pointerEvents: "auto",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <strong>UE Bridge Debug</strong>
        <button onClick={() => setVisible(false)} style={{ color: "#f88", cursor: "pointer", background: "none", border: "none", fontSize: 11 }}>
          ✕ hide
        </button>
      </div>
      {logs.length === 0 && <div style={{ color: "#888" }}>No events yet…</div>}
      {logs.map((log, i) => (
        <div key={i} style={{ borderTop: "1px solid #0f02", padding: "3px 0" }}>
          <span style={{ color: log.direction === "to-ue" ? "#ff0" : "#0ff" }}>
            {log.direction === "to-ue" ? "→ UE" : "← UE"}
          </span>{" "}
          <strong>{log.event}</strong>
          <div style={{ color: "#aaa", wordBreak: "break-all" }}>
            {(() => {
              const d = log.data as Record<string, unknown> | null;
              if (!d) return "—";
              return String(d.name ?? d.id ?? JSON.stringify(d));
            })()}
          </div>
        </div>
      ))}
    </div>
  );
}
