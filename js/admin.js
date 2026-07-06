/*
DATABASE SCHEMA PROPOSED:
CREATE TABLE site_settings (key VARCHAR(100) PRIMARY KEY, value TEXT);
CREATE TABLE services (id INT AUTO_INCREMENT PRIMARY KEY, title_en TEXT, title_ro TEXT, description_en TEXT, description_ro TEXT, icon VARCHAR(100), price_range VARCHAR(50), display_order INT);
CREATE TABLE reviews (id INT AUTO_INCREMENT PRIMARY KEY, customer_name VARCHAR(100), car VARCHAR(100), rating INT, review_text TEXT, review_date DATE, approved TINYINT(1) DEFAULT 0);
CREATE TABLE tuning_cars (id INT AUTO_INCREMENT PRIMARY KEY, brand VARCHAR(50), model VARCHAR(100), engine VARCHAR(50), fuel VARCHAR(20), year_range VARCHAR(20), stock_hp INT, stock_nm INT, stage1_hp INT, stage1_nm INT, stage2_hp INT, stage2_nm INT);
CREATE TABLE contact_submissions (id INT AUTO_INCREMENT PRIMARY KEY, full_name VARCHAR(100), email VARCHAR(100), phone VARCHAR(20), car_brand VARCHAR(50), car_model VARCHAR(50), year INT, engine VARCHAR(50), fuel VARCHAR(20), mileage INT, services_requested TEXT, message TEXT, contact_method VARCHAR(20), contact_time VARCHAR(30), submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP, is_read TINYINT(1) DEFAULT 0);
CREATE TABLE media_files (id INT AUTO_INCREMENT PRIMARY KEY, filename VARCHAR(255), filepath VARCHAR(255), uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP);
*/

