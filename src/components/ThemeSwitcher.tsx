"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Switch } from "@/components/ui/switch";
import { useEffect, useState } from "react";

export function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center gap-2">
        <Sun className="h-[1.2rem] w-[1.2rem]" />
        <Switch disabled />
        <Moon className="h-[1.2rem] w-[1.2rem]" />
      </div>
    );
  }

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <div className="flex items-center gap-2">
      <Sun
        className={`h-[1.2rem] w-[1.2rem] transition-all duration-300 ease-in-out ${
          theme === "light" ? "scale-100 opacity-100" : "scale-0 opacity-0"
        }`}
      />
      <Switch checked={theme === "dark"} onCheckedChange={toggleTheme} />
      <Moon
        className={`h-[1.2rem] w-[1.2rem] transition-all duration-300 ease-in-out ${
          theme === "dark" ? "scale-100 opacity-100" : "scale-0 opacity-0"
        }`}
      />
    </div>
  );
}
