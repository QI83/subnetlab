# Revisão das explicações: M3 e M4

Passada da skill `humanizer` em 18/11, depois do M2. Foram alteradas as explicações que tinham sinal real:
**6 no M3** e **44 no M4** (50 no total). As demais 211 já estavam limpas e não foram tocadas.

Verificação automática: nenhuma perdeu número, IP, MAC, VLAN ou comando. O único corte de conteúdo foi
uma frase de fecho redundante no id 122 do M4.

## M3: 6 explicações

### id 1 · OSPF

**Antes**

> O pacote DBD (Descrição do Banco de Dados) carrega apenas um resumo do LSDB — os cabeçalhos dos LSAs — para que o vizinho compare com o seu próprio banco e só peça o que estiver faltando. É a etapa de 'comparar antes de copiar'.

**Depois**

> O pacote DBD (Descrição do Banco de Dados) carrega apenas um resumo do LSDB (os cabeçalhos dos LSAs) para que o vizinho compare com o seu próprio banco e só peça o que estiver faltando. É a etapa de 'comparar antes de copiar'.

### id 7 · OSPF

**Antes**

> O comando show ip ospf interface serial 0/0/0 exibe, entre outras informações, os temporizadores Hello e Dead configurados naquela interface específica — exatamente o que se quer verificar no link WAN ponto a ponto.

**Depois**

> O comando show ip ospf interface serial 0/0/0 exibe, entre outras informações, os temporizadores Hello e Dead configurados naquela interface específica, exatamente o que se quer verificar no link WAN ponto a ponto.

### id 8 · OSPF

**Antes**

> O router ID identifica unicamente cada roteador dentro do domínio OSPF e é usado como critério de desempate na eleição do DR/BDR. Ele não define rotas nem áreas — serve para identificar e eleger.

**Depois**

> O router ID identifica unicamente cada roteador dentro do domínio OSPF e é usado como critério de desempate na eleição do DR/BDR. Ele não define rotas nem áreas: serve para identificar e eleger.

### id 46 · Arquitetura

**Antes**

> O primeiro passo é verificar a configuração IP da estação com ipconfig — endereço, máscara e gateway. Sem esses dados não é possível saber se o problema é de endereçamento, de rede ou de impressora.

**Depois**

> O primeiro passo é verificar a configuração IP da estação com ipconfig: endereço, máscara e gateway. Sem esses dados não é possível saber se o problema é de endereçamento, de rede ou de impressora.

### id 48 · OSPF

**Antes**

> As interfaces seriais de R1 e R2 estão configuradas em áreas OSPF diferentes. OSPF só forma adjacência entre interfaces na mesma área — por isso a adjacência não estabelece.

**Depois**

> As interfaces seriais de R1 e R2 estão configuradas em áreas OSPF diferentes. OSPF só forma adjacência entre interfaces na mesma área. Por isso a adjacência não estabelece.

### id 51 · SDN/Cloud

**Antes**

> O hypervisor Tipo 2 roda como um aplicativo sobre um sistema operacional hospedeiro — é o caso de VirtualBox ou VMware Workstation instalados no Windows do notebook. O Tipo 1 roda direto no hardware.

**Depois**

> O hypervisor Tipo 2 roda como um aplicativo sobre um sistema operacional hospedeiro, como o VirtualBox ou o VMware Workstation instalados no Windows do notebook. O Tipo 1 roda direto no hardware.

## M4: 44 explicações

### id 1 · OSPF

**Antes**

> O pacote DBD (Descrição do Banco de Dados) carrega apenas um resumo do LSDB — os cabeçalhos dos LSAs — para que o vizinho compare com o seu próprio banco e só peça o que estiver faltando. É a etapa de 'comparar antes de copiar'.

**Depois**

> O pacote DBD (Descrição do Banco de Dados) carrega apenas um resumo do LSDB (os cabeçalhos dos LSAs) para que o vizinho compare com o seu próprio banco e só peça o que estiver faltando. É a etapa de 'comparar antes de copiar'.

### id 7 · OSPF

**Antes**

> O comando show ip ospf interface serial 0/0/0 exibe, entre outras informações, os temporizadores Hello e Dead configurados naquela interface específica — exatamente o que se quer verificar no link WAN ponto a ponto.

**Depois**

> O comando show ip ospf interface serial 0/0/0 exibe, entre outras informações, os temporizadores Hello e Dead configurados naquela interface específica, exatamente o que se quer verificar no link WAN ponto a ponto.

