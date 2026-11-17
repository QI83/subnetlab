# Cartão de estudo — template

Formato do "cartão" da Biblioteca. Um cartão = **um assunto**, lido em **60–90 segundos**.
Regra número um: se o texto puder ser confundido com o material original da Cisco, o cartão está errado.
Ele é escrito para **lembrar rápido**, não para ser completo — o completo já existe no curso.

---

## Estrutura (7 blocos, nesta ordem)

**1. Título curto e concreto**
Não é o nome do capítulo. É o que o aluno vai conseguir fazer depois de ler.

> ✅ "Trunk: levar várias VLANs por um cabo"
> ❌ "Capítulo 3 — VLANs e Trunking"

**2. Gancho (1 frase)**
Por que isso existe, em linguagem de gente. Sem "conforme estudamos anteriormente".

> "Sem trunk, cada VLAN precisaria de um cabo até o roteador — um prédio com 12 setores viraria 12 cabos."

**3. Ideia central (2–4 frases)**
O conceito inteiro. Se não couber em 4 frases, o assunto precisa de dois cartões.

**4. Analogia (1–2 frases)**
O que fixa. Precisa ser do mundo do aluno, não do mundo da rede.

**5. Onde a prova cobra (2–3 bullets)**
O ângulo da banca: a pegadinha típica, o detalhe que separa "quase certo" de "certo".

**6. Comando ou diagrama (1 bloco)**
CLI curto (máx. 6 linhas) ou diagrama nosso, desenhado no padrão do app. Nunca captura de tela do curso.

**7. Recuperação ativa (3 perguntas)**
Abertas, com resposta escondida atrás de um "ver resposta". Não é múltipla escolha: escrever/mentalizar é
o que consolida. Nada de XP — leitura não é desempenho.

---

## Metadados (para o app)

```json
{
  "id": "vlans-trunk",
  "topico": "VLANs",
  "mod": 2,
  "nivel": 1,
  "min": 2,
  "tags": ["trunk", "802.1Q", "native vlan"],
  "questoes": ["2:12", "2:13", "2:31"]
}
```

- `topico` — deve casar com o `tp` das questões (é o que liga o cartão à fraqueza do aluno)
- `nivel` — 1 (base), 2 (detalhe), 3 (pegadinha de prova)
- `min` — minutos estimados de leitura
- `questoes` — questões do banco que exercitam o mesmo assunto (viram o "praticar agora")
- `fonte` — referência de onde saiu (ex.: "CCNA v7 — SRWE, cap. 3") — citar, nunca copiar

---

## Exemplo preenchido (VLANs → trunk)

**Título:** Trunk: levar várias VLANs por um cabo

**Gancho:** Sem trunk, cada VLAN precisaria de um cabo até o roteador — um prédio com 12 setores viraria 12 cabos.

**Ideia central:** Um link trunk carrega quadros de várias VLANs ao mesmo tempo e marca cada quadro com a VLAN
de origem. A marcação é o **tag 802.1Q**, inserido dentro do quadro. Porta de acesso não marca nada: ela já
pertence a uma VLAN só. O switch decide entre acesso e trunk pela configuração da porta, não pelo cabo.

**Analogia:** Porta de acesso é uma carta entregue na mão, com um destino só. Trunk é o caminhão da transportadora:
leva caixas de vários destinos no mesmo veículo, e cada caixa tem etiqueta.

**Onde a prova cobra:**
- **Native VLAN** vai **sem tag** no trunk. Se dois switches discordam dela, o tráfego "vaza" para a VLAN errada
  e aparece a mensagem de *native VLAN mismatch* — pegadinha clássica.
- Trunk não "cria" VLAN: as VLANs precisam existir nos dois switches.
- Por padrão, o trunk aceita todas as VLANs; restringir exige `switchport trunk allowed vlan`.

**Comando:**
```
interface Gi0/1
 switchport mode trunk
 switchport trunk native vlan 99
 switchport trunk allowed vlan 10,20,99
```

**Recuperação:**
1. Por que a native VLAN viaja sem tag — e o que acontece se os dois lados discordarem?
2. O que muda no quadro quando ele passa por um trunk, e onde exatamente esse campo é inserido?
3. Um trunk está configurado, mas a VLAN 30 não passa. Cite duas causas possíveis.

---

## Regras de produção

- **Uma fonte, um cartão.** Se veio de dois capítulos, são dois cartões.
- **Nada de cópia:** sem parágrafo do curso, sem tabela, sem figura. Diagrama é nosso, no padrão visual do app.
- **Conferência obrigatória** contra a fonte oficial antes de publicar (papel do professor).
- **Linguagem:** segunda pessoa, presente, frase curta. Zero "é importante ressaltar".
- **Tamanho:** máximo ~250 palavras no corpo. Passou disso, divide.
- **Se o cartão não responde "onde a prova cobra", ele ainda não está pronto.**
