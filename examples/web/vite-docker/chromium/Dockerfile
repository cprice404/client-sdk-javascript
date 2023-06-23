#FROM ubuntu:jammy-20230605
FROM mcr.microsoft.com/playwright:v1.35.1-jammy

#RUN apt update \
    #&& apt install -y curl \
    #&& curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    #&& apt install -y nodejs

WORKDIR /chromium-launcher
COPY . .
RUN npm install && npm run build

CMD [ "node", "dist/launch-chromium.js" ]