### id 8 · OSPF

**Antes**

> O router ID identifica unicamente cada roteador dentro do domínio OSPF e é usado como critério de desempate na eleição do DR/BDR. Ele não define rotas nem áreas — serve para identificar e eleger.

**Depois**

> O router ID identifica unicamente cada roteador dentro do domínio OSPF e é usado como critério de desempate na eleição do DR/BDR. Ele não define rotas nem áreas: serve para identificar e eleger.

### id 46 · Arquitetura

**Antes**

> O primeiro passo é verificar a configuração IP da estação com ipconfig — endereço, máscara e gateway. Sem esses dados não é possível saber se o problema é de endereçamento, de rede ou de impressora.

**Depois**

> O primeiro passo é verificar a configuração IP da estação com ipconfig: endereço, máscara e gateway. Sem esses dados não é possível saber se o problema é de endereçamento, de rede ou de impressora.

### id 48 · OSPF

**Antes**

> As interfaces seriais de R1 e R2 estão configuradas em áreas OSPF diferentes. OSPF só forma adjacência entre interfaces na mesma área — por isso a adjacência não estabelece.

**Depois**

> As interfaces seriais de R1 e R2 estão configuradas em áreas OSPF diferentes. OSPF só forma adjacência entre interfaces na mesma área. Por isso a adjacência não estabelece.

### id 51 · SDN/Cloud

**Antes**

> O hypervisor Tipo 2 roda como um aplicativo sobre um sistema operacional hospedeiro — é o caso de VirtualBox ou VMware Workstation instalados no Windows do notebook. O Tipo 1 roda direto no hardware.

**Depois**

> O hypervisor Tipo 2 roda como um aplicativo sobre um sistema operacional hospedeiro, como o VirtualBox ou o VMware Workstation instalados no Windows do notebook. O Tipo 1 roda direto no hardware.

### id 56 · Roteamento

**Antes**

> O endereço IP origem nunca muda durante o roteamento (permanece 10.1.1.10 — host A). O MAC origem, porém, é substituído a cada hop: ao chegar ao host B o MAC origem é o da interface de saída do último roteador (00E0.FE91.7799).

**Depois**

> O endereço IP origem nunca muda durante o roteamento (permanece 10.1.1.10, o host A). O MAC origem, porém, é substituído a cada hop: ao chegar ao host B, o MAC origem é o da interface de saída do último roteador (00E0.FE91.7799).

### id 65 · Switching

**Antes**

> Um switch L2 cria um domínio de colisão por porta (mais domínios, não menos). Os benefícios reais da segmentação são: (1) melhorar a largura de banda — cada porta tem largura de banda dedicada; (2) isolar o tráfego entre segmentos — frames só cruzam para outras portas quando necessário.

**Depois**

> Um switch L2 cria um domínio de colisão por porta (mais domínios, não menos). Os benefícios reais da segmentação são: (1) melhorar a largura de banda, já que cada porta tem largura de banda dedicada; (2) isolar o tráfego entre segmentos, porque frames só cruzam para outras portas quando necessário.

### id 74 · EtherChannel

**Antes**

> O flag 'S' indica Layer 2 e 'D' indica Down. 'Po2(SD)' significa que o port-channel 2 está inativo (Down). As portas Fa0/1(D) e Fa0/2(D) também estão inativas. O ID do port-channel é 2 (Po2). O EtherChannel está inoperante — não há protocolo (−) negociando.

**Depois**

> O flag 'S' indica Layer 2 e 'D' indica Down. 'Po2(SD)' significa que o port-channel 2 está inativo (Down). As portas Fa0/1(D) e Fa0/2(D) também estão inativas. O ID do port-channel é 2 (Po2). O EtherChannel está inoperante porque nenhum protocolo (−) está negociando.

### id 75 · STP

**Antes**

> B (S2→S1): porta raiz de S2 — melhor caminho ao root. D (S3→S1): porta raiz de S3. C (S2→hosts): porta designada — único switch no segmento de acesso. A (S2↔S3): como S2 tem melhor caminho ao root que S3 nesse segmento, S2 vence e sua porta seria designada — mas como S3 também conecta diretamente ao root (via D), S2's porta A pode ser alternativa. A ordem correta é: A=alternativa, B=raiz, C=designada, D=raiz.

**Depois**

