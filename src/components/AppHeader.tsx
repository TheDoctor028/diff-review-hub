import { Sun, Moon, GitBranch } from "lucide-react";
import { useDarkMode } from "@/hooks/use-dark-mode";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function AppHeader() {
  const { dark, toggle } = useDarkMode();
  const navigate = useNavigate();

  return (
    <header className="border-b bg-card">
      <div className="container flex h-14 items-center justify-between">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 font-mono text-lg font-bold text-foreground hover:text-primary transition-colors"
        >
          <GitBranch className="h-5 w-5 text-primary" />
          Diff City
        </button>
        <Button variant="ghost" size="icon" onClick={toggle} aria-label="Toggle theme">
          {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
      </div>
    </header>
  );
}
