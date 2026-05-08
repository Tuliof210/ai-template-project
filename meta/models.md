# Mega guia: quando usar cada modelo no Claude Code e no Codex

## Premissas usadas

Este guia não é uma tabela oficial rígida. É uma matriz prática para desenvolvimento real usando agentes de código.

- **Haiku**: rápido, barato, bom para tarefa mecânica e pequena.
- **Sonnet**: melhor “daily driver” no Claude Code.
- **Opus**: use quando o erro custa caro: arquitetura, segurança, refactor grande, bugs difíceis.
- **Codex 5.4**: melhor custo-benefício para tarefas comuns.
- **Codex 5.5**: melhor quando qualidade, julgamento e confiabilidade importam mais.
- **Low**: execução direta, pouca ambiguidade.
- **Medium**: tarefa comum com algum planejamento.
- **High**: bug difícil, refactor, integração, diagnóstico.
- **Extra High / Max / xhigh**: tarefa longa, crítica, ambígua ou que já falhou em níveis menores.
- **Thinking**: use quando o risco principal não é escrever código, mas decidir corretamente antes de escrever.

---

# Regra geral de escolha

## Escolha pelo risco

| Risco da tarefa                            | Claude Code                  | Codex                   |
| ------------------------------------------ | ---------------------------- | ----------------------- |
| Baixo, mecânico, fácil de revisar          | Haiku / Sonnet Low           | 5.4 low                 |
| Normal de feature                          | Sonnet Medium                | 5.4 medium / 5.5 medium |
| Refactor ou bug com várias partes          | Sonnet High Thinking         | 5.5 high                |
| Auth, cookies, permissões, banco, produção | Opus Medium/High Thinking    | 5.5 high / extra high   |
| Tarefa enorme, ambígua ou crítica          | Opus Extra High/Max Thinking | 5.5 extra high          |

## Escolha pelo custo

| Prioridade                   | Melhor escolha                             |
| ---------------------------- | ------------------------------------------ |
| Economizar ao máximo         | Haiku ou Codex 5.4 low                     |
| Economizar sem perder muito  | Sonnet Low/Medium ou Codex 5.4 medium      |
| Melhor custo-benefício geral | Sonnet Medium Thinking ou Codex 5.5 medium |
| Máxima qualidade razoável    | Sonnet High Thinking ou Codex 5.5 high     |
| Último recurso               | Opus Max Thinking ou Codex 5.5 extra high  |

---

# CLAUDE CODE

---

## Haiku

Use para tarefa pequena, mecânica e fácil de revisar. Não use quando precisar entender arquitetura, segurança, fluxo de dados ou comportamento espalhado.

1. **Renomear `UserCard` para `CustomerCard` em poucos arquivos.**
   **Por quê:** é uma mudança textual e localizada, com baixo risco de decisão errada.

2. **Remover imports não usados após um refactor.**
   **Por quê:** é limpeza mecânica, facilmente validada por lint/build.

3. **Criar um componente `LoadingSpinner` sem lógica de negócio.**
   **Por quê:** UI simples não exige raciocínio profundo.

4. **Gerar um `DTO` simples para `CreateCustomerDto`.**
   **Por quê:** é boilerplate previsível em NestJS.

5. **Criar uma interface TypeScript a partir de um JSON pequeno de usuário.**
   **Por quê:** transformação estrutural direta.

6. **Ajustar textos de botões e labels em uma tela.**
   **Por quê:** não envolve arquitetura nem risco funcional relevante.

7. **Criar `.env.example` com variáveis já existentes no projeto.**
   **Por quê:** basta coletar nomes e documentar.

8. **Trocar classes Tailwind óbvias para melhorar espaçamento.**
   **Por quê:** alteração visual pequena e reversível.

9. **Criar mock data para uma tabela de clientes.**
   **Por quê:** dados fictícios não exigem decisão técnica complexa.

10. **Escrever uma mensagem de commit convencional para mudanças já feitas.**
    **Por quê:** é tarefa de redação técnica curta, não de engenharia.

---

## Haiku Thinking

Use quando a tarefa ainda é pequena, mas existe uma microdecisão técnica antes de editar.

1. **Descobrir por que `formatCurrency(0)` retorna vazio.**
   **Por quê:** bug pequeno, mas exige checar edge case antes de corrigir.

2. **Decidir se um helper deve ficar em `domain/customer/helpers.ts` ou em `hooks/`.**
   **Por quê:** pequeno, mas envolve convenção de arquitetura.

3. **Corrigir teste unitário simples que falha por mock errado.**
   **Por quê:** precisa entender intenção do teste antes de alterar.

4. **Verificar se um componente precisa de `"use client"`.**
   **Por quê:** decisão pequena, mas errar pode quebrar SSR/hidratação.

5. **Analisar por que um botão chama `onSubmit` duas vezes.**
   **Por quê:** bug localizado, mas exige raciocinar sobre evento/formulário.

6. **Escolher entre `type`, `interface` ou `enum` em uma tipagem pequena.**
   **Por quê:** não é difícil, mas há trade-off simples.

7. **Revisar um pequeno schema Zod com campo opcional condicional.**
   **Por quê:** validação condicional costuma gerar bug silencioso.

8. **Corrigir um mapper que perde o campo `id`.**
   **Por quê:** exige confirmar o contrato esperado entre API e UI.

9. **Encontrar duplicação entre dois componentes quase iguais.**
   **Por quê:** precisa comparar intenção antes de extrair componente comum.

