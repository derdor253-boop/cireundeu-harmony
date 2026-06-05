import {
  Wheat, Sprout, Trees, Users, Map, Landmark,
  Drum, Mountain, ChefHat, Leaf, Home, Camera,
  GraduationCap, Sparkles, MapPin, Phone, Clock,
  Navigation, Instagram, Facebook, MessageCircle, Youtube,
  Music, Globe, Heart, Star, Flag, Sun, type LucideIcon,
} from "lucide-react";

const map: Record<string, LucideIcon> = {
  Wheat, Sprout, Trees, Users, Map, Landmark,
  Drum, Mountain, ChefHat, Leaf, Home, Camera,
  GraduationCap, Sparkles, MapPin, Phone, Clock,
  Navigation, Instagram, Facebook, MessageCircle, Youtube,
  Music, Globe, Heart, Star, Flag, Sun,
};

export function getIcon(name?: string, fallback: LucideIcon = Sparkles): LucideIcon {
  if (!name) return fallback;
  return map[name] ?? fallback;
}

export const AVAILABLE_ICONS = Object.keys(map);
