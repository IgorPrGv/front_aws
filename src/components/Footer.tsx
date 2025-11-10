// src/components/Footer.tsx
export function Footer() {
  return (
    <footer className="border-t py-2 text-center text-sm text-muted-foreground">
      © {new Date().getFullYear()} Steam da UFC - Todos os direitos reservados
    </footer>
  );
}