> B (S2→S1): porta raiz de S2, o melhor caminho ao root. D (S3→S1): porta raiz de S3. C (S2→hosts): porta designada, por ser o único switch no segmento de acesso. A (S2↔S3): como S2 tem melhor caminho ao root que S3 nesse segmento, S2 vence e sua porta seria designada; mas como S3 também conecta diretamente ao root (via D), a porta A de S2 pode ser alternativa. A ordem correta é: A=alternativa, B=raiz, C=designada, D=raiz.

### id 78 · Segurança L2

**Antes**

> No modelo AAA: (A) Autenticação verifica a identidade; (A) Autorização determina o que o usuário autenticado pode fazer — ocorre imediatamente após autenticação bem-sucedida; (A) Contabilidade registra o que foi feito. A autorização só acontece após a identidade ser confirmada.

**Depois**

> No modelo AAA: (A) Autenticação verifica a identidade; (A) Autorização determina o que o usuário autenticado pode fazer, e ocorre imediatamente após a autenticação bem-sucedida; (A) Contabilidade registra o que foi feito. A autorização só acontece após a identidade ser confirmada.

### id 80 · DHCPv4

**Antes**

> Um frame de broadcast é sempre encaminhado a todas as portas do switch, exceto a porta de entrada. O PC3 enviou o broadcast pela Fa0/4, portanto o switch encaminha para Fa0/1 (servidor DHCP), Fa0/2 (PC1) e Fa0/3 (PC2) — todas as outras portas exceto a de entrada.

**Depois**

> Um frame de broadcast é sempre encaminhado a todas as portas do switch, exceto a porta de entrada. O PC3 enviou o broadcast pela Fa0/4, portanto o switch encaminha para Fa0/1 (servidor DHCP), Fa0/2 (PC1) e Fa0/3 (PC2), todas as outras portas exceto a de entrada.

### id 82 · Switching

**Antes**

> Cut-through inicia o encaminhamento assim que lê o MAC destino — menor latência, maior desempenho, mas pode propagar frames com erros. Store-and-forward aguarda o frame completo para verificar o FCS (CRC) — maior latência, mas garante que apenas frames válidos são encaminhados.

**Depois**

> Cut-through inicia o encaminhamento assim que lê o MAC de destino: menor latência e maior desempenho, mas pode propagar frames com erros. Store-and-forward aguarda o frame completo para verificar o FCS (CRC): maior latência, mas garante que apenas frames válidos são encaminhados.

### id 88 · Roteamento

**Antes**

> Endereços com prefixo fe80::/10 são link-local — válidos apenas no segmento de rede local e não roteáveis. São usados para comunicação entre vizinhos (NDP, routing protocols). São configurados automaticamente em toda interface IPv6 habilitada. ff00::/8 é multicast; 2001::/3 é unicast global; fc::/7 é unicast local único (ULA).

**Depois**

> Endereços com prefixo fe80::/10 são link-local: válidos apenas no segmento local e não roteáveis. Servem para comunicação entre vizinhos (NDP, protocolos de roteamento) e são configurados automaticamente em toda interface IPv6 habilitada. ff00::/8 é multicast; 2001::/3 é unicast global; fc::/7 é unicast local único (ULA).

### id 91 · Segurança L2

**Antes**

> SSH (Secure Shell) criptografa todo o tráfego da sessão, incluindo credenciais. Telnet transmite tudo em texto claro, sendo vulnerável a sniffing. 802.1x é usado para autenticação de acesso à porta (não gerenciamento remoto). ACL nas VTY restringe quem pode acessar, mas não criptografa a sessão — deve ser combinada com SSH.

**Depois**

> SSH (Secure Shell) criptografa todo o tráfego da sessão, incluindo credenciais. Telnet transmite tudo em texto claro, sendo vulnerável a sniffing. 802.1x serve para autenticação de acesso à porta, não para gerenciamento remoto. Uma ACL nas VTY restringe quem pode acessar, mas não criptografa a sessão: precisa ser combinada com SSH.

### id 102 · VLANs

**Antes**

> No modo servidor VTP: VLANs podem ser criadas/modificadas/deletadas localmente e as mudanças são propagadas pelo domínio VTP. No modo transparente: VLANs são gerenciadas localmente (criadas/modificadas/deletadas) mas as mudanças NÃO são propagadas — o switch apenas encaminha mensagens VTP. No modo cliente: não é possível modificar VLANs.

**Depois**

> No modo servidor VTP: VLANs podem ser criadas/modificadas/deletadas localmente e as mudanças são propagadas pelo domínio VTP. No modo transparente, as VLANs são gerenciadas localmente, mas as mudanças NÃO são propagadas: o switch apenas repassa as mensagens VTP. No modo cliente: não é possível modificar VLANs.

