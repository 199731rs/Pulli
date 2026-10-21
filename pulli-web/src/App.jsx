import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import EnquiryDrawer from './components/EnquiryDrawer.jsx'
import Home from './pages/Home.jsx'
import Collections from './pages/Collections.jsx'
import Category from './pages/Category.jsx'
import Product from './pages/Product.jsx'
import Finishes from './pages/Finishes.jsx'
import Search from './pages/Search.jsx'
import About from './pages/About.jsx'
import Contact from './pages/Contact.jsx'
import NotFound from './pages/NotFound.jsx'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/collections" element={<Collections />} />
          <Route path="/:line/:slug" element={<Category />} />
          <Route path="/product/:id" element={<Product />} />
          <Route path="/finishes" element={<Finishes />} />
          <Route path="/finishes/:slug" element={<Finishes />} />
          <Route path="/search" element={<Search />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <EnquiryDrawer />
    </>
  )
}
