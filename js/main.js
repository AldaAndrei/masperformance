// Main JS
document.addEventListener('DOMContentLoaded', () => {

  // Load color theme if customized in admin
  const siteSettings = JSON.parse(localStorage.getItem('mas_settings') || '{}');
  if (siteSettings.accentColor) {
    document.documentElement.style.setProperty('--accent-color', siteSettings.accentColor);
    document.documentElement.style.setProperty('--logo-glow', `0 0 14px ${siteSettings.accentColor}CC, 0 0 36px ${siteSettings.accentColor}59`);
  }

  // Load dynamic image assignments from admin
  const imageSlots = JSON.parse(localStorage.getItem('mas_image_slots') || '{}');
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
        image: "https://images.unsplash.com/photo-1555353540-64fd6b3e34b9?q=80&w=800&auto=format&fit=crop"
      },
      {
        id: 2,
        title: "VW Golf 7 GTI",
        desc_ro: "Stage 1 + DSG Tune",
        desc_en: "Stage 1 + DSG Tune",
        stock: "220 HP / 350 Nm",
        tuned: "300 HP / 450 Nm",
        image: "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?q=80&w=800&auto=format&fit=crop"
      },
      {
        id: 3,
        title: "Audi A6 3.0 TDI",
        desc_ro: "Stage 1 + EGR/DPF Off (Motorsport)",
        desc_en: "Stage 1 + EGR/DPF Off (Motorsport)",
        stock: "245 HP / 500 Nm",
        tuned: "300 HP / 600 Nm",
        image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=800&auto=format&fit=crop"
      }
    ];

    const renderProjects = () => {
      projectsGrid.innerHTML = '';
      const projects = JSON.parse(localStorage.getItem('mas_projects'));
      
      // Fallback/Init if not set
      let list = projects;
      if (!list || !Array.isArray(list)) {
        list = defaultProjects;
        localStorage.setItem('mas_projects', JSON.stringify(list));
      }

      list.forEach(p => {
        const desc = currentLang === 'ro' ? p.desc_ro : p.desc_en;
        const stockLabel = currentLang === 'ro' ? 'Stock' : 'Stock';
        const tunedLabel = currentLang === 'ro' ? 'Optimizat' : 'Tuned';
        
        const card = document.createElement('div');
        card.style.cssText = "background: var(--surface-1); border: 1px solid var(--border-color); display: flex; flex-direction: column;";

        card.innerHTML = `
          <img src="${p.image}" alt="${p.title}" style="width: 100%; height: 250px; object-fit: cover; filter: grayscale(100%); transition: all 0.3s;" onmouseover="this.style.filter='grayscale(0%)'" onmouseout="this.style.filter='grayscale(100%)'">
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
        projectsGrid.appendChild(card);
      });
    };

    // Initial render
    renderProjects();

    // Re-render when language changes
    document.addEventListener('languageChanged', renderProjects);
  }

});
