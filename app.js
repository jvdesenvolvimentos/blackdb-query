
// App state management
const state = {
  isAuthenticated: false,
  currentPage: 'modules',
  platformName: 'BlackDB',
  clients: [],
  modules: [],
  searchQuery: '',
  view: 'table',
  currentModal: null,
  notifications: []
};

// Initialize application
document.addEventListener('DOMContentLoaded', () => {
  // Check for authentication
  checkAuthentication();
  
  // Setup event listeners
  setupEventListeners();
  
  // Load initial page based on hash or default
  const hash = window.location.hash.substring(1) || 'modules';
  navigateToPage(hash);
  
  // Initialize mock data
  initMockData();
});

// Check if user is authenticated
function checkAuthentication() {
  const storedAuth = localStorage.getItem('isAuthenticated');
  if (storedAuth === 'true') {
    state.isAuthenticated = true;
  } else {
    // If not authenticated, show login page
    if (!window.location.hash.includes('login') && !window.location.hash.includes('register')) {
      window.location.href = '#login';
    }
  }
}

// Setup event listeners
function setupEventListeners() {
  // Navigation links
  document.querySelectorAll('.nav-item').forEach(link => {
    link.addEventListener('click', (e) => {
      if (link.classList.contains('logout-btn')) {
        handleLogout();
        return;
      }
      
      const page = link.getAttribute('data-page');
      if (page) {
        e.preventDefault();
        navigateToPage(page);
      }
    });
  });
  
  // Hash change event for routing
  window.addEventListener('hashchange', () => {
    const hash = window.location.hash.substring(1) || 'modules';
    navigateToPage(hash);
  });
}

// Handle logout
function handleLogout() {
  localStorage.removeItem('isAuthenticated');
  state.isAuthenticated = false;
  showToast('Logout successful', 'You have been logged out.');
  window.location.href = '#login';
}

// Navigation function
function navigateToPage(page) {
  // Update current page in state
  state.currentPage = page;
  
  // Update active nav item
  document.querySelectorAll('.nav-item').forEach(item => {
    if (item.getAttribute('data-page') === page) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });
  
  // Check if authentication is required
  if (page !== 'login' && page !== 'register' && !state.isAuthenticated) {
    window.location.href = '#login';
    return;
  }
  
  // Load page content
  const pageContent = document.getElementById('page-content');
  
  switch (page) {
    case 'login':
      pageContent.innerHTML = renderLoginPage();
      setupLoginForm();
      break;
    case 'register':
      pageContent.innerHTML = renderRegisterPage();
      setupRegisterForm();
      break;
    case 'modules':
      pageContent.innerHTML = renderModulesPage();
      setupSearchFunctionality();
      break;
    case 'statistics':
      pageContent.innerHTML = renderStatisticsPage();
      setupStatisticsEvents();
      break;
    case 'admin':
      pageContent.innerHTML = renderAdminPage();
      setupAdminEvents();
      break;
    case 'settings':
      pageContent.innerHTML = renderSettingsPage();
      setupSettingsEvents();
      break;
    default:
      pageContent.innerHTML = '<div class="empty-state"><h1>404 - Page Not Found</h1><p>The page you are looking for does not exist.</p></div>';
  }
}

