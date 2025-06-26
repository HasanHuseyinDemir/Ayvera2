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

async function getDbPath() {
  const path = await import('node:path');
  const fs = await import('node:fs');
  const dbDir = path.join(process.cwd(), 'db');
  const dbPath = path.join(dbDir, 'products.json');
  
  // db klasörünü oluştur
  try {
    await fs.promises.mkdir(dbDir, { recursive: true });
  } catch {
    // Klasör zaten varsa hata yok
  }
  
  return dbPath;
}

export async function readProducts() {
  if (typeof window !== 'undefined') {
    // Client-side: JSON dosyasını fetch ile oku
    try {
      console.log('🔍 Client-side: JSON dosyasını okuyorum...');
      const response = await fetch('/db/products.json');
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Client-side: JSON\'dan products alındı:', data.products?.length || 0);
        return data.products || [];
      } else {
        console.error('❌ JSON dosyası okunamadı:', response.status);
        return defaultData.products;
      }
    } catch (error) {
      console.error('❌ Client-side JSON okuma hatası:', error);
      return defaultData.products;
    }
  }
  
  // Server-side: Node.js ile dosya oku
  const fs = await import('node:fs');
  const dbPath = await getDbPath();
  try {
    await fs.promises.access(dbPath);
    const data = await fs.promises.readFile(dbPath, 'utf-8');
    
    // Boş dosya kontrolü
    if (!data.trim()) {
      console.log('DB: Dosya boş, yeniden oluşturuluyor...');
      await fs.promises.writeFile(dbPath, JSON.stringify(defaultData, null, 2));
      return [];
    }
    
    // JSON parse ile güvenli okuma
    const parsed = JSON.parse(data);
    return parsed.products || [];
  } catch (error) {
    console.log('DB: Dosya okuma hatası, yeniden oluşturuluyor...', error.message);
    // Dosya yoksa veya bozuksa oluştur
    await fs.promises.writeFile(dbPath, JSON.stringify(defaultData, null, 2));
    return [];
  }
}

export async function writeProducts(products, brands = null) {
  if (typeof window !== 'undefined') return;
  const fs = await import('node:fs');
  const dbPath = await getDbPath();
  const tempPath = dbPath + '.tmp';
  
  // Eğer brands verilmemişse mevcut brands'i oku
  if (brands === null) {
    try {
      const currentData = await fs.promises.readFile(dbPath, 'utf-8');
      const parsed = JSON.parse(currentData);
      brands = parsed.brands || [];
    } catch {
      brands = [];
    }
  }
  
  try {
    const data = { products, brands };
    const jsonString = JSON.stringify(data, null, 2);
    
    // Önce geçici dosyaya yaz
    await fs.promises.writeFile(tempPath, jsonString, 'utf-8');
    
    // Sonra atomik olarak taşı
    await fs.promises.rename(tempPath, dbPath);
    console.log('DB: Dosya başarıyla yazıldı');
  } catch (error) {
    console.error('DB: Yazma hatası:', error);
    // Geçici dosyayı temizle
    try {
      await fs.promises.unlink(tempPath);
    } catch {
      // Temizleme hatası önemli değil
    }
    throw error;
  }
}

export async function addProduct(product) {
  const products = await readProducts();
  const maxId = products.length > 0 ? Math.max(...products.map(p => Number(p.id) || 0)) : 0;
  product.id = maxId + 1;
  products.push(product);
  await writeProducts(products);
  return product;
}

export async function deleteProduct(id) {
  const products = await readProducts();
  const filtered = products.filter(p => String(p.id) !== String(id));
  await writeProducts(filtered);
  return filtered;
}

export async function updateProduct(id, updates) {
  const products = await readProducts();
  const idx = products.findIndex(p => String(p.id) === String(id));
  if (idx === -1) return null;
  products[idx] = { ...products[idx], ...updates };
  await writeProducts(products);
  return products[idx];
}

