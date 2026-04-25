import Link from 'next/link'
import Image from 'next/image'
import {
  CheckCircle2, ArrowRight, Zap, Camera,
  Heart, MessageCircle, Bookmark, Clock
} from 'lucide-react'

const TICKER = [
  '15 MIN / SEMANA', 'CONTENIDO QUE VENDE', 'SIN AGENCIA',
  'POSTS LISTOS', 'INSTAGRAM FÁCIL', 'IA PARA TU NEGOCIO',
  'APROBÁS EN UN TAP', '7 DÍAS GRATIS', 'SIN TARJETA DE CRÉDITO',
]

export default function LandingPage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#d6d7d7] text-[#070708]">

      {/* ── NAV ── */}
      <nav className="sticky top-0 z-50 bg-[#070708]/95 backdrop-blur-md border-b border-white/[0.07]">
        <div className="max-w-6xl mx-auto px-5 h-[60px] flex items-center justify-between">
          <div className="bg-[#d6d7d7] rounded-xl px-3 py-1.5">
            <Image
              src="/logo-contentpilot.png"
              alt="ContentPilot"
              width={148}
              height={36}
              className="h-8 w-auto object-contain"
            />
          </div>
          <div className="flex items-center gap-1">
            <Link
              href="/login"
              className="text-sm font-medium text-white/50 hover:text-white transition-colors px-4 py-2"
            >
              Ingresar
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center gap-1.5 bg-[#fa133a] text-white text-sm font-bold px-4 py-2 rounded-lg hover:bg-[#d40d2e] transition-colors"
            >
              Empezá gratis
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative bg-[#070708] text-white overflow-hidden">

        {/* Ghost number decorativo */}
        <div
          className="absolute right-[-2vw] top-1/2 -translate-y-[55%] select-none pointer-events-none font-display font-black leading-none text-white/[0.035]"
          style={{ fontSize: 'clamp(220px, 38vw, 560px)' }}
          aria-hidden
        >
          15
        </div>

        {/* Glow rojo sutil */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#fa133a]/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative z-10 max-w-6xl mx-auto px-5 pt-20 pb-32 grid lg:grid-cols-[1fr_auto] gap-16 items-center">

          {/* Left */}
          <div>
            {/* Badge */}
            <div className="fade-up-1 inline-flex items-center gap-2 bg-[#fa133a]/10 border border-[#fa133a]/25 text-[#fa133a] text-[11px] font-black uppercase tracking-[0.14em] px-3.5 py-1.5 rounded-full mb-8">
              <Camera className="h-3 w-3" />
              Piloto automático para tu Instagram
            </div>

            {/* Headline */}
            <h1
              className="fade-up-2 font-display font-black leading-[1.05] tracking-tight mb-6"
              style={{ fontSize: 'clamp(44px, 7vw, 88px)' }}
            >
              Tu negocio,<br />
              <span className="text-[#fa133a]">posteando</span><br />
              solo.
            </h1>

            <p className="fade-up-3 text-white/50 text-lg max-w-md leading-relaxed mb-10">
              ContentPilot genera publicaciones reales para tu negocio cada semana.
              Vos solo aprobás, copiás y pegás en Instagram.{' '}
              <strong className="text-white/90 font-semibold">15 minutos y listo.</strong>
            </p>

            {/* CTAs */}
            <div className="fade-up-4 flex flex-col sm:flex-row gap-3 mb-12">
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 bg-[#fa133a] text-white font-bold text-base px-8 py-3.5 rounded-xl hover:bg-[#d40d2e] transition-all hover:scale-[1.02] shadow-lg shadow-[#fa133a]/20"
              >
                Probalo 7 días gratis
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="#como-funciona"
                className="inline-flex items-center justify-center gap-2 border border-white/15 text-white/80 font-semibold text-base px-8 py-3.5 rounded-xl hover:bg-white/5 hover:border-white/25 transition-all"
              >
                Ver cómo funciona
              </Link>
            </div>

            {/* Micro stats */}
            <div className="flex items-center divide-x divide-white/10">
              {[
                ['15 min', 'por semana'],
                ['3', 'versiones por post'],
                ['0', 'tecnicismos'],
              ].map(([val, label], i) => (
                <div key={label} className={i === 0 ? 'pr-6' : 'px-6'}>
                  <div className="font-display font-black text-2xl text-[#fa133a]">{val}</div>
                  <div className="text-[11px] text-white/35 mt-0.5 uppercase tracking-wide">{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: App preview flotante */}
          <div className="relative hidden lg:flex items-center justify-center w-[280px]">

            {/* Tarjeta principal — post preview */}
            <div className="float-card-a relative z-20 w-64 bg-white rounded-3xl overflow-hidden shadow-2xl shadow-black/60">
              {/* Header IG */}
              <div className="px-3 pt-3 pb-2 flex items-center gap-2.5 border-b border-gray-100">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#fa133a] to-[#ff6b35] flex items-center justify-center text-white text-[11px] font-black shadow-sm">
                  TN
                </div>
                <div>
                  <div className="text-[11px] font-bold text-gray-900">tu_negocio</div>
                  <div className="text-[9px] text-gray-400 flex items-center gap-1">
                    <Clock className="h-2 w-2" /> hace un momento
                  </div>
                </div>
                <div className="ml-auto">
                  <div className="w-1 h-1 rounded-full bg-gray-300 inline-block mx-0.5" />
                  <div className="w-1 h-1 rounded-full bg-gray-300 inline-block mx-0.5" />
                  <div className="w-1 h-1 rounded-full bg-gray-300 inline-block mx-0.5" />
                </div>
              </div>

              {/* Imagen del post */}
              <div className="w-full aspect-square bg-gradient-to-br from-[#fff0f3] via-[#ffd4dc] to-[#fa133a]/20 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[#fa133a]/5" />
                <Camera className="h-12 w-12 text-[#fa133a]/30" />
                <div className="absolute bottom-3 right-3 bg-black/40 backdrop-blur-sm text-white text-[9px] font-bold px-2 py-0.5 rounded-md">
                  1080 × 1080
                </div>
              </div>

              {/* Acciones */}
              <div className="px-3 py-2 flex items-center gap-3 text-gray-500">
                <Heart className="h-4.5 w-4.5 hover:text-[#fa133a] transition-colors cursor-pointer" />
                <MessageCircle className="h-4.5 w-4.5" />
                <Bookmark className="h-4.5 w-4.5 ml-auto" />
              </div>

              {/* Caption preview */}
              <div className="px-3 pb-2 space-y-1.5">
                <div className="h-2 bg-gray-100 rounded-full w-full" />
                <div className="h-2 bg-gray-100 rounded-full w-5/6" />
                <div className="h-2 bg-gray-100 rounded-full w-3/5" />
              </div>

              {/* Aprobar button */}
              <div className="px-3 pb-3">
                <div className="bg-[#fa133a] text-white text-[10px] font-black tracking-widest text-center py-2.5 rounded-xl shadow-sm shadow-[#fa133a]/30">
                  ✓ APROBAR PUBLICACIÓN
                </div>
              </div>
            </div>

            {/* Badge flotante superior */}
            <div className="float-card-b absolute -top-3 -left-10 z-30 bg-[#fa133a] text-white text-[10px] font-black uppercase tracking-wide px-3 py-1.5 rounded-full shadow-lg shadow-[#fa133a]/30 flex items-center gap-1.5">
              <Zap className="h-3 w-3" />
              Generado con IA
            </div>

            {/* Badge flotante inferior */}
            <div className="float-card-c absolute -bottom-2 -right-6 z-30 bg-white text-[#070708] text-[10px] font-bold px-3 py-1.5 rounded-full shadow-lg border border-gray-100 flex items-center gap-1.5">
              <span className="text-green-500">✓</span> Aprobado
            </div>
          </div>
        </div>

        {/* Diagonal bottom edge */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-[#fa133a]" style={{ clipPath: 'polygon(0 100%, 100% 0, 100% 100%)' }} />
      </section>

      {/* ── TICKER ── */}
      <div className="bg-[#fa133a] text-white py-3 overflow-hidden flex select-none">
        <div className="marquee-track flex items-center whitespace-nowrap gap-0">
          {[...TICKER, ...TICKER, ...TICKER].map((item, i) => (
            <span key={i} className="text-[11px] font-black uppercase tracking-[0.16em] px-6">
              {item}
              <span className="text-white/40 ml-6">◆</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── PROBLEMA ── */}
      <section className="py-20 bg-[#d6d7d7]">
        <div className="max-w-6xl mx-auto px-5">
          <div className="mb-12">
            <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#fa133a] mb-3">
              El problema
            </p>
            <h2
              className="font-display font-black leading-[1.1] max-w-2xl"
              style={{ fontSize: 'clamp(32px, 5vw, 56px)' }}
            >
              ¿Cuántas veces dijiste{' '}
              <em className="not-italic text-[#fa133a]">"mañana posteo"</em>
              {' '}y nunca pasó?
            </h2>
          </div>

          <div className="grid sm:grid-cols-3 gap-4 mb-6">
            {[
              { n: '01', emoji: '😩', text: 'No sabés qué escribir ni cómo empezar' },
              { n: '02', emoji: '⏰', text: 'No encontrás el tiempo para crear contenido' },
              { n: '03', emoji: '📱', text: 'Se te pasan semanas sin publicar nada' },
            ].map(({ n, emoji, text }) => (
              <div
                key={n}
                className="bg-[#070708] text-white rounded-2xl p-6 relative overflow-hidden hover-lift"
              >
                <div
                  className="absolute right-3 bottom-0 font-display font-black text-white/[0.06] leading-none select-none"
                  style={{ fontSize: '7rem' }}
                  aria-hidden
                >
                  {n}
                </div>
                <div className="text-4xl mb-4">{emoji}</div>
                <p className="font-bold text-lg text-white/90 leading-snug relative z-10">{text}</p>
              </div>
            ))}
          </div>

          {/* Insight card */}
          <div className="bg-white rounded-2xl p-6 flex items-start gap-4 border border-black/5 shadow-sm">
            <span className="text-3xl shrink-0">💡</span>
            <p className="text-[#070708]/80 text-lg leading-relaxed">
              No es falta de ganas. Es que crear contenido lleva tiempo, creatividad y constancia
              que un dueño de negocio no siempre tiene.{' '}
              <strong className="text-[#070708]">ContentPilot lo hace por vos.</strong>
            </p>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="bg-[#070708] text-white py-20">
        <div className="max-w-6xl mx-auto px-5">
          <div className="mb-12">
            <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#fa133a] mb-3">
              Cómo te ayuda
            </p>
            <h2
              className="font-display font-black leading-[1.1]"
              style={{ fontSize: 'clamp(32px, 5vw, 56px)' }}
            >
              Todo lo que necesitás,<br />
              <span className="text-[#fa133a]">sin tecnicismos.</span>
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { emoji: '⚡', title: 'Contenido automático cada semana', desc: 'Posts listos para tu rubro generados con IA entrenada en tu negocio, cada semana.' },
              { emoji: '🎯', title: '3 versiones para elegir', desc: 'Subís una foto, elegís entre 3 captions distintos. El que más suena a tu voz.' },
              { emoji: '👆', title: 'Aprobación en un tap', desc: 'Desde el celular: aprobás, rechazás o editás cada publicación sin complicaciones.' },
              { emoji: '📋', title: 'Copy-paste directo', desc: 'Copiás el texto y lo pegás en Instagram. La imagen ya viene con tu logo y colores.' },
              { emoji: '🕐', title: '15 minutos por semana', desc: 'Eso es todo. ContentPilot hace el resto mientras vos te dedicás a tu negocio.' },
              { emoji: '📐', title: 'Formato Instagram nativo', desc: 'Cuadrado 1080×1080, captions optimizados y hashtags para tu rubro, siempre.' },
            ].map(({ emoji, title, desc }) => (
              <div
                key={title}
                className="group border border-white/10 rounded-2xl p-5 hover:border-[#fa133a]/40 hover:bg-white/[0.03] transition-all cursor-default"
              >
                <div className="text-3xl mb-3">{emoji}</div>
                <h3 className="font-bold text-[15px] mb-2 text-white group-hover:text-[#fa133a] transition-colors">{title}</h3>
                <p className="text-sm text-white/45 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CÓMO FUNCIONA ── */}
      <section id="como-funciona" className="py-20 bg-[#d6d7d7]">
        <div className="max-w-4xl mx-auto px-5">
          <div className="text-center mb-14">
            <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#fa133a] mb-3">
              El proceso
            </p>
            <h2
              className="font-display font-black"
              style={{ fontSize: 'clamp(32px, 5vw, 56px)' }}
            >
              Tres pasos y listo.
            </h2>
          </div>

          <div className="space-y-4">
            {[
              {
                n: '01',
                title: 'Contás sobre tu negocio',
                desc: 'Nombre, rubro, tono de comunicación, colores y fotos. Cinco minutos y ContentPilot ya te conoce.',
                time: '5 min',
              },
              {
                n: '02',
                title: 'Recibís el contenido generado',
                desc: 'Cada semana te llegan publicaciones listas para aprobar. También podés crear una al instante subiendo una foto.',
                time: 'Automático',
              },
              {
                n: '03',
                title: 'Aprobás, copiás y pegás',
                desc: 'Desde el celular. Aprobás lo que te gusta, copiás el texto y lo subís a Instagram. Hecho.',
                time: '2 min/post',
              },
            ].map(({ n, title, desc, time }) => (
              <div
                key={n}
                className="bg-[#070708] text-white rounded-2xl px-6 py-7 flex gap-5 items-start relative overflow-hidden hover-lift"
              >
                {/* Ghost number */}
                <div
                  className="absolute right-3 bottom-0 font-display font-black text-white/[0.05] leading-none select-none"
                  style={{ fontSize: '8rem' }}
                  aria-hidden
                >
                  {n}
                </div>

                <div className="font-display font-black text-2xl text-[#fa133a] shrink-0 w-10 leading-none pt-0.5">
                  {n}
                </div>

                <div className="flex-1 relative z-10">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="text-lg font-bold leading-snug">{title}</h3>
                    <span className="shrink-0 bg-[#fa133a]/10 border border-[#fa133a]/20 text-[#fa133a] text-[10px] font-black uppercase tracking-wide px-2.5 py-1 rounded-full">
                      {time}
                    </span>
                  </div>
                  <p className="text-white/45 text-sm leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PLANES ── */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-5">
          <div className="text-center mb-14">
            <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#fa133a] mb-3">
              Precios
            </p>
            <h2
              className="font-display font-black mb-3"
              style={{ fontSize: 'clamp(32px, 5vw, 56px)' }}
            >
              Planes simples.
            </h2>
            <p className="text-[#070708]/45 text-lg">7 días gratis · Sin tarjeta de crédito</p>
          </div>

          <div className="grid sm:grid-cols-3 gap-5 items-start">
            {[
              {
                plan: 'Starter',
                precio: '$4.999',
                posts: '3 posts / semana',
                features: ['Contenido automático semanal', 'Modo manual (foto → caption)', 'Biblioteca de fotos', 'Edición de captions'],
                featured: false,
              },
              {
                plan: 'Growth',
                precio: '$8.999',
                posts: '5 posts / semana',
                features: ['Todo lo de Starter', 'Más publicaciones semanales', 'Generación prioritaria', 'Notificaciones push'],
                featured: true,
              },
              {
                plan: 'Pro',
                precio: '$14.999',
                posts: '7 posts / semana',
                features: ['Todo lo de Growth', 'Máxima frecuencia', 'Imagen con IA (pronto)', 'Soporte prioritario'],
                featured: false,
              },
            ].map(({ plan, precio, posts, features, featured }) => (
              <div
                key={plan}
                className={`rounded-2xl p-6 flex flex-col relative overflow-hidden ${
                  featured
                    ? 'bg-[#070708] text-white ring-2 ring-[#fa133a] shadow-2xl shadow-[#070708]/25 sm:-mt-4 sm:pb-10'
                    : 'bg-[#f4f4f4] text-[#070708]'
                }`}
              >
                {featured && (
                  <>
                    {/* Ghost POPULAR */}
                    <div
                      className="absolute -right-4 top-4 font-display font-black text-white/[0.04] leading-none rotate-90 select-none"
                      style={{ fontSize: '5rem' }}
                      aria-hidden
                    >
                      TOP
                    </div>
                    <div className="bg-[#fa133a] text-white text-[10px] font-black uppercase tracking-[0.16em] text-center py-1.5 rounded-lg mb-5">
                      Más elegido
                    </div>
                  </>
                )}

                <div className="mb-5">
                  <div className={`text-[11px] font-black uppercase tracking-[0.14em] mb-2 ${featured ? 'text-white/40' : 'text-[#070708]/35'}`}>
                    {plan}
                  </div>
                  <div
                    className="font-display font-black"
                    style={{ fontSize: 'clamp(26px, 4vw, 36px)' }}
                  >
                    {precio}
                  </div>
                  <div className={`text-xs mt-1 ${featured ? 'text-white/35' : 'text-[#070708]/35'}`}>
                    / mes · {posts}
                  </div>
                </div>

                <ul className="space-y-2.5 mb-6 flex-1">
                  {features.map(f => (
                    <li key={f} className={`flex items-start gap-2.5 text-sm ${featured ? 'text-white/75' : 'text-[#070708]/65'}`}>
                      <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5 text-[#fa133a]" />
                      {f}
                    </li>
                  ))}
                </ul>

                <Link
                  href="/register"
                  className={`block text-center text-sm font-bold py-3 rounded-xl transition-all hover:scale-[1.02] ${
                    featured
                      ? 'bg-[#fa133a] text-white hover:bg-[#d40d2e] shadow-lg shadow-[#fa133a]/25'
                      : 'bg-[#070708] text-white hover:bg-black/80'
                  }`}
                >
                  Empezá gratis
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section className="relative bg-[#fa133a] text-white py-24 overflow-hidden">
        {/* Ghost "CONTENT" de fondo */}
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
          aria-hidden
        >
          <span
            className="font-display font-black text-white/[0.07] whitespace-nowrap"
            style={{ fontSize: 'clamp(80px, 18vw, 220px)' }}
          >
            CONTENT
          </span>
        </div>

        <div className="relative z-10 max-w-3xl mx-auto px-5 text-center">
          <h2
            className="font-display font-black leading-[1.1] mb-6"
            style={{ fontSize: 'clamp(34px, 5.5vw, 68px)' }}
          >
            Menos tiempo en redes.<br />
            Más tiempo en tu negocio.
          </h2>
          <p className="text-white/65 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
            Más de 15 minutos semanales no deberías dedicarle a Instagram siendo dueño de un negocio.
            ContentPilot se encarga del resto.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-3 bg-white text-[#fa133a] font-black text-lg px-10 py-4 rounded-2xl hover:bg-white/92 transition-all hover:scale-[1.02] shadow-2xl shadow-[#c0000d]/25"
          >
            Probalo gratis por 7 días
            <ArrowRight className="h-5 w-5" />
          </Link>
          <p className="text-white/45 text-sm mt-4">Sin tarjeta · Cancelás cuando quieras</p>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-[#070708] text-white py-10">
        <div className="max-w-6xl mx-auto px-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-8">
            <div className="bg-[#d6d7d7] rounded-xl px-4 py-2">
              <Image
                src="/logo-contentpilot.png"
                alt="ContentPilot"
                width={140}
                height={36}
                className="h-8 w-auto object-contain"
              />
            </div>
            <div className="flex flex-col items-center sm:items-end gap-1.5">
              <p className="text-white/25 text-[11px] uppercase tracking-wide">Desarrollado por</p>
              <div className="bg-[#d6d7d7] rounded-xl px-4 py-2 opacity-70 hover:opacity-100 transition-opacity">
                <Image
                  src="/logo-trs.png"
                  alt="TRS Automatizaciones"
                  width={120}
                  height={30}
                  className="h-6 w-auto object-contain"
                />
              </div>
            </div>
          </div>

          <div className="border-t border-white/[0.08] pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-white/25 text-xs">
              © {new Date().getFullYear()} ContentPilot · Todos los derechos reservados
            </p>
            <div className="flex gap-5 text-xs text-white/25">
              <Link href="/login" className="hover:text-white/60 transition-colors">Ingresar</Link>
              <Link href="/register" className="hover:text-white/60 transition-colors">Registrarse</Link>
            </div>
          </div>
        </div>
      </footer>

    </div>
  )
}
