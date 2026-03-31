import { TranslationKeys } from "./en";

export const fr: TranslationKeys = {
  nav: {
    home: "Accueil",
    units: "Unités",
    allUnits: "Toutes les Unités",
    available: "Disponibles",
    surroundings: "Environs",
    configurator: "Configurateur",
    contact: "Contact",
    buildingInfo: "Info Bâtiment",
  },
  home: {
    title: "Louis de Paris",
    subtitle: "Visualisation 3D Interactive du Bâtiment",
    residenceVisualization: "Visualisation de Résidence",
    mockMode: "Mode Test",
    unrealViewport: "Le viewport Unreal Engine s'affichera ici",
    cameraViews: {
      title: "Vues Caméra",
      exterior: "Extérieur",
      aerial: "Aérienne",
      street: "Rue",
    },
    time: {
      title: "Heure du Jour",
      dawn: "Aube",
      morning: "Matin",
      noon: "Midi",
      sunset: "Coucher",
      night: "Nuit",
    },
    weather: {
      title: "Météo",
      clear: "Dégagé",
      cloudy: "Nuageux",
      rainy: "Pluvieux",
      foggy: "Brumeux",
    },
    controls: {
      autoRotate: "Auto-Rotation",
      resetView: "Réinitialiser Vue",
      dragToMove: "Glisser pour déplacer",
      scrollToZoom: "Défiler pour zoomer",
    },
  },
  units: {
    title: "Unités",
    subtitle: "Parcourir et filtrer les unités disponibles",
    found: "trouvées",
    available: "disponibles",
    filters: {
      title: "Filtres",
      searchPlaceholder: "Rechercher unités...",
      availableOnly: "Disponibles",
      allFloors: "Tous les étages",
      floor: "Étage",
      all: "Tous",
      bedrooms: "Chambres",
      bathrooms: "Salles de bain",
      surface: "Surface",
      price: "Prix",
      min: "Min",
      max: "Max",
      any: "Tous",
      clear: "Effacer",
    },
    sections: {
      all: "Tous",
      groundFloor: "Rez-de-chaussée",
      firstFloor: "Premier Étage",
      secondFloor: "Deuxième Étage",
      topFloor: "Dernier Étage",
      viewing: "Affichage",
    },
    orientation: {
      title: "Orientation",
      north: "Nord",
      south: "Sud",
      east: "Est",
      west: "Ouest",
      northeast: "Nord-Est",
      northwest: "Nord-Ouest",
      southeast: "Sud-Est",
      southwest: "Sud-Ouest",
    },
    status: {
      available: "Disponible",
      reserved: "Réservé",
      sold: "Vendu",
    },
    card: {
      bed: "ch.",
      bath: "sdb",
      floor: "Étage",
      view: "Voir",
    },
    noResults: "Aucune unité trouvée",
    tryAdjusting: "Essayez d'ajuster vos filtres.",
    compare: {
      title: "Comparer les Unités",
      add: "Comparer",
      remove: "Retirer",
      compareNow: "Comparer Maintenant",
      clearAll: "Tout Effacer",
      maxReached: "Maximum 3 unités pour la comparaison",
      selectMore: "Sélectionnez au moins 2 unités à comparer",
      specifications: "Spécifications",
      pricing: "Tarification",
      features: "Caractéristiques",
      best: "Meilleur",
      perSqm: "par m²",
      hasFeature: "Oui",
      noFeature: "Non",
      viewIn3D: "Voir en 3D",
      inquire: "Demander",
    },
  },
  surroundings: {
    title: "Environs",
    subtitle: "Explorez le quartier et les attractions à proximité",
    location: {
      title: "Emplacement",
      description: "Emplacement privilégié au cœur de la ville avec un accès facile aux principales commodités et transports.",
    },
    accessibility: {
      title: "Accessibilité",
      description: "À distance de marche de la station de métro, des arrêts de bus et des routes principales.",
    },
    greenSpaces: {
      title: "Espaces Verts",
      description: "Entouré de parcs et de zones de loisirs parfaits pour les activités de plein air et la détente.",
    },
  },
  poi: {
    title: "Points d'Intérêt",
    subtitle: "Découvrez les commodités et attractions à proximité",
    searchPlaceholder: "Rechercher des lieux...",
    locations: "emplacements",
    noResults: "Aucun lieu trouvé",
    tryDifferentSearch: "Essayez un autre terme de recherche.",
    noLocationsInCategory: "Aucun emplacement disponible dans cette catégorie.",
    categories: {
      landmarks: "Monuments",
      landmarksDesc: "Sites culturels et historiques",
      dining: "Restauration",
      diningDesc: "Restaurants, cafés et bars",
      shopping: "Shopping",
      shoppingDesc: "Magasins et marchés",
      entertainment: "Divertissement",
      entertainmentDesc: "Parcs et loisirs",
      services: "Services",
      servicesDesc: "Hôpitaux et services publics",
      transport: "Transport",
      transportDesc: "Bus et transports en commun",
    },
  },
  contact: {
    title: "Nous Contacter",
    name: "Nom Complet",
    namePlaceholder: "Entrez votre nom",
    email: "Adresse Email",
    emailPlaceholder: "Entrez votre email",
    phone: "Numéro de Téléphone",
    phonePlaceholder: "Entrez votre téléphone",
    message: "Message",
    messagePlaceholder: "Parlez-nous de votre intérêt...",
    submit: "Envoyer la Demande",
    sending: "Envoi...",
    success: "Message envoyé avec succès !",
    error: "Échec de l'envoi du message",
  },
  common: {
    loading: "Chargement...",
    error: "Une erreur s'est produite",
    close: "Fermer",
    save: "Enregistrer",
    cancel: "Annuler",
    search: "Rechercher",
    back: "Retour",
    next: "Suivant",
    connected: "Connecté",
    disconnected: "Déconnecté",
  },

  accessibility: {
    title: "Accessibilité",
    description: "Personnalisez votre expérience de visualisation",
    fontSize: {
      title: "Taille de Police",
      small: "Petite",
      medium: "Moyenne",
      large: "Grande",
      xlarge: "XL",
    },
    uiMode: {
      title: "Mode Interface",
      simple: "Simple",
      simpleDesc: "Moins d'interface, éléments plus grands",
      complex: "Complet",
      complexDesc: "Interface complète",
    },
    voice: {
      recognition: "Reconnaissance Vocale",
      recognitionDesc: "Naviguez avec des commandes vocales",
      helper: "Assistant Vocal",
      helperDesc: "Lire le contenu à haute voix",
      speed: "Vitesse",
      readPage: "Lire la Page",
      stop: "Arrêter",
      listening: "Écoute...",
      commandRecognized: "Commande reconnue",
      notSupported: "Non pris en charge dans ce navigateur",
      commands: "Commandes vocales",
    },
    reset: "Réinitialiser",
  },

  // Tutorial - 20 étapes
  tutorial: {
    welcome: "Bienvenue sur Dino Residence !",
    welcomeDesc: "Laissez-moi vous faire visiter ! Ce tour rapide vous aidera à découvrir toutes les fonctionnalités.",
    startTour: "Commencer la Visite",
    letsGo: "C'est parti !",
    skip: "Passer pour l'instant",
    next: "Suivant",
    previous: "Précédent",
    finish: "Compris !",
    progress: "Étape {current} sur {total}",
    
    // Étape 1: Bienvenue
    welcomeProject: "Bienvenue !",
    welcomeProjectDesc: "Voici votre explorateur immobilier interactif. Vous pouvez visualiser le bâtiment en 3D, parcourir les appartements et explorer le quartier !",
    
    // Étape 2: Bouton Sidebar
    sidebarToggle: "Menu de Navigation",
    sidebarToggleDesc: "Cliquez ici pour ouvrir ou fermer la barre latérale. Masquez-la pour plus d'espace lors de l'exploration de la vue 3D.",
    
    // Étape 3: Navigation Sidebar
    sidebarNav: "Naviguer entre Sections",
    sidebarNavDesc: "Utilisez ces liens pour basculer entre Accueil (vue 3D), Unités (navigateur d'appartements) et Environs (carte du quartier).",
    
    // Étape 4: Vues Caméra
    cameraViews: "Vues Caméra",
    cameraViewsDesc: "Basculez entre les vues extérieure, aérienne et rue pour explorer le bâtiment sous différents angles !",
    
    // Étape 5: Heure du Jour
    timeOfDay: "Heure du Jour",
    timeOfDayDesc: "Faites glisser le curseur pour voir le bâtiment de l'aube à la nuit. Regardez l'éclairage changer en temps réel !",
    
    // Étape 6: Météo
    weather: "Effets Météo",
    weatherDesc: "Voyez le bâtiment dans différentes conditions météo - ensoleillé, nuageux, pluvieux ou brumeux. Idéal pour des aperçus réalistes !",
    
    // Étape 7: Auto-Rotation
    autoRotate: "Rotation Auto",
    autoRotateDesc: "Activez ceci pour tourner automatiquement autour du bâtiment. Parfait pour les présentations ou la visualisation tranquille !",
    
    // Étape 8: Réinitialiser Caméra
    resetCamera: "Réinitialiser Vue",
    resetCameraDesc: "Cliquez ici pour ramener la caméra à sa position d'origine si vous vous perdez lors de l'exploration.",
    
    // Étape 9: Changeur de Langue
    language: "Langue",
    languageDesc: "Changez la langue de l'interface. Choisissez entre anglais, allemand, français ou albanais selon vos préférences.",
    
    // Étape 10: Accessibilité
    accessibilityToggle: "Options d'Accessibilité",
    accessibilityToggleDesc: "Ouvrez les paramètres d'accessibilité pour ajuster la taille de police, activer les commandes vocales ou passer à une interface simplifiée.",
    
    // Étape 11: Bouton Aide
    helpButton: "Aide & Tutoriel",
    helpButtonDesc: "Vous pouvez redémarrer ce tutoriel à tout moment en cliquant ici. Nous sommes toujours là pour vous aider à naviguer !",
    
    // Étape 12: Sections du Bâtiment
    sectionTabs: "Sections du Bâtiment",
    sectionTabsDesc: "Le bâtiment a plusieurs sections. Cliquez sur un onglet pour filtrer les unités par section, ou sélectionnez 'Tous' pour tout voir.",
    
    // Étape 13: Filtres
    filters: "Filtrer les Unités",
    filtersDesc: "Utilisez la barre de recherche et les filtres pour trouver l'appartement idéal. Filtrez par étage, orientation, chambres, salles de bain, taille et prix !",
    
    // Étape 14: Uniquement Disponibles
    availableToggle: "Uniquement Disponibles",
    availableToggleDesc: "Activez ce commutateur pour n'afficher que les unités encore disponibles à l'achat. Les unités masquées sont vendues ou réservées.",
    
    // Étape 15: Carte Unité
    unitCard: "Cartes des Unités",
    unitCardDesc: "Chaque carte affiche les informations clés d'une unité. Cliquez pour voir les détails complets, ou survolez pour la mettre en évidence en 3D !",
    
    // Étape 16: Comparer
    compare: "Comparer les Unités",
    compareDesc: "Trouvé des favoris ? Cliquez sur le bouton comparer pour ajouter jusqu'à 3 unités et les comparer côte à côte.",
    
    // Étape 17: Styles de Carte
    mapStyles: "Styles de Carte",
    mapStylesDesc: "Changez l'apparence de la carte - imagerie satellite, plan des rues, thèmes clairs ou sombres selon vos préférences.",
    
    // Tutoriel Environnement - Mouvement
    surrMovement: "Mouvement 3D",
    surrMovementDesc: "Utilisez les touches W, A, S, D pour avancer, reculer et vous déplacer latéralement dans la vue 3D. Explorez le quartier librement !",
    surrElevation: "Monter & Descendre",
    surrElevationDesc: "Appuyez sur Q pour monter et E pour descendre. Combinez avec WASD pour une navigation 3D complète !",
    surrMapToggle: "Vue Carte",
    surrMapToggleDesc: "Cliquez sur l'icône carte pour ouvrir une carte interactive en plein écran. Visualisez tous les points d'intérêt sur une vraie carte avec des bâtiments 3D !",
    surrFilterClick: "Filtrer les Catégories",
    surrFilterClickDesc: "Un clic simple sur une catégorie pour l'activer/désactiver. Double-clic pour isoler cette catégorie. Double-clic à nouveau pour tout afficher.",
    
    // Étape 18: Recherche
    search: "Rechercher des Lieux",
    searchDesc: "Vous cherchez quelque chose de spécifique ? Tapez ici pour rechercher restaurants, boutiques, parcs, écoles et plus à proximité.",
    
    // Étape 19: Catégories
    categories: "Filtrer les Catégories",
    categoriesDesc: "Cliquez sur ces icônes pour afficher ou masquer différents types de lieux - restauration, shopping, transport, divertissement et services.",
    
    // Étape 20: Navigateur POI
    poiBrowser: "Navigateur POI",
    poiBrowserDesc: "Parcourez tous les points d'intérêt à proximité organisés par catégorie. Cliquez sur un lieu pour les détails et les directions !",
    
    // Tutoriel Parking
    parkingOverview: "Navigateur de Parking",
    parkingOverviewDesc: "Parcourez les places de parking disponibles dans le bâtiment. Consultez les prix et la disponibilité.",
    parkingSelect: "Sélectionner une Place",
    parkingSelectDesc: "Cliquez sur une place de parking pour voir les détails et la réserver pour votre unité.",
    
    // Tutoriel Lokale
    lokaleOverview: "Espaces Commerciaux",
    lokaleOverviewDesc: "Parcourez les espaces commerciaux disponibles dans le bâtiment. Idéal pour les entreprises.",
    lokaleSelect: "Sélectionner une Unité",
    lokaleSelectDesc: "Cliquez sur un espace commercial pour voir les détails, les plans et les prix.",
    
    // Points forts des fonctionnalités
    feature1: "Visualisation 3D",
    feature1Desc: "Explorez le bâtiment en 3D époustouflante",
    feature2: "Carte Interactive",
    feature2Desc: "Découvrez les commodités et itinéraires à proximité",
    feature3: "Filtres Intelligents",
    feature3Desc: "Trouvez facilement l'unité parfaite",
  },

  buildingInfo: {
    title: "Informations du Bâtiment",
    subtitle: "Détails de construction, matériaux & spécifications",
    stats: { floors: "Étages", units: "Unités", height: "Hauteur" },
    sections: { location: "Emplacement", structure: "Structure", materials: "Matériaux", doors: "Portes", windows: "Fenêtres", smartHome: "Maison Connectée", bathrooms: "Salles de Bain", energy: "Énergie & CVC", safety: "Sécurité", electrical: "Électricité" },
    location: { address: "Adresse", city: "Ville", coordinates: "Coordonnées", zone: "Zone", zoneValue: "Résidentiel / Mixte" },
    structure: { buildings: "Bâtiments", floors: "Étages", height: "Hauteur", totalArea: "Surface totale", foundation: "Fondation", foundationValue: "Radier en béton armé", frameType: "Type de structure", frameTypeValue: "Ossature béton armé" },
    materials: { exterior: "Murs extérieurs", exteriorValue: "Façade ventilée, panneaux composites", insulation: "Isolation", insulationValue: "Laine minérale 15 cm (EPS + XPS)", interiorWalls: "Murs intérieurs", interiorWallsValue: "Blocs Ytong + plaques de plâtre", flooring: "Revêtement de sol", flooringValue: "Carrelage grès cérame / stratifié", roofing: "Toiture", roofingValue: "Toit plat, membrane étanche" },
    doors: { entrance: "Entrée principale", entranceValue: "Porte blindée en acier", interior: "Portes intérieures", interiorValue: "Portes en bois massif", security: "Niveau de sécurité", securityValue: "Classe 4 anti-effraction", fireRated: "Résistance au feu", fireRatedValue: "EI30 / EI60" },
    windows: { type: "Type", typeValue: "PVC triple vitrage", glazing: "Vitrage", glazingValue: "Triple vitrage Low-E", frame: "Cadre", frameValue: "PVC multi-chambres, anthracite", uValue: "Valeur U" },
    smartHome: { system: "Système", systemValue: "KNX / BMS intégré", connectivity: "Connectivité", features: ["Éclairage", "Stores motorisés", "Zones climatiques", "Visiophone", "Serrures connectées", "Suivi énergétique"] },
    bathrooms: { toilets: "Toilettes", toiletsValue: "Suspendues, sans bride", showers: "Douches", showersValue: "À l'italienne, verre trempé", tiles: "Murs & Sol", tilesValue: "Carrelage grand format", fixtures: "Robinetterie", fixturesValue: "Grohe / Hansgrohe premium", heated: "Sol chauffant", heatedValue: "Oui, toutes les salles de bain" },
    energy: { heating: "Chauffage", heatingValue: "Pompe à chaleur + plancher chauffant", cooling: "Climatisation", coolingValue: "Système VRV multi-split", ventilation: "Ventilation", ventilationValue: "Mécanique avec récupération", energyClass: "Classe énergie" },
    safety: { fireProtection: "Protection incendie", fireProtectionValue: "Sprinklers + alarmes", seismic: "Résistance sismique", seismicValue: "Zone VIII (Eurocode 8)", cctv: "Vidéosurveillance", cctvValue: "24/7, toutes entrées", access: "Contrôle d'accès", accessValue: "Badge RFID + visiophone" },
    electrical: { evCharging: "Borne VE", evChargingValue: "Pré-câblé, niveau 2", backup: "Secours", backupValue: "Groupe électrogène diesel", solar: "Solaire", solarValue: "Panneaux PV en toiture (parties communes)" },
  },

  onboarding: {
    dragToMove: "Cliquez et faites glisser pour regarder autour",
    scrollToZoom: "Faites défiler pour zoomer",
    skip: "Passer",
    tabs: {
      home: "Accueil",
      homeDesc: "Vue 3D du bâtiment avec contrôles caméra et météo",
      units: "Unités",
      unitsDesc: "Parcourir et filtrer les appartements disponibles",
      parking: "Parking",
      parkingDesc: "Voir et réserver des places de parking",
      lokale: "Lokale",
      lokaleDesc: "Explorer les espaces commerciaux du bâtiment",
      surroundings: "Environs",
      surroundingsDesc: "Découvrir les lieux et commodités à proximité",
      buildingInfo: "Info Bâtiment",
      buildingInfoDesc: "Spécifications techniques, matériaux et domotique",
    },
  },
};