import React from "react";

export default function Loader({ className = "py-24" }) {
  return (
    <div className={"flex items-center justify-center " + className} role="status" aria-label="Loading">
      <div className="w-7 h-7 border-[3px] border-secondary/40 border-t-primary rounded-full animate-spin" />
    </div>
  );
}