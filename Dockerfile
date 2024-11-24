FROM oven/bun:1.1.33

WORKDIR /app
COPY package*.json ./
RUN bun i 
COPY . .

RUN apt-get -y update
RUN apt-get -y install curl

CMD ["bun", "run", "dev"]
