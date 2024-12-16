(function () {
    // Initialisation du Data Layer si inexistant
    window.dataLayer = window.dataLayer || [];
  
    // URL de l'API pour récupérer les données de contexte
    const API_BASE_URL = "https://getcontext.onrender.com/api/context";
  
    // Création de l'objet contextManager
    const contextManager = {
      contextData: null, // Cache local pour les données de contexte
  
      // Méthode pour récupérer les données de contexte depuis l'API
      async fetchContextData() {
        if (this.contextData) {
          // Retourner les données en cache si elles existent
          return this.contextData;
        }
  
        try {
          const response = await fetch(`${API_BASE_URL}`, {
            headers: {
              "User-Agent": navigator.userAgent
            }
          });
  
          if (!response.ok) {
            console.error("Erreur lors de la récupération des données :", response.statusText);
            return null;
          }
  
          // Stocker les données dans le cache local
          this.contextData = await response.json();
          return this.contextData;
        } catch (error) {
          console.error("Erreur lors de l'appel à l'API :", error);
          return null;
        }
      },
  
      // Méthode pour pousser les données dans le dataLayer
      async pushToDataLayer() {
        const contextData = await this.fetchContextData();
  
        if (contextData) {
          const eventData = {
            event: "context_ready",
            context: contextData
          };
  
          // Pousser les données dans le dataLayer
          window.dataLayer.push(eventData);
          console.log("Données de contexte poussées dans le dataLayer :", eventData);
        }
      },
  
      // Méthode pour récupérer directement l'objet context
      async getContext() {
        return await this.fetchContextData();
      },
  
      // Initialisation : Charger et pousser automatiquement dans le dataLayer
      async initialize() {
        await this.pushToDataLayer(); // Pousser automatiquement dans le dataLayer
      }
    };
  
    // Exposer l'objet globalement
    window.contextManager = contextManager;
  
    // Exemple d'utilisation : Initialisation automatique
    contextManager.initialize();
  })();
  