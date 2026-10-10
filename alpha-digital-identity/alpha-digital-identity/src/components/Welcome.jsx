import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import Particles from "./Particles.jsx";
import { logoSrc } from "../data/employee.js";

const DURATION = 5; // مدة شاشة الترحيب بالثواني

export default function Welcome({ name, onDone }) {
  const root = useRef(null);
  const tlRef = useRef(null);
  const finished = useRef(false);

  const finish = () => {
    if (finished.current) return;
    finished.current = true;
    onDone();
  };

  useEffect(() => {
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      const t = setTimeout(finish, 2500);
      return () => clearTimeout(t);
    }
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ onComplete: finish });
      tlRef.current = tl;
      tl.fromTo(".w-rings i", { scale: 0.2, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.6, stagger: 0.2, ease: "expo.out" }, 0)
        .fromTo(".w-logo", { y: 24, opacity: 0, scale: 0.8 }, { y: 0, opacity: 1, scale: 1, duration: 0.9, ease: "back.out(1.7)" }, 0.2)
        .fromTo(".w-kicker", { opacity: 0, letterSpacing: "1.1em" }, { opacity: 1, letterSpacing: "0.5em", duration: 1.1, ease: "power3.out" }, 0.7)
        .fromTo(".w-name .ch", { y: 40, rotateX: -90, opacity: 0, filter: "blur(10px)" }, { y: 0, rotateX: 0, opacity: 1, filter: "blur(0px)", duration: 0.9, stagger: 0.04, ease: "power4.out" }, 1)
        .fromTo(".w-profile", { opacity: 0, y: 18, clipPath: "inset(0 100% 0 0)" }, { opacity: 1, y: 0, clipPath: "inset(0 0% 0 0)", duration: 0.9, ease: "power3.inOut" }, 1.9)
        .fromTo(".w-bar i", { scaleX: 0 }, { scaleX: 1, duration: DURATION - 1.4, ease: "none" }, 0.8)
        .to(root.current, { opacity: 0, scale: 1.06, filter: "blur(6px)", duration: 0.6, ease: "power2.in" }, DURATION - 0.6);
    }, root);
    return () => ctx.revert();
  }, []);

  const words = name.split(" ");

  return (
    <div className="welcome" ref={root}>
      <Particles />
      <div className="w-rings"><i /><i /><i /></div>
      <button className="skip" onClick={finish}>Skip</button>

      <div className="w-center">
        <div className="w-logo"><img src={logoSrc} alt="Alpha Advisors" /></div>
        <small className="w-kicker">WELCOME TO</small>
        <h1 className="w-name">
          {words.map((w, i) => (
            <span className="word" key={i}>
              {[...w].map((c, j) => <span className="ch" key={j}>{c}</span>)}
              {i === words.length - 1 && <><span className="ch poss">’</span><span className="ch poss">s</span></>}
              {i < words.length - 1 && "\u00A0"}
            </span>
          ))}
        </h1>
        <div className="w-profile">Profile</div>
      </div>

      <div className="w-bar"><i /></div>
    </div>
  );
}
