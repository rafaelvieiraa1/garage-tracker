# 🚗 Garage Tracker

O Garage Tracker é um sistema Full Stack robusto desenvolvido para o gerenciamento inteligente de veículos em garagens. O grande diferencial do projeto é a integração em tempo real com a API FIPE (via Parallelum), permitindo obter automaticamente dados de mercado como marca, modelo, ano de lançamento e o preço médio atualizado dos veículos com base no código FIPE.

---

## 🛠️ Tecnologias Utilizadas

Para garantir performance, escalabilidade e uma arquitetura moderna, o projeto foi construído utilizando as seguintes tecnologias:

- **Back-end:** Java 21, Spring Boot, Spring Web e Spring Data JPA.
- **Front-end:** Next.js 14+ (App Router), TypeScript, Tailwind CSS e React Hot Toast.
- **Banco de Dados:** PostgreSQL e Docker (Ambiente de desenvolvimento).

---

## 🚀 Funcionalidades Principais

- **Gerenciamento Completo (CRUD):** Cadastro, listagem, edição fluida e exclusão de veículos diretamente na interface.
- **Automação FIPE:** Consulta automática de dados simplificada. Ao digitar o código FIPE (ex: 009164-2), o sistema preenche de forma inteligente a Marca, o Modelo, o Ano e o Preço Médio.
- **Formatação Monetária Dinâmica:** Os preços salvos no banco são convertidos e exibidos de forma legível utilizando o padrão de moeda brasileiro (R$ 000.000,00) através da API nativa Intl do JavaScript.
- **Filtro em Tempo Real:** Barra de busca reativa na interface que filtra a garagem instantaneamente por marca ou modelo sem recarregar a página.

---

## 📋 Como Executar o Projeto

### Prerrequisitos
Antes de começar, certifique-se de ter instalado em sua máquina o Docker Desktop (para o banco de dados), o Java JDK 21 e o Node.js (v18 ou superior).

### 1. Inicializar o Banco de Dados (Docker)
Abra o Docker Desktop e inicie o container do PostgreSQL. Se preferir rodar via terminal, execute:
docker start <nome-do-seu-container>

### 2. Inicializar o Back-end (Spring Boot)
Abra uma aba do terminal na raiz do projeto e navegue até a pasta interna do Spring Boot para rodar o comando:
cd garage-tracker
./mvnw spring-boot:run

O servidor backend iniciará na porta 8080.

### 3. Inicializar O Front-end (Next.js)
Abra uma nova aba no terminal a partir da raiz do projeto e navegue até a pasta da interface para rodar o comando:
cd garage-frontend
npm run dev

O servidor frontend iniciará na porta 3000.

---

## 💻 Visualizar o Sistema

Após subir os dois servidores e o banco de dados, abra o seu navegador e acesse:
http://localhost:3000

---

## 📄 Licença

Este projeto é de código aberto e está disponível para fins de estudo e aprimoramento de portfólio.