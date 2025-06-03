export const useGemini = () => {
  const check = async (file: File) => {
     try {
      const formData = new FormData()
      formData.append('pdfFile', file)

      const response = await $fetch('/api/gemini/validate-paper', {
        method: 'POST',
        body: formData,
      })

      return response
    } catch (error: any) {
      throw createError({
        statusCode: error?.statusCode || 500,
        message: error?.data?.message || 'Error al subir el paper',
      })
    }
  }

  return {
    check
  }
}