### id 105 · FHRP

**Antes**

> O processo de failover HSRP: (1) o roteador ativo falha; (2) o roteador standby detecta a falha ao não receber mensagens Hello dentro do hold time; (3) o standby assume o papel ativo, respondendo pelo IP e MAC virtuais do grupo — transparente para os hosts da rede.

**Depois**

> O processo de failover HSRP: (1) o roteador ativo falha; (2) o roteador standby detecta a falha ao não receber mensagens Hello dentro do hold time; (3) o standby assume o papel ativo, respondendo pelo IP e MAC virtuais do grupo, o que é transparente para os hosts da rede.

### id 107 · WLAN

**Antes**

> No modo WPA2 Personal (PSK — Pre-Shared Key), todos os dispositivos usam a mesma senha (passphrase) configurada no ponto de acesso. O usuário precisa conhecer essa chave para se conectar. Não há servidor de autenticação. WPA2 Enterprise (com RADIUS/802.1X) usa credenciais individuais por usuário.

**Depois**

> No modo WPA2 Personal (PSK, Pre-Shared Key), todos os dispositivos usam a mesma senha (passphrase) configurada no ponto de acesso. O usuário precisa conhecer essa chave para se conectar. Não há servidor de autenticação. WPA2 Enterprise (com RADIUS/802.1X) usa credenciais individuais por usuário.

### id 109 · Switching

**Antes**

> Por padrão (sem IGMP snooping), um switch trata frames com endereço MAC multicast de forma similar a broadcasts: encaminha para todas as portas ativas exceto a porta de entrada (flooding). O switch não aprende endereços multicast na tabela CAM a partir do endereço destino — apenas aprende o MAC origem.

**Depois**

> Por padrão (sem IGMP snooping), um switch trata frames com endereço MAC multicast de forma similar a broadcasts: encaminha para todas as portas ativas exceto a porta de entrada (flooding). O switch não aprende endereços multicast na tabela CAM a partir do endereço de destino: aprende apenas o MAC de origem.

### id 110 · Inter-VLAN

**Antes**

> Para roteamento inter-VLAN em um switch L3: (1) criar as VLANs (vlan <id>); (2) criar SVIs (interface vlan <id> + ip address) — uma por VLAN para ser o gateway; (3) atribuir as portas de acesso às VLANs corretas (switchport access vlan). Também é necessário 'ip routing', mas as três etapas essenciais listadas são as três primeiras.

**Depois**

> Para roteamento inter-VLAN em um switch L3: (1) criar as VLANs (vlan <id>); (2) criar SVIs (interface vlan <id> + ip address), uma por VLAN, para ser o gateway; (3) atribuir as portas de acesso às VLANs corretas (switchport access vlan). Também é necessário 'ip routing', mas as três etapas essenciais listadas são as três primeiras.

### id 118 · Arquitetura

**Antes**

> A taxa de transferência (throughput) representa o total de dados efetivamente transmitidos na rede, composto pelo goodput — os dados úteis recebidos pela aplicação — mais a sobrecarga de tráfego (cabeçalhos de protocolo, retransmissões, sinalizações). O goodput é sempre menor que o throughput justamente porque parte da capacidade é consumida por essa sobrecarga. A relação goodput + sobrecarga = taxa de transferência descreve corretamente como a transmissão real é calculada.

**Depois**

> A taxa de transferência (throughput) representa o total de dados efetivamente transmitidos na rede, composto pelo goodput (os dados úteis recebidos pela aplicação) mais a sobrecarga de tráfego (cabeçalhos de protocolo, retransmissões, sinalizações). O goodput é sempre menor que o throughput justamente porque parte da capacidade é consumida por essa sobrecarga. A relação goodput + sobrecarga = taxa de transferência descreve corretamente como a transmissão real é calculada.

### id 122 · SDN/Cloud

**Antes**

> A virtualização permite executar várias máquinas virtuais simultaneamente em um único host físico, reduzindo custos de hardware e melhorando o aproveitamento dos recursos. Além disso, uma VM é abstraída do hardware subjacente — seu sistema operacional e aplicações não dependem de uma plataforma física específica, o que possibilita migrá-la entre servidores diferentes sem reconfigurações. Esses dois benefícios são os fundamentos da virtualização em ambientes corporativos.

**Depois**

