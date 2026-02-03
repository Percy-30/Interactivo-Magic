import React, { useState, useEffect } from 'react';
import { X, Download, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { checkForUpdates, DOWNLOAD_LINKS } from '../config/versionConfig';
import { isNativePlatform } from '../utils/platformUtils';

const UpdateNotification = () => {
    const [updateInfo, setUpdateInfo] = useState(null);
    const [dismissed, setDismissed] = useState(false);
    const isMobile = isNativePlatform();

    useEffect(() => {
        // Solo verificar en apps móviles
        if (!isMobile) return;

        const checkVersion = async () => {
            const result = await checkForUpdates();
            if (result && result.hasUpdate) {
                console.log('[Version Check] Nueva versión disponible:', result.latestVersion);
                setUpdateInfo(result);
            } else if (result) {
                console.log('[Version Check] App actualizada:', result.currentVersion);
            }
        };

        // Verificar al montar
        checkVersion();

        // Verificar cada 6 horas
        const interval = setInterval(checkVersion, 6 * 60 * 60 * 1000);

        return () => clearInterval(interval);
    }, [isMobile]);

    if (!updateInfo || dismissed || !isMobile) {
        return null;
    }

    const handleUpdate = () => {
        // Intentar abrir Play Store primero si está disponible
        if (DOWNLOAD_LINKS.playStore && DOWNLOAD_LINKS.playStore !== '#') {
            window.open(DOWNLOAD_LINKS.playStore, '_blank');
        } else {
            // Si no hay Play Store, descargar APK directo
            window.open(DOWNLOAD_LINKS.apkDirect, '_blank');
        }
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -100, opacity: 0 }}
                transition={{ type: 'spring', damping: 20 }}
                style={{
                    position: 'fixed',
                    top: '20px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 9999,
                    maxWidth: '90%',
                    width: '400px'
                }}
            >
                <div
                    className="glass"
                    style={{
                        padding: '1.5rem',
                        borderRadius: '16px',
                        background: 'linear-gradient(135deg, rgba(255,77,148,0.2), rgba(124,58,237,0.2))',
                        border: '2px solid var(--primary)',
                        boxShadow: '0 10px 40px rgba(255,77,148,0.3)',
                        backdropFilter: 'blur(20px)'
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                        <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '12px',
                            background: 'var(--primary)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                        }}>
                            <AlertCircle size={24} color="white" />
                        </div>

                        <div style={{ flex: 1 }}>
                            <h3 style={{
                                margin: '0 0 0.5rem 0',
                                fontSize: '1.1rem',
                                fontWeight: '800',
                                color: 'white'
                            }}>
                                Nueva Versión Disponible 🎉
                            </h3>
                            <p style={{
                                margin: '0 0 1rem 0',
                                fontSize: '0.9rem',
                                color: 'rgba(255,255,255,0.8)',
                                lineHeight: '1.4'
                            }}>
                                Versión <strong style={{ color: 'var(--primary)' }}>{updateInfo.latestVersion}</strong> disponible.
                                {' '}
                                Estás usando <strong>{updateInfo.currentVersion}</strong>
                            </p>

                            {updateInfo.whatsNew && updateInfo.whatsNew.length > 0 && (
                                <div style={{
                                    marginBottom: '1rem',
                                    padding: '0.8rem',
                                    background: 'rgba(0,0,0,0.2)',
                                    borderRadius: '8px',
                                    fontSize: '0.85rem'
                                }}>
                                    <strong style={{ color: 'white', marginBottom: '0.3rem', display: 'block' }}>
                                        ✨ Novedades:
                                    </strong>
                                    <ul style={{
                                        margin: '0',
                                        paddingLeft: '1.2rem',
                                        color: 'rgba(255,255,255,0.7)',
                                        lineHeight: '1.5'
                                    }}>
                                        {updateInfo.whatsNew.slice(0, 3).map((item, idx) => (
                                            <li key={idx}>{item}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                <button
                                    onClick={handleUpdate}
                                    style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        padding: '0.7rem 1.2rem',
                                        background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                                        border: 'none',
                                        borderRadius: '10px',
                                        color: 'white',
                                        textDecoration: 'none',
                                        fontSize: '0.9rem',
                                        fontWeight: '700',
                                        cursor: 'pointer',
                                        transition: 'transform 0.2s',
                                        boxShadow: '0 4px 12px rgba(255,77,148,0.3)'
                                    }}
                                    onMouseDown={(e) => {
                                        e.target.style.transform = 'scale(0.95)';
                                    }}
                                    onMouseUp={(e) => {
                                        e.target.style.transform = 'scale(1)';
                                    }}
                                >
                                    <Download size={16} />
                                    Actualizar Ahora
                                </button>

                                <button
                                    onClick={() => setDismissed(true)}
                                    style={{
                                        padding: '0.7rem 1.2rem',
                                        background: 'rgba(255,255,255,0.1)',
                                        border: '1px solid rgba(255,255,255,0.2)',
                                        borderRadius: '10px',
                                        color: 'white',
                                        fontSize: '0.9rem',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    Más tarde
                                </button>
                            </div>
                        </div>

                        <button
                            onClick={() => setDismissed(true)}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: 'rgba(255,255,255,0.6)',
                                cursor: 'pointer',
                                padding: '0',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '24px',
                                height: '24px',
                                borderRadius: '50%',
                                transition: 'all 0.2s'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.background = 'rgba(255,255,255,0.1)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.background = 'none';
                            }}
                        >
                            <X size={18} />
                        </button>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default UpdateNotification;
