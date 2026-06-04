const state = {
  token: localStorage.getItem('vmsToken') || '',
  user: JSON.parse(localStorage.getItem('vmsUser') || 'null'),
  page: 1,
  limit: 10,
  totalPages: 1
};

const els = {
  authSection: document.getElementById('authSection'),
  dashboardSection: document.getElementById('dashboardSection'),
  sessionStatus: document.getElementById('sessionStatus'),
  logoutBtn: document.getElementById('logoutBtn'),
  registerForm: document.getElementById('registerForm'),
  loginForm: document.getElementById('loginForm'),
  vendorForm: document.getElementById('vendorForm'),
  formTitle: document.getElementById('formTitle'),
  resetFormBtn: document.getElementById('resetFormBtn'),
  vendorList: document.getElementById('vendorList'),
  paginationInfo: document.getElementById('paginationInfo'),
  pageInfo: document.getElementById('pageInfo'),
  prevPageBtn: document.getElementById('prevPageBtn'),
  nextPageBtn: document.getElementById('nextPageBtn'),
  searchInput: document.getElementById('searchInput'),
  statusFilter: document.getElementById('statusFilter'),
  cityFilter: document.getElementById('cityFilter'),
  sortBy: document.getElementById('sortBy'),
  sortOrder: document.getElementById('sortOrder'),
  applyFiltersBtn: document.getElementById('applyFiltersBtn'),
  toast: document.getElementById('toast')
};

const showToast = (message) => {
  els.toast.textContent = message;
  els.toast.classList.remove('hidden');
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => els.toast.classList.add('hidden'), 3200);
};

const request = async (path, options = {}) => {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  if (state.token) {
    headers.Authorization = `Bearer ${state.token}`;
  }

  const response = await fetch(path, {
    ...options,
    headers
  });

  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    const details = result.errors?.map((item) => item.message).join(', ');
    throw new Error(details || result.message || 'Request failed');
  }

  return result;
};

const formDataToObject = (form) => {
  return Object.fromEntries(new FormData(form).entries());
};

const saveSession = ({ token, user }) => {
  state.token = token;
  state.user = user;
  localStorage.setItem('vmsToken', token);
  localStorage.setItem('vmsUser', JSON.stringify(user));
};

const clearSession = () => {
  state.token = '';
  state.user = null;
  localStorage.removeItem('vmsToken');
  localStorage.removeItem('vmsUser');
};

const renderSession = () => {
  const loggedIn = Boolean(state.token);
  els.authSection.classList.toggle('hidden', loggedIn);
  els.dashboardSection.classList.toggle('hidden', !loggedIn);
  els.logoutBtn.classList.toggle('hidden', !loggedIn);
  els.sessionStatus.textContent = loggedIn ? `${state.user?.name || 'Admin'} logged in` : 'Not logged in';
};

const buildVendorQuery = () => {
  const params = new URLSearchParams({
    page: String(state.page),
    limit: String(state.limit),
    sortBy: els.sortBy.value,
    sortOrder: els.sortOrder.value
  });

  if (els.searchInput.value.trim()) {
    params.set('search', els.searchInput.value.trim());
  }

  if (els.statusFilter.value) {
    params.set('status', els.statusFilter.value);
  }

  if (els.cityFilter.value.trim()) {
    params.set('city', els.cityFilter.value.trim());
  }

  return params.toString();
};

const loadVendors = async () => {
  try {
    const result = await request(`/api/vendors?${buildVendorQuery()}`);
    const vendors = result.data || [];
    const meta = result.meta || {};

    state.totalPages = meta.totalPages || 1;
    els.paginationInfo.textContent = `${meta.totalRecords || 0} records`;
    els.pageInfo.textContent = `Page ${meta.page || 1} of ${state.totalPages}`;
    els.prevPageBtn.disabled = state.page <= 1;
    els.nextPageBtn.disabled = state.page >= state.totalPages;

    renderVendors(vendors);
  } catch (error) {
    showToast(error.message);
  }
};

