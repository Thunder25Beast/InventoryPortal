// pages/_app.js
import { UserProvider } from '/context/UserContext';
import '/styles/globals.css';
import { Inter, Comic_Neue } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })
const comicNeue = Comic_Neue({
  weight: ['300', '400', '700'],
  subsets: ['latin'],
})

function MyApp({ Component, pageProps }) {
  return (
    <div className={comicNeue.className}>
      <UserProvider>
        <div className="page-container">
          <div className="content-container">
            <Component {...pageProps} />
          </div>
        </div>
      </UserProvider>
    </div>
  );
}

export default MyApp;