// Initialize mock data
function initMockData() {
  // Mock client data
  state.clients = [
    {
      id: '1',
      name: 'João Silva',
      email: 'joao.silva@example.com',
      phone: '(11) 98765-4321',
      birthDate: '1985-05-15',
      address: 'Rua das Flores, 123 - São Paulo, SP',
      status: 'active'
    },
    {
      id: '2',
      name: 'Maria Oliveira',
      email: 'maria.oliveira@example.com',
      phone: '(21) 97654-3210',
      birthDate: '1990-10-20',
      address: 'Av. Atlântica, 456 - Rio de Janeiro, RJ',
      status: 'active'
    },
    {
      id: '3',
      name: 'Carlos Pereira',
      email: 'carlos.pereira@example.com',
      phone: '(31) 96543-2109',
      birthDate: '1978-03-25',
      address: 'Rua das Palmeiras, 789 - Belo Horizonte, MG',
      status: 'inactive'
    }
  ];
  
  // Mock module data
  state.modules = [
    {
      id: 'module-personal',
      type: 'personal',
      name: 'Dados Pessoais',
      description: 'Consulta de informações pessoais básicas: nome, idade, documentos, etc.',
      creditCost: 1,
      enabled: true,
      icon: 'user',
      apiUrl: 'https://api.example.com/v1/personal'
    },
    {
      id: 'module-financial',
      type: 'financial',
      name: 'Dados Financeiros',
      description: 'Consulta de dados financeiros como renda, histórico bancário, etc.',
      creditCost: 5,
      enabled: true,
      icon: 'dollar-sign',
      apiUrl: 'https://api.example.com/v1/financial'
    },
    {
      id: 'module-address',
      type: 'address',
      name: 'Endereço',
      description: 'Consulta e validação de informações de endereço.',
      creditCost: 2,
      enabled: true,
      icon: 'home',
      apiUrl: 'https://api.example.com/v1/address'
    },
    {
      id: 'module-work',
      type: 'work',
      name: 'Dados Profissionais',
      description: 'Informações sobre histórico profissional e emprego atual.',
      creditCost: 3,
      enabled: false,
      icon: 'briefcase',
      apiUrl: 'https://api.example.com/v1/employment'
    }
  ];
}

// Search functionality
function setupSearchFunctionality() {
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      state.searchQuery = e.target.value.toLowerCase();
      updateSearchResults();
    });
    
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        updateSearchResults();
      }
    });
  }
  
  const searchButton = document.getElementById('search-button');
  if (searchButton) {
    searchButton.addEventListener('click', () => {
      updateSearchResults();
    });
  }
  
  const viewButtons = document.querySelectorAll('.view-button');
  if (viewButtons.length) {
    viewButtons.forEach(button => {
      button.addEventListener('click', () => {
        const view = button.getAttribute('data-view');
        state.view = view;
        
        // Update active button
        viewButtons.forEach(btn => {
          if (btn.getAttribute('data-view') === view) {
            btn.classList.add('active');
          } else {
            btn.classList.remove('active');
          }
        });
        
        updateSearchResults();
      });
    });
  }
}

function updateSearchResults() {
  const resultsContainer = document.getElementById('search-results');
  if (!resultsContainer) return;
  
  const query = state.searchQuery.trim();
  
  // If the query is empty, show the empty search state
  if (!query) {
    resultsContainer.innerHTML = renderEmptySearchState();
    return;
  }
  
  // Filter clients based on the query
  const filteredClients = state.clients.filter(client => 
    client.name.toLowerCase().includes(query) ||
    client.email.toLowerCase().includes(query) ||
    (client.phone && client.phone.includes(query)) ||
    (client.address && client.address.toLowerCase().includes(query))
  );
  
  // If no results found, show empty results state
  if (filteredClients.length === 0) {
    resultsContainer.innerHTML = renderEmptyResultsState(query);
    setupAddClientButton();
    return;
  }
  
  // Show results based on the current view (grid or table)
  if (state.view === 'grid') {
    resultsContainer.innerHTML = `
      <p class="mb-4 text-muted">${filteredClients.length} ${filteredClients.length === 1 ? 'resultado' : 'resultados'} encontrados para "${query}"</p>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        ${filteredClients.map(client => renderClientCard(client)).join('')}
      </div>
    `;
  } else {
    resultsContainer.innerHTML = `
      <p class="mb-4 text-muted">${filteredClients.length} ${filteredClients.length === 1 ? 'resultado' : 'resultados'} encontrados para "${query}"</p>
      ${renderClientTable(filteredClients)}
    `;
  }
  
  // Setup client action buttons
  setupClientActions();
}

