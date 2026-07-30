const currentYear = new Date().getFullYear();

const translations = {
  ro: {
    // Navigation
    'nav.home': 'Acasă',
    'nav.about': 'Despre Noi',
    'nav.services': 'Servicii',
    'nav.tuning_db': 'Bază Date Tuning',
    'nav.projects': 'Proiecte',
    'nav.contact': 'Contact',
    
    // Hero
    'hero.eyebrow': 'Performanță Fără Compromis',
    'hero.title.1': 'Redefinește',
    'hero.title.2': 'Puterea',
    'hero.sub': 'Optimizare software profesională pentru motorul tău. Mai multă putere, un consum mai bun, fiabilitate garantată.',
    'hero.cta.primary': 'Alege Mașina',
    'hero.cta.secondary': 'Contactează-ne',
    
    // Stats
    'stats.years': 'Ani Experiență',
    'stats.cars': 'Mașini Optimizate',
    'stats.dyno': 'Teste Dyno',
    'stats.satisfaction': 'Clienți Mulțumiți',
    
    // Services
    'services.title.1': 'Serviciile',
    'services.title.2': 'Noastre',
    
    // About
    'about.title.1': 'Despre',
    'about.title.2': 'MasPerformance',
    'about.desc': 'Suntem o echipă de ingineri pasionați de performanță, cu experiență vastă în optimizarea software-ului auto. Folosim doar echipamente originale și licențiate pentru a garanta siguranța.',
    'about.bullet.1': 'Echipamente Master licențiate',
    'about.bullet.2': 'Software dezvoltat in-house pe Dyno',
    'about.bullet.3': 'Garanție pe lucrare',
    'about.bullet.4': 'Suport tehnic dedicat',
    'about.btn': 'Află mai multe',
    
    // Tuning Tool
    'tuning.title.1': 'Verifică',
    'tuning.title.2': 'Potențialul',
    'tuning.brand': 'Alege Marca',
    'tuning.model': 'Alege Modelul',
    'tuning.engine': 'Alege Motorizarea',
    'tuning.year': 'Anul',
    'tuning.stock': 'Stock',
    'tuning.stage1': 'Stage 1',
    'tuning.stage2': 'Stage 2',
    'tuning.hp': 'CP',
    'tuning.nm': 'Nm',
    'tuning.request': 'Cere Ofertă Pentru Această Mașină',
    
    // Reviews
    'reviews.title.1': 'Părerea',
    'reviews.title.2': 'Clienților',
    
    // CTA
    'cta.title': 'Pregătit pentru mai multă putere?',
    'cta.btn': 'Programează-te Acum',
    
    // Footer
    'footer.desc': 'Profesioniști în optimizarea software a ECU-ului pentru creșterea performanței și eficienței.',
    'footer.links': 'Link-uri Rapide',
    'footer.services': 'Serviciile Noastre',
    'footer.contact': 'Contact',
    'footer.rights': `© ${currentYear} MasPerformance. Toate drepturile rezervate.`,
    
    // Contact Page
    'contact.page.title.1': 'Contactează',
    'contact.page.title.2': 'Echipa',
    'contact.form.name': 'Nume Complet',
    'contact.form.email': 'Adresă Email',
    'contact.form.phone': 'Număr Telefon',
    'contact.form.brand': 'Marca Auto',
    'contact.form.model': 'Model',
    'contact.form.year': 'An Fabricație',
    'contact.form.engine': 'Motorizare / Capacitate',
    'contact.form.fuel': 'Tip Combustibil',
    'contact.form.mileage': 'Kilometraj Actual',
    'contact.form.vin': 'Cod VIN (Serie Șasiu)',
    'contact.form.service_label': 'Servicii Dorite',
    'contact.form.details': 'Detalii Suplimentare',
    'contact.form.method': 'Metoda Preferată de Contact',
    'contact.form.time': 'Timpul Preferat',
    'contact.form.submit': 'Trimite Cererea',
    'contact.info.title': 'Informații Contact',
    'contact.info.address': 'Adresă',
    'contact.info.hours': 'Program',
    
    // Database Page
    'db.page.title.1': 'Bază Date',
    'db.page.title.2': 'Completă',
    'db.table.brand': 'Marcă/Model',
    'db.table.engine': 'Motor',
    'db.table.stock': 'Stock',
    'db.table.stage1': 'Stage 1',
    'db.table.stage2': 'Stage 2',

    // About Page Additional
    'about.heading': 'Pasiune pentru Performanță',
    'about.p1': 'Suntem o echipă dedicată de ingineri și pasionați auto, cu un singur scop: să extragem potențialul ascuns al fiecărui motor, păstrând în același timp fiabilitatea și siguranța pe termen lung.',
    'about.p2': 'Fiecare calibrare software (remap) este realizată in-house, personalizată pentru mașina ta și testată riguros.',
    'about.bullet.certified': '<strong>Personal certificat. Cursuri acreditate:</strong><ul style="list-style: none; padding-left: 0; margin-top: 0.5rem; color: var(--text-muted);"><li style="margin-bottom: 0.25rem;">• AlienTech Academy ECM Titanium & Tuning Basics</li><li style="margin-bottom: 0.25rem;">• AlienTech Academy Chiptuning Basics & AlienTech Tools</li><li style="margin-bottom: 0.25rem;">• AlienTech Academy Advanced Diesel Engines Tuning</li><li style="margin-bottom: 0.25rem;">• AlienTech Academy Advanced Petrol Engines Tuning</li><li style="margin-bottom: 0.25rem;">• HPAcademy Diesel Tuning</li><li style="margin-bottom: 0.25rem;">• HPAcademy EFI Tuning</li></ul>',
    'about.bullet.licensed': 'Echipamente licențiate Alientech, Autel, Autotuner, Launch, MagicMotorsport, OBDSTAR, WinOLS',
    'about.bullet.logging': 'Logare parametri în timp real',
    'about.bullet.warranty': 'Garanție pe calibrarea software',

    // Projects Page Additional
    'projects.title.1': 'Proiecte',
    'projects.title.2': 'Recente',
    'projects.1.desc': 'Stage 2 + Custom Pops & Bangs',
    'projects.2.desc': 'Stage 1 + DSG Tune',
    'projects.3.desc': 'Stage 1 + EGR/DPF Off (Motorsport)',
    'projects.tuned': 'Optimizat',

    // Partners Section & Popup Details
    'partners.title.1': 'Parteneri',
    'partners.title.2': 'De Încredere',
    'partners.sub': 'Colaborăm cu cei mai buni din industrie pentru a-ți oferi servicii de top.',
    'partners.click_hint': 'Click pe logo-ul partenerului pentru mai multe detalii',
    'partners.alientech.name': 'Alientech',
    'partners.alientech.desc': 'Lider mondial în domeniul calibrării motorului și programării ECU, cunoscut pentru instrumente de top precum KESS3 și software-ul ECM Titanium.',
    'partners.autel.name': 'Autel',
    'partners.autel.desc': 'Producător de top de echipamente profesionale de diagnosticare auto, testere inteligente OBD2 și soluții avansate de analiză a sistemelor electronice.',
    'partners.autotuner.name': 'Autotuner',
    'partners.autotuner.desc': 'Echipament modern și ultra-rapid de tuning auto pentru citirea și scrierea ECU/TCU în modurile OBD, Bench și Boot, fără abonamente obligatorii.',
    'partners.launch.name': 'Launch',
    'partners.launch.desc': 'Pionier global în diagnosticarea auto avansată, oferind scanere OBD2 profesionale, sisteme de calibrare ADAS și echipamente de service de înaltă precizie.',
    'partners.magicmotorsport.name': 'MagicMotorsport',
    'partners.magicmotorsport.desc': 'Dezvoltator de soluții inovatoare pentru ateliere auto, faimos pentru instrumentul FLEX care facilitează programarea, repararea și clonarea ECU și TCU.',
    'partners.obdstar.name': 'OBDSTAR',
    'partners.obdstar.desc': 'Specializat în dezvoltarea de dispozitive profesionale pentru programare chei, calibrare module electronice și diagnoză avansată pentru vehicule, moto și ambarcațiuni.',
    'partners.winols.name': 'WinOLS',
    'partners.winols.desc': 'Standardul absolut în industria tuning-ului auto pentru modificarea hărților de injecție și editarea avansată a fișierelor binare din ECU.',

    // Contact Form Additional
    'contact.form.fuel.diesel': 'Diesel',
    'contact.form.fuel.petrol': 'Benzină',
    'contact.form.fuel.hybrid': 'Hibrid',
    'contact.form.fuel.electric': 'Electric',
    'contact.form.time.any': 'Oricând',
    'contact.form.time.morning': 'Dimineața',
    'contact.form.time.afternoon': 'După-amiaza',
    'contact.form.time.evening': 'Seara',
    'contact.form.method.phone': 'Telefon',
    'contact.form.method.whatsapp': 'WhatsApp',
    'contact.form.method.email': 'Email',
    'contact.form.error.required': 'Acest câmp este obligatoriu.',
    'contact.form.error.email': 'Adresă de email invalidă.',
    'contact.form.error.phone': 'Număr de telefon invalid.',
    'contact.form.error.short_required': 'Obligatoriu.',
    'contact.form.sending': 'Se trimite...',
    'contact.form.sent': 'Trimis cu succes!',
    'contact.info.phone_whatsapp': 'Telefon & WhatsApp',

    // Gallery
    'about.gallery.title.1': 'Galeria',
    'about.gallery.title.2': ' Noastră',
    'about.gallery.empty': 'Nicio imagine adăugată încă. Adaugă poze din panoul de administrare.',

    // Birthday popup (Massimo Rosu — Aug 4, 2026)
    'birthday.title': 'La Mulți Ani, Massimo!',
    'birthday.message': 'Astăzi sărbătorim 24 de ani de viață ai fondatorului MasPerformance, Massimo Rosu. Îi mulțumim pentru pasiunea și dedicarea care au făcut posibil acest site și tot ce construim împreună. La mulți ani!',

    'contact.info.email_label': 'Email',
    'contact.info.address.val': 'Bulevardul Iuliu Maniu nr. 1, Sector 6, București, România',
    'contact.info.hours.val': 'Luni - Vineri: 09:00 - 18:00, Sâmbătă - Duminică: Închis',

    // Reviews Additional
    'reviews.1.text': '"Mașina se simte total diferit. Livrarea puterii este liniară, iar consumul a scăzut cu 1L/100km la mers constant. Profesioniști adevărați."',
    'reviews.2.text': '"Am venit pentru un EGR Off și am plecat cu Stage 1. Recomand cu încredere, mi-au explicat tot procesul pas cu pas."',
    'reviews.3.text': '"Pops & Bangs exact cum mi-am dorit, fără să fie exagerat. Mașina trage excelent pe toată plaja de turații."'
  },
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.about': 'About',
    'nav.services': 'Services',
    'nav.tuning_db': 'Tuning DB',
    'nav.projects': 'Projects',
    'nav.contact': 'Contact',
    
    // Hero
    'hero.eyebrow': 'Performance Without Compromise',
    'hero.title.1': 'Redefine',
    'hero.title.2': 'Power',
    'hero.sub': 'Professional ECU tuning for your vehicle. More power, better fuel economy, guaranteed reliability.',
    'hero.cta.primary': 'Select Car',
    'hero.cta.secondary': 'Contact Us',
    
    // Stats
    'stats.years': 'Years Experience',
    'stats.cars': 'Optimized Cars',
    'stats.dyno': 'Dyno Tests',
    'stats.satisfaction': 'Happy Clients',
    
    // Services
    'services.title.1': 'Our',
    'services.title.2': 'Services',
    
    // About
    'about.title.1': 'About',
    'about.title.2': 'MasPerformance',
    'about.desc': 'We are a team of performance engineers with vast experience in automotive software optimization. We only use original, licensed equipment to ensure maximum safety.',
    'about.bullet.1': 'Licensed Master equipment',
    'about.bullet.2': 'In-house Dyno developed software',
    'about.bullet.3': 'Warranty included',
    'about.bullet.4': 'Dedicated technical support',
    'about.btn': 'Learn More',
    
    // Tuning Tool
    'tuning.title.1': 'Check',
    'tuning.title.2': 'Potential',
    'tuning.brand': 'Select Brand',
    'tuning.model': 'Select Model',
    'tuning.engine': 'Select Engine',
    'tuning.year': 'Year',
    'tuning.stock': 'Stock',
    'tuning.stage1': 'Stage 1',
    'tuning.stage2': 'Stage 2',
    'tuning.hp': 'HP',
    'tuning.nm': 'Nm',
    'tuning.request': 'Request Quote For This Car',
    
    // Reviews
    'reviews.title.1': 'Client',
    'reviews.title.2': 'Reviews',
    
    // CTA
    'cta.title': 'Ready for more power?',
    'cta.btn': 'Book Now',
    
    // Footer
    'footer.desc': 'Professional ECU software optimization for increased performance and efficiency.',
    'footer.links': 'Quick Links',
    'footer.services': 'Our Services',
    'footer.contact': 'Contact',
    'footer.rights': `© ${currentYear} MasPerformance. All rights reserved.`,
    
    // Contact Page
    'contact.page.title.1': 'Contact',
    'contact.page.title.2': 'The Team',
    'contact.form.name': 'Full Name',
    'contact.form.email': 'Email Address',
    'contact.form.phone': 'Phone Number',
    'contact.form.brand': 'Car Brand',
    'contact.form.model': 'Model',
    'contact.form.year': 'Year of Manufacture',
    'contact.form.engine': 'Engine / Displacement',
    'contact.form.fuel': 'Fuel Type',
    'contact.form.mileage': 'Current Mileage',
    'contact.form.vin': 'VIN Number (Chassis Series)',
    'contact.form.service_label': 'Services Interested In',
    'contact.form.details': 'Additional Details',
    'contact.form.method': 'Preferred Contact Method',
    'contact.form.time': 'Preferred Contact Time',
    'contact.form.submit': 'Submit Request',
    'contact.info.title': 'Contact Information',
    'contact.info.address': 'Address',
    'contact.info.hours': 'Working Hours',
    
    // Database Page
    'db.page.title.1': 'Complete',
    'db.page.title.2': 'Database',
    'db.table.brand': 'Brand/Model',
    'db.table.engine': 'Engine',
    'db.table.stock': 'Stock',
    'db.table.stage1': 'Stage 1',
    'db.table.stage2': 'Stage 2',

    // About Page Additional
    'about.heading': 'Passion for Performance',
    'about.p1': 'We are a dedicated team of engineers and car enthusiasts with a single goal: to extract the hidden potential of each engine while keeping long-term reliability and safety intact.',
    'about.p2': 'Each software calibration (remap) is developed in-house, custom tailored to your vehicle and rigorously tested.',
    'about.bullet.certified': '<strong>Certified Staff. Accredited Courses:</strong><ul style="list-style: none; padding-left: 0; margin-top: 0.5rem; color: var(--text-muted);"><li style="margin-bottom: 0.25rem;">• AlienTech Academy ECM Titanium & Tuning Basics</li><li style="margin-bottom: 0.25rem;">• AlienTech Academy Chiptuning Basics & AlienTech Tools</li><li style="margin-bottom: 0.25rem;">• AlienTech Academy Advanced Diesel Engines Tuning</li><li style="margin-bottom: 0.25rem;">• AlienTech Academy Advanced Petrol Engines Tuning</li><li style="margin-bottom: 0.25rem;">• HPAcademy Diesel Tuning</li><li style="margin-bottom: 0.25rem;">• HPAcademy EFI Tuning</li></ul>',
    'about.bullet.licensed': 'Licensed equipment from Alientech, Autel, Autotuner, Launch, MagicMotorsport, OBDSTAR, WinOLS',
    'about.bullet.logging': 'Real-time parameter logging',
    'about.bullet.warranty': 'Software calibration warranty included',

    // Projects Page Additional
    'projects.title.1': 'Recent',
    'projects.title.2': 'Projects',
    'projects.1.desc': 'Stage 2 + Custom Pops & Bangs',
    'projects.2.desc': 'Stage 1 + DSG Tune',
    'projects.3.desc': 'Stage 1 + EGR/DPF Off (Motorsport)',
    'projects.tuned': 'Tuned',

    // Partners Section & Popup Details
    'partners.title.1': 'Trusted',
    'partners.title.2': 'Partners',
    'partners.sub': 'We collaborate with the best in the industry to offer you top-notch services.',
    'partners.click_hint': 'Click on a partner\'s logo for more details',
    'partners.alientech.name': 'Alientech',
    'partners.alientech.desc': 'A world leader in engine calibration and ECU programming, renowned for state-of-the-art tools like KESS3 and ECM Titanium software.',
    'partners.autel.name': 'Autel',
    'partners.autel.desc': 'A premier manufacturer of professional automotive diagnostic equipment, smart OBD2 scanners, and advanced electronic system analysis tools.',
    'partners.autotuner.name': 'Autotuner',
    'partners.autotuner.desc': 'A modern and ultra-fast tuning tool for reading and writing ECU/TCU in OBD, Bench, and Boot modes, featuring a subscription-free model.',
    'partners.launch.name': 'Launch',
    'partners.launch.desc': 'A global pioneer in advanced automotive diagnostics, providing professional OBD2 scanners, ADAS calibration systems, and high-precision service equipment.',
    'partners.magicmotorsport.name': 'MagicMotorsport',
    'partners.magicmotorsport.desc': 'Developer of innovative solutions for tuning workshops, famous for the FLEX tool which enables easy programming, repair, and cloning of ECU and TCU modules.',
    'partners.obdstar.name': 'OBDSTAR',
    'partners.obdstar.desc': 'Specialized in professional key programming devices, electronic module calibration, and advanced diagnostics for cars, motorcycles, and marine vehicles.',
    'partners.winols.name': 'WinOLS',
    'partners.winols.desc': 'The absolute industry standard in automotive tuning for ECU map modification and advanced editing of engine binary files.',

    // Contact Form Additional
    'contact.form.fuel.diesel': 'Diesel',
    'contact.form.fuel.petrol': 'Petrol',
    'contact.form.fuel.hybrid': 'Hybrid',
    'contact.form.fuel.electric': 'Electric',
    'contact.form.time.any': 'Any Time',
    'contact.form.time.morning': 'Morning',
    'contact.form.time.afternoon': 'Afternoon',
    'contact.form.time.evening': 'Evening',
    'contact.form.method.phone': 'Phone',
    'contact.form.method.whatsapp': 'WhatsApp',
    'contact.form.method.email': 'Email',
    'contact.form.error.required': 'This field is required.',
    'contact.form.error.email': 'Valid email required.',
    'contact.form.error.phone': 'Valid phone required.',
    'contact.form.error.short_required': 'Required.',
    'contact.form.sending': 'Sending...',
    'contact.form.sent': 'Sent Successfully!',
    'contact.info.phone_whatsapp': 'Phone & WhatsApp',

    // Gallery
    'about.gallery.title.1': 'Our',
    'about.gallery.title.2': ' Gallery',
    'about.gallery.empty': 'No images added yet. Add photos from the admin panel.',

    // Birthday popup (Massimo Rosu — Aug 4, 2026)
    'birthday.title': 'Happy Birthday, Massimo!',
    'birthday.message': 'Today we celebrate 24 years of MasPerformance founder Massimo Rosu. Thank you for the passion and dedication that made this site and everything we build together possible. Happy Birthday!',

    'contact.info.email_label': 'Email',
    'contact.info.address.val': '1 Iuliu Maniu Boulevard, District 6, Bucharest, Romania',
    'contact.info.hours.val': 'Monday - Friday: 09:00 - 18:00, Saturday - Sunday: Closed',

    // Reviews Additional
    'reviews.1.text': '"The car feels completely different. Power delivery is linear, and fuel consumption dropped by 1L/100km at constant speed. Real professionals."',
    'reviews.2.text': '"I came for an EGR Off and left with Stage 1. Highly recommend, they explained the whole process step by step."',
    'reviews.3.text': '"Pops & Bangs exactly how I wanted, without being exaggerated. The car pulls excellently across the entire RPM range."'
  }
};

