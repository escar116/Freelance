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