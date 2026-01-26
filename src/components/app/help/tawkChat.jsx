'use client'

import { useEffect } from 'react'

export default function TawkChat({ name, email }) {
  useEffect(() => {
    window.Tawk_API = window.Tawk_API || {};
    window.Tawk_LoadStart = new Date();

    const s1 = document.createElement("script");
    const s0 = document.getElementsByTagName("script")[0];
    s1.async = true;
    s1.src = 'https://embed.tawk.to/69777aa320b0fa1985223652/1jftbe47t';
    s1.charset = 'UTF-8';
    s1.setAttribute('crossorigin', '*');
    
    if (s0 && s0.parentNode) {
      s0.parentNode.insertBefore(s1, s0);
    }

    window.Tawk_API.onLoad = function () {
      // 1. Hide the default floating bubble immediately
      window.Tawk_API.hideWidget();
      
      // 2. Set user identity
      window.Tawk_API.setAttributes({
        'name': name || 'Guest User',
        'email': email || '',
      }, function (error) {});
    };

    // When chat is closed by user, hide it again so it doesn't leave the bubble
    window.Tawk_API.onChatMaximized = function(){
       // Optional: logic when window opens
    };
    
    window.Tawk_API.onChatMinimized = function(){
       window.Tawk_API.hideWidget();
    };

    return () => { s1.remove(); };
  }, [name, email]);

  return null;
}