import {
  Mail,
  Phone,
  MapPin,
  User,
  Briefcase,
  Code,
  Folder,
  FileText,
  Award,
  GraduationCap,
  Send,
  ExternalLink,
  Home,
  Settings,
  Image,
  Layers,
  Users,
  Inbox,
  Sparkles,
  ArrowRight,
  ArrowDown,
  ChevronDown,
  Plus,
  Trash2,
  Pencil,
  X,
  Check,
  Globe,
  type LucideIcon,
} from "lucide-react";
import { Github, Linkedin } from "@/components/ui/BrandIcons";

const ICONS: Record<string, LucideIcon | typeof Github> = {
  mail: Mail,
  phone: Phone,
  "map-pin": MapPin,
  user: User,
  briefcase: Briefcase,
  code: Code,
  folder: Folder,
  "file-text": FileText,
  award: Award,
  "graduation-cap": GraduationCap,
  send: Send,
  "external-link": ExternalLink,
  home: Home,
  settings: Settings,
  image: Image,
  layers: Layers,
  users: Users,
  inbox: Inbox,
  sparkles: Sparkles,
  "arrow-right": ArrowRight,
  "arrow-down": ArrowDown,
  "chevron-down": ChevronDown,
  plus: Plus,
  trash: Trash2,
  pencil: Pencil,
  x: X,
  check: Check,
  globe: Globe,
  github: Github,
  linkedin: Linkedin,
};

export type IconName = keyof typeof ICONS;

export function getIcon(name: string | undefined | null): LucideIcon | typeof Github | null {
  if (!name) return null;
  return ICONS[name.toLowerCase()] ?? null;
}

export const SOCIAL_ICONS = ICONS;