> A virtualização permite executar várias máquinas virtuais simultaneamente em um único host físico, reduzindo custos de hardware e melhorando o aproveitamento dos recursos. Além disso, uma VM é abstraída do hardware subjacente: seu sistema operacional e aplicações não dependem de uma plataforma física específica, o que possibilita migrá-la entre servidores diferentes sem reconfigurações.

### id 134 · WLAN

**Antes**

> O modo autônomo do FlexConnect é ativado quando o AP perde contato com a WLC. Nesse modo, o AP mantém a rede operacional realizando autenticação de clientes localmente — sem precisar consultar a WLC — e comutando o tráfego de dados dos clientes diretamente na rede local. Funções que dependem de comunicação ativa com a WLC, como roaming entre APs de sites distintos, não estão disponíveis nesse modo.

**Depois**

> O modo autônomo do FlexConnect é ativado quando o AP perde contato com a WLC. Nesse modo, o AP mantém a rede operacional realizando autenticação de clientes localmente (sem precisar consultar a WLC) e comutando o tráfego de dados dos clientes diretamente na rede local. Funções que dependem de comunicação ativa com a WLC, como roaming entre APs de sites distintos, não estão disponíveis nesse modo.

### id 136 · Switching

**Antes**

> Na saída do comando show lldp neighbors, a letra B representa uma bridge — ou seja, um switch. A letra R representa um roteador. Se o vizinho for um access point WLAN, usa-se a letra W. O dispositivo A1 está conectado à porta Fa0/1 do B1. O A1 também está conectado à Fa0/3 do C1, e por isso o C1 não pode se conectar ao B1 por essa mesma porta Fa0/3.

**Depois**

> Na saída do comando show lldp neighbors, a letra B representa uma bridge, ou seja, um switch. A letra R representa um roteador. Se o vizinho for um access point WLAN, usa-se a letra W. O dispositivo A1 está conectado à porta Fa0/1 do B1. O A1 também está conectado à Fa0/3 do C1, e por isso o C1 não pode se conectar ao B1 por essa mesma porta Fa0/3.

### id 143 · Roteamento

**Antes**

> Quando um roteador aprende rotas para o mesmo destino por protocolos diferentes, ele usa a distância administrativa (DA) para escolher qual rota instalar na tabela de roteamento. A DA indica o grau de confiabilidade de cada fonte de roteamento — quanto menor o valor, maior a confiança (por exemplo, OSPF tem DA 110, enquanto RIP tem DA 120). A métrica, por sua vez, é usada para comparar rotas dentro de um mesmo protocolo, não entre protocolos distintos.

**Depois**

> Quando um roteador aprende rotas para o mesmo destino por protocolos diferentes, ele usa a distância administrativa (DA) para escolher qual rota instalar na tabela de roteamento. A DA indica o grau de confiabilidade de cada fonte de roteamento: quanto menor o valor, maior a confiança (por exemplo, OSPF tem DA 110, enquanto RIP tem DA 120). A métrica, por sua vez, é usada para comparar rotas dentro de um mesmo protocolo, não entre protocolos distintos.

### id 147 · Roteamento

**Antes**

> Uma rota de host é um endereço IPv4 com máscara de 32 bits, ou um IPv6 com máscara de 128 bits. Quando uma interface ativa recebe um endereço IPv4 ou IPv6, uma rota de host local é adicionada automaticamente à tabela e marcada com L. Em rotas estáticas IPv6, o próximo salto pode ser o link-local do vizinho — nesse caso é obrigatório informar o tipo e o número da interface local.

**Depois**

> Uma rota de host é um endereço IPv4 com máscara de 32 bits, ou um IPv6 com máscara de 128 bits. Quando uma interface ativa recebe um endereço IPv4 ou IPv6, uma rota de host local é adicionada automaticamente à tabela e marcada com L. Em rotas estáticas IPv6, o próximo salto pode ser o link-local do vizinho. Nesse caso é obrigatório informar o tipo e o número da interface local.

### id 150 · Roteamento

**Antes**

> Uma pesquisa recursiva ocorre quando a entrada na tabela de roteamento aponta para um próximo salto especificado por endereço IP (e não por interface diretamente conectada), obrigando o roteador a realizar uma segunda busca na tabela para determinar por qual interface alcançar aquele próximo salto. As redes 10.0.0.0/8 e 192.168.2.0/24 possuem esse tipo de entrada — com endereço IP de próximo salto —, enquanto as demais redes da tabela estão associadas diretamente a interfaces de saída.

**Depois**

