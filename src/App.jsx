import React, { useState, useEffect } from 'react';
import {
  Heart, Send, Gift, Sparkles, Download, ArrowRight, Music, Calendar, User,
  Link as LinkIcon, Check, Menu, X, Star, Zap, Users, Share2, Search,
  Filter, Gamepad, BookOpen, UserPlus, Image, Music2, Camera, Clock,
  Stamp, Shirt, Ghost, Pill, Layers, RefreshCcw, Smile, PartyPopper,
  TreePine, Flame, Eye, Lock, Minus
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import TemplateEngine from './utils/TemplateEngine';
import {
  GALAXY_TEMPLATE, LOVE_TEMPLATE, BIRTHDAY_TEMPLATE,
  BOOK_LOVE_TEMPLATE, MARVEL_BOOK_TEMPLATE, GALAXY_GENERATOR_TEMPLATE,
  MUSICAL_SPHERE_TEMPLATE, PROPOSAL_TEMPLATE, FORGIVE_ME_CATS_TEMPLATE,
  PUZZLE_LOVE_TEMPLATE, RULETA_LOVE_TEMPLATE, FORGIVE_ME_PENGUINS_TEMPLATE,
  FLOWERS_RAMO_TEMPLATE, ENOJONA_TEMPLATE, DATE_COUNTER_TEMPLATE,
  LOVE_CERTIFICATE_TEMPLATE, COUPLE_INITIALS_TEMPLATE, ENCHANTED_LETTER_TEMPLATE,
  LOVE_VITAMINS_TEMPLATE, SCRATCH_MESSAGE_TEMPLATE, SOCCER_CARD_TEMPLATE,
  BIRTHDAY_LAMP_TEMPLATE, DEDICATE_SONG_TEMPLATE, POCOYO_DANCE_TEMPLATE,
  BE_MY_BOYFRIEND_TEMPLATE, TE_AMO_TEMPLATE, BE_FRIENDS_TEMPLATE,
  HEART_PHOTO_TEMPLATE, OUR_YEAR_TEMPLATE, CHRISTMAS_TREE_TEMPLATE,
  NEW_YEAR_TEMPLATE, LAST_CHANCE_TEMPLATE, HIDDEN_MESSAGE_TEMPLATE
} from './templates';
import { isNativePlatform, shareContent, shareHTMLFile } from './utils/platformUtils';
import { getBaseUrl } from './config/appConfig';
import { shortenUrl } from './utils/urlShortener';
import { initializeAdMob, showBannerAd, showRewardedAd, showInterstitial, prepareRewardedAd, hideBannerAd } from './utils/admobUtils';
import { getAdSenseClientId } from './config/adsenseConfig';
import './styles/index.css';

const CATEGORIES = [
  { id: 'todos', name: 'Todos', icon: <Layers size={18} /> },
  { id: 'amor', name: 'Amor', icon: <Heart size={18} /> },
  { id: 'juegos', name: 'Juegos', icon: <Gamepad size={18} /> },
  { id: 'eventos', name: 'Eventos', icon: <Calendar size={18} /> },
  { id: 'divertido', name: 'Divertido', icon: <Smile size={18} /> }
];

const TEMPLATES = [
  {
    id: 'love',
    category: 'amor',
    name: 'Galaxia de Amor',
    description: 'Corazones flotantes y estrellas animadas.',
    icon: <Heart />,
    color: '#ff4d94',
    content: GALAXY_TEMPLATE,
    hasImage: false,
    hasExtra: false
  },
  {
    id: 'book-love',
    category: 'amor',
    name: 'Libro del Amor',
    description: 'Carta digital con efecto libro 3D.',
    icon: <BookOpen />,
    color: '#ff4d94',
    content: BOOK_LOVE_TEMPLATE,
    hasImage: true,
    hasItems: true,
    pageOffset: 3
  },
  {
    id: 'marvel-book',
    category: 'divertido',
    name: 'Libro Marvel ❤️',
    description: 'Versión especial de superhéroes.',
    icon: <Zap />,
    color: '#ed1d24',
    content: MARVEL_BOOK_TEMPLATE,
    hasImage: true,
    hasItems: true,
    pageOffset: 3
  },
  {
    id: 'galaxy-gen',
    category: 'amor',
    name: 'Generador de Galaxia ⭐',
    description: 'Escribe nombres y frases estelares.',
    icon: <Star />,
    color: '#7000ff',
    content: GALAXY_GENERATOR_TEMPLATE,
    hasImage: false,
    hasExtra: true,
    extraLabel: 'Palabras flotantes (separadas por comas)',
    hideRecipientName: false
  },
  {
    id: 'musical-sphere',
    category: 'amor',
    name: 'Esfera Musical 🎶',
    description: 'Esfera 3D que vibra con tu música.',
    icon: <Music />,
    color: '#00f2ff',
    content: MUSICAL_SPHERE_TEMPLATE,
    hasImage: true,
    hasExtra: true,
    extraLabel: '✨ Frase en la esfera (si no subes foto)'
  },
  {
    id: 'proposal',
    category: 'amor',
    name: 'Propuesta 💖',
    description: 'Dile que sea tu novi@ sin un NO.',
    icon: <Sparkles />,
    color: '#ff00ff',
    content: PROPOSAL_TEMPLATE,
    hasImage: false,
    hasExtra: true,
    extraLabel: 'Frase bajo la propuesta'
  },
  {
    id: 'forgive-cats',
    category: 'divertido',
    name: 'Me Perdonas 😳',
    description: 'Gatitos lindos para pedir perdón.',
    icon: <Smile />,
    color: '#ffa500',
    content: FORGIVE_ME_CATS_TEMPLATE,
    hasImage: false,
    hasExtra: true,
    extraLabel: 'Frase final'
  },
  {
    id: 'puzzle-love',
    category: 'juegos',
    name: 'Puzzle del Amor 💫',
    description: 'Crea un rompecabezas con su foto.',
    icon: <Gamepad />,
    color: '#ff4d94',
    content: PUZZLE_LOVE_TEMPLATE,
    hasImage: true,
    hasExtra: true,
    extraLabel: 'Mensaje al ganar'
  },
  {
    id: 'ruleta-love',
    category: 'juegos',
    name: 'Ruleta del Amor 💖',
    description: 'Una ruleta que siempre sale Sí.',
    icon: <RefreshCcw />,
    color: '#ff007f',
    content: RULETA_LOVE_TEMPLATE,
    hasImage: false,
    hasExtra: true,
    extraLabel: 'Mensaje central'
  },
  {
    id: 'forgive-penguins',
    category: 'divertido',
    name: 'Perdón Mi Amor 🐧',
    description: 'Divertidos pingüinos para disculparse.',
    icon: <Smile />,
    color: '#0080ff',
    content: FORGIVE_ME_PENGUINS_TEMPLATE,
    hasImage: false,
    hasExtra: true,
    extraLabel: 'Texto final'
  },
  {
    id: 'flowers-ramo',
    category: 'amor',
    name: 'Ramo de Flores 🌸',
    description: 'Regálale un hermoso ramo digital.',
    icon: <Gift />,
    color: '#ff80bf',
    content: FLOWERS_RAMO_TEMPLATE,
    hasImage: true,
    hasExtra: true,
    extraLabel: 'Nota del ramo'
  },
  {
    id: 'enojona',
    category: 'divertido',
    name: 'Mi Enojona 😡',
    description: 'Gifs y música para tu enojona.',
    icon: <Flame />,
    color: '#ff4000',
    content: ENOJONA_TEMPLATE,
    hasImage: true,
    hasExtra: true,
    extraLabel: 'Texto final'
  },
  {
    id: 'date-counter',
    category: 'eventos',
    name: 'Contador Especial 📅',
    description: 'Reloj neón para fechas clave.',
    icon: <Clock />,
    color: '#00ffcc',
    content: DATE_COUNTER_TEMPLATE,
    hasImage: false,
    hasExtra: true,
    extraLabel: 'Título del evento'
  },
  {
    id: 'love-cert',
    category: 'amor',
    name: 'Certificado Amor',
    description: 'Crea tu certificado con huella.',
    icon: <Stamp />,
    color: '#ffd700',
    content: LOVE_CERTIFICATE_TEMPLATE,
    hasImage: true,
    hasExtra: true,
    extraLabel: 'Cargo especial'
  },
  {
    id: 'initials',
    category: 'amor',
    name: 'Iniciales Pareja 👥',
    description: 'Tus letras en personajes animados.',
    icon: <Shirt />,
    color: '#ff4d94',
    content: COUPLE_INITIALS_TEMPLATE,
    hasImage: true,
    hasExtra: true,
    hasExtra2: true,
    extraLabel: 'Inicial Ella',
    extra2Label: 'Inicial Él'
  },
  {
    id: 'enchanted-letter',
    category: 'amor',
    name: 'Carta Encantada 🎃',
    description: 'Especial Halloween para tu amor.',
    icon: <Ghost />,
    color: '#ff8000',
    content: ENCHANTED_LETTER_TEMPLATE,
    hasImage: true,
    hasExtra: true,
    extraLabel: 'Post Data (PD)'
  },
  {
    id: 'vitamins',
    category: 'divertido',
    name: 'Vitaminas Amor 💊',
    description: 'Dile que te falta su vitamina A, B...',
    icon: <Pill />,
    color: '#ff0000',
    content: LOVE_VITAMINS_TEMPLATE,
    hasImage: true,
    hasExtra: true,
    extraLabel: 'Mensaje final'
  },
  {
    id: 'scratch',
    category: 'juegos',
    name: 'Mensaje Raspa',
    description: 'Carta creativa de raspa y raspa.',
    icon: <Gamepad />,
    color: '#c0c0c0',
    content: SCRATCH_MESSAGE_TEMPLATE,
    hasImage: true,
    hasExtra: true,
    extraLabel: 'Premio oculto'
  },
  {
    id: 'soccer-card',
    category: 'divertido',
    name: 'Tarjeta Futbolista ⚽',
    description: 'Tarjeta estilo FIFA para amigos.',
    icon: <Zap />,
    color: '#4caf50',
    content: SOCCER_CARD_TEMPLATE,
    hasImage: true,
    hasExtra: true,
    extraLabel: 'Posición/Rating'
  },
  {
    id: 'birthday',
    category: 'eventos',
    name: 'Feliz Cumpleaños 🎂',
    description: 'Dedicatoria con lámpara creativa.',
    icon: <Gift />,
    color: '#ffeb3b',
    content: BIRTHDAY_LAMP_TEMPLATE,
    hasImage: true,
    hasExtra: true,
    extraLabel: 'Mensaje en tarjeta'
  },
  {
    id: 'dedicate-song',
    category: 'amor',
    name: 'Te la Dedico 🎶',
    description: 'Reproductor con letra y fondo.',
    icon: <Music2 />,
    color: '#ff4d94',
    content: DEDICATE_SONG_TEMPLATE,
    hasImage: true,
    hasExtra: true,
    extraLabel: 'Dedicado a...'
  },
  {
    id: 'pocoyo',
    category: 'divertido',
    name: 'Pocoyo 🎶',
    description: 'Haz bailar a Pocoyo interactivo.',
    icon: <Music />,
    color: '#03a9f4',
    content: POCOYO_DANCE_TEMPLATE,
    hasImage: true,
    hasExtra: true,
    extraLabel: 'Frase flotante'
  },
  {
    id: 'be-my-gf',
    category: 'amor',
    name: '¿Quieres ser novi@? 💞',
    description: 'El NO se mueve sin parar.',
    icon: <Heart />,
    color: '#e91e63',
    content: BE_MY_BOYFRIEND_TEMPLATE,
    hasImage: false,
    hasExtra: true,
    extraLabel: 'Mensaje persuasivo'
  },
  {
    id: 'te-amo',
    category: 'amor',
    name: 'Te Amo 💞',
    description: 'Corazón mágico que se forma.',
    icon: <Heart />,
    color: '#f44336',
    content: TE_AMO_TEMPLATE,
    hasImage: false,
    hasExtra: true,
    extraLabel: 'Subtítulo'
  },
  {
    id: 'be-friends',
    category: 'divertido',
    name: 'Amig@s? 👥',
    description: 'Pide volver con este detalle.',
    icon: <Users />,
    color: '#9c27b0',
    content: BE_FRIENDS_TEMPLATE,
    hasImage: false,
    hasExtra: true,
    extraLabel: 'Posdata'
  },
  {
    id: 'heart-photo',
    category: 'amor',
    name: 'Crear Corazón 💫',
    description: 'Corazón con 25 fotos favoritas.',
    icon: <Camera />,
    color: '#ff4081',
    content: HEART_PHOTO_TEMPLATE,
    hasImage: true,
    hasExtra: true,
    extraLabel: 'Título del collage'
  },
  {
    id: 'our-year',
    category: 'eventos',
    name: 'Nuestro Año 💫',
    description: '12 fotos por cada mes juntos.',
    icon: <Image />,
    color: '#2196f3',
    content: OUR_YEAR_TEMPLATE,
    hasImage: true,
    hasExtra: true,
    extraLabel: 'Dedicatoria temporal'
  },
  {
    id: 'christmas',
    category: 'eventos',
    name: 'Arbol Navidad 🎁',
    description: 'Árbol con las fotos de tu amor.',
    icon: <TreePine />,
    color: '#2e7d32',
    content: CHRISTMAS_TREE_TEMPLATE,
    hasImage: true,
    hasExtra: true,
    extraLabel: 'Deseo navideño'
  },
  {
    id: 'new-year',
    category: 'eventos',
    name: 'Feliz Año 💥',
    description: 'Festeja el inicio de este 2026.',
    icon: <PartyPopper />,
    color: '#fdd835',
    content: NEW_YEAR_TEMPLATE,
    hasImage: false,
    hasExtra: true,
    extraLabel: 'Propósito de año nuevo'
  },
  {
    id: 'last-chance',
    category: 'amor',
    name: 'Última Oportunidad 😊',
    description: 'No podrá resistirse al final.',
    icon: <Lock />,
    color: '#5d4037',
    content: LAST_CHANCE_TEMPLATE,
    hasImage: false,
    hasExtra: true,
    extraLabel: 'Grito desesperado (broma)'
  },
  {
    id: 'hidden-msg',
    category: 'amor',
    name: 'Mensaje Oculto 🤭',
    description: 'Oculto entre las estrellas.',
    icon: <Eye />,
    color: '#3f51b5',
    content: HIDDEN_MESSAGE_TEMPLATE,
    hasImage: false,
    hasExtra: true,
    extraLabel: 'Pista del mensaje'
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
      body: `En InteractivoMagic, valoramos tu privacidad. 

1. Información: No recolectamos datos personales identificables. Los nombres y mensajes que ingresas se guardan localmente en la URL generada.
2. Anuncios: Utilizamos Google AdMob para mostrar publicidad. AdMob puede recopilar datos técnicos (ID de publicidad, modelo de dispositivo) para personalizar anuncios.
3. Archivos: Si subes un audio, este se procesa localmente para generar la experiencia, no se almacena en nuestros servidores.
4. Consentimiento: Al usar la app, aceptas esta política.`
    },
    terms: {
      title: 'Términos de Servicio',
      body: `1. Uso: La app es para uso personal y creativo. Queda prohibido generar contenido ofensivo o ilegal.
2. Responsabilidad: El usuario es el único responsable del contenido compartido a través de los links generados.
3. Disponibilidad: No garantizamos el funcionamiento ininterrumpido del servicio debido a factores técnicos externos.
4. Cambios: Nos reservamos el derecho de actualizar estos términos en cualquier momento para mejorar el servicio.`
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

// Ultra-aggressive image compression for URL sharing
const compressImage = (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // Aggressive size reduction - max 400px on longest side
        let width = img.width;
        let height = img.height;
        const maxSize = 400;

        if (width > height) {
          if (width > maxSize) {
            height = (height * maxSize) / width;
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width = (width * maxSize) / height;
            height = maxSize;
          }
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        // Very aggressive quality - 50% (0.5)
        const compressed = canvas.toDataURL('image/jpeg', 0.5);
        resolve(compressed);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
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
  const [errors, setErrors] = useState({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    sender: '',
    message: '',
    extraText: '',
    extraText2: '',
    hasAudio: true,
    audioOption: 'youtube', // 'upload', 'youtube'
    audioSrc: '',
    youtubeUrl: '',
    audioFile: null,
    hasImage: false,
    imageOption: 'url', // 'url', 'upload'
    imageSrc: '',
    imageFile: null,
    items: []
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('todos');
  const [expandedSections, setExpandedSections] = useState({ text: true, image: true });
  const [extraSlots, setExtraSlots] = useState(0);
  const BASE_DYNAMIC_LIMIT = 5;

  // Reset and initialize items when template changes
  useEffect(() => {
    if (selectedTemplate) {
      setFormData(prev => ({ ...prev, items: [] }));
      setExtraSlots(0); // Reset rewards too
    }
  }, [selectedTemplate]);

  // Check platform and viewer mode on load
  useEffect(() => {
    // Detect if running in native mobile app
    const isNative = isNativePlatform();
    setIsMobileApp(isNative);

    // Initialize AdMob and show ads if on mobile
    if (isNative) {
      initializeAdMob().then(() => {
        // Show banner ad at bottom
        showBannerAd();
        // Show startup interstitial ad
        showInterstitial();
        // Pre-load rewarded ad for later
        prepareRewardedAd();
      });
    }

    // Check for viewer mode
    const params = new URLSearchParams(window.location.search);
    const data = params.get('msg');
    if (data) {
      try {
        const decodedString = decodeURIComponent(escape(atob(data)));
        const decoded = JSON.parse(decodedString);
        const tpl = TEMPLATES.find(t => t.id === decoded.t);
        if (tpl) {
          // Ensure audioOption is reconstructed correctly from data
          const reconstructedAudioOption = decoded.yt ? 'youtube' : (decoded.src === 'uploaded' ? 'upload' : 'default');
          setViewData({
            ...decoded,
            html: tpl.content,
            audioOption: reconstructedAudioOption,
            imageSrc: decoded.img || '',
            extraText: decoded.et || '',
            extraText2: decoded.et2 || ''
          });
        }
      } catch (e) {
        console.error("Error decoding message:", e);
      }
    }
  }, []);

  const compressImage = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new window.Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          const max_size = 250; // Balanced for quality and URL limits

          if (width > height) {
            if (width > max_size) {
              height *= max_size / width;
              width = max_size;
            }
          } else {
            if (height > max_size) {
              width *= max_size / height;
              height = max_size;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.5)); // 50% quality JPEG
        };
      };
    });
  };

  const handleDownload = () => {
    const shareUrl = getShareUrl();
    TemplateEngine.generate(shareUrl, formData);
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
      yt: formData.audioOption === 'youtube' ? extractSocialId(formData.youtubeUrl, 'youtube') : null,
      img: formData.imageSrc || null,
      et: formData.extraText || null,
      et2: formData.extraText2 || null
    };
    const jsonStr = JSON.stringify(dataObj);
    const encoded = btoa(unescape(encodeURIComponent(jsonStr)));
    const baseUrl = getBaseUrl();
    return `${baseUrl}/?msg=${encoded}`;
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(generatedUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleGenerate = async () => {
    const newErrors = {};
    if (!selectedTemplate.hideRecipientName && (!formData.name || !formData.name.trim())) {
      newErrors.name = '¿Cómo se llama la persona especial?';
    }
    if (!formData.sender.trim()) newErrors.sender = 'Dinos quién envía el mensaje';
    if (!formData.message.trim()) newErrors.message = '¡Escribe unas palabras mágicas!';

    if (selectedTemplate.id === 'galaxy-gen' && (!formData.extraText || !formData.extraText.trim())) {
      newErrors.extraText = 'Por favor, ingresa algunas palabras para la galaxia.';
    }

    if (selectedTemplate.id === 'musical-sphere' && !formData.youtubeUrl.trim()) {
      newErrors.youtube = 'Esta plantilla requiere un link de YouTube obligatorio.';
    }

    if (formData.hasAudio) {
      if (formData.audioOption === 'upload' && !formData.audioFile) {
        newErrors.audio = 'Por favor, sube un archivo de audio.';
      }
      if (formData.audioOption === 'youtube' && !formData.youtubeUrl.trim()) {
        newErrors.youtube = 'Por favor, ingresa un link de YouTube.';
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      // Scroll to the first error
      const firstError = Object.keys(newErrors)[0];
      const element = document.getElementsByName(firstError)[0] || document.getElementById('audio-section');
      element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setErrors({});
    setIsGenerating(true);

    try {
      // Show Rewarded Interstitial ad in mobile app before generating result
      if (isMobileApp) {
        try {
          await showRewardedAd();
        } catch (e) {
          console.error("Ad error, proceeding anyway:", e);
        }
      }

      const longUrl = getShareUrl();
      const shortUrl = await shortenUrl(longUrl);
      setGeneratedUrl(shortUrl);
      setShowResult(true);
    } catch (err) {
      console.error("Generation error:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const scrollToTemplates = () => {
    document.getElementById('templates-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  // If in View Mode, show the template inside an iframe
  if (viewData) {
    const finalHtml = TemplateEngine.render(viewData.html, {
      ...viewData,
      pageOffset: selectedTemplate?.pageOffset || viewData.pageOffset,
      audio: viewData.audio || viewData.hasAudio,
      audioSrc: viewData.audioSrc || (viewData.src !== 'default' && viewData.src !== 'uploaded' ? viewData.src : ''),
      youtubeUrl: viewData.youtubeUrl || (viewData.yt ? `https://youtube.com/watch?v=${viewData.yt}` : ''),
      imageSrc: viewData.imageSrc || viewData.img || '',
      img: viewData.imageSrc || viewData.img || ''
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

          {/* Search and Category Filters */}
          <div className="container" style={{ marginBottom: '3rem' }}>
            <div className="glass" style={{ padding: '1.5rem', borderRadius: '24px' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
                {/* Search Bar */}
                <div style={{ position: 'relative', flexGrow: 1, maxWidth: '500px' }}>
                  <Search size={20} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)' }} />
                  <input
                    type="text"
                    placeholder="Busca una plantilla... (ej: Marvel, Amor)"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                      paddingLeft: '45px',
                      borderRadius: '15px',
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      width: '100%'
                    }}
                  />
                </div>

                {/* Categories */}
                <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem', scrollbarWidth: 'none' }}>
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.6rem 1.2rem',
                        borderRadius: '12px',
                        whiteSpace: 'nowrap',
                        background: activeCategory === cat.id ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                        border: '1px solid',
                        borderColor: activeCategory === cat.id ? 'var(--primary)' : 'rgba(255,255,255,0.1)',
                        color: 'white',
                        cursor: 'pointer',
                        transition: 'all 0.3s'
                      }}
                    >
                      {cat.icon}
                      <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>{cat.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem',
            padding: '0 1rem'
          }}>
            {TEMPLATES
              .filter(t => {
                const matchesSearch = t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  t.description.toLowerCase().includes(searchTerm.toLowerCase());
                const matchesCategory = activeCategory === 'todos' || t.category === activeCategory;
                return matchesSearch && matchesCategory;
              })
              .map((tpl, idx) => (
                <motion.div
                  key={tpl.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.15 }}
                  className="glass card template-card"
                  onClick={() => {
                    // Simply select template (ads moved to Generate button for better UX)
                    setSelectedTemplate(tpl);
                    // Pre-load rewarded ad while user fills the form
                    if (isMobileApp) {
                      prepareRewardedAd();
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

          {isMobileApp && (
            <div style={{ textAlign: 'center', marginTop: '3rem', opacity: 0.6 }}>
              <button
                onClick={() => window.open('https://interactivomagic.ftydownloader.com/politica-privacidad.html', '_blank')}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.85rem', textDecoration: 'underline', cursor: 'pointer' }}
              >
                Política de Privacidad
              </button>
            </div>
          )}
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
                  {!selectedTemplate.hideRecipientName && (
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Nombre del Destinatario</label>
                      <input
                        name="name"
                        placeholder="Ej: Mi Amor"
                        value={formData.name}
                        onFocus={() => isMobileApp && hideBannerAd()}
                        onBlur={() => isMobileApp && showBannerAd()}
                        onChange={(e) => {
                          setFormData({ ...formData, name: e.target.value });
                          if (errors.name) setErrors({ ...errors, name: null });
                        }}
                        style={{
                          borderColor: errors.name ? 'var(--primary)' : 'rgba(255,255,255,0.12)',
                          boxShadow: errors.name ? '0 0 15px rgba(255, 77, 148, 0.3)' : 'none'
                        }}
                      />
                      {errors.name && <p style={{ color: 'var(--primary)', fontSize: '0.85rem', marginTop: '0.5rem', fontWeight: '500' }}>{errors.name}</p>}
                    </div>
                  )}
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Tu Nombre</label>
                    <input
                      name="sender"
                      placeholder="Tu nombre"
                      value={formData.sender}
                      onFocus={() => isMobileApp && hideBannerAd()}
                      onBlur={() => isMobileApp && showBannerAd()}
                      onChange={(e) => {
                        setFormData({ ...formData, sender: e.target.value });
                        if (errors.sender) setErrors({ ...errors, sender: null });
                      }}
                      style={{
                        borderColor: errors.sender ? 'var(--primary)' : 'rgba(255,255,255,0.12)',
                        boxShadow: errors.sender ? '0 0 15px rgba(255, 77, 148, 0.3)' : 'none'
                      }}
                    />
                    {errors.sender && <p style={{ color: 'var(--primary)', fontSize: '0.85rem', marginTop: '0.5rem', fontWeight: '500' }}>{errors.sender}</p>}
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Mensaje Especial</label>
                    <textarea
                      name="message"
                      rows="4"
                      placeholder="Escribe algo lindo...."
                      value={formData.message}
                      onFocus={() => isMobileApp && hideBannerAd()}
                      onBlur={() => isMobileApp && showBannerAd()}
                      onChange={(e) => {
                        setFormData({ ...formData, message: e.target.value });
                        if (errors.message) setErrors({ ...errors, message: null });
                      }}
                      style={{
                        borderColor: errors.message ? 'var(--primary)' : 'rgba(255,255,255,0.12)',
                        boxShadow: errors.message ? '0 0 15px rgba(255, 77, 148, 0.3)' : 'none',
                        resize: 'none'
                      }}
                    />
                    {errors.message && <p style={{ color: 'var(--primary)', fontSize: '0.85rem', marginTop: '0.5rem', fontWeight: '500' }}>{errors.message}</p>}
                  </div>

                  <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    {selectedTemplate.hasExtra && (
                      <div style={{ flex: selectedTemplate.hasExtra2 ? '1 1 140px' : '1 1 100%' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                          {selectedTemplate.extraLabel || 'Texto Secundario'}
                        </label>
                        {selectedTemplate.id === 'initials' ? (
                          <input
                            name="extraText"
                            placeholder="A"
                            maxLength={1}
                            value={formData.extraText}
                            onChange={(e) => {
                              setFormData({ ...formData, extraText: e.target.value });
                              if (errors.extraText) setErrors({ ...errors, extraText: null });
                            }}
                            onFocus={() => isMobileApp && hideBannerAd()}
                            onBlur={() => isMobileApp && showBannerAd()}
                            style={{
                              textAlign: 'center',
                              fontSize: '1.2rem',
                              fontWeight: 'bold',
                              borderColor: errors.extraText ? 'var(--primary)' : 'rgba(255,255,255,0.12)',
                              boxShadow: errors.extraText ? '0 0 15px rgba(255, 77, 148, 0.3)' : 'none'
                            }}
                          />
                        ) : (
                          <textarea
                            name="extraText"
                            rows="3"
                            placeholder={selectedTemplate.id === 'galaxy-gen' ? 'Ej: Amor, Paz, Felicidad, Ternura, Mi Vida, Linda...' : 'Ej: Escribe aquí la frase o nota especial...'}
                            value={formData.extraText}
                            onChange={(e) => {
                              setFormData({ ...formData, extraText: e.target.value });
                              if (errors.extraText) setErrors({ ...errors, extraText: null });
                            }}
                            onFocus={() => isMobileApp && hideBannerAd()}
                            onBlur={() => isMobileApp && showBannerAd()}
                            style={{
                              fontSize: '0.9rem',
                              borderColor: errors.extraText ? 'var(--primary)' : 'rgba(255,255,255,0.12)',
                              boxShadow: errors.extraText ? '0 0 15px rgba(255, 77, 148, 0.3)' : 'none',
                              resize: 'none'
                            }}
                          />
                        )}
                        {errors.extraText && <p style={{ color: 'var(--primary)', fontSize: '0.85rem', marginTop: '0.5rem', fontWeight: '500' }}>{errors.extraText}</p>}
                      </div>
                    )}

                    {selectedTemplate.hasExtra2 && (
                      <div style={{ flex: '1 1 140px' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                          {selectedTemplate.extra2Label || 'Texto 2'}
                        </label>
                        {selectedTemplate.id === 'initials' ? (
                          <input
                            name="extraText2"
                            placeholder="B"
                            maxLength={1}
                            value={formData.extraText2}
                            onChange={(e) => setFormData({ ...formData, extraText2: e.target.value })}
                            onFocus={() => isMobileApp && hideBannerAd()}
                            onBlur={() => isMobileApp && showBannerAd()}
                            style={{ textAlign: 'center', fontSize: '1.2rem', fontWeight: 'bold' }}
                          />
                        ) : (
                          <input
                            name="extraText2"
                            value={formData.extraText2}
                            onChange={(e) => setFormData({ ...formData, extraText2: e.target.value })}
                            onFocus={() => isMobileApp && hideBannerAd()}
                            onBlur={() => isMobileApp && showBannerAd()}
                          />
                        )}
                      </div>
                    )}
                  </div>

                  {/* Image Section */}
                  {selectedTemplate.hasImage && (
                    <div style={{
                      padding: '1.5rem',
                      background: 'rgba(255, 255, 255, 0.03)',
                      borderRadius: '20px',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      marginBottom: '1rem'
                    }}>
                      <div
                        onClick={() => setFormData({ ...formData, hasImage: !formData.hasImage })}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginBottom: formData.hasImage ? '1.2rem' : '0',
                          padding: '1rem',
                          background: formData.hasImage ? 'rgba(77, 148, 255, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                          borderRadius: '15px',
                          cursor: 'pointer',
                          border: formData.hasImage ? '2px solid #00aaff' : '1px solid rgba(255, 255, 255, 0.1)',
                          transition: 'all 0.3s ease'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                          <div style={{
                            width: '45px',
                            height: '45px',
                            borderRadius: '12px',
                            background: formData.hasImage ? '#00aaff' : 'rgba(0, 170, 255, 0.2)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            <Image size={24} color="white" />
                          </div>
                          <div>
                            <p style={{ fontWeight: '800', fontSize: '1.1rem', margin: 0, color: 'white' }}>Foto de Portada</p>
                          </div>
                        </div>
                        <div style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          border: '2px solid white',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: formData.hasImage ? 'white' : 'transparent'
                        }}>
                          {formData.hasImage && <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#00aaff' }} />}
                        </div>
                      </div>

                      {formData.hasImage && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                        >
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.8rem', marginBottom: '1.2rem' }}>
                            {[
                              { id: 'url', label: 'Link Web', help: 'Pinterest/Google' },
                              { id: 'upload', label: 'Sube foto', help: 'Desde galería' }
                            ].map(opt => (
                              <button
                                key={opt.id}
                                onClick={() => setFormData({ ...formData, imageOption: opt.id })}
                                style={{
                                  padding: '0.8rem',
                                  borderRadius: '12px',
                                  border: formData.imageOption === opt.id ? '2px solid #00aaff' : '1px solid rgba(255,255,255,0.1)',
                                  background: formData.imageOption === opt.id ? 'rgba(0, 170, 255, 0.1)' : 'transparent',
                                  cursor: 'pointer',
                                  transition: 'all 0.3s'
                                }}
                              >
                                <p style={{ fontWeight: '700', fontSize: '0.9rem', margin: '0 0 2px 0', color: formData.imageOption === opt.id ? 'white' : 'var(--text-muted)' }}>{opt.label}</p>
                                <p style={{ fontSize: '0.65rem', margin: 0, color: 'var(--text-muted)' }}>{opt.help}</p>
                              </button>
                            ))}
                          </div>
                          <div style={{
                            padding: '0.8rem',
                            background: 'rgba(0, 170, 255, 0.08)',
                            borderRadius: '10px',
                            marginBottom: '1rem',
                            border: '1px solid rgba(0, 170, 255, 0.15)'
                          }}>
                            <p style={{ fontSize: '0.75rem', margin: 0, color: 'var(--text-muted)', lineHeight: '1.4' }}>
                              💡 <strong>Sube foto:</strong> Se comprime para compartir por link. <strong>Link Web:</strong> Usar para mejores resultados.
                            </p>
                          </div>

                          {formData.imageOption === 'url' ? (
                            <>
                              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Link de la Imagen</label>
                              <input
                                placeholder="https://ejemplo.com/foto.jpg"
                                value={formData.imageSrc}
                                onFocus={() => isMobileApp && hideBannerAd()}
                                onBlur={() => isMobileApp && showBannerAd()}
                                onChange={(e) => setFormData({ ...formData, imageSrc: e.target.value, hasImage: true })}
                                style={{ fontSize: '0.9rem', padding: '0.9rem' }}
                              />
                            </>
                          ) : (
                            <div style={{
                              padding: '1rem',
                              border: '1px dashed rgba(255,255,255,0.2)',
                              borderRadius: '12px',
                              textAlign: 'center'
                            }}>
                              <p style={{ fontSize: '0.85rem', marginBottom: '1rem', color: 'var(--text-muted)' }}>Selecciona una foto (Máx 2MB sugerido)</p>
                              <input
                                type="file"
                                accept="image/*"
                                id="image-upload"
                                style={{ display: 'none' }}
                                onChange={async (e) => {
                                  const file = e.target.files[0];
                                  if (file) {
                                    const compressed = await compressImage(file);
                                    setFormData({ ...formData, imageFile: file, imageSrc: compressed, hasImage: true });
                                  }
                                }}
                              />
                              <label htmlFor="image-upload" className="btn glass" style={{ padding: '0.6rem 1.2rem', fontSize: '0.9rem', width: '100%', justifyContent: 'center' }}>
                                {formData.imageFile ? `📸 ${formData.imageFile.name}` : 'Seleccionar Foto'}
                              </label>
                            </div>
                          )}
                        </motion.div>
                      )}
                    </div>
                  )}

                  {/* Dynamic Items Section for Books */}
                  {selectedTemplate.hasItems && (
                    <div className="dynamic-content-container">
                      {/* Section 1: Paragraphs */}
                      <div className="dynamic-section-group text-accent">
                        <div className={`action-row-card ${expandedSections.text ? 'expanded' : ''}`} onClick={() => {
                          setExpandedSections(prev => ({ ...prev, text: !prev.text }));
                        }}>
                          <div className="flex items-center gap-4">
                            <div className="action-row-icon text-accent">
                              <BookOpen size={20} />
                            </div>
                            <div className="action-row-body">
                              <span className="action-row-text">+ Agregar Párrafo</span>
                              <small className="action-row-hint">Añade un texto o dedicatoria</small>
                            </div>
                          </div>
                          <div className="card-radio-decoration">
                            {expandedSections.text && <div className="inner-dot"></div>}
                          </div>
                        </div>

                        <AnimatePresence>
                          {expandedSections.text && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="section-items-expandable"
                            >
                              <div className="section-actions-bar">
                                {formData.items.length < BASE_DYNAMIC_LIMIT + extraSlots ? (
                                  <button className="btn-add-inline text-accent" onClick={(e) => {
                                    e.stopPropagation();
                                    const newItem = { id: Date.now(), type: 'text', content: '' };
                                    setFormData({ ...formData, items: [...formData.items, newItem] });
                                  }}>
                                    + Nuevo Párrafo
                                  </button>
                                ) : (
                                  <button
                                    className="btn-add-inline text-accent"
                                    style={{ borderStyle: 'dashed', background: 'rgba(255,255,255,0.03)' }}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      showRewardedAd(() => {
                                        setExtraSlots(prev => prev + 1);
                                      });
                                    }}
                                  >
                                    📺 Desbloquear +1
                                  </button>
                                )}
                              </div>

                              <div className="dynamic-items-display-list">
                                {formData.items.filter(it => it.type === 'text').map((item, idx) => {
                                  const realIndex = formData.items.findIndex(it => it.id === item.id);
                                  return (
                                    <motion.div
                                      key={item.id}
                                      initial={{ opacity: 0, y: 10 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      className="dynamic-item-entry"
                                    >
                                      <div className="item-entry-header">
                                        <span className="item-entry-label">Párrafo {idx + 1}</span>
                                        <button
                                          className="item-entry-remove"
                                          onClick={() => {
                                            const newItems = [...formData.items];
                                            newItems.splice(realIndex, 1);
                                            setFormData({ ...formData, items: newItems });
                                          }}
                                        >
                                          <Minus size={14} /> Quitar
                                        </button>
                                      </div>
                                      <textarea
                                        className="item-text-input"
                                        placeholder="Escribe el mensaje..."
                                        value={item.content}
                                        rows={3}
                                        onFocus={() => isMobileApp && hideBannerAd()}
                                        onBlur={() => isMobileApp && showBannerAd()}
                                        onChange={(e) => {
                                          const newItems = [...formData.items];
                                          newItems[realIndex].content = e.target.value;
                                          setFormData({ ...formData, items: newItems });
                                        }}
                                      />
                                    </motion.div>
                                  );
                                })}
                                {formData.items.filter(it => it.type === 'text').length === 0 && (
                                  <div className="empty-section-tip">Aún no hay párrafos. Haz clic en "Nuevo Párrafo".</div>
                                )}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Section 2: Photos */}
                      <div className="dynamic-section-group image-accent" style={{ marginTop: '1rem' }}>
                        <div className={`action-row-card ${expandedSections.image ? 'expanded' : ''}`} onClick={() => {
                          setExpandedSections(prev => ({ ...prev, image: !prev.image }));
                        }}>
                          <div className="flex items-center gap-4">
                            <div className="action-row-icon image-accent">
                              <Camera size={20} />
                            </div>
                            <div className="action-row-body">
                              <span className="action-row-text">+ Agregar Fotografía</span>
                              <small className="action-row-hint">Sube una imagen especial</small>
                            </div>
                          </div>
                          <div className="card-radio-decoration">
                            {expandedSections.image && <div className="inner-dot"></div>}
                          </div>
                        </div>

                        <AnimatePresence>
                          {expandedSections.image && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="section-items-expandable"
                            >
                              <div className="section-actions-bar">
                                {formData.items.length < BASE_DYNAMIC_LIMIT + extraSlots ? (
                                  <button className="btn-add-inline image-accent" onClick={(e) => {
                                    e.stopPropagation();
                                    const newItem = { id: Date.now(), type: 'image', content: '', option: 'url' };
                                    setFormData({ ...formData, items: [...formData.items, newItem] });
                                  }}>
                                    + Nueva Foto
                                  </button>
                                ) : (
                                  <button
                                    className="btn-add-inline image-accent"
                                    style={{ borderStyle: 'dashed', background: 'rgba(255,255,255,0.03)' }}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      showRewardedAd(() => {
                                        setExtraSlots(prev => prev + 1);
                                      });
                                    }}
                                  >
                                    📺 Desbloquear +1
                                  </button>
                                )}
                              </div>

                              <div className="dynamic-items-display-list">
                                {formData.items.filter(it => it.type === 'image').map((item, idx) => {
                                  const realIndex = formData.items.findIndex(it => it.id === item.id);
                                  return (
                                    <motion.div
                                      key={item.id}
                                      initial={{ opacity: 0, y: 10 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      className="dynamic-item-entry"
                                    >
                                      <div className="item-entry-header">
                                        <span className="item-entry-label">Foto {idx + 1}</span>
                                        <button
                                          className="item-entry-remove"
                                          onClick={() => {
                                            const newItems = [...formData.items];
                                            newItems.splice(realIndex, 1);
                                            setFormData({ ...formData, items: newItems });
                                          }}
                                        >
                                          <Minus size={14} /> Quitar
                                        </button>
                                      </div>

                                      <div className="item-photo-refinement">
                                        <div className="mini-tabs-row">
                                          <button
                                            className={`mini-tab ${(!item.option || item.option === 'url') ? 'active' : ''}`}
                                            onClick={() => {
                                              const newItems = [...formData.items];
                                              newItems[realIndex].option = 'url';
                                              setFormData({ ...formData, items: newItems });
                                            }}
                                          >
                                            <div className="tab-label">Link Web</div>
                                            <div className="tab-hint">Pinterest/Google</div>
                                          </button>
                                          <button
                                            className={`mini-tab ${item.option === 'upload' ? 'active' : ''}`}
                                            onClick={() => {
                                              const newItems = [...formData.items];
                                              newItems[realIndex].option = 'upload';
                                              setFormData({ ...formData, items: newItems });
                                            }}
                                          >
                                            <div className="tab-label">Sube foto</div>
                                            <div className="tab-hint">Desde galería</div>
                                          </button>
                                        </div>

                                        <div className="item-hint-box">
                                          <p>💡 <strong>Sube foto:</strong> Se comprime para compartir. <strong>Link Web:</strong> Usar para mejores resultados.</p>
                                        </div>

                                        {(!item.option || item.option === 'url') ? (
                                          <div className="item-url-input-group">
                                            <input
                                              className="item-text-input micro"
                                              style={{ marginTop: '0.5rem' }}
                                              placeholder="Pega link de la foto aquí..."
                                              value={item.content}
                                              onFocus={() => isMobileApp && hideBannerAd()}
                                              onBlur={() => isMobileApp && showBannerAd()}
                                              onChange={(e) => {
                                                const newItems = [...formData.items];
                                                newItems[realIndex].content = e.target.value;
                                                setFormData({ ...formData, items: newItems });
                                              }}
                                            />
                                          </div>
                                        ) : (
                                          <div className="item-upload-zone">
                                            {item.content ? (
                                              <div className="item-preview-stack">
                                                <img src={item.content} alt="Preview" />
                                                <button className="item-image-replace" onClick={() => {
                                                  const input = document.createElement('input');
                                                  input.type = 'file';
                                                  input.accept = 'image/*';
                                                  input.onchange = async (e) => {
                                                    const file = e.target.files[0];
                                                    if (file) {
                                                      setIsGenerating(true);
                                                      const compressed = await compressImage(file);
                                                      const newItems = [...formData.items];
                                                      newItems[realIndex].content = compressed;
                                                      setFormData({ ...formData, items: newItems });
                                                      setIsGenerating(false);
                                                    }
                                                  };
                                                  input.click();
                                                }}>Cambiar Imagen</button>
                                              </div>
                                            ) : (
                                              <button className="btn-upload-placeholder" onClick={() => {
                                                const input = document.createElement('input');
                                                input.type = 'file';
                                                input.accept = 'image/*';
                                                input.onchange = async (e) => {
                                                  const file = e.target.files[0];
                                                  if (file) {
                                                    setIsGenerating(true);
                                                    const compressed = await compressImage(file);
                                                    const newItems = [...formData.items];
                                                    newItems[realIndex].content = compressed;
                                                    setFormData({ ...formData, items: newItems });
                                                    setIsGenerating(false);
                                                  }
                                                };
                                                input.click();
                                              }}>
                                                <Camera size={20} />
                                                <span>Seleccionar Foto</span>
                                              </button>
                                            )}
                                          </div>
                                        )}
                                      </div>
                                    </motion.div>
                                  );
                                })}
                                {formData.items.filter(it => it.type === 'image').length === 0 && (
                                  <div className="empty-section-tip">Aún no hay fotos. Haz clic en "Nueva Foto".</div>
                                )}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  )}

                  {/* Audio Selection Section */}
                  <div id="audio-section" style={{
                    padding: '1.5rem',
                    background: 'rgba(255, 255, 255, 0.03)',
                    borderRadius: '20px',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}>
                    <div
                      onClick={() => setFormData({ ...formData, hasAudio: !formData.hasAudio })}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '1.2rem',
                        padding: '1rem',
                        background: formData.hasAudio ? 'rgba(255, 77, 148, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '15px',
                        cursor: 'pointer',
                        border: formData.hasAudio ? '2px solid var(--primary)' : '1px solid rgba(255, 255, 255, 0.1)',
                        transition: 'all 0.3s ease'
                      }}
                      className="audio-toggle-card"
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                        <div style={{
                          width: '45px',
                          height: '45px',
                          borderRadius: '12px',
                          background: formData.hasAudio ? 'var(--primary)' : 'rgba(255, 0, 255, 0.2)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.3s'
                        }}>
                          <Music size={24} color="white" />
                        </div>
                        <div>
                          <p style={{ fontWeight: '800', fontSize: '1.1rem', margin: 0, color: 'white' }}>Música Mágica</p>
                          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>{formData.hasAudio ? 'Música activada ✨' : 'Click para añadir música'}</p>
                        </div>
                      </div>
                      <div style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        border: '2px solid white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: formData.hasAudio ? 'white' : 'transparent'
                      }}>
                        {formData.hasAudio && <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--primary)' }} />}
                      </div>
                    </div>

                    {formData.hasAudio && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        style={{ overflow: 'hidden' }}
                      >
                        {errors.audio || errors.youtube ? (
                          <div style={{ color: 'var(--primary)', fontSize: '0.85rem', marginBottom: '1rem', fontWeight: '500' }}>
                            ⚠️ {errors.audio || errors.youtube}
                          </div>
                        ) : null}
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
                                    if (errors.audio) setErrors({ ...errors, audio: null });
                                  };
                                  reader.readAsDataURL(file);
                                }
                              }}
                            />
                            <label htmlFor="audio-upload" className="btn glass" style={{ padding: '0.6rem 1.2rem', fontSize: '0.9rem', width: '100%', justifyContent: 'center' }}>
                              {formData.audioFile ? `🎶 ${formData.audioFile.name}` : 'Seleccionar Archivo'}
                            </label>
                          </div>
                        )}

                        {formData.audioOption === 'youtube' && (
                          <input
                            name="youtube"
                            placeholder="Link de YouTube (ej. https://youtube.com/...)"
                            value={formData.youtubeUrl}
                            onFocus={() => isMobileApp && hideBannerAd()}
                            onBlur={() => isMobileApp && showBannerAd()}
                            onChange={(e) => setFormData({ ...formData, youtubeUrl: e.target.value })}
                            style={{ fontSize: '0.9rem', padding: '0.9rem' }}
                          />
                        )}

                      </motion.div>
                    )}
                  </div>

                  <button
                    className="btn btn-primary"
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    style={{
                      width: '100%',
                      padding: '1.2rem',
                      fontSize: '1.1rem',
                      display: 'flex',
                      justifyContent: 'center',
                      gap: '0.8rem',
                      marginBottom: '1rem',
                      boxShadow: '0 8px 25px rgba(255, 0, 255, 0.3)',
                      opacity: isGenerating ? 0.7 : 1,
                      cursor: isGenerating ? 'not-allowed' : 'pointer'
                    }}
                  >
                    {isGenerating ? (
                      <>
                        <div className="loader-small" /> Preparando Magia...
                      </>
                    ) : (
                      <>
                        <Sparkles size={22} /> Generar Mensaje Mágico
                      </>
                    )}
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
                    onClick={() => setShowResult(false)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-muted)',
                      marginBottom: '0.5rem',
                      cursor: 'pointer',
                      fontSize: '0.95rem',
                      textDecoration: 'underline',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem'
                    }}
                  >
                    ← Volver a editar mensaje
                  </button>

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

                    {isMobileApp ? (
                      <button
                        className="btn glass"
                        onClick={async () => {
                          // Generate a friendly filename
                          const safeName = (formData.name || 'alguien').replace(/[^a-z0-9]/gi, '_').toLowerCase();
                          const safeSender = (formData.sender || 'tu').replace(/[^a-z0-9]/gi, '_').toLowerCase();
                          const templateSlug = selectedTemplate.id;
                          const fileName = `${templateSlug}_de_${safeSender}_para_${safeName}.html`;

                          // Create a simple redirect HTML content
                          const redirectHtml = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="refresh" content="0; url=${generatedUrl}">
    <script>window.location.href = "${generatedUrl}";</script>
    <title>Interactivo Magic ✨</title>
    <style>
        body { 
            background: #0a0a0c; 
            color: white; 
            display: flex; 
            flex-direction: column;
            justify-content: center; 
            align-items: center; 
            height: 100vh; 
            margin: 0;
            font-family: 'Segoe UI', system-ui, sans-serif;
            text-align: center;
        }
        .loader {
            border: 4px solid rgba(255, 255, 255, 0.1);
            border-left-color: #ff00ff;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
            margin-bottom: 20px;
        }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
    </style>
</head>
<body>
    <div class="loader"></div>
    <h3>Abriendo tu mensaje mágico...</h3>
    <p style="opacity: 0.6; font-size: 0.9rem;">Si no redirige automáticamente, <a href="${generatedUrl}" style="color: #00f2ff;">haz clic aquí</a>.</p>
</body>
</html>`;

                          await shareHTMLFile({
                            fileName,
                            htmlContent: redirectHtml
                          });
                        }}
                        style={{
                          justifyContent: 'center',
                          background: 'rgba(0, 242, 255, 0.15)',
                          border: '2px solid rgba(0, 242, 255, 0.4)',
                          fontSize: '1rem',
                          padding: '1rem 1.5rem',
                          transition: 'all 0.3s ease'
                        }}
                      >
                        <Share2 size={20} color="#00f2ff" />
                        <span>Compartir</span>
                      </button>
                    ) : (
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
                    )}
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
      )
      }

      {/* How It Works Section */}
      {
        !selectedTemplate && (
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
        )
      }

      {/* Final CTA */}
      {
        !selectedTemplate && (
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
        )
      }

      {/* Ad Placeholder Section */}
      {
        !selectedTemplate && !isMobileApp && (
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
        )
      }

      {/* SLOT D: Footer Ad - Display */}
      {
        !selectedTemplate && !isMobileApp && (
          <AdSlot label="Recomendado para ti" adSlot="4095225502" />
        )
      }

      {/* Footer */}
      {
        !selectedTemplate && !isMobileApp && (
          <footer style={{ borderTop: '1px solid rgba(255,255,255,0.1)', padding: '3rem 0', marginTop: '4rem' }}>
            <div className="container">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '3rem', marginBottom: '3rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                    <Sparkles size={24} color="#ff00ff" />
                    <span style={{ fontSize: '1.3rem', fontWeight: '800' }}>InteractivoMagic</span>
                  </div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                    Transforma mensajes simples en experiencias mágicas e interactivas. Hecho con  para compartir.
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
                    <li><a href="https://interactivomagic.ftydownloader.com/politica-privacidad.html" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.3s' }}>Privacidad</a></li>
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
                © 2026 InteractivoMagic - Hecho con  para compartir momentos especiales
              </div>
            </div>
          </footer>
        )
      }

      <AnimatePresence>
        {legalModal && <LegalModal type={legalModal} onClose={() => setLegalModal(null)} />}
      </AnimatePresence>
    </div >
  );
}

export default App;