10. **Explicar por que uma função pequena está impura.**
    **Por quê:** análise conceitual curta, adequada para thinking leve.

---

## Sonnet Low

Use para desenvolvimento comum pequeno, com escopo claro e baixo risco.

1. **Criar endpoint `GET /customers/:id` em NestJS.**
   **Por quê:** padrão simples de controller + service.

2. **Adicionar prop `disabled` em um botão reutilizável.**
   **Por quê:** mudança pequena com impacto previsível.

3. **Criar hook `useDebounce`.**
   **Por quê:** implementação conhecida e isolada.

4. **Adicionar loading/error em uma tela de listagem.**
   **Por quê:** padrão comum de UI assíncrona.

5. **Criar `customersService.getAll()` usando client HTTP existente.**
   **Por quê:** segue estrutura já estabelecida.

6. **Adicionar validação `email` em formulário existente.**
   **Por quê:** alteração direta em schema/field.

7. **Criar teste unitário para `slugify`.**
   **Por quê:** função pura com entradas/saídas claras.

8. **Adicionar coluna “status” em uma tabela.**
   **Por quê:** mudança visual e de mapeamento simples.

9. **Corrigir import path quebrado após mover arquivo.**
   **Por quê:** tarefa mecânica, mas um pouco maior que Haiku.

10. **Criar `constants.ts` para opções de status.**
    **Por quê:** organização simples sem impacto arquitetural grande.

---

## Sonnet Low Thinking

Use quando a tarefa é pequena, mas precisa de diagnóstico curto ou decisão técnica.

1. **Corrigir bug onde filtro de busca não limpa paginação.**
   **Por quê:** envolve interação entre estado de busca e página atual.

2. **Decidir se paginação deve ficar no hook ou no componente.**
   **Por quê:** decisão simples de separação de responsabilidades.

3. **Ajustar CORS para aceitar dois origins de dev.**
   **Por quê:** pequeno, mas errar pode abrir ou bloquear demais.

4. **Corrigir mutation que não invalida cache do React Query.**
   **Por quê:** exige entender chave de cache antes de editar.

5. **Adicionar teste para bug já identificado em formulário.**
   **Por quê:** precisa reproduzir o caso antes de aplicar patch.

6. **Verificar se `sameSite: strict` quebra login local.**
   **Por quê:** decisão curta sobre comportamento de cookie.

7. **Corrigir erro de tipagem em generic simples.**
   **Por quê:** exige raciocínio TypeScript, mas escopo pequeno.

8. **Revisar retorno `404` vs `403` em endpoint específico.**
   **Por quê:** envolve semântica de API, não só código.

9. **Escolher entre `useState` e derivar valor com `useMemo`.**
   **Por quê:** pequena decisão de estado derivado.

10. **Corrigir redirect loop em uma rota protegida simples.**
    **Por quê:** bug curto, mas precisa entender condição de auth.

---

## Sonnet Medium

Use como padrão para feature comum com alguns arquivos.

1. **Criar tela de cadastro de cliente com formulário, validação e submit.**
   **Por quê:** feature comum, exige front organizado, mas não é crítica.

2. **Criar CRUD simples de categorias no NestJS.**
   **Por quê:** controller/service/DTO/repository é padrão repetível.

3. **Implementar tabela com busca, paginação e estado vazio.**
   **Por quê:** envolve várias partes, mas sem alta complexidade.

4. **Criar `domain/customer/index.tsx` e `hook.tsx` seguindo arquitetura.**
   **Por quê:** exige respeitar convenção, mas tarefa é bem delimitada.

5. **Integrar formulário com endpoint existente.**
   **Por quê:** precisa mapear dados e erros da API.

6. **Adicionar testes unitários para um service NestJS.**
   **Por quê:** teste comum com mocks previsíveis.

7. **Criar layout protegido simples no Next.js.**
   **Por quê:** tem regra de auth, mas não envolve refactor profundo.

8. **Adicionar upload simples de imagem com preview.**
   **Por quê:** lida com estado, validação e UI, mas escopo claro.

9. **Criar hook `useCustomersFilters`.**
   **Por quê:** organiza lógica de filtro sem grande risco.

10. **Padronizar mensagens de erro em uma feature.**
    **Por quê:** mudança média, mas localizada.

---

## Sonnet Medium Thinking

Use como melhor padrão geral para feature comum quando arquitetura e qualidade importam.

1. **Criar feature completa respeitando `AI/rules/*`.**
   **Por quê:** precisa ler regras e aplicar consistência, não só codar.

2. **Implementar login básico com cookie HTTP-only.**
   **Por quê:** auth exige cuidado maior que CRUD comum.

3. **Refatorar uma tela média para separar `index.tsx`, `hook.tsx`, `helpers.ts` e `constants.ts`.**
   **Por quê:** exige preservar comportamento enquanto reorganiza.

4. **Criar módulo NestJS com DTOs, service, controller e testes.**
   **Por quê:** várias peças precisam ficar coerentes.

5. **Corrigir bug envolvendo formulário + API + toast de erro.**
   **Por quê:** precisa rastrear fluxo completo do erro.

6. **Migrar uma feature simples para App Router.**
   **Por quê:** precisa respeitar server/client boundaries.

7. **Criar fluxo de onboarding em múltiplos passos.**
   **Por quê:** estado multi-step exige planejamento.

8. **Adicionar RBAC simples em uma rota.**
   **Por quê:** permissões exigem raciocínio antes de aplicar.

