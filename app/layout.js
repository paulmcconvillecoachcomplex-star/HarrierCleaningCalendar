import './globals.css'

export const metadata = {
  title: '111 By Mayfair Cleaning & Booking Schedule',
  description: 'Airbnb booking and cleaning schedule management',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
