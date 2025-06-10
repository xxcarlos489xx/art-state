import { GoogleGenAI, Type  } from "@google/genai";

function sleep(ms:number) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig();
    const { step1 } = await readBody(event);
    // const { area } = await readBody(event);
    // await sleep(5000)
    // return {
    //     statusCode: 200,
    //     response: body,
    // };
    if (!step1.area || !step1.tema || 
        !step1.problema || !step1.metodologia 
        // || !step1.contexto || !step1.contri
    ) {
        throw createError({
          statusCode: 400,
          message: "El topic es requerido.",
        });
    }

    const ai = new GoogleGenAI({ apiKey: config.geminiApiKey });

    let fields = `${step1.area}, ${step1.tema}, ${step1.problema}, ${step1.metodologia}`

    if (step1.contexto)  fields +=`, ${step1.contexto}`
    if (step1.contri)    fields +=`, ${step1.contri}`

    let prompt = `
    Eres un asistente experto en la formulación de títulos para investigaciones científicas.
    Basándote en la siguiente información proporcionada por un usuario, intenta generar 5 opciones de títulos de investigación.


    Información del Usuario:
    - Área General de Conocimiento: ${step1.area}
    - Tema Específico / Palabras Clave: ${step1.tema}
    - Problema Principal o Pregunta (si se proporcionó): ${step1.problema}
    - Metodología Principal (si se proporcionó): ${step1.metodologia}`

    if (step1.contexto)  prompt +=`- Contexto o Población (si se proporcionó): ${step1.contexto}`
    if (step1.contri)    prompt +=`- Tipo de Contribución Deseada (si se proporcionó): ${step1.contri}`

    prompt+=  `Validaciones de los campos:
    - Analiza que los valores ${step1.area}, ${step1.area}, ${step1.area}, ${step1.area}  ingresados sean palabras coherentes y acordes`

    prompt+=  `Consideraciones para los títulos:
    - Deben ser informativos y atractivos para una audiencia académica.
    - Deben integrar las palabras clave y conceptos más importantes.
    - Si se proporcionó una metodología o tipo de contribución, intenta reflejarla sutilmente.

    Si puedes generar los títulos exitosamente, establece "exito" en true y proporciona los títulos en "titulos_propuestos". El campo "mensaje" puede ser null o una breve nota de éxito.

    Si la información proporcionada es insuficiente o demasiado ambigua para generar títulos de investigación significativos, establece "exito" en false y proporciona una explicación clara en el campo "mensaje". En este caso, el campo "titulos_propuestos" debe ser un array vacío o null.

    Si estos textos ${fields}, no tienen coherencia, no se interrelacionan entre si, son palabras u oraciones ofensivas, incongruentes, establece "exito" en false y proporciona una explicación clara en el campo "mensaje". En este caso, el campo "titulos_propuestos" debe ser un array vacío o null.
    
    {
        "exito": true, // o false
        "titulos_propuestos": [ // array vacío o null si exito es false
            {
                "id": 1,
                "titulo": "Título de investigación propuesto 1"
            },
            {
                "id": 2,
                "titulo": "Título de investigación propuesto 2"
            },
            // ... hasta 5 títulos
        ],
        "mensaje": "Explicación concisa si exito es false, o null/nota si exito es true",
        "palabras_clave_usadas": ["palabra_clave1_detectada", "palabra_clave2_detectada", "..."] // Opcional
    }`

    try {
        // Consulta a la API de OpenAI
        const completion = await ai.models.generateContent({
            model: "gemini-2.0-flash-lite",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties:{
                        exito: {
                            type: Type.BOOLEAN,
                        },
                        titulos_propuestos: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.STRING,
                            },
                        },
                        palabras_clave_usadas: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.STRING,
                            },
                        },
                        message: {
                            type: Type.STRING,
                        },
                    },
                    propertyOrdering: ["exito", "titulos_propuestos","palabras_clave_usadas","message"]
                },
              },
        });
        const response = JSON.parse(completion.text as string)
        // const generatedQuery = completion.choices[0]?.message?.content?.trim() || "No hubo respuesta";

        // Devuelve la respuesta
        return {
            statusCode: 200,
            // response: generatedQuery,
            response: response,
        };
    } catch (error) {
        throw createError({
            statusCode: 500,
            message: "Error al consultar OpenAI",
            data: error,
        });
    }
});
