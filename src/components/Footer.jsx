import "bootstrap/dist/css/bootstrap.min.css";

export default function Footer() {
  return (
    <footer className="pt-3 mt-4">
      <p className="mb-1">© 2025 - {new Date().getFullYear()}</p>
    </footer>
  );
}
