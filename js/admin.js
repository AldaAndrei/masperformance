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
});