> Uma pesquisa recursiva ocorre quando a entrada na tabela de roteamento aponta para um próximo salto especificado por endereço IP (e não por interface diretamente conectada), obrigando o roteador a realizar uma segunda busca na tabela para determinar por qual interface alcançar aquele próximo salto. As redes 10.0.0.0/8 e 192.168.2.0/24 possuem esse tipo de entrada (com endereço IP de próximo salto), enquanto as demais redes da tabela estão associadas diretamente a interfaces de saída.

### id 166 · SDN/Cloud

**Antes**

> O recurso de tradução do Cisco IBNS permite que os operadores de rede expressem o comportamento esperado da rede — aquele que melhor atende ao objetivo do negócio.

**Depois**

> O recurso de tradução do Cisco IBNS permite que os operadores de rede expressem o comportamento esperado da rede, aquele que melhor atende ao objetivo do negócio.

### id 173 · Segurança

**Antes**

> O ataque de salto de VLAN (VLAN hopping) explora a sinalização de tronco 802.1Q para fazer o tráfego de uma VLAN alcançar outra VLAN sem passar por um roteador. As duas técnicas mais comuns são o switch spoofing — em que o atacante negocia um tronco com o switch — e o double tagging — em que dois cabeçalhos 802.1Q são inseridos no quadro para enganar o switch. Isso viola o isolamento de camada 2 que as VLANs foram projetadas para fornecer.

**Depois**

> O ataque de salto de VLAN (VLAN hopping) explora a sinalização de tronco 802.1Q para fazer o tráfego de uma VLAN alcançar outra VLAN sem passar por um roteador. As duas técnicas mais comuns são o switch spoofing, em que o atacante negocia um tronco com o switch, e o double tagging, em que dois cabeçalhos 802.1Q são inseridos no quadro para enganar o switch. Isso viola o isolamento de camada 2 que as VLANs foram projetadas para fornecer.

### id 176 · Switching

**Antes**

> Uma incompatibilidade duplex acontece quando um lado da conexão está em full-duplex e o outro em half-duplex. A causa típica é configuração manual errada da interface — velocidade ou duplex fixados em um lado e autonegociação no outro. Em casos raros pode ser falha de autonegociação. O sintoma engana porque a comunicação continua funcionando, só com lentidão, colisões e erros de CRC.

**Depois**

> Uma incompatibilidade duplex acontece quando um lado da conexão está em full-duplex e o outro em half-duplex. A causa típica é configuração manual errada da interface, com velocidade ou duplex fixados em um lado e autonegociação no outro. Em casos raros pode ser falha de autonegociação. O sintoma engana porque a comunicação continua funcionando, só com lentidão, colisões e erros de CRC.

### id 178 · SDN/Cloud

**Antes**

> A nuvem privada é destinada a uma organização ou entidade específica, como o governo. Pode ser montada na rede privada da própria empresa — embora seja cara de construir e manter — ou gerenciada por uma organização externa com segurança de acesso rigorosa. Nuvem pública é compartilhada; híbrida combina as duas; comunitária é dividida entre organizações com interesses comuns.

**Depois**

> A nuvem privada é destinada a uma organização ou entidade específica, como o governo. Pode ser montada na rede privada da própria empresa (embora seja cara de construir e manter), ou gerenciada por uma organização externa com segurança de acesso rigorosa. Nuvem pública é compartilhada; híbrida combina as duas; comunitária é dividida entre organizações com interesses comuns.

### id 179 · Switching

**Antes**

> O PoE entrega energia ao dispositivo pelo próprio cabo Ethernet, não pela rede elétrica. Isso permite instalar telefones IP e pontos de acesso sem fio em qualquer lugar onde haja um cabo de rede, sem precisar de tomada. Só portas específicas do switch suportam PoE — não qualquer porta por comando IOS. O pass-through PoE é suportado pelos compactos Catalyst 2960-C e 3560-C.

**Depois**

> O PoE entrega energia ao dispositivo pelo próprio cabo Ethernet, não pela rede elétrica. Isso permite instalar telefones IP e pontos de acesso sem fio em qualquer lugar onde haja um cabo de rede, sem precisar de tomada. Só portas específicas do switch suportam PoE, e não qualquer porta por comando IOS. O pass-through PoE é suportado pelos compactos Catalyst 2960-C e 3560-C.

### id 183 · WLAN

**Antes**

> Todas as portas do switch ligadas ao WLC precisam estar em modo trunk e agrupadas com EtherChannel. O trunk carrega as várias VLANs das WLANs e o EtherChannel forma o enlace lógico único que dá balanceamento de carga e redundância. O WLC não suporta PAgP nem LACP para esse agrupamento — ele usa LAG.

