import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "WebSnap API Ops Dashboard",
  description: "Private operator dashboard for the WebSnap API hustle.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function OpsDashboardLayout({ children }: { children: React.ReactNode }) {
  return children;
}
