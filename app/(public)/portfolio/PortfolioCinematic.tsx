"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import styles from "./portfolio.module.css";
import CinematicTeam from "./CinematicTeam";
import PortfolioDesignProcess from "@/components/public/portfolio/PortfolioDesignProcess";
import ContactSection from "@/components/public/landing-page/ContactSection";
import ReviewSection from "@/components/public/landing-page/ReviewSection";
import { ReviewResponseDTO } from "@/modules/review/review.dto";

/* ─── math helpers ─────────────────────────────────────────── */

const clamp = (v: number, lo: number, hi: number) =>
  Math.max(lo, Math.min(hi, v));

const smoothstep = (t: number) => t * t * (3 - 2 * t);

const ease = (t: number) =>
  t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

const lerp = (a: number, b: number, alpha: number) =>
  a + (b - a) * alpha;

/* ─── services data ──────────────────────────────────────────── */

const SERVICES = [
  { num: "01", title: "Home",        sub: "Renovation", img: "/assets/interior-assets/living-roo-after.png", slug: "home-renovation" },
  { num: "02", title: "Office",      sub: "Interior",   img: "/assets/interior-assets/office.png", slug: "office-interior" },
  { num: "03", title: "Kitchen",     sub: "Interior",   img: "/assets/ktichen-interior.png", slug: "kitchen-interior" },
  { num: "04", title: "Bedroom",     sub: "Interior",   img: "/assets/interior-assets/master-bedroom-after.png", slug: "bedroom-interior" },
  { num: "05", title: "Living Room", sub: "Interior",   img: "/assets/interior-assets/living-room-1.png", slug: "living-room-interior" },
];

const PROJECTS = [
  { num: "01", title: "Grand Villa Facade", sub: "Premium Architecture", img: "/assets/front-view.png", slug: "minimalist-villa-interior-noida" },
  { num: "02", title: "Modern Living Room", sub: "Warm Aesthetics", img: "/assets/interior-assets/living-room-3d-render.png", slug: "modern-3bhk-apartment-patna" },
  { num: "03", title: "Nordic Style Kitchen", sub: "Minimalist Function", img: "/assets/ktichen-interior.png", slug: "modern-3bhk-apartment-patna" },
  { num: "04", title: "Royal Master Bedroom", sub: "Luxury Living", img: "/assets/interior-assets/Master-Bedroom-3.png", slug: "modern-3bhk-apartment-patna" },
  { num: "05", title: "Aura Premium Bathroom", sub: "Bespoke Fittings", img: "/assets/interior-assets/premium-bathroom-after.png", slug: "modern-3bhk-apartment-patna" },
  { num: "06", title: "Corporate Office Lounge", sub: "Ergonomic & Modern", img: "/assets/interior-assets/office.png", slug: "luxury-office-interior-delhi" },
  { num: "07", title: "Minimalist Zen Bedroom", sub: "Tranquil Space", img: "/assets/interior-assets/3d-bedroom.png", slug: "boutique-cafe-interior-gurgaon" },
];

/* ─── component ─────────────────────────────────────────────── */

interface Props {
  reviews?: ReviewResponseDTO[];
}

