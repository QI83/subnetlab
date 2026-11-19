# Revisão do Módulo 2: explicações (`why`)

Passada da skill `humanizer` em 18/11. Das 60 explicações, **16 mudaram** e 44 ficaram como estavam
(texto técnico sem cacoete de IA: não se reescreve o que já está bom).

Nenhum número, IP, MAC, comando ou sigla foi perdido — verificado por comparação automática de tokens.

## id 1 · Roteamento

**Antes**

> O endereço IP origem nunca muda durante o roteamento (permanece 10.1.1.10 — host A). O MAC origem, porém, é substituído a cada hop: ao chegar ao host B o MAC origem é o da interface de saída do último roteador (00E0.FE91.7799).

**Depois**

> O endereço IP de origem nunca muda durante o roteamento (permanece 10.1.1.10, o host A). O MAC de origem, porém, é substituído a cada hop: ao chegar ao host B, o MAC de origem é o da interface de saída do último roteador (00E0.FE91.7799).

## id 10 · Switching

**Antes**

> Um switch L2 cria um domínio de colisão por porta (mais domínios, não menos). Os benefícios reais da segmentação são: (1) melhorar a largura de banda — cada porta tem largura de banda dedicada; (2) isolar o tráfego entre segmentos — frames só cruzam para outras portas quando necessário.

**Depois**

> Um switch L2 cria um domínio de colisão por porta (mais domínios, não menos). Os benefícios reais da segmentação são: (1) melhorar a largura de banda, já que cada porta tem largura de banda dedicada; (2) isolar o tráfego entre segmentos, porque frames só cruzam para outras portas quando necessário.

## id 19 · EtherChannel

**Antes**

> O flag 'S' indica Layer 2 e 'D' indica Down. 'Po2(SD)' significa que o port-channel 2 está inativo (Down). As portas Fa0/1(D) e Fa0/2(D) também estão inativas. O ID do port-channel é 2 (Po2). O EtherChannel está inoperante — não há protocolo (−) negociando.

**Depois**

> O flag 'S' indica Layer 2 e 'D' indica Down. 'Po2(SD)' significa que o port-channel 2 está inativo (Down). As portas Fa0/1(D) e Fa0/2(D) também estão inativas. O ID do port-channel é 2 (Po2). O EtherChannel está inoperante porque nenhum protocolo (−) está negociando.

## id 20 · STP

**Antes**

> B (S2→S1): porta raiz de S2 — melhor caminho ao root. D (S3→S1): porta raiz de S3. C (S2→hosts): porta designada — único switch no segmento de acesso. A (S2↔S3): como S2 tem melhor caminho ao root que S3 nesse segmento, S2 vence e sua porta seria designada — mas como S3 também conecta diretamente ao root (via D), S2's porta A pode ser alternativa. A ordem correta é: A=alternativa, B=raiz, C=designada, D=raiz.

**Depois**

> B (S2→S1): porta raiz de S2, o melhor caminho ao root. D (S3→S1): porta raiz de S3. C (S2→hosts): porta designada, por ser o único switch no segmento de acesso. A (S2↔S3): como S2 tem melhor caminho ao root que S3 nesse segmento, S2 vence e sua porta seria designada; mas como S3 também conecta diretamente ao root (via D), a porta A de S2 pode ser alternativa. A ordem correta é: A=alternativa, B=raiz, C=designada, D=raiz.

## id 23 · Segurança L2

**Antes**

> No modelo AAA: (A) Autenticação verifica a identidade; (A) Autorização determina o que o usuário autenticado pode fazer — ocorre imediatamente após autenticação bem-sucedida; (A) Contabilidade registra o que foi feito. A autorização só acontece após a identidade ser confirmada.

**Depois**

> No modelo AAA: (A) Autenticação verifica a identidade; (A) Autorização determina o que o usuário autenticado pode fazer, e ocorre imediatamente após a autenticação bem-sucedida; (A) Contabilidade registra o que foi feito. A autorização só acontece após a identidade ser confirmada.

