import { StrictMode, Suspense, lazy } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import "./index.css";
import { Layout } from "./components/Layout";
import Hook from "./pages/Hook";
import Story from "./pages/Story";
import Prototype from "./pages/Prototype";
const CaseStudy = lazy(() => import("./pages/CaseStudy"));
const CaseIndex = lazy(() => import("./pages/CaseStudy").then((m) => ({ default: m.CaseIndex })));
const Evidence = lazy(() => import("./pages/Evidence"));
const About = lazy(() => import("./pages/About"));
const Loading =() => <p className="mx-auto max-w-6xl px-4 py-16 text-muted sm:px-6">Loading…</p>;

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="about-me" element={<Suspense fallback={<Loading />}><About /></Suspense>} />
        <Route element={<Layout />}>
          <Route index element={<Hook />} />
          <Route path="story" element={<Story />} />
          <Route path="prototype" element={<Prototype />} />
          <Route path="case-study" element={<Suspense fallback={<Loading />}><CaseIndex /></Suspense>} />
          <Route path="case-study/:chapter" element={<Suspense fallback={<Loading />}><CaseStudy /></Suspense>} />
          <Route path="evidence" element={<Suspense fallback={<Loading />}><Evidence /></Suspense>} />
          <Route path="*" element={<Hook />} />
        </Route>
      </Routes>
    </BrowserRouter>
    <Analytics />
  </StrictMode>
);
