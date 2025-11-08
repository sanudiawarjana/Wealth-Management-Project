"use client"

import { useEffect, useState } from "react"
import { colorPalettes, type ColorPaletteName } from "@/lib/color-palettes"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Palette } from "lucide-react"

export function ColorPaletteSelector() {
  const [currentPalette, setCurrentPalette] = useState<ColorPaletteName>("ocean")

  useEffect(() => {
    const saved = localStorage.getItem("color-palette")
    if (saved && saved in colorPalettes) {
      setCurrentPalette(saved as ColorPaletteName)
      applyColorPalette(saved as ColorPaletteName)
    }
  }, [])

  const applyColorPalette = (paletteName: ColorPaletteName) => {
    const isDark = document.documentElement.classList.contains("dark")
    const palette = colorPalettes[paletteName][isDark ? "dark" : "light"]

    Object.entries(palette).forEach(([key, value]) => {
      const cssVar = `--${key.replace(/([A-Z])/g, "-$1").toLowerCase()}`
      document.documentElement.style.setProperty(cssVar, value)
    })

    localStorage.setItem("color-palette", paletteName)
    setCurrentPalette(paletteName)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Palette className="h-5 w-5" />
          <span className="sr-only">Color Palette</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>Color Palettes</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {Object.keys(colorPalettes).map((palette) => (
          <DropdownMenuItem
            key={palette}
            onClick={() => applyColorPalette(palette as ColorPaletteName)}
            className={currentPalette === palette ? "bg-accent" : ""}
          >
            <div className="flex items-center gap-2 w-full">
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-3 h-3 rounded-full"
                    style={{
                      backgroundColor:
                        colorPalettes[palette as ColorPaletteName].light[
                          `chart${i + 1}` as keyof (typeof colorPalettes)[ColorPaletteName]["light"]
                        ],
                    }}
                  />
                ))}
              </div>
              <span className="capitalize">{palette}</span>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
