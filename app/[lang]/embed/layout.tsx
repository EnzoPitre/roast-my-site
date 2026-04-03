// Overrides the root layout — renders the embed widget standalone,
// without Providers, Header, or Footer.
export default function EmbedLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
