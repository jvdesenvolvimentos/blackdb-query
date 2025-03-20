document.addEventListener('DOMContentLoaded', function() {
  // Initialize the application
  initApp();
});

function initApp() {
  // Initialize navigation
  setupNavigation();
  
  // Load the initial route
  handleRoute();
  
  // Set up the logout button
  const logoutBtn = document.querySelector('.logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', handleLogout);
  }
}

function setupNavigation() {
  // Add event listeners to navigation items
  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(item => {
    item.addEventListener('click', function(e) {
      e.preventDefault();
      const page = this.getAttribute('data-page');
      if (page) {
        window.location.hash = page;
      }
    });
  });
  
  // Listen for hash changes to handle routing
  window.addEventListener('hashchange', handleRoute);
}

function handleRoute() {
  // Get the current route from the hash
  let route = window.location.hash.substring(1);
  
  // If no route is specified, default to the landing page
  if (!route) {
    route = 'landing';
  }
  
  // Check if user is authenticated for protected routes
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const publicRoutes = ['landing', 'login', 'register'];
  
  if (!publicRoutes.includes(route) && !isAuthenticated) {
    // Redirect to login if trying to access protected route while not logged in
    window.location.hash = 'login';
    return;
  }
  
  // Update active navigation item
  updateActiveNavItem(route);
  
  // Show/hide dashboard layout based on route
  const dashboardLayout = document.getElementById('dashboard-layout');
  const landingLayout = document.getElementById('landing-layout');
  
  if (publicRoutes.includes(route)) {
    // Public routes use the landing layout
    if (dashboardLayout) dashboardLayout.style.display = 'none';
    if (landingLayout) landingLayout.style.display = 'block';
  } else {
    // Protected routes use the dashboard layout
    if (dashboardLayout) dashboardLayout.style.display = 'flex';
    if (landingLayout) landingLayout.style.display = 'none';
  }
  
  // Load the appropriate page content
  loadPageContent(route);
}

function updateActiveNavItem(route) {
  // Remove active class from all nav items
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.remove('active');
  });
  
  // Add active class to the current nav item
  const activeItem = document.querySelector(`.nav-item[data-page="${route}"]`);
  if (activeItem) {
    activeItem.classList.add('active');
  }
}

function loadPageContent(route) {
  const pageContent = document.getElementById('page-content');
  
  if (!pageContent) return;
  
  // Clear existing content
  pageContent.innerHTML = '';
  
  // Load the appropriate template based on the route
  switch (route) {
    case 'landing':
      loadLandingPage();
      break;
    case 'modules':
      loadModulesPage(pageContent);
      break;
    case 'settings':
      loadSettingsPage(pageContent);
      break;
    case 'statistics':
      pageContent.innerHTML = '<h1>Estatísticas</h1><p>Página em desenvolvimento.</p>';
      break;
    case 'admin':
      pageContent.innerHTML = '<h1>Painel de Admin</h1><p>Página em desenvolvimento.</p>';
      break;
    case 'login':
      loadLoginPage();
      break;
    case 'register':
      loadRegisterPage();
      break;
    default:
      pageContent.innerHTML = '<h1>Página não encontrada</h1><p>A página solicitada não existe.</p>';
  }
}

function loadLandingPage() {
  // For landing page, we directly manipulate the landing-content
  const landingContent = document.getElementById('landing-content');
  if (!landingContent) return;
  
  // Clone the landing template
  const template = document.getElementById('landing-template');
  if (template) {
    landingContent.innerHTML = '';
    const content = template.content.cloneNode(true);
    landingContent.appendChild(content);
    
    // Add event listeners to action buttons
    const loginBtn = landingContent.querySelector('.login-button');
    if (loginBtn) {
      loginBtn.addEventListener('click', () => {
        window.location.hash = 'login';
      });
    }
    
    const registerBtn = landingContent.querySelector('.register-button');
    if (registerBtn) {
      registerBtn.addEventListener('click', () => {
        window.location.hash = 'register';
      });
    }
  }
}

