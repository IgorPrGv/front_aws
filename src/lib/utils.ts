// utils.ts
export function s3Url(path: string) {
  const base = import.meta.env.VITE_S3_PUBLIC_URL; // ex: https://game-website-files.s3.amazonaws.com
  if (!path) return "";
  return `${base}/${path.replace(/^\/+/, "")}`;
}

// src/lib/utils.ts
import clsx, { type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Junta classes (clsx) e resolve conflitos do Tailwind (twMerge) */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