let currentLang = localStorage.getItem('mas_lang') || 'ro';

function setLanguage(lang) {
  if (!translations[lang]) return;
  currentLang = lang;
  localStorage.setItem('mas_lang', lang);
  
  // Update UI language switchers
  document.querySelectorAll('.lang-switch span').forEach(el => {
    if (el.dataset.lang === lang) {
      el.classList.add('active');
    } else {
      el.classList.remove('active');
    }
  });

  // Translate all elements with data-lang-key
  document.querySelectorAll('[data-lang-key]').forEach(el => {
    const key = el.getAttribute('data-lang-key');
    if (translations[lang][key]) {
      if (el.tagName === 'INPUT' && el.type === 'submit') {
        el.value = translations[lang][key];
      } else if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.placeholder = translations[lang][key];
      } else {
        el.innerHTML = translations[lang][key];
      }
    }
  });
  
  // Trigger custom event for other scripts
  document.dispatchEvent(new CustomEvent('languageChanged', { detail: lang }));
}

document.addEventListener('DOMContentLoaded', () => {
  setLanguage(currentLang);
  
  // Bind click events
  document.querySelectorAll('.lang-switch span').forEach(btn => {
    btn.addEventListener('click', (e) => {
      setLanguage(e.target.dataset.lang);
    });
  });
});
