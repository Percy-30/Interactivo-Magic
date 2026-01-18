import React, { useState, useEffect } from 'react';
import { Heart, Send, Gift, Sparkles, Download, ArrowRight, Music, Calendar, User, Link as LinkIcon, Check, Menu, X, Star, Zap, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import TemplateEngine from './utils/TemplateEngine';
import { GALAXY_TEMPLATE, LOVE_TEMPLATE, BIRTHDAY_TEMPLATE } from './templates';
import { isNativePlatform, shareContent } from './utils/platformUtils';
import { initializeAdMob, showBannerAd, showRewardedInterstitial } from './utils/admobUtils';
import { getAdSenseClientId } from './config/adsenseConfig';
import './styles/index.css';

const TEMPLATES = [
  {
    id: 'love',
    name: 'Galaxia de Amor',
    description: 'Corazones flotantes y estrellas animadas.',
    icon: <Heart className="text-white" />,
    color: '#ff4d94',
    content: GALAXY_TEMPLATE
  },
  {
    id: 'proposal',
    name: 'Propuesta Irresistible',
    description: 'El botón NO se escapará de su cursor.',
    icon: <Sparkles className="text-white" />,
    color: '#7000ff',
    content: LOVE_TEMPLATE
  },
  {
    id: 'birthday',
    name: 'Feliz Cumpleaños',
    description: 'Confeti y sorpresas digitales.',
    icon: <Gift className="text-white" />,
    color: '#00f2ff',
    content: BIRTHDAY_TEMPLATE
  }
];

const FEATURES = [
  {
    icon: <Sparkles size={32} />,
    title: '100% Real',
    description: 'Mensajes animados e interactivos que funcionan en cualquier dispositivo.'
  },
  {
    icon: <Zap size={32} />,
    title: 'Rápido y fácil',
    description: 'Crea tu mensaje en menos de 2 minutos. Sin registros ni complicaciones.'
  },
  {
    icon: <Users size={32} />,
    title: '100% Seguro',
    description: 'Tus datos son privados. Comparte con confianza por WhatsApp o email.'
  }
];

const STEPS = [
  {
    number: '1',
    title: 'Elige tu plantilla',
    description: 'Selecciona entre nuestras plantillas diseñadas para cada ocasión: amor, cumpleaños, propuestas y más.'
  },
  {
    number: '2',
    title: 'Personaliza',
    description: 'Añade el nombre del destinatario, tu nombre y un mensaje especial. Hazlo único y memorable.'
  },
  {
    number: '3',
    title: 'Comparte',
    description: 'Copia el link o descarga el HTML. Envíalo por WhatsApp, email o cualquier red social. ¡Listo!'
  }
];

const AdSlot = ({ label = 'Publicidad', adSlot, adFormat = 'auto', adLayout, fullWidthResponsive = 'true', style = {} }) => {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error('AdSense error:', e);
    }
  }, []);

  return (
    <div className="ad-slot-wrapper" style={{ margin: '1rem auto', textAlign: 'center', ...style }}>
      {label && <p style={{
        color: 'var(--text-muted)',
        fontSize: '0.65rem',
        textTransform: 'uppercase',
        letterSpacing: '2px',
        marginBottom: '0.5rem',
        opacity: 0.5
      }}>{label}</p>}
      <div className="glass" style={{
        padding: '0.5rem',
        background: 'rgba(255,255,255,0.02)',
        minHeight: '100px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden'
      }}>
        <ins className="adsbygoogle"
          style={{ display: 'block', width: '100%', minWidth: '160px' }}
          data-ad-client={getAdSenseClientId()}
          data-ad-slot={adSlot}
          data-ad-format={adFormat}
          data-ad-layout={adLayout}
          data-full-width-responsive={fullWidthResponsive}></ins>
      </div>
    </div>
  );
};

