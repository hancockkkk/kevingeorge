import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {
  title: 'Kevin George',
  description: 'Music, videos, and updates from Kevin George.',
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
