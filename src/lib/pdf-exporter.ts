"use client";

import type { ResumeDraft } from "@/components/builder/types";
import { TEMPLATE_COMPONENTS } from "@/components/builder/templates";
import React from "react";
import { createRoot } from "react-dom/client";

type Html2CanvasFn = (
  element: HTMLElement,
  options?: Record<string, unknown>
) => Promise<HTMLCanvasElement>;

interface JsPdfInstance {
  addImage: (
    imageData: string,
    format: string,
    x: number,
    y: number,
    width: number,
    height: number
  ) => void;
  addPage: () => void;
  save: (filename: string) => void;
}

type JsPdfConstructor = new (options?: Record<string, unknown>) => JsPdfInstance;

interface PdfTools {
  html2canvas: Html2CanvasFn;
  jsPDF: JsPdfConstructor;
}

async function getPdfTools(): Promise<PdfTools> {
  let html2canvasFn: Html2CanvasFn | null = null;
  let jsPdfConstructor: JsPdfConstructor | null = null;

  const win = typeof window !== "undefined" ? (window as unknown as Record<string, unknown>) : {};

  try {
    const html2canvasModule = await import("html2canvas");
    html2canvasFn = (html2canvasModule.default || html2canvasModule) as unknown as Html2CanvasFn;
  } catch {
    if (!win.html2canvas) {
      await loadScript("https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js");
    }
    html2canvasFn = win.html2canvas as unknown as Html2CanvasFn;
  }

  try {
    const jsPdfModule = await import("jspdf");
    jsPdfConstructor = (jsPdfModule.jsPDF || jsPdfModule.default) as unknown as JsPdfConstructor;
  } catch {
    if (!win.jspdf && !win.jsPDF) {
      await loadScript("https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js");
    }
    const globalJspdf = win.jspdf as Record<string, unknown> | undefined;
    jsPdfConstructor = (globalJspdf?.jsPDF || win.jsPDF) as unknown as JsPdfConstructor;
  }

  if (!html2canvasFn || !jsPdfConstructor) {
    throw new Error("Could not load PDF generation tools.");
  }

  return { html2canvas: html2canvasFn, jsPDF: jsPdfConstructor };
}

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${src}"]`);
    if (existing) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load script ${src}`));
    document.head.appendChild(script);
  });
}

export async function generateClientPdfFromElement(
  element: HTMLElement,
  fileName: string = "resume.pdf"
): Promise<string> {
  const { html2canvas, jsPDF } = await getPdfTools();

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    logging: false,
    backgroundColor: "#ffffff",
    windowWidth: 800,
    onclone: (clonedDoc: Document) => {
      // Tailwind v4 uses modern CSS color functions (lab, oklch, color-mix) that html2canvas cannot parse.
      // Replace unsupported color functions in all <style> elements:
      const styleElements = clonedDoc.querySelectorAll("style");
      styleElements.forEach((style) => {
        if (style.textContent) {
          style.textContent = style.textContent
            .replace(/lab\([^)]+\)/gi, "rgba(0, 0, 0, 0.05)")
            .replace(/oklch\([^)]+\)/gi, "rgba(0, 0, 0, 0.05)")
            .replace(/color-mix\([^)]+\)/gi, "rgba(0, 0, 0, 0.05)")
            .replace(/light-dark\([^)]+\)/gi, "rgba(0, 0, 0, 0.05)");
        }
      });

      // Remove unsupported CSS rules from cloned document stylesheets
      try {
        Array.from(clonedDoc.styleSheets).forEach((sheet) => {
          try {
            const rules = sheet.cssRules || sheet.rules;
            if (rules) {
              for (let i = rules.length - 1; i >= 0; i--) {
                const ruleText = rules[i]?.cssText || "";
                if (
                  ruleText.includes("lab(") ||
                  ruleText.includes("oklch(") ||
                  ruleText.includes("color-mix(") ||
                  ruleText.includes("light-dark(")
                ) {
                  sheet.deleteRule(i);
                }
              }
            }
          } catch {
            // Ignore CORS/security errors for external stylesheets
          }
        });
      } catch {
        // Ignore stylesheet enumeration errors
      }
    },
  });

  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const imgWidth = 210;
  const pageHeight = 297;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  let heightLeft = imgHeight;
  let position = 0;

  const imgData = canvas.toDataURL("image/png");

  pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
  heightLeft -= pageHeight;

  while (heightLeft > 0) {
    position = heightLeft - imgHeight;
    pdf.addPage();
    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
  }

  const cleanFileName = fileName.endsWith(".pdf") ? fileName : `${fileName}.pdf`;
  pdf.save(cleanFileName);
  return cleanFileName;
}

export async function generateClientPdfFromDraft(
  draft: ResumeDraft,
  fileName: string = "resume.pdf"
): Promise<string> {
  const container = document.createElement("div");
  container.style.position = "fixed";
  container.style.top = "-9999px";
  container.style.left = "-9999px";
  container.style.width = "800px";
  container.style.backgroundColor = "#ffffff";
  container.style.zIndex = "-9999";
  document.body.appendChild(container);

  const root = createRoot(container);
  const Template = TEMPLATE_COMPONENTS[draft.template || "classic"];

  return new Promise((resolve, reject) => {
    root.render(
      React.createElement(
        React.StrictMode,
        null,
        React.createElement(
          "div",
          { id: "temp-pdf-render", style: { width: "800px", backgroundColor: "#ffffff" } },
          React.createElement(Template, { resume: draft })
        )
      )
    );

    setTimeout(async () => {
      try {
        const renderEl = container.querySelector("#temp-pdf-render") as HTMLElement;
        const target = renderEl || container;
        const savedName = await generateClientPdfFromElement(target, fileName);
        root.unmount();
        if (document.body.contains(container)) {
          document.body.removeChild(container);
        }
        resolve(savedName);
      } catch (err) {
        root.unmount();
        if (document.body.contains(container)) {
          document.body.removeChild(container);
        }
        reject(err);
      }
    }, 400);
  });
}
