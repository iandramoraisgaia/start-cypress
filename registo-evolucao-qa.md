# Registo de Evolução — QA / Cypress

Log pessoal de problemas reais encontrados e resolvidos, para três fins:
1. Acompanhar a minha evolução técnica ao longo do curso.
2. Ter uma referência rápida para não repetir o mesmo erro duas vezes.
3. Conseguir explicar o meu trabalho com clareza a um colega ou numa entrevista.

---

## Como preencher uma entrada nova

Copia este bloco para cada problema novo que resolveres:

```markdown
## [DD/MM/AAAA] — Título curto do problema

**Contexto:** o que estava a tentar fazer.

**Problema:** o erro ou sintoma exato (cola a mensagem, se fizer sentido).

**Investigação:** o que testei/verifiquei para perceber a causa.

**Causa raiz:** o que estava realmente errado (não confundir com o sintoma).

**Solução:** o que mudei para resolver.

**Aprendizagem:** o que levo daqui para não repetir o erro.
```

**Dica para entrevistas:** este formato já segue a lógica de perguntas comportamentais tipo "conta-me sobre um problema técnico que resolveste" — contexto, o que fizeste, resultado. Ao preencheres aqui, já estás a preparar a resposta.

---

## Exemplos reais desta sessão (já preenchidos)

## 20/07/2026 — Campos sem atributo único no OrangeHRM

**Contexto:** a tentar construir seletores Cypress fiáveis para o formulário Personal Details.