export default function PortfolioCinematic({ reviews = [] }: Props) {

  /* ── cinematic scene refs ────────────────────────────────── */
  const scRef       = useRef<HTMLDivElement>(null);
  const frontRef    = useRef<HTMLImageElement>(null);
  const doorRef     = useRef<HTMLImageElement>(null);
  const interiorRef = useRef<HTMLImageElement>(null);
  const heroRef     = useRef<HTMLDivElement>(null);
  const splashRef   = useRef<HTMLDivElement>(null);
  const ambRef      = useRef<HTMLDivElement>(null);

  const entranceTextRef = useRef<HTMLDivElement>(null);
  const livingRef       = useRef<HTMLImageElement>(null);
  const livingTextRef   = useRef<HTMLDivElement>(null);
  const kitchenRef      = useRef<HTMLImageElement>(null);
  const kitchenTextRef  = useRef<HTMLDivElement>(null);
  const bedroomRef      = useRef<HTMLImageElement>(null);
  const bedroomTextRef  = useRef<HTMLDivElement>(null);

  /* ── services orbit refs ─────────────────────────────────── */
  const servRef      = useRef<HTMLElement>(null);
  const orbitWrapRef = useRef<HTMLDivElement>(null);
  const hovIdxRef    = useRef(-1);
  const cardRefs     = useRef<(HTMLDivElement | null)[]>([]);

  /* ── unified services & outro refs ───────────────────────── */
  const servBgRef         = useRef<HTMLImageElement>(null);
  const outroBgRef        = useRef<HTMLImageElement>(null);
  const flashRef          = useRef<HTMLDivElement>(null);
  const servHeaderRef     = useRef<HTMLDivElement>(null);
  const servScrollHintRef = useRef<HTMLDivElement>(null);
  const outroTextRef      = useRef<HTMLDivElement>(null);

  /* ── 3d showcase refs ────────────────────────────────────── */
  const projSectionRef    = useRef<HTMLElement>(null);
  const projRoomRef       = useRef<HTMLDivElement>(null);
  const projCardRefs      = useRef<(HTMLDivElement | null)[]>([]);
  const projTextRefs      = useRef<(HTMLDivElement | null)[]>([]);

  /* ══════════════════════════════════════════════════════════
     CINEMATIC SCROLL EFFECT
  ══════════════════════════════════════════════════════════ */
  useEffect(() => {
    let raf = 0;
    let displayP = 0;
    let targetP  = 0;
    const LERP_ALPHA = 0.15; // Increased to make the zoom and scroll animation much faster and snappier

    const render = () => {
      if (
        !scRef.current || !frontRef.current || !doorRef.current ||
        !interiorRef.current || !heroRef.current
      ) return;

      const max = scRef.current.offsetHeight - window.innerHeight;
      targetP  = clamp(window.scrollY / max, 0, 1);
      displayP = lerp(displayP, targetP, LERP_ALPHA);
      const p  = displayP;

      /* beats — mapped to user timeline for perfect orchestration */
      const heroHide = ease(clamp(p / 0.10, 0, 1));
      const zoom     = smoothstep(clamp((p - 0.10) / 0.30, 0, 1));
      const open     = ease(clamp((p - 0.35) / 0.15, 0, 1));
      const crossfade= smoothstep(clamp((p - 0.48) / 0.07, 0, 1));
      const enter    = smoothstep(clamp((p - 0.48) / 0.12, 0, 1));

      const entranceIn  = smoothstep(clamp((p - 0.52) / 0.04, 0, 1));
      const entranceOut = smoothstep(clamp((p - 0.61) / 0.03, 0, 1));
      const entranceT   = clamp(entranceIn - entranceOut, 0, 1);

      const livingSlide   = smoothstep(clamp((p - 0.63) / 0.07, 0, 1));
      const kitchenSlide  = smoothstep(clamp((p - 0.73) / 0.07, 0, 1));

      const livingTextIn  = smoothstep(clamp((p - 0.64) / 0.03, 0, 1));
      const livingTextOut = smoothstep(clamp((p - 0.71) / 0.03, 0, 1));
      const livingTextT   = clamp(livingTextIn - livingTextOut, 0, 1);

      const kitchenTextIn  = smoothstep(clamp((p - 0.74) / 0.03, 0, 1));
      const kitchenTextOut = smoothstep(clamp((p - 0.81) / 0.03, 0, 1));
      const kitchenTextT   = clamp(kitchenTextIn - kitchenTextOut, 0, 1);

      const bedroomSlide = smoothstep(clamp((p - 0.83) / 0.07, 0, 1));
      const bedroomText  = smoothstep(clamp((p - 0.85) / 0.03, 0, 1));

      /* HERO */
      heroRef.current.style.opacity   = `${1 - heroHide}`;
      heroRef.current.style.transform = `translateY(${heroHide * -40}px) scale(${1 + heroHide * 0.05})`;

      /* FRONT */
      const frontVisible = open < 0.99;
      frontRef.current.style.opacity    = frontVisible ? `${1 - open}` : "0";
      frontRef.current.style.visibility = frontVisible ? "visible" : "hidden";
      const cam = 1 + zoom * 2.4;
      frontRef.current.style.transform       = `scale(${cam}) translateY(${-zoom * 14}px)`;
      frontRef.current.style.filter          = `blur(${zoom * 1.2}px)`;
      frontRef.current.style.transformOrigin = "50% 72%";

      /* DOOR */
      const doorOpacity = (open > 0.01 ? 1 : 0) * (1 - crossfade);
      doorRef.current.style.visibility = doorOpacity > 0 ? "visible" : "hidden";
      doorRef.current.style.opacity    = `${doorOpacity}`;
      const frozenZoom = 1 + zoom * 5.8 + open * 1.8;
      doorRef.current.style.transform       = `scale(${frozenZoom}) translateY(${-zoom * 22}px)`;
      doorRef.current.style.transformOrigin = "50% 72%";
      doorRef.current.style.filter          = `blur(${(1 - open) * 0.5}px)`;

      /* SPLASH */
      if (splashRef.current) {
        const splashOpacity = open * (1 - crossfade);
        splashRef.current.style.opacity   = `${splashOpacity}`;
        splashRef.current.style.transform = `scale(${1 + crossfade * 0.4})`;
      }

      /* INTERIOR — slides left */
      const interiorVisible = crossfade > 0.01;
      interiorRef.current.style.opacity    = interiorVisible ? `${crossfade}` : "0";
      interiorRef.current.style.visibility = interiorVisible ? "visible" : "hidden";
      const iZoom = 1 + Math.min(enter, 1) * 0.14;
      interiorRef.current.style.transform = `translateX(${-livingSlide * 100}%) scale(${iZoom}) translateY(${-Math.min(enter, 1) * 8}px)`;
      interiorRef.current.style.filter    = `blur(${(1 - crossfade) * 1.8}px)`;
      interiorRef.current.style.transformOrigin = "50% 50%";

      /* ENTRANCE TEXT */
      if (entranceTextRef.current) {
        entranceTextRef.current.style.opacity    = `${entranceT}`;
        entranceTextRef.current.style.transform  = `translateX(${-livingSlide * 100}%) translateY(${(1 - entranceIn) * 50}px) scale(${1 + (1 - entranceIn) * 0.1})`;
        entranceTextRef.current.style.visibility = entranceT > 0.01 ? "visible" : "hidden";
      }

      /* LIVING ROOM */
      if (livingRef.current) {
        const lVisible = livingSlide > 0.005;
        livingRef.current.style.visibility = lVisible ? "visible" : "hidden";
        livingRef.current.style.opacity    = lVisible ? "1" : "0";
        livingRef.current.style.transform  = `translateX(${(1 - livingSlide) * 100 - kitchenSlide * 100}%)`;
        livingRef.current.style.filter     = "blur(0px)";
      }

      /* LIVING TEXT */
      if (livingTextRef.current) {
        livingTextRef.current.style.opacity    = `${livingTextT}`;
        livingTextRef.current.style.transform  = `translateX(${-kitchenSlide * 100}%) translateY(${(1 - livingTextIn) * 36}px)`;
        livingTextRef.current.style.visibility = livingTextT > 0.01 ? "visible" : "hidden";
      }

      /* KITCHEN — horizontal then UP */
      if (kitchenRef.current) {
        const kVisible = kitchenSlide > 0.005;
        kitchenRef.current.style.visibility = kVisible ? "visible" : "hidden";
        kitchenRef.current.style.opacity    = kVisible ? "1" : "0";
        kitchenRef.current.style.transform  = `translateX(${(1 - kitchenSlide) * 100}%) translateY(${-bedroomSlide * 100}%)`;
        kitchenRef.current.style.filter     = "blur(0px)";
      }

      /* KITCHEN TEXT — slides UP */
      if (kitchenTextRef.current) {
        kitchenTextRef.current.style.opacity    = `${kitchenTextT}`;
        kitchenTextRef.current.style.transform  = `translateY(${-bedroomSlide * 100}%) translateY(${(1 - kitchenTextIn) * 36}px)`;
        kitchenTextRef.current.style.visibility = kitchenTextT > 0.01 ? "visible" : "hidden";
      }

      /* BEDROOM — vertical slide from bottom */
      if (bedroomRef.current) {
        const bVisible = bedroomSlide > 0.005;
        bedroomRef.current.style.visibility = bVisible ? "visible" : "hidden";
        bedroomRef.current.style.opacity    = bVisible ? "1" : "0";
        bedroomRef.current.style.transform  = `translateY(${(1 - bedroomSlide) * 100}%)`;
        bedroomRef.current.style.filter     = "blur(0px)";
      }

      /* BEDROOM TEXT */
      if (bedroomTextRef.current) {
        bedroomTextRef.current.style.opacity    = `${bedroomText}`;
        bedroomTextRef.current.style.transform  = `translateY(${(1 - bedroomText) * 36}px)`;
        bedroomTextRef.current.style.visibility = bedroomText > 0.01 ? "visible" : "hidden";
      }

      /* AMBIENT GLOW */
      if (ambRef.current) {
        const gs = crossfade > 0 ? smoothstep(crossfade) : 0;
        ambRef.current.style.opacity = `${0.6 + gs * 0.4}`;
      }

      /* SECTION TRANSITION: next section late trigger */
      const sectionReveal = ease(clamp((p - 0.93) / 0.07, 0, 1));
      if (servRef.current) {
        servRef.current.style.opacity = `${sectionReveal}`;
        servRef.current.style.transform = `translateY(${80 - (sectionReveal * 80)}px)`;
      }

      if (Math.abs(targetP - displayP) > 0.0001) {
        raf = requestAnimationFrame(render);
      }
    };

    const onScroll = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(render); };
    render();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", render);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", render);
    };
  }, []);

  /* ══════════════════════════════════════════════════════════
     UNIFIED SERVICES ORBIT & OUTRO EFFECT
  ══════════════════════════════════════════════════════════ */
  useEffect(() => {
    const section = servRef.current;
    const wrap    = orbitWrapRef.current;
    const sBg     = servBgRef.current;
    const oBg     = outroBgRef.current;
    const flash   = flashRef.current;
    const header  = servHeaderRef.current;
    const hint    = servScrollHintRef.current;
    const txt     = outroTextRef.current;
    if (!section || !wrap || !sBg || !oBg || !flash) return;

    const N       = SERVICES.length;
    let raf       = 0;
    let running   = false;
    
    // Lerping variables
    let dispP     = 0;
    let targP     = 0;
    let dispRot   = 0;
    let targRot   = 0;
    const ALPHA   = 0.10;
    const RZ      = 160;

    const getRX = () => Math.min(wrap.offsetWidth * 0.44, 380);

    /* ── draw one frame ────────────────────────────────────── */
    const draw = () => {
      // Recalculate targP inside draw loop when running
      if (running) {
        const rect = section.getBoundingClientRect();
        const total = section.offsetHeight - window.innerHeight;
        if (total > 0) {
          targP = clamp(-rect.top / total, 0, 1);
        }
      }

      // Lerp the global scroll progress (0.0 to 1.0)
      dispP = lerp(dispP, targP, ALPHA);
      const p = dispP;

      // 1. Orbit Rotation (p = 0.0 to 0.55)
      const orbitProgress = clamp(p / 0.55, 0, 1);
      targRot = orbitProgress * Math.PI * 2;
      dispRot = lerp(dispRot, targRot, ALPHA * 1.2);

      // Fade out cards as we transition past the orbit phase (p = 0.55 to 0.65)
      const cardsFade = clamp((0.65 - p) / 0.10, 0, 1);
      wrap.style.opacity = `${cardsFade}`;
      wrap.style.transform = `scale(${lerp(0.85, 1.0, cardsFade)})`;
      wrap.style.visibility = cardsFade > 0.01 ? "visible" : "hidden";

      // Render individual card 3D transforms
      if (cardsFade > 0.01) {
        const rx  = getRX();
        const hov = hovIdxRef.current;
        cardRefs.current.forEach((card, i) => {
          if (!card) return;
          const angle  = dispRot + (2 * Math.PI / N) * i;
          const x      = rx  * Math.sin(angle);
          const z      = RZ  * Math.cos(angle);
          const depth  = (z + RZ) / (2 * RZ);
          const isHov  = hov === i;

          const baseScale = 0.58 + 0.48 * depth;
          const sc        = baseScale * (isHov ? 1.22 : 1.0);

          card.style.transform   = `translate(-50%,-50%) translate3d(${x}px,0px,${z}px) scale(${sc})`;
          card.style.opacity     = `${0.28 + 0.72 * depth}`;
          card.style.zIndex      = `${Math.round(depth * 100)}`;
          card.style.boxShadow   = isHov
            ? `0 0 40px rgba(249,115,22,.55), 0 0 80px rgba(249,115,22,.20)`
            : `0 8px 40px rgba(0,0,0,.50)`;
          card.style.borderColor = isHov
            ? `rgba(249,115,22,.75)`
            : `rgba(249,115,22,.22)`;
        });
      }

      // 2. Services Header & Scroll Hint Fade Out (p = 0.52 to 0.62)
      const headerFade = clamp((0.62 - p) / 0.10, 0, 1);
      if (header) {
        header.style.opacity    = `${headerFade}`;
        header.style.transform  = `translateY(${(1 - headerFade) * -20}px)`;
        header.style.visibility = headerFade > 0.01 ? "visible" : "hidden";
      }
      if (hint) {
        hint.style.opacity    = `${headerFade}`;
        hint.style.visibility = headerFade > 0.01 ? "visible" : "hidden";
      }

      // 3. Drawing Room Background Zoom Out (p = 0.52 to 0.70)
      const sBgProgress = clamp((p - 0.52) / 0.18, 0, 1);
      const sBgScale = lerp(1.0, 0.75, sBgProgress);
      const sBgBlur = sBgProgress * 1.5;
      sBg.style.transform = `scale(${sBgScale})`;
      sBg.style.filter = `blur(${sBgBlur}px)`;

      // 4. White Flash Overlay (p = 0.65 to 0.76)
      let flashOpacity = 0;
      if (p >= 0.65 && p < 0.70) {
        flashOpacity = (p - 0.65) / 0.05;
      } else if (p >= 0.70 && p <= 0.76) {
        flashOpacity = 1.0 - (p - 0.70) / 0.06;
      }
      flash.style.opacity = `${clamp(flashOpacity, 0, 1)}`;
      flash.style.visibility = flashOpacity > 0.005 ? "visible" : "hidden";

      // 5. Image Cross-Fade / Switch at Flash Peak (p = 0.70)
      const isVillaShowing = p >= 0.70;
      sBg.style.opacity = isVillaShowing ? "0" : "1";
      sBg.style.visibility = isVillaShowing ? "hidden" : "visible";
      oBg.style.opacity = isVillaShowing ? "1" : "0";
      oBg.style.visibility = isVillaShowing ? "visible" : "hidden";

      // 6. Villa Window Zoom Out (p = 0.70 to 1.0)
      const oBgProgress = clamp((p - 0.70) / 0.30, 0, 1);
      const oBgScale = lerp(6.0, 1.0, oBgProgress);
      const oBgBlur = (1.0 - oBgProgress) * 1.5;
      oBg.style.transform = `scale(${oBgScale})`;
      oBg.style.filter = `blur(${oBgBlur}px)`;

      // 7. Outro Text Fade In (p = 0.76 to 1.0)
      if (txt) {
        const textProgress = clamp((p - 0.76) / 0.19, 0, 1);
        const textOpacity = smoothstep(textProgress);
        const textY = lerp(36, 0, textProgress);
        txt.style.opacity    = `${textOpacity}`;
        txt.style.transform  = `translateY(${textY}px)`;
        txt.style.visibility = textOpacity > 0.01 ? "visible" : "hidden";
      }

      if (running && Math.abs(targP - dispP) > 0.0001) {
        raf = requestAnimationFrame(draw);
      }
    };

    /* ── scroll → update target progress ───────────────────── */
    const onScroll = () => {
      if (running) {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(draw);
      }
    };

    const io = new IntersectionObserver(([e]) => {
      running = e.isIntersecting;
      if (running) {
        raf = requestAnimationFrame(draw);
      } else {
        cancelAnimationFrame(raf);
      }
    }, { threshold: 0 });

    io.observe(section);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    /* ── drag to scroll logic ─────────────────────────────── */
    let isDragging = false;
    let hasDragged = false;
    let startX = 0;

    const onDragStart = (x: number) => {
      isDragging = true;
      hasDragged = false;
      startX = x;
      section.style.cursor = "grabbing";
    };

    const onDragMove = (x: number) => {
      if (!isDragging) return;
      const deltaX = x - startX;
      if (Math.abs(deltaX) > 5) {
        hasDragged = true;
      }
      window.scrollBy({ top: -deltaX * 1.5, behavior: "instant" });
      startX = x;
    };

    const onDragEnd = () => {
      isDragging = false;
      section.style.cursor = "grab";
      // Small delay before allowing clicks again so mouseup doesn't trigger click immediately
      setTimeout(() => { hasDragged = false; }, 50);
    };

    const handleTouchStart = (e: TouchEvent) => onDragStart(e.touches[0].clientX);
    const handleTouchMove = (e: TouchEvent) => onDragMove(e.touches[0].clientX);
    const handleMouseDown = (e: MouseEvent) => onDragStart(e.clientX);
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        onDragMove(e.clientX);
        e.preventDefault();
      }
    };
    const handleClick = (e: MouseEvent) => {
      if (hasDragged) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    section.style.cursor = "grab";
    section.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchend", onDragEnd);
    
    section.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove, { passive: false });
    window.addEventListener("mouseup", onDragEnd);
    section.addEventListener("click", handleClick, true);

    onScroll();

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);

      section.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", onDragEnd);
      section.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", onDragEnd);
      section.removeEventListener("click", handleClick, true);
    };
  }, []);

  /* ══════════════════════════════════════════════════════════
     HORIZONTAL SHOWCASE SCROLL & PARALLAX
  ══════════════════════════════════════════════════════════ */
  useEffect(() => {
    const section = projSectionRef.current;
    const track = projRoomRef.current; // reusing this ref as track
    if (!section || !track) return;

    let raf = 0;
    let dispP = 0;
    let targetP = 0;
    const ALPHA = 0.08;

    let mouseX = 0;
    let mouseY = 0;

    const render = () => {
      const rect = section.getBoundingClientRect();
      const startScroll = window.scrollY + rect.top;
      const scrollRange = section.offsetHeight - window.innerHeight;

      if (scrollRange > 0) {
        targetP = clamp((window.scrollY - startScroll) / scrollRange, 0, 1);
      }

      dispP = lerp(dispP, targetP, ALPHA);
      
      // Calculate max translation to scroll to the end of the track
      // Center the first card at 0%, center the last card at 100%
      const trackWidth = track.scrollWidth;
      const vw = window.innerWidth;
      
      // Maximum distance we need to shift the track left so the last card is centered
      const maxTx = trackWidth - vw; 
      
      const tx = -(dispP * maxTx);
      track.style.transform = `translate3d(${tx}px, 0, 0)`;

      // Loop over cards to calculate individual parallax and active states
      projCardRefs.current.forEach((card, i) => {
        if (!card) return;
        
        const cardRect = card.getBoundingClientRect();
        // Distance from center of screen
        const cardCenter = cardRect.left + cardRect.width / 2;
        const screenCenter = vw / 2;
        
        // Normalized distance (-1 to 1) roughly
        const distNorm = (cardCenter - screenCenter) / (vw / 2);
        
        // Scale boost when centered
        const absDist = Math.abs(distNorm);
        
        // Side cards shrink to 0.8, centered card grows to 1.25
        const scale = 0.8 + Math.max(0, 1 - absDist) * 0.45;
        
        // Slightly dim side cards to make center pop more
        const cardOpacity = 0.6 + Math.max(0, 1 - absDist) * 0.4;
        
        card.style.opacity = `${cardOpacity}`;
        card.style.filter = "none";
        
        // Inner image parallax (moves opposite to card relative to center)
        const imgWrap = card.querySelector(`.${styles.projCardImgWrap}`);
        const img = imgWrap?.querySelector('img');
        if (img) {
          const parallaxTx = distNorm * 40; // max 40px shift
          img.style.transform = `translate3d(${parallaxTx}px, 0, 0) scale(1.15)`;
        }
        
        // Subtle mouse tilt for all cards, but stronger for the centered one
        const tiltIntensity = Math.max(0, 1 - absDist) * 12;
        const tiltX = -mouseY * tiltIntensity;
        const tiltY = mouseX * tiltIntensity;

        card.style.transform = `scale(${scale}) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
      });

      // Handle synchronized Text block visibility
      projTextRefs.current.forEach((textBlock, i) => {
        if (!textBlock) return;
        const card = projCardRefs.current[i];
        if (!card) return;
        
        const cardRect = card.getBoundingClientRect();
        const cardCenter = cardRect.left + cardRect.width / 2;
        const screenCenter = vw / 2;
        const absDist = Math.abs(cardCenter - screenCenter);
        
        // Fade text in only for the card currently closest to center
        const op = clamp(1 - (absDist / 300), 0, 1);
        const textOp = smoothstep(op);
        const ty = (1 - textOp) * 20;

        textBlock.style.opacity = `${textOp}`;
        textBlock.style.transform = `translateY(${ty}px)`;
        textBlock.style.visibility = textOp > 0.01 ? "visible" : "hidden";
      });

      if (Math.abs(targetP - dispP) > 0.0001) {
        raf = requestAnimationFrame(render);
      }
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(render);
    };

    const onMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth) - 0.5;
      mouseY = (e.clientY / window.innerHeight) - 0.5;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(render);
    };

    render();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    window.addEventListener("mousemove", onMouseMove, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  /* ══════════════════════════════════════════════════════════
     AUTO SCROLL ON LOAD
  ══════════════════════════════════════════════════════════ */
  useEffect(() => {
    let animationFrameId = 0;
    let isUserScrolling = false;

    const handleUserInteraction = () => {
      isUserScrolling = true;
    };

    window.addEventListener("wheel", handleUserInteraction, { passive: true });
    window.addEventListener("touchstart", handleUserInteraction, { passive: true });
    window.addEventListener("keydown", handleUserInteraction, { passive: true });
    window.addEventListener("mousedown", handleUserInteraction, { passive: true });

    const timer = setTimeout(() => {
      if (!servRef.current) return;
      
      const targetY = servRef.current.offsetTop;
      let currentY = window.scrollY;

      const autoScroll = () => {
        if (isUserScrolling || !scRef.current) return;

        const maxScroll = scRef.current.offsetHeight - window.innerHeight;
        const currentP = currentY / maxScroll;

        // Fast speed until "Entrance Interior" appears, then normal cinematic speed
        if (currentP < 0.50) {
          currentY += 32; // Fast zoom speed
        } else {
          currentY += 12; // Normal walkthrough speed
        }

        if (currentY >= targetY) {
          window.scrollTo(0, targetY);
          return;
        }

        window.scrollTo(0, currentY);
        animationFrameId = requestAnimationFrame(autoScroll);
      };

      // Only start if we are at the top
      if (window.scrollY < 10) {
        animationFrameId = requestAnimationFrame(autoScroll);
      }
    }, 1500); // 1.5 seconds delay

    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("wheel", handleUserInteraction);
      window.removeEventListener("touchstart", handleUserInteraction);
      window.removeEventListener("keydown", handleUserInteraction);
      window.removeEventListener("mousedown", handleUserInteraction);
    };
  }, []);

  /* ══════════════════════════════════════════════════════════
     JSX
  ══════════════════════════════════════════════════════════ */
  return (
    <>
      {/* ── CINEMATIC STICKY SCROLL ─────────────────────────── */}
      <div ref={scRef} className={styles.sc}>
        <div className={styles.stage}>

          <div className={styles.lbTop} />
          <div className={styles.lbBot} />
          <div className={styles.backGlow} />
          <div className={styles.vignette} />
          <div className={styles.gridOverlay} />
          <div ref={ambRef}    className={styles.amb} />
          <div ref={splashRef} className={styles.splash} />

          <img ref={frontRef}    src="/assets/front-view.png"            className={styles.sceneImg} alt="" style={{ willChange: 'transform, opacity, filter' }} fetchPriority="high" decoding="sync" />
          <img ref={doorRef}     src="/assets/open-door-view.png"        className={styles.sceneImg} alt="" style={{ willChange: 'transform, opacity, filter' }} fetchPriority="high" decoding="sync" />
          <img ref={interiorRef} src="/assets/enterance-area.png"        className={styles.sceneImg} alt="" style={{ willChange: 'transform, opacity, filter' }} decoding="async" />
          <img ref={livingRef}   src="/assets/leaving-room-interior.png" className={styles.sceneImg} alt="" style={{ willChange: 'transform, opacity, filter' }} decoding="async" />
          <img ref={kitchenRef}  src="/assets/ktichen-interior.png"      className={styles.sceneImg} alt="" style={{ willChange: 'transform, opacity, filter' }} decoding="async" />
          <img ref={bedroomRef}  src="/assets/bed-room.png"              className={styles.sceneImg} alt="" style={{ willChange: 'transform, opacity, filter' }} decoding="async" />

          {/* labels */}
          <div ref={entranceTextRef} className={styles.centerLabel}>
            <div className={styles.clLineTop} /><div className={styles.clCategory}>Casa Chic Interior</div>
            <h2 className={styles.clTitle}>Entrance<br />Interior</h2>
            <div className={styles.clService}>Bespoke Foyer &middot; Warm Lighting &middot; Delhi NCR</div>
            <div className={styles.clLineBot} />
          </div>

          <div ref={livingTextRef} className={styles.centerLabel}>
            <div className={styles.clLineTop} /><div className={styles.clCategory}>Casa Chic Interior</div>
            <h2 className={styles.clTitle}>Living Room<br />Interior</h2>
            <div className={styles.clService}>Open-plan Living &middot; Curated Furniture &middot; Delhi NCR</div>
            <div className={styles.clLineBot} />
          </div>

          <div ref={kitchenTextRef} className={styles.centerLabel}>
            <div className={styles.clLineTop} /><div className={styles.clCategory}>Casa Chic Interior</div>
            <h2 className={styles.clTitle}>Kitchen<br />Interior</h2>
            <div className={styles.clService}>Custom Cabinetry &middot; Premium Countertops &middot; Delhi NCR</div>
            <div className={styles.clLineBot} />
          </div>

          <div ref={bedroomTextRef} className={styles.centerLabel}>
            <div className={styles.clLineTop} /><div className={styles.clCategory}>Casa Chic Interior</div>
            <h2 className={styles.clTitle}>Modern Bedroom<br />Interior</h2>
            <div className={styles.clService}>Luxury Bedroom &middot; Bespoke Design &middot; Delhi NCR</div>
            <div className={styles.clLineBot} />
          </div>

          {/* hero */}
          <div ref={heroRef} className={styles.ht}>
            <div className={styles.eyebrow}>CASA CHIC INTERIOR</div>
            <h1 className={styles.h1big}>
              <span className={styles.line1}>Transforming</span><br />
              <span className={styles.line2}>Spaces Into</span><br />
              <span className={styles.hl}>Experiences</span>
            </h1>
            <p className={styles.sub}>ENTER THE HOUSE</p>
          </div>

        </div>
      </div>

      {/* ── SERVICES ORBIT & OUTRO SECTION ─────────────────── */}
      <section ref={servRef} className={styles.serv}>

        {/* sticky stage */}
        <div className={styles.servStage}>

          {/* background images */}
          <img ref={servBgRef} src="/assets/drawingroom.png" className={styles.servBg} alt="" style={{ willChange: 'transform, opacity, filter' }} decoding="async" />
          <img ref={outroBgRef} src="/assets/front-view.png" className={styles.outroBg} alt="" style={{ willChange: 'transform, opacity, filter' }} decoding="async" />

          <div className={styles.servDim} />
          <div className={styles.vignette} />
          <div className={styles.lbTop} />
          <div className={styles.lbBot} />
          <div className={styles.gridOverlay} />

          {/* white flash overlay */}
          <div ref={flashRef} className={styles.flashOverlay} />

          {/* header */}
          <div ref={servHeaderRef} className={styles.servHeader}>
            <div className={styles.servEye}>OUR SERVICES</div>
            <h2 className={styles.servH2}>
              Spaces We&nbsp;<span className={styles.servHl}>Transform</span>
            </h2>
            <p className={styles.servNote}>Scroll to explore the orbit</p>
          </div>

          {/* 3-D orbit */}
          <div ref={orbitWrapRef} className={styles.orbitWrap}>
            {SERVICES.map((s, i) => (
              <div
                key={i}
                ref={el => { cardRefs.current[i] = el; }}
                className={styles.orbitCard}
                onMouseEnter={() => { hovIdxRef.current = i; }}
                onMouseLeave={() => { hovIdxRef.current = -1; }}
              >
                {/* Make card clickable */}
                <Link href={`/portfolio/${s.slug}`} className="absolute inset-0 z-10 w-full h-full flex flex-col justify-end" style={{ textDecoration: 'none' }}>
                  {/* image */}
                  <div className={styles.cardImgWrap}>
                    <img src={s.img} className={styles.cardImg} alt={s.title} />
                    <div className={styles.cardImgOverlay} />
                  </div>

                  {/* text body */}
                  <div className={styles.cardBody}>
                    <span className={styles.cardNum}>{s.num}</span>
                    <h3 className={styles.cardTitle}>{s.title}</h3>
                    <p  className={styles.cardSub}>{s.sub}</p>
                    <div className={styles.cardArrow}>→</div>
                  </div>
                </Link>
              </div>
            ))}
          </div>

          {/* scroll hint */}
          <div ref={servScrollHintRef} className={styles.servScrollHint}>
            <span className={styles.servScrollLine} />
            <span>Scroll</span>
            <span className={styles.servScrollLine} />
          </div>

          {/* outro overlay content */}
          <div ref={outroTextRef} className={styles.outroText}>
            <div className={styles.outroSub}>CASA CHIC INTERIOR</div>
            <h2 className={styles.outroTitle}>
              Your Vision.<br />Our Masterpiece.
            </h2>
            <p className={styles.outroDesc}>
              A seamless blend of luxury, functionality, and timeless aesthetics.
              Thank you for exploring our portfolio.
            </p>
            <div className={styles.scrollNextInfo}>
              <span>Scroll now to see latest projects</span>
              <div className={styles.scrollNextArrow}>↓</div>
            </div>
          </div>

        </div>
      </section>

      {/* ── HORIZONTAL SHOWCASE SCROLL ───────────────────────────── */}
      <section ref={projSectionRef} className={styles.proj}>
        <div className={styles.projStage}>
          <div ref={projRoomRef} className={styles.projTrack}>
            {/* PROJECTS */}
            {PROJECTS.map((proj, i) => (
              <div
                key={i}
                ref={(el) => { projCardRefs.current[i] = el; }}
                className={styles.projCard}
              >
                <Link href={`/portfolio/${proj.slug}`} className="block w-full h-full relative" style={{ textDecoration: 'none', color: 'inherit' }}>
                  {/* image */}
                  <div className={styles.projCardImgWrap}>
                    <img src={proj.img} className={styles.projCardImg} alt={proj.title} />
                    <div className={styles.projCardImgOverlay} />
                  </div>

                  {/* body */}
                  <div className={styles.projCardBody}>
                    <span className={styles.projCardNum}>{proj.num}</span>
                    <h3 className={styles.projCardTitle}>{proj.title}</h3>
                    <p className={styles.projCardSub}>{proj.sub}</p>
                  </div>
                </Link>
              </div>
            ))}
          </div>

          {/* Text details removed to prevent overlap */}
        </div>
      </section>

      {/* ── VIEW ALL PROJECTS CTA ─────────────────────────────── */}
      <section className="bg-[#050505] py-32 md:py-48 border-y border-white/5 relative overflow-hidden flex flex-col items-center justify-center text-center px-4 mt-8 md:mt-16">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(249,115,22,0.05)_0%,transparent_70%)] pointer-events-none" />
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight relative z-10" style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}>
          Looking for a specific <span className="text-orange-500">Design?</span>
        </h2>
        <p className="text-gray-400 mb-10 max-w-xl mx-auto text-base md:text-lg relative z-10">
          Skip the cinematic tour and jump straight into our complete portfolio. Filter by Residential, Commercial, Kitchen, Bedroom, and Renovation projects.
        </p>
        <Link 
          href="/portfolio/grid" 
          className="relative z-10 group inline-flex items-center gap-3 bg-orange-500 hover:bg-orange-400 text-black px-8 py-4 rounded-full font-bold tracking-[0.15em] uppercase transition-all duration-300 hover:scale-105 shadow-[0_0_30px_rgba(249,115,22,0.2)] hover:shadow-[0_0_40px_rgba(249,115,22,0.4)]"
        >
          View All Projects
          <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </section>

      {/* ── PROCESS SECTION ─────────────────────────────────── */}
      <PortfolioDesignProcess theme="dark" />

      {/* ── CINEMATIC TEAM SECTION ──────────────────────────── */}
      <CinematicTeam />

      {/* ── REVIEW SECTION ──────────────────────────────────── */}
      <ReviewSection reviews={reviews} theme="dark" />

      {/* ── CALL TO ACTION SECTION ──────────────────────────── */}
      <ContactSection theme="dark" />

    </>
  );
}