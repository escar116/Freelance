import React from "react";
import { Image } from "./image";
import { initials } from "./cpe";

export default function Avatar({ src, name = "", className = "w-10 h-10" }) {
  if (src) {
    return (
      <Image
        src={src}
        alt={name}
        className={"rounded-full object-cover ring-2 ring-white shadow-sm " + className}
      />
    );
  }
  return (
    <div
      aria-hidden="true"
      className={
        "rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold text-xs ring-2 ring-white " +
        className
      }
    >
      {initials(name) || "?"}
    </div>
  );
}