## id 25 · DHCPv4

**Antes**

> Um frame de broadcast é sempre encaminhado a todas as portas do switch, exceto a porta de entrada. O PC3 enviou o broadcast pela Fa0/4, portanto o switch encaminha para Fa0/1 (servidor DHCP), Fa0/2 (PC1) e Fa0/3 (PC2) — todas as outras portas exceto a de entrada.

**Depois**

> Um frame de broadcast é sempre encaminhado a todas as portas do switch, exceto a porta de entrada. O PC3 enviou o broadcast pela Fa0/4, portanto o switch encaminha para Fa0/1 (servidor DHCP), Fa0/2 (PC1) e Fa0/3 (PC2), todas as outras portas exceto a de entrada.

## id 27 · Switching

**Antes**

> Cut-through inicia o encaminhamento assim que lê o MAC destino — menor latência, maior desempenho, mas pode propagar frames com erros. Store-and-forward aguarda o frame completo para verificar o FCS (CRC) — maior latência, mas garante que apenas frames válidos são encaminhados.

**Depois**

> Cut-through inicia o encaminhamento assim que lê o MAC de destino: menor latência e maior desempenho, mas pode propagar frames com erros. Store-and-forward aguarda o frame completo para verificar o FCS (CRC): maior latência, mas garante que apenas frames válidos são encaminhados.

## id 32 · Roteamento

**Antes**

> A entrada 'S 10.17.2.0/24 [1/0] via 10.16.2.2' indica: S=rota estática, rede específica 10.17.2.0/24, AD=1, métrica=0, próximo salto=10.16.2.2. Isso é uma rota estática para rede específica com next-hop. A rota 0.0.0.0/0 é a rota padrão, não específica.

**Depois**

> A entrada 'S 10.17.2.0/24 [1/0] via 10.16.2.2' indica: S=rota estática, rede específica 10.17.2.0/24, AD=1, métrica=0, próximo salto=10.16.2.2. Isso é uma rota estática para rede específica com next-hop. Já a rota 0.0.0.0/0 é a rota padrão, e não uma rota específica.

## id 33 · Roteamento

**Antes**

> Endereços com prefixo fe80::/10 são link-local — válidos apenas no segmento de rede local e não roteáveis. São usados para comunicação entre vizinhos (NDP, routing protocols). São configurados automaticamente em toda interface IPv6 habilitada. ff00::/8 é multicast; 2001::/3 é unicast global; fc::/7 é unicast local único (ULA).

**Depois**

> Endereços com prefixo fe80::/10 são link-local: válidos apenas no segmento local e não roteáveis. Servem para comunicação entre vizinhos (NDP, protocolos de roteamento) e são configurados automaticamente em toda interface IPv6 habilitada. ff00::/8 é multicast; 2001::/3 é unicast global; fc::/7 é unicast local único (ULA).

## id 36 · Segurança L2

**Antes**

> SSH (Secure Shell) criptografa todo o tráfego da sessão, incluindo credenciais. Telnet transmite tudo em texto claro, sendo vulnerável a sniffing. 802.1x é usado para autenticação de acesso à porta (não gerenciamento remoto). ACL nas VTY restringe quem pode acessar, mas não criptografa a sessão — deve ser combinada com SSH.

**Depois**

> SSH (Secure Shell) criptografa todo o tráfego da sessão, incluindo credenciais. Telnet transmite tudo em texto claro, sendo vulnerável a sniffing. 802.1x serve para autenticação de acesso à porta, não para gerenciamento remoto. Uma ACL nas VTY restringe quem pode acessar, mas não criptografa a sessão: precisa ser combinada com SSH.

## id 47 · VLANs

**Antes**

> No modo servidor VTP: VLANs podem ser criadas/modificadas/deletadas localmente e as mudanças são propagadas pelo domínio VTP. No modo transparente: VLANs são gerenciadas localmente (criadas/modificadas/deletadas) mas as mudanças NÃO são propagadas — o switch apenas encaminha mensagens VTP. No modo cliente: não é possível modificar VLANs.

