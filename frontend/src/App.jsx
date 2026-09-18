import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import GlobalWaterEffects from './components/GlobalWaterEffects';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import CloudSecurityServices from './pages/CloudSecurityServices';
import Consultancy from './pages/Consultancy';
import Contact from './pages/Contact';
import Gifting from './pages/Gifting';
import Infrastructure from './pages/Infrastructure';
import MDM from './pages/MDM';
import NetworkSecurity from './pages/NetworkSecurity';
import Solutions from './pages/Solutions';
import BlackHoleHeroSectionDemo from './components/ui/blackhole-hero-demo';

// CRM
import CRMLayout from './crm/components/CRMLayout';
import PrivateRoute from './crm/components/PrivateRoute';
import Login from './crm/pages/Login';
import Dashboard from './crm/pages/Dashboard';
import Leads from './crm/pages/Leads';
import Customers from './crm/pages/Customers';
import Tickets from './crm/pages/Tickets';
import Messages from './crm/pages/Messages';

import './App.css';

// ScrollToTop component to ensure pages load at the top
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

// Intersection Observer for scroll animations (.reveal classes)
const ScrollReveal = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach(el => observer.observe(el));

    return () => {
      revealElements.forEach(el => observer.unobserve(el));
    };
  }, [pathname]);

  return null;
};

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <ScrollReveal />
      <GlobalWaterEffects />
      <Routes>
        {/* Main Website Routes */}
        <Route path="/" element={<><Navbar /><main><Home /></main><Footer /></>} />
        <Route path="/about" element={<><Navbar /><main><About /></main><Footer /></>} />
        <Route path="/cloud-security-services" element={<><Navbar /><main><CloudSecurityServices /></main><Footer /></>} />
        <Route path="/consultancy" element={<><Navbar /><main><Consultancy /></main><Footer /></>} />
        <Route path="/contact" element={<><Navbar /><main><Contact /></main><Footer /></>} />
        <Route path="/gifting" element={<><Navbar /><main><Gifting /></main><Footer /></>} />
        <Route path="/infrastructure" element={<><Navbar /><main><Infrastructure /></main><Footer /></>} />
        <Route path="/mdm" element={<><Navbar /><main><MDM /></main><Footer /></>} />
        <Route path="/network-security" element={<><Navbar /><main><NetworkSecurity /></main><Footer /></>} />
        <Route path="/solutions" element={<><Navbar /><main><Solutions /></main><Footer /></>} />
        <Route path="/blackhole-demo" element={<BlackHoleHeroSectionDemo />} />

        {/* CRM Routes */}
        <Route path="/crm/login" element={<Login />} />
        <Route element={<PrivateRoute />}>
          <Route path="/crm" element={<CRMLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="leads" element={<Leads />} />
            <Route path="customers" element={<Customers />} />
            <Route path="tickets" element={<Tickets />} />
            <Route path="messages" element={<Messages />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
