import './globals.css'

export const metadata = {
  title: '111 By Mayfair Cleaning & Booking Schedule',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0 }}>
        {children}
      </body>
    </html>
  )
}
