FROM node:18-alpine

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files first
COPY package.json pnpm-lock.yaml ./

# Clean install dependencies
RUN pnpm install --frozen-lockfile

# Copy rest of the application
COPY . .

# Build the application
RUN pnpm build

# Install serve globally
RUN npm install -g serve

EXPOSE 5173

CMD ["serve", "-s", "dist", "-l", "5173"]