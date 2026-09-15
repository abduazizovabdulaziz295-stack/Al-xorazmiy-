/**
 * MAKTAB CRM - DATA STORAGE & STATE MANAGEMENT
 * Barcha ma'lumotlar LocalStorage da saqlanadi va yangilanadi.
 */

const STORAGE_KEYS = {
  STUDENTS: 'maktab_crm_students_v1',
  TEACHERS: 'maktab_crm_teachers_v1',
  CLASSES: 'maktab_crm_classes_v1',
  PAYMENTS: 'maktab_crm_payments_v1',
  TIMETABLE: 'maktab_crm_timetable_v1',
  SETTINGS: 'maktab_crm_settings_v1',
  AUTH: 'maktab_crm_auth_session'
};

// Boshlang'ich Namunaviy Ma'lumotlar (Demo Data)
const DEFAULT_STUDENTS = [
  { id: 'STU-101', name: 'Alisher Qodirov', class: '11-A', phone: '+998 90 123 45 67', parent: 'Akmal Qodirov', status: 'Faol', paymentStatus: 'To\'langan', balance: '1,200,000' },
  { id: 'STU-102', name: 'Madina Karimova', class: '10-B', phone: '+998 93 987 65 43', parent: 'Zulayho Karimova', status: 'Faol', paymentStatus: 'To\'langan', balance: '1,200,000' },
  { id: 'STU-103', name: 'Sardor Rustamov', class: '11-A', phone: '+998 97 555 44 33', parent: 'Bahodir Rustamov', status: 'Faol', paymentStatus: 'Qarzdor', balance: '0' },
  { id: 'STU-104', name: 'Dilnoza Boboyeva', class: '9-A', phone: '+998 99 432 10 98', parent: 'Nodira Boboyeva', status: 'Faol', paymentStatus: 'To\'langan', balance: '1,200,000' },
  { id: 'STU-105', name: 'Javohir Toirov', class: '10-A', phone: '+998 91 333 22 11', parent: 'Sherzod Toirov', status: 'Faol', paymentStatus: 'To\'langan', balance: '1,200,000' },
  { id: 'STU-106', name: 'Shahzoda Umarova', class: '9-B', phone: '+998 94 777 88 99', parent: 'Munira Umarova', status: 'Faol', paymentStatus: 'Qarzdor', balance: '500,000' },
  { id: 'STU-107', name: 'Behzod Yusupov', class: '11-B', phone: '+998 90 888 12 34', parent: 'Otabek Yusupov', status: 'Faol', paymentStatus: 'To\'langan', balance: '1,200,000' },
  { id: 'STU-108', name: 'Gulruh Ergasheva', class: '10-B', phone: '+998 95 111 22 33', parent: 'Farida Ergasheva', status: 'Faol', paymentStatus: 'To\'langan', balance: '1,200,000' }
];

const DEFAULT_TEACHERS = [
  { id: 'TCH-01', name: 'Abdurashid Xolmatov', subject: 'Matematika & Algebra', phone: '+998 90 321 00 11', experience: '12 yil', salary: '8,500,000 so\'m', classes: '10-A, 11-A' },
  { id: 'TCH-02', name: 'Saodat Mirzayeva', subject: 'Ona tili va Adabiyot', phone: '+998 93 456 78 90', experience: '15 yil', salary: '7,800,000 so\'m', classes: '9-A, 10-B' },
  { id: 'TCH-03', name: 'Eldor Nurmatov', subject: 'Fizika & Astronomiya', phone: '+998 97 123 99 88', experience: '8 yil', salary: '7,200,000 so\'m', classes: '10-A, 11-B' },
  { id: 'TCH-04', name: 'Malika Sobirova', subject: 'Ingliz tili (IELTS)', phone: '+998 99 654 32 10', experience: '6 yil', salary: '9,000,000 so\'m', classes: 'Barcha sinflar' },
  { id: 'TCH-05', name: 'Farrux Zokirov', subject: 'Informatika & IT Dasturlash', phone: '+998 91 888 77 66', experience: '5 yil', salary: '8,000,000 so\'m', classes: '9-A, 10-A, 11-A' },
  { id: 'TCH-06', name: 'Dilrabo Qosimova', subject: 'Kimyo & Biologiya', phone: '+998 94 222 33 44', experience: '10 yil', salary: '7,500,000 so\'m', classes: '9-B, 11-A' }
];

const DEFAULT_CLASSES = [
  { name: '11-A', leader: 'Abdurashid Xolmatov', room: '304-xona', studentsCount: 28, direction: 'Aniq fanlar (IT & Matematika)' },
  { name: '11-B', leader: 'Eldor Nurmatov', room: '306-xona', studentsCount: 26, direction: 'Tabiiy fanlar (Tibbiyot)' },
  { name: '10-A', leader: 'Farrux Zokirov', room: '202-xona', studentsCount: 30, direction: 'Muhandislik va Dasturlash' },
  { name: '10-B', leader: 'Saodat Mirzayeva', room: '208-xona', studentsCount: 27, direction: 'Ijtimoiy-gumanitar' },
  { name: '9-A', leader: 'Dilrabo Qosimova', room: '105-xona', studentsCount: 29, direction: 'Umumta\'lim' },
  { name: '9-B', leader: 'Malika Sobirova', room: '107-xona', studentsCount: 25, direction: 'Xorijiy tillar' }
];

