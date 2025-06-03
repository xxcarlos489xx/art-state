// server/api/scopus/search.get.ts
export default defineEventHandler(async (event) => {
    const config  = useRuntimeConfig(); // Accede a variables de entorno
    const query   = getQuery(event); // Obtiene los query params (?query=...&apiKey=...)
  
    // Validación básica
    if (!query.query) {
      throw createError({
        statusCode: 400,
        message: "El parámetro 'query' es requerido.",
      });
    }
  
    try {
      // URL de la API de Scopus (documentación: https://dev.elsevier.com/sc_apis.html)
      const apiUrl = "https://api.elsevier.com/content/search/scopus";
      console.log("xxxx", useRuntimeConfig().scopusApiKey);
      console.log("geminixxxx", useRuntimeConfig().geminiApiKey);
      
      // Hacemos la petición a Scopus
      const response = await $fetch<ScopusSearchResponse>(apiUrl, {
        query: {
          query: query.query,
          start: query.start || 0,
          apiKey: "caff5d68cdb171eabd03da526acae45d",
          count: query.count || 25, // Límite de resultados (opcional)
        },
        headers: {
          Accept: "application/json",
        },
      });
      return response; // Devuelve los datos de Scopus tal cual
    } catch (error) {
        // event.node.res.statusCode = 500;
        // event.node.res.setHeader("Content-Type", "application/json");
        
        // return {
        //     statusCode: 500,
        //     message: "Error al consultar la API de Scopus "+error,
        //     // error: error.message || "Detalles del error no disponibles",
        // };
        throw createError({
            statusCode: 500,
            message: "Error al consultar la API de Scopus "+ error,
            data: error,
        });
    }
});