// Brands CRUD Operations
export async function readBrands() {
  if (typeof window !== 'undefined') {
    // Client-side: JSON dosyasını fetch ile oku
    try {
      console.log('🔍 Client-side: Brands için JSON dosyasını okuyorum...');
      const response = await fetch('/db/products.json');
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Client-side: JSON\'dan brands alındı:', data.brands?.length || 0);
        return data.brands || [];
      } else {
        console.error('❌ Brands JSON dosyası okunamadı:', response.status);
        return defaultData.brands;
      }
    } catch (error) {
      console.error('❌ Client-side Brands JSON okuma hatası:', error);
      return defaultData.brands;
    }
  }
  
  // Server-side: Node.js ile dosya oku
  const fs = await import('node:fs');
  const dbPath = await getDbPath();
  try {
    await fs.promises.access(dbPath);
    const data = await fs.promises.readFile(dbPath, 'utf-8');
    
    if (!data.trim()) {
      console.log('DB: Dosya boş, yeniden oluşturuluyor...');
      await fs.promises.writeFile(dbPath, JSON.stringify(defaultData, null, 2));
      return [];
    }
    
    const parsed = JSON.parse(data);
    return parsed.brands || [];
  } catch (error) {
    console.log('DB: Brands okuma hatası, yeniden oluşturuluyor...', error.message);
    await fs.promises.writeFile(dbPath, JSON.stringify(defaultData, null, 2));
    return [];
  }
}

export async function writeBrands(brands) {
  if (typeof window !== 'undefined') return;
  
  // Mevcut ürünleri oku
  const products = await readProducts();
  
  // Hem products hem brands'i birlikte yaz
  const fs = await import('node:fs');
  const dbPath = await getDbPath();
  const tempPath = dbPath + '.tmp';
  
  try {
    const data = { products, brands };
    const jsonString = JSON.stringify(data, null, 2);
    
    await fs.promises.writeFile(tempPath, jsonString, 'utf-8');
    await fs.promises.rename(tempPath, dbPath);
    console.log('DB: Brands başarıyla yazıldı');
  } catch (error) {
    console.error('DB: Brands yazma hatası:', error);
    try {
      await fs.promises.unlink(tempPath);
    } catch {
      throw error;
    }
  }
}

export async function addBrand(brand) {
  const brands = await readBrands();
  const maxId = brands.length > 0 ? Math.max(...brands.map(b => Number(b.id) || 0)) : 0;
  brand.id = maxId + 1;
  brands.push(brand);
  await writeBrands(brands);
  return brand;
}

export async function deleteBrand(id) {
  const brands = await readBrands();
  const filtered = brands.filter(b => String(b.id) !== String(id));
  await writeBrands(filtered);
  return filtered;
}

export async function updateBrand(id, updates) {
  const brands = await readBrands();
  const idx = brands.findIndex(b => String(b.id) === String(id));
  if (idx === -1) return null;
  brands[idx] = { ...brands[idx], ...updates };
  await writeBrands(brands);
  return brands[idx];
}

// === KATEGORİ FONKSİYONLARI ===

export async function readCategories() {
  if (typeof window !== 'undefined') {
    // Client-side: JSON dosyasını fetch ile oku
    try {
      console.log('🔍 Client-side: Kategorileri okuyorum...');
      const response = await fetch('/db/products.json');
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Client-side: JSON\'dan categories alındı:', data.categories?.length || 0);
        return data.categories || [];
      } else {
        console.error('❌ JSON dosyası okunamadı:', response.status);
        return defaultData.categories;
      }
    } catch (error) {
      console.error('❌ Client-side kategori okuma hatası:', error);
      return defaultData.categories;
    }
  }
  
  // Server-side: Node.js ile dosya oku
  const fs = await import('node:fs');
  const dbPath = await getDbPath();
  try {
    await fs.promises.access(dbPath);
    const data = await fs.promises.readFile(dbPath, 'utf-8');
    
    if (!data.trim()) {
      console.log('DB: Dosya boş, yeniden oluşturuluyor...');
      await fs.promises.writeFile(dbPath, JSON.stringify(defaultData, null, 2));
      return [];
    }
    
    const parsed = JSON.parse(data);
    return parsed.categories || [];
  } catch (error) {
    console.log('DB: Dosya bulunamadı, yeni dosya oluşturuluyor...');
    await fs.promises.writeFile(dbPath, JSON.stringify(defaultData, null, 2));
    return [];
  }
}

