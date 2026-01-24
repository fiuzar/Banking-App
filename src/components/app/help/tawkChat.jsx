'use client'

import { useEffect } from 'react'

export default function TawkChat({name, email}) {
  useEffect(() => {
    // 1. This part loads the script onto your page
    const s1 = document.createElement("script");
    const s0 = document.getElementsByTagName("script")[0];
    s1.async = true;
    s1.src = `https://embed.tawk.to/${process.env.NEXT_PUBLIC_TAWK_PROPERTY_ID}/DEFAULT`; // <-- USE YOUR ACTUAL ID HERE
    s1.charset = 'UTF-8';
    s1.setAttribute('crossorigin', '*');
    s0.parentNode?.insertBefore(s1, s0);

    // 2. This part tells Tawk to hide itself as soon as it loads
    window.Tawk_API = window.Tawk_API || {};
    window.Tawk_API.onLoad = function () {
      window.Tawk_API.hideWidget();
      window.Tawk_API.setAttributes({
        'name': name || 'User Name', // Replace with dynamic data from your Auth
        'email': email || 'user@example.com',
      }, function (error) { });
    };
  }, [name, email]);

  return null;
}