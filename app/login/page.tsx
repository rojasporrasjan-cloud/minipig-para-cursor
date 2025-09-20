"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
} from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase/client";
import { ensureUserDoc } from "@/lib/firebase/firestore";
import { signInWithRedirect, getRedirectResult } from "firebase/auth";



/**
 * Login/Registro — "Yo Tengo un Mini Pig Costa Rica"
 * - Diseño premium (glassmorphism, split layout, dark mode, íconos)
 * - Google + Email/Password (login y registro)
 * - Persistencia local de sesión
 * - Reset de contraseña por email
 * - Redirección post-auth vía ?from=/ruta (sanitizada; fallback /panel)
 * - Creación de perfil en Firestore (users/{uid}) en background (no bloquea)
 */
export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Redirección segura (evita open-redirects)
  const next = useMemo(() => {
    const raw = searchParams.get("from") || "/panel";
    return sanitizeNext(raw);
  }, [searchParams]);

  // Modo: login o signup
  const [mode, setMode] = useState<"login" | "signup">("login");

  // Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // Solo registro
  const [name, setName] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [showPwd2, setShowPwd2] = useState(false);

  // UI state
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  // Persistencia + sesión
  
useEffect(() => {
  let unsub = () => {};
  (async () => {
    try {
      await setPersistence(auth, browserLocalPersistence);
    } catch (e) {
      console.warn("Persistencia no establecida (no crítico):", e);
    }

    // 👉 Manejar resultado de redirect (si venimos de signInWithRedirect)
    try {
      const redirectCred = await getRedirectResult(auth);
      if (redirectCred?.user) {
        // Asegura perfil en background (como ya lo haces)
        (async () => {
          try {
            await ensureUserDoc({
              uid: redirectCred.user.uid,
              displayName: redirectCred.user.displayName,
              email: redirectCred.user.email,
              photoURL: redirectCred.user.photoURL,
              providerId: redirectCred.user.providerData?.[0]?.providerId || "google.com",
            });
          } catch (err) {
            console.warn("ensureUserDoc (redirect) error:", err);
          }
        })();
        router.replace(next);
        return; // Ya autenticó por redirect
      }
    } catch (err) {
      console.warn("getRedirectResult error:", err);
    }

    // Observa sesión si no vino por redirect
    unsub = onAuthStateChanged(auth, (user) => {
      if (user) router.replace(next);
      else setLoading(false);
    });
  })();

  return () => unsub();
}, [router, next]);


  /* ---------- Handlers ---------- */

  // Google (login/registro)
  