function loadLoginPage() {
  // For login page, we directly manipulate the landing-content
  const landingContent = document.getElementById('landing-content');
  if (!landingContent) return;
  
  // Clone the login template
  const template = document.getElementById('login-template');
  if (template) {
    landingContent.innerHTML = '';
    const content = template.content.cloneNode(true);
    landingContent.appendChild(content);
    
    // Add event listener to login form
    const loginForm = landingContent.querySelector('#login-form');
    if (loginForm) {
      loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        // Mock login
        localStorage.setItem('isAuthenticated', 'true');
        window.location.hash = 'modules';
        showToast('Login realizado com sucesso!');
      });
    }
  }
}

function loadRegisterPage() {
  // For register page, we directly manipulate the landing-content
  const landingContent = document.getElementById('landing-content');
  if (!landingContent) return;
  
  // Clone the register template
  const template = document.getElementById('register-template');
  if (template) {
    landingContent.innerHTML = '';
    const content = template.content.cloneNode(true);
    landingContent.appendChild(content);
    
    // Add event listener to register form
    const registerForm = landingContent.querySelector('#register-form');
    if (registerForm) {
      registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        // Mock registration
        localStorage.setItem('isAuthenticated', 'true');
        window.location.hash = 'modules';
        showToast('Registro realizado com sucesso!');
      });
    }
  }
}

function loadModulesPage(container) {
  // Clone the modules template
  const template = document.getElementById('modules-template');
  const content = template.content.cloneNode(true);
  
  // Append the content to the container
  container.appendChild(content);
  
  // Initialize the modules page
  initModulesPage();
}

function loadSettingsPage(container) {
  // Clone the settings template
  const template = document.getElementById('settings-template');
  const content = template.content.cloneNode(true);
  
  // Append the content to the container
  container.appendChild(content);
  
  // Initialize the settings page
  initSettingsPage();
}

function initModulesPage() {
  // Mock modules data
  const mockModules = [
    {
      id: "module-personal",
      type: "personal",
      name: "Dados Pessoais",
      description: "Consulta de informações pessoais b��sicas: nome, idade, documentos, etc.",
      creditCost: 1,
      enabled: true,
      icon: "user"
    },
    {
      id: "module-financial",
      type: "financial",
      name: "Dados Financeiros",
      description: "Consulta de dados financeiros como renda, histórico bancário, etc.",
      creditCost: 5,
      enabled: true,
      icon: "dollar-sign"
    },
    {
      id: "module-address",
      type: "address",
      name: "Dados de Endereço",
      description: "Consulta de informações de endereço e geolocalização.",
      creditCost: 2,
      enabled: true,
      icon: "home"
    },
    {
      id: "module-work",
      type: "work",
      name: "Dados Profissionais",
      description: "Consulta de histórico profissional, empregos e qualificações.",
      creditCost: 3,
      enabled: true,
      icon: "briefcase"
    },
    {
      id: "module-credit",
      type: "credit",
      name: "Dados de Crédito",
      description: "Consulta de score de crédito, histórico de pagamentos e dívidas.",
      creditCost: 10,
      enabled: true,
      icon: "credit-card"
    }
  ];
  
  // Render modules
  renderModules(mockModules);
  
  // Setup tabs in modules page
  setupTabs('.modules-tabs');
}

function renderModules(modules) {
  const modulesContainer = document.getElementById('modules-container');
  
  // Clear existing modules
  modulesContainer.innerHTML = '';
  
  // Render each module
  modules.forEach(module => {
    const moduleElement = createModuleElement(module);
    modulesContainer.appendChild(moduleElement);
  });
}

