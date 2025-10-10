import React from "react";
import {
  FaBriefcase,
  FaGraduationCap,
  FaTools,
  FaUser,
} from "react-icons/fa";

type SectionHeadingProps = {
  id: string;
  title: string;
  subtitle?: string;
  className?: string;
};

const iconMap: Record<string, React.ReactNode> = {
  "about-heading": (
    <FaUser
      className="text-blue-400"
      aria-hidden
      suppressHydrationWarning
    />
  ),
  "skills-heading": (
    <FaTools
      className="text-blue-400"
      aria-hidden
      suppressHydrationWarning
    />
  ),
  "experience-heading": (
    <FaBriefcase
      className="text-blue-400"
      aria-hidden
      suppressHydrationWarning
    />
  ),
  "education-heading": (
    <FaGraduationCap
      className="text-blue-400"
      aria-hidden
      suppressHydrationWarning
    />
  ),
};

export default function SectionHeading({
  id,
  title,
  subtitle,
  className,
}: SectionHeadingProps) {
  const icon = iconMap[id];
  const headingClasses = [
    "text-3xl",
    "font-semibold",
    "flex",
    "items-center",
    "gap-3",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div>
      <h2 id={id} className={headingClasses}>
        {icon}
        {title}
      </h2>
      {subtitle ? (
        <p className="mt-2 text-gray-400 text-lg">{subtitle}</p>
      ) : null}
    </div>
  );
}
