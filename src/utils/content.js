import categories from "../data/categories.json";

const categoryNames = new Map(categories.map((category) => [category.id, category.name]));

export function getCategoryName(categoryId) {
  return categoryNames.get(categoryId) ?? "Fandom";
}

export function matchesSearch(item, query) {
  const normalizedQuery = query.trim().toLocaleLowerCase();
  if (!normalizedQuery) return true;

  const categoryName = item.categoryId ? getCategoryName(item.categoryId) : "";
  const values = [categoryName, ...Object.values(item)];
  const searchableText = values
    .filter((value) => value !== null && value !== undefined)
    .map((value) => (Array.isArray(value) ? value.join(" ") : String(value)))
    .join(" ")
    .toLocaleLowerCase();

  return searchableText.includes(normalizedQuery);
}

export function formatMoney(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(amount);
}