**Depois**

> Todas as portas do switch ligadas ao WLC precisam estar em modo trunk e agrupadas com EtherChannel. O trunk carrega as várias VLANs das WLANs e o EtherChannel forma o enlace lógico único que dá balanceamento de carga e redundância. O WLC não suporta PAgP nem LACP para esse agrupamento: ele usa LAG.

### id 185 · VLANs

**Antes**

> Se todas as portas estão na VLAN 1 (padrão), nenhuma VLAN nativa foi atribuída explicitamente e não há outras VLANs ativas. Logo, a VLAN nativa acabou sendo a mesma da VLAN de gerenciamento — o que é considerado risco de segurança. Por padrão, todo o tráfego de controle da camada 2 já está associado à VLAN 1.

**Depois**

> Se todas as portas estão na VLAN 1 (padrão), nenhuma VLAN nativa foi atribuída explicitamente e não há outras VLANs ativas. Logo, a VLAN nativa acabou sendo a mesma da VLAN de gerenciamento, o que é considerado risco de segurança. Por padrão, todo o tráfego de controle da camada 2 já está associado à VLAN 1.

### id 186 · VLANs

**Antes**

> Quando uma porta trunk recebe quadros sem marcação (incomum em redes bem projetadas), ela os encaminha para a VLAN nativa. Movendo a VLAN nativa para fora das VLANs de dados, esses quadros não marcados não disputam largura de banda com o tráfego de dados. A VLAN nativa não foi criada para transportar tráfego de gerenciamento — ela existe por compatibilidade com cenários de LAN legados.

**Depois**

> Quando uma porta trunk recebe quadros sem marcação (incomum em redes bem projetadas), ela os encaminha para a VLAN nativa. Movendo a VLAN nativa para fora das VLANs de dados, esses quadros não marcados não disputam largura de banda com o tráfego de dados. A VLAN nativa não foi criada para transportar tráfego de gerenciamento. Ela existe por compatibilidade com cenários de LAN legados.

### id 187 · Roteamento

**Antes**

> Uma rota estática padrão funciona como gateway de último recurso: encaminha o tráfego de destino desconhecido para um próximo salto ou interface de saída. As outras opções são apenas campos da tabela de roteamento — o próximo salto e a interface de saída dizem para onde mandar o pacote já roteado, e a origem da rota indica de onde a rota foi aprendida.

**Depois**

> Uma rota estática padrão funciona como gateway de último recurso: encaminha o tráfego de destino desconhecido para um próximo salto ou interface de saída. As outras opções são apenas campos da tabela de roteamento: o próximo salto e a interface de saída dizem para onde mandar o pacote já roteado, e a origem da rota indica de onde a rota foi aprendida.

### id 189 · OSPF

**Antes**

> O router ID identifica unicamente o roteador no domínio OSPF. Ele pode ser atribuído automaticamente (IP mais alto de uma interface, ou de uma loopback) ou definido manualmente com o comando router-id. A Cisco recomenda o router-id explícito porque ele não muda quando uma interface cai — o que facilita a identificação durante o troubleshooting.

**Depois**

> O router ID identifica unicamente o roteador no domínio OSPF. Ele pode ser atribuído automaticamente (IP mais alto de uma interface, ou de uma loopback) ou definido manualmente com o comando router-id. A Cisco recomenda o router-id explícito porque ele não muda quando uma interface cai, o que facilita a identificação durante o troubleshooting.

### id 190 · Roteamento

**Antes**

> O comando ipv6 unicast-routing habilita o roteamento IPv6 no roteador. Sem ele, o equipamento tem endereços IPv6 nas interfaces mas não encaminha pacotes entre redes. O ipv6 enable ativa IPv6 numa interface; o ipv6 address atribui endereço; o ipv6 route cria rota estática — nenhum deles liga o roteamento globalmente.

**Depois**

> O comando ipv6 unicast-routing habilita o roteamento IPv6 no roteador. Sem ele, o equipamento tem endereços IPv6 nas interfaces mas não encaminha pacotes entre redes. O ipv6 enable ativa IPv6 numa interface; o ipv6 address atribui endereço; o ipv6 route cria rota estática; nenhum deles liga o roteamento globalmente.

### id 195 · Segurança

**Antes**

