// API Base URL
const API_BASE = 'http://localhost:3001';

const defaultData = { 
  products: [], 
  brands: [], 
  categories: [],
  contacts: [],
  config: {
    panelPassword: 'admin123',
    siteName: 'Ayvera Güvenlik',
    lastUpdated: new Date().toISOString().split('T')[0]
  }
};

// Helper function for API calls
async function apiCall(endpoint, options = {}) {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });
    
    if (!response.ok) {
      throw new Error(`API call failed: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`API call error for ${endpoint}:`, error);
    throw error;
  }
}

// ===== PRODUCTS =====
export async function readProducts() {
  try {
    return await apiCall('/api/products');
  } catch (error) {
    console.error('Products okuma hatası:', error);
    return defaultData.products;
  }
}

export async function writeProducts(products, brands = null) {
  try {
    return await apiCall('/api/products/bulk', {
      method: 'POST',
      body: JSON.stringify({ products, brands })
    });
  } catch (error) {
    console.error('Products yazma hatası:', error);
    throw error;
  }
}

export async function addProduct(product) {
  try {
    return await apiCall('/api/products', {
      method: 'POST',
      body: JSON.stringify(product)
    });
  } catch (error) {
    console.error('Ürün ekleme hatası:', error);
    throw new Error('Ürün eklenemedi');
  }
}

export async function deleteProduct(id) {
  try {
    return await apiCall(`/api/products/${id}`, {
      method: 'DELETE'
    });
  } catch (error) {
    console.error('Ürün silme hatası:', error);
    throw new Error('Ürün silinemedi');
  }
}

export async function updateProduct(id, updates) {
  try {
    return await apiCall(`/api/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
  } catch (error) {
    console.error('Ürün güncelleme hatası:', error);
    throw new Error('Ürün güncellenemedi');
  }
}

// ===== BRANDS =====
export async function readBrands() {
  try {
    return await apiCall('/api/brands');
  } catch (error) {
    console.error('Brands okuma hatası:', error);
    return defaultData.brands;
  }
}

export async function writeBrands(brands) {
  try {
    return await apiCall('/api/brands/bulk', {
      method: 'POST',
      body: JSON.stringify({ brands })
    });
  } catch (error) {
    console.error('Brands yazma hatası:', error);
    throw error;
  }
}

export async function addBrand(brand) {
  try {
    return await apiCall('/api/brands', {
      method: 'POST',
      body: JSON.stringify(brand)
    });
  } catch (error) {
    console.error('Marka ekleme hatası:', error);
    throw new Error('Marka eklenemedi');
  }
}

export async function deleteBrand(id) {
  try {
    return await apiCall(`/api/brands/${id}`, {
      method: 'DELETE'
    });
  } catch (error) {
    console.error('Marka silme hatası:', error);
    throw new Error('Marka silinemedi');
  }
}

export async function updateBrand(id, updates) {
  try {
    return await apiCall(`/api/brands/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
  } catch (error) {
    console.error('Marka güncelleme hatası:', error);
    throw new Error('Marka güncellenemedi');
  }
}

// ===== CATEGORIES =====
export async function readCategories() {
  try {
    return await apiCall('/api/categories');
  } catch (error) {
    console.error('Categories okuma hatası:', error);
    return defaultData.categories;
  }
}

export async function writeCategories(categories) {
  try {
    return await apiCall('/api/categories/bulk', {
      method: 'POST',
      body: JSON.stringify({ categories })
    });
  } catch (error) {
    console.error('Categories yazma hatası:', error);
    throw error;
  }
}

export async function addCategory(category) {
  try {
    return await apiCall('/api/categories', {
      method: 'POST',
      body: JSON.stringify(category)
    });
  } catch (error) {
    console.error('Kategori ekleme hatası:', error);
    throw new Error('Kategori eklenemedi');
  }
}

export async function deleteCategory(id) {
  try {
    return await apiCall(`/api/categories/${id}`, {
      method: 'DELETE'
    });
  } catch (error) {
    console.error('Kategori silme hatası:', error);
    throw new Error('Kategori silinemedi');
  }
}

export async function updateCategory(id, updates) {
  try {
    return await apiCall(`/api/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
  } catch (error) {
    console.error('Kategori güncelleme hatası:', error);
    throw new Error('Kategori güncellenemedi');
  }
}

// ===== CONFIG =====
export async function readConfig() {
  try {
    return await apiCall('/api/config');
  } catch (error) {
    console.error('Config okuma hatası:', error);
    return defaultData.config;
  }
}

export async function writeConfig(config) {
  try {
    return await apiCall('/api/config', {
      method: 'POST',
      body: JSON.stringify(config)
    });
  } catch (error) {
    console.error('Config yazma hatası:', error);
    throw error;
  }
}

// ===== CONTACTS =====
export async function readContacts() {
  try {
    return await apiCall('/api/contacts');
  } catch (error) {
    console.error('Contacts okuma hatası:', error);
    return defaultData.contacts;
  }
}

export async function writeContact(contactData) {
  try {
    // IP adresi ve timestamp ekle
    const newContact = {
      id: Date.now(),
      ...contactData,
      ip: contactData.ip || 'unknown',
      createdAt: new Date().toISOString(),
      status: 'new'
    };
    
    const result = await apiCall('/api/contacts', {
      method: 'POST',
      body: JSON.stringify(newContact)
    });
    
    console.log('✅ Contact mesajı kaydedildi:', newContact.id);
    return { success: true, contact: result };
    
  } catch (error) {
    console.error('❌ Contact yazma hatası:', error);
    return { success: false, error: error.message };
  }
}

export async function deleteContact(contactId) {
  try {
    await apiCall(`/api/contacts/${contactId}`, {
      method: 'DELETE'
    });
    
    console.log('✅ Contact mesajı silindi:', contactId);
    return { success: true, message: 'Mesaj başarıyla silindi' };
    
  } catch (error) {
    console.error('❌ Contact silme hatası:', error);
    return { success: false, error: error.message };
  }
}

export async function updateContactStatus(contactId, status) {
  try {
    const updates = {
      status: status,
      updatedAt: new Date().toISOString()
    };
    
    const contact = await apiCall(`/api/contacts/${contactId}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
    
    console.log('✅ Contact durumu güncellendi:', contactId, 'status:', status);
    return { success: true, contact: contact };
    
  } catch (error) {
    console.error('❌ Contact durum güncelleme hatası:', error);
    return { success: false, error: error.message };
  }
}
