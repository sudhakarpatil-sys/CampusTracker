"use client";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en" className="dark">
      <body style={{ background: "#0b0e14", color: "#e8eaf0", fontFamily: "system-ui, sans-serif" }}>
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, textAlign: "center", padding: 24 }}>
          <h1 style={{ fontSize: 24, fontWeight: 600 }}>CampusTracker hit a snag</h1>
          <p style={{ color: "#8b92a6", maxWidth: 360 }}>A critical error occurred while rendering the app. Reloading usually fixes it.</p>
          <button
            onClick={() => reset()}
            style={{ background: "#5b7fff", color: "white", border: "none", borderRadius: 8, padding: "10px 20px", cursor: "pointer" }}
          >
            Reload
          </button>
        </div>
      </body>
    </html>
  );
}
