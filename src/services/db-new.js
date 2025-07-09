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

// API base URL
const API_BASE = 'http://localhost:3001';

// ===== PRODUCTS =====
export async function readProducts() {
  if (typeof window !== 'undefined') {
    // Client-side: JSON dosyasını fetch ile oku
    try {
      const response = await fetch('/db/products.json');
      if (response.ok) {
        const data = await response.json();
        return data.products || [];
      } else {
        return defaultData.products;
      }
    } catch {
      return defaultData.products;
    }
  }
  
  // Server-side: API'den veri çek
  try {
    const response = await fetch(`${API_BASE}/api/products`);
    if (response.ok) {
      const products = await response.json();
      return products || [];
    } else {
      return defaultData.products;
    }
  } catch {
    return defaultData.products;
  }
}

export async function writeProducts(products, brands = null) {
  if (typeof window !== 'undefined') return;
  
  // API'ye gönder
  const response = await fetch(`${API_BASE}/api/products/bulk`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ products, brands })
  });
  
  if (!response.ok) {
    throw new Error('API yazma hatası');
  }
  
  return await response.json();
}

export async function addProduct(product) {
  const response = await fetch(`${API_BASE}/api/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product)
  });
  
  if (!response.ok) {
    throw new Error('Ürün eklenemedi');
  }
  
  return await response.json();
}

export async function deleteProduct(id) {
  const response = await fetch(`${API_BASE}/api/products/${id}`, {
    method: 'DELETE'
  });
  
  if (!response.ok) {
    throw new Error('Ürün silinemedi');
  }
  
  return await response.json();
}

export async function updateProduct(id, updates) {
  const response = await fetch(`${API_BASE}/api/products/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates)
  });
  
  if (!response.ok) {
    throw new Error('Ürün güncellenemedi');
  }
  
  return await response.json();
}

// ===== BRANDS =====
export async function readBrands() {
  if (typeof window !== 'undefined') {
    // Client-side: JSON dosyasını fetch ile oku
    try {
      const response = await fetch('/db/products.json');
      if (response.ok) {
        const data = await response.json();
        return data.brands || [];
      } else {
        return defaultData.brands;
      }
    } catch {
      return defaultData.brands;
    }
  }
  
  // Server-side: API'den veri çek
  try {
    const response = await fetch(`${API_BASE}/api/brands`);
    if (response.ok) {
      const brands = await response.json();
      return brands || [];
    } else {
      return defaultData.brands;
    }
  } catch {
    return defaultData.brands;
  }
}

export async function writeBrands(brands) {
  if (typeof window !== 'undefined') return;
  
  // API'ye gönder
  const response = await fetch(`${API_BASE}/api/brands/bulk`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ brands })
  });
  
  if (!response.ok) {
    throw new Error('Brands yazma hatası');
  }
  
  return await response.json();
}

export async function addBrand(brand) {
  const response = await fetch(`${API_BASE}/api/brands`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(brand)
  });
  
  if (!response.ok) {
    throw new Error('Marka eklenemedi');
  }
  
  return await response.json();
}

export async function deleteBrand(id) {
  const response = await fetch(`${API_BASE}/api/brands/${id}`, {
    method: 'DELETE'
  });
  
  if (!response.ok) {
    throw new Error('Marka silinemedi');
  }
  
  return await response.json();
}

