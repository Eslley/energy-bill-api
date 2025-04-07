# 📦 Energy Bill API

Este é um projeto desenvolvido em **Express** com o objetivo de criar um API para processar faturas de energia, realizando o parser das informações presentes nas faturas e disponibilizando relatórios.

## 🚀 Tecnologias utilizadas

- Express
- TypeScript
- Cloudinary
- Axios
- Dotenv

# Inciando aplicação via Docker

```
docker-compose up -d
```

# Testes

Foram implementados 3 testes para o `EnergyBillParserService`:
- should parse a valid PDF and return a ParsedEnergyBill 
- should return an error if PDF parsing fails
- should throw an error if a required field is missing

```
npm run test
```

# Variáveis de ambiente

```
NODE_ENV=development
PORT=5000
TZ=UTC

LOGGER_LEVEL=debug

CORS_ORIGIN=*

STORAGE_PATH=upload

POSTGRES_USER=base
POSTGRES_PASSWORD=base
POSTGRES_DB=base

DATABASE_URL="postgresql://base:base@seu_ip_local:5432/base?schema=public"

CLOUDINARY_CLOUD_NAME==
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```
