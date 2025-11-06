// src/components/ThemeToggle.tsx
import { Moon, Sun } from "lucide-react";
import { Button } from "./ui/button";
import { useTheme } from "../providers/ThemeProvider";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <Button variant="outline" size="icon" onClick={toggleTheme} aria-label="Alternar tema">
      {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
      <span className="sr-only">Alternar tema</span>
    </Button>
  );
}