document.addEventListener('DOMContentLoaded', () => {
  // Check Authentication
  const isLoginPage = window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/admin/');
  
  if (!isLoginPage && sessionStorage.getItem('masAdmin') !== 'true') {
    window.location.href = 'index.html';
    return;
  }

  // Handle Login
  if (isLoginPage) {
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const u = document.getElementById('username').value;
        const p = document.getElementById('password').value;
        const err = document.getElementById('login-err');
        
        if (u === 'admin' && p === 'mas2025') {
          sessionStorage.setItem('masAdmin', 'true');
          window.location.href = 'dashboard.html';
        } else {
          err.style.display = 'block';
        }
      });
    }
    return; // Don't run rest of admin scripts on login page
  }

  // Handle Logout
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      sessionStorage.removeItem('masAdmin');
      window.location.href = 'index.html';
    });
  }

  // Modals
  window.openModal = function(id) {
    document.getElementById(id).classList.add('active');
  }
  window.closeModal = function(id) {
    document.getElementById(id).classList.remove('active');
  }

  // Dashboard Stats
  const page = window.location.pathname.split('/').pop().toLowerCase().replace('.html', '');
  
  if (page === 'dashboard') {
    const subs = JSON.parse(localStorage.getItem('contact_submissions') || '[]');
    const reviews = JSON.parse(localStorage.getItem('mas_reviews') || '[]');
    const unread = subs.filter(s => !s.is_read).length;
    const pendingReviews = reviews.filter(r => !r.approved).length;

    document.getElementById('stat-unread').textContent = unread;
    document.getElementById('stat-pending').textContent = pendingReviews;
    document.getElementById('stat-reviews').textContent = reviews.length;
    // Recent subs table
    const subTable = document.getElementById('dash-subs-tbody');
    subs.slice(-5).reverse().forEach(s => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${s.full_name}</td>
        <td>${s.car_brand} ${s.car_model}</td>
        <td>${new Date(s.submitted_at).toLocaleDateString()}</td>
        <td><span class="badge ${s.is_read ? 'badge-success' : 'badge-warning'}">${s.is_read ? 'Read' : 'New'}</span></td>
      `;
      subTable.appendChild(tr);
    });
  }

  // Settings
  if (page === 'settings') {
    const settings = JSON.parse(localStorage.getItem('mas_settings') || '{}');
    const colorPicker = document.getElementById('custom-color');
    const presets = document.querySelectorAll('.color-btn');

    // Load saved settings
    if(settings.accentColor) {
      document.documentElement.style.setProperty('--accent-color', settings.accentColor);
      colorPicker.value = settings.accentColor;
    }

    const sections = document.querySelectorAll('.settings-section');
    if (sections.length >= 5) {
      const heroSection = sections[1];
      const aboutSection = sections[2];
      const contactSection = sections[3];
      const socialSection = sections[4];

      const heroVideoInput = heroSection.querySelector('input');
      const heroHeadlineRoInput = heroSection.querySelectorAll('textarea')[0];
      const heroHeadlineEnInput = heroSection.querySelectorAll('textarea')[1];

      // About fields (using IDs for reliability)
      const aboutDescRoInput = document.getElementById('about-desc-ro');
      const aboutDescEnInput = document.getElementById('about-desc-en');
      const aboutFullRoInput = document.getElementById('about-full-ro');
      const aboutFullEnInput = document.getElementById('about-full-en');

      const contactPhoneInput = contactSection.querySelectorAll('input')[0];
      const contactWhatsappInput = contactSection.querySelectorAll('input')[1];
      const contactEmailInput = contactSection.querySelectorAll('input')[2];
      const contactAddressInput = contactSection.querySelector('textarea');

      const socialFacebookInput = socialSection.querySelectorAll('input')[0];
      const socialInstagramInput = socialSection.querySelectorAll('input')[1];
      const socialYoutubeInput = socialSection.querySelectorAll('input')[2];
      const socialTiktokInput = socialSection.querySelectorAll('input')[3];

      // Load saved values if they exist
      if (settings.heroVideo && heroVideoInput) heroVideoInput.value = settings.heroVideo;
      if (settings.heroHeadlineRo && heroHeadlineRoInput) heroHeadlineRoInput.value = settings.heroHeadlineRo;
      if (settings.heroHeadlineEn && heroHeadlineEnInput) heroHeadlineEnInput.value = settings.heroHeadlineEn;
      if (settings.aboutDescRo && aboutDescRoInput) aboutDescRoInput.value = settings.aboutDescRo;
      if (settings.aboutDescEn && aboutDescEnInput) aboutDescEnInput.value = settings.aboutDescEn;
      if (settings.aboutFullRo && aboutFullRoInput) aboutFullRoInput.value = settings.aboutFullRo;
      if (settings.aboutFullEn && aboutFullEnInput) aboutFullEnInput.value = settings.aboutFullEn;
      if (settings.contactPhone && contactPhoneInput) contactPhoneInput.value = settings.contactPhone;
      if (settings.contactWhatsapp && contactWhatsappInput) contactWhatsappInput.value = settings.contactWhatsapp;
      if (settings.contactEmail && contactEmailInput) contactEmailInput.value = settings.contactEmail;
      if (settings.contactAddress && contactAddressInput) contactAddressInput.value = settings.contactAddress;
      if (settings.socialFacebook && socialFacebookInput) socialFacebookInput.value = settings.socialFacebook;
      if (settings.socialInstagram && socialInstagramInput) socialInstagramInput.value = settings.socialInstagram;
      if (settings.socialYoutube && socialYoutubeInput) socialYoutubeInput.value = settings.socialYoutube;
      if (settings.socialTiktok && socialTiktokInput) socialTiktokInput.value = settings.socialTiktok;

      // Colors
      presets.forEach(btn => {
        btn.addEventListener('click', () => {
          const c = btn.getAttribute('data-color');
          document.documentElement.style.setProperty('--accent-color', c);
          settings.accentColor = c;
          colorPicker.value = c;
          localStorage.setItem('mas_settings', JSON.stringify(settings));
        });
      });

      colorPicker.addEventListener('change', (e) => {
        const c = e.target.value;
        document.documentElement.style.setProperty('--accent-color', c);
        settings.accentColor = c;
        localStorage.setItem('mas_settings', JSON.stringify(settings));
      });

      const saveBtn = document.getElementById('save-settings');
      if(saveBtn) {
        saveBtn.addEventListener('click', () => {
          if (heroVideoInput) settings.heroVideo = heroVideoInput.value;
          if (heroHeadlineRoInput) settings.heroHeadlineRo = heroHeadlineRoInput.value;
          if (heroHeadlineEnInput) settings.heroHeadlineEn = heroHeadlineEnInput.value;
          if (aboutDescRoInput) settings.aboutDescRo = aboutDescRoInput.value;
          if (aboutDescEnInput) settings.aboutDescEn = aboutDescEnInput.value;
          if (aboutFullRoInput) settings.aboutFullRo = aboutFullRoInput.value;
          if (aboutFullEnInput) settings.aboutFullEn = aboutFullEnInput.value;
          if (contactPhoneInput) settings.contactPhone = contactPhoneInput.value;
          if (contactWhatsappInput) settings.contactWhatsapp = contactWhatsappInput.value;
          if (contactEmailInput) settings.contactEmail = contactEmailInput.value;
          if (contactAddressInput) settings.contactAddress = contactAddressInput.value;
          if (socialFacebookInput) settings.socialFacebook = socialFacebookInput.value;
          if (socialInstagramInput) settings.socialInstagram = socialInstagramInput.value;
          if (socialYoutubeInput) settings.socialYoutube = socialYoutubeInput.value;
          if (socialTiktokInput) settings.socialTiktok = socialTiktokInput.value;

          localStorage.setItem('mas_settings', JSON.stringify(settings));
          alert('Setările au fost salvate cu succes!');
        });
      }
    }
  }



  // Submissions
  if (page === 'submissions') {
    const subs = JSON.parse(localStorage.getItem('contact_submissions') || '[]');
    const tbody = document.getElementById('subs-tbody');
    
    const renderSubs = () => {
      tbody.innerHTML = '';
      subs.reverse().forEach(s => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${s.full_name}</td>
          <td>${s.phone}</td>
          <td>${s.car_brand} ${s.car_model}</td>
          <td>${new Date(s.submitted_at).toLocaleDateString()}</td>
          <td><span class="badge ${s.is_read ? 'badge-success' : 'badge-warning'}">${s.is_read ? 'Read' : 'New'}</span></td>
          <td>
            <button class="btn btn-outline btn-small" onclick="viewSub(${s.id})">View</button>
          </td>
        `;
        tbody.appendChild(tr);
      });
    };
    
    renderSubs();
    
    window.viewSub = function(id) {
      const sub = subs.find(s => s.id === id);
      if(!sub) return;
      sub.is_read = 1;
      localStorage.setItem('contact_submissions', JSON.stringify(subs));
      
      const contentEl = document.getElementById('sub-details-content');
      if (contentEl) {
        contentEl.innerHTML = `
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; border-bottom: 1px solid var(--border-color); padding-bottom: 1rem;">
            <div>
              <strong style="color: var(--text-muted); font-size: 0.8rem; text-transform: uppercase;">Client</strong>
              <div style="font-weight: 600; font-size: 1.1rem; margin-top: 0.25rem;">${sub.full_name}</div>
            </div>
            <div>
              <strong style="color: var(--text-muted); font-size: 0.8rem; text-transform: uppercase;">Date</strong>
              <div style="margin-top: 0.25rem;">${new Date(sub.submitted_at).toLocaleString('ro-RO')}</div>
            </div>
          </div>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; border-bottom: 1px solid var(--border-color); padding-bottom: 1rem;">
            <div>
              <strong style="color: var(--text-muted); font-size: 0.8rem; text-transform: uppercase;">Phone</strong>
              <div style="margin-top: 0.25rem;"><a href="tel:${sub.phone.replace(/\s+/g, '')}" style="color: var(--accent-color); text-decoration: none;">${sub.phone}</a></div>
            </div>
            <div>
              <strong style="color: var(--text-muted); font-size: 0.8rem; text-transform: uppercase;">Email</strong>
              <div style="margin-top: 0.25rem;"><a href="mailto:${sub.email}" style="color: var(--accent-color); text-decoration: none;">${sub.email}</a></div>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; border-bottom: 1px solid var(--border-color); padding-bottom: 1rem;">
            <div>
              <strong style="color: var(--text-muted); font-size: 0.8rem; text-transform: uppercase;">Car Info</strong>
              <div style="margin-top: 0.25rem;"><strong>${sub.car_brand} ${sub.car_model}</strong> (${sub.year})</div>
              <div style="font-size: 0.9rem; color: var(--text-muted); margin-top: 0.25rem;">Engine: ${sub.engine} | Fuel: ${sub.fuel} | Mileage: ${sub.mileage ? sub.mileage + ' km' : '-'}</div>
            </div>
            <div>
              <strong style="color: var(--text-muted); font-size: 0.8rem; text-transform: uppercase;">Contact Preference</strong>
              <div style="margin-top: 0.25rem;">Via <strong>${sub.contact_method}</strong></div>
              <div style="font-size: 0.9rem; color: var(--text-muted); margin-top: 0.25rem;">Preferred time: ${sub.contact_time}</div>
            </div>
          </div>
          
          <div>
            <strong style="color: var(--text-muted); font-size: 0.8rem; text-transform: uppercase;">Message / Details</strong>
            <div style="background: rgba(255,255,255,0.05); padding: 1rem; border-radius: 4px; margin-top: 0.5rem; white-space: pre-wrap; border-left: 3px solid var(--accent-color);">${sub.message || 'No additional message provided.'}</div>
          </div>
        `;
        openModal('sub-modal');
      }
      renderSubs();
    }
  }

  // Review Management System
  if (page === 'reviews') {
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

    let reviewsList = JSON.parse(localStorage.getItem('mas_reviews'));
    if (!reviewsList || !Array.isArray(reviewsList)) {
      reviewsList = defaultReviews;
      localStorage.setItem('mas_reviews', JSON.stringify(reviewsList));
    }

    const tbody = document.getElementById('reviews-tbody');
    const modal = document.getElementById('review-modal');
    const form = document.getElementById('review-form');
    const addBtn = document.getElementById('add-review-btn');

    const inputId = document.getElementById('review-id');
    const inputCustomer = document.getElementById('review-customer');
    const inputCar = document.getElementById('review-car');
    const inputRating = document.getElementById('review-rating');
    const inputStatus = document.getElementById('review-status');
    const inputText = document.getElementById('review-text');

    const renderReviews = () => {
      tbody.innerHTML = '';
      reviewsList = JSON.parse(localStorage.getItem('mas_reviews')) || [];

      reviewsList.forEach(r => {
        const tr = document.createElement('tr');
        const starsStr = '★'.repeat(r.rating) + '☆'.repeat(5 - r.rating);
        
        let text = r.review_text;
        if (typeof text === 'object' && text !== null) {
          text = text.ro || text.en || '';
        }

        const toggleText = r.approved ? 'Hide' : 'Show';
        tr.innerHTML = `
          <td><strong>${r.customer_name}</strong></td>
          <td>${r.car}</td>
          <td style="color:var(--accent-color)">${starsStr}</td>
          <td><span class="badge ${r.approved ? 'badge-success' : 'badge-warning'}">${r.approved ? 'Visible' : 'Hidden'}</span></td>
          <td>
            <div class="action-btns">
              <button class="btn btn-outline btn-small" onclick="toggleReviewVisibility(${r.id})">${toggleText}</button>
              <button class="btn btn-primary btn-small" onclick="deleteReview(${r.id})">Del</button>
            </div>
          </td>
        `;
        tbody.appendChild(tr);
      });
    };

    addBtn.addEventListener('click', () => {
      document.getElementById('review-modal-title').textContent = 'Add New Review';
      inputId.value = '';
      form.reset();
      openModal('review-modal');
    });

    window.toggleReviewVisibility = function(id) {
      const r = reviewsList.find(rev => rev.id === id);
      if (!r) return;
      r.approved = r.approved ? 0 : 1;
      localStorage.setItem('mas_reviews', JSON.stringify(reviewsList));
      renderReviews();
    };

    window.deleteReview = function(id) {
      if (confirm('Sigur doriți să ștergeți acest review?')) {
        reviewsList = reviewsList.filter(rev => rev.id !== id);
        localStorage.setItem('mas_reviews', JSON.stringify(reviewsList));
        renderReviews();
      }
    };

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const customerVal = inputCustomer.value.trim();
      const carVal = inputCar.value.trim();
      const ratingVal = parseInt(inputRating.value);
      const statusVal = parseInt(inputStatus.value);
      const textVal = inputText.value.trim();

      const newRev = {
        id: Date.now(),
        customer_name: customerVal,
        car: carVal,
        rating: ratingVal,
        review_text: textVal,
        approved: statusVal
      };
      reviewsList.push(newRev);

      localStorage.setItem('mas_reviews', JSON.stringify(reviewsList));
      closeModal('review-modal');
      renderReviews();
    });

    // Reset modal fields automatically when modal active class is removed
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          const isActive = modal.classList.contains('active');
          if (!isActive) {
            form.reset();
          }
        }
      });
    });
    observer.observe(modal, { attributes: true });

    renderReviews();
  }

  // Media Library Manager
  if (page === 'media') {
    const defaultMedia = [
      "https://images.unsplash.com/photo-1555353540-64fd6b3e34b9?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=800&auto=format&fit=crop",
      "assets/images/IMG_2523.jpg",
      "https://images.unsplash.com/photo-1611016186353-9af58c69a533?q=80&w=800&auto=format&fit=crop"
    ];

    let mediaList = JSON.parse(localStorage.getItem('mas_media'));
    if (mediaList && Array.isArray(mediaList)) {
      const oldIndex = mediaList.findIndex(item => typeof item === 'string' && item.includes('photo-1600705722908-bab1e61c0b4d'));
      if (oldIndex !== -1) {
        mediaList[oldIndex] = 'assets/images/IMG_2523.jpg';
        localStorage.setItem('mas_media', JSON.stringify(mediaList));
      }
    } else {
      mediaList = defaultMedia;
      localStorage.setItem('mas_media', JSON.stringify(mediaList));
    }

    let imageSlots = JSON.parse(localStorage.getItem('mas_image_slots') || '{}');
    if (imageSlots['home_about'] && imageSlots['home_about'].includes('photo-1600705722908-bab1e61c0b4d')) {
      imageSlots['home_about'] = 'assets/images/IMG_2523.jpg';
      localStorage.setItem('mas_image_slots', JSON.stringify(imageSlots));
    }

    // Available positions / slots (General media only, projects are managed separately)
    const slots = [
      { id: "home_about", name: "Acasă: Despre Noi" },
      { id: "about_workshop", name: "Despre Noi: Workshop" }
    ];

    const grid = document.getElementById('admin-media-grid');
    const dropZone = document.getElementById('media-drop-zone');
    const fileInput = document.getElementById('media-file-input');
    const urlForm = document.getElementById('url-upload-form');
    const urlInput = document.getElementById('url-upload-input');

    const renderMedia = () => {
      grid.innerHTML = '';
      
      // Update imageSlots in case any references got broken or cleaned
      imageSlots = JSON.parse(localStorage.getItem('mas_image_slots') || '{}');

      mediaList.forEach((imgSrc, index) => {
        const item = document.createElement('div');
        item.className = 'media-item';

        // Check if this image is assigned to any slot
        let activeSlotName = '';
        let activeSlotId = '';
        for (const [slotId, src] of Object.entries(imageSlots)) {
          if (src === imgSrc) {
            const found = slots.find(s => s.id === slotId);
            if (found) {
              activeSlotName = found.name;
              activeSlotId = slotId;
            }
          }
        }

        const imgContainer = document.createElement('div');
        imgContainer.className = 'media-item-img-container';
        
        const img = document.createElement('img');
        img.src = imgSrc;
        img.alt = 'Media File';
        imgContainer.appendChild(img);

        if (activeSlotName) {
          const badge = document.createElement('div');
          badge.className = 'media-slot-badge';
          badge.textContent = activeSlotName;
          imgContainer.appendChild(badge);
        }

        const delBtn = document.createElement('button');
        delBtn.className = 'delete-btn';
        delBtn.innerHTML = '&times;';
        delBtn.title = 'Șterge imaginea';
        delBtn.addEventListener('click', () => {
          if (confirm('Sigur doriți să ștergeți această imagine din bibliotecă?')) {
            // Remove assignment if any
            if (activeSlotId) {
              delete imageSlots[activeSlotId];
              localStorage.setItem('mas_image_slots', JSON.stringify(imageSlots));
            }
            // Remove from list
            mediaList.splice(index, 1);
            localStorage.setItem('mas_media', JSON.stringify(mediaList));
            renderMedia();
          }
        });
        imgContainer.appendChild(delBtn);

        const info = document.createElement('div');
        info.className = 'media-item-info';

        const label = document.createElement('label');
        label.textContent = 'Poziție pe site';
        info.appendChild(label);

        const select = document.createElement('select');
        select.addEventListener('change', (e) => {
          const newSlot = e.target.value;

          // Remove this image's old assignment if there was one
          if (activeSlotId) {
            delete imageSlots[activeSlotId];
          }

          if (newSlot) {
            // If another image was using the new slot, it gets unassigned
            for (const [sId, src] of Object.entries(imageSlots)) {
              if (sId === newSlot) {
                delete imageSlots[sId];
              }
            }
            // Assign this image to the selected slot
            imageSlots[newSlot] = imgSrc;
          }

          localStorage.setItem('mas_image_slots', JSON.stringify(imageSlots));
          renderMedia();
        });

        // Add empty/none option
        const optDefault = document.createElement('option');
        optDefault.value = '';
        optDefault.textContent = '-- Neselectat --';
        select.appendChild(optDefault);

        slots.forEach(slot => {
          const opt = document.createElement('option');
          opt.value = slot.id;
          opt.textContent = slot.name;
          if (activeSlotId === slot.id) {
            opt.selected = true;
          }
          select.appendChild(opt);
        });

        info.appendChild(select);
        item.appendChild(imgContainer);
        item.appendChild(info);
        grid.appendChild(item);
      });
    };

    // Trigger file input on dropzone click
    dropZone.addEventListener('click', () => {
      fileInput.click();
    });

    // Handle Drag & Drop styling
    ['dragenter', 'dragover'].forEach(eventName => {
      dropZone.addEventListener(eventName, (e) => {
        e.preventDefault();
        dropZone.classList.add('dragover');
      }, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
      dropZone.addEventListener(eventName, (e) => {
        e.preventDefault();
        dropZone.classList.remove('dragover');
      }, false);
    });

    // Helper to process files and convert to base64
    const handleFiles = (files) => {
      Array.from(files).forEach(file => {
        if (!file.type.startsWith('image/')) return;
        const reader = new FileReader();
        reader.onload = (e) => {
          const base64Data = e.target.result;
          mediaList.push(base64Data);
          localStorage.setItem('mas_media', JSON.stringify(mediaList));
          renderMedia();
        };
        reader.readAsDataURL(file);
      });
    };

    // Handle File Drop
    dropZone.addEventListener('drop', (e) => {
      const dt = e.dataTransfer;
      const files = dt.files;
      handleFiles(files);
    });

    // Handle File Picker Select
    fileInput.addEventListener('change', (e) => {
      const files = e.target.files;
      handleFiles(files);
    });

    // Handle URL form submit
    urlForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const url = urlInput.value.trim();
      if (url) {
        mediaList.push(url);
        localStorage.setItem('mas_media', JSON.stringify(mediaList));
        urlInput.value = '';
        renderMedia();
      }
    });

  }

  // Project Management System
  if (page === 'projects') {
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

    let projects = JSON.parse(localStorage.getItem('mas_projects'));
    if (!projects || !Array.isArray(projects)) {
      projects = defaultProjects;
      localStorage.setItem('mas_projects', JSON.stringify(projects));
    }

    const tbody = document.getElementById('projects-tbody');
    const modal = document.getElementById('project-modal');
    const form = document.getElementById('project-form');
    const addBtn = document.getElementById('add-project-btn');
    
    // Modal Form Elements
    const inputId = document.getElementById('project-id');
    const inputTitle = document.getElementById('project-title');
    const inputDescRo = document.getElementById('project-desc-ro');
    const inputDescEn = document.getElementById('project-desc-en');
    const inputStock = document.getElementById('project-stock');
    const inputTuned = document.getElementById('project-tuned');
    const inputImgSrc = document.getElementById('project-img-src');
    
    // Media inside modal elements
    const preview = document.getElementById('project-img-preview');
    const placeholder = document.getElementById('project-img-placeholder');
    const dropZone = document.getElementById('project-img-drop-zone');
    const fileInput = document.getElementById('project-img-file-input');
    const urlInput = document.getElementById('project-img-url-input');

    const clearImagePreview = () => {
      preview.src = '';
      preview.style.display = 'none';
      placeholder.style.display = 'block';
      inputImgSrc.value = '';
      urlInput.value = '';
    };

    const setImagePreview = (src) => {
      preview.src = src;
      preview.style.display = 'block';
      placeholder.style.display = 'none';
      inputImgSrc.value = src;
    };

    // Process image uploads inside the modal
    const handleProjectImage = (files) => {
      const file = files[0];
      if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setImagePreview(e.target.result);
        };
        reader.readAsDataURL(file);
      }
    };

    // Modal Drop Zone click
    dropZone.addEventListener('click', () => {
      fileInput.click();
    });

    // Dropzone Drag and Drop styling
    ['dragenter', 'dragover'].forEach(eventName => {
      dropZone.addEventListener(eventName, (e) => {
        e.preventDefault();
        dropZone.classList.add('dragover');
      }, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
      dropZone.addEventListener(eventName, (e) => {
        e.preventDefault();
        dropZone.classList.remove('dragover');
      }, false);
    });

    dropZone.addEventListener('drop', (e) => {
      handleProjectImage(e.dataTransfer.files);
    });

    fileInput.addEventListener('change', (e) => {
      handleProjectImage(e.target.files);
    });

    urlInput.addEventListener('input', (e) => {
      const url = e.target.value.trim();
      if (url) {
        setImagePreview(url);
      }
    });

    // Render projects list in Admin Table
    const renderAdminProjects = () => {
      tbody.innerHTML = '';
      projects = JSON.parse(localStorage.getItem('mas_projects')) || [];
      
      projects.forEach(p => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td><img src="${p.image}" class="project-thumbnail" alt="${p.title}"></td>
          <td><strong>${p.title}</strong></td>
          <td>
            <div style="font-size:0.85rem; color:var(--text-primary);"><strong>RO:</strong> ${p.desc_ro}</div>
            <div style="font-size:0.85rem; color:var(--text-muted); margin-top:0.25rem;"><strong>EN:</strong> ${p.desc_en}</div>
          </td>
          <td>
            <div><span style="color:var(--text-muted); font-size:0.75rem;">Stock:</span> ${p.stock}</div>
            <div style="margin-top:0.25rem;"><span style="color:var(--accent-color); font-size:0.75rem;">Tuned:</span> ${p.tuned}</div>
          </td>
          <td>
            <div class="action-btns">
              <button class="btn btn-outline btn-small" onclick="editProject(${p.id})">Edit</button>
              <button class="btn btn-primary btn-small" onclick="deleteProject(${p.id})">Del</button>
            </div>
          </td>
        `;
        tbody.appendChild(tr);
      });
    };

    // Open add modal
    addBtn.addEventListener('click', () => {
      document.getElementById('modal-title').textContent = 'Add New Project';
      clearImagePreview();
      inputId.value = '';
      openModal('project-modal');
    });

    // Edit project
    window.editProject = function(id) {
      const p = projects.find(proj => proj.id === id);
      if (!p) return;
      
      document.getElementById('modal-title').textContent = 'Edit Project';
      inputId.value = p.id;
      inputTitle.value = p.title;
      inputDescRo.value = p.desc_ro;
      inputDescEn.value = p.desc_en;
      inputStock.value = p.stock;
      inputTuned.value = p.tuned;
      
      if (p.image) {
        setImagePreview(p.image);
      } else {
        clearImagePreview();
      }
      
      openModal('project-modal');
    };

    // Delete project
    window.deleteProject = function(id) {
      if (confirm('Sigur doriți să ștergeți acest proiect?')) {
        projects = projects.filter(p => p.id !== id);
        localStorage.setItem('mas_projects', JSON.stringify(projects));
        renderAdminProjects();
      }
    };

    // Form Submit (Add / Edit project save)
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const idVal = inputId.value;
      const titleVal = inputTitle.value.trim();
      const descRoVal = inputDescRo.value.trim();
      const descEnVal = inputDescEn.value.trim();
      const stockVal = inputStock.value.trim();
      const tunedVal = inputTuned.value.trim();
      const imgVal = inputImgSrc.value.trim() || 'https://images.unsplash.com/photo-1555353540-64fd6b3e34b9?q=80&w=800&auto=format&fit=crop'; // fallback default image
      
      if (idVal) {
        // Edit existing project
        const projectIndex = projects.findIndex(proj => proj.id === parseInt(idVal));
        if (projectIndex !== -1) {
          projects[projectIndex] = {
            id: parseInt(idVal),
            title: titleVal,
            desc_ro: descRoVal,
            desc_en: descEnVal,
            stock: stockVal,
            tuned: tunedVal,
            image: imgVal
          };
        }
      } else {
        // Add new project
        const newProj = {
          id: Date.now(),
          title: titleVal,
          desc_ro: descRoVal,
          desc_en: descEnVal,
          stock: stockVal,
          tuned: tunedVal,
          image: imgVal
        };
        projects.push(newProj);
      }
      
      localStorage.setItem('mas_projects', JSON.stringify(projects));
      closeModal('project-modal');
      renderAdminProjects();
    });

    // Reset modal fields automatically when modal active class is removed
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          const isActive = modal.classList.contains('active');
          if (!isActive) {
            form.reset();
            clearImagePreview();
          }
        }
      });
    });
    observer.observe(modal, { attributes: true });

    // Initial render
    renderAdminProjects();
  }

  // Database Page Backup logic
  if (page === 'database') {
    const settings = JSON.parse(localStorage.getItem('mas_settings') || '{}');
    const subs = JSON.parse(localStorage.getItem('contact_submissions') || '[]');
    const reviews = JSON.parse(localStorage.getItem('mas_reviews') || '[]');
    const projects = JSON.parse(localStorage.getItem('mas_projects') || '[]');

    // Populate counts
    const dbStatSettings = document.getElementById('db-stat-settings');
    const dbStatSubmissions = document.getElementById('db-stat-submissions');
    const dbStatReviews = document.getElementById('db-stat-reviews');
    const dbStatProjects = document.getElementById('db-stat-projects');

    if (dbStatSettings) dbStatSettings.textContent = Object.keys(settings).length;
    if (dbStatSubmissions) dbStatSubmissions.textContent = subs.length;
    if (dbStatReviews) dbStatReviews.textContent = reviews.length;
    if (dbStatProjects) dbStatProjects.textContent = projects.length;

    // Download Backup click handler
    const dlBtn = document.getElementById('btn-download-sql');
    if (dlBtn) {
      dlBtn.addEventListener('click', () => {
        let sql = `-- Mas Performance Database Backup\n`;
        sql += `-- Generated at: ${new Date().toISOString()}\n\n`;
        sql += `SET FOREIGN_KEY_CHECKS = 0;\n\n`;

        // 1. site_settings
        sql += `-- ------------------------------------------------------\n`;
        sql += `-- Table structure for table \`site_settings\`\n`;
        sql += `-- ------------------------------------------------------\n`;
        sql += `DROP TABLE IF EXISTS \`site_settings\`;\n`;
        sql += `CREATE TABLE \`site_settings\` (\n`;
        sql += `  \`key\` varchar(100) NOT NULL,\n`;
        sql += `  \`value\` text,\n`;
        sql += `  PRIMARY KEY (\`key\`)\n`;
        sql += `) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;\n\n`;

        sql += `-- Dumping data for table \`site_settings\`\n`;
        if (Object.keys(settings).length > 0) {
          sql += `INSERT INTO \`site_settings\` (\`key\`, \`value\`) VALUES\n`;
          const entries = Object.entries(settings).map(([k, v]) => {
            const safeVal = String(v).replace(/'/g, "''").replace(/\\/g, "\\\\").replace(/\n/g, "\\n");
            return `('${k}', '${safeVal}')`;
          });
          sql += entries.join(',\n') + ';\n';
        }
        sql += `\n`;

        // 2. projects
        sql += `-- ------------------------------------------------------\n`;
        sql += `-- Table structure for table \`projects\`\n`;
        sql += `-- ------------------------------------------------------\n`;
        sql += `DROP TABLE IF EXISTS \`projects\`;\n`;
        sql += `CREATE TABLE \`projects\` (\n`;
        sql += `  \`id\` bigint(20) NOT NULL,\n`;
        sql += `  \`title\` varchar(255) DEFAULT NULL,\n`;
        sql += `  \`desc_ro\` text,\n`;
        sql += `  \`desc_en\` text,\n`;
        sql += `  \`stock\` varchar(100) DEFAULT NULL,\n`;
        sql += `  \`tuned\` varchar(100) DEFAULT NULL,\n`;
        sql += `  \`image\` text,\n`;
        sql += `  PRIMARY KEY (\`id\`)\n`;
        sql += `) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;\n\n`;

        sql += `-- Dumping data for table \`projects\`\n`;
        if (projects.length > 0) {
          sql += `INSERT INTO \`projects\` (\`id\`, \`title\`, \`desc_ro\`, \`desc_en\`, \`stock\`, \`tuned\`, \`image\`) VALUES\n`;
          const entries = projects.map(p => {
            const title = String(p.title || '').replace(/'/g, "''");
            const descRo = String(p.desc_ro || '').replace(/'/g, "''");
            const descEn = String(p.desc_en || '').replace(/'/g, "''");
            const stock = String(p.stock || '').replace(/'/g, "''");
            const tuned = String(p.tuned || '').replace(/'/g, "''");
            const image = String(p.image || '').replace(/'/g, "''");
            return `(${p.id}, '${title}', '${descRo}', '${descEn}', '${stock}', '${tuned}', '${image}')`;
          });
          sql += entries.join(',\n') + ';\n';
        }
        sql += `\n`;

        // 3. reviews
        sql += `-- ------------------------------------------------------\n`;
        sql += `-- Table structure for table \`reviews\`\n`;
        sql += `-- ------------------------------------------------------\n`;
        sql += `DROP TABLE IF EXISTS \`reviews\`;\n`;
        sql += `CREATE TABLE \`reviews\` (\n`;
        sql += `  \`id\` bigint(20) NOT NULL,\n`;
        sql += `  \`customer_name\` varchar(100) DEFAULT NULL,\n`;
        sql += `  \`car\` varchar(100) DEFAULT NULL,\n`;
        sql += `  \`rating\` int(11) DEFAULT NULL,\n`;
        sql += `  \`review_text\` text,\n`;
        sql += `  \`approved\` tinyint(1) DEFAULT '0',\n`;
        sql += `  PRIMARY KEY (\`id\`)\n`;
        sql += `) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;\n\n`;

        sql += `-- Dumping data for table \`reviews\`\n`;
        if (reviews.length > 0) {
          sql += `INSERT INTO \`reviews\` (\`id\`, \`customer_name\`, \`car\`, \`rating\`, \`review_text\`, \`approved\`) VALUES\n`;
          const entries = reviews.map(r => {
            const name = String(r.customer_name || '').replace(/'/g, "''");
            const car = String(r.car || '').replace(/'/g, "''");
            let text = r.review_text;
            if (typeof text === 'object' && text !== null) {
              text = text.ro || text.en || '';
            }
            const safeText = String(text || '').replace(/'/g, "''");
            return `(${r.id}, '${name}', '${car}', ${r.rating}, '${safeText}', ${r.approved})`;
          });
          sql += entries.join(',\n') + ';\n';
        }
        sql += `\n`;

        // 4. contact_submissions
        sql += `-- ------------------------------------------------------\n`;
        sql += `-- Table structure for table \`contact_submissions\`\n`;
        sql += `-- ------------------------------------------------------\n`;
        sql += `DROP TABLE IF EXISTS \`contact_submissions\`;\n`;
        sql += `CREATE TABLE \`contact_submissions\` (\n`;
        sql += `  \`id\` bigint(20) NOT NULL,\n`;
        sql += `  \`full_name\` varchar(100) DEFAULT NULL,\n`;
        sql += `  \`email\` varchar(100) DEFAULT NULL,\n`;
        sql += `  \`phone\` varchar(20) DEFAULT NULL,\n`;
        sql += `  \`car_brand\` varchar(50) DEFAULT NULL,\n`;
        sql += `  \`car_model\` varchar(50) DEFAULT NULL,\n`;
        sql += `  \`year\` int(11) DEFAULT NULL,\n`;
        sql += `  \`engine\` varchar(50) DEFAULT NULL,\n`;
        sql += `  \`fuel\` varchar(20) DEFAULT NULL,\n`;
        sql += `  \`mileage\` int(11) DEFAULT NULL,\n`;
        sql += `  \`message\` text,\n`;
        sql += `  \`contact_method\` varchar(20) DEFAULT NULL,\n`;
        sql += `  \`contact_time\` varchar(30) DEFAULT NULL,\n`;
        sql += `  \`submitted_at\` varchar(50) DEFAULT NULL,\n`;
        sql += `  \`is_read\` tinyint(1) DEFAULT '0',\n`;
        sql += `  PRIMARY KEY (\`id\`)\n`;
        sql += `) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;\n\n`;

        sql += `-- Dumping data for table \`contact_submissions\`\n`;
        if (subs.length > 0) {
          sql += `INSERT INTO \`contact_submissions\` (\`id\`, \`full_name\`, \`email\`, \`phone\`, \`car_brand\`, \`car_model\`, \`year\`, \`engine\`, \`fuel\`, \`mileage\`, \`message\`, \`contact_method\`, \`contact_time\`, \`submitted_at\`, \`is_read\`) VALUES\n`;
          const entries = subs.map(s => {
            const name = String(s.full_name || '').replace(/'/g, "''");
            const email = String(s.email || '').replace(/'/g, "''");
            const phone = String(s.phone || '').replace(/'/g, "''");
            const brand = String(s.car_brand || '').replace(/'/g, "''");
            const model = String(s.car_model || '').replace(/'/g, "''");
            const engine = String(s.engine || '').replace(/'/g, "''");
            const fuel = String(s.fuel || '').replace(/'/g, "''");
            const mileage = s.mileage ? s.mileage : 'NULL';
            const msg = String(s.message || '').replace(/'/g, "''");
            const method = String(s.contact_method || '').replace(/'/g, "''");
            const time = String(s.contact_time || '').replace(/'/g, "''");
            const date = String(s.submitted_at || '').replace(/'/g, "''");
            return `(${s.id}, '${name}', '${email}', '${phone}', '${brand}', '${model}', ${s.year}, '${engine}', '${fuel}', ${mileage}, '${msg}', '${method}', '${time}', '${date}', ${s.is_read})`;
          });
          sql += entries.join(',\n') + ';\n';
        }
        sql += `\n`;

        sql += `SET FOREIGN_KEY_CHECKS = 1;\n`;
        
        // Trigger download
        const blob = new Blob([sql], { type: 'text/plain;charset=utf-8' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        const now = new Date();
        const dateStr = now.getFullYear() + '-' + String(now.getMonth()+1).padStart(2, '0') + '-' + String(now.getDate()).padStart(2, '0');
        a.download = `mas_performance_backup_${dateStr}.sql`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      });
    }
  }
});
