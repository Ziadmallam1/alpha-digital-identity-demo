import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import {
  Mail, Phone, MapPin, Clock3, ShieldCheck, Building2, BriefcaseBusiness,
  Check, ArrowUpRight, UserPlus, MessageCircle, Sparkles
} from "lucide-react";
import Particles from "./Particles.jsx";
import { logoSrc, profileUrl } from "../data/employee.js";

/* ───────── helpers ───────── */
function Chars({ text }) {
  return text.split(" ").map((w, i) => (
    <span className="word" key={i}>
      {[...w].map((c, j) => <span className="ch" key={j}>{c}</span>)}
      {"\u00A0"}
    </span>
  ));
}

function Count({ to, suffix = "" }) {
  const el = useRef(null);
  useEffect(() => {
    const node = el.current;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) { node.textContent = to + suffix; return; }
    const o = { v: 0 };
    let tween;
    const io = new IntersectionObserver(([en]) => {
      if (!en.isIntersecting) return;
      io.disconnect();
      tween = gsap.to(o, { v: to, duration: 1.8, ease: "power2.out", onUpdate: () => (node.textContent = Math.round(o.v) + suffix) });
    }, { threshold: 0.4 });
    io.observe(node);
    return () => { io.disconnect(); tween && tween.kill(); };
  }, [to, suffix]);
  return <span ref={el}>0{suffix}</span>;
}

function Typer({ words }) {
  const [txt, setTxt] = useState("");
  useEffect(() => {
    let dead = false, i = 0, n = 0, del = false, t;
    const tick = () => {
      if (dead) return;
      const w = words[i % words.length];
      n += del ? -1 : 1;
      setTxt(w.slice(0, n));
      let d = del ? 35 : 80;
      if (!del && n === w.length) { del = true; d = 1500; }
      else if (del && n === 0) { del = false; i++; d = 350; }
      t = setTimeout(tick, d);
    };
    t = setTimeout(tick, 1600);
    return () => { dead = true; clearTimeout(t); };
  }, [words]);
  return <span className="typer">{txt}<i /></span>;
}

function vcard(e, slug) {
  const [first, ...rest] = e.name.split(" ");
  const lines = [
    "BEGIN:VCARD", "VERSION:3.0",
    `N:${rest.join(" ")};${first};;;`, `FN:${e.name}`,
    "ORG:Alpha Advisors", `TITLE:${e.title}`,
    `TEL;TYPE=CELL:${e.phone}`, `EMAIL:${e.email}`,
    `ADR;TYPE=WORK:;;${e.location};;;;`, `URL:${profileUrl(slug)}`, "END:VCARD"
  ];
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([lines.join("\r\n")], { type: "text/vcard" }));
  a.download = `${slug}.vcf`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
}

