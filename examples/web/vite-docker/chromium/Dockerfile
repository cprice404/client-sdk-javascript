FROM mcr.microsoft.com/playwright:v1.35.1-jammy

WORKDIR /chromium-launcher
COPY . .
RUN npm install && npm run build

CMD [ "node", "dist/launch-chromium.js" ]
