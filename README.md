# Nuxt Minimal Starter

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

# Descripción de proyecto
Este proyecto desarrolla un sistema para ayudar a investigadores y estudiantes (especialmente en Ingeniería de Sistemas) a sintetizar el estado del arte (SOTA) en un área específica de investigación.

La aplicación permite cargar múltiples artículos científicos en formato PDF, procesarlos y utilizar un modelo de lenguaje avanzado (Google Gemini) para generar una síntesis del SOTA relevante para un tema consultado por el usuario.

**Características Principales:**

*   **Procesamiento de Documentos:** Carga y extracción de texto de archivos PDF.
*   **Arquitectura RAG (Retrieval Augmented Generation):** Implementación de un pipeline de indexación vectorial (chunking, embeddings, base de datos vectorial) para recuperar la información más relevante de los documentos cargados.
*   **Generación Aumentada por IA:** Utilización de Google Gemini para generar el SOTA basándose *exclusivamente* en el contexto relevante recuperado de los documentos procesados, mejorando la precisión y reduciendo alucinaciones.
*   **Validación Metodológica:** Incluye componentes para la evaluación cuantitativa del SOTA generado (ej. BERTScore, Entropía de Shannon), como parte de la investigación científica del proyecto.

**Tecnologías:**

*   **Frontend:** Nuxt.js (Vue.js Framework)
*   **Backend & Lógica RAG:** Python (con librerías como Langchain, PyPDF, ChromaDB y la API de Google GenAI)

Este sistema es el resultado de un proyecto de investigación centrado en la aplicación de técnicas avanzadas de procesamiento de lenguaje natural y modelos de lenguaje para automatizar y mejorar el proceso de revisión de literatura científica.

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

### Containers IA

#### With run GPU's
```bash
docker --version
Docker version 27.5.1, build 9f9e405

docker pull ollama/ollama

docker run -d -p 11434:11434 -v ollama_data:/root/.ollama --name ollama ollama/ollama # run container cpu's

docker exec -it ollama ollama pull llama3 # download model ollama

docker exec -it ollama ollama list # confirm install model
```

#### With run GPU's
```bash
docker run --rm --gpus all nvidia/cuda:12.2.0-base-ubuntu22.04 nvidia-smi

docker run -d --gpus all -p 11434:11434 -v ollama_data:/root/.ollama --name ollama ollama/ollama # run container gpu's
nvidia-smi  # check process nvidia o check available

```