const renderVendors = (vendors) => {
  if (vendors.length === 0) {
    els.vendorList.innerHTML = '<p class="empty">No vendors found.</p>';
    return;
  }

  els.vendorList.innerHTML = vendors
    .map(
      (vendor) => `
        <article class="vendor-card">
          <header>
            <div>
              <h3>${vendor.vendorName}</h3>
              <p>${vendor.companyName}</p>
            </div>
            <span class="badge ${vendor.status.toLowerCase()}">${vendor.status}</span>
          </header>
          <div class="meta">
            <span><strong>Contact:</strong> ${vendor.contactPerson}</span>
            <span><strong>Email:</strong> ${vendor.email}</span>
            <span><strong>Phone:</strong> ${vendor.phone}</span>
            <span><strong>GST:</strong> ${vendor.gstNumber}</span>
            <span><strong>City:</strong> ${vendor.city}</span>
            <span><strong>State:</strong> ${vendor.state}</span>
          </div>
          <p>${vendor.address}</p>
          <div class="card-actions">
            <button class="ghost" type="button" data-action="edit" data-id="${vendor.id}">Edit</button>
            <button class="danger" type="button" data-action="delete" data-id="${vendor.id}">Delete</button>
          </div>
        </article>
      `
    )
    .join('');
};

const resetVendorForm = () => {
  els.vendorForm.reset();
  els.vendorForm.elements.id.value = '';
  els.formTitle.textContent = 'Add Vendor';
};

const fillVendorForm = async (id) => {
  try {
    const result = await request(`/api/vendors/${id}`);
    const vendor = result.data;

    Object.entries(vendor).forEach(([key, value]) => {
      if (els.vendorForm.elements[key]) {
        els.vendorForm.elements[key].value = value || '';
      }
    });

    els.formTitle.textContent = 'Update Vendor';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } catch (error) {
    showToast(error.message);
  }
};

els.registerForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  try {
    const payload = {
      ...formDataToObject(els.registerForm),
      role: 'ADMIN'
    };
    const result = await request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload)
    });

    saveSession(result.data);
    renderSession();
    await loadVendors();
    showToast('Registered and logged in');
  } catch (error) {
    showToast(error.message);
  }
});

els.loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  try {
    const result = await request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(formDataToObject(els.loginForm))
    });

    saveSession(result.data);
    renderSession();
    await loadVendors();
    showToast('Logged in successfully');
  } catch (error) {
    showToast(error.message);
  }
});

els.logoutBtn.addEventListener('click', () => {
  clearSession();
  renderSession();
  showToast('Logged out');
});

els.vendorForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const payload = formDataToObject(els.vendorForm);
  const id = payload.id;
  delete payload.id;

  try {
    await request(id ? `/api/vendors/${id}` : '/api/vendors', {
      method: id ? 'PUT' : 'POST',
      body: JSON.stringify(payload)
    });

    resetVendorForm();
    await loadVendors();
    showToast(id ? 'Vendor updated' : 'Vendor added');
  } catch (error) {
    showToast(error.message);
  }
});

els.vendorList.addEventListener('click', async (event) => {
  const button = event.target.closest('button[data-action]');

  if (!button) {
    return;
  }

  const { action, id } = button.dataset;

  if (action === 'edit') {
    await fillVendorForm(id);
    return;
  }

  if (action === 'delete' && window.confirm('Delete this vendor?')) {
    try {
      await request(`/api/vendors/${id}`, { method: 'DELETE' });
      await loadVendors();
      showToast('Vendor deleted');
    } catch (error) {
      showToast(error.message);
    }
  }
});

els.resetFormBtn.addEventListener('click', resetVendorForm);

els.applyFiltersBtn.addEventListener('click', async () => {
  state.page = 1;
  await loadVendors();
});

els.prevPageBtn.addEventListener('click', async () => {
  if (state.page > 1) {
    state.page -= 1;
    await loadVendors();
  }
});

els.nextPageBtn.addEventListener('click', async () => {
  if (state.page < state.totalPages) {
    state.page += 1;
    await loadVendors();
  }
});

renderSession();

if (state.token) {
  loadVendors();
}
