import { useRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Download } from "lucide-react";
import { profileUrl } from "../data/employee.js";

function svgToPng(svg, px, name) {
  const clone = svg.cloneNode(true);
  clone.setAttribute("width", px);
  clone.setAttribute("height", px);
  const xml = new XMLSerializer().serializeToString(clone);
  const img = new Image();
  img.onload = () => {
    const pad = Math.round(px * 0.1); // quiet zone
    const c = document.createElement("canvas");
    c.width = c.height = px + pad * 2;
    const g = c.getContext("2d");
    g.fillStyle = "#fff";
    g.fillRect(0, 0, c.width, c.height);
    g.imageSmoothingEnabled = false;
    g.drawImage(img, pad, pad, px, px);
    c.toBlob((b) => save(b, name));
  };
  img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(xml);
}

function save(blob, name) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
}

export default function QRPage({ slug }) {
  const box = useRef(null);
  const url = profileUrl(slug);
  const local = /^(localhost|127\.|192\.168\.|10\.|0\.0\.0\.0)/.test(location.hostname);

  const getSvg = () => box.current.querySelector("svg");
  const dlSvg = () => {
    const xml = new XMLSerializer().serializeToString(getSvg());
    save(new Blob([xml], { type: "image/svg+xml" }), `${slug}-qr.svg`);
  };

  return (
    <div className="qr-page">
      <div className="qr-box" ref={box}>
        {/* quiet zone أبيض حوالين الـ QR مهم جداً عشان السكانر يقراه */}
        <QRCodeSVG value={url} size={1024} level="Q" bgColor="#ffffff" fgColor="#000000" />
      </div>

      <div className="qr-tools">
        <button onClick={() => svgToPng(getSvg(), 1200, `${slug}-qr.png`)}>
          <Download size={14} /> PNG
        </button>
        <button onClick={dlSvg}>
          <Download size={14} /> SVG
        </button>
      </div>

      {local && (
        <p className="qr-warn">
          ⚠ الـ QR ده شغال على {location.hostname} — الموبايل مش هيفتحه. انشر الموقع الأول وافتح الصفحة من الرابط
          المنشور قبل ما تطبع.
        </p>
      )}
    </div>
  );
}
