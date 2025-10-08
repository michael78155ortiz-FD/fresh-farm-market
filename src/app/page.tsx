export default function HomePage() {
  return (
    <main style={{ padding: "2rem", textAlign: "center" }}>
      <h1>Welcome to Fresh Farm Live</h1>
      <p>Connect with local vendors and discover live experiences!</p>
      <div style={{ marginTop: 20 }}>
        <a
          href="/market"
          style={{
            background: "#16a34a",
            color: "white",
            padding: "10px 20px",
            borderRadius: "8px",
            textDecoration: "none",
            fontWeight: "bold",
          }}
        >
          Enter Marketplace
        </a>
      </div>
    </main>
  );
}
