"use client";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en" className="dark">
      <body style={{ background: "#0b0e14", color: "#e8eaf0", fontFamily: "system-ui, sans-serif" }}>
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, textAlign: "center", padding: 24 }}>
          <h1 style={{ fontSize: 24, fontWeight: 600 }}>CampusTracker hit a snag</h1>
          <p style={{ color: "#8b92a6", maxWidth: 360 }}>A critical error occurred while rendering the app. Reloading usually fixes it.</p>
          {error.digest && (
            <p style={{ color: "#6b7280", fontSize: 12, fontFamily: "monospace" }}>
              Error ID: {error.digest}
            </p>
          )}
          <div style={{ display: "flex", gap: 12 }}>
            <button
              onClick={() => reset()}
              style={{ background: "#5b7fff", color: "white", border: "none", borderRadius: 8, padding: "10px 20px", cursor: "pointer" }}
              data-testid="global-error-reload"
            >
              Reload
            </button>
            <button
              onClick={() => window.history.back()}
              style={{ background: "transparent", color: "#8b92a6", border: "1px solid #2a2f3a", borderRadius: 8, padding: "10px 20px", cursor: "pointer" }}
              data-testid="global-error-back"
            >
              Go back
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