function createModuleElement(module) {
  // Create module card
  const moduleCard = document.createElement('div');
  moduleCard.className = 'card module-card';
  moduleCard.setAttribute('data-module-type', module.type);
  
  // Create module content
  moduleCard.innerHTML = `
    <div class="card-header">
      <div class="flex items-center space-x-4">
        <div class="flex-shrink-0">
          <div class="bg-primary/10 p-3 rounded-full">
            ${getIconSvg(module.icon)}
          </div>
        </div>
        <div>
          <h3 class="text-lg font-semibold">${module.name}</h3>
          <p class="text-sm text-muted-foreground">${module.description}</p>
        </div>
      </div>
    </div>
    <div class="card-content">
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <span class="badge badge-outline">
            ${module.creditCost} ${module.creditCost === 1 ? 'crédito' : 'créditos'}
          </span>
          <button class="btn btn-sm btn-primary">Consultar</button>
        </div>
      </div>
    </div>
  `;
  
  return moduleCard;
}

function initSettingsPage() {
  // Mock user data
  const userData = {
    plan: "Business",
    creditsRemaining: 164,
    totalCredits: 300,
    daysRemaining: 14
  };
  
  // Set plan data
  document.getElementById('current-plan').textContent = `Plano ${userData.plan}`;
  document.getElementById('days-remaining').textContent = `Seu plano renova em ${userData.daysRemaining} dias`;
  document.getElementById('credits-indicator').textContent = `${userData.creditsRemaining} de ${userData.totalCredits}`;
  
  // Set progress bar
  const progressPercentage = (userData.creditsRemaining / userData.totalCredits) * 100;
  document.getElementById('credits-progress').style.width = `${progressPercentage}%`;
  
  // Setup tabs in settings page
  setupTabs('.settings-tabs');
  setupTabs('.modules-config-tabs');
  
  // Mock modules data
  const mockModules = [
    {
      id: "module-personal",
      type: "personal",
      name: "Dados Pessoais",
      description: "Consulta de informações pessoais básicas: nome, idade, documentos, etc.",
      creditCost: 1,
      enabled: true,
      icon: "user"
    },
    {
      id: "module-financial",
      type: "financial",
      name: "Dados Financeiros",
      description: "Consulta de dados financeiros como renda, histórico bancário, etc.",
      creditCost: 5,
      enabled: true,
      icon: "dollar-sign"
    },
    {
      id: "module-address",
      type: "address",
      name: "Dados de Endereço",
      description: "Consulta de informações de endereço e geolocalização.",
      creditCost: 2,
      enabled: true,
      icon: "home"
    },
    {
      id: "module-work",
      type: "work",
      name: "Dados Profissionais",
      description: "Consulta de histórico profissional, empregos e qualificações.",
      creditCost: 3,
      enabled: true,
      icon: "briefcase"
    },
    {
      id: "module-credit",
      type: "credit",
      name: "Dados de Crédito",
      description: "Consulta de score de crédito, histórico de pagamentos e dívidas.",
      creditCost: 10,
      enabled: false,
      icon: "credit-card"
    }
  ];
  
  // Render modules in settings
  renderSettingsModules(mockModules);
}

function renderSettingsModules(modules) {
  const activeModulesContainer = document.getElementById('active-modules-container');
  const allModulesContainer = document.getElementById('all-modules-container');
  
  // Clear existing modules
  activeModulesContainer.innerHTML = '';
  allModulesContainer.innerHTML = '';
  
  // Render each module
  modules.forEach(module => {
    // Create module card for all modules view
    const moduleCard = createSettingsModuleCard(module);
    allModulesContainer.appendChild(moduleCard);
    
    // If module is enabled, also add to active modules
    if (module.enabled) {
      const activeModuleCard = createSettingsModuleCard(module);
      activeModulesContainer.appendChild(activeModuleCard);
    }
  });
  
  // Add toggle functionality to all module switches
  document.querySelectorAll('.module-toggle').forEach(toggle => {
    toggle.addEventListener('change', function() {
      const moduleId = this.getAttribute('data-module-id');
      showToast(`Módulo ${this.checked ? 'ativado' : 'desativado'} com sucesso.`);
      
      // In a real app, you would update the server here
      // For now, we'll just re-render the modules with updated state
      modules.forEach(module => {
        if (module.id === moduleId) {
          module.enabled = this.checked;
        }
      });
      
      // Re-render modules
      renderSettingsModules(modules);
    });
  });
}

