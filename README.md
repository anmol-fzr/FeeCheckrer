# FeeCheckr

## Requirements

1. [Docker](https://docs.docker.com/engine/install/)
2. [pnpm](https://pnpm.io/installation)

## Steps To Get Started

1. Clone the main server ( FeeCheckrer )\
```
https://github.com/anmol-fzr/FeeCheckrer
```

2. Clone the main server ( FeeCheckrer )\
```
https://github.com/anmol-fzr/FeeCheckrer
```

3. Clone the admin application ( FeeCheckr )\
```
https://github.com/anmol-fzr/FeeCheckrer
```

4. Clone the student application ( FeeGiver )\
```
https://github.com/anmol-fzr/FeeGiver
```

5. Copy `docker-compose.yaml` from `FeeCheckrer` to current directory\
```
cp ./FeeCheckrer/docker-compose.yaml ./
```

6. Start Docker Engine According to your own system\

7. Start Docker Container
```
docker compose up -d
```

```
- 
    - FeeCheckrer
    - FeeCheckr
    - FeeGiver
    - docker-compose.yaml

```

Development Only Steps

8. Start admin application
```cd ./FeeCheckrer && pnpm i && pnpm run dev```

9. Start student application
```cd ./FeeGiver && pnpm i && pnpm run dev```
