window.onload = function() {
  // API configurations
  const apis = [
    {
      url: "omwApi.yml",
      name: "On My Way API",
      description: "Main application API"
    },
    // Add new APIs here
    // {
    //   url: "testApi.yml",
    //   name: "Test API",
    //   description: "Simple test API for development"
    // }
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
      setTimeout(addApiSelector, 500); // Give it more time to load
    }
  });

  function addApiSelector() {
    try {
      // Remove the default spec selector if it exists
      const existingSelector = document.querySelector('.download-url-wrapper');
      if (existingSelector) {
        existingSelector.style.display = 'none';
      }

      // Find the topbar
      const topbar = document.querySelector('.topbar');
      if (!topbar) {
        console.warn('Topbar not found, retrying...');
        setTimeout(addApiSelector, 200);
        return;
      }

      // Check if our selector already exists
      if (document.getElementById('api-selector-container')) {
        console.log('API selector already exists');
        return;
      }

      console.log('Adding API selector...');

      // Create container for our selector
      const selectorContainer = document.createElement('div');
      selectorContainer.id = 'api-selector-container';
      selectorContainer.style.cssText = `
        display: flex;
        align-items: center;
        gap: 10px;
        margin-left: 20px;
      `;

      // Create label
      const label = document.createElement('label');
      label.textContent = 'Select API:';
      label.style.cssText = `
        color: #3b4151;
        font-weight: 600;
        font-size: 14px;
      `;

      // Create dropdown
      const apiSelector = document.createElement('select');
      apiSelector.id = 'api-selector';
      apiSelector.style.cssText = `
        padding: 8px 12px;
        border: 1px solid #d4d4d4;
        border-radius: 4px;
        background: white;
        font-size: 14px;
        color: #3b4151;
        cursor: pointer;
        min-width: 200px;
      `;

      // Add options
      apis.forEach(function(api, index) {
        const option = document.createElement('option');
        option.value = api.url;
        option.textContent = api.name;
        if (index === 0) option.selected = true;
        apiSelector.appendChild(option);
      });

      // Add change handler
      apiSelector.addEventListener('change', function(e) {
        try {
          const selectedUrl = e.target.value;
          const selectedApi = apis.find(function(api) {
            return api.url === selectedUrl;
          });

          if (selectedApi) {
            console.log('Switching to API:', selectedApi.name);

            // Update the URL and reload the spec
            if (window.ui && window.ui.specActions) {
              window.ui.specActions.updateUrl(selectedApi.url);
              window.ui.specActions.download(selectedApi.url);
            }

            // Update the page title
            document.title = selectedApi.name + ' - API Documentation';
          }
        } catch (error) {
          console.error('Error switching API:', error);
        }
      });

      // Add elements to container
      selectorContainer.appendChild(label);
      selectorContainer.appendChild(apiSelector);

      // Add container to topbar
      topbar.appendChild(selectorContainer);

      // Set initial title
      document.title = apis[0].name + ' - API Documentation';

      console.log('API selector added successfully');

    } catch (error) {
      console.error('Error adding API selector:', error);
    }
  }
};
