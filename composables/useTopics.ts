export const useTopics = () => {
  const createTopic = async (titulo: string) => {
    const { data, error } = await useFetch('/api/topics/create', {
      method: 'POST',
      body: { titulo },
    })

    if (error.value) {
      throw createError({
        statusCode: error.value?.statusCode || 500,
        statusMessage: error.value?.data?.message || 'Error al crear el tema',
      })
    }

    return data.value
  }

  return {
    createTopic,
  }
}
