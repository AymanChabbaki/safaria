/**
 * ============================================================
 * SAFARIA Platform - Internationalization (i18n) System
 * ============================================================
 * Language support: French (FR), English (EN), Arabic (AR)
 * ============================================================
 */

export const translations = {
  // ============================================================
  // FRENCH (FR) - Default Language
  // ============================================================
  fr: {
    // Navigation
    nav: {
      home: 'Accueil',
      map: 'Carte',
      artisanat: 'Artisanat',
      sejours: 'Séjours',
      caravanes: 'Caravanes',
      reservation: 'Mes Réservations',
      login: 'Connexion',
      register: "S'inscrire",
      logout: 'Déconnexion',
      profile: 'Profil',
      admin: 'Admin',
      dashboard: 'Tableau de bord',
    },

    // Home Page
    home: {
      heroTitle: 'Découvrez le Maroc Authentique',
      heroSubtitle: 'Artisanat traditionnel, séjours culturels et caravanes dans le désert',
      exploreMap: 'Explorer la Carte',
      startAdventure: "Commencer l'Aventure",
      ourExperiences: 'Nos Expériences',
      localCrafts: 'Artisanat Local',
      localCraftsDesc: "Rencontrez des artisans passionnés et découvrez l'artisanat marocain authentique.",
      culturalStays: 'Séjours Culturels',
      culturalStaysDesc: 'Vivez une immersion totale dans la culture marocaine avec nos hébergements traditionnels.',
      desertCaravans: 'Caravanes Désert',
      desertCaravansDesc: 'Partez à l\'aventure dans le désert du Sahara pour une expérience inoubliable.',
      discover: 'Découvrir',
      explore: 'Explorer',
      book: 'Réserver',
      readyToExplore: 'Prêt à explorer le Maroc?',
      joinUs: 'Rejoignez-nous pour une expérience unique et authentique',
      startNow: 'Commencer Maintenant',
      heroText1: 'Découvrez le Maroc Authentique',
      heroText2: 'Explorez le Désert du Sahara',
      heroText3: 'Vivez la Culture Marocaine',
      heroText4: 'Rencontrez des Artisans Locaux',
      stats: {
        visitors: 'Visiteurs Satisfaits',
        rating: 'Note Moyenne',
        destinations: 'Destinations',
        artisans: 'Artisans Partenaires',
      },
      mapSection: {
        title: 'Découvrez Toutes Nos Destinations',
        subtitle: 'Du bleu envoûtant de Chefchaouen aux dunes dorées du Sahara, explorez la richesse culturelle du Maroc',
        viewMap: 'Voir la Carte Interactive',
      },
      testimonials: {
        title: 'Ce Que Disent Nos Voyageurs',
      },
      gallery: {
        title: 'Moments Magiques',
      },
      finalCta: {
        title: 'Prêt Pour Votre Aventure Marocaine?',
        subtitle: 'Plus de 5000 voyageurs nous ont fait confiance. Rejoignez-les et créez des souvenirs inoubliables',
        explore: 'Explorer Maintenant',
        register: 'Créer un Compte',
      },
    },

    // Map Page
    map: {
      title: 'Carte Interactive',
      filters: {
        all: 'Tous',
        artisan: 'Artisanat',
        sejour: 'Séjour',
        caravane: 'Caravane'
      },
      viewDetails: 'Voir Détails',
      noResults: 'Aucun résultat trouvé',
      loading: 'Chargement de la carte...',
      results: 'résultats',
      price: 'Prix',
      from: 'À partir de',
    },

    // Details Pages
    details: {
      description: 'Description',
      gallery: 'Galerie Photos',
      view360: 'Vue 360°',
      information: 'Informations',
      price: 'Prix',
      location: 'Localisation',
      contact: 'Contact',
      bookNow: 'Réserver maintenant',
      backToMap: 'Retour à la carte',
      share: 'Partager',
      reviews: 'Avis',
      availability: 'Disponibilité',
    },

    // Reservation Page
    reservation: {
      title: 'Mes Réservations',
      newReservation: 'Nouvelle Réservation',
      name: 'Nom complet',
      email: 'Email',
      phone: 'Téléphone',
      date: 'Date',
      guests: 'Nombre de personnes',
      message: 'Message (optionnel)',
      submit: 'Confirmer la réservation',
      cancel: 'Annuler',
      pending: 'En attente',
      confirmed: 'Confirmée',
      cancelled: 'Annulée',
      noReservations: 'Aucune réservation',
      reservationSuccess: 'Votre réservation a été enregistrée avec succès!',
      reservationError: 'Erreur lors de la réservation',
    },

    // Authentication
    auth: {
      loginTitle: 'Connexion',
      registerTitle: 'Inscription',
      email: 'Adresse email',
      password: 'Mot de passe',
      confirmPassword: 'Confirmer le mot de passe',
      fullName: 'Nom complet',
      phone: 'Téléphone',
      login: 'Se connecter',
      register: "S'inscrire",
      forgotPassword: 'Mot de passe oublié?',
      alreadyAccount: 'Déjà un compte?',
      noAccount: 'Pas encore de compte?',
      loginHere: 'Se connecter ici',
      registerHere: "S'inscrire ici",
      welcomeBack: 'Bon retour!',
      joinUs: 'Rejoignez-nous',
      exploreMorocco: 'Explorez le Maroc authentique',
      discoverExperiences: 'Découvrez des expériences uniques',
      loginBenefit1: 'Accédez à vos réservations',
      loginBenefit2: 'Découvrez des expériences authentiques',
      loginBenefit3: 'Réservez en quelques clics',
      registerBenefit1: 'Artisanat traditionnel marocain',
      registerBenefit2: 'Séjours culturels immersifs',
      registerBenefit3: 'Caravanes dans le désert',
    },

    // Admin Dashboard
    admin: {
      dashboard: 'Tableau de bord',
      artisans: 'Gestion des Artisans',
      sejours: 'Gestion des Séjours',
      caravanes: 'Gestion des Caravanes',
      reservations: 'Gestion des Réservations',
      images360: 'Images 360°',
      users: 'Utilisateurs',
      settings: 'Paramètres',
      stats: 'Statistiques',
      totalArtisans: 'Total Artisans',
      totalSejours: 'Total Séjours',
      totalCaravanes: 'Total Caravanes',
      totalReservations: 'Total Réservations',
      recentActivity: 'Activité Récente',
      add: 'Ajouter',
      edit: 'Modifier',
      delete: 'Supprimer',
      save: 'Enregistrer',
      cancel: 'Annuler',
    },

    // Chat Assistant
    chat: {
      welcome: 'Bonjour! Comment puis-je vous aider?',
      howToBook: 'Comment réserver?',
      whatCircuits: 'Quels sont les circuits?',
      contactGuide: 'Contacter un guide',
      whereActivities: 'Où se situent les activités?',
      typeMessage: 'Tapez votre message...',
      send: 'Envoyer',
      responses: {
        booking: 'Pour réserver, cliquez sur "Réserver maintenant" sur la page de détails de votre activité préférée.',
        circuits: 'Nous proposons des circuits d\'artisanat, des séjours culturels et des caravanes dans le désert.',
        contact: 'Vous pouvez nous contacter à contact@safaria.ma ou au +212 6 00 00 00 00',
        location: 'Toutes nos activités sont situées dans différentes régions du Maroc. Consultez la carte pour voir les emplacements.',
      },
    },

    // Footer
    footer: {
      description: 'Découvrez le Maroc authentique à travers ses artisans, séjours culturels et caravanes dans le désert.',
      about: 'À Propos',
      aboutDesc: 'Découvrez le Maroc authentique à travers ses artisans, séjours culturels et caravanes dans le désert.',
      quickLinks: 'Liens Rapides',
      home: 'Accueil',
      map: 'Carte Interactive',
      contact: 'Contact',
      contactInfo: 'Informations de Contact',
      email: 'Email',
      phone: 'Téléphone',
      address: 'Adresse',
      followUs: 'Suivez-nous',
      rights: 'Tous droits réservés',
    },

    // Common
    common: {
      loading: 'Chargement...',
      error: 'Erreur',
      success: 'Succès',
      confirm: 'Confirmer',
      cancel: 'Annuler',
      close: 'Fermer',
      search: 'Rechercher',
      filter: 'Filtrer',
      sort: 'Trier',
      viewMore: 'Voir plus',
      viewLess: 'Voir moins',
      next: 'Suivant',
      previous: 'Précédent',
      per: 'par',
      night: 'nuit',
      person: 'personne',
      day: 'jour',
    },
  },

  // ============================================================
  // ENGLISH (EN)
  // ============================================================
  en: {
    nav: {
      home: 'Home',
      map: 'Map',
      artisanat: 'Handicraft',
      sejours: 'Stays',
      caravanes: 'Caravans',
      reservation: 'My Reservations',
      login: 'Login',
      register: 'Sign Up',
      logout: 'Logout',
      profile: 'Profile',
      admin: 'Admin',
      dashboard: 'Dashboard',
    },

    home: {
      heroTitle: 'Discover Authentic Morocco',
      heroSubtitle: 'Traditional crafts, cultural stays and desert caravans',
      exploreMap: 'Explore the Map',
      startAdventure: 'Start Adventure',
      ourExperiences: 'Our Experiences',
      localCrafts: 'Local Handicraft',
      localCraftsDesc: 'Meet passionate artisans and discover authentic Moroccan handicrafts.',
      culturalStays: 'Cultural Stays',
      culturalStaysDesc: 'Experience total immersion in Moroccan culture with our traditional accommodations.',
      desertCaravans: 'Desert Caravans',
      desertCaravansDesc: 'Embark on an adventure in the Sahara Desert for an unforgettable experience.',
      discover: 'Discover',
      explore: 'Explore',
      book: 'Book',
      readyToExplore: 'Ready to explore Morocco?',
      joinUs: 'Join us for a unique and authentic experience',
      startNow: 'Start Now',
      heroText1: 'Discover Authentic Morocco',
      heroText2: 'Explore the Sahara Desert',
      heroText3: 'Experience Moroccan Culture',
      heroText4: 'Meet Local Artisans',
      stats: {
        visitors: 'Happy Travelers',
        rating: 'Average Rating',
        destinations: 'Destinations',
        artisans: 'Partner Artisans',
      },
      mapSection: {
        title: 'Discover All Our Destinations',
        subtitle: 'From the enchanting blue of Chefchaouen to the golden dunes of the Sahara, explore Morocco\'s cultural richness',
        viewMap: 'View Interactive Map',
      },
      testimonials: {
        title: 'What Our Travelers Say',
      },
      gallery: {
        title: 'Magical Moments',
      },
      finalCta: {
        title: 'Ready For Your Moroccan Adventure?',
        subtitle: 'Over 5000 travelers have trusted us. Join them and create unforgettable memories',
        explore: 'Explore Now',
        register: 'Create Account',
      },
    },

    map: {
      title: 'Interactive Map',
      filters: {
        all: 'All',
        artisan: 'Handicraft',
        sejour: 'Stay',
        caravane: 'Caravan'
      },
      viewDetails: 'View Details',
      noResults: 'No results found',
      loading: 'Loading map...',
      results: 'results',
      price: 'Price',
      from: 'From',
    },

    details: {
      description: 'Description',
      gallery: 'Photo Gallery',
      view360: '360° View',
      information: 'Information',
      price: 'Price',
      location: 'Location',
      contact: 'Contact',
      bookNow: 'Book Now',
      backToMap: 'Back to Map',
      share: 'Share',
      reviews: 'Reviews',
      availability: 'Availability',
    },

    reservation: {
      title: 'My Reservations',
      newReservation: 'New Reservation',
      name: 'Full Name',
      email: 'Email',
      phone: 'Phone',
      date: 'Date',
      guests: 'Number of Guests',
      message: 'Message (optional)',
      submit: 'Confirm Reservation',
      cancel: 'Cancel',
      pending: 'Pending',
      confirmed: 'Confirmed',
      cancelled: 'Cancelled',
      noReservations: 'No reservations',
      reservationSuccess: 'Your reservation has been successfully recorded!',
      reservationError: 'Error during reservation',
    },

    auth: {
      loginTitle: 'Login',
      registerTitle: 'Sign Up',
      email: 'Email Address',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      fullName: 'Full Name',
      phone: 'Phone',
      login: 'Log In',
      register: 'Sign Up',
      forgotPassword: 'Forgot Password?',
      alreadyAccount: 'Already have an account?',
      noAccount: "Don't have an account?",
      loginHere: 'Login here',
      registerHere: 'Sign up here',
      welcomeBack: 'Welcome Back!',
      joinUs: 'Join Us',
      exploreMorocco: 'Explore Authentic Morocco',
      discoverExperiences: 'Discover unique experiences',
      loginBenefit1: 'Access your reservations',
      loginBenefit2: 'Discover authentic experiences',
      loginBenefit3: 'Book in a few clicks',
      registerBenefit1: 'Traditional Moroccan handicrafts',
      registerBenefit2: 'Immersive cultural stays',
      registerBenefit3: 'Desert caravans',
    },

    admin: {
      dashboard: 'Dashboard',
      artisans: 'Artisan Management',
      sejours: 'Stay Management',
      caravanes: 'Caravan Management',
      reservations: 'Reservation Management',
      images360: '360° Images',
      users: 'Users',
      settings: 'Settings',
      stats: 'Statistics',
      totalArtisans: 'Total Artisans',
      totalSejours: 'Total Stays',
      totalCaravanes: 'Total Caravans',
      totalReservations: 'Total Reservations',
      recentActivity: 'Recent Activity',
      add: 'Add',
      edit: 'Edit',
      delete: 'Delete',
      save: 'Save',
      cancel: 'Cancel',
    },

    chat: {
      welcome: 'Hello! How can I help you?',
      howToBook: 'How to book?',
      whatCircuits: 'What are the circuits?',
      contactGuide: 'Contact a guide',
      whereActivities: 'Where are the activities located?',
      typeMessage: 'Type your message...',
      send: 'Send',
      responses: {
        booking: 'To book, click "Book Now" on the details page of your preferred activity.',
        circuits: 'We offer handicraft tours, cultural stays and desert caravans.',
        contact: 'You can contact us at contact@safaria.ma or at +212 6 00 00 00 00',
        location: 'All our activities are located in different regions of Morocco. Check the map to see locations.',
      },
    },

    footer: {
      description: 'Discover authentic Morocco through its artisans, cultural stays and desert caravans.',
      about: 'About',
      aboutDesc: 'Discover authentic Morocco through its artisans, cultural stays and desert caravans.',
      quickLinks: 'Quick Links',
      home: 'Home',
      map: 'Interactive Map',
      contact: 'Contact',
      contactInfo: 'Contact Information',
      email: 'Email',
      phone: 'Phone',
      address: 'Address',
      followUs: 'Follow Us',
      rights: 'All rights reserved',
    },

    common: {
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      confirm: 'Confirm',
      cancel: 'Cancel',
      close: 'Close',
      search: 'Search',
      filter: 'Filter',
      sort: 'Sort',
      viewMore: 'View More',
      viewLess: 'View Less',
      next: 'Next',
      previous: 'Previous',
      per: 'per',
      night: 'night',
      person: 'person',
      day: 'day',
    },
  },

  // ============================================================
  // ARABIC (AR) - Right-to-Left
  // ============================================================
  ar: {
    nav: {
      home: 'الرئيسية',
      map: 'الخريطة',
      artisanat: 'الحرف اليدوية',
      sejours: 'الإقامات',
      caravanes: 'القوافل',
      reservation: 'حجوزاتي',
      login: 'تسجيل الدخول',
      register: 'التسجيل',
      logout: 'تسجيل الخروج',
      profile: 'الملف الشخصي',
      admin: 'المسؤول',
      dashboard: 'لوحة التحكم',
    },

    home: {
      heroTitle: 'اكتشف المغرب الأصيل',
      heroSubtitle: 'الحرف التقليدية والإقامات الثقافية وقوافل الصحراء',
      exploreMap: 'استكشاف الخريطة',
      startAdventure: 'ابدأ المغامرة',
      ourExperiences: 'تجاربنا',
      localCrafts: 'الحرف المحلية',
      localCraftsDesc: 'التقِ بحرفيين شغوفين واكتشف الحرف المغربية الأصيلة.',
      culturalStays: 'إقامات ثقافية',
      culturalStaysDesc: 'عش تجربة انغماس كامل في الثقافة المغربية مع إقاماتنا التقليدية.',
      desertCaravans: 'قوافل الصحراء',
      desertCaravansDesc: 'انطلق في مغامرة في صحراء الساهارا لتجربة لا تُنسى.',
      discover: 'اكتشف',
      explore: 'استكشف',
      book: 'احجز',
      readyToExplore: 'مستعد لاستكشاف المغرب؟',
      joinUs: 'انضم إلينا لتجربة فريدة وأصيلة',
      startNow: 'ابدأ الآن',
      heroText1: 'اكتشف المغرب الأصيل',
      heroText2: 'استكشف صحراء الساهارا',
      heroText3: 'عش الثقافة المغربية',
      heroText4: 'تعرف على الحرفيين المحليين',
      stats: {
        visitors: 'المسافرون السعداء',
        rating: 'التقييم المتوسط',
        destinations: 'الوجهات',
        artisans: 'الحرفيون الشركاء',
      },
      mapSection: {
        title: 'اكتشف جميع وجهاتنا',
        subtitle: 'من الأزرق الساحر لشفشاون إلى الكثبان الذهبية للصحراء، استكشف الثراء الثقافي للمغرب',
        viewMap: 'عرض الخريطة التفاعلية',
      },
      testimonials: {
        title: 'ماذا يقول مسافرونا',
      },
      gallery: {
        title: 'لحظات سحرية',
      },
      finalCta: {
        title: 'هل أنت مستعد لمغامرتك المغربية؟',
        subtitle: 'أكثر من 5000 مسافر وثقوا بنا. انضم إليهم واصنع ذكريات لا تُنسى',
        explore: 'استكشف الآن',
        register: 'إنشاء حساب',
      },
    },

    map: {
      title: 'خريطة تفاعلية',
      filters: {
        all: 'الكل',
        artisan: 'حرف يدوية',
        sejour: 'إقامة',
        caravane: 'قافلة'
      },
      viewDetails: 'عرض التفاصيل',
      noResults: 'لم يتم العثور على نتائج',
      loading: 'جاري تحميل الخريطة...',
      results: 'نتائج',
      price: 'السعر',
      from: 'من',
    },

    details: {
      description: 'الوصف',
      gallery: 'معرض الصور',
      view360: 'عرض 360°',
      information: 'المعلومات',
      price: 'السعر',
      location: 'الموقع',
      contact: 'اتصل',
      bookNow: 'احجز الآن',
      backToMap: 'العودة إلى الخريطة',
      share: 'مشاركة',
      reviews: 'التقييمات',
      availability: 'التوفر',
    },

    reservation: {
      title: 'حجوزاتي',
      newReservation: 'حجز جديد',
      name: 'الاسم الكامل',
      email: 'البريد الإلكتروني',
      phone: 'الهاتف',
      date: 'التاريخ',
      guests: 'عدد الأشخاص',
      message: 'رسالة (اختياري)',
      submit: 'تأكيد الحجز',
      cancel: 'إلغاء',
      pending: 'قيد الانتظار',
      confirmed: 'مؤكد',
      cancelled: 'ملغى',
      noReservations: 'لا توجد حجوزات',
      reservationSuccess: 'تم تسجيل حجزك بنجاح!',
      reservationError: 'خطأ أثناء الحجز',
    },

    auth: {
      loginTitle: 'تسجيل الدخول',
      registerTitle: 'التسجيل',
      email: 'عنوان البريد الإلكتروني',
      password: 'كلمة المرور',
      confirmPassword: 'تأكيد كلمة المرور',
      fullName: 'الاسم الكامل',
      phone: 'الهاتف',
      login: 'تسجيل الدخول',
      register: 'التسجيل',
      forgotPassword: 'نسيت كلمة المرور؟',
      alreadyAccount: 'لديك حساب بالفعل؟',
      noAccount: 'ليس لديك حساب؟',
      loginHere: 'سجل الدخول هنا',
      registerHere: 'سجل هنا',
      welcomeBack: 'مرحباً بعودتك!',
      joinUs: 'انضم إلينا',
      exploreMorocco: 'استكشف المغرب الأصيل',
      discoverExperiences: 'اكتشف تجارب فريدة',
      loginBenefit1: 'الوصول إلى حجوزاتك',
      loginBenefit2: 'اكتشف تجارب أصيلة',
      loginBenefit3: 'احجز بنقرات قليلة',
      registerBenefit1: 'الحرف اليدوية المغربية التقليدية',
      registerBenefit2: 'إقامات ثقافية غامرة',
      registerBenefit3: 'قوافل في الصحراء',
    },

    admin: {
      dashboard: 'لوحة التحكم',
      artisans: 'إدارة الحرفيين',
      sejours: 'إدارة الإقامات',
      caravanes: 'إدارة القوافل',
      reservations: 'إدارة الحجوزات',
      images360: 'صور 360°',
      users: 'المستخدمون',
      settings: 'الإعدادات',
      stats: 'الإحصائيات',
      totalArtisans: 'مجموع الحرفيين',
      totalSejours: 'مجموع الإقامات',
      totalCaravanes: 'مجموع القوافل',
      totalReservations: 'مجموع الحجوزات',
      recentActivity: 'النشاط الأخير',
      add: 'إضافة',
      edit: 'تعديل',
      delete: 'حذف',
      save: 'حفظ',
      cancel: 'إلغاء',
    },

    chat: {
      welcome: 'مرحباً! كيف يمكنني مساعدتك؟',
      howToBook: 'كيف أحجز؟',
      whatCircuits: 'ما هي الرحلات المتاحة؟',
      contactGuide: 'اتصل بمرشد',
      whereActivities: 'أين تقع الأنشطة؟',
      typeMessage: 'اكتب رسالتك...',
      send: 'إرسال',
      responses: {
        booking: 'للحجز، انقر على "احجز الآن" في صفحة تفاصيل النشاط المفضل لديك.',
        circuits: 'نحن نقدم جولات حرفية وإقامات ثقافية وقوافل في الصحراء.',
        contact: 'يمكنك الاتصال بنا على contact@safaria.ma أو على +212 6 00 00 00 00',
        location: 'تقع جميع أنشطتنا في مناطق مختلفة من المغرب. راجع الخريطة لرؤية المواقع.',
      },
    },

    footer: {
      description: 'اكتشف المغرب الأصيل من خلال حرفييه وإقاماته الثقافية وقوافل الصحراء.',
      about: 'حول',
      aboutDesc: 'اكتشف المغرب الأصيل من خلال حرفييه وإقاماته الثقافية وقوافل الصحراء.',
      quickLinks: 'روابط سريعة',
      home: 'الرئيسية',
      map: 'خريطة تفاعلية',
      contact: 'اتصل',
      contactInfo: 'معلومات الاتصال',
      email: 'البريد الإلكتروني',
      phone: 'الهاتف',
      address: 'العنوان',
      followUs: 'تابعنا',
      rights: 'جميع الحقوق محفوظة',
    },

    common: {
      loading: 'جاري التحميل...',
      error: 'خطأ',
      success: 'نجاح',
      confirm: 'تأكيد',
      cancel: 'إلغاء',
      close: 'إغلاق',
      search: 'بحث',
      filter: 'تصفية',
      sort: 'ترتيب',
      viewMore: 'عرض المزيد',
      viewLess: 'عرض أقل',
      next: 'التالي',
      previous: 'السابق',
      per: 'لكل',
      night: 'ليلة',
      person: 'شخص',
      day: 'يوم',
    },
  },
};

/**
 * Get translation by key path
 * @param {string} lang - Language code (fr, en, ar)
 * @param {string} key - Dot-notation key (e.g., 'nav.home')
 * @returns {string} - Translated text
 */
export const t = (lang, key) => {
  const keys = key.split('.');
  let value = translations[lang];
  
  for (const k of keys) {
    if (value && typeof value === 'object') {
      value = value[k];
    } else {
      return key; // Return key if translation not found
    }
  }
  
  return value || key;
};

/**
 * Language configuration
 */
export const languages = [
  { code: 'fr', name: 'Français', flag: '🇫🇷', dir: 'ltr' },
  { code: 'en', name: 'English', flag: '🇬🇧', dir: 'ltr' },
  { code: 'ar', name: 'العربية', flag: '🇲🇦', dir: 'rtl' },
];

export const defaultLanguage = 'fr';