// Client action buttons functionality
function setupClientActions() {
  // View client buttons
  document.querySelectorAll('.view-client-btn').forEach(button => {
    button.addEventListener('click', () => {
      const clientId = button.getAttribute('data-id');
      viewClient(clientId);
    });
  });
  
  // Edit client buttons
  document.querySelectorAll('.edit-client-btn').forEach(button => {
    button.addEventListener('click', () => {
      const clientId = button.getAttribute('data-id');
      editClient(clientId);
    });
  });
  
  // Delete client buttons
  document.querySelectorAll('.delete-client-btn').forEach(button => {
    button.addEventListener('click', () => {
      const clientId = button.getAttribute('data-id');
      deleteClient(clientId);
    });
  });
}

// Client actions
function viewClient(clientId) {
  const client = state.clients.find(c => c.id === clientId);
  if (!client) return;
  
  showModal({
    title: 'Detalhes do Cliente',
    content: `
      <div class="space-y-4">
        <div>
          <h3 class="text-lg font-medium mb-2">Informações Básicas</h3>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <p class="text-xs text-muted">Nome</p>
              <p>${client.name}</p>
            </div>
            <div>
              <p class="text-xs text-muted">Email</p>
              <p>${client.email}</p>
            </div>
            <div>
              <p class="text-xs text-muted">Telefone</p>
              <p>${client.phone || '—'}</p>
            </div>
            <div>
              <p class="text-xs text-muted">Data de Nascimento</p>
              <p>${formatDate(client.birthDate)}</p>
            </div>
          </div>
        </div>
        
        <div>
          <h3 class="text-lg font-medium mb-2">Endereço</h3>
          <p>${client.address || '—'}</p>
        </div>
        
        <div>
          <h3 class="text-lg font-medium mb-2">Status</h3>
          <span class="badge ${client.status === 'active' ? 'badge-default' : 'badge-outline'}">
            ${client.status === 'active' ? 'Ativo' : 'Inativo'}
          </span>
        </div>
      </div>
    `,
    footer: `
      <button class="btn btn-outline" data-action="close-modal">Fechar</button>
      <button class="btn btn-primary edit-client-btn" data-id="${client.id}">Editar</button>
    `
  });
  
  // Setup edit button in modal
  document.querySelector('.modal .edit-client-btn').addEventListener('click', () => {
    closeModal();
    editClient(clientId);
  });
}

function editClient(clientId) {
  const client = state.clients.find(c => c.id === clientId);
  if (!client) return;
  
  showModal({
    title: 'Editar Cliente',
    content: `
      <form id="edit-client-form" class="space-y-4">
        <div class="form-group">
          <label for="name" class="form-label">Nome</label>
          <input type="text" id="name" class="form-input" value="${client.name}" required>
        </div>
        
        <div class="form-group">
          <label for="email" class="form-label">Email</label>
          <input type="email" id="email" class="form-input" value="${client.email}" required>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="form-group">
            <label for="phone" class="form-label">Telefone</label>
            <input type="text" id="phone" class="form-input" value="${client.phone || ''}">
          </div>
          
          <div class="form-group">
            <label for="birthDate" class="form-label">Data de Nascimento</label>
            <input type="date" id="birthDate" class="form-input" value="${client.birthDate || ''}">
          </div>
        </div>
        
        <div class="form-group">
          <label for="address" class="form-label">Endereço</label>
          <input type="text" id="address" class="form-input" value="${client.address || ''}">
        </div>
        
        <div class="form-group">
          <label class="form-label">Status</label>
          <div class="flex space-x-4">
            <label class="flex items-center space-x-2">
              <input type="radio" name="status" value="active" ${client.status === 'active' ? 'checked' : ''}>
              <span>Ativo</span>
            </label>
            <label class="flex items-center space-x-2">
              <input type="radio" name="status" value="inactive" ${client.status === 'inactive' ? 'checked' : ''}>
              <span>Inativo</span>
            </label>
          </div>
        </div>
      </form>
    `,
    footer: `
      <button class="btn btn-outline" data-action="close-modal">Cancelar</button>
      <button class="btn btn-primary" id="save-client-btn">Salvar</button>
    `
  });
  
  // Setup save button
  document.getElementById('save-client-btn').addEventListener('click', () => {
    const form = document.getElementById('edit-client-form');
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const birthDate = document.getElementById('birthDate').value;
    const address = document.getElementById('address').value;
    const status = document.querySelector('input[name="status"]:checked').value;
    
    // Simple validation
    if (!name || !email) {
      showToast('Erro de validação', 'Preencha todos os campos obrigatórios.', 'destructive');
      return;
    }
    
    // Update client in state
    const updatedClient = {
      ...client,
      name,
      email,
      phone,
      birthDate,
      address,
      status
    };
    
    const index = state.clients.findIndex(c => c.id === clientId);
    if (index !== -1) {
      state.clients[index] = updatedClient;
    }
    
    closeModal();
    showToast('Cliente atualizado', `O cliente ${name} foi atualizado com sucesso.`);
    updateSearchResults();
  });
}

