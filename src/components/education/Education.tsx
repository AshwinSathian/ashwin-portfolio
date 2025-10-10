import React from "react";
import { EDUCATION } from "@/data/education";

export default function Education() {
  return (
    <div className="text-gray-300 space-y-4">
      {EDUCATION.map((item) => (
        <div key={`${item.school}-${item.period}`}>
          <p className="font-semibold text-white">{item.school}</p>
          <p>
            {item.credential} | {item.period}
          </p>
          {item.details?.map((detail) => (
            <p key={detail}>{detail}</p>
          ))}
        </div>
      ))}
    </div>
  );
}
