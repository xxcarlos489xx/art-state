# Nuxt Minimal Starter

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

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