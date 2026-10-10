import './globals.css';

export const metadata = {
  title: 'ASTRA AI - Autonomous Security & Threat Response AI Platform',
  description: 'ASTRA AI (Autonomous Security & Threat Response AI) - Defensive Cyber Threat, Phishing & Digital Impersonation Detection & Response System built with Next.js and Django',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-[#080a0f] text-white selection:bg-[#f59e0b] selection:text-[#080a0f]">
        {children}
      </body>
    </html>
  );
}
