export const useSota = () => {
  const pollingMetrics = async (topicId: number) => {
    try {
        const data = await $fetch(`/api/sotas/${topicId}/metrics`);
        return data
    } catch (error: any) {
        throw createError({
            statusCode: error?.statusCode || 500,
            message: error?.data?.message || 'Error al generar',
        })
    }
  }

  return {
    pollingMetrics
  }
}
