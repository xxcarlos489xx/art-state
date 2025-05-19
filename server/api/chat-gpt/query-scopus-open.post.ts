import { OpenAI } from "openai";

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig();
    const { topic } = await readBody(event);

    if (!topic) {
        throw createError({
          statusCode: 400,
          message: "El topic es requerido.",
        });
    }

    const openai = new OpenAI({
        apiKey: config.openaiApiKey,
    });

    const scopusPrompt = `
    Como experto en búsquedas académicas en Scopus, genera una query optimizada para el tema: 
    "${topic}". Usa estas reglas:

    - Operadores booleanos (AND/OR/NOT) y campos TITLE-ABS-KEY.
    - Incluye sinónimos técnicos relevantes.
    - Filtros: artículos recientes (PUBYEAR > 2019) y revisados por pares (SRCTYPE(j)).
    - Devuelve SOLO la query en formato texto plano.

    Ejemplo para "machine learning en salud":
    TITLE-ABS-KEY("machine learning" OR "deep learning") AND TITLE-ABS-KEY(healthcare OR "medical diagnosis") AND PUBYEAR > 2019 AND SRCTYPE(j)
    `;

    try {
        // Consulta a la API de OpenAI
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                role: "system",
                content:
                    "Eres un asistente que convierte temas de investigación en queries precisas para Scopus.",
                },
                {
                role: "user",
                content: scopusPrompt,
                },
            ],
            temperature: 0.3, // Reduce la creatividad para mayor precisión
        });

        const generatedQuery = completion.choices[0]?.message?.content?.trim() || "No hubo respuesta";

        // Devuelve la respuesta
        return {
            statusCode: 200,
            response: generatedQuery,
        };
    } catch (error) {
        throw createError({
            statusCode: 500,
            message: "Error al consultar OpenAI",
            data: error,
        });
    }
});
