# 3 cartões de exemplo — Biblioteca SubnetLab

Rascunhos para validar **formato e tom** com a turma. Escritos a partir do currículo CCNA v7 e do banco de
questões do app — sem cópia do material original, sem captura de tela do curso. Falta a conferência do
professor em cada um (itens marcados com ⚠️ são os que eu recomendo conferir primeiro).

---

## 1. VLANs — Trunk: levar várias VLANs por um cabo

```json
{ "id": "vlans-trunk", "topico": "VLANs", "mod": 2, "nivel": 1, "min": 2,
  "tags": ["trunk", "802.1Q", "native vlan"], "questoes": ["2:12", "2:13", "2:31"] }
```

**Gancho:** sem trunk, cada VLAN precisaria de um cabo até o roteador — um prédio com 12 setores viraria 12 cabos.

**Ideia central:** um link trunk carrega quadros de várias VLANs ao mesmo tempo e marca cada um com a VLAN de
origem. A marcação é o **tag 802.1Q**, inserido dentro do quadro. Porta de acesso não marca nada: ela já pertence
a uma VLAN só. Quem decide se a porta é acesso ou trunk é a configuração, não o cabo.

**Analogia:** porta de acesso é carta entregue na mão, um destino só. Trunk é o caminhão da transportadora: várias
caixas de destinos diferentes no mesmo veículo, cada uma com etiqueta.

**Onde a prova cobra:**
- **Native VLAN viaja sem tag.** Se os dois lados discordam dela, o tráfego cai na VLAN errada e aparece
  *native VLAN mismatch* — pegadinha clássica.
- Trunk não cria VLAN: a VLAN precisa existir nos dois switches.
- Por padrão o trunk permite todas as VLANs; restringir é `switchport trunk allowed vlan`.

**Comando:**
```
interface Gi0/1
 switchport mode trunk
 switchport trunk native vlan 99
 switchport trunk allowed vlan 10,20,99
```

**Recuperação:**
1. Por que a native VLAN viaja sem tag — e o que quebra se os dois lados discordarem?
2. O que muda no quadro ao atravessar um trunk, e onde exatamente esse campo entra?
3. O trunk está de pé, mas a VLAN 30 não passa. Duas causas possíveis?

---

## 2. OSPF — Por que dois roteadores não viram vizinhos

```json
{ "id": "ospf-adjacencia", "topico": "OSPF", "mod": 3, "nivel": 2, "min": 3,
  "tags": ["hello", "dead interval", "DR/BDR", "MTU"], "questoes": ["3:4", "3:5", "3:22"] }
```

**Gancho:** a maioria dos problemas de OSPF não é rota errada — é vizinhança que nunca subiu.

**Ideia central:** dois roteadores só formam adjacência se concordarem em quase tudo: mesma **área**, mesma
**sub-rede e máscara**, mesmos **timers** (hello 10 s / dead 40 s em Ethernet), mesma **autenticação** e mesma
**MTU**. Divergiu um item, a sessão fica presa — e o estado travado entrega o motivo. Em rede broadcast, ainda
existe **DR e BDR**: eleitos pela maior prioridade e, no empate, pelo maior Router ID. Não há reeleição: um DR
novo só aparece se o atual cair.

**Analogia:** é uma reunião que só começa com todo mundo de acordo sobre o horário, o idioma e a pauta. Se um
chega falando outra língua, a reunião não começa — e ninguém entra na sala.

**Onde a prova cobra:**
- **Dois DROTHERs ficam em `2WAY`** e isso é normal — não é falha.
- Preso em **`EXSTART`/`EXCHANGE`** = quase sempre **MTU diferente** entre as interfaces.
- Hello de um lado 10 s, do outro 30 s: nunca sai do `INIT`/`DOWN`.

**Comando:**
```
show ip ospf neighbor
show ip ospf interface Gi0/1
```

**Recuperação:**
1. Liste quatro coisas que precisam bater para a adjacência subir.
2. A sessão está em `EXSTART` há minutos. Qual é a primeira suspeita?
3. Por que dois roteadores que não são DR nem BDR não passam de `2WAY`?

---

## 3. Automação — O que JSON e API têm a ver com cabo e switch

```json
{ "id": "auto-api-json", "topico": "Automação", "mod": 4, "nivel": 1, "min": 3,
  "tags": ["REST", "JSON", "YAML", "SDN", "Ansible"], "questoes": ["4:1", "4:2", "4:18"] }
```

**Gancho:** configurar 50 switches à mão é 50 chances de errar a mesma linha — automação existe para isso.

**Ideia central:** em vez de digitar comando em cada equipamento, um **controlador** conversa com todos eles.
A conversa tem duas direções: **northbound** é a API que o seu programa usa para pedir ("aplicar esta política"),
**southbound** é como o controlador fala com o equipamento (CLI, SNMP, NETCONF). Os dados viajam em **JSON**
(chaves e chaves aninhadas) ou **YAML** (indentação, mais legível para humano). API **REST** usa os verbos HTTP:
GET lê, POST cria, PUT/PATCH atualiza, DELETE remove.

**Analogia:** o controlador é o gerente que recebe o pedido em português (northbound) e distribui a tarefa para
cada funcionário no idioma que ele entende (southbound). Você fala uma vez; ele repete 50 vezes sem errar.

**Onde a prova cobra:**
- **Northbound = para as aplicações; southbound = para os dispositivos.** Trocar os dois é o erro mais comum.
- **Ansible é sem agente** (usa SSH, playbook em YAML); **Puppet e Chef usam agente** no equipamento.
- JSON exige chaves e aspas; YAML vive de **indentação** — um espaço errado quebra o arquivo.

**Exemplo de dados:**
```json
{ "interface": "Gi0/1", "description": "UPLINK", "enabled": true }
```
```yaml
interface: Gi0/1
description: UPLINK
enabled: true
```

**Recuperação:**
1. Qual API o seu script chama, e qual o controlador usa para falar com o switch?
2. Qual verbo HTTP você usaria para corrigir um campo já existente?
3. Por que "Ansible precisa instalar agente no switch" é falso?

---

## O que eu quero saber da turma (as 3 perguntas do teste)

1. Leu em **90 segundos** ou travou no meio? (se travou, o cartão está grande)
2. Depois de ler, conseguiu responder as 3 perguntas de recuperação **sem voltar ao texto**?
3. O tom parece **explicação de alguém** ou **material de curso**? (a resposta precisa ser a primeira)

Se as três respostas forem boas, o formato está validado e vale escalar para os 22 tópicos.
