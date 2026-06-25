"use client";

import { motion } from "framer-motion";
import { HIGHLIGHTS } from "@/app/data/highlights";
import { fadeInUp, stagger } from "@/lib/motion";

function getItemBorderClasses(i: number): string {
  if (i === 0) return "";
  if (i === 1) return "border-t border-white/8 sm:border-t-0 sm:border-l sm:pl-10";
  if (i === 2) return "border-t border-white/8 lg:border-t-0 lg:border-l lg:pl-10";
  return "border-t border-white/8 sm:border-l sm:pl-10 lg:border-t-0";
}

// Splits "1.5× faster releases" into ["1.5×", "faster releases"],
// keeping short unit suffixes (e.g. "ms") attached to the leading value.
function splitMetric(metric: string): [string, string] {
  const words = metric.split(" ");
  const heroWords = [words[0]];
  let i = 1;
  if (i < words.length && words[i].length <= 3 && words[i] === words[i].toLowerCase()) {
    heroWords.push(words[i]);
    i++;
  }
  return [heroWords.join(" "), words.slice(i).join(" ")];
}

export default function Impact() {
  return (
    <section
      id="impact"
      aria-label="By the numbers"
      className="flex min-h-svh items-center bg-canvas px-6 py-24 md:px-16"
    >
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
      >
        {HIGHLIGHTS.map((h, i) => {
          const [heroValue, descriptor] = splitMetric(h.metric);
          return (
            <motion.div
              key={h.id}
              variants={fadeInUp}
              className={`flex flex-col items-center text-center py-12 px-8 ${getItemBorderClasses(i)}`}
            >
              <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-label-4 mb-6">
                {h.title}
              </p>
              <p
                className="font-thin leading-none tracking-[-0.045em] text-label-1"
                style={{ fontSize: "clamp(48px, 6vw, 80px)" }}
              >
                {heroValue}
              </p>
              {descriptor && (
                <p className="text-[15px] font-light leading-snug tracking-[-0.01em] text-label-2 mt-2">
                  {descriptor}
                </p>
              )}
              <p className="text-[13px] leading-[1.6] text-label-3 mt-5 max-w-48 mx-auto">
                {h.summary}
              </p>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}
