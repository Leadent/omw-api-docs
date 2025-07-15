window.onload = function() {
  //<editor-fold desc="Changeable Configuration Block">

  // the following lines will be replaced by docker/configurator, when it runs in a docker-container
  window.ui = SwaggerUIBundle({
    url: "omwApi.yml",
    dom_id: '#swagger-ui',
    deepLinking: true,
    presets: [
      SwaggerUIBundle.presets.apis,
      SwaggerUIStandalonePreset
    ],
    plugins: [
      SwaggerUIBundle.plugins.DownloadUrl
    ],
    layout: "StandaloneLayout"
  });

  //</editor-fold>
};


const apis = [
  {
    url: "omwApi.yml",
    name: "OMW API",
    description: "Main application API"
  },
  {
    url: "testApi.yml",
    name: "Test API",
    description: "Simple test API for development"
  }
];

selector.addEventListener('change', (e) => {
  // Show loading state
  selector.disabled = true;
  selector.style.cursor = 'wait';

  // Add loading text
  const loadingOption = document.createElement('option');
  loadingOption.textContent = 'Loading...';
  loadingOption.selected = true;
  selector.appendChild(loadingOption);

  const selectedApi = apis.find(api => api.url === e.target.value);
  if (selectedApi) {
    window.ui.specActions.updateUrl(selectedApi.url);
    window.ui.specActions.download(selectedApi.url);

    // Reset after a short delay
    setTimeout(() => {
      selector.removeChild(loadingOption);
      selector.disabled = false;
      selector.style.cursor = 'pointer';
      selector.value = selectedApi.url;
    }, 500);
  }
});

// 3. Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
  // Alt + 1, 2, 3, etc. to switch APIs
  if (e.altKey && e.key >= '1' && e.key <= '9') {
    const apiIndex = parseInt(e.key) - 1;
    if (apis[apiIndex]) {
      const selector = document.getElementById('api-selector');
      selector.value = apis[apiIndex].url;
      selector.dispatchEvent(new Event('change'));
    }
  }
});

// 4. Add API count indicator
const countIndicator = document.createElement('span');
countIndicator.textContent = `(${apis.length} APIs)`;
countIndicator.style.cssText = `
  color: #666;
  font-size: 12px;
  margin-left: 5px;
`;
label.appendChild(countIndicator);

// 5. Add help text/instructions
const helpText = document.createElement('div');
helpText.style.cssText = `
  font-size: 12px;
  color: #666;
  margin-top: 5px;
  font-style: italic;
`;
helpText.textContent = 'Use Alt+1, Alt+2, etc. for quick switching';
selectorContainer.appendChild(helpText);
