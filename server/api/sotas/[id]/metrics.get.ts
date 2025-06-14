// server/api/sotas/[id]/status.get.ts
import { SotaService } from '~/server/services/sota.service';
const sotaService = new SotaService();

export default defineEventHandler(async (event) => {
    // Obtenemos el ID de la URL (/api/sotas/3/status)
    const idTopic = getRouterParam(event, 'id');

    if (!idTopic) {
        throw createError({ statusCode: 400, message: "Falta el ID del SOTA" });
    }

    const sota  =   await sotaService.getTopic(parseInt(idTopic))

    if (!sota) {
        throw createError({ statusCode: 404, message: "SOTA no encontrado" });
    }

    if (sota.img_entropy) {
        return {
            status: 'completed',
            data: sota,
        };
    } else {
        return {
            status: 'pending',
        };
    }
});