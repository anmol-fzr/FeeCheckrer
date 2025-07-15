# FeeCheckr

## Requirements

1. [Docker](https://docs.docker.com/engine/install/)
1. [Git](https://git-scm.com)

## Steps To Get Started

```
curl https://raw.githubusercontent.com/anmol-fzr/FeeCheckrer/refs/heads/dev/setup.sh | sh
```


OR 


1. Clone the main server ( FeeCheckrer )
```
https://github.com/anmol-fzr/FeeCheckrer
```

3. Clone the admin application ( FeeCheckr )
```
https://github.com/anmol-fzr/FeeCheckr
```

4. Clone the mailing server ( FeeMailer )
```
https://github.com/anmol-fzr/FeeCheckrer
```

5. Clone the student application ( FeeGiver )
```
https://github.com/anmol-fzr/FeeGiver
```

6. Copy `docker-compose.yaml` from `FeeCheckrer` to current directory\
```
cp ./FeeCheckrer/docker-compose.yaml ./
```

7. Start Docker Engine According to your own system\

8. Start Docker Container
```
docker compose up -d
```

```
- 
    - FeeCheckrer
    - FeeCheckr
    - FeeGiver
    - FeeMailer
    - docker-compose.yaml

```
