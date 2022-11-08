FROM node:16-alpine
RUN echo $NEXTAUTH_URL
ENV HOST=0.0.0.0
RUN mkdir -p /usr/app/
WORKDIR /usr/app/

# copy from to
COPY ./ ./

RUN npm install
RUN npm run build
CMD ["sh", "entrypoint.sh"]