export async function writeCategories(categories) {
  if (typeof window !== 'undefined') return;
  
  // Mevcut products ve brands'i oku
  const products = await readProducts();
  const brands = await readBrands();
  
  // Hem products, brands hem de categories'i birlikte yaz
  const fs = await import('node:fs');
  const dbPath = await getDbPath();
  const tempPath = dbPath + '.tmp';
  
  try {
    const data = { products, brands, categories };
    const jsonString = JSON.stringify(data, null, 2);
    await fs.promises.writeFile(tempPath, jsonString, 'utf-8');
    await fs.promises.rename(tempPath, dbPath);
    console.log('DB: Categories başarıyla yazıldı');
  } catch (error) {
    console.error('DB: Categories yazma hatası:', error);
    try {
      await fs.promises.unlink(tempPath);
    } catch {}
    throw error;
  }
}

export async function addCategory(category) {
  const categories = await readCategories();
  const maxId = categories.length > 0 ? Math.max(...categories.map(c => Number(c.id) || 0)) : 0;
  category.id = maxId + 1;
  categories.push(category);
  await writeCategories(categories);
  return category;
}

export async function deleteCategory(id) {
  const categories = await readCategories();
  const filtered = categories.filter(c => String(c.id) !== String(id));
  await writeCategories(filtered);
  return filtered;
}

export async function updateCategory(id, updates) {
  const categories = await readCategories();
  const idx = categories.findIndex(c => String(c.id) === String(id));
  if (idx === -1) return null;
  categories[idx] = { ...categories[idx], ...updates };
  await writeCategories(categories);
  return categories[idx];
}

// Config Operations
export async function readConfig() {
  if (typeof window !== 'undefined') {
    // Client-side: JSON dosyasını fetch ile oku
    try {
      console.log('🔍 Client-side: Config verilerini okuyorum...');
      const response = await fetch('/db/products.json');
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Client-side: Config alındı');
        return data.config || { panelPassword: 'admin123' };
      } else {
        console.error('❌ Config JSON dosyası okunamadı:', response.status);
        return { panelPassword: 'admin123' };
      }
    } catch (error) {
      console.error('❌ Client-side Config okuma hatası:', error);
      return { panelPassword: 'admin123' };
    }
  }
  
  // Server-side: Node.js ile dosya oku
  const fs = await import('node:fs');
  const dbPath = await getDbPath();
  try {
    await fs.promises.access(dbPath);
    const data = await fs.promises.readFile(dbPath, 'utf-8');
    
    if (!data.trim()) {
      console.log('DB: Config - Dosya boş, varsayılan config döndürülüyor...');
      return { panelPassword: 'admin123' };
    }
    
    const parsed = JSON.parse(data);
    return parsed.config || { panelPassword: 'admin123' };
  } catch (error) {
    console.log('DB: Config okuma hatası, varsayılan config döndürülüyor...', error.message);
    return { panelPassword: 'admin123' };
  }
}

// Contact messages CRUD operations
export async function readContacts() {
  if (typeof window !== 'undefined') {
    // Client-side: JSON dosyasını fetch ile oku
    try {
      console.log('🔍 Client-side: Contacts verilerini okuyorum...');
      const response = await fetch('/db/products.json');
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Client-side: Contacts alındı:', data.contacts?.length || 0);
        return data.contacts || [];
      } else {
        console.error('❌ Contacts JSON dosyası okunamadı:', response.status);
        return [];
      }
    } catch (error) {
      console.error('❌ Client-side Contacts okuma hatası:', error);
      return [];
    }
  }
  
  // Server-side: Node.js ile dosya oku
  const fs = await import('node:fs');
  const dbPath = await getDbPath();
  try {
    await fs.promises.access(dbPath);
    const data = await fs.promises.readFile(dbPath, 'utf-8');
    
    if (!data.trim()) {
      console.log('DB: Contacts - Dosya boş, boş array döndürülüyor...');
      return [];
    }
    
    const parsed = JSON.parse(data);
    return parsed.contacts || [];
  } catch (error) {
    console.log('DB: Contacts okuma hatası, boş array döndürülüyor...', error.message);
    return [];
  }
}

