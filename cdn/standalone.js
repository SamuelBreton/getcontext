(function () {
    // Initialisation du Data Layer si inexistant
    window.dataLayer = window.dataLayer || [];
  
    // Initialisation des jours fériés (France)
    const publicHolidays = [
      "2024-01-01", // Nouvel An
      "2024-04-01", // Lundi de Pâques
      "2024-05-01", // Fête du Travail
      "2024-05-08", // Victoire 1945
      "2024-05-09", // Ascension
      "2024-05-20", // Lundi de Pentecôte
      "2024-07-14", // Fête nationale
      "2024-08-15", // Assomption
      "2024-11-01", // Toussaint
      "2024-11-11", // Armistice
      "2024-12-25", // Noël
    ];
  
    // Fonction utilitaire pour détecter le type d'appareil
    function getDeviceType() {
      const ua = navigator.userAgent;
      if (/Mobi|Android/i.test(ua)) return "Mobile";
      if (/Tablet|iPad/i.test(ua)) return "Tablet";
      return "Desktop";
    }
  
    // Fonction utilitaire pour détecter les préférences d'affichage (mode sombre ou clair)
    function getColorSchemePreference() {
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
  
    // Fonction pour estimer la mémoire de l'appareil
    function getDeviceMemory() {
      return navigator.deviceMemory || "unknown";
    }
  
    // Fonction pour détecter si la date est un jour férié
    function isPublicHoliday(date) {
      const formattedDate = date.toISOString().split("T")[0];
      return publicHolidays.includes(formattedDate);
    }
  
    // Fonction pour détecter les événements spéciaux (ex: Black Friday)
    function getSpecialEvent(date) {
      const blackFridayDate = new Date("2024-11-29"); // Exemple Black Friday 2024
      const christmasDate = new Date("2024-12-25");
  
      if (date.toISOString().split("T")[0] === blackFridayDate.toISOString().split("T")[0]) {
        return "Black Friday";
      }
      if (date.toISOString().split("T")[0] === christmasDate.toISOString().split("T")[0]) {
        return "Christmas";
      }
      return "none";
    }
  
    // Fonction pour récupérer les métriques de performance du site
    function getPerformanceMetrics() {
      const timing = window.performance.timing;
      return {
        loadTime: timing.loadEventEnd - timing.navigationStart, // Temps de chargement complet
        domContentLoaded: timing.domContentLoadedEventEnd - timing.navigationStart, // Temps DOM prêt
        firstPaint: timing.responseEnd - timing.navigationStart, // Temps de premier rendu
      };
    }
  
    // Fonction principale pour capturer le contexte
    function pushContextData() {
      const date = new Date();
  
      // Calcul des informations temporelles
      const year = date.getFullYear();
      const month = date.getMonth() + 1; // Les mois sont indexés à partir de 0
      const day = date.getDate();
      const hour = date.getHours();
      
      
      const weekOfMonth = Math.ceil((day + new Date(year, month - 1, 1).getDay()) / 7);
      const momentOfDay = hour >= 22 || hour < 6 ? "night" :
                          hour >= 6 && hour < 12 ? "morning" :
                          hour >= 12 && hour < 14 ? "noon" :
                          hour >= 14 && hour < 18 ? "afternoon" : "evening";
  
      // Récupération des métriques et autres données
      const performanceMetrics = getPerformanceMetrics();
  
      const contextData = {
        event: "context_data", // Nom de l'événement
        context: {
          date: date.toISOString().split("T")[0], // Date au format AAAA-MM-JJ
          time: date.toTimeString().split(" ")[0], // Heure au format HH:MM:SS
                  year, // Année
          month, // Mois
          day, // Jour
          hour,
          weekOfMonth, // Nombre de semaines écoulées
          dayOfWeek: date.toLocaleDateString(undefined, { weekday: "long" }), // Jour (ex: Lundi)
          deviceType: getDeviceType(), // Mobile, Desktop, etc.
          referrer: document.referrer || "none", // Page de provenance
          momentOfDay, // Moment de la journée
          season: month >= 3 && month <= 5 ? "spring" :
                  month >= 6 && month <= 8 ? "summer" :
                  month >= 9 && month <= 11 ? "autumn" : "winter",
          isHoliday: isPublicHoliday(date) ? "yes" : "no", // Jours fériés
          specialEvent: getSpecialEvent(date), // Événements spéciaux
          colorScheme: getColorSchemePreference(), // Mode sombre ou clair
          deviceMemory: getDeviceMemory(), // Mémoire de l'appareil
          performanceMetrics, // Métriques de performance
          language: navigator.language || navigator.userLanguage,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          screenResolution: `${window.screen.width}x${window.screen.height}`,
          userAgent: navigator.userAgent,
          pageTitle: document.title,
          path: window.location.pathname,
          url: window.location.href,
          connectionType: navigator.connection?.effectiveType || 'unknown',
          downlink: navigator.connection?.downlink || 'unknown',
          isOnline: navigator.onLine,
          weekOfYear: Math.ceil(((date - new Date(date.getFullYear(), 0, 1)) / 86400000 + new Date(date.getFullYear(), 0, 1).getDay() + 1) / 7),
          quarter: Math.ceil((date.getMonth() + 1) / 3),
          loadTime: window.performance.timing.loadEventEnd - window.performance.timing.navigationStart,
          
        },
      };
  
      // Push dans le Data Layer
      pushToDataLayer(contextData);
    }
  
    // Fonction utilitaire pour effectuer le push et afficher un log
    function pushToDataLayer(data) {
      window.dataLayer.push(data);
      console.log("Données de contexte poussées dans le dataLayer :", data);
    }
  
    // Exécution immédiate dès que le script est chargé
    pushContextData();
  })();
  