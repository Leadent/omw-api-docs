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

  console.log('Available APIs:', apis);

  // Function to get URL parameters
  function getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
  }

  // Function to update URL without page reload
  function updateUrlParameter(key, value) {
    const url = new URL(window.location);
    if (value) {
      url.searchParams.set(key, value);
    } else {
      url.searchParams.delete(key);
    }
    window.history.replaceState({}, '', url);
  }

  // Determine which API to load initially
  let initialApiUrl = apis[0].url;
  const apiParam = getUrlParameter('api');

  console.log('API parameter from URL:', apiParam);

  if (apiParam) {
    // Check if the API parameter matches any of our APIs
    const matchedApi = apis.find(function(api) {
      const matches = [
        api.url === apiParam,
        api.url === apiParam + '.yml',
        api.url === apiParam + '.yaml',
        api.name.toLowerCase().replace(/\s+/g, '') === apiParam.toLowerCase(),
        api.url.replace(/\.(yml|yaml)$/, '') === apiParam
      ];
      console.log('Checking ' + api.name + ':', matches);
      return matches.some(function(match) { return match; });
    });

    console.log('Matched API:', matchedApi);

    if (matchedApi) {
      initialApiUrl = matchedApi.url;
    } else {
      console.warn('No API matched the parameter:', apiParam);
    }
  }

  console.log('Initial API URL:', initialApiUrl);

  // Initialize Swagger UI with the determined API
  window.ui = SwaggerUIBundle({
    url: initialApiUrl,
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
      console.log('Swagger UI loaded, adding selector...');
      setTimeout(addApiSelector, 500);
    }
  });

  function addApiSelector() {
    console.log('Adding API selector...');

    const existingSelector = document.querySelector('.download-url-wrapper');
    if (existingSelector) {
      existingSelector.style.display = 'none';
    }

    const topbar = document.querySelector('.topbar');
    if (!topbar) {
      console.warn('Topbar not found, retrying in 100ms...');
      setTimeout(addApiSelector, 100);
      return;
    }

    if (document.getElementById('api-selector-container')) {
      console.log('API selector already exists');
      return;
    }

    const selectorContainer = document.createElement('div');
    selectorContainer.id = 'api-selector-container';
    selectorContainer.style.cssText = 
      'display: flex; align-items: center; gap: 15px; margin: 10px 30px; ' +
      'padding: 15px 20px; background: #f8f9fa; border-radius: 8px; ' +
      'border: 1px solid #e9ecef; box-shadow: 0 2px 4px rgba(0,0,0,0.05);';

    const label = document.createElement('label');
    label.textContent = 'Select API:';
    label.style.cssText = 
      'color: #3b4151; font-weight: 600; font-size: 16px; margin-right: 5px;';

    const selector = document.createElement('select');
    selector.id = 'api-selector';
    selector.style.cssText = 
      'padding: 12px 16px; border: 2px solid #d4d4d4; border-radius: 6px; ' +
      'background: white; font-size: 16px; color: #3b4151; cursor: pointer; ' +
      'min-width: 250px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); transition: all 0.2s ease;';

    // FIXED: Use regular function and check against initialApiUrl
    apis.forEach(function(api, index) {
      const option = document.createElement('option');
      option.value = api.url;
      option.textContent = api.name;
      if (api.url === initialApiUrl) {
        option.selected = true;
        console.log('Setting selected option to:', api.name);
      }
      selector.appendChild(option);
    });

    selector.addEventListener('change', function(e) {
      const selectedApi = apis.find(function(api) {
        return api.url === e.target.value;
      });
      if (selectedApi) {
        console.log('Switching to API:', selectedApi.name);

        const apiName = selectedApi.url.replace(/\.(yml|yaml)$/, '');
        updateUrlParameter('api', apiName);

        window.ui.specActions.updateUrl(selectedApi.url);
        window.ui.specActions.download(selectedApi.url);

        document.title = selectedApi.name + ' - API Documentation';
      }
    });

    const shareButton = document.createElement('button');
    shareButton.textContent = 'Share Link';
    shareButton.style.cssText = 
      'padding: 8px 16px; background: #89bf04; color: white; border: none; ' +
      'border-radius: 4px; cursor: pointer; font-size: 14px; transition: background 0.2s ease;';

    shareButton.addEventListener('click', function() {
      navigator.clipboard.writeText(window.location.href).then(function() {
        const originalText = shareButton.textContent;
        shareButton.textContent = 'Copied!';
        shareButton.style.background = '#28a745';
        setTimeout(function() {
          shareButton.textContent = originalText;
          shareButton.style.background = '#89bf04';
        }, 2000);
      });
    });

    shareButton.addEventListener('mouseenter', function() {
      shareButton.style.background = '#7ba004';
    });

    shareButton.addEventListener('mouseleave', function() {
      shareButton.style.background = '#89bf04';
    });

    selectorContainer.appendChild(label);
    selectorContainer.appendChild(selector);
    selectorContainer.appendChild(shareButton);

    topbar.appendChild(selectorContainer);

    const initialApi = apis.find(function(api) {
      return api.url === initialApiUrl;
    });
    document.title = initialApi.name + ' - API Documentation';

    console.log('API selector added successfully');
  }
};
