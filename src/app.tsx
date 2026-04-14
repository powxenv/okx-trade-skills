import HeroSection from './components/hero-section'
import GuidesSection from './components/guides-section'

function App() {
  return (
    <>
      <HeroSection variant="hero" />
      <GuidesSection />
      <HeroSection variant="cta" />
    </>
  )
}

export default App