function createSettingsModuleCard(module) {
  // Create module card
  const moduleCard = document.createElement('div');
  moduleCard.className = module.enabled ? 'card' : 'card opacity-70';
  
  // Create module content
  moduleCard.innerHTML = `
    <div class="card-header flex flex-row items-start justify-between space-y-0">
      <div class="flex items-center gap-3">
        <div class="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
          ${getIconSvg(module.icon)}
        </div>
        <div>
          <h3 class="text-base font-medium">${module.name}</h3>
          <p class="text-xs text-muted-foreground">${module.description}</p>
        </div>
      </div>
      <label class="switch">
        <input type="checkbox" class="module-toggle" data-module-id="${module.id}" ${module.enabled ? 'checked' : ''}>
        <span class="slider round"></span>
      </label>
    </div>
    <div class="card-content">
      <div class="flex items-center justify-between">
        <span class="badge badge-outline py-1">
          ${module.creditCost} ${module.creditCost === 1 ? 'crédito' : 'créditos'} por consulta
        </span>
        <span class="text-xs text-muted-foreground">
          ${module.enabled ? 'Módulo ativo' : 'Módulo inativo'}
        </span>
      </div>
    </div>
  `;
  
  return moduleCard;
}

function setupTabs(containerSelector) {
  const container = document.querySelector(containerSelector);
  if (!container) return;
  
  const triggers = container.querySelectorAll('.tab-trigger');
  const panes = container.querySelectorAll('.tab-pane');
  
  triggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      // Remove active class from all triggers and panes
      triggers.forEach(t => t.classList.remove('active'));
      panes.forEach(p => p.classList.remove('active'));
      
      // Add active class to current trigger
      trigger.classList.add('active');
      
      // Get the tab ID and activate the corresponding pane
      const tabId = trigger.getAttribute('data-tab');
      const pane = container.querySelector(`#${tabId}`);
      if (pane) {
        pane.classList.add('active');
      } else {
        // If the tab pane doesn't have an ID, filter modules by type
        if (containerSelector === '.modules-tabs') {
          filterModulesByType(tabId);
        }
      }
    });
  });
}

function filterModulesByType(type) {
  const moduleCards = document.querySelectorAll('.module-card');
  
  moduleCards.forEach(card => {
    if (type === 'all' || card.getAttribute('data-module-type') === type) {
      card.style.display = 'block';
    } else {
      card.style.display = 'none';
    }
  });
}

function handleLogout() {
  // Clear any user data
  localStorage.removeItem('isAuthenticated');
  
  // Redirect to landing page
  window.location.hash = 'landing';
  
  // Show logout message
  showToast('Logout realizado com sucesso!');
}

function showToast(message, type = 'success') {
  // Create toast element
  const toast = document.createElement('div');
  toast.className = `toast ${type === 'error' ? 'toast-destructive' : ''}`;
  
  // Set toast content
  toast.innerHTML = `
    <div class="toast-content">
      <h4 class="toast-title">${type === 'error' ? 'Erro' : 'Sucesso'}</h4>
      <p class="toast-description">${message}</p>
    </div>
    <button class="toast-close">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
    </button>
  `;
  
  // Add to toast container
  const toastContainer = document.getElementById('toast-container');
  toastContainer.appendChild(toast);
  
  // Add close functionality
  toast.querySelector('.toast-close').addEventListener('click', () => {
    toast.remove();
  });
  
  // Auto remove after 5 seconds
  setTimeout(() => {
    toast.remove();
  }, 5000);
}

function getIconSvg(iconName) {
  const icons = {
    'user': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>',
    'dollar-sign': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>',
    'home': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>',
    'briefcase': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>',
    'credit-card': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5"><rect width="20" height="14" x="2" y="5" rx="2"></rect><line x1="2" x2="22" y1="10" y2="10"></line></svg>',
    'search': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>'
  };
  
  return icons[iconName] || icons['search'];
}

