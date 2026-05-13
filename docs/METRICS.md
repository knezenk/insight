# Engenharia de Métricas

> Como cada número exibido no dashboard é calculado.
> Fórmulas, agregações, tratamento de casos extremos.

---

## IVN — Índice de Valor da Notícia

**Escala:** −10 a +10

**Fórmula:**

```
IVN = Σ(score × peso_segmento) ÷ (total_matérias × 3) × 10
```

Onde:
- `score` ∈ {−3, −2, −1, +1, +2, +3} (sentimento de 6 níveis · sem neutro)
- `peso_segmento` ∈ {0.7, 1.0, 1.2, 1.3, 1.5, 2.0}

| Segmento | Peso |
| --- | ---: |
| PREMIUM | 2.0 |
| NACIONAL_TV | 1.5 |
| ESPECIALIZADO | 1.3 |
| NACIONAL_DIGITAL | 1.2 |
| REGIONAL | 1.0 |
| HOSTIL_ESTRUTURAL | 0.7 |

**Implementação:** `packages/shared/src/utils/ivn-calculator.ts`

**Onde calcular:** **backend**, em `ScoresService.ivn()`. Cache de 5 minutos.
Frontend nunca recalcula — apenas exibe.

**Tratamento de bordas:**
- 0 matérias → IVN = 0 (não dividir por zero)
- Todas com mesmo sentimento → IVN tende ao extremo da escala
- Todas em segmento HOSTIL_ESTRUTURAL → contagem reduzida em 30%

**Variação vs. período anterior:**

```
variation = IVN_atual − IVN_anterior
```

Exibida com sinal e cor (verde se positivo, vermelho se negativo).

---

## Índice 360

**Escala:** 0 a 100 (score consolidado proprietário)

**Fórmula:**

```
Índice 360 = (
  favorability   × 0.30 +
  reach          × 0.20 +
  vpe            × 0.15 +
  premium_share  × 0.15 +
  diversity      × 0.10 +
  velocity       × 0.10
) × 100
```

Cada componente normalizada em [0, 1].

### Cálculo de cada componente

**1. favorability**
```
favorability = matérias_positivas ÷ total_matérias
```

**2. reach (alcance normalizado)**
```
reach = log10(audiência_somada) ÷ log10(100M)
clamp [0, 1]
```

Audiência = soma de `reach` de cada matéria. Logarítmica para evitar dominância de outliers.

**3. vpe (valor publicitário equivalente)**
```
vpe = log10(VPE_total_BRL) ÷ log10(50M)
clamp [0, 1]
```

**4. premium_share**
```
premium_share = matérias_em_PREMIUM ÷ total_matérias
```

**5. diversity**
```
diversity = min(1, veículos_distintos ÷ 100)
```

**6. velocity**
```
velocity = 1 − normalize(replicações_por_hora)
```

Quanto mais rápido se propaga, mais perigoso → score mais baixo.

### Bandas

| Faixa | Label | Cor |
| --- | --- | --- |
| 0–30 | Crítico | `#A02B1A` |
| 31–50 | Adverso | `#A57619` |
| 51–70 | Aceitável | `#C8861E` |
| 71–85 | Bom | `#2D7D5C` |
| 86–100 | Excelente | `#1A5F44` |

**Implementação:** `packages/shared/src/utils/indice-360-calculator.ts`

**Onde calcular:** backend. NLP service envia componentes pré-calculados.

---

## Score de Risco Reputacional

**Escala:** 0 a 100

**Variáveis e pesos:**

| Variável | Peso | Sinal |
| --- | ---: | --- |
| Volume de cobertura negativa | 25% | + |
| Autoridade dos veículos | 20% | + (alta autoridade = mais risco) |
| Velocidade de propagação | 15% | + |
| Tema (gravidade do assunto) | 25% | + |
| Alcance social | 15% | + |

**Score:**

```
score = Σ(variável_normalizada × peso) × 100
```

### Bandas

| Faixa | Label |
| --- | --- |
| 0–20 | Irrelevante |
| 21–40 | Baixo |
| 41–60 | Moderado |
| 61–80 | Alto |
| 81–100 | Crítico |

**Onde calcular:** backend. NLP service.

---

## Score de Impacto Financeiro

Mesma estrutura. Variáveis: relação com resultados, M&A/IPO, regulação,
analistas, comparações competitivas.

| Faixa | Label |
| --- | --- |
| 0–25 | Irrelevante |
| 26–50 | Potencial |
| 51–75 | Relevante |
| 76–100 | Crítico |

---

## Share of Voice (SoV)

**Fórmula:**

```
SoV(player) = volume(player) ÷ Σ(volume_competidores) × 100%
```

Volume = matérias indexadas no período (com filtros aplicados).

**Onde calcular:** backend agrega `competitive` chamando provider, que pode
delegar para a API externa OU para um cálculo local sobre dados do clipping.

---

## Variação percentual com proteção contra divisão por zero

```
variation_pct(curr, prev) = curr === 0 && prev === 0
                              ? 0
                              : prev === 0
                                ? 100  // de 0 → qualquer coisa = 100%
                                : ((curr − prev) ÷ |prev|) × 100
```

Sempre arredondar para 1 casa decimal.

---

## Distribuição de sentimento

Grupo `[3, 2, 1, -1, -2, -3]` → contagem absoluta + percentual.

```
percent[score] = count[score] ÷ total × 100
```

Se total = 0 → todos os percents = 0.

---

## Onde cada cálculo acontece

| Métrica | Frontend | Backend (Service) | NLP service externo |
| --- | --- | --- | --- |
| IVN | exibir formatado | calcular agregado | classificar sentimento |
| Índice 360 | exibir + gauge | calcular score | fornecer componentes |
| Risk | exibir + level | calcular score | fornecer fatores |
| Financial | exibir + level | calcular | NLP detecta tema |
| SoV | gráfico | agregar | — |
| Distribuição | barras | contar | — |
| Variação | exibir setas | comparar períodos | — |

**Regra**: cálculos puros e que dependem de múltiplas matérias ficam **no backend**.
Frontend apenas formata, agrupa, anima.
