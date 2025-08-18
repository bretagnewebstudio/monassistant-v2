(function() {
  // Widget MonAssistant Pro - Injection universelle
  window.MonAssistantWidget = {
    init: function(config) {
      // Configuration par défaut
      const settings = {
        position: config.position || 'bottom-right',
        color: config.color || '#3b82f6',
        text: config.text || 'Assistant',
        modules: config.modules || ['dashboard', 'vehicules', 'services'],
        ...config
      };
      
      // Créer le bouton flottant
      const button = document.createElement('div');
      button.id = 'monassistant-widget-button';
      button.innerHTML = `
        <style>
          #monassistant-widget-button {
            position: fixed;
            ${settings.position.includes('bottom') ? 'bottom: 20px' : 'top: 20px'};
            ${settings.position.includes('right') ? 'right: 20px' : 'left: 20px'};
            background: ${settings.color};
            color: white;
            padding: 12px 24px;
            border-radius: 50px;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 999998;
            display: flex;
            align-items: center;
            gap: 8px;
            font-family: system-ui, -apple-system, sans-serif;
            font-size: 16px;
            font-weight: 600;
            transition: transform 0.2s, box-shadow 0.2s;
          }
          #monassistant-widget-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(0,0,0,0.2);
          }
          #monassistant-iframe {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            border: none;
            z-index: 999999;
            display: none;
          }
        </style>
        <span>💬</span>
        <span>${settings.text}</span>
      `;
      
      document.body.appendChild(button);
      
      // Créer l'iframe
      const iframe = document.createElement('iframe');
      iframe.id = 'monassistant-iframe';
      iframe.src = settings.url || 'https://monassistant-v2.vercel.app';
      document.body.appendChild(iframe);
      
      // Gestion du clic
      button.addEventListener('click', function() {
        iframe.style.display = iframe.style.display === 'none' ? 'block' : 'none';
      });
      
      // Communication avec l'iframe
      window.addEventListener('message', function(e) {
        if (e.data === 'close-monassistant') {
          iframe.style.display = 'none';
        }
      });
    }
  };
  
  // Auto-init si data attributes présents
  const script = document.currentScript;
  if (script) {
    const config = {
      client: script.getAttribute('data-client'),
      modules: script.getAttribute('data-modules')?.split(','),
      position: script.getAttribute('data-position'),
      color: script.getAttribute('data-color'),
      text: script.getAttribute('data-text')
    };
    
    // Attendre que le DOM soit prêt
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function() {
        MonAssistantWidget.init(config);
      });
    } else {
      MonAssistantWidget.init(config);
    }
  }
})();
