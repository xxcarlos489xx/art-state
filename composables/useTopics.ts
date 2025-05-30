export const useTopics = () => {
  const createTopic = async (titulo: string, opciones: string[]) => {
    try {
        const data = await $fetch('/api/topics/create', {
            method: 'POST',
            body: { titulo, opciones },
        })
        return data
    } catch (error: any) {
        console.log(error);        
        throw createError({
            statusCode: error?.statusCode || 500,
            message: error?.data?.message || 'Error al crear el tema',
        })
    }
  }

  return {
    createTopic,
  }
}