export async function writeContact(contactData) {
  if (typeof window !== 'undefined') return { success: false, error: 'Client-side yazma desteklenmiyor' };
  
  const fs = await import('node:fs');
  const dbPath = await getDbPath();
  
  try {
    // Mevcut veriyi oku
    let data = defaultData;
    try {
      const existingData = await fs.promises.readFile(dbPath, 'utf-8');
      if (existingData.trim()) {
        data = JSON.parse(existingData);
      }
    } catch {
      // Dosya yoksa default data kullan
    }
    
    // Contacts array'ini kontrol et
    if (!Array.isArray(data.contacts)) {
      data.contacts = [];
    }
    
    // IP adresi ve timestamp ekle
    const newContact = {
      id: Date.now(),
      ...contactData,
      ip: contactData.ip || 'unknown',
      createdAt: new Date().toISOString(),
      status: 'new'
    };
    
    // Contacts array'ine ekle
    data.contacts.unshift(newContact); // En yenisi başta
    
    // Dosyaya yaz
    await fs.promises.writeFile(dbPath, JSON.stringify(data, null, 2));
    
    console.log('✅ Contact mesajı kaydedildi:', newContact.id);
    return { success: true, contact: newContact };
    
  } catch (error) {
    console.error('❌ Contact yazma hatası:', error);
    return { success: false, error: error.message };
  }
}

export async function deleteContact(contactId) {
  if (typeof window !== 'undefined') return { success: false, error: 'Client-side yazma desteklenmiyor' };
  
  const fs = await import('node:fs');
  const dbPath = await getDbPath();
  
  try {
    // Mevcut veriyi oku
    let data = defaultData;
    try {
      const existingData = await fs.promises.readFile(dbPath, 'utf-8');
      if (existingData.trim()) {
        data = JSON.parse(existingData);
      }
    } catch {
      return { success: false, error: 'Veritabanı okunamadı' };
    }
    
    // Contacts array'ini kontrol et
    if (!Array.isArray(data.contacts)) {
      return { success: false, error: 'Contacts verisi bulunamadı' };
    }
    
    // Mesajı bul ve sil
    const initialLength = data.contacts.length;
    data.contacts = data.contacts.filter(contact => contact.id != contactId);
    
    if (data.contacts.length === initialLength) {
      return { success: false, error: 'Silinecek mesaj bulunamadı' };
    }
    
    // Dosyaya yaz
    await fs.promises.writeFile(dbPath, JSON.stringify(data, null, 2));
    
    console.log('✅ Contact mesajı silindi:', contactId);
    return { success: true, message: 'Mesaj başarıyla silindi' };
    
  } catch (error) {
    console.error('❌ Contact silme hatası:', error);
    return { success: false, error: error.message };
  }
}

export async function updateContactStatus(contactId, status) {
  if (typeof window !== 'undefined') return { success: false, error: 'Client-side yazma desteklenmiyor' };
  
  const fs = await import('node:fs');
  const dbPath = await getDbPath();
  
  try {
    // Mevcut veriyi oku
    let data = defaultData;
    try {
      const existingData = await fs.promises.readFile(dbPath, 'utf-8');
      if (existingData.trim()) {
        data = JSON.parse(existingData);
      }
    } catch {
      return { success: false, error: 'Veritabanı okunamadı' };
    }
    
    // Contacts array'ini kontrol et
    if (!Array.isArray(data.contacts)) {
      return { success: false, error: 'Contacts verisi bulunamadı' };
    }
    
    // Mesajı bul ve durumunu güncelle
    const contact = data.contacts.find(c => c.id == contactId);
    if (!contact) {
      return { success: false, error: 'Güncellenecek mesaj bulunamadı' };
    }
    
    contact.status = status;
    contact.updatedAt = new Date().toISOString();
    
    // Dosyaya yaz
    await fs.promises.writeFile(dbPath, JSON.stringify(data, null, 2));
    
    console.log('✅ Contact durumu güncellendi:', contactId, 'status:', status);
    return { success: true, contact: contact };
    
  } catch (error) {
    console.error('❌ Contact durum güncelleme hatası:', error);
    return { success: false, error: error.message };
  }
}
