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
  const page = window.location.pathname.split('/').pop();
  
  if (page === 'dashboard.html') {
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
  if (page === 'settings.html') {
    const settings = JSON.parse(localStorage.getItem('mas_settings') || '{}');
    const colorPicker = document.getElementById('custom-color');
    const presets = document.querySelectorAll('.color-btn');

    // Load saved settings
    if(settings.accentColor) {
      document.documentElement.style.setProperty('--accent-color', settings.accentColor);
      colorPicker.value = settings.accentColor;
    }

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
    
    /* PHP CONVERSION NOTE:
      $stmt = $pdo->prepare("UPDATE site_settings SET value = ? WHERE key = ?");
      foreach($_POST as $key => $value) {
         $stmt->execute([$value, $key]);
      }
    */
    const saveBtn = document.getElementById('save-settings');
    if(saveBtn) {
      saveBtn.addEventListener('click', () => {
        alert('Settings saved to localStorage (Prototype)');
      });
    }
  }



  // Submissions
  if (page === 'submissions.html') {
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
      alert(`Message from ${sub.full_name}:\n\n${sub.message}\n\nFuel: ${sub.fuel}\nMileage: ${sub.mileage}\nContact via: ${sub.contact_method} (${sub.contact_time})`);
      renderSubs();
    }
  }

  // Media Library Manager
  if (page === 'media.html') {
    const defaultMedia = [
      "https://images.unsplash.com/photo-1555353540-64fd6b3e34b9?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600705722908-bab1e61c0b4d?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1611016186353-9af58c69a533?q=80&w=800&auto=format&fit=crop"
    ];

    let mediaList = JSON.parse(localStorage.getItem('mas_media'));
    if (!mediaList || !Array.isArray(mediaList)) {
      mediaList = defaultMedia;
      localStorage.setItem('mas_media', JSON.stringify(mediaList));
    }

    let imageSlots = JSON.parse(localStorage.getItem('mas_image_slots') || '{}');

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
  if (page === 'projects.html') {
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
});
