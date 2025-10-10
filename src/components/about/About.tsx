import React from "react";
import { ABOUT } from "@/data/about";

export default function About() {
  return (
    <p className="leading-relaxed text-gray-300 text-lg">{ABOUT.body}</p>
  );
}