function deleteClient(clientId) {
  const client = state.clients.find(c => c.id === clientId);
  if (!client) return;
  
  showModal({
    title: 'Confirmar Exclusão',
    content: `
      <p>Tem certeza que deseja excluir o cliente "${client.name}"?</p>
      <p class="text-sm text-muted mt-2">Esta ação não pode ser desfeita.</p>
    `,
    footer: `
      <button class="btn btn-outline" data-action="close-modal">Cancelar</button>
      <button class="btn btn-destructive" id="confirm-delete-btn">Excluir</button>
    `
  });
  
  // Setup confirm delete button
  document.getElementById('confirm-delete-btn').addEventListener('click', () => {
    // Remove client from state
    state.clients = state.clients.filter(c => c.id !== clientId);
    
    closeModal();
    showToast('Cliente excluído', `O cliente ${client.name} foi excluído com sucesso.`);
    updateSearchResults();
  });
}

// Authentication forms setup
function setupLoginForm() {
  const form = document.getElementById('login-form');
  if (!form) return;
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // Simple validation
    if (!email || !password) {
      showToast('Erro de validação', 'Preencha todos os campos.', 'destructive');
      return;
    }
    
    // Mock authentication
    if (email === 'admin@exemplo.com' && password === 'admin123') {
      localStorage.setItem('isAuthenticated', 'true');
      state.isAuthenticated = true;
      showToast('Login bem-sucedido', 'Bem-vindo de volta!');
      window.location.href = '#modules';
    } else {
      showToast('Erro de autenticação', 'Email ou senha inválidos.', 'destructive');
    }
  });
}

function setupRegisterForm() {
  const form = document.getElementById('register-form');
  if (!form) return;
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    
    // Simple validation
    if (!name || !email || !password || !confirmPassword) {
      showToast('Erro de validação', 'Preencha todos os campos.', 'destructive');
      return;
    }
    
    if (password !== confirmPassword) {
      showToast('Erro de validação', 'As senhas não coincidem.', 'destructive');
      return;
    }
    
    // Mock registration
    showToast('Registro bem-sucedido', 'Sua conta foi criada com sucesso.');
    window.location.href = '#login';
  });
}

// UI Components
function renderClientCard(client) {
  return `
    <div class="client-card">
      <div class="client-card-header">
        <div class="client-card-header-content">
          <div>
            <h3 class="client-card-title">${client.name}</h3>
            <p class="client-card-email">${client.email}</p>
          </div>
          <span class="badge ${client.status === 'active' ? 'badge-default' : 'badge-outline'}">
            ${client.status === 'active' ? 'Ativo' : 'Inativo'}
          </span>
        </div>
      </div>
      
      <div class="client-card-content">
        <div class="client-card-details">
          <div class="client-card-grid">
            <div>
              <p class="client-detail-label">Telefone</p>
              <p class="client-detail-value">${client.phone || '—'}</p>
            </div>
            <div>
              <p class="client-detail-label">Data de Nascimento</p>
              <p class="client-detail-value">${formatDate(client.birthDate)}</p>
            </div>
          </div>
          
          <div class="mt-2">
            <p class="client-detail-label">Endereço</p>
            <p class="client-detail-value truncate">${client.address || '—'}</p>
          </div>
        </div>
        
        <div class="client-card-actions">
          <button class="btn btn-ghost btn-icon view-client-btn" data-id="${client.id}">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
          </button>
          <button class="btn btn-ghost btn-icon edit-client-btn" data-id="${client.id}">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
          </button>
          <button class="btn btn-ghost btn-icon text-destructive delete-client-btn" data-id="${client.id}">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
          </button>
        </div>
      </div>
    </div>
  `;
}

