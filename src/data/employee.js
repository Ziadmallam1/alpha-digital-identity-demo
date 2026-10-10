// ─────────────────────────────────────────────────────────────
//  SITE_URL: رابط الموقع بعد النشر (مثال: "https://username.github.io/alpha-digital-identity/")
//  لو سيبته فاضي هياخد الرابط الحالي تلقائياً.
//  مهم: الـ QR اللي هيتطبع لازم يتعمل من الرابط المنشور (مش localhost).
// ─────────────────────────────────────────────────────────────
export const SITE_URL = "";

export const employees = {
  "ahmed-mohamed": {
    name: "Ahmed Mohamed",
    title: "Senior Legal Consultant",
    department: "Legal Advisory",
    employeeId: "AA-1024",
    email: "ahmed.mohamed@alphaadvisors.example",
    phone: "+20 100 000 0000",
    location: "Cairo, Egypt",
    years: 8,
    specialties: ["Corporate Law", "Tax Advisory", "Compliance"],
    bio: "Ahmed works with businesses on corporate matters, regulatory requirements and practical legal strategy. This profile uses sample information for demonstration.",
    portrait:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=900&q=85"
  }
  // لإضافة موظف جديد: انسخ البلوك اللي فوق وغيّر المفتاح (الـ slug) والبيانات.
  // رابط البروفايل:  #/profile/<slug>      صفحة الـ QR:  #/qr/<slug>
};

export const defaultSlug = "ahmed-mohamed";

export function baseUrl() {
  if (SITE_URL) return SITE_URL.endsWith("/") ? SITE_URL : SITE_URL + "/";
  return window.location.origin + window.location.pathname;
}

export function profileUrl(slug) {
  return `${baseUrl()}#/profile/${slug}`;
}

export const logoSrc = `${import.meta.env.BASE_URL}alpha-logo.webp`;
