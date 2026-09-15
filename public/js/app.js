/**
 * MAKTAB CRM - MAIN CONTROLLER APPLICATION
 * Sahifalar navigatsiyasi, CRUD amallari, qidiruv va interaktiv funksiyalar
 */

// Global Toast bildirishnoma ko'rsatuvchisi
function showToast(message, type = 'info') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  let icon = 'fa-circle-info';
  if (type === 'success') icon = 'fa-circle-check';
  if (type === 'error') icon = 'fa-triangle-exclamation';

  toast.innerHTML = `
    <i class="fa-solid ${icon}" style="font-size: 18px;"></i>
    <div style="flex: 1;">${message}</div>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

const CRM_App = {
  activeTab: 'dashboard',
  selectedClassForTimetable: '11-A',

  init() {
    this.setupClock();
    this.setupNavigation();
    this.setupModals();
    this.setupGlobalEvents();
    this.refreshAllViews();
  },

  // 1. Jonli Toshkent soati va sana
  setupClock() {
    const updateTime = () => {
      const now = new Date();
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      const dateStr = now.toLocaleDateString('uz-UZ', options);
      const timeStr = now.toLocaleTimeString('uz-UZ', { hour12: false });

      const dateElem = document.getElementById('live-date-text');
      const timeElem = document.getElementById('live-time-text');

      if (dateElem) dateElem.textContent = dateStr;
      if (timeElem) timeElem.textContent = timeStr;
    };

    updateTime();
    setInterval(updateTime, 1000);
  },

  // 2. Navigatsiya bo'limlarini almashtirish
  setupNavigation() {
    const navItems = document.querySelectorAll('.sidebar-nav .nav-item');
    navItems.forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const tab = item.getAttribute('data-tab');
        if (tab) {
          this.switchTab(tab);
        }
      });
    });

    // Mobil sidebar tugmasi
    const toggleSidebarBtn = document.getElementById('btn-toggle-sidebar');
    const sidebar = document.querySelector('.crm-sidebar');
    if (toggleSidebarBtn && sidebar) {
      toggleSidebarBtn.addEventListener('click', () => {
        sidebar.classList.toggle('mobile-open');
      });
    }

    // Tashqi qism bosilganda mobil sidebarni yopish
    document.addEventListener('click', (e) => {
      if (sidebar && sidebar.classList.contains('mobile-open')) {
        if (!sidebar.contains(e.target) && !toggleSidebarBtn.contains(e.target)) {
          sidebar.classList.remove('mobile-open');
        }
      }
    });
  },

  switchTab(tabId) {
    this.activeTab = tabId;

    // Sidebar active klassini almashtirish
    document.querySelectorAll('.sidebar-nav .nav-item').forEach(item => {
      if (item.getAttribute('data-tab') === tabId) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    // Bo'limlarni ko'rsatish/yashirish
    document.querySelectorAll('.tab-section').forEach(section => {
      if (section.id === `section-${tabId}`) {
        section.style.display = 'block';
      } else {
        section.style.display = 'none';
      }
    });

    // Bo'limga mos ma'lumotlarni render qilish
    this.renderSection(tabId);

    // Mobil menyuni yopish
    const sidebar = document.querySelector('.crm-sidebar');
    if (sidebar) sidebar.classList.remove('mobile-open');
  },

  renderSection(tabId) {
    switch (tabId) {
      case 'dashboard':
        this.renderDashboardStats();
        setTimeout(() => CRM_Charts.init(), 100);
        break;
      case 'students':
        this.renderStudents();
        break;
      case 'teachers':
        this.renderTeachers();
        break;
      case 'classes':
        this.renderClasses();
        this.renderTimetable();
        break;
      case 'payments':
        this.renderPayments();
        break;
      case 'attendance':
        this.renderAttendance();
        break;
      case 'settings':
        this.renderSettings();
        break;
    }
  },

  refreshAllViews() {
    this.updateBadges();
    this.renderSection(this.activeTab);
  },

  updateBadges() {
    const students = CRM_Data.getStudents();
    const teachers = CRM_Data.getTeachers();

    const stuBadge = document.getElementById('badge-students-count');
    const tchBadge = document.getElementById('badge-teachers-count');

    if (stuBadge) stuBadge.textContent = students.length;
    if (tchBadge) tchBadge.textContent = teachers.length;
  },

  // 3. DASHBOARD STATS
  renderDashboardStats() {
    const students = CRM_Data.getStudents();
    const teachers = CRM_Data.getTeachers();
    const payments = CRM_Data.getPayments();

    const totalStudentsElem = document.getElementById('dash-total-students');
    const totalTeachersElem = document.getElementById('dash-total-teachers');
    const totalPaymentsElem = document.getElementById('dash-total-payments');

    if (totalStudentsElem) totalStudentsElem.textContent = students.length;
    if (totalTeachersElem) totalTeachersElem.textContent = teachers.length;

    // Hisoblangan to'lovlar
    let totalIncome = 0;
    payments.forEach(p => {
      const num = parseInt(p.amount.replace(/\D/g, '')) || 0;
      totalIncome += num;
    });

    if (totalPaymentsElem) {
      totalPaymentsElem.textContent = totalIncome.toLocaleString('uz-UZ') + " so'm";
    }

    // So'nggi faoliyatlar ro'yxati
    const recentList = document.getElementById('recent-activities-list');
    if (recentList) {
      recentList.innerHTML = `
        <div class="lesson-item">
          <div class="stat-icon-wrap stat-icon-emerald" style="width: 38px; height: 38px; font-size: 16px;">
            <i class="fa-solid fa-check"></i>
          </div>
          <div style="flex: 1;">
            <div class="user-full-name" style="font-size: 13px;">Yangi o'quvchi qo'shildi</div>
            <div class="user-subtext">Alisher Qodirov (11-A sinfi) muvaffaqiyatli qabul qilindi</div>
          </div>
          <span style="font-size: 11px; color: var(--text-muted);">10 daqiqa oldin</span>
        </div>
        <div class="lesson-item">
          <div class="stat-icon-wrap stat-icon-blue" style="width: 38px; height: 38px; font-size: 16px;">
            <i class="fa-solid fa-receipt"></i>
          </div>
          <div style="flex: 1;">
            <div class="user-full-name" style="font-size: 13px;">Oylik to'lov qabul qilindi</div>
            <div class="user-subtext">Madina Karimova - 1,200,000 so'm (Click)</div>
          </div>
          <span style="font-size: 11px; color: var(--text-muted);">Bugun 14:20</span>
        </div>
        <div class="lesson-item">
          <div class="stat-icon-wrap stat-icon-cyan" style="width: 38px; height: 38px; font-size: 16px;">
            <i class="fa-solid fa-calendar-check"></i>
          </div>
          <div style="flex: 1;">
            <div class="user-full-name" style="font-size: 13px;">Bugungi davomat tasdiqlandi</div>
            <div class="user-subtext">Umumiy ko'rsatkich: 96.4% qatnashuv</div>
          </div>
          <span style="font-size: 11px; color: var(--text-muted);">Bugun 09:00</span>
        </div>
      `;
    }
  },

  // 4. O'QUVCHILAR BO'LIMI (STUDENTS MANAGEMENT)
  renderStudents() {
    const students = CRM_Data.getStudents();
    const tbody = document.getElementById('students-table-body');
    if (!tbody) return;

    const searchInput = document.getElementById('student-search-input');
    const classFilter = document.getElementById('student-class-filter');
    const paymentFilter = document.getElementById('student-payment-filter');

    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
    const selectedClass = classFilter ? classFilter.value : 'all';
    const selectedPayment = paymentFilter ? paymentFilter.value : 'all';

    const filtered = students.filter(s => {
      const matchSearch = s.name.toLowerCase().includes(query) || s.phone.includes(query) || s.parent.toLowerCase().includes(query);
      const matchClass = selectedClass === 'all' || s.class === selectedClass;
      const matchPayment = selectedPayment === 'all' || s.paymentStatus === selectedPayment;
      return matchSearch && matchClass && matchPayment;
    });

    if (filtered.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="6" style="text-align: center; padding: 40px; color: var(--text-muted);">
            <i class="fa-solid fa-user-slash" style="font-size: 32px; margin-bottom: 10px; display: block; opacity: 0.5;"></i>
            Mos keluvchi o'quvchilar topilmadi
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = filtered.map(student => {
      const isPaid = student.paymentStatus === "To'langan";
      const badgeClass = isPaid ? 'badge-paid' : 'badge-unpaid';
      const badgeIcon = isPaid ? 'fa-check' : 'fa-clock';

      return `
        <tr>
          <td>
            <div class="table-user-cell">
              <div class="table-avatar">${student.name.charAt(0)}</div>
              <div>
                <div class="user-full-name">${student.name}</div>
                <div class="user-subtext">ID: ${student.id}</div>
              </div>
            </div>
          </td>
          <td><span class="badge badge-class">${student.class}</span></td>
          <td>
            <div>${student.phone}</div>
            <div class="user-subtext">Ota-onasi: ${student.parent}</div>
          </td>
          <td><span class="badge ${badgeClass}"><i class="fa-solid ${badgeIcon}"></i> ${student.paymentStatus}</span></td>
          <td><span class="badge badge-active"><i class="fa-solid fa-circle-dot" style="font-size: 8px;"></i> ${student.status}</span></td>
          <td>
            <div class="table-actions">
              <button class="action-icon-btn btn-edit" title="Tahrirlash" onclick="CRM_App.openEditStudentModal('${student.id}')">
                <i class="fa-solid fa-pen-to-square"></i>
              </button>
              <button class="action-icon-btn btn-delete" title="O'chirish" onclick="CRM_App.deleteStudent('${student.id}')">
                <i class="fa-solid fa-trash"></i>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  },

  // Yangi o'quvchi qo'shish
  addNewStudent(studentData) {
    const students = CRM_Data.getStudents();
    const newId = 'STU-' + (100 + students.length + 1);
    const newStudent = {
      id: newId,
      name: studentData.name,
      class: studentData.class,
      phone: studentData.phone,
      parent: studentData.parent,
      status: 'Faol',
      paymentStatus: studentData.paymentStatus || "To'langan",
      balance: '1,200,000'
    };

    students.unshift(newStudent);
    CRM_Data.saveStudents(students);
    this.refreshAllViews();
    showToast(`"${newStudent.name}" muvaffaqiyatli qo'shildi!`, 'success');
  },

  // O'quvchini tahrirlash modalini ochish
  openEditStudentModal(studentId) {
    const students = CRM_Data.getStudents();
    const student = students.find(s => s.id === studentId);
    if (!student) return;

    document.getElementById('edit-student-id').value = student.id;
    document.getElementById('edit-student-name').value = student.name;
    document.getElementById('edit-student-class').value = student.class;
    document.getElementById('edit-student-phone').value = student.phone;
    document.getElementById('edit-student-parent').value = student.parent;
    document.getElementById('edit-student-payment').value = student.paymentStatus;

    this.openModal('modal-edit-student');
  },

  // O'quvchi ma'lumotlarini saqlash
  saveEditStudent() {
    const id = document.getElementById('edit-student-id').value;
    const name = document.getElementById('edit-student-name').value.trim();
    const className = document.getElementById('edit-student-class').value;
    const phone = document.getElementById('edit-student-phone').value.trim();
    const parent = document.getElementById('edit-student-parent').value.trim();
    const paymentStatus = document.getElementById('edit-student-payment').value;

    if (!name || !phone) {
      showToast('Iltimos, barcha maydonlarni to\'ldiring!', 'error');
      return;
    }

    const students = CRM_Data.getStudents();
    const index = students.findIndex(s => s.id === id);
    if (index !== -1) {
      students[index].name = name;
      students[index].class = className;
      students[index].phone = phone;
      students[index].parent = parent;
      students[index].paymentStatus = paymentStatus;

      CRM_Data.saveStudents(students);
      this.closeModal('modal-edit-student');
      this.refreshAllViews();
      showToast('O\'quvchi ma\'lumotlari yangilandi!', 'success');
    }
  },

  // O'quvchini o'chirish
  deleteStudent(studentId) {
    if (confirm("Haqiqatan ham bu o'quvchini tizimdan o'chirmoqchimisiz?")) {
      let students = CRM_Data.getStudents();
      students = students.filter(s => s.id !== studentId);
      CRM_Data.saveStudents(students);
      this.refreshAllViews();
      showToast('O\'quvchi o\'chirildi.', 'info');
    }
  },

  // CSV Eksport qilish
  exportStudentsCSV() {
    const students = CRM_Data.getStudents();
    let csv = "ID,Ism-Familiya,Sinf,Telefon,Ota-onasi,To'lov Holati,Status\n";
    students.forEach(s => {
      csv += `"${s.id}","${s.name}","${s.class}","${s.phone}","${s.parent}","${s.paymentStatus}","${s.status}"\n`;
    });

    const blob = new Blob(["\uFEFF" + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Maktab_Oquvchilar_Royxati_${new Date().toISOString().slice(0,10)}.csv`;
    link.click();
    showToast('O\'quvchilar ro\'yxati CSV faylga yuklab olindi!', 'success');
  },

  // 5. O'QITUVCHILAR BO'LIMI (TEACHERS MANAGEMENT)
  renderTeachers() {
    const teachers = CRM_Data.getTeachers();
    const container = document.getElementById('teachers-cards-grid');
    if (!container) return;

    const filterSubject = document.getElementById('teacher-subject-filter');
    const selectedSub = filterSubject ? filterSubject.value : 'all';

    const filtered = teachers.filter(t => {
      return selectedSub === 'all' || t.subject.includes(selectedSub);
    });

    container.innerHTML = filtered.map(t => {
      return `
        <div class="glass-card day-card" style="padding: 22px;">
          <div style="display: flex; align-items: center; gap: 14px; margin-bottom: 16px;">
            <div class="table-avatar" style="width: 48px; height: 48px; font-size: 18px; border-radius: 14px; background: linear-gradient(135deg, #06b6d4, #6366f1);">
              ${t.name.charAt(0)}
            </div>
            <div>
              <h4 style="font-size: 15px; font-weight: 700;">${t.name}</h4>
              <p style="font-size: 12px; color: var(--accent-cyan); font-weight: 600;">${t.subject}</p>
            </div>
          </div>

          <div style="font-size: 13px; display: flex; flex-direction: column; gap: 8px; margin-bottom: 18px; color: var(--text-secondary);">
            <div><i class="fa-solid fa-phone" style="width: 20px; color: var(--text-muted);"></i> ${t.phone}</div>
            <div><i class="fa-solid fa-briefcase" style="width: 20px; color: var(--text-muted);"></i> Ish tajribasi: <strong style="color: #fff;">${t.experience}</strong></div>
            <div><i class="fa-solid fa-chalkboard-user" style="width: 20px; color: var(--text-muted);"></i> Biriktirilgan sinflar: <strong style="color: #fff;">${t.classes}</strong></div>
            <div><i class="fa-solid fa-wallet" style="width: 20px; color: var(--text-muted);"></i> Oylik maoshi: <strong style="color: var(--accent-emerald);">${t.salary}</strong></div>
          </div>

          <div style="display: flex; justify-content: flex-end; gap: 8px; border-top: 1px solid rgba(255,255,255,0.06); padding-top: 14px;">
            <button class="action-icon-btn btn-delete" onclick="CRM_App.deleteTeacher('${t.id}')" title="O'chirish">
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        </div>
      `;
    }).join('');
  },

  addNewTeacher(teacherData) {
    const teachers = CRM_Data.getTeachers();
    const newId = 'TCH-' + (teachers.length + 1);
    const newTeacher = {
      id: newId,
      name: teacherData.name,
      subject: teacherData.subject,
      phone: teacherData.phone,
      experience: teacherData.experience || '1 yil',
      salary: teacherData.salary || "6,000,000 so'm",
      classes: teacherData.classes || '9-A, 10-A'
    };

    teachers.unshift(newTeacher);
    CRM_Data.saveTeachers(teachers);
    this.refreshAllViews();
    showToast(`O'qituvchi "${newTeacher.name}" qo'shildi!`, 'success');
  },

  deleteTeacher(id) {
    if (confirm("Haqiqatan ham bu o'qituvchini o'chirmoqchimisiz?")) {
      let teachers = CRM_Data.getTeachers();
      teachers = teachers.filter(t => t.id !== id);
      CRM_Data.saveTeachers(teachers);
      this.refreshAllViews();
      showToast('O\'qituvchi o\'chirildi.', 'info');
    }
  },

  // 6. SINFLAR VA DARS JADVALI
  renderClasses() {
    const classes = CRM_Data.getClasses();
    const container = document.getElementById('classes-cards-grid');
    if (!container) return;

    container.innerHTML = classes.map(c => {
      const isSelected = c.name === this.selectedClassForTimetable;
      return `
        <div class="glass-card day-card" style="cursor: pointer; border-color: ${isSelected ? 'var(--primary)' : 'rgba(255,255,255,0.08)'}" onclick="CRM_App.selectClassForTimetable('${c.name}')">
          <div class="day-header">
            <span><i class="fa-solid fa-graduation-cap"></i> ${c.name} Sinfi</span>
            <span class="badge badge-class">${c.studentsCount} o'quvchi</span>
          </div>
          <div style="font-size: 13px; color: var(--text-secondary); line-height: 1.6;">
            <div>Rahbar: <strong style="color: #fff;">${c.leader}</strong></div>
            <div>Xona: <strong style="color: var(--accent-cyan);">${c.room}</strong></div>
            <div style="font-size: 12px; margin-top: 4px; color: var(--text-muted);">${c.direction}</div>
          </div>
        </div>
      `;
    }).join('');
  },

  selectClassForTimetable(className) {
    this.selectedClassForTimetable = className;
    this.renderClasses();
    this.renderTimetable();
    showToast(`${className} sinfining dars jadvali ochildi.`, 'info');
  },

  renderTimetable() {
    const titleElem = document.getElementById('timetable-selected-class');
    if (titleElem) titleElem.textContent = `${this.selectedClassForTimetable} Sinfiga oid Haftalik Dars Jadvali`;

    const timetable = CRM_Data.getTimetable(this.selectedClassForTimetable);
    const container = document.getElementById('timetable-days-container');
    if (!container) return;

    container.innerHTML = timetable.map(d => {
      return `
        <div class="glass-card day-card">
          <div class="day-header">
            <span><i class="fa-solid fa-calendar-day"></i> ${d.day}</span>
            <span style="font-size: 11px; color: var(--text-muted);">4 ta dars</span>
          </div>
          <div style="display: flex; flex-direction: column; gap: 6px;">
            ${d.lessons.map(lesson => {
              const parts = lesson.split(' - ');
              return `
                <div class="lesson-item">
                  <span class="lesson-time">${parts[0]}</span>
                  <span class="lesson-subject">${parts[1]}</span>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      `;
    }).join('');
  },

  // 7. TO'LOVLAR VA MOLIYA (PAYMENTS)
  renderPayments() {
    const payments = CRM_Data.getPayments();
    const tbody = document.getElementById('payments-table-body');
    if (!tbody) return;

    tbody.innerHTML = payments.map(p => {
      return `
        <tr>
          <td><strong style="color: var(--accent-cyan);">${p.id}</strong></td>
          <td>
            <div class="user-full-name">${p.studentName}</div>
            <div class="user-subtext">${p.class}</div>
          </td>
          <td><strong style="color: var(--accent-emerald); font-size: 14px;">${p.amount} so'm</strong></td>
          <td><span class="glass-pill"><i class="fa-solid fa-credit-card"></i> ${p.method}</span></td>
          <td>${p.date}</td>
          <td><span class="badge badge-paid"><i class="fa-solid fa-circle-check"></i> ${p.status}</span></td>
          <td>
            <button class="action-icon-btn" title="Kvitansiya ko'rish / Chop etish" onclick="CRM_App.printReceipt('${p.id}')">
              <i class="fa-solid fa-print"></i>
            </button>
          </td>
        </tr>
      `;
    }).join('');
  },

  addNewPayment(payData) {
    const payments = CRM_Data.getPayments();
    const newId = 'TRX-' + Math.floor(1000 + Math.random() * 9000);
    const newPay = {
      id: newId,
      studentName: payData.studentName,
      class: payData.class,
      amount: payData.amount,
      method: payData.method,
      date: new Date().toISOString().slice(0, 10),
      status: 'Muvaffaqiyatli'
    };

    payments.unshift(newPay);
    CRM_Data.savePayments(payments);

    // O'quvchi statusini yangilash
    const students = CRM_Data.getStudents();
    const student = students.find(s => s.name === payData.studentName);
    if (student) {
      student.paymentStatus = "To'langan";
      CRM_Data.saveStudents(students);
    }

    this.refreshAllViews();
    showToast(`${payData.studentName} uchun ${payData.amount} so'm to'lov qabul qilindi!`, 'success');
  },

  printReceipt(transId) {
    const payments = CRM_Data.getPayments();
    const p = payments.find(item => item.id === transId);
    if (!p) return;

    const receiptHtml = `
      <div style="font-family: Arial, sans-serif; padding: 24px; border: 2px dashed #333; max-width: 420px; margin: 0 auto; color: #000; background: #fff;">
        <h2 style="text-align: center; margin-bottom: 4px;">AL-XORAZMIY MAKTABI</h2>
        <p style="text-align: center; font-size: 12px; margin-bottom: 20px;">Rasmiy To'lov Kvitansiyasi</p>
        <hr style="border: 0; border-top: 1px solid #ccc; margin-bottom: 16px;" />
        <div style="font-size: 13px; line-height: 2;">
          <div><strong>Tranzaksiya ID:</strong> ${p.id}</div>
          <div><strong>O'quvchi:</strong> ${p.studentName} (${p.class})</div>
          <div><strong>To'lov summasi:</strong> ${p.amount} so'm</div>
          <div><strong>To'lov usuli:</strong> ${p.method}</div>
          <div><strong>Sana:</strong> ${p.date}</div>
          <div><strong>Holat:</strong> TASDIQLANGAN</div>
        </div>
        <hr style="border: 0; border-top: 1px solid #ccc; margin: 16px 0;" />
        <p style="text-align: center; font-size: 11px;">To'lovingiz uchun tashakkur! Ta'lim - kelajak poydevori.</p>
      </div>
    `;

    const printWin = window.open('', '_blank', 'width=500,height=500');
    printWin.document.write(`<html><head><title>Kvitansiya - ${p.id}</title></head><body>${receiptHtml}</body></html>`);
    printWin.document.close();
    printWin.focus();
    printWin.print();
  },

  // 8. DAVOMAT (ATTENDANCE)
  renderAttendance() {
    const students = CRM_Data.getStudents();
    const tbody = document.getElementById('attendance-table-body');
    if (!tbody) return;

    const classSelector = document.getElementById('attendance-class-select');
    const selectedClass = classSelector ? classSelector.value : '11-A';

    const classStudents = students.filter(s => s.class === selectedClass);

    if (classStudents.length === 0) {
      tbody.innerHTML = `<tr><td colspan="4" style="text-align:center; padding: 30px; color: var(--text-muted);">Bu sinfda o'quvchilar yo'q</td></tr>`;
      return;
    }

    tbody.innerHTML = classStudents.map((s, idx) => {
      return `
        <tr>
          <td>${idx + 1}</td>
          <td>
            <div class="table-user-cell">
              <div class="table-avatar" style="width: 32px; height: 32px; font-size: 12px;">${s.name.charAt(0)}</div>
              <div>
                <div class="user-full-name">${s.name}</div>
                <div class="user-subtext">${s.phone}</div>
              </div>
            </div>
          </td>
          <td><span class="badge badge-class">${s.class}</span></td>
          <td>
            <div class="attendance-actions" data-student-id="${s.id}">
              <button class="btn-att active-present" onclick="CRM_App.setAttendanceStatus(this, 'present')">
                <i class="fa-solid fa-check"></i> Bor
              </button>
              <button class="btn-att" onclick="CRM_App.setAttendanceStatus(this, 'absent')">
                <i class="fa-solid fa-xmark"></i> Yo'q
              </button>
              <button class="btn-att" onclick="CRM_App.setAttendanceStatus(this, 'excused')">
                <i class="fa-solid fa-notes-medical"></i> Sababli
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  },

  setAttendanceStatus(btn, status) {
    const parent = btn.closest('.attendance-actions');
    if (!parent) return;

    parent.querySelectorAll('.btn-att').forEach(b => {
      b.classList.remove('active-present', 'active-absent', 'active-excused');
    });

    if (status === 'present') btn.classList.add('active-present');
    if (status === 'absent') btn.classList.add('active-absent');
    if (status === 'excused') btn.classList.add('active-excused');
  },

  markAllPresent() {
    const allButtons = document.querySelectorAll('.attendance-actions');
    allButtons.forEach(group => {
      const presentBtn = group.querySelector('.btn-att:nth-child(1)');
      if (presentBtn) {
        CRM_App.setAttendanceStatus(presentBtn, 'present');
      }
    });
    showToast("Barcha o'quvchilar 'Bor' deb belgilandi!", 'success');
  },

  saveAttendanceRecords() {
    showToast("Bugungi davomat muvaffaqiyatli saqlandi va tizimga yozildi!", 'success');
  },

  // 9. SOZLAMALAR (SETTINGS)
  renderSettings() {
    const s = CRM_Data.getSettings();
    const nameInput = document.getElementById('setting-school-name');
    const dirInput = document.getElementById('setting-director');
    const phoneInput = document.getElementById('setting-phone');
    const addrInput = document.getElementById('setting-address');

    if (nameInput) nameInput.value = s.schoolName;
    if (dirInput) dirInput.value = s.director;
    if (phoneInput) phoneInput.value = s.phone;
    if (addrInput) addrInput.value = s.address;
  },

  saveSchoolSettings() {
    const updated = {
      schoolName: document.getElementById('setting-school-name').value,
      director: document.getElementById('setting-director').value,
      phone: document.getElementById('setting-phone').value,
      address: document.getElementById('setting-address').value
    };

    CRM_Data.saveSettings(updated);
    showToast('Maktab sozlamalari muvaffaqiyatli yangilandi!', 'success');
  },

  changeAdminPassword() {
    const curPass = document.getElementById('setting-cur-pass').value;
    const newPass = document.getElementById('setting-new-pass').value;

    if (curPass !== CRM_Auth.CREDENTIALS.password) {
      showToast('Hozirgi parol noto\'g\'ri!', 'error');
      return;
    }

    if (newPass.length < 4) {
      showToast('Yangi parol kamida 4 ta belgidan iborat bo\'lsin!', 'error');
      return;
    }

    CRM_Auth.CREDENTIALS.password = newPass;
    document.getElementById('setting-cur-pass').value = '';
    document.getElementById('setting-new-pass').value = '';
    showToast('Tizim paroli yangilandi! Yangi parol: ' + newPass, 'success');
  },

  resetDemoData() {
    if (confirm("Barcha ma'lumotlarni boshlang'ich holatga qaytarmoqchimisiz?")) {
      CRM_Data.resetAll();
      this.refreshAllViews();
      showToast('Ma\'lumotlar boshlang\'ich demo holatiga qaytarildi.', 'info');
    }
  },

  // 10. MODALLARNI BOSHQARISH
  setupModals() {
    // Modal tashqarisi bosilganda yopish
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          overlay.classList.remove('active');
        }
      });
    });

    // Barcha yopish tugmalari
    document.querySelectorAll('.btn-close-modal, .btn-cancel-modal').forEach(btn => {
      btn.addEventListener('click', () => {
        const modal = btn.closest('.modal-overlay');
        if (modal) modal.classList.remove('active');
      });
    });
  },

  openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('active');
    }
  },

  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('active');
    }
  },

  // 11. GLOBAL HODISALAR
  setupGlobalEvents() {
    // Qidiruv va filtrlar
    const studentSearch = document.getElementById('student-search-input');
    if (studentSearch) {
      studentSearch.addEventListener('input', () => this.renderStudents());
    }

    const studentClassFilter = document.getElementById('student-class-filter');
    if (studentClassFilter) {
      studentClassFilter.addEventListener('change', () => this.renderStudents());
    }

    const studentPaymentFilter = document.getElementById('student-payment-filter');
    if (studentPaymentFilter) {
      studentPaymentFilter.addEventListener('change', () => this.renderStudents());
    }

    const teacherSubFilter = document.getElementById('teacher-subject-filter');
    if (teacherSubFilter) {
      teacherSubFilter.addEventListener('change', () => this.renderTeachers());
    }

    const attendanceClassSelect = document.getElementById('attendance-class-select');
    if (attendanceClassSelect) {
      attendanceClassSelect.addEventListener('change', () => this.renderAttendance());
    }

    // Yangi o'quvchi formasi
    const formAddStudent = document.getElementById('form-add-student');
    if (formAddStudent) {
      formAddStudent.addEventListener('submit', (e) => {
        e.preventDefault();
        const studentData = {
          name: document.getElementById('add-student-name').value.trim(),
          class: document.getElementById('add-student-class').value,
          phone: document.getElementById('add-student-phone').value.trim(),
          parent: document.getElementById('add-student-parent').value.trim(),
          paymentStatus: document.getElementById('add-student-payment').value
        };

        if (!studentData.name || !studentData.phone) {
          showToast('Iltimos, o\'quvchi ismi va telefonini kiriting!', 'error');
          return;
        }

        this.addNewStudent(studentData);
        formAddStudent.reset();
        this.closeModal('modal-add-student');
      });
    }

    // Yangi o'qituvchi formasi
    const formAddTeacher = document.getElementById('form-add-teacher');
    if (formAddTeacher) {
      formAddTeacher.addEventListener('submit', (e) => {
        e.preventDefault();
        const teacherData = {
          name: document.getElementById('add-teacher-name').value.trim(),
          subject: document.getElementById('add-teacher-subject').value.trim(),
          phone: document.getElementById('add-teacher-phone').value.trim(),
          experience: document.getElementById('add-teacher-exp').value.trim(),
          salary: document.getElementById('add-teacher-salary').value.trim(),
          classes: document.getElementById('add-teacher-classes').value.trim()
        };

        if (!teacherData.name || !teacherData.subject) {
          showToast('Iltimos, o\'qituvchi ismi va fanini kiriting!', 'error');
          return;
        }

        this.addNewTeacher(teacherData);
        formAddTeacher.reset();
        this.closeModal('modal-add-teacher');
      });
    }

    // Yangi to'lov formasi
    const formAddPayment = document.getElementById('form-add-payment');
    if (formAddPayment) {
      formAddPayment.addEventListener('submit', (e) => {
        e.preventDefault();
        const payData = {
          studentName: document.getElementById('pay-student-name').value.trim(),
          class: document.getElementById('pay-student-class').value,
          amount: document.getElementById('pay-amount').value.trim(),
          method: document.getElementById('pay-method').value
        };

        if (!payData.studentName || !payData.amount) {
          showToast('Iltimos, o\'quvchi ismi va to\'lov summasini kiriting!', 'error');
          return;
        }

        this.addNewPayment(payData);
        formAddPayment.reset();
        this.closeModal('modal-add-payment');
      });
    }

    // Mavzu (Dark / Light) almashtirish tugmasi
    const themeBtn = document.getElementById('btn-toggle-theme');
    if (themeBtn) {
      themeBtn.addEventListener('click', () => {
        const curTheme = document.body.getAttribute('data-theme');
        const newTheme = curTheme === 'light' ? 'dark' : 'light';
        document.body.setAttribute('data-theme', newTheme);
        themeBtn.innerHTML = newTheme === 'light' ? '<i class="fa-solid fa-moon"></i>' : '<i class="fa-solid fa-sun"></i>';
        showToast(`Mavzu: ${newTheme === 'light' ? "Yorug' (Light)" : "Qorong'i (Dark)"}`, 'info');
      });
    }
  }
};

// Sahifa to'liq yuklanganda ishga tushirish
document.addEventListener('DOMContentLoaded', () => {
  CRM_Auth.init();
  CRM_App.init();
});
