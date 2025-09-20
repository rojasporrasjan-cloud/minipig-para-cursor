"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  DocumentData,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import PigCard from "@/components/PigCard";
import CardSkeleton from "@/components/CardSkeleton";
import { Pig } from "@/lib/types/pig";

/* ================== Config ================== */
const PAGE_SIZE = 9;
const WHATSAPP_NUMBER = "50672752645";

/* ================== Tipos locales ================== */
type SexFilter = "todos" | "macho" | "hembra";
type StatusFilter = "todos" | "disponible" | "reservado" | "vendido";
type SortKey = "recent" | "price-asc" | "price-desc" | "age-asc" | "age-desc";

/* ================== Página ================== */
export default function AdopcionesPage() {
  const [items, setItems] = useState<Pig[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filtros UI (cliente)
  const [sexFilter, setSexFilter] = useState<SexFilter>("todos");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("todos");
  const [qText, setQText] = useState("");
  const [minAge, setMinAge] = useState<number>(0);   // meses
  const [maxAge, setMaxAge] = useState<number>(60);  // meses
  const [minPrice, setMinPrice] = useState<number | "">("");
  const [maxPrice, setMaxPrice] = useState<number | "">("");
  const [sort, setSort] = useState<SortKey>("recent");

  // Infinite scroll
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  /* ======= Firestore fetch (paginado) ======= */
  const fetchPigs = useCallback(
    async (lastVisible: QueryDocumentSnapshot<DocumentData> | null = null) => {
      if (!lastVisible) {
        // reset de primera página
        setLoading(true);
        setItems([]);
      }
      setError(null);

      try {
        // Mostrar TODOS los públicos (disponibles, reservados, vendidos)
        let q = query(
          collection(db, "pigs"),
          where("visibility", "==", "public"),
          orderBy("createdAt", "desc"),
          limit(PAGE_SIZE)
        );

        if (lastVisible) {
          q = query(q, startAfter(lastVisible));
        }

        const snap = await getDocs(q);
        const newPage = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Pig));

        setItems((prev) => (lastVisible ? [...prev, ...newPage] : newPage));
        setLastDoc(snap.docs.length > 0 ? snap.docs[snap.docs.length - 1] : null);
        setHasMore(snap.docs.length === PAGE_SIZE);
      } catch (e: any) {
        console.error("Error fetching pigs:", e);
        setError("No se pudieron cargar los cerditos. Revisa tus reglas de Firestore.");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Primera carga
  useEffect(() => {
    fetchPigs();
  }, [fetchPigs]);

  // Infinite Scroll (observa el sentinel)
  useEffect(() => {
    if (!hasMore || loading) return;
    const el = sentinelRef.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting) {
          fetchPigs(lastDoc);
        }
      },
      { rootMargin: "400px 0px 0px 0px", threshold: 0.01 }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [hasMore, loading, lastDoc, fetchPigs]);

  /* ======= Filtrado + Orden (cliente) ======= */
  const filtered = useMemo(() => {
    let list = [...items];

    // Búsqueda por nombre/desc
    if (qText.trim()) {
      const ql = qText.toLowerCase();
      list = list.filter((p) => {
        const name = (p.name || "").toLowerCase();
        const desc = (p.description || "").toLowerCase();
        const sex = (p.sex || "").toLowerCase();
        return name.includes(ql) || desc.includes(ql) || sex.includes(ql);
      });
    }

    // Sexo
    if (sexFilter !== "todos") {
      list = list.filter((p) => p.sex === sexFilter);
    }

    // Estado
    if (statusFilter !== "todos") {
      list = list.filter((p) => (p.status || "disponible") === statusFilter);
    }

    // Edad (meses) - si no hay edad, no excluye
    list = list.filter((p) => {
      const m = (p as any).ageMonths;
      if (typeof m !== "number") return true;
      return m >= minAge && m <= maxAge;
    });

    // Precio (si existe priceCRC como number)
    list = list.filter((p) => {
      const price = (p as any).priceCRC;
      if (minPrice !== "" && typeof price === "number" && price < minPrice) return false;
      if (maxPrice !== "" && typeof price === "number" && price > maxPrice) return false;
      return true;
    });

    // Orden
    switch (sort) {
      case "price-asc":
        list.sort((a, b) => ((a as any).priceCRC || 0) - ((b as any).priceCRC || 0));
        break;
      case "price-desc":
        list.sort((a, b) => ((b as any).priceCRC || 0) - ((a as any).priceCRC || 0));
        break;
      case "age-asc":
        list.sort((a, b) => ((a as any).ageMonths || 0) - ((b as any).ageMonths || 0));
        break;
      case "age-desc":
        list.sort((a, b) => ((b as any).ageMonths || 0) - ((a as any).ageMonths || 0));
        break;
      case "recent":
      default:
        // ya vienen por createdAt desc desde Firestore
        break;
    }

    return list;
  }, [items, qText, sexFilter, statusFilter, minAge, maxAge, minPrice, maxPrice, sort]);

  const resetFilters = () => {
    setQText("");
    setSexFilter("todos");
    setStatusFilter("todos");
    setMinAge(0);
    setMaxAge(60);
    setMinPrice("");
    setMaxPrice("");
    setSort("recent");
  };

  const loadMore = () => {
    if (hasMore && !loading) fetchPigs(lastDoc);
  };

  /* ======= Render ======= */
  return (
    <main>
      {/* Hero mejorado */}
      <section className="relative py-20 overflow-hidden bg-gradient-to-br from-brand-pink-light/30 via-brand-background to-white">
        {/* Elementos decorativos */}
        <div className="absolute inset-0">
          <div className="absolute -top-20 -left-20 h-96 w-96 rounded-full bg-gradient-to-br from-brand-pink-light/40 to-brand-pink/30 blur-3xl animate-pulse" />
          <div className="absolute -bottom-20 -right-20 h-96 w-96 rounded-full bg-gradient-to-tl from-brand-pink/20 to-brand-pink-light/40 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <div className="relative mx-auto max-w-7xl px-4">
          <div className="text-center space-y-8">
            {/* Badge superior */}
            <div className="inline-flex items-center gap-2 rounded-full bg-brand-pink-light/50 border border-brand-pink-light px-4 py-2 text-sm font-medium text-brand-dark">
              <span className="flex h-2 w-2 rounded-full bg-brand-pink animate-pulse"></span>
              Centro de Adopciones
            </div>

            {/* Título principal */}
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-black text-brand-dark">
                Encuentra tu 
                <span className="bg-gradient-to-r from-brand-pink to-brand-pink-dark bg-clip-text text-transparent"> Mini Pig</span>
                <span className="block text-3xl md:text-4xl mt-2 opacity-90">perfecto</span>
              </h1>
              <p className="text-xl md:text-2xl text-brand-text-muted max-w-3xl mx-auto leading-relaxed">
                Conoce a todos nuestros mini pigs: disponibles para adopción, reservados y los que ya encontraron su hogar feliz.
              </p>
            </div>

            {/* Stats de adopciones */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <div className="text-center space-y-2">
                <div className="text-2xl md:text-3xl font-bold text-brand-pink">{items.length}</div>
                <div className="text-sm text-brand-text-muted font-medium">Mini Pigs</div>
              </div>
              <div className="text-center space-y-2">
                <div className="text-2xl md:text-3xl font-bold text-brand-pink">
                  {items.filter(p => p.status === 'disponible').length}
                </div>
                <div className="text-sm text-brand-text-muted font-medium">Disponibles</div>
              </div>
              <div className="text-center space-y-2">
                <div className="text-2xl md:text-3xl font-bold text-brand-pink">
                  {items.filter(p => p.status === 'vendido').length}
                </div>
                <div className="text-sm text-brand-text-muted font-medium">Adoptados</div>
              </div>
              <div className="text-center space-y-2">
                <div className="text-2xl md:text-3xl font-bold text-brand-pink">100%</div>
                <div className="text-sm text-brand-text-muted font-medium">Garantía</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-10">
        {/* Controles de filtrado */}
        <section className="rounded-xl border border-brand-border bg-white/90 p-4">
        <div className="grid gap-3 md:grid-cols-4">
          {/* Buscar */}
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-brand-text-muted mb-1">Buscar</label>
            <input
              type="text"
              value={qText}
              onChange={(e) => setQText(e.target.value)}
              placeholder="Buscar por nombre, descripción o sexo"
              className="input-style"
            />
          </div>

          {/* Sexo */}
          <div>
            <label className="block text-xs font-semibold text-brand-text-muted mb-1">Sexo</label>
            <div className="flex flex-wrap gap-2">
              {(["todos", "macho", "hembra"] as SexFilter[]).map((sx) => (
                <button
                  key={sx}
                  onClick={() => setSexFilter(sx)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-full transition ${
                    sexFilter === sx ? "bg-brand-pink text-white" : "bg-white hover:bg-brand-pink-light"
                  }`}
                >
                  {sx[0].toUpperCase() + sx.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Estado */}
          <div>
            <label className="block text-xs font-semibold text-brand-text-muted mb-1">Estado</label>
            <div className="flex flex-wrap gap-2">
              {(["todos", "disponible", "reservado", "vendido"] as StatusFilter[]).map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-full transition ${
                    statusFilter === st ? "bg-brand-pink text-white" : "bg-white hover:bg-brand-pink-light"
                  }`}
                >
                  {st[0].toUpperCase() + st.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Rango de edad y precio */}
        <div className="mt-4 grid gap-3 md:grid-cols-4">
          {/* Edad */}
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-brand-text-muted mb-1">Edad (meses)</label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                min={0}
                max={120}
                value={minAge}
                onChange={(e) => setMinAge(Math.max(0, Number(e.target.value)))}
                className="input-style"
                placeholder="Mín"
              />
              <input
                type="number"
                min={0}
                max={120}
                value={maxAge}
                onChange={(e) => setMaxAge(Math.max(minAge, Number(e.target.value)))}
                className="input-style"
                placeholder="Máx"
              />
            </div>
          </div>

          {/* Precio (si existe) */}
          <div>
            <label className="block text-xs font-semibold text-brand-text-muted mb-1">Precio mín (CRC)</label>
            <input
              type="number"
              min={0}
              value={minPrice === "" ? "" : minPrice}
              onChange={(e) => setMinPrice(e.target.value === "" ? "" : Math.max(0, Number(e.target.value)))}
              className="input-style"
              placeholder="0"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-brand-text-muted mb-1">Precio máx (CRC)</label>
            <input
              type="number"
              min={0}
              value={maxPrice === "" ? "" : maxPrice}
              onChange={(e) => setMaxPrice(e.target.value === "" ? "" : Math.max(0, Number(e.target.value)))}
              className="input-style"
              placeholder="—"
            />
          </div>
        </div>

        {/* Orden + Reset */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-brand-text-muted">Ordenar por</label>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="input-style"
            >
              <option value="recent">Más recientes</option>
              <option value="price-asc">Precio (menor a mayor)</option>
              <option value="price-desc">Precio (mayor a menor)</option>
              <option value="age-asc">Edad (menor a mayor)</option>
              <option value="age-desc">Edad (mayor a menor)</option>
            </select>
          </div>

          <button onClick={resetFilters} className="btn-outline-pig text-sm px-4 py-2">
            Limpiar filtros
          </button>

          <div className="ml-auto text-sm text-brand-text-muted">
            {filtered.length} resultado{filtered.length === 1 ? "" : "s"}
          </div>
        </div>
      </section>

      {/* Contenido */}
      <section className="mt-8">
        {/* Cargando primera página */}
        {loading && items.length === 0 && (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="text-center py-10 rounded-lg bg-red-50 border border-red-200 text-red-700">
            {error}
          </div>
        )}

        {/* Vacío (sin resultados tras filtrar) */}
        {!loading && !error && filtered.length === 0 && (
          <div className="text-center py-12 rounded-lg bg-white/90 border border-brand-border">
            <p className="text-lg font-semibold text-brand-dark">
              No se encontraron cerditos con esos criterios.
            </p>
            <p className="text-sm text-brand-text-muted mt-1">
              Prueba ajustando los filtros o escríbenos por WhatsApp y te ayudamos.
            </p>
            <div className="mt-4 flex items-center justify-center gap-2">
              <button onClick={resetFilters} className="btn-outline-pig">
                Limpiar filtros
              </button>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                  "Hola 👋, ¿me ayudas a encontrar el mini pig ideal para mí?"
                )}&utm_source=adopciones&utm_medium=whatsapp&utm_campaign=adoptions_help`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-pig"
              >
                WhatsApp
              </a>
            </div>
          </div>
        )}

        {/* Grid */}
        {!error && filtered.length > 0 && (
          <>
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((pig) => (
                <PigCard key={pig.id} pig={pig as any} />
              ))}
            </div>

            {/* Botón cargar más (respaldo a infinite scroll) */}
            {hasMore && (
              <div className="mt-12 flex justify-center">
                <button onClick={loadMore} disabled={loading} className="btn-outline-pig">
                  {loading ? "Cargando..." : "Cargar más"}
                </button>
              </div>
            )}

            {/* Sentinel para infinite scroll */}
            <div ref={sentinelRef} className="h-1 w-full" />
          </>
        )}
        </section>
      </div>
    </main>
  );
}
