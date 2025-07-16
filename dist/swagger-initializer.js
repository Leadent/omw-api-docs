window.onload = function() {
  // API configurations
  const apis = [
    {
      url: "omwApi.yml",
      name: "On My Way API",
      description: "Main application API"
    },
    {
      url: "omwCallbackApi.yml",
      name: "OMW Callback API",
      description: "API supported by OMW for making callback requests to other systems"
    }
  ];

  // Initialize Swagger UI with the first API
  window.ui = SwaggerUIBundle({
    url: apis[0].url,
    dom_id: '#swagger-ui',
    deepLinking: true,
    presets: [
      SwaggerUIBundle.presets.apis,
      SwaggerUIStandalonePreset
    ],
    plugins: [
      SwaggerUIBundle.plugins.DownloadUrl
    ],
    layout: "StandaloneLayout",
    onComplete: function() {
      // Add custom API selector after Swagger UI loads
      addApiSelector();
    }
  });

  function addApiSelector() {
    // Remove the default spec selector if it exists
    const existingSelector = document.querySelector('.download-url-wrapper');
    if (existingSelector) {
      existingSelector.style.display = 'none';
    }

    // Find the topbar
    const topbar = document.querySelector('.topbar');
    if (!topbar) {
      console.warn('Topbar not found, retrying in 100ms...');
      setTimeout(addApiSelector, 100);
      return;
    }

    // Check if our selector already exists
    if (document.getElementById('api-selector-container')) return;

    // Create container for our selector
    const selectorContainer = document.createElement('div');
    selectorContainer.id = 'api-selector-container';
    selectorContainer.style.cssText = `
      display: flex;
      align-items: center;
      gap: 15px;
      margin: 10px 30px;
      padding: 15px 20px;
      background: #f8f9fa;
      border-radius: 8px;
      border: 1px solid #e9ecef;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    `;

    // Create label
    const label = document.createElement('label');
    label.textContent = 'Select API:';
    label.style.cssText = `
      color: #3b4151;
      font-weight: 600;
      font-size: 16px;
      margin-right: 5px;
    `;

    // Create dropdown
    const selector = document.createElement('select');
    selector.id = 'api-selector';
    selector.style.cssText = `
      padding: 12px 16px;
      border: 2px solid #d4d4d4;
      border-radius: 6px;
      background: white;
      font-size: 16px;
      color: #3b4151;
      cursor: pointer;
      min-width: 250px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      transition: all 0.2s ease;
    `;

    // Add options
    apis.forEach((api, index) => {
      const option = document.createElement('option');
      option.value = api.url;
      option.textContent = api.name;
      if (index === 0) option.selected = true;
      selector.appendChild(option);
    });

    // Add change handler
    selector.addEventListener('change', function(e) {
      const selectedApi = apis.find(api => api.url === e.target.value);
      if (selectedApi) {
        // Update the URL and reload the spec
        window.ui.specActions.updateUrl(selectedApi.url);
        window.ui.specActions.download(selectedApi.url);

        // Update the page title
        document.title = `${selectedApi.name} - API Documentation`;
      }
    });

    // Add elements to container
    selectorContainer.appendChild(label);
    selectorContainer.appendChild(selector);

    // Add container to topbar
    topbar.appendChild(selectorContainer);

    // Set initial title
    document.title = `${apis[0].name} - API Documentation`;
  }
};
