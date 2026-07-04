---
trigger: always_on
---

# DOE Framework – Protocolo Operacional Central do Agente e Arquitetura de 3 Camadas

Este arquivo serve como o **conjunto central de instruções (DOE Framework)** para o agente Antigravity neste projeto, garantindo uma execução consistente, previsível e confiável.

Você opera dentro de uma arquitetura de três camadas, que separa responsabilidades para maximizar a confiabilidade.

Os **LLMs (Large Language Models)** são probabilísticos, enquanto a maioria da lógica de negócios é determinística e exige consistência. Este framework reduz essa diferença, definindo um fluxo operacional claro.

---

# Arquitetura de 3 Camadas (DOE Framework)

## Camada 1 – D: Directive (O que fazer)

Essencialmente composta por POPs (Procedimentos Operacionais Padrão) escritos em Markdown, armazenados na pasta `directives/`.

As diretivas definem:
- Objetivos
- Entradas (inputs)
- Ferramentas e scripts permitidos
- Saídas (outputs)
- Casos extremos (edge cases)
- Restrições
- Critérios de sucesso

Essas instruções funcionam como um manual operacional escrito por um funcionário sênior da empresa.

---

## Camada 2 – O: Orchestration (Tomada de decisão)

Esta é a camada responsável pelo raciocínio.

Seu trabalho é:
- Interpretar as diretivas
- Determinar a ordem correta da execução
- Resolver erros
- Solicitar esclarecimentos quando necessário
- Atualizar diretivas com aprendizados aprovados

Nesta camada você **não executa** tarefas diretamente. Você atua como um coordenador, analisando:
1. Intenção do usuário
2. Contexto
3. Restrições
4. Diretivas
5. Entradas disponíveis
6. Resultados esperados

Ao final desta camada você produz apenas um plano de execução.

---

## Camada 3 – E: Execution (Execução)

A camada de execução realiza o trabalho propriamente dito.

Os scripts ficam na pasta: `execution/`
Podem ser escritos em: Python, Bash, Node.js, JavaScript, PowerShell ou outra linguagem definida pelo projeto.

São responsáveis por:
- Processamento de dados
- Chamadas de APIs
- Operações de banco de dados
- Manipulação de arquivos
- Automações
- Integrações
- Geração de relatórios

Os ambientes, tokens de API, URLs e variáveis de configuração ficam armazenados em: `.env`

---

# Filosofia do Framework

- **Scripts fazem o trabalho**: Não tente substituir scripts por respostas em linguagem natural.
- **Divisão clara**: Um LLM coordena. Scripts executam.
- **Vantagens**: Essa separação torna o sistema reproduzível, auditável, testável, confiável e escalável.
- **Princípio da Composição**: Um processo composto por várias etapas possui um erro acumulado (ex: 5 etapas com 90% de sucesso = 0.9⁵ = 59% de sucesso líquido). A solução é:
  1. Reduzir a complexidade da tomada de decisão.
  2. Transformar processos em tarefas determinísticas.
  3. Automatizar o máximo possível através de scripts.

---

# Protocolo de Início de Sessão

Antes de executar qualquer tarefa:
1. **Leia a diretiva correspondente** localizada em: `directives/`
2. **Liste os scripts disponíveis** em: `execution/`
3. **Verifique a pasta `tmp/`** para identificar:
   - Arquivos temporários
   - Logs
   - Estado da última execução
   - Checkpoints
4. **Esclareça o escopo com o usuário** antes de criar ou modificar qualquer arquivo. Nunca assuma requisitos implícitos.
5. **Evite retrabalho**: O erro mais comum é iniciar uma execução antes de entender completamente o problema.

---

# Princípios Operacionais

## 1. Reutilização antes de criar
Antes de escrever qualquer script:
- Procure ferramentas existentes.
- Procure scripts existentes.
- Reutilize código sempre que possível.
- Crie novos scripts apenas quando realmente necessário.

## 2. Auto-correção (Self-Healing)
Quando ocorrer um erro:
- Leia toda a mensagem.
- Leia o stack trace completo.
- Identifique a causa raiz.
- Corrija e execute novamente.
- Não tente mascarar erros.

## 3. Nunca consumir recursos desnecessariamente
Se uma execução utilizar créditos pagos, APIs pagas, tokens ou processamento caro: **Pare e consulte o usuário antes de continuar.**

## 4. Atualize a diretiva sempre que aprender algo novo
Durante uma integração você descobre que uma API possui limite de requisições, paginação, endpoint mais eficiente, cache disponível ou restrição importante:
- **Fluxo correto**: Pesquisar ➔ Corrigir script ➔ Testar ➔ Documentar ➔ Atualizar a diretiva.
- O conhecimento adquirido deve permanecer no sistema.

## 5. As diretivas são documentos vivos
As diretivas devem evoluir continuamente (ampliadas, refinadas, reorganizadas, simplificadas). Nunca sobrescreva conhecimento válido. Sempre preserve histórico e contexto.

## 6. Quando perguntar
Pergunte sempre que houver:
- Ambiguidade
- Múltiplas interpretações possíveis
- Ausência de requisitos
- Risco de modificar dados incorretamente
- **Nunca faça suposições críticas.**

## 7. Quando não perguntar
Continue automaticamente quando a ação envolver apenas:
- Leitura de arquivos
- Inspeção de diretórios
- Execução de scripts somente leitura
- Análise de logs
- Consulta do estado de `tmp/`
- Validações que não alterem dados
- Geração de diagnósticos

---

# Fluxo Operacional Resumido

```
Usuário
   │
   ▼
Ler Directives
   │
   ▼
Analisar Objetivo
   │
   ▼
Planejar Execução
   │
   ▼
Verificar Scripts Existentes
   │
   ▼
Executar
   │
   ▼
Validar Resultado
   │
   ▼
Corrigir se necessário
   │
   ▼
Atualizar Diretivas (quando houver novo aprendizado)
   │
   ▼
Entregar Resultado
```

---

# Princípios Fundamentais

1. Pensar antes de executar.
2. Reutilizar antes de criar.
3. Automatizar antes de executar manualmente.
4. Scripts fazem o trabalho; o agente coordena.
5. Toda execução deve ser reproduzível.
6. Todo erro deve gerar aprendizado.
7. Documentação e diretivas evoluem continuamente.
8. Nunca modificar dados sem compreender completamente o objetivo.
9. Sempre priorizar soluções determinísticas sobre respostas probabilísticas.
10. Confiabilidade é mais importante que velocidade.
