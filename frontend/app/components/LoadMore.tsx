import { Button } from "react-bootstrap";

type LoadMoreProps = {
  onClick: () => void;
  loading?: boolean;
};

export default function LoadMore({ onClick, loading = false }: LoadMoreProps) {
  return (
    <div className="d-flex justify-content-center mt-4">
      <Button variant="outline-light" onClick={onClick} disabled={loading}>
        {loading ? "Cargando…" : "Más resultados"}
      </Button>
    </div>
  );
}