export async function updateBrand(id, updates) {
  const response = await fetch(`${API_BASE}/api/brands/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates)
  });
  
  if (!response.ok) {
    throw new Error('Marka güncellenemedi');
  }
  
  return await response.json();
}

// ===== CATEGORIES =====
export async function readCategories() {
  if (typeof window !== 'undefined') {
    // Client-side: JSON dosyasını fetch ile oku
    try {
      const response = await fetch('/db/products.json');
      if (response.ok) {
        const data = await response.json();
        return data.categories || [];
      } else {
        return defaultData.categories;
      }
    } catch {
      return defaultData.categories;
    }
  }
  
  // Server-side: API'den veri çek
  try {
    const response = await fetch(`${API_BASE}/api/categories`);
    if (response.ok) {
      const categories = await response.json();
      return categories || [];
    } else {
      return defaultData.categories;
    }
  } catch {
    return defaultData.categories;
  }
}

export async function writeCategories(categories) {
  if (typeof window !== 'undefined') return;
  
  // API'ye gönder
  const response = await fetch(`${API_BASE}/api/categories/bulk`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ categories })
  });
  
  if (!response.ok) {
    throw new Error('Categories yazma hatası');
  }
  
  return await response.json();
}

export async function addCategory(category) {
  const response = await fetch(`${API_BASE}/api/categories`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(category)
  });
  
  if (!response.ok) {
    throw new Error('Kategori eklenemedi');
  }
  
  return await response.json();
}

export async function deleteCategory(id) {
  const response = await fetch(`${API_BASE}/api/categories/${id}`, {
    method: 'DELETE'
  });
  
  if (!response.ok) {
    throw new Error('Kategori silinemedi');
  }
  
  return await response.json();
}

export async function updateCategory(id, updates) {
  const response = await fetch(`${API_BASE}/api/categories/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates)
  });
  
  if (!response.ok) {
    throw new Error('Kategori güncellenemedi');
  }
  
  return await response.json();
}

// ===== CONFIG =====
export async function readConfig() {
  if (typeof window !== 'undefined') {
    // Client-side: JSON dosyasını fetch ile oku
    try {
      const response = await fetch('/db/products.json');
      if (response.ok) {
        const data = await response.json();
        return data.config || { panelPassword: 'admin123' };
      } else {
        return { panelPassword: 'admin123' };
      }
    } catch {
      return { panelPassword: 'admin123' };
    }
  }
  
  // Server-side: API'den config çek (şifre dahil)
  try {
    const response = await fetch(`${API_BASE}/api/config`);
    if (response.ok) {
      const config = await response.json();
      return config || { panelPassword: 'admin123' };
    } else {
      return { panelPassword: 'admin123' };
    }
  } catch {
    return { panelPassword: 'admin123' };
  }
}

// ===== CONTACTS =====
export async function readContacts() {
  if (typeof window !== 'undefined') {
    // Client-side: JSON dosyasını fetch ile oku
    try {
      const response = await fetch('/db/products.json');
      if (response.ok) {
        const data = await response.json();
        return data.contacts || [];
      } else {
        return [];
      }
    } catch {
      return [];
    }
  }
  
  // Server-side: API'den contacts çek
  try {
    const response = await fetch(`${API_BASE}/api/contacts`);
    if (response.ok) {
      const contacts = await response.json();
      return contacts || [];
    } else {
      return [];
    }
  } catch {
    return [];
  }
}

export async function writeContact(contactData) {
  if (typeof window !== 'undefined') return { success: false, error: 'Client-side yazma desteklenmiyor' };
  
  // API'ye gönder
  try {
    const response = await fetch(`${API_BASE}/api/contacts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(contactData)
    });
    
    if (!response.ok) {
      throw new Error('Contact yazma hatası');
    }
    
    const result = await response.json();
    return { success: true, contact: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function deleteContact(contactId) {
  if (typeof window !== 'undefined') return { success: false, error: 'Client-side yazma desteklenmiyor' };
  
  try {
    const response = await fetch(`${API_BASE}/api/contacts/${contactId}`, {
      method: 'DELETE'
    });
    
    if (!response.ok) {
      throw new Error('Contact silme hatası');
    }
    
    return { success: true, message: 'Mesaj başarıyla silindi' };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function updateContactStatus(contactId, status) {
  if (typeof window !== 'undefined') return { success: false, error: 'Client-side yazma desteklenmiyor' };
  
  try {
    const response = await fetch(`${API_BASE}/api/contacts/${contactId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    
    if (!response.ok) {
      throw new Error('Contact durum güncelleme hatası');
    }
    
    const contact = await response.json();
    return { success: true, contact: contact };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
