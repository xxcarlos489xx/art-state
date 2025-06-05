import { defineEventHandler, readMultipartFormData, createError } from 'h3'
import { GoogleGenAI } from '@google/genai'
import { tmpdir } from 'os'
import { writeFileSync, unlinkSync } from 'fs'
import { join } from 'path'

const extractDOI = (text: string): string | null => {
  const doiRegex = /\b10\.\d{4,9}\/[-._;()/:A-Z0-9]+/i
  const match = text.match(doiRegex)
  return match ? match[0] : null
}

export default defineEventHandler(async (event) => {
  const formData = await readMultipartFormData(event)

  const pdfFile = formData?.find(field => field.name === 'pdfFile')

  if (!pdfFile || pdfFile.type !== 'application/pdf') {
    throw createError({
      statusCode: 400,
      message: 'Se requiere un archivo PDF válido.',
    })
  }

  // Guarda temporalmente el archivo para procesarlo
  const tempFilePath = join(tmpdir(), `pdf_${Date.now()}.pdf`)
  writeFileSync(tempFilePath, pdfFile.data)

  try {
    const ai = new GoogleGenAI({ apiKey: useRuntimeConfig().geminiApiKey })

    const fileContent = await ai.files.upload({
        file: tempFilePath,
        config: {
            mimeType: 'application/pdf',
        },
    })

    const completion = await ai.models.generateContent({
      // model: "gemini-2.0-flash",
      model: "gemini-2.0-flash-lite",
      contents: [
        {
          role: 'user',
          parts: [
            {
              fileData: {
                mimeType: 'application/pdf',
                fileUri: fileContent.uri,
              },
            },
            {
              text: `Por favor analiza el documento y devuelve únicamente el número de DOI si existe. El DOI debe comenzar con "10."`,
            },
          ],
        },
      ],
    })

    const output  = completion.text as string
    const doi     = extractDOI(output)

    if (!doi) {
        return {
            exito: false,
            doi: null,
            mensaje: 'No se encontró un número de DOI válido en el documento.',
        }
    }

    return {
        exito: true,
        doi,
        mensaje: null,
    }
  } catch (error) {
    // console.error('Gemini PDF analysis error:', error)
    throw createError({
      statusCode: 500,
      message: 'Error al analizar el archivo PDF',
      data: error,
    })
  } finally {
    unlinkSync(tempFilePath)
  }
})
