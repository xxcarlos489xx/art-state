export interface OllamaGenerateResponse {
    response: string; // La respuesta generada por el modelo
    done?: boolean;   // Campo opcional para respuestas en stream
}