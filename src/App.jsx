import { useEffect, useState } from 'react'
import Footer from './components/Footer.jsx'
import Header from './components/Header.jsx'
import Impact from './components/Impact.jsx'
import Introduction from './components/Introduction.jsx'
import Portfolio from './components/Portfolio.jsx'
import Recognition from './components/Recognition.jsx'
import Recommendations from './components/Recommendations.jsx'
import SectionNav from './components/SectionNav.jsx'

export default function App() {
  const [contactNavigation, setContactNavigation] = useState(0)

  useEffect(() => {
    const timer = window.setTimeout(() => document.body.classList.remove('is-preload'), 100)
    return () => window.clearTimeout(timer)
  }, [])

  return (
    <>
      <Header />
      <SectionNav onContactNavigate={() => setContactNavigation((value) => value + 1)} />
      <main>
        <Introduction />
        <Impact />
        <Portfolio />
        <Recommendations />
        <Recognition />
      </main>
      <Footer contactNavigation={contactNavigation} />
    </>
  )
}