9. **Criar testes de regressão para uma correção média.**
   **Por quê:** precisa capturar comportamento antigo e novo.

10. **Centralizar tratamento de erro HTTP em `services/`.**
    **Por quê:** alteração estrutural moderada com impacto amplo.

---

## Sonnet High

Use para refactor, bug difícil ou integração que envolve várias partes, mas ainda não é tarefa crítica de arquitetura global.

1. **Corrigir hydration mismatch em página Next.js.**
   **Por quê:** geralmente envolve server/client render e estado inicial.

2. **Refatorar service NestJS grande em métodos menores.**
   **Por quê:** exige preservar comportamento e reduzir acoplamento.

3. **Implementar refresh token básico.**
   **Por quê:** mexe em auth, expiração e armazenamento.

4. **Corrigir bug onde cache do React Query mostra dados antigos.**
   **Por quê:** precisa entender query keys e invalidação.

5. **Criar feature front + backend + testes.**
   **Por quê:** fluxo end-to-end médio requer consistência.

6. **Revisar PR grande procurando regressões reais.**
   **Por quê:** precisa analisar impacto, não só estilo.

7. **Corrigir erro de build causado por mudança estrutural.**
   **Por quê:** pode envolver imports, client/server e tipos.

8. **Implementar webhook simples com validação de assinatura.**
   **Por quê:** integração externa exige cautela.

9. **Adicionar guards NestJS para roles simples.**
   **Por quê:** permissões precisam ser aplicadas com consistência.

10. **Otimizar tela pesada com renderizações desnecessárias.**
    **Por quê:** precisa diagnosticar causa antes de usar memoização.

---

## Sonnet High Thinking

Use para diagnóstico, bug sutil, auth/cookie, refactor seguro e análise de causa raiz.

1. **Corrigir cookie entre `content-creation.com.br` e `api.content-creation.com.br`.**
   **Por quê:** envolve domínio, `sameSite`, `secure`, CORS e credenciais.

2. **Investigar login que funciona localmente, mas falha em produção.**
   **Por quê:** provável diferença de ambiente, proxy, HTTPS ou cookie.

3. **Refatorar auth preservando sessões existentes.**
   **Por quê:** mudança sensível exige plano e validação.

4. **Corrigir teste e2e instável de cadastro/login.**
   **Por quê:** precisa distinguir bug real de timing/mock ruim.

5. **Revisar segurança de endpoints privados.**
   **Por quê:** exige raciocínio sobre acesso indevido.

6. **Diagnosticar bug intermitente em mutation assíncrona.**
   **Por quê:** pode envolver race condition ou cache.

7. **Criar plano incremental para migrar vários componentes.**
   **Por quê:** evita big bang e regressão.

8. **Corrigir `trust proxy` em NestJS atrás de Railway/Render.**
   **Por quê:** afeta cookies seguros, IP e headers encaminhados.

9. **Revisar arquitetura de uma feature antes de refatorar.**
   **Por quê:** thinking reduz chance de mover lógica para o lugar errado.

10. **Encontrar causa raiz de erro que aparece só após deploy.**
    **Por quê:** requer cruzar build, env vars, runtime e logs.

---

## Sonnet Max

Use para tarefa longa e multiarquivo quando quer execução ampla, mas sem ir direto para Opus.

1. **Implementar gestão de equipes: tela, API, DTOs, testes e permissões simples.**
   **Por quê:** feature grande, mas com domínio claro.

2. **Migrar várias telas para seu padrão `domain/*`.**
   **Por quê:** trabalho repetitivo, longo e estrutural.

3. **Padronizar camada `services/` no front inteiro.**
   **Por quê:** mexe em muitos arquivos, mas com padrão repetível.

4. **Criar dashboard completo com filtros, cards e gráficos.**
   **Por quê:** feature longa de UI + estado + dados.

5. **Adicionar testes em uma feature grande sem cobertura.**
   **Por quê:** exige mapear comportamento e criar casos consistentes.

6. **Criar módulo completo de organizações no backend.**
   **Por quê:** envolve entity/DTO/service/controller/testes.

7. **Refatorar componentes duplicados para um mini design system.**
   **Por quê:** trabalho multiarquivo com decisões repetíveis.

8. **Criar fluxo completo de convite de usuário por e-mail.**
   **Por quê:** cruza API, token, tela, estado e testes.

9. **Organizar uma pasta legada inteira.**
   **Por quê:** exige execução longa, mas não necessariamente inteligência máxima.

10. **Criar base inicial de auditoria de ações.**
    **Por quê:** envolve várias camadas, mas pode ser bem especificado.

---

## Sonnet Max Thinking

Use para tarefa longa em que planejamento ruim gera muito retrabalho.

1. **Migrar JWT em localStorage para cookies HTTP-only.**
   **Por quê:** mexe em segurança, front, backend, CORS e deploy.

2. **Reestruturar fluxo inteiro de autenticação.**
   **Por quê:** precisa planejar ordem, testes e rollback.

3. **Criar RBAC completo com guards, decorators e UI conditional rendering.**
   **Por quê:** permissões precisam ser consistentes em front e back.

4. **Migrar várias features para nova arquitetura sem quebrar imports.**
   **Por quê:** thinking ajuda a criar plano de movimentação seguro.

5. **Criar estratégia de testes e implementar cobertura inicial.**
   **Por quê:** exige decidir o que testar primeiro.

6. **Corrigir cadeia de bugs relacionados em login, refresh e logout.**
   **Por quê:** bugs podem ter causa compartilhada.

