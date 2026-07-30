// Main JS

// Override hardcoded translations with settings from localStorage before DOMContentLoaded
(function() {
  const siteSettings = JSON.parse(localStorage.getItem('mas_settings') || '{}');
  if (typeof translations !== 'undefined') {
    // Override Address
    if (siteSettings.contactAddress) {
      translations.ro['contact.info.address.val'] = siteSettings.contactAddress;
      translations.en['contact.info.address.val'] = siteSettings.contactAddress;
    }
    
    // Override Headline RO
    if (siteSettings.heroHeadlineRo) {
      const parts = siteSettings.heroHeadlineRo.split('\\n');
      if (parts.length >= 2) {
        translations.ro['hero.title.1'] = parts[0];
        translations.ro['hero.title.2'] = parts[1];
      } else {
        translations.ro['hero.title.1'] = siteSettings.heroHeadlineRo;
        translations.ro['hero.title.2'] = '';
      }
    }

    // Override Headline EN
    if (siteSettings.heroHeadlineEn) {
      const parts = siteSettings.heroHeadlineEn.split('\\n');
      if (parts.length >= 2) {
        translations.en['hero.title.1'] = parts[0];
        translations.en['hero.title.2'] = parts[1];
      } else {
        translations.en['hero.title.1'] = siteSettings.heroHeadlineEn;
        translations.en['hero.title.2'] = '';
      }
    }

    // Override Despre Noi (About Us)
    if (siteSettings.aboutDescRo) {
      translations.ro['about.desc'] = siteSettings.aboutDescRo;
    }
    if (siteSettings.aboutDescEn) {
      translations.en['about.desc'] = siteSettings.aboutDescEn;
    }
    if (siteSettings.aboutFullRo) {
      translations.ro['about.p1'] = siteSettings.aboutFullRo;
    }
    if (siteSettings.aboutFullEn) {
      translations.en['about.p1'] = siteSettings.aboutFullEn;
    }

    // Clear footer description translations
    translations.ro['footer.desc'] = '';
    translations.en['footer.desc'] = '';
  }
})();

