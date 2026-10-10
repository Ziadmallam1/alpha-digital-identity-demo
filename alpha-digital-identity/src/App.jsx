import { useEffect, useState } from "react";
import QRPage from "./components/QRPage.jsx";
import Welcome from "./components/Welcome.jsx";
import ProfilePage from "./components/ProfilePage.jsx";
import { employees, defaultSlug } from "./data/employee.js";

function parse() {
  const parts = location.hash.replace(/^#\/?/, "").split("/").filter(Boolean);
  return { view: parts[0] || "qr", slug: parts[1] || defaultSlug };
}

export default function App() {
  const [route, setRoute] = useState(parse);
  const [welcomed, setWelcomed] = useState(false);

  useEffect(() => {
    const f = () => {
      setRoute(parse());
      setWelcomed(false);
      window.scrollTo(0, 0);
    };
    addEventListener("hashchange", f);
    return () => removeEventListener("hashchange", f);
  }, []);

  const employee = employees[route.slug];

  if (route.view === "profile") {
    if (!employee)
      return (
        <div className="notfound">
          <h1>Profile not found</h1>
          <p>This card is not linked to an active profile.</p>
        </div>
      );
    return welcomed ? (
      <ProfilePage key={route.slug} employee={employee} slug={route.slug} />
    ) : (
      <Welcome key={route.slug} name={employee.name} onDone={() => setWelcomed(true)} />
    );
  }

  return <QRPage slug={employees[route.slug] ? route.slug : defaultSlug} />;
}