const handleGoogle = async () => {
  setError(null);
  setNotice(null);
  setSubmitting(true);
  try {
    const cred = await signInWithPopup(auth, googleProvider);
    (async () => {
      try {
        await ensureUserDoc({
          uid: cred.user.uid,
          displayName: cred.user.displayName,
          email: cred.user.email,
          photoURL: cred.user.photoURL,
          providerId: cred.user.providerData?.[0]?.providerId || "google.com",
        });
      } catch (err) {
        console.warn("ensureUserDoc error:", err);
      }
    })();
    router.replace(next);
  } catch (e: any) {
    // 👇 Fallback automático
    if (
      e?.code === "auth/popup-blocked" ||
      e?.code === "auth/popup-closed-by-user" ||
      e?.code === "auth/network-request-failed"
    ) {
      try {
        await signInWithRedirect(auth, googleProvider);
        // La página se redirige; al volver, useEffect con getRedirectResult lo resolverá
        return;
      } catch (err) {
        console.error("Redirect fallback error:", err);
      }
    }
    console.error("Auth error:", e?.code, e);
    setError(normalizeFirebaseError(e));
  } finally {
    setSubmitting(false);
  }
};


  // Login con Email/Password
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setNotice(null);
    try {
      const cred = await signInWithEmailAndPassword(auth, email.trim(), password);

      // Crear/asegurar perfil en Firestore en background (no bloquea)
      (async () => {
        try {
          await ensureUserDoc({
            uid: cred.user.uid,
            displayName: cred.user.displayName,
            email: cred.user.email,
            photoURL: cred.user.photoURL,
            providerId: cred.user.providerData?.[0]?.providerId || "password",
          });
        } catch (err: any) {
          console.warn("ensureUserDoc error:", err?.code || err?.message || err);
        }
      })();

      router.replace(next);
    } catch (e: any) {
      console.error("Auth error:", e?.code, e);
      setError(normalizeFirebaseError(e));
    } finally {
      setSubmitting(false);
    }
  };

  // Registro con Email/Password
  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setNotice(null);

    const em = email.trim();
    const nm = name.trim();

    if (!nm) {
      setSubmitting(false);
      setError("Ingresa tu nombre.");
      return;
    }
    if (password.length < 6) {
      setSubmitting(false);
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    if (password !== confirm) {
      setSubmitting(false);
      setError("Las contraseñas no coinciden.");
      return;
    }

    try {
      const cred = await createUserWithEmailAndPassword(auth, em, password);
      try {
        await updateProfile(cred.user, { displayName: nm });
      } catch (err) {
        console.warn("No se pudo actualizar displayName:", err);
      }

      // Crear/asegurar perfil en Firestore en background (no bloquea)
      (async () => {
        try {
          await ensureUserDoc({
            uid: cred.user.uid,
            displayName: nm || cred.user.displayName,
            email: cred.user.email,
            photoURL: cred.user.photoURL,
            providerId: "password",
          });
        } catch (err: any) {
          console.warn("ensureUserDoc error:", err?.code || err?.message || err);
        }
      })();

      router.replace(next);
    } catch (e: any) {
      console.error("Signup error:", e?.code, e);
      setError(normalizeFirebaseError(e));
    } finally {
      setSubmitting(false);
    }
  };

  // Reset de contraseña
  const handleResetPassword = async () => {
    const em = email.trim();
    if (!em) {
      setError("Escribe tu correo para enviarte el enlace de recuperación.");
      return;
    }
    setSubmitting(true);
    setError(null);
    setNotice(null);
    try {
      await sendPasswordResetEmail(auth, em);
      setNotice("Te enviamos un correo con instrucciones para recuperar tu contraseña.");
    } catch (e: any) {
      setError(normalizeFirebaseError(e));
    } finally {
      setSubmitting(false);
    }
  };

  /* ---------- Render ---------- */

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center bg-gradient-to-br from-rose-50 via-rose-100 to-pink-50 text-gray-700 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900 dark:text-slate-200">
        <div className="flex items-center gap-3 text-sm">
          <div className="h-2 w-2 animate-pulse rounded-full bg-rose-500" />
          Cargando…
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-pink-light/30 via-brand-background to-white">
      {/* Elementos decorativos de fondo */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -left-20 h-96 w-96 rounded-full bg-gradient-to-br from-brand-pink-light/40 to-brand-pink/30 blur-3xl animate-pulse" />
        <div className="absolute -bottom-20 -right-20 h-96 w-96 rounded-full bg-gradient-to-tl from-brand-pink/20 to-brand-pink-light/40 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-64 w-64 rounded-full bg-brand-pink/10 blur-2xl" />
      </div>

      <div className="relative mx-auto grid min-h-screen max-w-7xl grid-cols-1 overflow-hidden lg:grid-cols-2">
        {/* Lado visual mejorado */}
        <aside className="relative hidden items-center justify-center lg:flex p-12">
          <div className="relative w-full max-w-lg">
            {/* Fondo decorativo */}
            <div className="absolute inset-0 bg-gradient-to-br from-brand-pink-light/60 to-brand-pink/40 rounded-3xl blur-2xl" />
            
            {/* Contenido principal */}
            <div className="relative bg-white/90 backdrop-blur-xl border border-white/20 rounded-3xl p-12 shadow-2xl">
              <div className="text-center space-y-8">
                {/* Logo y título */}
                <div className="space-y-4">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-pink to-brand-pink-dark flex items-center justify-center mx-auto shadow-2xl">
                    <span className="text-3xl text-white">🐷</span>
                  </div>
                  <div>
                    <h1 className="text-3xl font-black text-brand-dark mb-2">
                      Yo Tengo un <span className="text-brand-pink">Mini Pig</span>
                    </h1>
                    <p className="text-brand-text-muted font-medium">Costa Rica</p>
                  </div>
                </div>

                {/* Características */}
                <div className="space-y-6">
                  <div className="flex items-center gap-4 text-left">
                    <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                      <span className="text-xl">✅</span>
                    </div>
                    <div>
                      <p className="font-bold text-brand-dark">Mini pigs certificados</p>
                      <p className="text-sm text-brand-text-muted">Criados con amor y cuidado</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 text-left">
                    <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                      <span className="text-xl">🏡</span>
                    </div>
                    <div>
                      <p className="font-bold text-brand-dark">Acompañamiento completo</p>
                      <p className="text-sm text-brand-text-muted">Te guiamos en cada paso</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 text-left">
                    <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                      <span className="text-xl">💝</span>
                    </div>
                    <div>
                      <p className="font-bold text-brand-dark">Garantía de salud</p>
                      <p className="text-sm text-brand-text-muted">Controles veterinarios incluidos</p>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 pt-6 border-t border-brand-border">
                  <div className="text-center">
                    <p className="text-2xl font-black text-brand-pink">120+</p>
                    <p className="text-xs text-brand-text-muted">Familias felices</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-black text-brand-pink">5★</p>
                    <p className="text-xs text-brand-text-muted">Calificación</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-black text-brand-pink">24/7</p>
                    <p className="text-xs text-brand-text-muted">Soporte</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Elementos flotantes */}
            <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full bg-brand-pink/20 backdrop-blur-sm border border-brand-pink/30 flex items-center justify-center animate-bounce" style={{ animationDelay: '0.5s' }}>
              <span className="text-2xl">💕</span>
            </div>
            
            <div className="absolute -bottom-4 -left-4 w-12 h-12 rounded-full bg-brand-pink-light/30 backdrop-blur-sm border border-brand-pink-light/50 flex items-center justify-center animate-bounce" style={{ animationDelay: '1.5s' }}>
              <span className="text-lg">🌟</span>
            </div>

            <div className="relative z-10 flex h-full flex-col p-10 text-white">
              <BrandHeader invert />
              <div className="mt-auto">
                <h2 className="text-3xl font-bold drop-shadow-sm md:text-4xl">
                  Mini pigs felices, <br className="hidden md:block" />
                  familias más felices 🐷💗
                </h2>
                <p className="mt-3 max-w-md text-white/90">
                  Gestiona consultas, reservas y perfiles de tus mini cerditos con una experiencia rápida y segura.
                </p>
                <ul className="mt-6 space-y-2 text-white/90">
                  <li className="flex items-center gap-2">
                    <Dot /> Autenticación segura con Google y correo
                  </li>
                  <li className="flex items-center gap-2">
                    <Dot /> Datos protegidos con Firebase
                  </li>
                  <li className="flex items-center gap-2">
                    <Dot /> Acceso directo a tu panel
                  </li>
                </ul>
              </div>
            </div>

            <div className="absolute right-6 top-6 opacity-20 md:right-8 md:top-8">
              <IconPig className="h-16 w-16 md:h-24 md:w-24" />
            </div>
          </div>
        </aside>

        {/* Card principal */}
        <main className="flex items-center justify-center p-6 md:p-10">
          <div className="w-full max-w-md rounded-3xl bg-white/90 backdrop-blur-xl border border-white/20 p-8 shadow-2xl">
            {/* Header del formulario */}
            <div className="text-center mb-8 lg:hidden">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-pink to-brand-pink-dark flex items-center justify-center mx-auto shadow-lg mb-4">
                <span className="text-2xl text-white">🐷</span>
              </div>
              <h2 className="text-lg font-bold text-brand-dark">Yo Tengo un Mini Pig</h2>
            </div>

            {/* Título y tabs mejorados */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-black text-brand-dark mb-2">
                {mode === "login" ? "¡Bienvenido de vuelta!" : "Únete a nosotros"}
              </h1>
              <p className="text-brand-text-muted">
                {mode === "login" 
                  ? "Accede a tu panel de Mini Pig" 
                  : "Crea tu cuenta y forma parte de nuestra comunidad"}
              </p>
            </div>

            {/* Tabs mejorados */}
            <div className="grid grid-cols-2 rounded-2xl bg-brand-pink-light/20 p-1 mb-8">
              <button
                type="button"
                onClick={() => {
                  setMode("login");
                  setError(null);
                  setNotice(null);
                }}
                className={`rounded-xl px-4 py-3 text-sm font-bold transition-all duration-300 ${
                  mode === "login"
                    ? "bg-white shadow-lg text-brand-dark transform scale-105"
                    : "text-brand-text-muted hover:text-brand-dark"
                }`}
              >
                Iniciar sesión
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode("signup");
                  setError(null);
                  setNotice(null);
                }}
                className={`rounded-xl px-4 py-3 text-sm font-bold transition-all duration-300 ${
                  mode === "signup"
                    ? "bg-white shadow-lg text-brand-dark transform scale-105"
                    : "text-brand-text-muted hover:text-brand-dark"
                }`}
              >
                Crear cuenta
              </button>
            </div>

            {/* Alertas */}
            <div className="mt-4 space-y-3">
              {error && (
                <div className="rounded-lg border border-red-200/70 bg-red-50/80 p-3 text-sm text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-200">
                  {error}
                </div>
              )}
              {notice && (
                <div className="rounded-lg border border-emerald-200/70 bg-emerald-50/80 p-3 text-sm text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-200">
                  {notice}
                </div>
              )}
            </div>

            {/* Google mejorado */}
            <button
              onClick={handleGoogle}
              disabled={submitting}
              className="mt-6 group relative overflow-hidden inline-flex w-full items-center justify-center gap-3 rounded-2xl bg-white hover:bg-gray-50 border border-gray-200 px-6 py-4 text-sm font-bold text-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
              aria-label="Continuar con Google"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-50 via-red-50 to-yellow-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <IconGoogle className="relative z-10 h-6 w-6" />
              <span className="relative z-10">
                {submitting ? "Conectando…" : "Continuar con Google"}
              </span>
            </button>

            {/* Separador mejorado */}
            <div className="my-8 flex items-center">
              <span className="h-px flex-1 bg-gradient-to-r from-transparent via-brand-border to-brand-border" />
              <span className="px-4 text-xs font-semibold uppercase tracking-wider text-brand-text-muted bg-white rounded-full">
                o con correo
              </span>
              <span className="h-px flex-1 bg-gradient-to-l from-transparent via-brand-border to-brand-border" />
            </div>

            {/* Formularios */}
            {mode === "login" ? (
              <form onSubmit={handleEmailLogin} className="space-y-4">
                <Field label="Correo electrónico">
                  <WithIcon icon={<IconMail className="h-4 w-4" />}>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full rounded-xl border border-gray-300/70 bg-white/80 pl-10 pr-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 shadow-sm outline-none transition focus:border-rose-300 focus:ring-2 focus:ring-rose-200 dark:border-white/10 dark:bg-white/5 dark:text-slate-100 dark:placeholder:text-gray-500 dark:focus:border-pink-400/40 dark:focus:ring-pink-400/20"
                      placeholder="tu@correo.com"
                      autoComplete="email"
                      inputMode="email"
                    />
                  </WithIcon>
                </Field>

                <Field label="Contraseña">
                  <div className="relative">
                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
                      <IconLock className="h-4 w-4" />
                    </span>
                    <input
                      type={showPwd ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                      className="w-full rounded-xl border border-gray-300/70 bg-white/80 pl-10 pr-20 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 shadow-sm outline-none transition focus:border-rose-300 focus:ring-2 focus:ring-rose-200 dark:border-white/10 dark:bg-white/5 dark:text-slate-100 dark:placeholder:text-gray-500 dark:focus:border-pink-400/40 dark:focus:ring-pink-400/20"
                      placeholder="********"
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPwd((s) => !s)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg px-2 py-1 text-xs text-gray-600 transition hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/10"
                      aria-label={showPwd ? "Ocultar contraseña" : "Mostrar contraseña"}
                      tabIndex={-1}
                    >
                      {showPwd ? "Ocultar" : "Ver"}
                    </button>
                  </div>
                  <div className="mt-2 text-right">
                    <button
                      type="button"
                      onClick={handleResetPassword}
                      disabled={submitting}
                      className="text-xs font-medium text-rose-600 hover:underline disabled:opacity-60 dark:text-pink-300"
                    >
                      ¿Olvidaste tu contraseña?
                    </button>
                  </div>
                </Field>

                <button
                  type="submit"
                  disabled={submitting}
                  className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-rose-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-rose-600/20 transition hover:bg-rose-700 hover:shadow-rose-700/25 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-pink-500 dark:hover:bg-pink-600"
                >
                  {submitting ? "Entrando…" : "Entrar"}
                </button>

                <p className="pt-2 text-center text-xs text-gray-500 dark:text-gray-400">
                  ¿No tienes cuenta?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setMode("signup");
                      setError(null);
                      setNotice(null);
                    }}
                    className="font-medium text-rose-600 hover:underline dark:text-pink-300"
                  >
                    Regístrate
                  </button>
                </p>
              </form>
            ) : (
              <form onSubmit={handleEmailSignup} className="space-y-4">
                <Field label="Nombre">
                  <WithIcon icon={<IconUser className="h-4 w-4" />}>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full rounded-xl border border-gray-300/70 bg-white/80 pl-10 pr-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 shadow-sm outline-none transition focus:border-rose-300 focus:ring-2 focus:ring-rose-200 dark:border-white/10 dark:bg-white/5 dark:text-slate-100 dark:placeholder:text-gray-500 dark:focus:border-pink-400/40 dark:focus:ring-pink-400/20"
                      placeholder="Tu nombre"
                      autoComplete="name"
                    />
                  </WithIcon>
                </Field>

                <Field label="Correo electrónico">
                  <WithIcon icon={<IconMail className="h-4 w-4" />}>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full rounded-xl border border-gray-300/70 bg-white/80 pl-10 pr-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 shadow-sm outline-none transition focus:border-rose-300 focus:ring-2 focus:ring-rose-200 dark:border-white/10 dark:bg-white/5 dark:text-slate-100 dark:placeholder:text-gray-500 dark:focus:border-pink-400/40 dark:focus:ring-pink-400/20"
                      placeholder="tu@correo.com"
                      autoComplete="email"
                      inputMode="email"
                    />
                  </WithIcon>
                </Field>

                <Field label="Contraseña">
                  <div className="relative">
                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
                      <IconLock className="h-4 w-4" />
                    </span>
                    <input
                      type={showPwd ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                      className="w-full rounded-xl border border-gray-300/70 bg-white/80 pl-10 pr-20 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 shadow-sm outline-none transition focus:border-rose-300 focus:ring-2 focus:ring-rose-200 dark:border-white/10 dark:bg-white/5 dark:text-slate-100 dark:placeholder:text-gray-500 dark:focus:border-pink-400/40 dark:focus:ring-pink-400/20"
                      placeholder="Mínimo 6 caracteres"
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPwd((s) => !s)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg px-2 py-1 text-xs text-gray-600 transition hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/10"
                      aria-label={showPwd ? "Ocultar contraseña" : "Mostrar contraseña"}
                      tabIndex={-1}
                    >
                      {showPwd ? "Ocultar" : "Ver"}
                    </button>
                  </div>
                </Field>

                <Field label="Confirmar contraseña">
                  <div className="relative">
                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
                      <IconLock className="h-4 w-4" />
                    </span>
                    <input
                      type={showPwd2 ? "text" : "password"}
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                      required
                      minLength={6}
                      className="w-full rounded-xl border border-gray-300/70 bg-white/80 pl-10 pr-20 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 shadow-sm outline-none transition focus:border-rose-300 focus:ring-2 focus:ring-rose-200 dark:border-white/10 dark:bg-white/5 dark:text-slate-100 dark:placeholder:text-gray-500 dark:focus:border-pink-400/40 dark:focus:ring-pink-400/20"
                      placeholder="Repite tu contraseña"
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPwd2((s) => !s)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg px-2 py-1 text-xs text-gray-600 transition hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/10"
                      aria-label={showPwd2 ? "Ocultar contraseña" : "Mostrar contraseña"}
                      tabIndex={-1}
                    >
                      {showPwd2 ? "Ocultar" : "Ver"}
                    </button>
                  </div>
                </Field>

                <button
                  type="submit"
                  disabled={submitting}
                  className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-rose-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-rose-600/20 transition hover:bg-rose-700 hover:shadow-rose-700/25 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-pink-500 dark:hover:bg-pink-600"
                >
                  {submitting ? "Creando cuenta…" : "Crear cuenta"}
                </button>

                <p className="pt-2 text-center text-xs text-gray-500 dark:text-gray-400">
                  ¿Ya tienes cuenta?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setMode("login");
                      setError(null);
                      setNotice(null);
                    }}
                    className="font-medium text-rose-600 hover:underline dark:text-pink-300"
                  >
                    Inicia sesión
                  </button>
                </p>
              </form>
            )}

            <p className="mt-6 text-center text-[11px] text-gray-500 dark:text-gray-400">
              Al continuar aceptas los Términos y la Política de Privacidad
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}