7. **Implementar webhook idempotente com logs e testes.**
   **Por quê:** precisa evitar duplicidade e efeitos colaterais.

8. **Refatorar módulo NestJS acoplado com múltiplos services.**
   **Por quê:** exige preservar contratos e reduzir dependências.

9. **Criar fluxo de onboarding com persistência parcial.**
   **Por quê:** envolve estado, recuperação, validação e UX.

10. **Diagnosticar performance ruim em feature grande antes de otimizar.**
    **Por quê:** evita otimizações aleatórias sem causa raiz.

---

## Opus Low

Use quando a tarefa é pequena, mas difícil para modelos menores ou cara de errar localmente.

1. **Corrigir tipo genérico complexo em helper TypeScript.**
   **Por quê:** pequeno escopo, alta complexidade lógica.

2. **Analisar função crítica de cálculo financeiro.**
   **Por quê:** erro numérico pequeno pode gerar prejuízo.

3. **Corrigir parser de datas com timezone.**
   **Por quê:** datas têm edge cases difíceis mesmo em código curto.

4. **Revisar lógica de expiração de token.**
   **Por quê:** auth local pequena, mas sensível.

5. **Corrigir query SQL/GORM complexa isolada.**
   **Por quê:** exige raciocínio sobre joins/filtros.

6. **Analisar reducer com muitos estados.**
   **Por quê:** escopo único, mas transições podem ser sutis.

7. **Diagnosticar bug específico de serialização.**
   **Por quê:** envolve formato de dado e contrato.

8. **Corrigir teste que falha por ordem de execução.**
   **Por quê:** timing e setup exigem precisão.

9. **Verificar se uma função é idempotente.**
   **Por quê:** conceito simples, impacto técnico importante.

10. **Encontrar falha lógica em validação condicional.**
    **Por quê:** bug pequeno pode deixar dado inválido entrar.

---

## Opus Low Thinking

Use para problema pequeno, difícil e delicado, quando você quer diagnóstico antes do patch.

1. **Descobrir por que token expira antes do esperado.**
   **Por quê:** pode envolver timezone, relógio, maxAge e assinatura.

2. **Analisar redirect loop em auth guard.**
   **Por quê:** exige raciocinar sobre estados autenticado/não autenticado.

3. **Validar se uma migration SQL preserva dados.**
   **Por quê:** escopo pequeno, mas perda de dado é crítica.

4. **Corrigir bug onde usuário vê recurso de outra organização.**
   **Por quê:** bug de autorização é sensível mesmo localizado.

5. **Analisar edge case de CSRF em endpoint específico.**
   **Por quê:** segurança exige julgamento, não só sintaxe.

6. **Corrigir função de retry que duplica requisições.**
   **Por quê:** pode gerar efeitos colaterais externos.

7. **Revisar webhook handler pequeno, mas crítico.**
   **Por quê:** duplicidade ou ordem errada pode quebrar dados.

8. **Encontrar bug em cálculo de permissão herdada.**
   **Por quê:** lógica pequena com impacto grande.

9. **Analisar por que uma transação não faz rollback.**
   **Por quê:** exige entender controle de erro e DB.

10. **Criar patch mínimo para bug em produção.**
    **Por quê:** thinking ajuda a não reescrever demais sob risco.

---

## Opus Medium

Use para arquitetura, migração moderada e debug complexo.

1. **Desenhar arquitetura de auth para front + API.**
   **Por quê:** envolve cookies, sessões, refresh, CORS e segurança.

2. **Refatorar módulo NestJS grande com dependências cruzadas.**
   **Por quê:** exige separar responsabilidades sem quebrar contratos.

3. **Planejar migração de MongoDB para Postgres em um módulo.**
   **Por quê:** envolve schema, dados, queries e rollback.

4. **Criar estrutura de monorepo simples.**
   **Por quê:** decisão arquitetural com impacto futuro.

5. **Projetar RBAC escalável.**
   **Por quê:** permissões mal modeladas viram dívida técnica.

6. **Corrigir bug que envolve banco, API e frontend.**
   **Por quê:** precisa raciocinar entre camadas.

7. **Revisar modelo de dados antes de implementar feature.**
   **Por quê:** erro em modelagem custa caro depois.

8. **Criar estratégia de feature flags.**
   **Por quê:** envolve deploy seguro e controle de comportamento.

9. **Organizar fronteiras entre módulos NestJS.**
   **Por quê:** evita acoplamento e import circular.

10. **Criar abstração para providers externos.**
    **Por quê:** facilita trocar Resend/Gmail/provider sem reescrever tudo.

---

## Opus Medium Thinking

Use quando existem trade-offs reais e a decisão importa tanto quanto o código.

1. **Escolher entre sessão server-side e JWT stateless.**
   **Por quê:** muda segurança, escalabilidade e complexidade.

2. **Definir arquitetura definitiva de `domain/`, `services/`, `hooks/` e `context/`.**
   **Por quê:** decisão afeta todo o frontend.

3. **Planejar migração incremental sem big bang.**
   **Por quê:** reduz risco de quebrar produto inteiro.

4. **Avaliar Prisma vs TypeORM/GORM para um projeto específico.**
   **Por quê:** depende de stack, equipe, queries e deploy.

5. **Projetar cache com React Query para múltiplas telas.**
   **Por quê:** cache mal desenhado causa bugs difíceis.

6. **Definir fronteiras de módulos em NestJS.**
   **Por quê:** evita acoplamento, import circular e service gigante.