document.addEventListener('DOMContentLoaded', () => {

  // =====================================================
  // Massimo Rosu Birthday Popup — one-time, Aug 4 2026, 00:00-03:00 local time.
  // The condition below will simply never be true again after that window;
  // remove this block manually whenever you'd rather it not linger in the source.
  // =====================================================
  (() => {
    const now = new Date();
    const inBirthdayWindow = now.getFullYear() === 2026 && now.getMonth() === 7 && now.getDate() === 4 && now.getHours() < 3;
    if (!inBirthdayWindow) return;
    if (sessionStorage.getItem('mas_birthday_shown')) return;
    sessionStorage.setItem('mas_birthday_shown', 'true');

    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.innerHTML = `
      <div class="modal-content" style="max-width: 480px; text-align: center; padding: 3rem 2rem;">
        <button class="modal-close" aria-label="Close">&times;</button>
        <div style="font-size: 3rem; margin-bottom: 1rem;">🎉</div>
        <h2 style="font-family: var(--font-heading); font-size: 1.6rem; margin-bottom: 1rem; color: var(--accent-color);" data-lang-key="birthday.title">La Mulți Ani, Massimo!</h2>
        <p class="text-muted" data-lang-key="birthday.message">Astăzi sărbătorim 24 de ani de viață ai fondatorului MasPerformance, Massimo Rosu.</p>
      </div>
    `;
    document.body.appendChild(overlay);

    if (typeof translations !== 'undefined' && translations[currentLang]) {
      overlay.querySelectorAll('[data-lang-key]').forEach(el => {
        const key = el.getAttribute('data-lang-key');
        if (translations[currentLang][key]) el.innerHTML = translations[currentLang][key];
      });
    }

    requestAnimationFrame(() => {
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    });

    const closeBirthdayModal = () => {
      overlay.classList.remove('active');
      document.body.style.overflow = '';
      setTimeout(() => overlay.remove(), 400);
    };

    overlay.querySelector('.modal-close').addEventListener('click', closeBirthdayModal);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) closeBirthdayModal(); });
    document.addEventListener('keydown', function escHandler(e) {
      if (e.key === 'Escape' && overlay.classList.contains('active')) {
        closeBirthdayModal();
        document.removeEventListener('keydown', escHandler);
      }
    });
  })();

  // Load color theme if customized in admin
  const siteSettings = JSON.parse(localStorage.getItem('mas_settings') || '{}');
  if (siteSettings.accentColor) {
    document.documentElement.style.setProperty('--accent-color', siteSettings.accentColor);
    document.documentElement.style.setProperty('--logo-glow', `0 0 14px ${siteSettings.accentColor}CC, 0 0 36px ${siteSettings.accentColor}59`);
  }

  // Load dynamic video path if customized in admin
  const heroVideo = document.querySelector('.hero-video');
  if (heroVideo && siteSettings.heroVideo) {
    const source = heroVideo.querySelector('source');
    if (source) {
      source.setAttribute('src', siteSettings.heroVideo);
      heroVideo.load();
    }
  }

  // Load social links from admin settings
  const socialLinks = {
    Facebook: siteSettings.hasOwnProperty('socialFacebook') ? siteSettings.socialFacebook : 'https://facebook.com',
    Instagram: siteSettings.hasOwnProperty('socialInstagram') ? siteSettings.socialInstagram : 'https://www.instagram.com/mas_performance25?igsh=ODg5ZWJieTUybDVq',
    YouTube: siteSettings.hasOwnProperty('socialYoutube') ? siteSettings.socialYoutube : '',
    TikTok: siteSettings.hasOwnProperty('socialTiktok') ? siteSettings.socialTiktok : ''
  };

  Object.keys(socialLinks).forEach(platform => {
    const url = socialLinks[platform];
    document.querySelectorAll(`.social-links a[aria-label="${platform}"]`).forEach(a => {
      if (url) {
        a.setAttribute('href', url);
        a.setAttribute('target', '_blank');
        a.setAttribute('rel', 'noopener noreferrer');
        a.style.display = '';
      } else {
        if (platform === 'Facebook' || platform === 'Instagram') {
          const fallback = platform === 'Facebook' ? 'https://facebook.com' : 'https://www.instagram.com/mas_performance25?igsh=ODg5ZWJieTUybDVq';
          a.setAttribute('href', fallback);
          a.setAttribute('target', '_blank');
          a.setAttribute('rel', 'noopener noreferrer');
          a.style.display = '';
        } else {
          a.style.display = 'none';
        }
      }
    });
  });

  // Load contact info from admin settings
  const contactPhone = siteSettings.contactPhone || '0730348009';
  const contactEmail = siteSettings.contactEmail || 'contact@masperformance.ro';
  const contactAddress = siteSettings.contactAddress || 'Bulevardul Iuliu Maniu nr. 1, Sector 6, București';

  // Update phone links and text
  document.querySelectorAll('a[href^="tel:"]').forEach(a => {
    const cleanPhone = contactPhone.replace(/\s+/g, '');
    a.setAttribute('href', `tel:${cleanPhone}`);
    a.textContent = contactPhone;
  });
  document.querySelectorAll('.contact-phone').forEach(el => {
    el.textContent = contactPhone;
  });

  // Update email links and text
  document.querySelectorAll('a[href^="mailto:"]').forEach(a => {
    a.setAttribute('href', `mailto:${contactEmail}`);
    a.textContent = contactEmail;
  });
  document.querySelectorAll('.contact-email').forEach(el => {
    el.textContent = contactEmail;
  });

  // Update address text
  document.querySelectorAll('.contact-address').forEach(el => {
    el.textContent = contactAddress;
  });

  // Load dynamic image assignments from admin
  let imageSlots = JSON.parse(localStorage.getItem('mas_image_slots') || '{}');
  if (imageSlots['home_about'] && imageSlots['home_about'].includes('photo-1600705722908-bab1e61c0b4d')) {
    imageSlots['home_about'] = 'assets/images/IMG_2523.jpg';
    localStorage.setItem('mas_image_slots', JSON.stringify(imageSlots));
  }
  document.querySelectorAll('img[data-img-slot]').forEach(img => {
    const slot = img.getAttribute('data-img-slot');
    if (imageSlots[slot]) {
      img.setAttribute('src', imageSlots[slot]);
    }
  });

  // Intersection Observer for scroll animations (Stats)
  const statsNum = document.querySelectorAll('.stat-num');
  
  if (statsNum.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateNumbers(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    statsNum.forEach(num => {
      observer.observe(num);
    });
  }

  function animateNumbers(el) {
    const finalValText = el.getAttribute('data-val');
    // Extract numbers from text (e.g. "5000+" -> 5000)
    const finalVal = parseInt(finalValText.replace(/[^0-9]/g, ''));
    if(isNaN(finalVal)) return;

    const suffix = finalValText.replace(/[0-9]/g, '');
    let startVal = 0;
    const duration = 2000;
    const startTime = performance.now();

    function updateNum(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // ease out expo
      const easeOut = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const currentVal = Math.floor(easeOut * finalVal);
      
      // Wrap the last digit or suffix in span for red color if needed, as per design
      const valStr = currentVal.toString() + suffix;
      const lastChar = valStr.slice(-1);
      const rest = valStr.slice(0, -1);
      
      el.innerHTML = `${rest}<span>${lastChar}</span>`;

      if (progress < 1) {
        requestAnimationFrame(updateNum);
      } else {
        el.innerHTML = finalValText.slice(0, -1) + `<span>${finalValText.slice(-1)}</span>`;
      }
    }
    requestAnimationFrame(updateNum);
  }

  // Pre-fill contact form from URL params
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    const urlParams = new URLSearchParams(window.location.search);
    const brand = urlParams.get('brand');
    const model = urlParams.get('model');
    const engine = urlParams.get('engine');

    if (brand) document.getElementById('brand').value = brand;
    if (model) document.getElementById('model').value = model;
    if (engine) document.getElementById('engine').value = engine;

    // Contact form submission
    /*
      PHP CONVERSION NOTE:
      $data = json_decode(file_get_contents('php://input'), true);
      $stmt = $pdo->prepare("INSERT INTO contact_submissions (full_name, email, phone, car_brand, car_model, year, engine, fuel, mileage, services_requested, message, contact_method, contact_time) VALUES (...)");
      $stmt->execute([...]);
    */
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const btn = contactForm.querySelector('input[type="submit"]');
      const originalText = (typeof translations !== 'undefined' && translations[currentLang] && translations[currentLang]['contact.form.submit']) || btn.value;
      const sendingText = (typeof translations !== 'undefined' && translations[currentLang] && translations[currentLang]['contact.form.sending']) || "Sending...";
      btn.value = sendingText;
      btn.disabled = true;

      // Basic Validation
      let isValid = true;
      const requiredFields = ['fullname', 'email', 'phone', 'brand', 'model', 'year', 'engine'];
      requiredFields.forEach(id => {
        const el = document.getElementById(id);
        if(!el.value.trim()) {
          isValid = false;
          el.parentElement.classList.add('has-error');
        } else {
          el.parentElement.classList.remove('has-error');
        }
      });

      if(!isValid) {
        btn.value = originalText;
        btn.disabled = false;
        return;
      }

      // Gather data
      const method = document.querySelector('input[name="method"]:checked')?.value || '';

      const formData = {
        id: Date.now(),
        full_name: document.getElementById('fullname').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        car_brand: document.getElementById('brand').value,
        car_model: document.getElementById('model').value,
        year: document.getElementById('year').value,
        engine: document.getElementById('engine').value,
        fuel: document.getElementById('fuel').value,
        mileage: document.getElementById('mileage').value,
        vin: document.getElementById('vin').value.trim().toUpperCase(),
        message: document.getElementById('details').value,
        contact_method: method,
        contact_time: document.getElementById('time').value,
        submitted_at: new Date().toISOString(),
        is_read: 0
      };

      setTimeout(() => {
        let subs = JSON.parse(localStorage.getItem('contact_submissions') || '[]');
        subs.push(formData);
        localStorage.setItem('contact_submissions', JSON.stringify(subs));
        
        contactForm.reset();
        const sentText = (typeof translations !== 'undefined' && translations[currentLang] && translations[currentLang]['contact.form.sent']) || "Sent Successfully!";
        btn.value = sentText;
        btn.style.backgroundColor = "#4ade80";
        btn.style.color = "#000";
        
        setTimeout(() => {
          const resetText = (typeof translations !== 'undefined' && translations[currentLang] && translations[currentLang]['contact.form.submit']) || originalText;
          btn.value = resetText;
          btn.disabled = false;
          btn.style = "";
        }, 3000);
      }, 1500);
    });
  }

  // Partner modal logic
  const partnerModal = document.getElementById('partner-modal');
  if (partnerModal) {
    const partnerWrappers = document.querySelectorAll('.partner-img-wrapper');
    const modalLogo = document.getElementById('modal-partner-logo');
    const modalName = document.getElementById('modal-partner-name');
    const modalDesc = document.getElementById('modal-partner-desc');
    const modalClose = partnerModal.querySelector('.modal-close');
    let currentPartnerId = null;

    const updateModalContent = (partnerId) => {
      if (!partnerId || typeof translations === 'undefined') return;
      const nameKey = `partners.${partnerId}.name`;
      const descKey = `partners.${partnerId}.desc`;
      const partnerName = (translations[currentLang] && translations[currentLang][nameKey]) || '';
      const partnerDesc = (translations[currentLang] && translations[currentLang][descKey]) || '';

      if (modalName) modalName.textContent = partnerName;
      if (modalDesc) modalDesc.innerHTML = partnerDesc;
    };

    partnerWrappers.forEach(wrapper => {
      wrapper.addEventListener('click', () => {
        const partnerId = wrapper.getAttribute('data-partner');
        if (!partnerId) return;

        currentPartnerId = partnerId;

        // Find image inside wrapper
        const img = wrapper.querySelector('img');
        const imgSrc = img ? img.getAttribute('src') : '';
        const imgAlt = img ? img.getAttribute('alt') : '';

        // Set image sources
        if (modalLogo) {
          modalLogo.setAttribute('src', imgSrc);
          modalLogo.setAttribute('alt', imgAlt);
        }

        // Set text based on current language
        updateModalContent(partnerId);

        // Open modal
        partnerModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    });

    const closeModal = () => {
      partnerModal.classList.remove('active');
      document.body.style.overflow = '';
      currentPartnerId = null;
    };

    if (modalClose) {
      modalClose.addEventListener('click', closeModal);
    }

    partnerModal.addEventListener('click', (e) => {
      if (e.target === partnerModal) {
        closeModal();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && partnerModal.classList.contains('active')) {
        closeModal();
      }
    });

    // Update modal details dynamically if language changes while open
    document.addEventListener('languageChanged', () => {
      if (partnerModal.classList.contains('active') && currentPartnerId) {
        updateModalContent(currentPartnerId);
      }
    });
  }

  // Dynamic Projects Grid Renderer
  const projectsGrid = document.getElementById('projects-grid');
  if (projectsGrid) {
    const defaultProjects = [
      {
        id: 1,
        title: "BMW M4 (F82)",
        desc_ro: "Stage 2 + Custom Pops & Bangs",
        desc_en: "Stage 2 + Custom Pops & Bangs",
        stock: "431 HP / 550 Nm",
        tuned: "540 HP / 750 Nm",
        images: ["https://images.unsplash.com/photo-1555353540-64fd6b3e34b9?q=80&w=800&auto=format&fit=crop"]
      },
      {
        id: 2,
        title: "VW Golf 7 GTI",
        desc_ro: "Stage 1 + DSG Tune",
        desc_en: "Stage 1 + DSG Tune",
        stock: "220 HP / 350 Nm",
        tuned: "300 HP / 450 Nm",
        images: ["https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?q=80&w=800&auto=format&fit=crop"]
      },
      {
        id: 3,
        title: "Audi A6 3.0 TDI",
        desc_ro: "Stage 1 + EGR/DPF Off (Motorsport)",
        desc_en: "Stage 1 + EGR/DPF Off (Motorsport)",
        stock: "245 HP / 500 Nm",
        tuned: "300 HP / 600 Nm",
        images: ["https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=800&auto=format&fit=crop"]
      }
    ];

    const renderProjects = () => {
      projectsGrid.innerHTML = '';
      let list = JSON.parse(localStorage.getItem('mas_projects'));

      // Fallback/Init if not set
      if (!list || !Array.isArray(list)) {
        list = defaultProjects;
        localStorage.setItem('mas_projects', JSON.stringify(list));
      }

      // Migrate legacy single-`image` records to the `images` array
      let migrated = false;
      list.forEach(p => {
        if (!Array.isArray(p.images)) {
          p.images = p.image ? [p.image] : [];
          delete p.image;
          migrated = true;
        }
      });
      if (migrated) localStorage.setItem('mas_projects', JSON.stringify(list));

      list.forEach(p => {
        const desc = currentLang === 'ro' ? p.desc_ro : p.desc_en;
        const stockLabel = currentLang === 'ro' ? 'Stock' : 'Stock';
        const tunedLabel = currentLang === 'ro' ? 'Optimizat' : 'Tuned';
        const cover = p.images[0] || '';

        const card = document.createElement('div');
        card.style.cssText = "background: var(--surface-1); border: 1px solid var(--border-color); display: flex; flex-direction: column;";

        card.innerHTML = `
          <div class="project-cover" style="position:relative; cursor:pointer;">
            <img src="${cover}" alt="${p.title}" style="width: 100%; height: 250px; object-fit: cover; filter: grayscale(100%); transition: all 0.3s;" onmouseover="this.style.filter='grayscale(0%)'" onmouseout="this.style.filter='grayscale(100%)'">
            ${p.images.length > 1 ? `<span style="position:absolute; bottom:0.75rem; right:0.75rem; background:rgba(10,10,10,0.75); color:#fff; font-size:0.75rem; padding:0.25rem 0.6rem;">+${p.images.length - 1}</span>` : ''}
          </div>
          <div style="padding: 2rem; flex-grow: 1; display: flex; flex-direction: column; justify-content: space-between;">
            <div>
              <h3 style="font-family: var(--font-heading); margin-bottom: 0.5rem; font-size: 1.5rem;">${p.title}</h3>
              <p class="text-muted" style="margin-bottom: 1.5rem;">${desc}</p>
            </div>
            <div style="display: flex; gap: 1rem; border-top: 1px solid var(--border-color); padding-top: 1rem;">
              <div>
                <span style="font-size: 0.8rem; text-transform: uppercase; color: var(--text-muted);">${stockLabel}</span><br>
                <strong>${p.stock}</strong>
              </div>
              <div>
                <span style="font-size: 0.8rem; text-transform: uppercase; color: var(--accent-color);">${tunedLabel}</span><br>
                <strong>${p.tuned}</strong>
              </div>
            </div>
          </div>
        `;

        const coverEl = card.querySelector('.project-cover');
        coverEl.addEventListener('click', () => {
          if (typeof window.openProjectLightbox === 'function') {
            window.openProjectLightbox(p.images, p.title);
          }
        });

        projectsGrid.appendChild(card);
      });
    };

    // Initial render
    renderProjects();

    // Re-render when language changes
    document.addEventListener('languageChanged', renderProjects);
  }

  // =====================================================
  // Project Photo Lightbox
  // =====================================================
  const projectLightbox = document.getElementById('project-lightbox');
  if (projectLightbox) {
    const lbTrack = document.getElementById('lightbox-carousel-track');
    const lbDots = document.getElementById('lightbox-carousel-dots');
    const lbPrev = document.getElementById('lightbox-carousel-prev');
    const lbNext = document.getElementById('lightbox-carousel-next');
    const lbTitle = document.getElementById('lightbox-project-title');
    const lbClose = projectLightbox.querySelector('.modal-close');

    let lbImages = [];
    let lbSlide = 0;

    const goToLbSlide = (index) => {
      if (lbImages.length === 0) return;
      lbSlide = (index + lbImages.length) % lbImages.length;
      lbTrack.style.transform = `translateX(-${lbSlide * 100}%)`;
      lbDots.querySelectorAll('.carousel-dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === lbSlide);
      });
    };

    const closeLightbox = () => {
      projectLightbox.classList.remove('active');
      document.body.style.overflow = '';
    };

    window.openProjectLightbox = (images, title) => {
      lbImages = images || [];
      lbSlide = 0;
      lbTitle.textContent = title || '';

      lbTrack.innerHTML = '';
      lbDots.innerHTML = '';

      lbImages.forEach((src, i) => {
        const slide = document.createElement('div');
        slide.className = 'carousel-slide';

        const bgImg = document.createElement('img');
        bgImg.src = src;
        bgImg.alt = '';
        bgImg.setAttribute('aria-hidden', 'true');
        bgImg.className = 'carousel-slide-bg';
        slide.appendChild(bgImg);

        const img = document.createElement('img');
        img.src = src;
        img.alt = `${title} – foto ${i + 1}`;
        img.className = 'carousel-slide-fg';
        slide.appendChild(img);

        lbTrack.appendChild(slide);

        const dot = document.createElement('button');
        dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('aria-label', `Slide ${i + 1}`);
        dot.addEventListener('click', () => goToLbSlide(i));
        lbDots.appendChild(dot);
      });

      lbTrack.style.transform = 'translateX(0)';

      const multi = lbImages.length > 1;
      lbPrev.style.display = multi ? 'flex' : 'none';
      lbNext.style.display = multi ? 'flex' : 'none';
      lbDots.style.display = multi ? 'flex' : 'none';

      projectLightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    };

    lbPrev.addEventListener('click', () => goToLbSlide(lbSlide - 1));
    lbNext.addEventListener('click', () => goToLbSlide(lbSlide + 1));
    if (lbClose) lbClose.addEventListener('click', closeLightbox);
    projectLightbox.addEventListener('click', (e) => {
      if (e.target === projectLightbox) closeLightbox();
    });
    document.addEventListener('keydown', (e) => {
      if (!projectLightbox.classList.contains('active')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') goToLbSlide(lbSlide - 1);
      if (e.key === 'ArrowRight') goToLbSlide(lbSlide + 1);
    });
  }

  // Dynamic Services Renderer
  const servicesGrid = document.getElementById('services-grid');
  if (servicesGrid) {
    const defaultServices = [
      {
        id: 1,
        title_ro: 'Stage 1',
        title_en: 'Stage 1',
        desc_ro: 'Optimizare software pe hardware-ul original al mașinii. Creștere sigură de putere și cuplu, fără modificări fizice.',
        desc_en: 'Software optimization on the car\'s original hardware. Safe power and torque gains, no physical modifications required.'
      },
      {
        id: 2,
        title_ro: 'Stage 2',
        title_en: 'Stage 2',
        desc_ro: 'Pentru mașini cu modificări hardware (evacuare, admisie, intercooler). Extragem potențialul maxim al motorului.',
        desc_en: 'For cars with supporting hardware upgrades (exhaust, intake, intercooler). We extract the engine\'s maximum potential.'
      },
      {
        id: 3,
        title_ro: 'EGR / DPF / AdBlue Off',
        title_en: 'EGR / DPF / AdBlue Off',
        desc_ro: 'Dezactivare software pentru sisteme EGR, DPF și AdBlue, pentru fiabilitate crescută pe mașinile folosite intensiv.',
        desc_en: 'Software-based deactivation of EGR, DPF and AdBlue systems, for improved reliability on heavily-used vehicles.'
      },
      {
        id: 4,
        title_ro: 'Pops & Bangs',
        title_en: 'Pops & Bangs',
        desc_ro: 'Calibrare personalizată a sunetului de evacuare, de la subtil la agresiv, adaptată exact preferințelor tale.',
        desc_en: 'Custom exhaust sound calibration, from subtle to aggressive, tailored exactly to your preference.'
      },
      {
        id: 5,
        title_ro: 'Remap Cutii Automate',
        title_en: 'Automatic Gearbox Remap',
        desc_ro: 'Optimizare software pentru cutii DSG/Tiptronic — schimbări de viteză mai rapide și livrare mai directă a puterii.',
        desc_en: 'Software tuning for DSG/Tiptronic gearboxes — faster shifts and more direct power delivery.'
      },
      {
        id: 6,
        title_ro: 'Diagnoză & Logging',
        title_en: 'Diagnostics & Logging',
        desc_ro: 'Citire completă a parametrilor motorului în timp real, pentru depanare precisă și calibrări sigure.',
        desc_en: 'Full real-time engine parameter logging, for precise troubleshooting and safe calibrations.'
      }
    ];

    const renderServices = () => {
      servicesGrid.innerHTML = '';
      let list = JSON.parse(localStorage.getItem('mas_services'));
      if (!list || !Array.isArray(list)) {
        list = defaultServices;
        localStorage.setItem('mas_services', JSON.stringify(list));
      }

      list.forEach((s, index) => {
        const title = currentLang === 'ro' ? s.title_ro : s.title_en;
        const desc = currentLang === 'ro' ? s.desc_ro : s.desc_en;

        const card = document.createElement('div');
        card.className = 'service-card';
        card.innerHTML = `
          <span class="service-num">${String(index + 1).padStart(2, '0')}</span>
          <h3>${title}</h3>
          <p class="text-muted">${desc}</p>
        `;
        servicesGrid.appendChild(card);
      });
    };

    renderServices();
    document.addEventListener('languageChanged', renderServices);
  }

  // Dynamic Reviews Renderer
  const reviewsTrack = document.querySelector('.reviews-track');
  if (reviewsTrack) {
    const defaultReviews = [
      {
        id: 1,
        customer_name: "Andrei Popescu",
        car: "BMW F30 320d - Stage 1",
        rating: 5,
        review_text: {
          ro: "Mașina se simte total diferit. Livrarea puterii este liniară, iar consumul a scăzut cu 1L/100km la mers constant. Profesioniști adevărați.",
          en: "The car feels completely different. Power delivery is linear, and fuel consumption dropped by 1L/100km at constant speed. Real professionals."
        },
        approved: 1
      },
      {
        id: 2,
        customer_name: "Mihai Ionescu",
        car: "VW Golf 7 2.0 TDI",
        rating: 5,
        review_text: {
          ro: "Am venit pentru un EGR Off și am plecat cu Stage 1. Recomand cu încredere, mi-au explicat tot procesul pas cu pas.",
          en: "I came for an EGR Off and left with Stage 1. Highly recommend, they explained the whole process step by step."
        },
        approved: 1
      },
      {
        id: 3,
        customer_name: "Alexandru Vasile",
        car: "Audi S3 8V - Stage 2",
        rating: 5,
        review_text: {
          ro: "Pops & Bangs exact cum mi-am dorit, fără să fie exagerat. Mașina trage excelent pe toată plaja de turații.",
          en: "Pops & Bangs exactly how I wanted, without being exaggerated. The car pulls excellently across the entire RPM range."
        },
        approved: 1
      }
    ];

    const renderHomeReviews = () => {
      reviewsTrack.innerHTML = '';
      let list = JSON.parse(localStorage.getItem('mas_reviews'));
      if (!list || !Array.isArray(list)) {
        list = defaultReviews;
        localStorage.setItem('mas_reviews', JSON.stringify(list));
      }

      const approvedList = list.filter(r => r.approved);
      if (approvedList.length === 0) return;

      // Duplicate the list 3 times for continuous looping scroll effect
      const loopList = [...approvedList, ...approvedList, ...approvedList];

      loopList.forEach(r => {
        let text = r.review_text;
        // Handle bilingual text for default reviews, or string for user reviews
        if (typeof text === 'object' && text !== null) {
          text = currentLang === 'en' ? (text.en || text.ro) : (text.ro || text.en);
        }

        const starsStr = '★'.repeat(r.rating) + '☆'.repeat(5 - r.rating);
        const card = document.createElement('div');
        card.className = 'review-card';
        card.innerHTML = `
          <div class="stars">${starsStr}</div>
          <p class="review-text">"${text}"</p>
          <div class="review-author">${r.customer_name}</div>
          <div class="review-car">${r.car}</div>
        `;
        reviewsTrack.appendChild(card);
      });
    };

    renderHomeReviews();
    document.addEventListener('languageChanged', renderHomeReviews);
  }

  // =====================================================
  // Site-wide Photo Carousel (Acasă / Despre Noi / Proiecte / Contact)
  // =====================================================
  const carouselEl = document.querySelector('.gallery-carousel');
  const carouselTrack = document.getElementById('carousel-track');
  const carouselDots = document.getElementById('carousel-dots');
  const carouselEmpty = document.getElementById('carousel-empty');
  const carouselPrev = document.getElementById('carousel-prev');
  const carouselNext = document.getElementById('carousel-next');

  if (carouselEl && carouselTrack) {
    const storageKey = `mas_gallery_${carouselEl.dataset.galleryKey}`;
    let currentSlide = 0;
    let autoPlayTimer = null;
    let carouselImages = [];

    const loadCarouselImages = () => {
      carouselImages = JSON.parse(localStorage.getItem(storageKey) || '[]');
    };

    const goToSlide = (index) => {
      if (carouselImages.length === 0) return;
      currentSlide = (index + carouselImages.length) % carouselImages.length;
      carouselTrack.style.transform = `translateX(-${currentSlide * 100}%)`;

      // Update dots
      document.querySelectorAll('.carousel-dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === currentSlide);
      });
    };

    const startAutoPlay = () => {
      stopAutoPlay();
      autoPlayTimer = setInterval(() => {
        goToSlide(currentSlide + 1);
      }, 2000);
    };

    const stopAutoPlay = () => {
      if (autoPlayTimer) {
        clearInterval(autoPlayTimer);
        autoPlayTimer = null;
      }
    };

    const renderCarousel = () => {
      loadCarouselImages();
      carouselTrack.innerHTML = '';
      carouselDots.innerHTML = '';

      if (carouselImages.length === 0) {
        carouselEl.style.display = 'none';
        if (carouselEmpty) carouselEmpty.style.display = 'flex';
        return;
      }

      carouselEl.style.display = 'block';
      if (carouselEmpty) carouselEmpty.style.display = 'none';

      carouselImages.forEach((src, i) => {
        // Slide
        const slide = document.createElement('div');
        slide.className = 'carousel-slide';

        // Blurred backdrop so differently-proportioned photos never look
        // hard-cropped — the sharp image on top is never cut off.
        const bgImg = document.createElement('img');
        bgImg.src = src;
        bgImg.alt = '';
        bgImg.setAttribute('aria-hidden', 'true');
        bgImg.loading = 'lazy';
        bgImg.className = 'carousel-slide-bg';
        slide.appendChild(bgImg);

        const img = document.createElement('img');
        img.src = src;
        img.alt = `Mas Performance – foto ${i + 1}`;
        img.loading = 'lazy';
        img.className = 'carousel-slide-fg';
        slide.appendChild(img);

        carouselTrack.appendChild(slide);

        // Dot
        const dot = document.createElement('button');
        dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('aria-label', `Slide ${i + 1}`);
        dot.addEventListener('click', () => {
          goToSlide(i);
          stopAutoPlay();
          startAutoPlay();
        });
        carouselDots.appendChild(dot);
      });

      currentSlide = 0;
      carouselTrack.style.transform = 'translateX(0)';
      startAutoPlay();
    };

    // Prev / Next buttons
    if (carouselPrev) {
      carouselPrev.addEventListener('click', () => {
        goToSlide(currentSlide - 1);
        stopAutoPlay();
        startAutoPlay();
      });
    }

    if (carouselNext) {
      carouselNext.addEventListener('click', () => {
        goToSlide(currentSlide + 1);
        stopAutoPlay();
        startAutoPlay();
      });
    }

    // Pause on hover
    carouselEl.addEventListener('mouseenter', stopAutoPlay);
    carouselEl.addEventListener('mouseleave', startAutoPlay);

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') { goToSlide(currentSlide - 1); stopAutoPlay(); startAutoPlay(); }
      if (e.key === 'ArrowRight') { goToSlide(currentSlide + 1); stopAutoPlay(); startAutoPlay(); }
    });

    renderCarousel();
  }

});