function renderClientTable(clients) {
  return `
    <div class="table-container">
      <table class="table">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Email</th>
            <th>Telefone</th>
            <th>Data de Nascimento</th>
            <th>Status</th>
            <th class="text-right">Ações</th>
          </tr>
        </thead>
        <tbody>
          ${clients.map(client => `
            <tr>
              <td class="font-medium">${client.name}</td>
              <td>${client.email}</td>
              <td>${client.phone || '—'}</td>
              <td>${formatDate(client.birthDate)}</td>
              <td>
                <span class="badge ${client.status === 'active' ? 'badge-default' : 'badge-outline'}">
                  ${client.status === 'active' ? 'Ativo' : 'Inativo'}
                </span>
              </td>
              <td class="text-right">
                <div class="flex justify-end gap-1">
                  <button class="btn btn-ghost btn-sm view-client-btn" data-id="${client.id}">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                  </button>
                  <button class="btn btn-ghost btn-sm edit-client-btn" data-id="${client.id}">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                  </button>
                  <button class="btn btn-ghost btn-sm text-destructive delete-client-btn" data-id="${client.id}">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                  </button>
                </div>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function renderEmptySearchState() {
  return `
    <div class="empty-state">
      <div class="empty-state-icon">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
      </div>
      <h3 class="empty-state-title">Pesquise por clientes</h3>
      <p class="empty-state-description">Digite um termo de busca e pressione Enter ou clique em Buscar para encontrar clientes.</p>
    </div>
  `;
}

function renderEmptyResultsState(query) {
  return `
    <div class="empty-state">
      <div class="empty-state-icon">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
      </div>
      <h3 class="empty-state-title">Nenhum resultado encontrado</h3>
      <p class="empty-state-description">Não encontramos clientes correspondentes à sua busca por "${query}".</p>
      <button class="btn btn-primary mt-4" id="add-client-btn">
        Adicionar Cliente
      </button>
    </div>
  `;
}

// Login page
function renderLoginPage() {
  return `
    <div class="auth-container">
      <div class="card auth-card">
        <div class="card-header">
          <h2 class="card-title">Login</h2>
          <p class="card-description">Entre com suas credenciais para acessar o sistema</p>
        </div>
        
        <div class="card-content">
          <form id="login-form" class="space-y-4">
            <div class="form-group">
              <div class="form-input-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                <input type="email" id="email" class="form-input" placeholder="Email" required>
              </div>
            </div>
            
            <div class="form-group">
              <div class="form-input-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                <input type="password" id="password" class="form-input" placeholder="Senha" required>
              </div>
            </div>
            
            <button type="submit" class="btn btn-primary w-full">Entrar</button>
          </form>
        </div>
        
        <div class="card-footer justify-center">
          <p class="text-sm text-center">
            Não tem uma conta? 
            <a href="#register" class="text-primary hover:underline">Registre-se</a>
          </p>
        </div>
      </div>
    </div>
  `;
}

// Register page
function renderRegisterPage() {
  return `
    <div class="auth-container">
      <div class="card auth-card">
        <div class="card-header">
          <h2 class="card-title">Criar Conta</h2>
          <p class="card-description">Preencha os dados abaixo para criar sua conta</p>
        </div>
        
        <div class="card-content">
          <form id="register-form" class="space-y-4">
            <div class="form-group">
              <div class="form-input-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                <input type="text" id="name" class="form-input" placeholder="Nome completo" required>
              </div>
            </div>
            
            <div class="form-group">
              <div class="form-input-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                <input type="email" id="email" class="form-input" placeholder="Email" required>
              </div>
            </div>
            
            <div class="form-group">
              <div class="form-input-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                <input type="password" id="password" class="form-input" placeholder="Senha" required>
              </div>
            </div>
            
            <div class="form-group">
              <div class="form-input-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                <input type="password" id="confirm-password" class="form-input" placeholder="Confirmar senha" required>
              </div>
            </div>
            
            <button type="submit" class="btn btn-primary w-full">Registrar</button>
          </form>
        </div>
        
        <div class="card-footer justify-center">
          <p class="text-sm text-center">
            Já tem uma conta? 
            <a href="#login" class="text-primary hover:underline">Faça login</a>
          </p>
        </div>
      </div>
    </div>
  `;
}

// Modal functionality
function showModal({ title, content, footer }) {
  const modalContainer = document.getElementById('modal-container');
  if (!modalContainer) return;
  
  modalContainer.innerHTML = `
    <div class="modal">
      <div class="modal-header">
        <h3 class="modal-title">${title}</h3>
      </div>
      <div class="modal-body">
        ${content}
      </div>
      <div class="modal-footer">
        ${footer}
      </div>
    </div>
  `;
  
  modalContainer.classList.add('active');
  
  // Setup close modal buttons
  document.querySelectorAll('[data-action="close-modal"]').forEach(button => {
    button.addEventListener('click', closeModal);
  });
  
  // Close on click outside
  modalContainer.addEventListener('click', (e) => {
    if (e.target === modalContainer) {
      closeModal();
    }
  });
}

function closeModal() {
  const modalContainer = document.getElementById('modal-container');
  if (!modalContainer) return;
  
  modalContainer.classList.remove('active');
  modalContainer.innerHTML = '';
}

// Toast notifications
function showToast(title, message, variant = 'default') {
  const toastContainer = document.getElementById('toast-container');
  if (!toastContainer) return;
  
  const toastId = Date.now();
  const toast = document.createElement('div');
  toast.className = `toast ${variant === 'destructive' ? 'toast-destructive' : ''}`;
  toast.innerHTML = `
    <div class="toast-content">
      <div class="toast-title">${title}</div>
      ${message ? `<div class="toast-description">${message}</div>` : ''}
    </div>
    <button class="toast-close" aria-label="Close">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
    </button>
  `;
  
  toastContainer.appendChild(toast);
  
  // Setup close button
  const closeBtn = toast.querySelector('.toast-close');
  closeBtn.addEventListener('click', () => {
    toast.remove();
  });
  
  // Auto remove after 5 seconds
  setTimeout(() => {
    toast.remove();
  }, 5000);
}

// Helper functions
function formatDate(dateString) {
  if (!dateString) return '—';
  
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('pt-BR').format(date);
}

// Page content renders
function renderModulesPage() {
  return `
    <div class="page-title">
      <div class="page-title-text">
        <h1>Consultas</h1>
        <p>Pesquise por clientes em toda a sua base de dados</p>
      </div>
      
      <div class="page-actions">
        <div class="flex items-center bg-secondary rounded-md p-1">
          <button class="btn btn-sm ${state.view === 'grid' ? 'btn-secondary' : 'btn-ghost'} view-button" data-view="grid">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
          </button>
          <button class="btn btn-sm ${state.view === 'table' ? 'btn-secondary' : 'btn-ghost'} view-button" data-view="table">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4"><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
          </button>
        </div>
      </div>
    </div>
    
    <div class="max-w-2xl mx-auto mb-6">
      <div class="search-bar">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        <input 
          type="search" 
          id="search-input"
          class="form-input search-input" 
          placeholder="Buscar por nome, email, telefone ou endereço..."
        >
      </div>
    </div>
    
    <div id="search-results">
      ${state.searchQuery ? renderEmptyResultsState(state.searchQuery) : renderEmptySearchState()}
    </div>
  `;
}