7. **Planejar multi-tenant básico.**
   **Por quê:** isolamento de dados precisa ser pensado antes.

8. **Criar estratégia de testes para legado sem cobertura.**
   **Por quê:** precisa priorizar fluxos de maior risco.

9. **Comparar opções de deploy para API NestJS.**
   **Por quê:** infra afeta cookies, domínio, cold start e custo.

10. **Desenhar fluxo de webhook com idempotência.**
    **Por quê:** exige decidir chaves, retries, logs e falhas.

---

## Opus High

Use quando o erro custa caro: segurança, dados, produção, permissões, refactor crítico.

1. **Auditar endpoints privados por falha de autorização.**
   **Por quê:** vazamento de dados é risco alto.

2. **Refatorar auth em produção.**
   **Por quê:** erro pode derrubar login de todos.

3. **Corrigir vazamento de dados entre tenants.**
   **Por quê:** problema crítico de segurança e privacidade.

4. **Migrar schema de banco com dados reais.**
   **Por quê:** perda/corrupção de dados é difícil de reverter.

5. **Implementar audit logs para ações sensíveis.**
   **Por quê:** precisa capturar eventos certos sem vazar dados.

6. **Revisar PR grande que altera permissões.**
   **Por quê:** regressão pode liberar acesso indevido.

7. **Corrigir race condition em fila.**
   **Por quê:** bugs concorrentes são difíceis e perigosos.

8. **Criar plano de rollback para deploy crítico.**
   **Por quê:** produção exige saída segura se algo der errado.

9. **Reestruturar backend modular grande.**
   **Por quê:** mudança ampla com risco de quebrar integrações.

10. **Corrigir problema de sessão em múltiplos domínios.**
    **Por quê:** envolve segurança, UX e deploy.

---

## Opus High Thinking

Use para problemas críticos que exigem causa raiz, riscos, plano e validação.

1. **Auditar fluxo completo de cookies, CORS, CSRF e refresh token.**
   **Por quê:** vários mecanismos de segurança interagem entre si.

2. **Investigar bug de produção sem logs completos.**
   **Por quê:** exige inferência cuidadosa e hipóteses testáveis.

3. **Planejar migração de dados com validação antes/depois.**
   **Por quê:** thinking reduz risco de perda silenciosa.

4. **Corrigir inconsistência entre frontend, API e banco.**
   **Por quê:** causa raiz pode estar em qualquer camada.

5. **Revisar segurança de multi-tenant.**
   **Por quê:** isolamento precisa ser garantido em queries e permissões.

6. **Analisar regressão após refactor grande.**
   **Por quê:** precisa comparar comportamento antes/depois.

7. **Corrigir bug de autorização que só ocorre com role específica.**
   **Por quê:** combina edge case de regra com risco alto.

8. **Criar patch seguro para incidente em produção.**
   **Por quê:** não pode trocar arquitetura inteira durante incidente.

9. **Validar PR que altera autenticação e banco.**
   **Por quê:** duas áreas críticas no mesmo PR exigem revisão profunda.

10. **Desenhar plano de decomposição de módulo legado crítico.**
    **Por quê:** thinking ajuda a quebrar em etapas seguras.

---

## Opus Extra High

Use para tarefa muito difícil, longa, ambígua ou que já falhou em Sonnet/Opus menor.

1. **Reestruturar sistema inteiro de autenticação.**
   **Por quê:** envolve segurança, sessões, front, backend e deploy.

2. **Criar arquitetura multi-tenant robusta.**
   **Por quê:** isolamento de dados precisa ser projetado profundamente.

3. **Resolver bug persistente que modelos menores não encontraram.**
   **Por quê:** aumenta chance de análise mais profunda.

4. **Refatorar módulo legado grande sem cobertura.**
   **Por quê:** precisa preservar comportamento enquanto cria segurança.

5. **Criar migração de banco com compatibilidade temporária.**
   **Por quê:** exige rodar versão antiga e nova durante transição.

6. **Auditar codebase por vulnerabilidades de auth/permissão.**
   **Por quê:** trabalho amplo e crítico.

7. **Projetar sistema de eventos assíncronos.**
   **Por quê:** envolve filas, retries, idempotência e observabilidade.

8. **Reorganizar monorepo com múltiplos apps.**
   **Por quê:** impacto estrutural em build, imports e deploy.

9. **Criar base técnica de SaaS B2B do zero.**
   **Por quê:** muitas decisões fundacionais precisam ser coerentes.

10. **Corrigir cadeia de bugs em produção após refactor grande.**
    **Por quê:** exige diagnóstico amplo e correções ordenadas.

---

## Opus Extra High Thinking

Use para tarefa extremamente complexa em que você quer análise profunda antes de execução longa.

1. **Planejar e executar migração de banco sem perda de dados.**
   **Por quê:** requer inventário, plano, validação e rollback.

2. **Auditar segurança completa de auth e permissões.**
   **Por quê:** precisa buscar falhas sistêmicas, não só bugs locais.

3. **Projetar multi-tenant com isolamento forte.**
   **Por quê:** erro de modelagem pode vazar dados entre clientes.

4. **Reescrever módulo crítico mantendo API pública igual.**
   **Por quê:** exige compatibilidade e testes de regressão.

5. **Criar arquitetura de billing/eventos/webhooks.**
   **Por quê:** combina dinheiro, idempotência e auditoria.

6. **Investigar race condition sem causa óbvia.**
   **Por quê:** precisa formular hipóteses e validar por evidência.

