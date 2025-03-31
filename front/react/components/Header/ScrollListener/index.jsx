import React, { useState, useEffect } from 'react';
import './global.css'

const ScrollListener = ({ children }) => {
    const [lastScrollTop, setLastScrollTop] = useState(0);
    const [isVisible, setIsVisible] = useState(true);

    const handleScroll = () => {
        const currentScroll = window.pageYOffset || document.documentElement.scrollTop;

        if (currentScroll > lastScrollTop) {
            // Scroll para baixo
            setIsVisible(false);
        } else {
            // Scroll para cima
            setIsVisible(true);
        }

        setLastScrollTop(currentScroll <= 0 ? 0 : currentScroll);
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [lastScrollTop]);

    return (
        <div className='scroll-listener' style={{
            top: isVisible ? 0 : '-100%',
        }}>
            {children}
        </div>
    );
};

export default ScrollListener;
