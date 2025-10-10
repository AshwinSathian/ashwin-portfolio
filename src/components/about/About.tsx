"use client";

import React from "react";
import { Card } from "primereact/card";
import { Avatar } from "primereact/avatar";
import { Accordion, AccordionTab } from "primereact/accordion";
import { ABOUT } from "@/data/about";

export default function About() {
  return (
    <Card className="max-w-3xl mx-auto bg-gray-900/60 border-gray-800 shadow-lg">
      <div className="flex flex-col gap-6">
        <div className="flex items-start gap-4">
          <Avatar
            label="AS"
            shape="circle"
            className="bg-blue-500 text-white font-semibold shrink-0 shadow-sm"
            aria-label="Ashwin Sathian"
          />

          <p className="text-base leading-relaxed text-gray-300 text-balance">
            {ABOUT.body}
          </p>
        </div>

        <Accordion className="border-0 bg-transparent" multiple>
          <AccordionTab header="Focus Areas" headerClassName="text-white" contentClassName="bg-transparent">
            <ul className="list-disc ml-5 space-y-1 text-gray-300">
              <li>Multi-tenancy and RBAC in enterprise SaaS environments</li>
              <li>Clean, modular architecture with scalable DX guardrails</li>
              <li>Performance tuning for consistent sub-200 ms query paths</li>
              <li>Mentorship and cross-functional team leadership</li>
            </ul>
          </AccordionTab>
        </Accordion>
      </div>
    </Card>
  );
}