**Problema:** vários campos (Employee Id, Driver's License, License Expiry Date) não tinham `name` nem `id`, só uma classe genérica partilhada por dezenas de elementos.

**Investigação:** usei o inspetor do browser e `Ctrl+F` dentro do painel Elements para contar quantas vezes cada atributo aparecia na página. Confirmei que a classe repetia 10 vezes e o placeholder 2 vezes — nenhum dos dois era único sozinho.

**Causa raiz:** o site não fornece identificadores únicos para a maioria dos campos deste formulário.

**Solução:** defini uma ordem de prioridade de seletores (atributo único → label + `cy.contains().find()` → índice `.eq()` como último recurso) e apliquei-a caso a caso.

**Aprendizagem:** não existe "o seletor certo" universal — existe uma hierarquia de robustez, e escolher bem exige perceber o que está realmente disponível no DOM antes de escrever código.

---

## 20/07/2026 — Atributo `xpath="1"` falso, injetado por extensão

**Contexto:** a tentar perceber que atributo usar para um campo de data.

**Problema:** via um atributo `xpath="1"` no inspetor que parecia útil, mas não sabia se era do site ou de uma ferramenta.

**Investigação:** desativei a extensão de inspeção de seletores em `chrome://extensions` e recarreguei a página — o atributo desapareceu.

**Causa raiz:** a extensão instalada estava a injetar atributos falsos no DOM só para ajuda visual; não existiam no HTML real do site.

**Solução:** ignorei esse atributo e usei uma estratégia baseada em atributos reais do site.

**Aprendizagem:** nunca confiar num atributo "estranho" sem confirmar a origem — testar desativando a ferramenta é rápido e definitivo.

---

## 20/07/2026 — Erro "elemento coberto por outro elemento"

**Contexto:** teste a tentar limpar e escrever num campo de data.

**Problema:** `cy.clear()` falhava com "this element is being covered by another element" — um calendário/dropdown sobrepunha o campo.

**Investigação:** percebi que era um erro do sistema de "actionability checks" do Cypress — verifica se o elemento está mesmo clicável na posição real, não só se existe no HTML.

**Causa raiz:** um componente da página (calendário, cabeçalho fixo) ficava visualmente por cima do campo no momento da ação.

**Solução:** usei `{force: true}` como solução pragmática depois de confirmar (por tentativa) que não era um bloqueio real de interação, apenas um falso positivo da verificação.

**Aprendizagem:** perceber a *categoria* do erro (timing vs. estrutura vs. seletor) poupa muito tempo de tentativa-erro — cada categoria tem uma solução diferente.

---

## 20/07/2026 — Bug de índices trocados (`.eq()`)

**Contexto:** a preencher vários campos com `.eq(indice)` sobre um seletor genérico partilhado.

**Problema:** os valores apareciam nos campos errados (ex: texto do "Nickname" a aparecer no campo "Employee Id").

**Investigação:** comparei, campo a campo, o valor que o teste tentou escrever com o valor que realmente apareceu no ecrã, e reconstruí o mapeamento real de índices.

**Causa raiz:** o campo "Nickname" (que eu assumia existir) não existe nesta configuração do site — isso desalinhava todos os índices seguintes em uma posição.

**Solução:** corrigi o mapeamento de índices com base na evidência real (o que realmente apareceu em cada campo), em vez de assumir a ordem.

**Aprendizagem:** seletores por índice são frágeis exatamente por isto — qualquer mudança na quantidade de elementos anteriores desalinha tudo o que vem a seguir.

---

## 20/07/2026 — `.gitignore` não estava a funcionar (CRLF vs LF)

**Contexto:** a tentar impedir que `node_modules` e `package-lock.json` fossem enviados para o GitHub.

**Problema:** mesmo com o `.gitignore` com o conteúdo certo, `git status` continuava a mostrar `package-lock.json` como ficheiro por rastrear.

**Investigação:** usei `git check-ignore -v package-lock.json`, que devolveu vazio — confirmando que o ficheiro não estava a ser reconhecido pelo padrão do `.gitignore`.

**Causa raiz:** o ficheiro `.gitignore` estava guardado com quebras de linha `CRLF` (padrão Windows) em vez de `LF`, o que acrescentava um caracter invisível ao fim de cada linha e impedia a correspondência exata do nome do ficheiro.

**Solução:** mudei a codificação de quebra de linha do ficheiro para `LF` no VS Code e voltei a testar.

**Aprendizagem:** quando uma configuração "parece certa" mas não funciona, vale a pena verificar a codificação/formato do ficheiro, não só o conteúdo visível.

---

## 20/07/2026 — Push recusado com erro 403 (permissões Git)

**Contexto:** a tentar enviar (`git push`) um commit para o repositório de exemplo fornecido pelo professor.

**Problema:** `remote: Permission ... denied ... 403`.

**Investigação:** percebi que o repositório pertencia à organização/professor, não à minha conta — eu tinha clonado, mas não tinha permissão de escrita.

**Causa raiz:** faltava um fork (cópia própria do repositório) antes de tentar contribuir.

**Solução:** criei um fork na minha conta GitHub, redirecionei o `remote origin` local para o meu fork, e voltei a fazer push com sucesso.

**Aprendizagem:** este é o fluxo real de contribuição em open source e em muitas empresas — fork, branch, commit, pull request. Já pratiquei o ciclo completo.

## 12/08/2026 — Typo no seletor (singup vs signup)

**Contexto:** a escrever o teste de registo de novo usuário no RWA, clique no botão "Sign Up".

**Problema:** `AssertionError: Timed out retrying... Expected to find element: [data-test="singup-submit"], but never found it.`

**Investigação:** comparei o seletor letra a letra com os outros já usados no mesmo teste (`signup-username`, `signup-password`).

**Causa raiz:** erro de digitação — escrevi `singup` em vez de `signup`.

**Solução:** corrigi a string do seletor.

**Aprendizagem:** quando um seletor "correto" não é encontrado, comparar caractere a caractere com seletores irmãos que já funcionam é mais rápido do que assumir que o atributo não existe.

---

## 12/08/2026 — npm install falhou com ERESOLVE (conflito de peer dependencies)

**Contexto:** a instalar o Chance.js no projeto `cypress-realworld-app` para gerar dados de teste dinâmicos.

**Problema:** `npm error ERESOLVE could not resolve` — conflito entre versões de `vite` exigidas por diferentes pacotes do próprio projeto.

**Investigação:** o erro apontava para dependências internas do projeto (vite-plugin-istanbul vs vitest), não para o pacote que eu estava a instalar.

**Causa raiz:** o npm mais recente valida peer dependencies de forma mais rígida, e o projeto RWA já tinha conflitos internos antes mesmo do meu install.

**Solução:** usei `npm install chance --save-dev --legacy-peer-deps` para instruir o npm a ignorar esses conflitos.

**Aprendizagem:** `--legacy-peer-deps` é seguro quando o conflito é entre pacotes já existentes no projeto e não envolve o pacote que estou a instalar.

---

## 12/08/2026 — cy.type() com valor undefined

**Contexto:** a tentar deixar um campo do formulário de registo propositadamente vazio, para testar validação de campo obrigatório.

**Problema:** `CypressError: cy.type() can only accept a string or number. You passed in: undefined`

**Investigação:** percebi que a linha `.type()` continuava no código, só sem argumento lá dentro.

**Causa raiz:** para deixar um campo vazio no teste, a linha do `.type()` não deve existir — chamá-la sem valor não é o mesmo que "não preencher".

**Solução:** apaguei a linha inteira do `.type()` para esse campo.

**Aprendizagem:** "campo vazio" no teste = ausência da ação, não uma ação com valor vazio/undefined.

---

## 12/08/2026 — Validação só aparece depois do campo ser "tocado"

**Contexto:** teste de registo com campo obrigatório vazio — esperava ver a mensagem de erro só por o campo estar vazio.

**Problema:** `AssertionError: Timed out retrying... Expected to find element: #confirmPassword-helper-text, but never found it.`

**Investigação:** percebi que a mensagem de erro só é renderizada depois do campo receber foco e depois perder foco (comportamento comum em formulários com Formik/validação "touched-based").

**Causa raiz:** o campo nunca tinha sido focado no teste, por isso a validação nunca disparava.

**Solução:** adicionei `.focus().blur()` no campo antes de verificar a mensagem de erro.

**Aprendizagem:** campo vazio ≠ campo validado. Muitos formulários só validam depois de interação (touched), não continuamente.

**Aprendizagem:** nunca usar `git add .` sem antes correr `git status` para confirmar exatamente o que vai ser incluído. Preferir `git add <ficheiro>` específico. Nota extra: ficheiros que ficam staged não se "limpam" sozinhos entre comandos — por isso o `send-cash.spec.js`, staged mais cedo, acabou dentro do commit seguinte ("Stop tracking local database state"), mesmo sem eu mandar explicitamente.

## 14/08/2026 — Modal de onboarding bloqueava interação, force:true não resolveu tudo

**Contexto:** teste de "sem transações anteriores" — utilizador novo, criado via signup dentro do próprio teste.

**Problema:** um modal obrigatório ("Get Started with Real World App") aparecia após o primeiro login, sem botão de fechar, bloqueando cliques mesmo com `{force: true}`.

**Investigação:** o `{force: true}` conseguiu clicar no separador "Mine" por trás do modal, mas o conteúdo continuava invisível — o modal escondia genuinamente o conteúdo (não era só sobreposição visual).

**Causa raiz:** para utilizadores novos, a app exige criação de conta bancária antes de liberar o resto da interface — não há atalho, é um fluxo obrigatório.

**Solução:** completei o fluxo real (clicar "Next", preencher conta bancária, submeter, clicar "Done") dentro do próprio teste, antes de continuar para a verificação de transações.

**Aprendizagem:** nem todo bloqueio visual se resolve com `{force: true}` — quando o elemento está genuinamente escondido (não só coberto), é preciso completar o fluxo real da aplicação.

---

## 14/08/2026 — Mesmo campo, atributos diferentes (data-test vs id vs placeholder)

**Contexto:** a preencher o formulário de conta bancária (Bank Name, Routing Number, Account Number).

**Problema:** `data-test` funcionava nuns campos e não noutros; tentativas de adivinhar o nome do atributo (incluindo copiar da caixa de pesquisa do DevTools) davam seletores errados ou demasiado genéricos (ex: `data-layer="Content"`).

**Investigação:** inspecionei o HTML real de um dos inputs e vi que tinha `id`, `name` E `placeholder`, mas não necessariamente `data-test` em todos.

**Causa raiz:** nem todos os campos da mesma aplicação seguem o mesmo padrão de atributos — é preciso confirmar campo a campo, não assumir.

**Solução:** usei `placeholder` como alternativa rápida e fiável quando `data-test`/`id` não eram consistentes.

**Aprendizagem:** ter uma hierarquia de seletores (data-test > id > name > placeholder > texto) e testar a próxima opção rapidamente quando uma falha, em vez de insistir a adivinhar variações do mesmo atributo.