# 🚀 K6 Performance Academy

> Plataforma interativa para execução e aprendizado de Testes de Performance utilizando Grafana K6 e Node.js.

![Dashboard Preview](https://img.shields.io/badge/Status-Live-success)
![K6 Version](https://img.shields.io/badge/K6-0.50.0-blueviolet)
![Node Version](https://img.shields.io/badge/Node.js-18+-green)

## 📋 Sobre o Projeto

Este projeto foi desenvolvido como parte de um **PDI (Plano de Desenvolvimento Individual)** focado em Engenharia de Performance. O objetivo é democratizar o acesso aos testes de carga, permitindo que desenvolvedores e QAs configurem cenários de teste complexos através de uma interface visual amigável, sem a necessidade de manipular scripts manualmente de imediato.

### 🌟 Diferenciais
* **Níveis de Experiência:** Opções de configuração para perfis Iniciante, Intermediário e Avançado.
* **Dashboard Inteligente:** Visualização imediata de métricas como P95, Média de Resposta e Requisições Totais.
* **Critérios de Aceite (SLA):** Validação automática de sucesso ou falha baseada no tempo de resposta definido.
* **Didática:** Legendas e explicações integradas para ensinar conceitos de Performance durante o uso.

---

## 🛠️ Tecnologias Utilizadas

* **[K6](https://k6.io/):** Engine principal de execução de testes de carga.
* **[Node.js](https://nodejs.org/):** Servidor Backend (Express) para orquestração.
* **JavaScript/HTML/CSS:** Interface frontend responsiva e interativa.
* **Render:** Infraestrutura para deploy contínuo (Cloud).

---

## 🕹️ Como Executar o Projeto

### Pré-requisitos
1.  Ter o [Node.js](https://nodejs.org/) instalado.
2.  Ter o [K6](https://k6.io/docs/getting-started/installation/) instalado no seu sistema.

### Passo a Passo Local
1.  Clone este repositório:
    ```bash
    git clone [https://github.com/SEU_USUARIO/NOME_DO_REPO.git](https://github.com/SEU_USUARIO/NOME_DO_REPO.git)
    ```
2.  Instale as dependências:
    ```bash
    npm install
    ```
3.  Inicie o servidor:
    ```bash
    node server.js
    ```
4.  Acesse no navegador: `http://localhost:3000`

---

## 📈 Cenários de Teste Disponíveis

| Nível | Tipo de Teste | O que avalia? |
| :--- | :--- | :--- |
| **🌱 Iniciante** | Smoke Test | Valida se a API está "viva" sob carga mínima. |
| **⚡ Intermediário** | Load Test | Avalia o comportamento do sistema com ramp-up de usuários. |
| **🔥 Avançado** | Stress/Spike | Testa os limites do servidor e conformidade rigorosa de SLA. |

---

## ☁️ Deploy no Render

Este projeto está configurado para rodar de forma híbrida. No ambiente Render, o binário do K6 é baixado dinamicamente durante o build através do comando:

```bash
npm install && curl [https://github.com/grafana/k6/releases/download/v0.50.0/k6-v0.50.0-linux-amd64.tar.gz](https://github.com/grafana/k6/releases/download/v0.50.0/k6-v0.50.0-linux-amd64.tar.gz) -L | tar -xz --strip-components 1
