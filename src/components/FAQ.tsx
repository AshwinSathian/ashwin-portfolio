"use client";

import { motion } from "framer-motion";
import { FAQ } from "@/app/data/faq";
import { fadeInUp, stagger } from "@/lib/motion";

export default function FAQSection() {
  return (
    <section
      id="faq"
      aria-labelledby="faq-heading"
      className="bg-canvas px-6 py-20 md:px-16 md:py-24"
    >
      <div className="mx-auto max-w-5xl">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          className="flex flex-col gap-10"
        >
          <div className="flex flex-col gap-3">
            <motion.p
              variants={fadeInUp}
              className="text-xs font-medium uppercase tracking-[0.08em] text-label-3"
            >
              FAQ
            </motion.p>
            <motion.h2
              id="faq-heading"
              variants={fadeInUp}
              className="text-[clamp(28px,4vw,44px)] font-thin leading-none tracking-[-0.03em] text-label-1"
            >
              Quick answers.
            </motion.h2>
          </div>

          <div className="flex flex-col">
            {FAQ.map((item) => (
              <motion.details
                key={item.question}
                variants={fadeInUp}
                className="group border-t border-white/8 py-6 first:border-t-0 first:pt-0"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-[16px] font-medium text-label-1 marker:content-none [&::-webkit-details-marker]:hidden">
                  {item.question}
                  <span
                    aria-hidden
                    className="shrink-0 text-label-4 transition-transform duration-200 group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="mt-3 max-w-2xl text-[15px] leading-[1.7] text-label-3">
                  {item.answer}
                </p>
              </motion.details>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
