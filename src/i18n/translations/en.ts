export const en = {
  // Navigation
  nav: {
    home: "Home",
    units: "Units",
    allUnits: "All Units",
    available: "Available",
    surroundings: "Surroundings",
    configurator: "Configurator",
    contact: "Contact",
    buildingInfo: "Building Info",
  },
  
  // Home page
  home: {
    title: "Louis de Paris",
    subtitle: "Interactive 3D Residence Visualization",
    residenceVisualization: "Residence Visualization",
    mockMode: "Mock Mode",
    unrealViewport: "Unreal Engine viewport will render here",
    cameraViews: {
      title: "Camera Views",
      exterior: "Exterior",
      aerial: "Aerial",
      street: "Street",
    },
    time: {
      title: "Time of Day",
      dawn: "Dawn",
      morning: "Morning",
      noon: "Noon",
      sunset: "Sunset",
      night: "Night",
    },
    weather: {
      title: "Weather",
      clear: "Clear",
      cloudy: "Cloudy",
      rainy: "Rainy",
      foggy: "Foggy",
    },
    controls: {
      autoRotate: "Auto-Rotate",
      resetView: "Reset View",
      dragToMove: "Drag to move",
      scrollToZoom: "Scroll to zoom",
    },
  },
  
  // Units
  units: {
    title: "Units",
    subtitle: "Browse and filter available units",
    found: "found",
    available: "available",
    filters: {
      title: "Filters",
      searchPlaceholder: "Search units...",
      availableOnly: "Available",
      allFloors: "All floors",
      floor: "Floor",
      all: "All",
      bedrooms: "Bedrooms",
      bathrooms: "Bathrooms",
      surface: "Surface",
      price: "Price",
      min: "Min",
      max: "Max",
      any: "Any",
      clear: "Clear",
    },
    sections: {
      all: "All",
      groundFloor: "Ground Floor",
      firstFloor: "First Floor",
      secondFloor: "Second Floor",
      topFloor: "Top Floor",
      viewing: "Viewing",
    },
    orientation: {
      title: "Orientation",
      north: "North",
      south: "South",
      east: "East",
      west: "West",
      northeast: "Northeast",
      northwest: "Northwest",
      southeast: "Southeast",
      southwest: "Southwest",
    },
    status: {
      available: "Available",
      reserved: "Reserved",
      sold: "Sold",
    },
    card: {
      bed: "bed",
      bath: "bath",
      floor: "Floor",
      view: "View",
    },
    noResults: "No units found",
    tryAdjusting: "Try adjusting your filters.",
    compare: {
      title: "Compare Units",
      add: "Compare",
      remove: "Remove",
      compareNow: "Compare Now",
      clearAll: "Clear All",
      maxReached: "Maximum 3 units for comparison",
      selectMore: "Select at least 2 units to compare",
      specifications: "Specifications",
      pricing: "Pricing",
      features: "Features",
      best: "Best",
      perSqm: "per m²",
      hasFeature: "Yes",
      noFeature: "No",
      viewIn3D: "View in 3D",
      inquire: "Inquire",
    },
  },
  
  // Surroundings
  surroundings: {
    title: "Surroundings",
    subtitle: "Explore the neighborhood and nearby attractions",
    location: {
      title: "Location",
      description: "Prime location in the heart of the city with easy access to major amenities and transportation.",
    },
    accessibility: {
      title: "Accessibility",
      description: "Walking distance to metro station, bus stops, and major roads for convenient commuting.",
    },
    greenSpaces: {
      title: "Green Spaces",
      description: "Surrounded by parks and recreational areas perfect for outdoor activities and relaxation.",
    },
  },
  
  // POI
  poi: {
    title: "Points of Interest",
    subtitle: "Explore nearby amenities and attractions",
    searchPlaceholder: "Search places...",
    locations: "locations",
    noResults: "No places found",
    tryDifferentSearch: "Try a different search term.",
    noLocationsInCategory: "No locations available in this category.",
    categories: {
      landmarks: "Landmarks",
      landmarksDesc: "Cultural and historical sites",
      dining: "Dining",
      diningDesc: "Restaurants, cafes, and bars",
      shopping: "Shopping",
      shoppingDesc: "Retail stores and markets",
      entertainment: "Entertainment",
      entertainmentDesc: "Parks and recreation",
      services: "Services",
      servicesDesc: "Hospitals and utilities",
      transport: "Transport",
      transportDesc: "Bus and transit",
    },
  },
  
  // Contact form
  contact: {
    title: "Get in Touch",
    name: "Full Name",
    namePlaceholder: "Enter your name",
    email: "Email Address",
    emailPlaceholder: "Enter your email",
    phone: "Phone Number",
    phonePlaceholder: "Enter your phone",
    message: "Message",
    messagePlaceholder: "Tell us about your interest...",
    submit: "Send Inquiry",
    sending: "Sending...",
    success: "Message sent successfully!",
    error: "Failed to send message",
  },
  
  // Common
  common: {
    loading: "Loading...",
    error: "An error occurred",
    close: "Close",
    save: "Save",
    cancel: "Cancel",
    search: "Search",
    back: "Back",
    next: "Next",
    connected: "Connected",
    disconnected: "Disconnected",
  },

  // Accessibility
  accessibility: {
    title: "Accessibility",
    description: "Customize your viewing experience",
    fontSize: {
      title: "Font Size",
      small: "Small",
      medium: "Medium",
      large: "Large",
      xlarge: "XL",
    },
    uiMode: {
      title: "Interface Mode",
      simple: "Simple",
      simpleDesc: "Less UI, larger elements",
      complex: "Full",
      complexDesc: "Complete interface",
    },
    voice: {
      recognition: "Voice Recognition",
      recognitionDesc: "Navigate with voice commands",
      helper: "Voice Helper",
      helperDesc: "Read content aloud",
      speed: "Speed",
      readPage: "Read Page",
      stop: "Stop",
      listening: "Listening...",
      commandRecognized: "Command recognized",
      notSupported: "Not supported in this browser",
      commands: "Voice commands",
    },
    reset: "Reset to Defaults",
  },

  // Tutorial - 20 steps
  tutorial: {
    welcome: "Welcome to Louis de Paris!",
    welcomeDesc: "Let me show you around! This quick tour will help you discover all the features.",
    startTour: "Start Tour",
    letsGo: "Let's Explore!",
    skip: "Skip for now",
    next: "Next",
    previous: "Back",
    finish: "Got it!",
    progress: "Step {current} of {total}",
    
    // Step 1: Welcome/Project Title
    welcomeProject: "Welcome!",
    welcomeProjectDesc: "This is your interactive property explorer. You can view the building in 3D, browse apartments, and explore the neighborhood!",
    
    // Step 2: Sidebar Toggle
    sidebarToggle: "Navigation Menu",
    sidebarToggleDesc: "Click here to open or close the sidebar. Hide it for more screen space when exploring the 3D view.",
    
    // Step 3: Sidebar Navigation
    sidebarNav: "Navigate Sections",
    sidebarNavDesc: "Use these links to jump between Home (3D view), Units (apartment browser), and Surroundings (neighborhood map).",
    
    // Step 4: Camera Views
    cameraViews: "Camera Views",
    cameraViewsDesc: "Switch between exterior, aerial, and street-level views to see the building from different angles!",
    
    // Step 5: Time of Day
    timeOfDay: "Time of Day",
    timeOfDayDesc: "Drag the slider to see how the building looks from dawn to night. Watch the lighting change in real-time!",
    
    // Step 6: Weather
    weather: "Weather Effects",
    weatherDesc: "See the building in different weather conditions - sunny, cloudy, rainy, or foggy. Great for realistic previews!",
    
    // Step 7: Auto-Rotate
    autoRotate: "Auto-Rotate",
    autoRotateDesc: "Turn this on to automatically spin around the building. Perfect for presentations or leisurely viewing!",
    
    // Step 8: Reset Camera
    resetCamera: "Reset View",
    resetCameraDesc: "Click here to return the camera to its original position if you get lost while exploring.",
    
    // Step 9: Language Switcher
    language: "Language",
    languageDesc: "Switch the interface language. Choose from English, German, French, or Albanian to suit your preference.",
    
    // Step 10: Accessibility Toggle
    accessibilityToggle: "Accessibility Options",
    accessibilityToggleDesc: "Open accessibility settings to adjust font size, enable voice commands, or switch to a simplified interface.",
    
    // Step 11: Help Button
    helpButton: "Help & Tutorial",
    helpButtonDesc: "You can restart this tutorial anytime by clicking here. We're always here to help you navigate!",
    
    // Step 12: Section Tabs
    sectionTabs: "Building Sections",
    sectionTabsDesc: "The building has multiple sections. Click a tab to filter units by section, or select 'All' to see everything at once.",
    
    // Step 13: Filters
    filters: "Filter Units",
    filtersDesc: "Use the search box and filters to find your perfect apartment. Filter by floor, orientation, bedrooms, bathrooms, size, and price!",
    
    // Step 14: Available Toggle
    availableToggle: "Available Only",
    availableToggleDesc: "Toggle this switch to show only units that are still available for purchase. Hidden units are sold or reserved.",
    
    // Step 15: Unit Card
    unitCard: "Unit Cards",
    unitCardDesc: "Each card shows key info about a unit. Click to see full details, or hover to highlight it in the 3D view!",
    
    // Step 16: Compare
    compare: "Compare Units",
    compareDesc: "Found some favorites? Click the compare button to add up to 3 units and compare them side by side.",
    
    // Step 17: Map Styles
    mapStyles: "Map Styles",
    mapStylesDesc: "Change how the map looks - satellite imagery, street map, light or dark themes to suit your preference.",
    
    // Surroundings tutorial - Movement
    surrMovement: "3D Movement",
    surrMovementDesc: "Use W, A, S, D keys to move forward, left, backward, and right through the 3D surroundings view. Navigate freely to explore the neighborhood!",
    
    // Surroundings tutorial - Elevation
    surrElevation: "Ascend & Descend",
    surrElevationDesc: "Press Q to ascend (fly up) and E to descend (fly down). Combine with WASD for full 3D navigation!",
    
    // Surroundings tutorial - Map Toggle
    surrMapToggle: "Map View",
    surrMapToggleDesc: "Click the map icon to open a fullscreen interactive map. View all points of interest on a real map with 3D buildings!",
    
    // Surroundings tutorial - Filter Click
    surrFilterClick: "Filter Categories",
    surrFilterClickDesc: "Single-click a category to toggle it on/off. Double-click to solo that category (show only that one). Double-click again to show all categories.",
    
    // Step 18: Search
    search: "Search Places",
    searchDesc: "Looking for something specific? Type here to search for restaurants, shops, parks, schools, and more nearby.",
    
    // Step 19: Categories
    categories: "Filter Categories",
    categoriesDesc: "Click these icons to show or hide different types of places - dining, shopping, transport, entertainment, and services.",
    
    // Step 20: POI Browser
    poiBrowser: "POI Browser",
    poiBrowserDesc: "Browse all nearby points of interest organized by category. Click any place for details and directions!",
    
    // Parking tutorial
    parkingOverview: "Parking Browser",
    parkingOverviewDesc: "Browse available parking spots in the building. See pricing and availability at a glance.",
    parkingSelect: "Select a Spot",
    parkingSelectDesc: "Click on any parking spot to see details and reserve it for your unit.",
    
    // Lokale tutorial
    lokaleOverview: "Commercial Units",
    lokaleOverviewDesc: "Browse available commercial spaces in the building. Perfect for businesses and retail.",
    lokaleSelect: "Select a Unit",
    lokaleSelectDesc: "Click on any commercial unit to view details, floor plans, and pricing.",
    
  // Feature highlights
    feature1: "3D Visualization",
    feature1Desc: "Explore the building in stunning 3D",
    feature2: "Interactive Map",
    feature2Desc: "Discover nearby amenities and routes",
    feature3: "Smart Filters",
    feature3Desc: "Find your perfect unit easily",
  },

  // Building Info
  buildingInfo: {
    title: "Building Information",
    subtitle: "Construction details, materials & specifications",
    stats: {
      floors: "Floors",
      units: "Units",
      height: "Height",
    },
    sections: {
      location: "Location",
      structure: "Structure",
      materials: "Building Materials",
      doors: "Doors",
      windows: "Windows",
      smartHome: "Smart Home",
      bathrooms: "Bathrooms",
      energy: "Energy & HVAC",
      safety: "Safety & Security",
      electrical: "Electrical",
    },
    location: {
      address: "Address",
      city: "City",
      coordinates: "Coordinates",
      zone: "Zone",
      zoneValue: "Residential / Mixed-use",
    },
    structure: {
      buildings: "Buildings",
      floors: "Floors",
      height: "Building Height",
      totalArea: "Total Area",
      foundation: "Foundation",
      foundationValue: "Reinforced concrete raft",
      frameType: "Frame Type",
      frameTypeValue: "Reinforced concrete frame",
    },
    materials: {
      exterior: "Exterior Walls",
      exteriorValue: "Ventilated facade, composite panels",
      insulation: "Insulation",
      insulationValue: "Mineral wool 15 cm (EPS + XPS)",
      interiorWalls: "Interior Walls",
      interiorWallsValue: "Ytong blocks + plasterboard",
      flooring: "Flooring",
      flooringValue: "Premium porcelain tiles / laminate",
      roofing: "Roofing",
      roofingValue: "Flat roof, waterproof membrane",
    },
    doors: {
      entrance: "Main Entrance",
      entranceValue: "Armored steel security door",
      interior: "Interior Doors",
      interiorValue: "Solid-core wooden doors",
      security: "Security Grade",
      securityValue: "Class 4 anti-burglar",
      fireRated: "Fire Rating",
      fireRatedValue: "EI30 / EI60 rated",
    },
    windows: {
      type: "Type",
      typeValue: "PVC triple-pane",
      glazing: "Glazing",
      glazingValue: "Low-E triple glazing",
      frame: "Frame",
      frameValue: "Multi-chamber PVC, anthracite",
      uValue: "U-Value",
    },
    smartHome: {
      system: "System",
      systemValue: "KNX / BMS integrated",
      connectivity: "Connectivity",
      features: [
        "Lighting control",
        "Motorized blinds",
        "Climate zones",
        "Video intercom",
        "Smart locks",
        "Energy monitoring",
      ],
    },
    bathrooms: {
      toilets: "Toilets",
      toiletsValue: "Wall-hung, rimless ceramic",
      showers: "Showers",
      showersValue: "Walk-in, tempered glass",
      tiles: "Wall & Floor",
      tilesValue: "Large-format porcelain tiles",
      fixtures: "Fixtures",
      fixturesValue: "Grohe / Hansgrohe premium",
      heated: "Heated Floors",
      heatedValue: "Yes, all bathrooms",
    },
    energy: {
      heating: "Heating",
      heatingValue: "Central heat pump + underfloor",
      cooling: "Cooling",
      coolingValue: "VRV multi-split system",
      ventilation: "Ventilation",
      ventilationValue: "Mechanical with heat recovery",
      energyClass: "Energy Class",
    },
    safety: {
      fireProtection: "Fire Protection",
      fireProtectionValue: "Sprinkler system + alarms",
      seismic: "Seismic Rating",
      seismicValue: "Zone VIII (Eurocode 8)",
      cctv: "CCTV",
      cctvValue: "24/7 surveillance, all entrances",
      access: "Access Control",
      accessValue: "RFID card + video intercom",
    },
    electrical: {
      evCharging: "EV Charging",
      evChargingValue: "Pre-wired, Level 2 stations",
      backup: "Backup Power",
      backupValue: "Diesel generator, full backup",
      solar: "Solar",
      solarValue: "Rooftop PV panels (common areas)",
    },
  },

  // Onboarding
  onboarding: {
    dragToMove: "Click and drag to look around",
    scrollToZoom: "Scroll to zoom in and out",
    skip: "Skip",
    tabs: {
      home: "Home",
      homeDesc: "3D building view with camera and weather controls",
      units: "Units",
      unitsDesc: "Browse and filter available apartments",
      parking: "Parking",
      parkingDesc: "View and reserve parking spots",
      lokale: "Lokale",
      lokaleDesc: "Explore commercial spaces in the building",
      surroundings: "Surroundings",
      surroundingsDesc: "Discover nearby places and amenities",
      buildingInfo: "Building Info",
      buildingInfoDesc: "Technical specs, materials, and smart home details",
    },
  },
};

export type TranslationKeys = typeof en;