7. **Criar plano de migração de infraestrutura.**
   **Por quê:** domínio, cookies, env vars e deploy precisam casar.

8. **Analisar projeto inteiro antes de grande refactor.**
   **Por quê:** thinking evita mover peças sem entender dependências.

9. **Criar estratégia técnica completa para produto SaaS.**
   **Por quê:** decisões de base afetam meses de desenvolvimento.

10. **Corrigir inconsistência histórica de dados.**
    **Por quê:** precisa entender origem, impacto e correção segura.

---

## Opus Max

Use como último recurso para tarefa crítica, enorme ou muito difícil. Não use para tarefas normais.

1. **Refatorar backend inteiro mantendo compatibilidade.**
   **Por quê:** grande impacto e muitas dependências ocultas.

2. **Resolver bug crítico que bloqueia produção.**
   **Por quê:** qualidade vale mais que custo/latência.

3. **Projetar arquitetura completa de SaaS multi-tenant.**
   **Por quê:** precisa tomar decisões fundacionais difíceis.

4. **Auditar segurança antes de lançamento.**
   **Por quê:** falhas podem virar incidente real.

5. **Reestruturar banco com muitos relacionamentos.**
   **Por quê:** modelagem errada gera dívida e risco de dados.

6. **Revisar PR enorme de auth/permissões/banco.**
   **Por quê:** várias áreas críticas no mesmo escopo.

7. **Diagnosticar vazamento de dados.**
   **Por quê:** incidente grave exige raciocínio máximo.

8. **Reescrever módulo legado sem testes confiáveis.**
   **Por quê:** precisa reconstruir entendimento antes de editar.

9. **Criar plano completo de recuperação técnica.**
   **Por quê:** exige priorização, sequência e mitigação.

10. **Resolver problema que Sonnet e Opus High não resolveram.**
    **Por quê:** é justificável gastar o máximo quando tentativas menores falharam.

---

## Opus Max Thinking

Use para o caso mais extremo: crítico, ambíguo, longo, difícil e caro de errar.

1. **Reestruturar todo o sistema de auth com plano de rollback.**
   **Por quê:** precisa maximizar segurança e reduzir risco operacional.

2. **Investigar vazamento de dados entre organizações.**
   **Por quê:** exige rastrear queries, permissões, cache e logs.

3. **Planejar migração de banco complexa com zero perda.**
   **Por quê:** precisa validação, fallback e compatibilidade.

4. **Projetar billing completo com eventos idempotentes.**
   **Por quê:** dinheiro + webhooks + duplicidade exigem rigor máximo.

5. **Auditar codebase inteira por falhas de autorização.**
   **Por quê:** precisa encontrar padrões sistêmicos, não só bugs óbvios.

6. **Resolver bug intermitente envolvendo fila, banco e cache.**
   **Por quê:** múltiplas camadas e timing tornam o problema difícil.

7. **Reescrever módulo crítico preservando comportamento externo.**
   **Por quê:** precisa equivalência funcional e testes fortes.

8. **Criar arquitetura técnica completa para produto que vai escalar.**
   **Por quê:** decisões erradas viram custo alto por meses.

9. **Revisar PR gigante antes de merge em produção.**
   **Por quê:** último filtro antes de risco real.

10. **Corrigir incidente em produção com análise de causa raiz.**
    **Por quê:** precisa resolver agora e impedir recorrência.

---

# CODEX DA OPENAI

---

## Codex 5.4 low

Use para tarefas mecânicas e baratas. Melhor quando você quer economizar créditos.

1. **Corrigir lint em arquivos pequenos.**
   **Por quê:** tarefa automática, fácil de validar.

2. **Remover imports e variáveis não usados.**
   **Por quê:** não exige julgamento técnico profundo.

3. **Renomear componente e ajustar imports.**
   **Por quê:** mudança textual e localizada.

4. **Criar componente visual simples sem estado.**
   **Por quê:** baixo risco e padrão repetível.

5. **Adicionar campo simples em formulário existente.**
   **Por quê:** alteração direta em UI/schema/submit.

6. **Criar interface TypeScript pequena.**
   **Por quê:** transformação mecânica de shape de dados.

7. **Atualizar textos de UI.**
   **Por quê:** não envolve lógica.

8. **Criar mock data para desenvolvimento.**
   **Por quê:** não mexe em produção nem regra de negócio.

9. **Adicionar `.env.example`.**
   **Por quê:** documentação simples baseada no código.

10. **Ajustar classes Tailwind de espaçamento.**
    **Por quê:** mudança visual pequena e reversível.

---

## Codex 5.4 medium

Use como padrão econômico para feature comum.

1. **Criar CRUD básico de clientes.**
   **Por quê:** padrão comum com controller/service/tela.

2. **Criar tela de listagem com busca e paginação.**
   **Por quê:** média complexidade, mas bem delimitada.

3. **Criar formulário com Zod e React Hook Form.**
   **Por quê:** integração comum no frontend.

4. **Adicionar endpoint NestJS com DTO e teste simples.**
   **Por quê:** segue convenções previsíveis.

5. **Criar hook para filtros de tabela.**
   **Por quê:** lógica moderada e isolada.

6. **Integrar tela com service HTTP existente.**
   **Por quê:** envolve dados reais, mas contrato claro.

7. **Criar loading, empty state e error state.**
   **Por quê:** UI assíncrona padrão.

8. **Adicionar testes unitários a uma feature pequena.**
   **Por quê:** exige alguma análise, mas não arquitetura profunda.

