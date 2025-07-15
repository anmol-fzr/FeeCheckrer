# 📦 FeeCheckrer
Backend Service for Fee Submission and Verification

FeeCheckrer is the backend API server responsible for handling business logic, authentication, and data management.

Built with: Hono (TypeScript)

Database: MongoDB

Storage: MinIO (S3-compatible, for local development)

Features:
- RESTful APIs for student submission and admin verification
- JWT-based authentication
- MongoDB integration for data persistence
- MinIO-based file upload system for document storage


# 🐳 Deployment
All modules are containerized using Docker and orchestrated with Docker Compose for easy local setup and development.

## Modules

- [Server](https://github.com/anmol-fzr/FeeCheckrer)
- [Admin Portal](https://github.com/anmol-fzr/FeeCheckr)
- [Server for Mails Only](https://github.com/anmol-fzr/FeeMailer)
- [Student Portal](https://github.com/anmol-fzr/FeeGiver)

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
https://github.com/anmol-fzr/FeeMailer
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
