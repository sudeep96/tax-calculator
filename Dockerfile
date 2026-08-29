# ---- Tax Calculator Dockerfile ----
# Simple, single-stage build appropriate for a demonstration / lab project.

FROM node:18-alpine

# Set working directory inside the container
WORKDIR /usr/src/app

# Copy package files first so npm install can be cached separately
# from application source (faster rebuilds when only code changes)
COPY package*.json ./

# Install only production dependencies inside the image
RUN npm install --omit=dev --no-audit --no-fund

# Copy the rest of the application source
COPY . .

# Document the port the app listens on (does not itself publish it)
EXPOSE 8080

# PORT can be overridden at runtime (e.g. by IBM Cloud Code Engine);
# defaults to 8080 inside server.js if not provided.
ENV PORT=8080

# Basic container health check hitting the /health endpoint
HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget --no-verbose --tries=1 --spider http://localhost:${PORT}/health || exit 1

CMD ["node", "server.js"]
