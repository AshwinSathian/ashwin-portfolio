import { SITE } from "@/app/data/site";

export default function Footer() {
  return (
    <footer className="border-t border-white/8 bg-canvas px-6 py-6 md:px-8">
      <div className="mx-auto flex max-w-5xl items-center justify-between">
        <span className="text-[14px] text-label-4">
          © {new Date().getFullYear()} {SITE.name}
        </span>
        <a
          href={SITE.resumePath}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[14px] text-label-3 transition-colors duration-200 hover:text-label-1"
        >
          Resume ↓
        </a>
      </div>
    </footer>
  );
}
