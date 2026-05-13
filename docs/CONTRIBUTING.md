# Contribuindo

## Convenções

### Branches

- `main` → estável, sempre deployável
- `develop` → integração
- `feat/<assunto>` · `fix/<assunto>` · `chore/<assunto>` para PRs

### Commits

Conventional Commits (validado por commitlint):

```
feat(scope): adiciona endpoint de narrativas
fix(api): corrige cálculo de IVN para zero matérias
docs: atualiza ARCHITECTURE.md
chore(deps): bump nestjs to 10.4.5
```

### Code style

- Prettier formata · ESLint valida (rodam no `pre-commit`)
- 100 chars por linha
- Nomes em inglês para código, português aceito em comentários e docs
- Imports ordenados: builtin → external → @scope → relative
- Nunca commitar `console.log` (a não ser em scripts/dev)

### Testes

- Toda feature nova → ao menos 1 spec
- Cobertura mínima alvo: 70% (ramificada)
- Testes unitários focam em `Service` (mock providers)
- Testes E2E usam Playwright contra a stack docker-compose

### PRs

- Pequenos (preferencialmente <400 linhas alteradas)
- Descrição em template (auto-incluído via .github/PULL_REQUEST_TEMPLATE.md)
- CI verde obrigatório
- Mínimo 1 reviewer

## Setup local

Ver [`DEPLOYMENT.md#local`](DEPLOYMENT.md#local-desenvolvimento).
