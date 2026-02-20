// app/layout.tsx
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';

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