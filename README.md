# 🚗 Garage Tracker

Sistema Full Stack para gerenciamento de veículos e consulta de preços médios de mercado via integração com a API FIPE.

## 🛠️ Tecnologias Utilizadas
- **Back-end:** Java 21 com Spring Boot
- **Front-end:** Next.js 14+ (TypeScript)
- **Banco de Dados:** PostgreSQL (via Docker)
- **Estilização:** Tailwind CSS e Lucide React

## 🚀 Funcionalidades
- Cadastro, edição e exclusão de veículos (CRUD).
- Busca automática de dados (Marca, Modelo, Ano e Preço) através do Código FIPE.
- Formatação monetária automática para o padrão brasileiro (R$).
- Filtro de busca em tempo real na garagem.

## 📋 Como executar o projeto
1. Certifique-se de que o **Docker** está rodando o container do PostgreSQL.
2. No Back-end, execute `./mvnw spring-boot:run`.
3. No Front-end, execute `npm run dev` ou `yarn dev`.
4. Acesse `http://localhost:3000`.