9. **Mover lógica de componente para `hook.tsx`.**
   **Por quê:** refactor simples seguindo padrão definido.

10. **Criar service `customersService` centralizado.**
    **Por quê:** organização comum de chamadas API.

---

## Codex 5.4 high

Use quando quer economizar em relação ao 5.5, mas a tarefa exige diagnóstico ou cuidado.

1. **Corrigir bug de cache do React Query.**
   **Por quê:** precisa entender query keys e invalidação.

2. **Refatorar uma feature média.**
   **Por quê:** envolve preservar comportamento enquanto reorganiza.

3. **Corrigir hydration mismatch simples.**
   **Por quê:** exige entender server/client boundary.

4. **Ajustar CORS para múltiplos origins.**
   **Por quê:** pequeno erro pode bloquear frontend.

5. **Criar refresh token básico.**
   **Por quê:** auth exige mais cuidado que CRUD.

6. **Revisar PR médio procurando regressões.**
   **Por quê:** análise de impacto é maior que lint.

7. **Corrigir build quebrado por reorganização de pastas.**
   **Por quê:** pode envolver imports, aliases e client/server.

8. **Criar testes de integração para endpoint.**
   **Por quê:** precisa validar fluxo real, não função isolada.

9. **Melhorar tipagem de módulo com generics.**
   **Por quê:** TypeScript avançado exige raciocínio.

10. **Implementar RBAC simples.**
    **Por quê:** permissões têm risco maior que UI comum.

---

## Codex 5.4 extra high

Use para tarefa grande quando custo ainda importa e o risco não justifica 5.5 extra high.

1. **Migrar várias telas para sua arquitetura `domain/`.**
   **Por quê:** trabalho longo e repetitivo, com padrão claro.

2. **Criar feature completa front + backend + testes.**
   **Por quê:** execução multiarquivo com complexidade moderada.

3. **Padronizar tratamento de erro no front.**
   **Por quê:** impacto amplo, mas objetivo definido.

4. **Refatorar camada `services/` inteira.**
   **Por quê:** mexe em muitos arquivos e chamadas.

5. **Criar módulo NestJS completo.**
   **Por quê:** controller/service/DTO/testes/entity exigem coerência.

6. **Adicionar testes em uma feature grande.**
   **Por quê:** precisa entender comportamento existente.

7. **Criar fluxo completo de convite por e-mail.**
   **Por quê:** envolve token, API, tela e estado.

8. **Organizar código legado de uma feature.**
   **Por quê:** refactor grande, mas não necessariamente crítico.

9. **Implementar dashboard com filtros e gráficos.**
   **Por quê:** longa execução de UI e dados.

10. **Corrigir vários bugs relacionados em uma área.**
    **Por quê:** precisa tratar a área como conjunto, não patches soltos.

---

## Codex 5.5 low

Use para tarefa pequena em que você quer mais precisão que 5.4 low.

1. **Corrigir bug pequeno em validação condicional.**
   **Por quê:** escopo curto, mas edge case importa.

2. **Ajustar componente com regra de negócio leve.**
   **Por quê:** não é só visual; precisa respeitar comportamento.

3. **Criar helper com casos de borda.**
   **Por quê:** 5.5 tende a ser mais confiável em edge cases.

4. **Revisar pequeno trecho de auth.**
   **Por quê:** segurança mesmo pequena merece mais cuidado.

5. **Corrigir problema de timezone localizado.**
   **Por quê:** datas geram bugs sutis.

6. **Criar teste para bug já conhecido.**
   **Por quê:** precisa capturar exatamente o caso quebrado.

7. **Corrigir mapper que perde campo obrigatório.**
   **Por quê:** contrato de dados precisa ficar certo.

8. **Ajustar formulário sem quebrar UX.**
   **Por quê:** pequenos detalhes podem afetar submissão.

9. **Melhorar tipagem de componente reutilizável.**
   **Por quê:** tipagem incorreta se espalha.

10. **Corrigir estado duplicado em hook simples.**
    **Por quê:** exige raciocínio sobre fonte da verdade.

---

## Codex 5.5 medium

Use como daily driver premium: melhor qualidade sem ir para high.

1. **Implementar feature comum end-to-end.**
   **Por quê:** 5.5 medium equilibra qualidade, custo e confiabilidade.

2. **Criar tela + hook + service + testes.**
   **Por quê:** várias peças precisam seguir mesma intenção.

3. **Criar módulo NestJS seguindo arquitetura.**
   **Por quê:** estrutura precisa ficar consistente.

4. **Refatorar feature média seguindo `AI/rules/*`.**
   **Por quê:** precisa obedecer regras e preservar comportamento.

5. **Criar fluxo de login/cadastro comum.**
   **Por quê:** auth simples ainda exige cautela.

6. **Integrar front e backend com tratamento de erro.**
   **Por quê:** contratos e erros precisam casar.

7. **Criar dashboard com filtros.**
   **Por quê:** média complexidade em estado e dados.

8. **Adicionar testes de integração básicos.**
   **Por quê:** valida comportamento entre camadas.

9. **Revisar PR médio.**
   **Por quê:** bom equilíbrio para achar bugs sem gastar high.

10. **Padronizar organização de uma pasta `domain/`.**
    **Por quê:** exige julgamento arquitetural moderado.

---

## Codex 5.5 high

Use para bug difícil, auth, produção, refactor sensível e tarefas de alto valor.

1. **Corrigir CORS + cookie + `sameSite` entre front e API.**
   **Por quê:** várias configurações interagem e quebram fácil.

