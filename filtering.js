const text = (...parts) => parts.filter(Boolean).join(" ").toLowerCase();

export function matchesQuery(item, q) {
  if (!q) return true;
  const haystack = text(
    item.title,
    item.description,
    item.category,
    item.seller_name,
    item.poster_name,
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
    if (filters.maxPrice != null && Number(i[priceKey]) > filters.maxPrice) return false;
    if (filters.verifiedOnly && !i[verifiedKey]) return false;
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