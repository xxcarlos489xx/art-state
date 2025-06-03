export const useScopus = () => {
  const validateDOI = async (doi: string) => {
    try {
      const query = `DOI(${doi})`

      const response = await $fetch('/api/scopus/search', {
        method: 'GET',
        query: {
          query
        }
      })

      const entry = response['search-results']?.entry || []

      if (entry.length > 0 && entry[0]['prism:doi']) {
        return {
          valid: true,
          metadata: entry[0], // puedes usar esto para guardar autores, revista, etc.
        }
      } else {
        return {
          valid: false,
          reason: 'DOI no encontrado en Scopus',
        }
      }
    } catch (error: any) {
      return {
        valid: false,
        reason: error?.data?.message || 'Error al consultar Scopus',
      }
    }
  }

  return {
    validateDOI,
  }
}