const LegalModal = ({ type, onClose }) => {
  const content = {
    privacy: {
      title: 'Política de Privacidad',
      body: 'En InteractivoMagic, valoramos tu privacidad. No almacenamos tus mensajes ni datos personales en nuestros servidores de forma permanente. Los links generados contienen la información codificada en la URL, lo que significa que el mensaje vive en el link que compartes, no en nuestras bases de datos.'
    },
    terms: {
      title: 'Términos de Servicio',
      body: 'Al usar InteractivoMagic, aceptas que eres el único responsable del contenido de los mensajes que generas. Nos reservamos el derecho de deshabilitar el servicio si se detecta un uso indebido o malintencionado de la plataforma.'
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="modal-overlay"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="glass modal-content"
        onClick={e => e.stopPropagation()}
        style={{ padding: '2rem', maxWidth: '500px', width: '90%' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ margin: 0 }}>{content[type].title}</h2>
          <button className="btn-icon" onClick={onClose}><X /></button>
        </div>
        <p style={{ lineHeight: '1.6', color: 'var(--text-muted)' }}>{content[type].body}</p>
        <button className="btn btn-primary" onClick={onClose} style={{ marginTop: '2rem', width: '100%' }}>Entendido</button>
      </motion.div>
    </motion.div>
  );
};


function App() {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [viewData, setViewData] = useState(null);
  const [copied, setCopied] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [generatedUrl, setGeneratedUrl] = useState('');
  const [legalModal, setLegalModal] = useState(null); // 'privacy', 'terms'
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobileApp, setIsMobileApp] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    sender: '',
    message: '',
    hasAudio: true,
    audioOption: 'youtube', // 'upload', 'youtube'
    audioSrc: '',
    youtubeUrl: '',
    audioFile: null
  });

  // Check platform and viewer mode on load
  useEffect(() => {
    // Detect if running in native mobile app
    const isNative = isNativePlatform();
    setIsMobileApp(isNative);

    // Initialize AdMob and show banner if on mobile
    if (isNative) {
      initializeAdMob().then(() => {
        // Show banner ad at bottom of screen
        showBannerAd();
      });
    }

    // Check for viewer mode
    const params = new URLSearchParams(window.location.search);
    const data = params.get('msg');
    if (data) {
      try {
        const decodedString = atob(data);
        const decoded = JSON.parse(decodedString);
        const tpl = TEMPLATES.find(t => t.id === decoded.t);
        if (tpl) {
          setViewData({ ...decoded, html: tpl.content });
        }
      } catch (e) {
        console.error("Error decoding message:", e);
      }
    }
  }, []);

  const handleDownload = () => {
    TemplateEngine.generate(selectedTemplate.content, formData);
  };

  const extractSocialId = (url, type) => {
    if (!url) return null;
    if (type === 'youtube') {
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
      const match = url.match(regExp);
      return (match && match[2].length === 11) ? match[2] : null;
    }
    if (type === 'tiktok') {
      const regExp = /\/video\/(\d+)/;
      const match = url.match(regExp);
      return match ? match[1] : null;
    }
    return url; // For facebook, we use the full URL
  };

  const getShareUrl = () => {
    const dataObj = {
      name: formData.name,
      sender: formData.sender,
      message: formData.message,
      t: selectedTemplate.id,
      audio: formData.hasAudio,
      src: formData.audioOption === 'upload' ? 'uploaded' : (formData.audioOption === 'default' ? 'default' : null),
      yt: formData.audioOption === 'youtube' ? extractSocialId(formData.youtubeUrl, 'youtube') : null
    };
    const jsonStr = JSON.stringify(dataObj);
    const encoded = btoa(unescape(encodeURIComponent(jsonStr)));
    return `${window.location.origin}${window.location.pathname}?msg=${encoded}`;
  };

  const handleCopyLink = () => {
    const url = getShareUrl();
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleGenerate = () => {
    if (!formData.name || !formData.sender || !formData.message) {
      alert('Por favor, completa todos los campos.');
      return;
    }
    // If upload is selected but no file
    if (formData.hasAudio && formData.audioOption === 'upload' && !formData.audioFile) {
      alert('Por favor, selecciona un archivo de audio para subir.');
      return;
    }
    // Validation for social links
    if (formData.hasAudio) {
      if (formData.audioOption === 'youtube' && !extractSocialId(formData.youtubeUrl, 'youtube')) {
        alert('Por favor, ingresa un link de YouTube válido.');
        return;
      }
    }
    setShowResult(true);
  };

  const scrollToTemplates = () => {
    document.getElementById('templates-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  // If in View Mode, show the template inside an iframe
  if (viewData) {
    const finalHtml = TemplateEngine.render(viewData.html, {
      ...viewData,
      audio: viewData.audio || viewData.hasAudio,
      audioSrc: viewData.audioSrc || (viewData.src !== 'default' && viewData.src !== 'uploaded' ? viewData.src : ''),
      youtubeUrl: viewData.youtubeUrl || (viewData.yt ? `https://youtube.com/watch?v=${viewData.yt}` : '')
    });

    return (
      <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', background: '#000', position: 'relative' }}>
        <button
          onClick={() => setViewData(null)}
          className="glass"
          style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            zIndex: 1000,
            background: 'rgba(0,0,0,0.6)',
            color: 'white',
            border: '2px solid rgba(255,255,255,0.3)',
            borderRadius: '50%',
            width: '45px',
            height: '45px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 15px rgba(0,0,0,0.3)'
          }}
          title="Cerrar Vista Previa"
        >
          <X size={24} />
        </button>
        <iframe
          title="Mensaje Interactivo"
          srcDoc={finalHtml}
          style={{ width: '100%', height: '100%', border: 'none' }}
        />
      </div>
    );
  }

  return (
    <div className="App">
      <div className="gradient-bg" />

      {/* Header Navigation */}
      <header className="site-header">
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem 2rem' }}>
          <div
            className="logo"
            onClick={() => {
              setSelectedTemplate(null);
              setShowResult(false);
              setViewData(null);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}
          >
            <Sparkles size={28} color="#ff00ff" />
            <span style={{ fontSize: '1.5rem', fontWeight: '800', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              InteractivoMagic
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="desktop-nav" style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
            <a href="#inicio" onClick={(e) => { e.preventDefault(); setSelectedTemplate(null); setShowResult(false); setViewData(null); window.scrollTo({ top: 0, behavior: 'smooth' }); }} style={{ color: 'white', textDecoration: 'none', fontWeight: '500', transition: 'color 0.3s' }}>Inicio</a>
            <a href="#plantillas" onClick={(e) => { e.preventDefault(); setSelectedTemplate(null); setShowResult(false); setViewData(null); setTimeout(scrollToTemplates, 50); }} style={{ color: 'white', textDecoration: 'none', fontWeight: '500', transition: 'color 0.3s' }}>Plantillas</a>
            <a href="#como-funciona" onClick={(e) => { e.preventDefault(); setSelectedTemplate(null); setShowResult(false); setViewData(null); setTimeout(() => document.getElementById('como-funciona')?.scrollIntoView({ behavior: 'smooth' }), 50); }} style={{ color: 'white', textDecoration: 'none', fontWeight: '500', transition: 'color 0.3s' }}>Cómo funciona</a>
            <button className="btn btn-primary" onClick={() => { setSelectedTemplate(null); setShowResult(false); setViewData(null); setTimeout(scrollToTemplates, 50); }} style={{ padding: '0.7rem 1.5rem', fontSize: '0.95rem' }}>
              Comenzar
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <button className="mobile-menu-btn" onClick={() => setMenuOpen(!menuOpen)} style={{ display: 'none', background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mobile-nav glass"
              style={{ overflow: 'hidden' }}
            >
              <nav style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <a href="#inicio" onClick={() => { setMenuOpen(false); setSelectedTemplate(null); setShowResult(false); setViewData(null); window.scrollTo({ top: 0, behavior: 'smooth' }); }} style={{ color: 'white', textDecoration: 'none', padding: '0.75rem', borderRadius: '12px', background: 'rgba(255,255,255,0.05)' }}>Inicio</a>
                <a href="#plantillas" onClick={(e) => { e.preventDefault(); setMenuOpen(false); setSelectedTemplate(null); setShowResult(false); setViewData(null); setTimeout(scrollToTemplates, 50); }} style={{ color: 'white', textDecoration: 'none', padding: '0.75rem', borderRadius: '12px', background: 'rgba(255,255,255,0.05)' }}>Plantillas</a>
                <a href="#como-funciona" onClick={(e) => { e.preventDefault(); setMenuOpen(false); setSelectedTemplate(null); setShowResult(false); setViewData(null); setTimeout(() => document.getElementById('como-funciona')?.scrollIntoView({ behavior: 'smooth' }), 50); }} style={{ color: 'white', textDecoration: 'none', padding: '0.75rem', borderRadius: '12px', background: 'rgba(255,255,255,0.05)' }}>Cómo funciona</a>
                <button className="btn btn-primary" onClick={() => { setMenuOpen(false); setSelectedTemplate(null); setShowResult(false); setViewData(null); setTimeout(scrollToTemplates, 50); }} style={{ width: '100%' }}>
                  Comenzar
                </button>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* SLOT A: Header Ad - Display (Web only) */}
      {!isMobileApp && <AdSlot label="Banner Superior" adSlot="4095225502" />}

      {/* Hero Section (Web only) */}
      {!selectedTemplate && !isMobileApp && (
        <section className="hero-section container" style={{ textAlign: 'center', paddingTop: '6rem', paddingBottom: '4rem' }}>

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 style={{
              fontSize: 'clamp(2.5rem, 8vw, 4.5rem)',
              marginBottom: '1.5rem',
              lineHeight: '1.1',
              background: 'linear-gradient(135deg, #ff00ff, #ff006f, #ff00ff)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: '900'
            }}>
              Crea mensajes interactivos
              <br />
              <span style={{ color: 'white', fontSize: '0.7em' }}>que enamoren</span>
            </h1>
            <p style={{ fontSize: 'clamp(1rem, 3vw, 1.3rem)', color: 'var(--text-muted)', marginBottom: '2.5rem', maxWidth: '700px', margin: '0 auto 2.5rem' }}>
              Sorprende a quien más amas con mensajes animados, interactivos y llenos de magia. 100% personalizables y fáciles de compartir.
            </p>
            <button className="btn btn-primary" onClick={scrollToTemplates} style={{ fontSize: '1.2rem', padding: '1.2rem 2.5rem' }}>
              <Sparkles size={24} /> Comenzar ahora
            </button>
          </motion.div>

          {/* SLOT B: Mid Landing Ad - In-article */}
          <div style={{ marginTop: '4rem' }}>
            <AdSlot label="Publicidad" adSlot="5051701068" adFormat="fluid" adLayout="in-article" />
          </div>

          {/* Animated Icons */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            style={{ marginTop: '4rem', display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}
          >
            {[Heart, Send, Gift].map((Icon, idx) => (
              <motion.div
                key={idx}
                animate={{ y: [0, -15, 0] }}
                transition={{ repeat: Infinity, duration: 2, delay: idx * 0.3 }}
                className="glass"
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: `linear-gradient(135deg, ${TEMPLATES[idx].color}20, ${TEMPLATES[idx].color}10)`
                }}
              >
                <Icon size={40} color={TEMPLATES[idx].color} />
              </motion.div>
            ))}
          </motion.div>
        </section>
      )}

      {/* Features Grid (Web only) */}
      {!selectedTemplate && !isMobileApp && (
        <section className="container" style={{ marginBottom: '6rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            {FEATURES.map((feat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.2 }}
                className="glass feature-card"
                style={{ padding: '2rem', textAlign: 'center' }}
              >
                <div style={{
                  display: 'inline-flex',
                  padding: '1rem',
                  borderRadius: '16px',
                  background: 'rgba(255, 0, 255, 0.1)',
                  marginBottom: '1rem'
                }}>
                  {feat.icon}
                </div>
                <h3 style={{ marginBottom: '0.75rem', fontSize: '1.25rem' }}>{feat.title}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>{feat.description}</p>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Templates Section */}
      {!selectedTemplate ? (
        <section id="templates-section" style={{ marginTop: isMobileApp ? '2rem' : '6rem' }}>
          {!isMobileApp && (
            <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
              <h2 style={{
                fontSize: 'clamp(2rem, 5vw, 3rem)',
                marginBottom: '1rem',
                background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                Explora nuestras plantillas mágicas
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
                Elige la plantilla perfecta para tu ocasión especial y personalízala en segundos
              </p>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem' }}>
            {TEMPLATES.map((tpl, idx) => (
              <motion.div
                key={tpl.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.15 }}
                className="glass card template-card"
                onClick={async () => {
                  // Show rewarded interstitial ad in mobile app before selecting template
                  if (isMobileApp) {
                    await showRewardedInterstitial(
                      // onReward callback
                      () => {
                        console.log('User earned reward, proceeding to template');
                        setSelectedTemplate(tpl);
                      },
                      // onDismiss callback
                      (rewarded) => {
                        if (rewarded) {
                          console.log('Ad watched, template unlocked');
                        } else {
                          console.log('Ad dismissed without reward');
                          // Still allow access since rewarded interstitial is optional
                          setSelectedTemplate(tpl);
                        }
                      }
                    );
                  } else {
                    // On web, just select template directly
                    setSelectedTemplate(tpl);
                  }
                }}
                style={{ cursor: 'pointer', textAlign: 'left', padding: '2rem' }}
              >
                <div style={{ fontSize: '2.5rem', marginBottom: '1.5rem', color: 'white' }}>{tpl.icon}</div>
                <h3 style={{ fontSize: '1.4rem', marginBottom: '0.5rem', color: 'white' }}>{tpl.name}</h3>
                <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '1rem' }}>{tpl.description}</p>
                <div className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                  Seleccionar <ArrowRight size={18} />
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr)',
          width: '100%',
          maxWidth: '1400px',
          margin: '0 auto',
          gap: '2rem',
          alignItems: 'start'
        }} className="form-layout-grid">
          {/* Ad Lateral Izquierdo (Desktop) */}
          <div className="side-ad-form left-ad" style={{ display: 'none' }}>
            <AdSlot label="Sponsor" adSlot="4095225502" adFormat="vertical" fullWidthResponsive="false" />
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass"
            style={{ padding: '2.5rem', width: '100%' }}
          >
            {!showResult ? (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                  <button
                    onClick={() => setSelectedTemplate(null)}
                    style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '1rem' }}
                  >
                    ← Volver
                  </button>
                  <h2>Personalizar: {selectedTemplate.name}</h2>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Nombre del Destinatario</label>
                    <input
                      placeholder="Ej: Mi Amor"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Tu Nombre</label>
                    <input
                      placeholder="Tu nombre"
                      value={formData.sender}
                      onChange={(e) => setFormData({ ...formData, sender: e.target.value })}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Mensaje Especial</label>
                    <textarea
                      rows="4"
                      placeholder="Escribe algo lindo..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    />
                  </div>

                  {/* Audio Selection Section */}
                  <div style={{
                    padding: '1.5rem',
                    background: 'rgba(255, 255, 255, 0.03)',
                    borderRadius: '20px',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.2rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(255, 0, 255, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Music size={20} color="#ff00ff" />
                        </div>
                        <div>
                          <p style={{ fontWeight: '700', fontSize: '1rem', margin: 0 }}>Música Mágica</p>
                          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>Añade una banda sonora a tu mensaje</p>
                        </div>
                      </div>
                      <label className="switch">
                        <input
                          type="checkbox"
                          checked={formData.hasAudio}
                          onChange={(e) => setFormData({ ...formData, hasAudio: e.target.checked })}
                        />
                        <span className="slider round"></span>
                      </label>
                    </div>

                    {formData.hasAudio && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        style={{ overflow: 'hidden' }}
                      >
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.8rem', marginBottom: '1.2rem' }}>
                          {[
                            { id: 'youtube', label: 'YouTube', help: 'Video' },
                            { id: 'upload', label: 'Subir audio', help: 'Solo HTML' }
                          ].map(opt => (
                            <button
                              key={opt.id}
                              onClick={() => setFormData({ ...formData, audioOption: opt.id })}
                              style={{
                                padding: '0.8rem',
                                borderRadius: '12px',
                                border: formData.audioOption === opt.id ? '2px solid var(--primary)' : '1px solid rgba(255,255,255,0.1)',
                                background: formData.audioOption === opt.id ? 'rgba(255, 77, 148, 0.1)' : 'transparent',
                                cursor: 'pointer',
                                transition: 'all 0.3s'
                              }}
                            >
                              <p style={{ fontWeight: '700', fontSize: '0.9rem', margin: '0 0 2px 0', color: formData.audioOption === opt.id ? 'white' : 'var(--text-muted)' }}>{opt.label}</p>
                              <p style={{ fontSize: '0.65rem', margin: 0, color: 'var(--text-muted)' }}>{opt.help}</p>
                            </button>
                          ))}
                        </div>

                        {formData.audioOption === 'upload' && (
                          <div style={{
                            padding: '1rem',
                            border: '1px dashed rgba(255,255,255,0.2)',
                            borderRadius: '12px',
                            textAlign: 'center'
                          }}>
                            <p style={{ fontSize: '0.85rem', marginBottom: '1rem', color: 'var(--text-muted)' }}>Sube tu archivo .mp3 o .m4a (Máx 5MB)</p>
                            <input
                              type="file"
                              accept="audio/mp3,audio/mpeg,audio/x-m4a,audio/m4a"
                              id="audio-upload"
                              style={{ display: 'none' }}
                              onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                  const reader = new FileReader();
                                  reader.onload = (event) => {
                                    setFormData({ ...formData, audioFile: file, audioSrc: event.target.result });
                                  };
                                  reader.readAsDataURL(file);
                                }
                              }}
                            />
                            <label htmlFor="audio-upload" className="btn glass" style={{ padding: '0.6rem 1.2rem', fontSize: '0.9rem', width: '100%', justifyContent: 'center' }}>
                              {formData.audioFile ? `🎵 ${formData.audioFile.name}` : 'Seleccionar Archivo'}
                            </label>
                          </div>
                        )}

                        {formData.audioOption === 'youtube' && (
                          <input
                            placeholder="Link de YouTube (ej. https://youtube.com/...)"
                            value={formData.youtubeUrl}
                            onChange={(e) => setFormData({ ...formData, youtubeUrl: e.target.value })}
                            style={{ fontSize: '0.9rem', padding: '0.9rem' }}
                          />
                        )}

                      </motion.div>
                    )}
                  </div>

                  <button className="btn btn-primary" onClick={handleGenerate} style={{ justifyContent: 'center', marginTop: '1rem' }}>
                    <Sparkles size={20} /> Generar Mensaje Mágico
                  </button>
                </div>
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, type: "spring" }}
                style={{ textAlign: 'center' }}
              >
                <motion.div
                  style={{ fontSize: '5rem', marginBottom: '1.5rem' }}
                  animate={{ rotate: [0, 10, -10, 10, 0], scale: [1, 1.1, 1, 1.1, 1] }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  ✨🎉✨
                </motion.div>
                <h2 style={{
                  marginBottom: '1rem',
                  fontSize: '2rem',
                  background: 'linear-gradient(135deg, var(--primary), var(--secondary), var(--accent))',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontWeight: '700'
                }}>
                  ¡Tu mensaje mágico está listo!
                </h2>
                <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem', fontSize: '1.1rem', lineHeight: '1.6' }}>
                  Abre la vista previa, comparte el link por WhatsApp o descarga el archivo HTML para enviarlo directamente.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                  <button
                    onClick={() => setViewData({ ...formData, html: selectedTemplate.content, t: selectedTemplate.id })}
                    className="btn btn-primary"
                    style={{
                      justifyContent: 'center',
                      fontSize: '1.1rem',
                      padding: '1.1rem 2rem',
                      boxShadow: '0 8px 25px rgba(255, 77, 148, 0.5)',
                      width: '100%'
                    }}
                  >
                    <Sparkles size={22} /> Ver Vista Previa
                  </button>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <button
                      className="btn glass"
                      onClick={handleCopyLink}
                      style={{
                        justifyContent: 'center',
                        background: copied ? 'rgba(76, 175, 80, 0.2)' : 'rgba(255, 0, 255, 0.15)',
                        border: copied ? '2px solid rgba(76, 175, 80, 0.5)' : '2px solid rgba(255, 0, 255, 0.4)',
                        fontSize: '1rem',
                        padding: '1rem 1.5rem',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      {copied ? (
                        <>
                          <Check size={20} color="#4CAF50" />
                          <span style={{ color: '#4CAF50', fontWeight: '600' }}>¡Copiado!</span>
                        </>
                      ) : (
                        <>
                          <LinkIcon size={20} color="#ff00ff" />
                          <span>Copiar Link</span>
                        </>
                      )}
                    </button>

                    <button
                      className="btn glass"
                      onClick={handleDownload}
                      style={{
                        justifyContent: 'center',
                        background: 'rgba(0, 242, 255, 0.15)',
                        border: '2px solid rgba(0, 242, 255, 0.4)',
                        fontSize: '1rem',
                        padding: '1rem 1.5rem',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      <Download size={20} color="#00f2ff" />
                      <span>Descargar</span>
                    </button>
                  </div>

                  <button
                    onClick={() => setShowResult(false)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-muted)',
                      marginTop: '1rem',
                      cursor: 'pointer',
                      fontSize: '0.95rem',
                      textDecoration: 'underline',
                      transition: 'color 0.3s ease'
                    }}
                    onMouseEnter={(e) => e.target.style.color = 'white'}
                    onMouseLeave={(e) => e.target.style.color = 'var(--text-muted)'}
                  >
                    ← Editar mensaje
                  </button>

                  <div style={{ marginTop: '2rem' }}>
                    <AdSlot label="Publicidad" adSlot="9155980495" adFormat="autorelaxed" />
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Ad Lateral Derecho (Desktop) */}
          <div className="side-ad-form right-ad" style={{ display: 'none' }}>
            <AdSlot label="Sponsor" adSlot="4095225502" adFormat="vertical" fullWidthResponsive="false" />
          </div>
        </div>
      )}

      {/* How It Works Section */}
      {!selectedTemplate && (
        <section id="como-funciona" style={{ marginTop: '8rem', marginBottom: '6rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{
              fontSize: 'clamp(2rem, 5vw, 3rem)',
              marginBottom: '1rem',
              background: 'linear-gradient(135deg, var(--secondary), var(--accent))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              ¿Cómo funciona la magia?
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
              Crear mensajes interactivos nunca fue tan fácil. Solo sigue estos 3 simples pasos
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem' }}>
            {STEPS.map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2 }}
                className="glass"
                style={{ padding: '2.5rem', position: 'relative', textAlign: 'center' }}
              >
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  background: `linear-gradient(135deg, ${TEMPLATES[idx % 3].color}, ${TEMPLATES[(idx + 1) % 3].color})`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.8rem',
                  fontWeight: '800',
                  margin: '0 auto 1.5rem',
                  boxShadow: `0 8px 25px ${TEMPLATES[idx % 3].color}40`
                }}>
                  {step.number}
                </div>
                <h3 style={{ fontSize: '1.4rem', marginBottom: '1rem' }}>{step.title}</h3>
                <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>{step.description}</p>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Final CTA */}
      {!selectedTemplate && (
        <section style={{ marginBottom: '6rem' }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass"
            style={{
              padding: 'clamp(3rem, 6vw, 5rem)',
              textAlign: 'center',
              background: 'linear-gradient(135deg, rgba(255, 0, 255, 0.1), rgba(0, 242, 255, 0.1))',
              border: '2px solid rgba(255, 0, 255, 0.3)'
            }}
          >
            <h2 style={{
              fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
              marginBottom: '1.5rem',
              background: 'linear-gradient(135deg, var(--primary), var(--accent))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              ¿Listo para crear tu primera experiencia?
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '2.5rem', maxWidth: '600px', margin: '0 auto 2.5rem' }}>
              Únete a miles de usuarios que ya están sorprendiendo a sus seres queridos con mensajes únicos e interactivos.
            </p>
            <button className="btn btn-primary" onClick={scrollToTemplates} style={{ fontSize: '1.2rem', padding: '1.3rem 3rem' }}>
              <Sparkles size={24} /> Comenzar Gratis
            </button>
          </motion.div>
        </section>
      )}

      {/* Ad Placeholder Section */}
      {!selectedTemplate && (
        <div className="container" style={{ marginTop: '4rem', marginBottom: '4rem' }}>
          <div className="glass" style={{ padding: '1rem', textAlign: 'center', borderStyle: 'dashed', background: 'rgba(255,255,255,0.02)' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '1rem' }}>Publicidad</p>
            <div style={{ minHeight: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {/* 
                  Actual AdSense Unit:
                  <ins className="adsbygoogle"
                       style={{ display: 'block' }}
                       data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
                       data-ad-slot="XXXXXXXXXX"
                       data-ad-format="auto"
                       data-full-width-responsive="true"></ins>
                  <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
                */}
              <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.9rem' }}>Anuncio Horizontal (FTY Style)</span>
            </div>
          </div>
        </div>
      )}

      {/* SLOT D: Footer Ad - Display */}
      {!selectedTemplate && (
        <AdSlot label="Recomendado para ti" adSlot="4095225502" />
      )}

      {/* Footer */}
      {!selectedTemplate && (
        <footer style={{ borderTop: '1px solid rgba(255,255,255,0.1)', padding: '3rem 0', marginTop: '4rem' }}>
          <div className="container">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '3rem', marginBottom: '3rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                  <Sparkles size={24} color="#ff00ff" />
                  <span style={{ fontSize: '1.3rem', fontWeight: '800' }}>InteractivoMagic</span>
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                  Transforma mensajes simples en experiencias mágicas e interactivas. Hecho con ❤️ para compartir.
                </p>
              </div>

              <div>
                <h4 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>Producto</h4>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <li><a href="#plantillas" style={{ color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.3s' }}>Plantillas</a></li>
                  <li><a href="#como-funciona" style={{ color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.3s' }}>Cómo funciona</a></li>
                  <li><a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.3s' }}>Precios</a></li>
                </ul>
              </div>

              <div>
                <h4 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>Compañía</h4>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <li><a href="#" onClick={(e) => { e.preventDefault(); setLegalModal('privacy'); }} style={{ color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.3s' }}>Privacidad</a></li>
                  <li><a href="#" onClick={(e) => { e.preventDefault(); setLegalModal('terms'); }} style={{ color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.3s' }}>Términos</a></li>
                  <li><a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.3s' }}>Contacto</a></li>
                </ul>
              </div>

              <div>
                <h4 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>Síguenos</h4>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <a href="#" className="social-link" style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', color: 'white' }}>F</a>
                  <a href="#" className="social-link" style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', color: 'white' }}>T</a>
                  <a href="#" className="social-link" style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', color: 'white' }}>I</a>
                </div>
              </div>
            </div>

            <div style={{ textAlign: 'center', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              © 2026 InteractivoMagic - Hecho con ❤️ para compartir momentos especiales
            </div>
          </div>
        </footer>
      )}

      <AnimatePresence>
        {legalModal && <LegalModal type={legalModal} onClose={() => setLegalModal(null)} />}
      </AnimatePresence>
    </div>
  );
}

export default App;
