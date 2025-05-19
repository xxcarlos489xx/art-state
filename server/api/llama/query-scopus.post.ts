import { OpenAI } from "openai";
import { cleanScopusQuery } from '@/utils/cleanQuery';
import { OllamaGenerateResponse } from "@/server/interfaces/ollama-generate-response";

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

    // const scopusPrompt = `
    // Como experto en búsquedas académicas en Scopus, genera una query optimizada para el tema: 
    // "${topic}". Usa estas reglas:

    // - Operadores booleanos (AND/OR/NOT) y campos TITLE-ABS-KEY.
    // - Incluye sinónimos técnicos relevantes.
    // - Filtros: artículos recientes (PUBYEAR > 2019) y revisados por pares (SRCTYPE(j)).
    // - Devuelve SOLO la query en formato texto plano.

    // Ejemplo para "machine learning en salud":
    // TITLE-ABS-KEY("machine learning" OR "deep learning") AND TITLE-ABS-KEY(healthcare OR "medical diagnosis") AND PUBYEAR > 2019 AND SRCTYPE(j)
    // `;
    const scopusPrompt = `
        Eres un asistente especializado en generar queries de búsqueda para Scopus. 
        Sigue estas reglas:

        1. **Formato**: 
        - Devuelve EXCLUSIVAMENTE la query en formato válido para Scopus.
        - No incluyas explicaciones, notas, o texto adicional.
        - Nunca incluyas: comillas invertidas (\`), barras invertidas (\\), ni texto explicativo

        2. **Requerimientos técnicos**:
        - Usa siempre el campo \`TITLE-ABS-KEY\`.
        - Aplica el filtro \`PUBYEAR > 2019\`.
        - Combina términos con operadores booleanos (\`AND\`, \`OR\`, \`NOT\`) y otros que crees conveniente.

        3. **Ejemplo de output esperado**:
        \`TITLE-ABS-KEY("artificial intelligence" OR "AI") AND PUBYEAR > 2019\`

        4. **Tarea**:
        Genera una query para Scopus sobre: "${topic}".`;

    try {
        const response = await $fetch<OllamaGenerateResponse>('http://localhost:11434/api/generate', {
            method: 'POST',
            body: {
              model: "llama3",
              prompt: scopusPrompt,
              stream: false,
            },
        });
        const cleanedQuery = cleanScopusQuery(response.response.trim());
        // const rawQuery = JSON.parse(JSON.stringify(response.response));//el front debera hacer esto para escapar bien los simbolos /

        // Devuelve la respuesta
        return {
            statusCode: 200,
            response: cleanedQuery,
        };
    } catch (error) {
        throw createError({
            statusCode: 500,
            message: "Error al consultar OpenAI",
            data: error,
        });
    }
});
