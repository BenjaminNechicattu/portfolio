import { Link } from "react-router-dom";

const Habitty = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="section-container py-4">
        <Link to="/" className="text-primary underline">
          Back to portfolio
        </Link>
      </div>
      <iframe
        title="Habitty Web App"
        src="/habitty/index.html"
        className="w-full border-0"
        style={{ height: "calc(100vh - 72px)" }}
      />
    </div>
  );
};

export default Habitty;