> A autenticação AAA baseada em servidor usa um servidor externo TACACS+ ou RADIUS para manter o banco de usuários e senhas. Quando o cliente se conecta a um dispositivo com AAA habilitado, o dispositivo consulta esses servidores para autenticar. SSH é acesso remoto, SNMP é gerenciamento e 802.1x é o padrão de controle de acesso por porta — nenhum dos três é o protocolo de servidor AAA.

**Depois**

> A autenticação AAA baseada em servidor usa um servidor externo TACACS+ ou RADIUS para manter o banco de usuários e senhas. Quando o cliente se conecta a um dispositivo com AAA habilitado, o dispositivo consulta esses servidores para autenticar. SSH é acesso remoto, SNMP é gerenciamento e 802.1x é o padrão de controle de acesso por porta; nenhum dos três é o protocolo de servidor AAA.

### id 197 · Segurança

**Antes**

> Os sistemas de prevenção de intrusões (IPS) identificam ameaças de propagação rápida — como ataques zero-day — e as bloqueiam antes que entrem na rede corporativa. Firewalls filtram grandes volumes de tráfego com granularidade, as ACLs filtram por endereço IP e aplicação, e as VPNs dão acesso remoto seguro. Nenhum deles tem o papel de detectar e impedir a intrusão.

**Depois**

> Os sistemas de prevenção de intrusões (IPS) identificam ameaças de propagação rápida (como ataques zero-day) e as bloqueiam antes que entrem na rede corporativa. Firewalls filtram grandes volumes de tráfego com granularidade, as ACLs filtram por endereço IP e aplicação, e as VPNs dão acesso remoto seguro. Nenhum deles tem o papel de detectar e impedir a intrusão.

### id 198 · Automação

**Antes**

> No Ansible, o conjunto de instruções a executar se chama Playbook — traduzido na plataforma como guia de atividades. Pilar é conceito do SaltStack, Cookbook é do Chef e Manifesto é do Puppet.

**Depois**

> No Ansible, o conjunto de instruções a executar se chama Playbook, traduzido na plataforma como guia de atividades. Pilar é conceito do SaltStack, Cookbook é do Chef e Manifesto é do Puppet.

### id 199 · Automação

**Antes**

> Ansible e SaltStack são ferramentas de gerenciamento de configuração desenvolvidas em Python. Chef e Puppet são desenvolvidas em Ruby, que costuma ser considerada mais difícil de aprender que Python. O NETCONF não é ferramenta de gerenciamento de configuração — é um protocolo de gerenciamento de rede.

**Depois**

> Ansible e SaltStack são ferramentas de gerenciamento de configuração desenvolvidas em Python. Chef e Puppet são desenvolvidas em Ruby, que costuma ser considerada mais difícil de aprender que Python. O NETCONF não é ferramenta de gerenciamento de configuração, e sim um protocolo de gerenciamento de rede.

### id 202 · Segurança

**Antes**

> Um servidor DHCP não autorizado (rogue) conectado à rede responde aos clientes antes do servidor legítimo e entrega parâmetros falsos: gateway errado, DNS malicioso ou IP inválido. Isso permite ataque man-in-the-middle ou negação de serviço. Na plataforma em português esse ataque aparece como ataque de privação do DHCP; tecnicamente o nome correto em inglês é DHCP spoofing (falsificação de DHCP) — privação (starvation) é o outro ataque, que esgota o pool de endereços.

**Depois**

> Um servidor DHCP não autorizado (rogue) conectado à rede responde aos clientes antes do servidor legítimo e entrega parâmetros falsos: gateway errado, DNS malicioso ou IP inválido. Isso permite ataque man-in-the-middle ou negação de serviço. Na plataforma em português esse ataque aparece como ataque de privação do DHCP; tecnicamente o nome correto em inglês é DHCP spoofing (falsificação de DHCP); privação (starvation) é o outro ataque, que esgota o pool de endereços.

### id 205 · Roteamento

**Antes**

> Para enviar tráfego a UM servidor específico, a rota precisa apontar para aquele endereço único: uma rota de host, com prefixo /128 em IPv6 (o equivalente ao /32 do IPv4). CUIDADO: quando o próximo salto é um endereço link-local, a exigência é outra — informar o tipo e o número da interface.

**Depois**

> Para enviar tráfego a UM servidor específico, a rota precisa apontar para aquele endereço único: uma rota de host, com prefixo /128 em IPv6 (o equivalente ao /32 do IPv4). Atenção: quando o próximo salto é um endereço link-local, a exigência é outra, informar o tipo e o número da interface.