2. **Implementar refresh token com rotação.**
   **Por quê:** segurança e expiração exigem rigor.

3. **Corrigir bug intermitente em produção.**
   **Por quê:** precisa investigar causa raiz, não chutar.

4. **Refatorar fluxo crítico de auth.**
   **Por quê:** erro pode derrubar login ou abrir acesso.

5. **Revisar segurança de endpoints privados.**
   **Por quê:** risco de autorização indevida.

6. **Implementar webhook idempotente.**
   **Por quê:** duplicidade pode gerar efeitos colaterais graves.

7. **Migrar parte do banco com dados reais.**
   **Por quê:** alteração sensível exige validação.

8. **Corrigir teste e2e instável.**
   **Por quê:** precisa separar flaky test de bug real.

9. **Diagnosticar problema de performance.**
   **Por quê:** high ajuda a investigar antes de otimizar.

10. **Criar RBAC robusto.**
    **Por quê:** permissões precisam funcionar em todas as camadas.

---

## Codex 5.5 extra high

Use para tarefa crítica, muito difícil, longa, ambígua ou que já falhou antes.

1. **Reestruturar autenticação inteira.**
   **Por quê:** envolve segurança, UX, backend, frontend e deploy.

2. **Auditar segurança completa do backend.**
   **Por quê:** precisa procurar padrões de falha em muitos arquivos.

3. **Criar arquitetura multi-tenant.**
   **Por quê:** isolamento de dados exige decisão profunda.

4. **Migrar banco com risco de perda de dados.**
   **Por quê:** precisa plano, validação e rollback.

5. **Resolver bug crítico que só aparece em produção.**
   **Por quê:** alta incerteza e alto impacto.

6. **Refatorar módulo legado sem testes confiáveis.**
   **Por quê:** precisa entender antes de alterar.

7. **Projetar billing/eventos/webhooks.**
   **Por quê:** combina dinheiro, idempotência, retries e auditoria.

8. **Revisar PR gigante de auth/permissões/banco.**
   **Por quê:** múltiplas áreas críticas no mesmo escopo.

9. **Corrigir vazamento de dados entre organizações.**
   **Por quê:** incidente grave exige análise máxima.

10. **Resolver tarefa que falhou em 5.5 high.**
    **Por quê:** se high falhou, extra high justifica o custo adicional.

---

# Mapa final de equivalência prática

| Se você pensou em usar... | Equivalente prático no outro lado |
| ------------------------- | --------------------------------- |
| Haiku                     | Codex 5.4 low                     |
| Haiku Thinking            | Codex 5.5 low ou 5.4 high         |
| Sonnet Low                | Codex 5.4 low/medium              |
| Sonnet Low Thinking       | Codex 5.4 high                    |
| Sonnet Medium             | Codex 5.4 medium                  |
| Sonnet Medium Thinking    | Codex 5.5 medium                  |
| Sonnet High               | Codex 5.4 high ou 5.5 medium      |
| Sonnet High Thinking      | Codex 5.5 high                    |
| Sonnet Max                | Codex 5.4 extra high ou 5.5 high  |
| Sonnet Max Thinking       | Codex 5.5 high/extra high         |
| Opus Low                  | Codex 5.5 medium                  |
| Opus Low Thinking         | Codex 5.5 high                    |
| Opus Medium               | Codex 5.5 high                    |
| Opus Medium Thinking      | Codex 5.5 high                    |
| Opus High                 | Codex 5.5 extra high              |
| Opus High Thinking        | Codex 5.5 extra high              |
| Opus Extra High           | Codex 5.5 extra high              |
| Opus Extra High Thinking  | Codex 5.5 extra high              |
| Opus Max                  | Codex 5.5 extra high              |
| Opus Max Thinking         | Codex 5.5 extra high              |

---

# Política prática de uso para economizar

## Fluxo recomendado

1. **Comece baixo quando a tarefa for mecânica.**
   Exemplo: Haiku ou Codex 5.4 low.

2. **Use medium para feature comum.**
   Exemplo: Sonnet Medium ou Codex 5.4/5.5 medium.

3. **Suba para high quando houver bug, refactor ou integração sensível.**
   Exemplo: Sonnet High Thinking ou Codex 5.5 high.

4. **Use extra high/max apenas quando o custo de errar for maior que o custo do modelo.**
   Exemplo: Opus Max Thinking ou Codex 5.5 extra high.

## Não desperdice modelo forte com

- Ajuste de texto.
- Rename simples.
- Lint.
- Boilerplate óbvio.
- Componente visual sem lógica.
- Mock data.
- README curto.
- Pequena troca de classe CSS.

## Não use modelo fraco para

- Auth.
- Cookies cross-domain.
- CSRF.
- CORS de produção.
- Permissões.
- Multi-tenant.
- Migração de banco.
- Pagamento/billing.
- Webhook idempotente.
- Bug intermitente.
- Refactor grande sem testes.
- Segurança.

---

# Minha regra final

- **Claude Code:** use **Sonnet Medium Thinking** como padrão premium, **Sonnet High Thinking** para bug/refactor, **Opus High/Extra High Thinking** para risco alto.
- **Codex:** use **5.4 medium** para economizar, **5.5 medium** como padrão de qualidade, **5.5 high** para bug/refactor/auth, **5.5 extra high** para tarefa crítica.

Se a tarefa mexe em **auth, permissões, cookie, CORS, banco, produção ou dados de usuário**, não economize demais.