/* ───────── page ───────── */
export default function ProfilePage({ employee: e, slug }) {
  const root = useRef(null);
  const tel = e.phone.replaceAll(" ", "");
  const wa = tel.replace(/\D/g, "");

  useEffect(() => {
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const node = root.current;

    /* entrance timeline */
    const ctx = gsap.context(() => {
      if (reduce) { node.classList.add("static"); return; }
      gsap.timeline()
        .fromTo(node, { clipPath: "circle(0% at 50% 42%)" }, { clipPath: "circle(150% at 50% 42%)", duration: 1.2, ease: "power3.inOut", clearProps: "clipPath" })
        .fromTo(".topbar > *", { y: -24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, stagger: 0.12, ease: "power3.out" }, "-=0.6")
        .fromTo(".h1 .ch", { yPercent: 110, rotateX: -80, opacity: 0 }, { yPercent: 0, rotateX: 0, opacity: 1, duration: 0.9, stagger: 0.025, ease: "power4.out" }, "-=0.4")
        .fromTo(".hero-in", { y: 26, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power3.out" }, "-=0.6")
        .fromTo(".photo-wrap", { scale: 0.55, opacity: 0, rotate: -10 }, { scale: 1, opacity: 1, rotate: 0, duration: 1.4, ease: "elastic.out(1,.65)" }, "-=1.2")
        .fromTo(".chip", { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.7, stagger: 0.15, ease: "back.out(2.4)" }, "-=0.8");
    }, node);

    /* scroll reveal */
    const io = new IntersectionObserver((list) => {
      list.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
    }, { threshold: 0.18, rootMargin: "0px 0px -40px 0px" });
    node.querySelectorAll(".rv").forEach((n) => io.observe(n));

    /* spotlight on cards */
    const spot = (ev) => {
      const t = ev.target.closest && ev.target.closest(".spot");
      if (!t) return;
      const r = t.getBoundingClientRect();
      t.style.setProperty("--mx", `${ev.clientX - r.left}px`);
      t.style.setProperty("--my", `${ev.clientY - r.top}px`);
    };
    node.addEventListener("pointermove", spot);

    /* 3D tilt on portrait */
    const photo = node.querySelector(".photo-wrap");
    const hero = node.querySelector(".hero");
    const tilt = (ev) => {
      if (reduce) return;
      const r = hero.getBoundingClientRect();
      const x = (ev.clientX - r.left) / r.width - 0.5, y = (ev.clientY - r.top) / r.height - 0.5;
      gsap.to(photo, { rotateY: x * 14, rotateX: -y * 14, duration: 0.8, ease: "power3.out", overwrite: "auto" });
    };
    const untilt = () => gsap.to(photo, { rotateY: 0, rotateX: 0, duration: 1, ease: "elastic.out(1,.6)" });
    hero.addEventListener("pointermove", tilt);
    hero.addEventListener("pointerleave", untilt);

    /* subtle parallax of aurora with scroll */
    const onScroll = () => node.style.setProperty("--sy", String(window.scrollY));
    addEventListener("scroll", onScroll, { passive: true });

    return () => {
      ctx.revert(); io.disconnect();
      node.removeEventListener("pointermove", spot);
      hero.removeEventListener("pointermove", tilt);
      hero.removeEventListener("pointerleave", untilt);
      removeEventListener("scroll", onScroll);
    };
  }, []);

  const marquee = [...e.specialties, e.department, e.title];

  return (
    <div className="profile-root" ref={root}>
      {/* animated background */}
      <div className="bg" aria-hidden="true">
        <i className="blob b1" /><i className="blob b2" /><i className="blob b3" />
        <div className="grid" />
      </div>
      <Particles className="bg-particles" />

      <header className="topbar">
        <img src={logoSrc} alt="Alpha Advisors" />
        <span className="verified"><b className="dot" /> Verified professional</span>
      </header>

      {/* HERO */}
      <section className="hero">
        <div className="hero-copy">
          <small className="eyebrow hero-in"><i /> ALPHA ADVISORS · DIGITAL IDENTITY</small>
          <h1 className="h1">
            <span className="line"><Chars text="Meet the person" /></span>
            <span className="line gold"><Chars text="behind the expertise." /></span>
          </h1>
          <h2 className="name hero-in">{e.name}</h2>
          <p className="role hero-in">{e.title} <i>/</i> {e.department}</p>
          <p className="spec hero-in"><Sparkles size={14} /> Specializing in <Typer words={e.specialties} /></p>
          <p className="bio hero-in">{e.bio}</p>
          <div className="meta hero-in">
            <span><MapPin size={15} />{e.location}</span>
            <span><Clock3 size={15} />{e.years}+ years experience</span>
          </div>
          <div className="cta hero-in">
            <button className="btn gold-btn" onClick={() => vcard(e, slug)}><UserPlus size={16} /> Save contact</button>
            <a className="btn ghost" href={`tel:${tel}`}><Phone size={16} /> Call</a>
            <a className="btn ghost" href={`mailto:${e.email}`}><Mail size={16} /> Email</a>
          </div>
        </div>

        <div className="photo-stage">
          <div className="photo-wrap">
            <div className="ring-clip"><div className="ring-spin" /></div>
            <div className="photo"><img src={e.portrait} alt={e.name} /><i className="shine" /></div>
            <div className="orbit o1"><i /></div>
            <div className="orbit o2"><i /></div>
            <span className="chip c1"><Check size={13} /> ID verified</span>
            <span className="chip c2"><Clock3 size={13} /> {e.years}+ yrs</span>
            <span className="chip c3"><MapPin size={13} /> Cairo</span>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="stats">
        <div className="stat rv" style={{ "--d": "0s" }}><b><Count to={e.years} suffix="+" /></b><small>YEARS OF EXPERIENCE</small></div>
        <div className="stat rv" style={{ "--d": ".12s" }}><b><Count to={e.specialties.length} /></b><small>CORE SPECIALTIES</small></div>
        <div className="stat rv" style={{ "--d": ".24s" }}><b className="id">{e.employeeId}</b><small>EMPLOYEE ID</small></div>
      </section>

      {/* MARQUEE */}
      <div className="marquee" aria-hidden="true">
        <div className="track">
          {[0, 1].map((k) => (
            <div className="seq" key={k}>
              {marquee.map((m, i) => <span key={i}>{m}<Sparkles size={16} /></span>)}
              {marquee.map((m, i) => <span key={"b" + i}>{m}<Sparkles size={16} /></span>)}
            </div>
          ))}
        </div>
      </div>

      {/* CONTACT */}
      <section className="details">
        <small className="eyebrow gold rv">PROFESSIONAL DETAILS</small>
        <h2 className="sec rv" style={{ "--d": ".08s" }}>Get in <em>touch.</em></h2>
        <div className="detail-grid">
          <a className="dcard spot rv" style={{ "--d": ".05s" }} href={`mailto:${e.email}`}><Mail /><small>EMAIL</small><b>{e.email}</b><ArrowUpRight className="arr" /></a>
          <a className="dcard spot rv" style={{ "--d": ".15s" }} href={`tel:${tel}`}><Phone /><small>PHONE</small><b>{e.phone}</b><ArrowUpRight className="arr" /></a>
          <a className="dcard spot rv" style={{ "--d": ".25s" }} href={`https://wa.me/${wa}`} target="_blank" rel="noreferrer"><MessageCircle /><small>WHATSAPP</small><b>Send a message</b><ArrowUpRight className="arr" /></a>
          <div className="dcard spot rv" style={{ "--d": ".35s" }}><Building2 /><small>OFFICE</small><b>{e.location}</b></div>
        </div>
      </section>

      {/* EXPERTISE */}
      <section className="expertise">
        <div>
          <small className="eyebrow gold rv">AREAS OF EXPERTISE</small>
          <h2 className="sec rv" style={{ "--d": ".08s" }}>Knowledge that<br /><em>moves business forward.</em></h2>
        </div>
        <div className="ex-list">
          {e.specialties.map((s, i) => (
            <article className="ex spot rv" style={{ "--d": `${i * 0.14}s` }} key={s}>
              <span>0{i + 1}</span><b>{s}</b><ArrowUpRight size={18} /><i className="bar" />
            </article>
          ))}
        </div>
      </section>

      <footer className="pfoot rv">
        <img src={logoSrc} alt="Alpha Advisors" />
        <span>Legal and Tax Consultants</span>
        <small><ShieldCheck size={13} /> Professional identity, reimagined</small>
      </footer>

      {/* mobile dock */}
      <nav className="dock">
        <button onClick={() => vcard(e, slug)}><UserPlus size={18} /> Save</button>
        <a href={`tel:${tel}`}><Phone size={18} /> Call</a>
        <a href={`mailto:${e.email}`}><Mail size={18} /> Email</a>
      </nav>
    </div>
  );
}
