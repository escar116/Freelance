import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { QueryClient } from '@tanstack/react-query';
import { useAuth } from "./AuthContext";

export function cn(...inputs) {
  return twMerge(clsx(inputs))
} 

export const isIframe = window.self !== window.top;

// ── CPE constants ──────────────────────────────────────────────────────
export const CATEGORIES = [
  "Software Development",
  "Programming",
  "Embedded Systems",
  "PCB & Hardware Design",
  "IoT",
  "AI & Data",
  "UI/UX",
  "Graphic Design",
  "Technical Documentation",
  "CAD & 3D Modeling",
];

export const FACULTY = [
  "Engr. Marites Bautista",
  "Engr. Rafael Domingo",
  "Engr. Liza Fernandez",
  "Engr. Noel Villanueva",
  "Dr. Anna Salcedo",
];

export const URGENCY = ["Low", "Normal", "Urgent"];

export const peso = (n) =>
  "₱" + Number(n || 0).toLocaleString("en-PH", { maximumFractionDigits: 0 });

export const initials = (name = "") =>
  name.split(" ").filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase();

// ── Filtering ──────────────────────────────────────────────────────────
const text = (...parts) => parts.filter(Boolean).join(" ").toLowerCase();

export function matchesQuery(item, q) {
  if (!q) return true;
  const haystack = text(
    item.title,
    item.description,
    item.category,
    item.seller_name,
    item.poster_name,
    item.requester?.fullName,
    (item.skills || []).join(" ")
  );
  return haystack.includes(q.toLowerCase());
}

export function applyFilters(items, filters, kind = "service") {
  const priceKey = kind === "service" ? "price" : "budget";
  const verifiedKey = kind === "service" ? "seller_verified" : "poster_verified";

  let out = items.filter((i) => {
    if (!matchesQuery(i, filters.q)) return false;
    if (filters.category && i.category !== filters.category) return false;
    
    // Filter out jobs where deadline has passed
    if (kind === "request" && i.deadline) {
      const today = new Date().toISOString().split('T')[0];
      if (i.deadline < today) return false;
    }

    if (filters.maxPrice != null && Number(i[priceKey]) > filters.maxPrice) return false;
    if (filters.verifiedOnly) {
      if (kind === "request") {
        if (!i.poster_verified && i.requester?.verificationStatus !== "verified") return false;
      } else {
        if (!i[verifiedKey]) return false;
      }
    }
    if (filters.minRating && Number(i.rating || 0) < filters.minRating) return false;
    return true;
  });

  const sort = filters.sort || "newest";
  out = [...out].sort((a, b) => {
    if (sort === "price_asc") return a[priceKey] - b[priceKey];
    if (sort === "price_desc") return b[priceKey] - a[priceKey];
    if (sort === "popular")
      return (b.popularity || b.offers_count || 0) - (a.popularity || a.offers_count || 0);
    return new Date(b.created_date || 0) - new Date(a.created_date || 0);
  });
  return out;
}

// ── Query Client ───────────────────────────────────────────────────────
export const queryClientInstance = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// ── useMe hook ─────────────────────────────────────────────────────────
export function useMe() {
  const { user, isLoadingAuth } = useAuth();
  return {
    data: user,
    isLoading: isLoadingAuth,
  };
}