/* ---------- Utilidades ---------- */

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-slate-200">{label}</label>
      {children}
    </div>
  );
}

function WithIcon({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="relative">
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
        {icon}
      </span>
      <div>{children}</div>
    </div>
  );
}

function sanitizeNext(value: string): string {
  if (!value.startsWith("/")) return "/panel";
  if (value.startsWith("//")) return "/panel";
  if (/^https?:\/\//i.test(value)) return "/panel";
  return value || "/panel";
}

function normalizeFirebaseError(e: any): string {
  const code = e?.code as string | undefined;
  switch (code) {
    case "auth/invalid-email":
      return "El correo no es válido. (auth/invalid-email)";
    case "auth/missing-password":
      return "Ingresa tu contraseña. (auth/missing-password)";
    case "auth/user-disabled":
      return "La cuenta está deshabilitada. (auth/user-disabled)";
    case "auth/user-not-found":
    case "auth/wrong-password":
      return "Correo o contraseña incorrectos. (auth/wrong-password)";
    case "auth/email-already-in-use":
      return "Este correo ya está registrado. Inicia sesión o usa otro. (auth/email-already-in-use)";
    case "auth/weak-password":
      return "La contraseña es muy débil. Usa al menos 6 caracteres. (auth/weak-password)";
    case "auth/operation-not-allowed":
      return "Email/Password no está habilitado en Firebase. (auth/operation-not-allowed)";
    case "auth/unauthorized-domain":
      return "Dominio no autorizado en Firebase Authentication. (auth/unauthorized-domain)";
    case "auth/network-request-failed":
      return "Error de red. Abre el preview en pestaña nueva y revisa tu conexión/AdBlock. (auth/network-request-failed)";
    case "permission-denied":
      return "Sin permisos para Firestore. Revisa reglas y habilitación. (permission-denied)";
    case "unavailable":
      return "Servicio no disponible temporalmente. Intenta de nuevo. (unavailable)";
    default:
      return `Ocurrió un error. Intenta de nuevo.${code ? ` (${code})` : ""}`;
  }
}

/* ---------- Componentes visuales (inline) ---------- */

function BrandHeader({ invert = false }: { invert?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <span
        className={`grid h-10 w-10 place-items-center rounded-xl shadow-sm ring-1 ${
          invert
            ? "bg-white/20 ring-white/40"
            : "bg-rose-100 ring-rose-200 dark:bg-white/10 dark:ring-white/10"
        }`}
      >
        <IconPig className={invert ? "h-6 w-6 text-white" : "h-6 w-6 text-rose-600 dark:text-pink-300"} />
      </span>
      <div>
        <h1 className={`text-xl font-semibold ${invert ? "text-white" : "text-gray-900 dark:text-slate-100"}`}>
          Yo Tengo un Mini Pig
        </h1>
        <p className={`${invert ? "text-white/85" : "text-gray-500 dark:text-gray-400"} text-xs`}>
          {`${
            typeof window !== "undefined" && window?.location?.pathname?.includes("/login")
              ? "Inicia sesión o crea tu cuenta"
              : "Inicia sesión para continuar"
          }`}
        </p>
      </div>
    </div>
  );
}

function Dot() {
  return <span className="inline-block h-2 w-2 rounded-full bg-white/90"></span>;
}

function IconGoogle({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#EA4335"
        d="M12 10.2v3.9h5.4c-.2 1.3-1.6 3.7-5.4 3.7-3.2 0-5.8-2.6-5.8-5.8S8.8 6.2 12 6.2c1.8 0 3 .7 3.7 1.4l2.6-2.5C16.8 3.6 14.6 2.7 12 2.7 6.9 2.7 2.8 6.8 2.8 11.9S6.9 21 12 21c6 0 9.2-4.2 9.2-8.1 0-.5 0-.9-.1-1.3H12z"
      />
    </svg>
  );
}

function IconMail({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M3 7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v.3l-9 5.4-9-5.4V7Z" className="stroke-current" strokeWidth="1.5" />
      <path d="M21 8.5V17a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8.5" className="stroke-current" strokeWidth="1.5" />
    </svg>
  );
}

function IconLock({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="4" y="10" width="16" height="10" rx="2" className="stroke-current" strokeWidth="1.5" />
      <path d="M8 10V8a4 4 0 1 1 8 0v2" className="stroke-current" strokeWidth="1.5" />
    </svg>
  );
}

function IconUser({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="8" r="4" className="stroke-current" strokeWidth="1.5" />
      <path d="M4 20a8 8 0 0 1 16 0" className="stroke-current" strokeWidth="1.5" />
    </svg>
  );
}

function IconPig({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <path d="M10 30c0-8 8-16 22-16s22 8 22 16c3 0 6 4 6 8s-3 8-6 8c-2 8-13 10-22 10S12 56 10 46c-3 0-6-4-6-8s3-8 6-8Z" fill="currentColor" />
      <circle cx="26" cy="30" r="2.5" fill="#fff" />
      <circle cx="38" cy="30" r="2.5" fill="#fff" />
      <rect x="27" y="36" width="10" height="6" rx="3" fill="#fff" />
    </svg>
  );
}
