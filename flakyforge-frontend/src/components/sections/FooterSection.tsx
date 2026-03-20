import { Logo } from "../Logo";

export function FooterSection() {
  return (
    <footer className="w-full bg-[#0F1117] py-10 px-6 mt-20">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Logo size="sm" />
        <p className="text-[#94A3B8] text-[13px]">
          © 2025 FlakeForge. Built for developers who care about test
          reliability.
        </p>
      </div>
    </footer>
  );
}
