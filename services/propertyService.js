// services/propertyService.js
export const usePropertyService = () => {
  const config = useRuntimeConfig();
  const { $axios } = useNuxtApp();
  
  // Fetch properties from API
  const getProperties = async (params = {}) => {
    try {
      const response = await $axios.get('/properties', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching properties:', error);
      return { success: false, data: { properties: [], total: 0 } };
    }
  };
  
  // Nuevo método para obtener propiedades por categoría
  const getPropertiesByCategory = async (category, params = {}) => {
    try {
      const response = await $axios.get(`/properties/categories/${category}`, { params });
      return response.data;
    } catch (error) {
      console.error(`Error fetching properties by category ${category}:`, error);
      return { success: false, data: { properties: [], total: 0 } };
    }
  };
  
  // Nuevo método para obtener propiedades por categoría Y tipo
  const getPropertiesByCategoryAndType = async (category, propertyType, params = {}) => {
    try {
      // Clonar los parámetros básicos
      const queryParams = { ...params };
      
      // Añadir el tipo de propiedad al objeto de parámetros
      if (propertyType) {
        if (Array.isArray(propertyType)) {
          // Si es un array, lo dejamos como está para que Axios lo maneje
          queryParams.property_type = propertyType;
        } else {
          queryParams.property_type = propertyType;
        }
      }
      
      // Usar la ruta de categoría y pasar el tipo de propiedad como parámetro
      const response = await $axios.get(`/properties/categories/${category}`, { params: queryParams });
      return response.data;
    } catch (error) {
      console.error(`Error obteniendo propiedades por categoría ${category} y tipo ${propertyType}:`, error);
      return {
        success: false,
        data: { properties: [], total: 0 },
        error: error.message
      };
    }
  };
  
  // Get all main categories
  const getMainCategories = async () => {
    try {
      const response = await $axios.get('/properties/categories');
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      return { success: false, data: [] };
    }
  };
  
  // Get a single property by ID
  const getProperty = async (id) => {
    try {
      const response = await $axios.get(`/properties/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching property ${id}:`, error);
      return null;
    }
  };
  
  // Create a new property
  const createProperty = async (propertyData) => {
    try {
      const response = await $axios.post('/properties', propertyData);
      return response.data;
    } catch (error) {
      console.error('Error creating property:', error);
      throw error;
    }
  };
  
  // Update a property
  const updateProperty = async (id, propertyData) => {
    try {
      const response = await $axios.put(`/properties/${id}`, propertyData);
      return response.data;
    } catch (error) {
      console.error(`Error updating property ${id}:`, error);
      throw error;
    }
  };
  
  // Delete a property
  const deleteProperty = async (id) => {
    try {
      const response = await $axios.delete(`/properties/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting property ${id}:`, error);
      throw error;
    }
  };
  
  // Get featured properties
  const getFeaturedProperties = async (limit = 6, status = null) => {
    try {
      const params = { limit };
      if (status) params.status = status;
      
      const response = await $axios.get('/properties/featured', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching featured properties:', error);
      return { success: false, data: [] };
    }
  };
  
  // Get recent properties
  const getRecentProperties = async (limit = 6, status = null) => {
    try {
      const params = { limit };
      if (status) params.status = status;
      
      const response = await $axios.get('/properties/recent', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching recent properties:', error);
      return { success: false, data: [] };
    }
  };
  
  // Get popular properties
  const getPopularProperties = async (limit = 6) => {
    try {
      const response = await $axios.get('/properties/popular', { params: { limit } });
      return response.data;
    } catch (error) {
      console.error('Error fetching popular properties:', error);
      return { success: false, data: [] };
    }
  };
  
  // Search properties by query
  const searchProperties = async (query, fields = []) => {
    try {
      const params = { q: query };
      
      // Si se proporcionan campos específicos para buscar
      if (fields && fields.length > 0) {
        params.searchFields = fields.join(',');
      }
      
      const response = await $axios.get('/properties/search', { params });
      return response.data;
    } catch (error) {
      console.error('Error searching properties:', error);
      return { success: false, data: { properties: [], total: 0 } };
    }
  };
  
  // Increment property views
  const incrementPropertyViews = async (id) => {
    try {
      const response = await $axios.post(`/properties/${id}/view`);
      return response.data;
    } catch (error) {
      console.error(`Error incrementing views for property ${id}:`, error);
      return { success: false };
    }
  };
  
  // Get similar properties
  const getSimilarProperties = async (id, limit = 4) => {
    try {
      const response = await $axios.get(`/properties/${id}/similar`, { params: { limit } });
      return response.data;
    } catch (error) {
      console.error(`Error fetching similar properties for ${id}:`, error);
      return { success: false, data: [] };
    }
  };
  
  // Obtener la calificación promedio de una propiedad
const getPropertyRating = async (propertyId) => {
  try {
    console.log(`Solicitando rating para propiedad ${propertyId}`);
    const response = await $axios.get(`/reviews/property/${propertyId}/rating`);
    console.log('Respuesta rating:', response.data);
    
    if (response.data && response.data.success) {
      // Asegurar que se retorne un número
      const rating = response.data.data.averageRating;
      return rating !== null && rating !== undefined ? Number(rating) : 0;
    }
    console.log(`No se encontró rating para propiedad ${propertyId}, retornando 0`);
    return 0;
  } catch (error) {
    console.error(`Error al obtener calificación para propiedad ${propertyId}:`, error);
    return 0;
  }
};

  
  // Obtener todas las reseñas de una propiedad
  const getPropertyReviews = async (propertyId) => {
    try {
      const response = await $axios.get('/reviews', { 
        params: { property_id: propertyId } 
      });
      
      if (response.data && response.data.success) {
        return {
          success: true,
          data: response.data.data.reviews
        };
      }
      return { success: false, data: [] };
    } catch (error) {
      console.error(`Error al obtener reseñas para propiedad ${propertyId}:`, error);
      return { success: false, data: [] };
    }
  };
  
  return {
    getProperties,
    getPropertiesByCategory,
    getPropertiesByCategoryAndType, // Nuevo método añadido
    getMainCategories,
    getProperty,
    createProperty,
    updateProperty,
    deleteProperty,
    getFeaturedProperties,
    getRecentProperties,
    getPopularProperties,
    searchProperties,
    incrementPropertyViews,
    getSimilarProperties,
    getPropertyRating,
    getPropertyReviews
  };
};