import { BatteryCharging, Biohazard, Cog, GlassWater, LucideIcon, Newspaper, Puzzle, Shirt } from "lucide-react";

export const WASTE_ICONS: Record<string, LucideIcon> = {
    plastic: Puzzle,
    paper: Newspaper,
    glass: GlassWater,
    metal: Cog,
    clothing: Shirt,
    hazardous: Biohazard,
    batteries: BatteryCharging
}