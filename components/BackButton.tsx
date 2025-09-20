// components/BackButton.tsx
"use client";

import { useRouter } from "next/navigation";

export default function BackButton({
  href = "/admin/pigs",
  label = "← Volver al panel",
}: {
  href?: string;
  label?: string;
}) {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => (href ? router.push(href) : router.back())}
      className="inline-flex items-center gap-2 rounded-md border border-[#E6D9CE] bg-white/70 px-3 py-2 text-[#8B5E34] text-sm font-medium shadow-sm hover:bg-[#FDF8F3] hover:shadow transition"
      aria-label="Volver al panel de administración"
    >
      {label}
    </button>
  );
}
