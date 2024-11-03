import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Registro - XChange",
};

export default function RegistroLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}