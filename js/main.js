// Main JS
document.addEventListener('DOMContentLoaded', () => {

  // Load color theme if customized in admin
  const siteSettings = JSON.parse(localStorage.getItem('mas_settings') || '{}');
  if (siteSettings.accentColor) {
    document.documentElement.style.setProperty('--accent-color', siteSettings.accentColor);
    document.documentElement.style.setProperty('--logo-glow', `0 0 14px ${siteSettings.accentColor}CC, 0 0 36px ${siteSettings.accentColor}59`);
  }

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

});
