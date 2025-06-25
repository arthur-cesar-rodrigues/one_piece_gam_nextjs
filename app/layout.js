import './global.css'

export const metadata = {
  title: 'Batalha Épica',
  description: 'Jogo de batalha com Next.js',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-br">
      <body>{children}</body>
    </html>
  );
}
