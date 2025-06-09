export const useSota = () => {
  const generateSota = async (topicId: number) => {
    try {
        const data = await $fetch('/api/topics/generate-sota', {
            method: 'POST',
            body: { topicId },
        })
        return data
    } catch (error: any) {
        throw createError({
            statusCode: error?.statusCode || 500,
            message: error?.data?.message || 'Error al generar SoTA',
        })
    }
  }

  return {
    generateSota
  }
}