**Depois**

> No modo servidor VTP: VLANs podem ser criadas/modificadas/deletadas localmente e as mudanças são propagadas pelo domínio VTP. No modo transparente, as VLANs são gerenciadas localmente, mas as mudanças NÃO são propagadas: o switch apenas repassa as mensagens VTP. No modo cliente: não é possível modificar VLANs.

## id 50 · FHRP

**Antes**

> O processo de failover HSRP: (1) o roteador ativo falha; (2) o roteador standby detecta a falha ao não receber mensagens Hello dentro do hold time; (3) o standby assume o papel ativo, respondendo pelo IP e MAC virtuais do grupo — transparente para os hosts da rede.

**Depois**

> O processo de failover HSRP: (1) o roteador ativo falha; (2) o roteador standby detecta a falha ao não receber mensagens Hello dentro do hold time; (3) o standby assume o papel ativo e passa a responder pelo IP e MAC virtuais do grupo, o que é transparente para os hosts da rede.

## id 52 · WLAN

**Antes**

> No modo WPA2 Personal (PSK — Pre-Shared Key), todos os dispositivos usam a mesma senha (passphrase) configurada no ponto de acesso. O usuário precisa conhecer essa chave para se conectar. Não há servidor de autenticação. WPA2 Enterprise (com RADIUS/802.1X) usa credenciais individuais por usuário.

**Depois**

> No modo WPA2 Personal (PSK, Pre-Shared Key), todos os dispositivos usam a mesma senha (passphrase) configurada no ponto de acesso. O usuário precisa conhecer essa chave para se conectar. Não há servidor de autenticação. WPA2 Enterprise (com RADIUS/802.1X) usa credenciais individuais por usuário.

## id 54 · Switching

**Antes**

> Por padrão (sem IGMP snooping), um switch trata frames com endereço MAC multicast de forma similar a broadcasts: encaminha para todas as portas ativas exceto a porta de entrada (flooding). O switch não aprende endereços multicast na tabela CAM a partir do endereço destino — apenas aprende o MAC origem.

**Depois**

> Por padrão (sem IGMP snooping), um switch trata frames com endereço MAC multicast de forma similar a broadcasts: encaminha para todas as portas ativas exceto a porta de entrada (flooding). O switch não aprende endereços multicast na tabela CAM a partir do endereço de destino: aprende apenas o MAC de origem.

## id 55 · Inter-VLAN

**Antes**

> Para roteamento inter-VLAN em um switch L3: (1) criar as VLANs (vlan <id>); (2) criar SVIs (interface vlan <id> + ip address) — uma por VLAN para ser o gateway; (3) atribuir as portas de acesso às VLANs corretas (switchport access vlan). Também é necessário 'ip routing', mas as três etapas essenciais listadas são as três primeiras.

**Depois**

> Para roteamento inter-VLAN em um switch L3: (1) criar as VLANs (vlan <id>); (2) criar SVIs (interface vlan <id> + ip address), uma por VLAN, para ser o gateway; (3) atribuir as portas de acesso às VLANs corretas (switchport access vlan). Também é necessário 'ip routing', mas as três etapas essenciais listadas são as três primeiras.

## id 60 · VLANs

**Antes**

> O comando 'switchport mode access' configura a porta como modo acesso permanente e desativa o DTP. A porta não irá negociar nem aceitar trunk. Isso é uma prática de segurança recomendada para portas conectadas a hosts finais, pois impede ataques que exploram a negociação automática de trunk (DTP).

**Depois**

> O comando 'switchport mode access' configura a porta como acesso permanente e desativa o DTP. A porta não negocia nem aceita trunk. É a prática recomendada para portas ligadas a hosts finais, porque impede ataques que exploram a negociação automática de trunk (DTP).
