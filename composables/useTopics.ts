export const useTopics = () => {
  const createTopic = async (titulo: string, opciones: string[]) => {
    try {
        const data = await $fetch('/api/topics/create', {
            method: 'POST',
            body: { titulo, opciones },
        })
        return data
    } catch (error: any) {
        throw createError({
            statusCode: error?.statusCode || 500,
            message: error?.data?.message || 'Error al crear el tema',
        })
    }
  }

  const listTopics = async () => {
    try {
      return await $fetch('/api/topics/all')
    } catch (error: any) {
      throw createError({
        statusCode: error?.statusCode || 500,
        message: error?.data?.message || 'Error al obtener los temas',
      })
    }
  }

  const uploadPaper = async (file: File, topicId: string, doi: string) => {
     try {
      const formData = new FormData()
      formData.append('pdfFile', file)
      formData.append('topicId', topicId)
      formData.append('nroDoi', doi)

      const response = await $fetch('/api/topics/upload-paper', {
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
    createTopic,
    listTopics,
    uploadPaper
  }
}
