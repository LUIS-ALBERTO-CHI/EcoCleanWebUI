if(!self.define){let e,s={};const i=(i,n)=>(i=new URL(i+".js",n).href,s[i]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=i,e.onload=s,document.head.appendChild(e)}else e=i,importScripts(i),s()})).then((()=>{let e=s[i];if(!e)throw new Error(`Module ${i} didn’t register its module`);return e})));self.define=(n,r)=>{const a=e||("document"in self?document.currentScript.src:"")||location.href;if(s[a])return;let l={};const o=e=>i(e,a),c={module:{uri:a},exports:l,require:o};s[a]=Promise.all(n.map((e=>c[e]||o(e)))).then((e=>(r(...e),l)))}}define(["./workbox-d19f07db"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"assets/axios-ChMLasqM.js",revision:null},{url:"assets/critico-DyYp-VfV.png",revision:null},{url:"assets/Crud-Dz8xHvsm.js",revision:null},{url:"assets/Dashboard-Bc_4C6Kf.js",revision:null},{url:"assets/Dashboard-DY-XV4oW.css",revision:null},{url:"assets/estable-CSp7_r45.png",revision:null},{url:"assets/flags_responsive-DbRDn7iy.png",revision:null},{url:"assets/index-B2rjYbsp.js",revision:null},{url:"assets/index-BZ7j13yd.js",revision:null},{url:"assets/index-C9JxzN_M.css",revision:null},{url:"assets/index-DAHT0x5x.js",revision:null},{url:"assets/index-DtbE4VzT.js",revision:null},{url:"assets/Landing-B0nQcH7y.js",revision:null},{url:"assets/Login-B_6PC3SL.js",revision:null},{url:"assets/Login-CnbCDswS.css",revision:null},{url:"assets/lOGO-Bns2snCM.svg",revision:null},{url:"assets/medio-af8eAH-_.png",revision:null},{url:"assets/primeicons-BubJZjaf.svg",revision:null},{url:"assets/primeicons-DsZ1W7-Z.woff2",revision:null},{url:"assets/Register-CYRa2v-F.js",revision:null},{url:"compartimiento.png",revision:"c2d91e57b37842417f96e03b8726a725"},{url:"compartimiento192.png",revision:"8233eaac09095ffdf79322cd32f9e69f"},{url:"demo/images/access/asset-access.svg",revision:"8aca9ccd93b8c096c05a096fb957fda5"},{url:"demo/images/error/asset-error.svg",revision:"92f1c9cfdfe96c1b3791c7696a079bf9"},{url:"demo/images/flag/flag_placeholder.png",revision:"9ca993374546015a200b26cb03ba91e4"},{url:"demo/images/landing/enterprise.svg",revision:"fc841e3faf72938a5595cdf5270f0fbd"},{url:"demo/images/landing/free.svg",revision:"751208530b634ddd60ef9c904cd3d358"},{url:"demo/images/landing/image.png",revision:"c30cc374377c5786b65fe1e339c4bc9f"},{url:"demo/images/landing/imagen-mac.png",revision:"d58bafa6c6f7ad7f9f7221a5d731c57f"},{url:"demo/images/landing/mac.png",revision:"1afac42c20479c7e9b359e538d5a4f25"},{url:"demo/images/landing/mockup-desktop.svg",revision:"5b632fb5bf984d0107941aa906fe595f"},{url:"demo/images/landing/mockup.svg",revision:"1bfbe5cc0d9c72e538e3c75ff1135f84"},{url:"demo/images/landing/new-badge.svg",revision:"8b58f5db37197f76dc733c81665f7fab"},{url:"demo/images/landing/peak-logo.svg",revision:"07bd5129e05e9cc2cc6a1216ef5a01ef"},{url:"demo/images/landing/screen-1.png",revision:"687ee25eee20427d7bccd3bcf8d2d719"},{url:"demo/images/landing/startup.svg",revision:"a43cef8ef0a2da47734626c7a6c202d3"},{url:"demo/images/logo-white.svg",revision:"b6648198c62ad365c4cde37169416592"},{url:"demo/images/logo.svg",revision:"3d0d500f26b806a4b1a31134beb6db82"},{url:"favicon.ico",revision:"1e5be3c7114804f484912b3a122fb232"},{url:"index.html",revision:"6971b94ea5562e884e9e93a57047b5aa"},{url:"registerSW.js",revision:"1872c500de691dce40960bb85481de07"},{url:"robots.txt",revision:"cd9cd94aaa699e0a16e692b6bb16f672"},{url:"compartimiento.png",revision:"c2d91e57b37842417f96e03b8726a725"},{url:"compartimiento192.png",revision:"8233eaac09095ffdf79322cd32f9e69f"},{url:"manifest.webmanifest",revision:"234d2b5c3599f86bd8bbf5ba0394bfbe"}],{}),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html"))),e.registerRoute(/^https:\/\/ecocleantype-ecoclean\.up\.railway\.app\/.*$/,new e.NetworkFirst({cacheName:"api-cache",plugins:[new e.ExpirationPlugin({maxEntries:50,maxAgeSeconds:604800})]}),"GET")}));


self.addEventListener('push', (event) => {
    let data = {};
    if (event.data) {
        data = event.data.json();
    }

    const options = {
        body: data.body || 'Tienes una nueva notificación.',
        icon: data.icon || '/path/to/default-icon.png',
        badge: data.badge || '/path/to/default-badge.png',
    };

    event.waitUntil(
        self.registration.showNotification(data.title || 'Nueva Notificación', options)
    );
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    event.waitUntil(
        clients.openWindow(event.notification.data || '/')
    );
});