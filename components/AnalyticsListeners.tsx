// components/AnalyticsListeners.tsx
"use client";

import { useEffect } from "react";

export default function AnalyticsListeners() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      // 1) WhatsApp: cualquier <a> a wa.me o api.whatsapp.com
      const a = target.closest("a") as HTMLAnchorElement | null;
      if (a && typeof a.href === "string") {
        const href = a.href;
        const isWA =
          href.startsWith("https://wa.me/") ||
          href.startsWith("https://api.whatsapp.com/");
        if (isWA) {
          const ctx = a.dataset.gtagContext || "unknown";
          const pigId = a.dataset.gtagPigId || null;
          const pigName = a.dataset.gtagPigName || null;

          window.gtag?.("event", "select_content", {
            content_type: "whatsapp_cta",
            location: ctx, // ej: "adopciones_empty", "navbar", "pig_card", "pig_detail"
            item_id: pigId,
            item_name: pigName,
          });
        }
      }

      // 2) Botón "Cargar más"
      const btn = target.closest("[data-gtag='load_more']") as HTMLButtonElement | null;
      if (btn) {
        window.gtag?.("event", "load_more", {
          content_type: "adopciones",
        });
      }
    };

    // 3) Chips (filtros) — por data-attr
    const onChipClick = (e: Event) => {
      const tgt = e.target as HTMLElement;
      if (!tgt) return;
      const filter = tgt.getAttribute("data-gtag-sex-filter-value");
      if (filter) {
        window.gtag?.("event", "filter_change", {
          content_type: "adopciones",
          filter_type: "sex",
          filter_value: filter, // all | hembra | macho
        });
      }
    };

    document.addEventListener("click", onClick);
    document.addEventListener("click", onChipClick);
    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("click", onChipClick);
    };
  }, []);

  return null;
}
