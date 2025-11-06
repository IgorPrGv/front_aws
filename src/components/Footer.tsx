// src/components/Footer.tsx
export function Footer() {
  return (
    <footer className="border-t py-6 text-center text-sm text-muted-foreground">
      © {new Date().getFullYear()} Game Portal — Todos os direitos reservados
    </footer>
  );
}
