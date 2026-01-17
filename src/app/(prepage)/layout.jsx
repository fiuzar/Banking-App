// app/layout.tsx
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';

export const metadata = {
  title: 'PaySense | International Digital Banking',
  description: 'Manage USD and EUR wallets with transparent FX and global control.',
};

export default function RootLayout({ children }) {
  return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <div className="grow">
          {children}
        </div>
        <Footer />
      </div>
  );
}