const DEFAULT_PAYMENTS = [
  { id: 'TRX-8801', studentName: 'Alisher Qodirov', class: '11-A', amount: '1,200,000', method: 'Click', date: '2026-09-14', status: 'Muvaffaqiyatli' },
  { id: 'TRX-8802', studentName: 'Madina Karimova', class: '10-B', amount: '1,200,000', method: 'Payme', date: '2026-09-14', status: 'Muvaffaqiyatli' },
  { id: 'TRX-8803', studentName: 'Javohir Toirov', class: '10-A', amount: '1,200,000', method: 'Naqd', date: '2026-09-13', status: 'Muvaffaqiyatli' },
  { id: 'TRX-8804', studentName: 'Behzod Yusupov', class: '11-B', amount: '1,200,000', method: 'Uzum Bank', date: '2026-09-12', status: 'Muvaffaqiyatli' },
  { id: 'TRX-8805', studentName: 'Gulruh Ergasheva', class: '10-B', amount: '1,200,000', method: 'Click', date: '2026-09-10', status: 'Muvaffaqiyatli' }
];

const DEFAULT_TIMETABLE = {
  '11-A': [
    { day: 'Dushanba', lessons: ['08:30 - Matematika', '09:25 - Informatika', '10:20 - Ingliz tili', '11:15 - Ona tili'] },
    { day: 'Seshanba', lessons: ['08:30 - Fizika', '09:25 - Matematika', '10:20 - Kimyo', '11:15 - Adabiyot'] },
    { day: 'Chorshanba', lessons: ['08:30 - Geometriya', '09:25 - Dasturlash', '10:20 - Tarix', '11:15 - Ingliz tili'] },
    { day: 'Payshanba', lessons: ['08:30 - Fizika', '09:25 - Biologiya', '10:20 - Matematika', '11:15 - Jismoniy tarbiya'] },
    { day: 'Juma', lessons: ['08:30 - IT Loyiha', '09:25 - Ingliz tili', '10:20 - Ona tili', '11:15 - Tarbiya'] },
    { day: 'Shanba', lessons: ['08:30 - Fakultativ Matematika', '09:25 - Robototexnika', '10:20 - To\'garaklar'] }
  ]
};

const DEFAULT_SETTINGS = {
  schoolName: 'AL-XORAZMIY Zamonaviy Maktabi',
  director: 'Prof. Anvar Rasulov',
  phone: '+998 71 200 45 45',
  address: 'Toshkent sh., Yunusobod tumani, Amir Temur shoh ko\'chasi 14-uy',
  email: 'info@alxorazmiy-school.uz',
  academicYear: '2026-2027 O\'quv yili'
};

// Storage Service Wrapper
const CRM_Data = {
  init() {
    if (!localStorage.getItem(STORAGE_KEYS.STUDENTS)) {
      this.saveStudents(DEFAULT_STUDENTS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.TEACHERS)) {
      this.saveTeachers(DEFAULT_TEACHERS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.CLASSES)) {
      this.saveClasses(DEFAULT_CLASSES);
    }
    if (!localStorage.getItem(STORAGE_KEYS.PAYMENTS)) {
      this.savePayments(DEFAULT_PAYMENTS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.TIMETABLE)) {
      localStorage.setItem(STORAGE_KEYS.TIMETABLE, JSON.stringify(DEFAULT_TIMETABLE));
    }
    if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
    }
  },

  getStudents() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.STUDENTS)) || DEFAULT_STUDENTS;
    } catch (e) {
      return DEFAULT_STUDENTS;
    }
  },

  saveStudents(students) {
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
  },

  getTeachers() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.TEACHERS)) || DEFAULT_TEACHERS;
    } catch (e) {
      return DEFAULT_TEACHERS;
    }
  },

  saveTeachers(teachers) {
    localStorage.setItem(STORAGE_KEYS.TEACHERS, JSON.stringify(teachers));
  },

  getClasses() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.CLASSES)) || DEFAULT_CLASSES;
    } catch (e) {
      return DEFAULT_CLASSES;
    }
  },

  saveClasses(classes) {
    localStorage.setItem(STORAGE_KEYS.CLASSES, JSON.stringify(classes));
  },

  getPayments() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.PAYMENTS)) || DEFAULT_PAYMENTS;
    } catch (e) {
      return DEFAULT_PAYMENTS;
    }
  },

  savePayments(payments) {
    localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(payments));
  },

  getSettings() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.SETTINGS)) || DEFAULT_SETTINGS;
    } catch (e) {
      return DEFAULT_SETTINGS;
    }
  },

  saveSettings(settings) {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  },

  getTimetable(className = '11-A') {
    try {
      const all = JSON.parse(localStorage.getItem(STORAGE_KEYS.TIMETABLE)) || DEFAULT_TIMETABLE;
      return all[className] || DEFAULT_TIMETABLE['11-A'];
    } catch (e) {
      return DEFAULT_TIMETABLE['11-A'];
    }
  },

  resetAll() {
    localStorage.removeItem(STORAGE_KEYS.STUDENTS);
    localStorage.removeItem(STORAGE_KEYS.TEACHERS);
    localStorage.removeItem(STORAGE_KEYS.CLASSES);
    localStorage.removeItem(STORAGE_KEYS.PAYMENTS);
    localStorage.removeItem(STORAGE_KEYS.TIMETABLE);
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
    this.init();
  }
};

// Initialize immediately on load
CRM_Data.init();
