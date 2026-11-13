window.QUESTIONS_M4 = [
 {
  "id": 1,
  "mod": 4,
  "fonte": "ensa",
  "tp": "OSPF",
  "ty": "single",
  "text": "Que tipo de pacote OSPFv2 contém uma lista abreviada do LSDB de um roteador de envio e é usado pelos roteadores receptores para verificar o LSDB local?",
  "opts": [
   "solicitação de estado do link",
   "descrição do banco de dados",
   "atualização do estado do link",
   "reconhecimento de estado do link"
  ],
  "cor": 1,
  "sub": "descrição do banco de dados",
  "why": "O pacote DBD (Descrição do Banco de Dados) carrega apenas um resumo do LSDB — os cabeçalhos dos LSAs — para que o vizinho compare com o seu próprio banco e só peça o que estiver faltando. É a etapa de 'comparar antes de copiar'."
 },
 {
  "id": 2,
  "mod": 4,
  "fonte": "ensa",
  "tp": "OSPF",
  "ty": "single",
  "text": "Qual etapa no processo de roteamento de estado de link é descrita por um roteador que constrói um banco de dados de estado de link com base em LSAs recebidos?",
  "opts": [
   "construindo a tabela de topologia",
   "declarar um vizinho inacessível",
   "selecionando o ID do roteador",
   "executando o algoritmo SPF"
  ],
  "cor": 0,
  "sub": "construindo a tabela de topologia",
  "why": "Depois de trocar os LSAs, o roteador monta a tabela de topologia (o LSDB) com todas as informações de estado de link recebidas. Só depois ele roda o algoritmo SPF sobre essa tabela para escolher as melhores rotas."
 },
 {
  "id": 3,
  "mod": 4,
  "fonte": "ensa",
  "tp": "OSPF",
  "ty": "single",
  "text": "Quando uma rede OSPF é convergente e nenhuma alteração de topologia de rede foi detectada por um roteador, com que frequência os pacotes LSU serão enviados para roteadores vizinhos?",
  "opts": [
   "a cada 60 minutos",
   "a cada 10 minutos",
   "a cada 30 minutos",
   "a cada 5 minutos"
  ],
  "cor": 2,
  "sub": "a cada 30 minutos",
  "why": "Os LSAs são reenviados periodicamente a cada 30 minutos (LSA refresh), mesmo sem nenhuma mudança na topologia. É assim que o OSPF garante que o LSDB não fique desatualizado se um pacote se perder."
 },
 {
  "id": 4,
  "mod": 4,
  "fonte": "ensa",
  "tp": "OSPF",
  "ty": "match",
  "text": "Associe o estado OSPF à ordem em que ocorre.",
  "pairs": [
   {
    "l": "1º estado",
    "r": "Estado inativo (Down)"
   },
   {
    "l": "2º estado",
    "r": "Estado de inicialização (Init)"
   },
   {
    "l": "3º estado",
    "r": "Estado bidirecional (Two-Way)"
   },
   {
    "l": "4º estado",
    "r": "Estado ExStart"
   },
   {
    "l": "5º estado",
    "r": "Estado Exchange"
   },
   {
    "l": "6º estado",
    "r": "Estado Loading"
   },
   {
    "l": "7º estado",
    "r": "Estado Full"
   }
  ],
  "sub": "Estados da adjacência OSPF",
  "why": "A ordem correta da adjacência OSPF é: Down (inativo) → Init (inicialização) → Two-Way (bidirecional) → ExStart → Exchange → Loading → Full. Cada estado representa uma etapa da troca de informações entre os vizinhos."
 },
 {
  "id": 5,
  "mod": 4,
  "fonte": "ensa",
  "tp": "OSPF",
  "ty": "single",
  "text": "Consulte a figura. Qual é o custo de OSPF para alcançar o roteador A LAN 172.16.1.0/24 a partir de B?",
  "opts": [
   "65",
   "128",
   "782",
   "74"
  ],
  "cor": 0,
  "sub": "65",
  "why": "O custo OSPF é a soma dos custos de cada link no caminho até a rede de destino. Cada link vale 10^8 / largura de banda em bps; somando os links do caminho chega-se a 65.",
  "fig": "img/m3-q049.webp",
  "figAlt": "Figura da questão 5 do exame final ENSA"
 },
 {
  "id": 6,
  "mod": 4,
  "fonte": "ensa",
  "tp": "OSPF",
  "ty": "single",
  "text": "Consulte a figura. Se o switch for reinicializado e todos os roteadores tiverem que restabelecer as adjacências OSPF, quais roteadores se tornarão os novos DR e BDR?",
  "opts": [
   "O roteador R1 se tornará o DR e o roteador R2 se tornará o BDR.",
   "O roteador R4 se tornará o DR e o roteador R3 se tornará o BDR.",
   "O roteador R2 se tornará o DR e o roteador R3 se tornará o BDR.",
   "O roteador R4 se tornará o DR e o roteador R1 se tornará o BDR."
  ],
  "cor": 3,
  "sub": "O roteador R4 se tornará o DR e o roteador R1 se tornará o BDR.",
  "why": "Na eleição DR/BDR vence a maior prioridade de interface OSPF; em caso de empate, o maior router ID. Após a reinicialização do switch, R4 assume como DR e R1 como BDR conforme esses critérios.",
  "fig": "img/m3-q093.webp",
  "figAlt": "Figura da questão 6 do exame final ENSA"
 },
 {
  "id": 7,
  "mod": 4,
  "fonte": "ensa",
  "tp": "OSPF",
  "ty": "single",
  "text": "Que comando um engenheiro de rede emitirá para verificar os intervalos do temporizador de Hello e de Dead configurados em um link WAN ponto a ponto entre dois roteadores que estão executando OSPFv2?",
  "opts": [
   "show ip ospf neighbor",
   "show ip ospf interface serial 0/0/0",
   "show ip ospf interface fastethernet 0/1",
   "show ipv6 ospf interface serial 0/0/0"
  ],
  "cor": 1,
  "sub": "show ip ospf interface serial 0/0/0",
  "why": "O comando show ip ospf interface serial 0/0/0 exibe, entre outras informações, os temporizadores Hello e Dead configurados naquela interface específica — exatamente o que se quer verificar no link WAN ponto a ponto."
 },
 {
  "id": 8,
  "mod": 4,
  "fonte": "ensa",
  "tp": "OSPF",
  "ty": "multi",
  "text": "Quais são as duas finalidades de um ID de roteador OSPF? (Escolha duas.)",
  "opts": [
   "identificar unicamente o roteador no domínio OSPF",
   "facilitar o estabelecimento de convergência da rede",
   "ativar o algoritmo SPF para determinar o caminho de menor custo para redes remotas",
   "facilitar a transição do estado do vizinho OSPF para Full (Completo)",
   "facilitar a participação do roteador na eleição do roteador designado (designated router)"
  ],
  "cor": [
   0,
   4
  ],
  "sub": "Escolha 2 alternativas",
  "why": "O router ID identifica unicamente cada roteador dentro do domínio OSPF e é usado como critério de desempate na eleição do DR/BDR. Ele não define rotas nem áreas — serve para identificar e eleger."
 },
 {
  "id": 9,
  "mod": 4,
  "fonte": "ensa",
  "tp": "OSPF",
  "ty": "single",
  "text": "Consulte a figura. Um administrador de rede configurou o OSPFv2 nos dois roteadores da Cisco como exibido. Os roteadores não podem formar uma adjacência do vizinho. O que deve ser feito para corrigir o problema?",
  "opts": [
   "Incluir o comando network 192.168.30.0 0.0.0.255 area 0 no roteador R1.",
   "Remova a configuração de interface passiva FastEthernet0/0 no roteador R1.",
   "Incluir o comando network 192.168.20.1 0.0.0.0 area 0 no roteador R1.",
   "Altere o endereço IP em S0/0 do roteador R2 para 192.168.20.2."
  ],
  "cor": 3,
  "sub": "Altere o endereço IP em S0/0 do roteador R2 para 192.168.20.2.",
  "why": "As interfaces S0/0 dos dois roteadores estão em sub-redes diferentes, então não conseguem formar adjacência. Corrigir o IP de S0/0 do R2 para 192.168.20.2 coloca as duas pontas na mesma sub-rede.",
  "fig": "img/m3-q150.webp",
  "figAlt": "Figura da questão 9 do exame final ENSA"
 },
 {
  "id": 10,
  "mod": 4,
  "fonte": "ensa",
  "tp": "Segurança",
  "ty": "single",
  "text": "Qual é a característica significativa do malware worm?",
  "opts": [
   "Um worm pode ser executado independentemente do sistema host.",
   "Uma vez instalado em um sistema host, um worm não se replica.",
   "Um worm deve ser acionado por um evento no sistema host.",
   "O malware Worm se disfarça de software legítimo."
  ],
  "cor": 0,
  "sub": "Um worm pode ser executado independentemente do sistema host.",
  "why": "O worm é autônomo: ele se replica e se executa sozinho, sem precisar de um programa hospedeiro. É essa independência que o torna capaz de se espalhar rapidamente pela rede."
 },
 {
  "id": 11,
  "mod": 4,
  "fonte": "ensa",
  "tp": "Segurança",
  "ty": "single",
  "text": "Que tipo de ameaça à segurança pode ser descrito como software que se conecta a outro programa para executar uma função indesejada específica?",
  "opts": [
   "worm",
   "Cavalo de Tróia de negação de serviço",
   "vírus",
   "cavalo de Tróia proxy"
  ],
  "cor": 2,
  "sub": "vírus",
  "why": "O vírus precisa se anexar a um programa ou arquivo legítimo e só se executa quando o usuário abre esse hospedeiro. Sem hospedeiro, ele não roda."
 },
 {
  "id": 12,
  "mod": 4,
  "fonte": "ensa",
  "tp": "Segurança",
  "ty": "single",
  "text": "Qual é a melhor descrição do malware cavalo de Troia?",
  "opts": [
   "É a forma de malware mais facilmente detectada.",
   "É um malware que só pode ser distribuído pela Internet.",
   "É um software que causa problemas irritantes, mas não problemas fatais de computador.",
   "Aparece como software útil, mas o código mal-intencionado está escondido nele."
  ],
  "cor": 3,
  "sub": "Aparece como software útil, mas o código mal-intencionado está escondido nele.",
  "why": "O cavalo de Troia se disfarça de software útil ou legítimo para induzir o usuário a executá-lo, mas carrega código malicioso escondido. Ele não se replica sozinho como o worm."
 },
 {
  "id": 13,
  "mod": 4,
  "fonte": "ensa",
  "tp": "Segurança",
  "ty": "single",
  "text": "O que é um recurso de um IPS?",
  "opts": [
   "Seu foco principal é identificar possíveis incidentes.",
   "Não tem impacto na latência.",
   "É implantado no modo offline.",
   "Pode parar pacotes maliciosos."
  ],
  "cor": 3,
  "sub": "Pode parar pacotes maliciosos.",
  "why": "O IPS (Intrusion Prevention System) fica no caminho do tráfego e pode bloquear ativamente os pacotes maliciosos. O IDS apenas detecta e alerta; o IPS previne."
 },
 {
  "id": 14,
  "mod": 4,
  "fonte": "ensa",
  "tp": "ACLs",
  "ty": "multi",
  "text": "Consulte a figura. As interfaces Gigabit em ambos os roteadores foram configuradas com os números de subinterface que correspondem aos números de VLAN conectadas a eles. Os computadores na VLAN 10 devem ser capazes de imprimir na impressora P1 na VLAN 12. Os PCs na VLAN 20 devem imprimir nas impressoras na VLAN 22. Qual interface e em qual direção você deve colocar uma ACL padrão que permita a impressão na P1 da VLAN 10, mas impeça os PCs na VLAN 20 de usar a impressora P1? (Escolha duas.)",
  "opts": [
   "R2 S0/0/1",
   "R2 Gi0/1.20",
   "outbound",
   "R1 Gi0/1.12",
   "R1 S0/0/0",
   "inbound"
  ],
  "cor": [
   2,
   3
  ],
  "sub": "Escolha 2 alternativas",
  "why": "A ACL padrão deve ser aplicada o mais próximo possível do destino, no sentido outbound. Nesse cenário, aplica-se na subinterface R1 Gi0/1.12 no sentido outbound para filtrar o tráfego antes de sair.",
  "fig": "img/m3-p14.webp",
  "figAlt": "Topologia com R1 e R2 ligados por serial, VLANs 10/11/12 à esquerda e 20/21/22 à direita"
 },
 {
  "id": 15,
  "mod": 4,
  "fonte": "ensa",
  "tp": "ACLs",
  "ty": "single",
  "text": "Se um roteador tem duas interfaces e está roteando o tráfego IPv4 e IPv6, quantas ACLs podem ser criadas e aplicadas a ele?",
  "opts": [
   "6",
   "4",
   "16",
   "8",
   "12"
  ],
  "cor": 3,
  "sub": "8",
  "why": "Cada interface tem 2 direções (in e out) e cada direção aceita 1 ACL por protocolo. Com 2 interfaces × 2 direções × 2 protocolos (IPv4 e IPv6) = 8 ACLs no total."
 },
 {
  "id": 16,
  "mod": 4,
  "fonte": "ensa",
  "tp": "ACLs",
  "ty": "multi",
  "text": "Quais são as três afirmativas geralmente consideradas como práticas recomendadas no posicionamento das ACLs? (Escolha três.)",
  "opts": [
   "Coloque as ACLs padrão próximas ao endereço IP origem do tráfego.",
   "Coloque as ACLs estendidas próximas ao endereço IP destino do tráfego.",
   "Coloque as ACLs padrão próximas ao endereço IP destino do tráfego.",
   "Para cada ACL de entrada colocada em uma interface, deve haver uma ACL de saída correspondente.",
   "Coloque as ACLs estendidas próximas ao endereço IP origem do tráfego.",
   "Filtre o tráfego indesejado antes que ele trafegue em um link de baixa largura de banda."
  ],
  "cor": [
   2,
   4,
   5
  ],
  "sub": "Escolha 3 alternativas",
  "why": "As três boas práticas: ACL padrão perto do destino, ACL estendida perto da origem (para descartar o tráfego o mais cedo possível) e filtrar o indesejado antes de atravessar links de baixa largura de banda."
 },
 {
  "id": 17,
  "mod": 4,
  "fonte": "ensa",
  "tp": "ACLs",
  "ty": "multi",
  "text": "Consulte a figura. O administrador de redes que tem o endereço IP 10.0.70.23/25 precisa ter acesso ao servidor FTP corporativo (10.0.54.5/28). O servidor FTP é também um servidor web que é acessível a todos os funcionários internos em redes no endereço 10.x.x.x. Nenhum outro tráfego deve ser permitido para esse servidor. Qual ACL estendida seria usada para filtrar este tráfego e como essa ACL seria aplicada? (Escolha duas.)",
  "opts": [
   "access-list 105 permit tcp host 10.0.70.23 host 10.0.54.5 eq 20\naccess-list 105 permit tcp host 10.0.70.23 host 10.0.54.5 eq 21\naccess-list 105 permit tcp 10.0.0.0 0.255.255.255 host 10.0.54.5 eq www\naccess-list 105 deny ip any host 10.0.54.5\naccess-list 105 permit ip any any",
   "R1(config)# interface s0/0/0\nR1(config-if)# ip access-group 105 out",
   "R1(config)# interface gi0/0\nR1(config-if)# ip access-group 105 out",
   "access-list 105 permit ip host 10.0.70.23 host 10.0.54.5\naccess-list 105 permit tcp any host 10.0.54.5 eq www\naccess-list 105 permit ip any any",
   "access-list 105 permit tcp host 10.0.54.5 any eq www\naccess-list 105 permit tcp host 10.0.70.23 host 10.0.54.5 eq 20\naccess-list 105 permit tcp host 10.0.70.23 host 10.0.54.5 eq 21",
   "R2(config)# interface gi0/0\nR2(config-if)# ip access-group 105 in"
  ],
  "cor": [
   0,
   2
  ],
  "sub": "Escolha 2 alternativas",
  "why": "A ACL estendida 105 deve ser aplicada perto da origem, na interface gi0/0 do R1 no sentido outbound, e conter uma ACE permitindo TCP da origem 10.0.70.23 para o destino 10.0.54.5 na porta 20 (FTP-data).",
  "fig": "img/m3-p17.webp",
  "figAlt": "Topologia com R1, R2, servidor FTP/Web e PCs nas sub-redes 10.0.55/24 e 10.0.70/25"
 },
 {
  "id": 18,
  "mod": 4,
  "fonte": "ensa",
  "tp": "ACLs",
  "ty": "single",
  "text": "Consulte a figura. Um administrador de redes está configurando uma ACL IPv4 padrão. Qual é o efeito após a inserção do comando no access-list 10?",
  "opts": [
   "A ACL 10 é desativada na Fa0/1.",
   "A ACL 10 é removida da configuração de execução (running configuration) atual e da interface Fa0/1.",
   "A ACL 10 será desativada e removida após reinicializar o R1.",
   "A ACL 10 é removida da configuração de execução (running configuration)."
  ],
  "cor": 3,
  "sub": "A ACL 10 é removida da configuração de execução (running configuration).",
  "why": "O comando no access-list 10 remove a ACL inteira da configuração em execução. Diferente de remover uma única ACE com 'no <número da ACE>', aqui a lista toda é apagada.",
  "fig": "img/m3-p18.webp",
  "figAlt": "CLI do R1 com ACL IPv4 padrão 10: permit host 192.168.25.16, deny rede 192.168.25.0",
  "code": "R1# configure terminal\nEnter configuration commands, one per line.  End with CNTL/Z.\nR1(config)# access-list 10 permit host 192.168.25.16\nR1(config)# access-list 10 deny 192.168.25.0 0.0.0.255\nR1(config)# interface fastEthernet 0/1\nR1(config-if)# ip access-group 10 in\nR1(config-if)# end\nR1#\n\nR1# configure terminal\nEnter configuration commands, one per line.  End with CNTL/Z.\nR1(config)# no access-list 10\nR1(config)# end\nR1#"
 },
 {
  "id": 19,
  "mod": 4,
  "fonte": "ensa",
  "tp": "ACLs",
  "ty": "single",
  "text": "Um administrador configurou uma lista de acesso em R1 para permitir o acesso administrativo SSH vindo do host 172.16.1.100. Qual comando aplica a ACL corretamente?",
  "opts": [
   "R1(config-line)# access-class 1 in",
   "R1(config-if)# ip access-group 1 in",
   "R1(config-if)# ip access-group 1 out",
   "R1(config-line)# access-class 1 out"
  ],
  "cor": 0,
  "sub": "R1(config-line)# access-class 1 in",
  "why": "O comando access-class é aplicado nas linhas vty e controla quem pode abrir sessões administrativas (SSH/Telnet) no roteador. É diferente de ip access-group, que filtra tráfego que atravessa a interface."
 },
 {
  "id": 20,
  "mod": 4,
  "fonte": "ensa",
  "tp": "ACLs",
  "ty": "single",
  "text": "Um técnico é encarregado de usar ACLs para proteger um roteador. Quando o técnico usaria o access-class 20 na opção de configuração ou comando?",
  "opts": [
   "para proteger o acesso administrativo ao roteador",
   "para remover todas as ACLs do roteador",
   "para exibir todo o tráfego restrito",
   "para proteger o tráfego de gerenciamento no roteador"
  ],
  "cor": 0,
  "sub": "para proteger o acesso administrativo ao roteador",
  "why": "O access-class protege o acesso administrativo ao próprio roteador (linhas vty), não o tráfego que passa por ele. É a ferramenta certa para restringir quem administra o equipamento."
 },
 {
  "id": 21,
  "mod": 4,
  "fonte": "ensa",
  "tp": "ACLs",
  "ty": "single",
  "text": "Consulte a figura. Um administrador de rede configurou a ACL 9 como mostrado. Os usuários na rede 172.31.1.0/24 não podem encaminhar o tráfego através do roteador CiscoVille. Qual é a causa mais provável da falha de tráfego?",
  "opts": [
   "O número da porta para o tráfego não foi identificado com a palavra-chave eq.",
   "A instrução permit especifica uma máscara curinga incorreta.",
   "A palavra-chave estabelecida não é especificada.",
   "A sequência das ACEs está incorreta."
  ],
  "cor": 3,
  "sub": "A sequência das ACEs está incorreta.",
  "why": "A ACL 9 tem a sequência das ACEs na ordem errada: uma ACE de negação aparece antes de uma permissão que deveria vir primeiro, e o roteador processa as ACEs de cima para baixo, parando na primeira que casa.",
  "fig": "img/m3-p21.webp",
  "figAlt": "CLI CiscoVille: ACL 9 com permit/deny para redes 172.x e 192.168.1.0 aplicada em Fa0/1",
  "code": "CiscoVille#\nCiscoVille# configure terminal\nCiscoVille(config)# access-list 9 permit 172.29.0.0 0.0.0.255\nCiscoVille(config)# access-list 9 permit 172.30.0.0 0.0.0.255\nCiscoVille(config)# access-list 9 deny 172.31.0.0 0.0.255.255\nCiscoVille(config)# access-list 9 permit 172.31.1.0 0.0.0.255\nCiscoVille(config)# access-list 9 deny 192.168.1.0 0.0.0.255\nCiscoVille(config)# access-list 9 permit any\nCiscoVille(config)# interface fastethernet0/1\nCiscoVille(config-if)# ip access-group 9 in\nCiscoVille(config-if)# end"
 },
 {
  "id": 22,
  "mod": 4,
  "fonte": "ensa",
  "tp": "NAT",
  "ty": "single",
  "text": "O que está correto em relação ao NAT para IPv6?",
  "opts": [
   "A pilha dupla é um exemplo de implementação NAT para IPv6.",
   "É usado para converter endereços IPv6 privados em endereços IPv6 públicos.",
   "NAT64 foi substituído pelo IETF em favor do NAT-PT.",
   "É um mecanismo temporário para auxiliar na migração de IPv4 para IPv6."
  ],
  "cor": 3,
  "sub": "É um mecanismo temporário para auxiliar na migração de IPv4 para IPv6.",
  "why": "O NAT para IPv6 (NAT66) não é usado como solução permanente: ele existe como mecanismo temporário para facilitar a migração de IPv4 para IPv6. O IPv6 tem endereçamento suficiente e dispensa NAT em regime normal."
 },
 {
  "id": 23,
  "mod": 4,
  "fonte": "ensa",
  "tp": "NAT",
  "ty": "single",
  "text": "Um administrador de rede está fazendo a identificação e solução de problemas do NAT dinâmico que está configurado no roteador R2. Que comando pode ser usado pelo administrador para ver o número total de conversões do NAT ativas e o número de endereços alocados do pool de NAT?",
  "opts": [
   "R2# show ip nat translations",
   "R2# clear ip nat translation",
   "R2# show running-config",
   "R2# show ip nat statistics"
  ],
  "cor": 3,
  "sub": "R2# show ip nat statistics",
  "why": "O comando show ip nat statistics mostra o resumo das traduções: total de traduções ativas, hits, misses e o uso do pool. É o comando indicado para diagnosticar o NAT dinâmico.",
  "fig": "img/m3-q082.webp",
  "figAlt": "Figura da questão 23 do exame final ENSA",
  "code": "interface FastEthernet 0/0\n ip address 10.10.10.1 255.255.255.0\n ip nat inside\n no cdp enable\n hold-queue 32 in\n hold-queue 100 out\n!\ninterface FastEthernet 0/1\n ip address dhcp\n ip nat outside\n no cdp enable\n!\nip classless\nip http server\n!\nip nat inside source list 102 interface fastethernet 0/1 overload\naccess-list 102 permit ip  10.10.10.0  0.0.0.255  any\nno cdp run\n!"
 },
 {
  "id": 24,
  "mod": 4,
  "fonte": "ensa",
  "tp": "NAT",
  "ty": "single",
  "text": "Consulte a figura. O R1 está configurado para NAT estático. Qual endereço IP os hosts da Internet usarão para alcançar o PC1?",
  "opts": [
   "209.165.201.1",
   "192.168.0.10",
   "192.168.0.1",
   "209.165.200.225"
  ],
  "cor": 3,
  "sub": "209.165.200.225",
  "why": "No NAT estático, o endereço global interno (o endereço público pelo qual o PC1 é visto na Internet) é o 209.165.200.225. É esse IP que os hosts externos usam para alcançar o PC1.",
  "fig": "img/m3-p24.webp",
  "figAlt": "NAT: PC1, S1, R1 e ISP com tabela de endereços inside local/global e outside local/global"
 },
 {
  "id": 25,
  "mod": 4,
  "fonte": "ensa",
  "tp": "NAT",
  "ty": "single",
  "text": "Que tipo de NAT mapeia um endereço local interno único para um endereço global interno único?",
  "opts": [
   "overloading",
   "estático",
   "dinâmico",
   "conversão do endereço de porta (PAT)"
  ],
  "cor": 1,
  "sub": "estático",
  "why": "O NAT estático faz um mapeamento fixo 1:1 entre um endereço local interno e um endereço global interno. É usado para servidores que precisam ser acessíveis de fora sempre pelo mesmo endereço."
 },
 {
  "id": 26,
  "mod": 4,
  "fonte": "ensa",
  "tp": "NAT",
  "ty": "single",
  "text": "Consulte a figura. O que precisa ser feito para concluir a configuração NAT estática em R1?",
  "opts": [
   "R1 deve ser configurado com o comando ip nat inside source static 209.165.200.1 192.168.11.11.",
   "R1 deve ser configurado com o comando ip nat inside source static 209.165.200.200 192.168.11.11.",
   "A interface S0/0/0 deve ser configurada com o comando ip nat outside.",
   "A interface Fa0/0 deve ser configurada com o comando no ip nat inside."
  ],
  "cor": 2,
  "sub": "A interface S0/0/0 deve ser configurada com o comando ip nat outside.",
  "why": "Falta marcar a interface S0/0/0 como ip nat outside. Sem uma interface inside e outra outside definidas, o roteador não sabe qual tráfego traduzir e o NAT estático não funciona.",
  "fig": "img/m3-p26.webp",
  "figAlt": "NAT estático com SW1, PC1, R1, Internet e servidor; CLI com ip nat inside source static"
 },
 {
  "id": 27,
  "mod": 4,
  "fonte": "ensa",
  "tp": "WAN",
  "ty": "multi",
  "text": "Quais são os dois tipos de dispositivos específicos para ambientes de WAN e que não são encontrados em uma LAN? (Escolha duas.)",
  "opts": [
   "switch de camada de acesso",
   "modem de banda larga",
   "CSU/DSU",
   "switch de núcleo",
   "roteador da camada de distribuição"
  ],
  "cor": [
   1,
   2
  ],
  "sub": "Escolha 2 alternativas",
  "why": "Modem de banda larga e CSU/DSU são dispositivos específicos de ambiente WAN. Switches, roteadores e access points podem aparecer em LAN e WAN; esses dois são exclusivos do lado do provedor/enlace."
 },
 {
  "id": 28,
  "mod": 4,
  "fonte": "ensa",
  "tp": "WAN",
  "ty": "single",
  "text": "Qual tecnologia fornece aos notebooks a capacidade de funcionar em uma rede de celulares?",
  "opts": [
   "Bluetooth",
   "802.11 Wi-Fi",
   "hotspot móvel",
   "infravermelho"
  ],
  "cor": 2,
  "sub": "hotspot móvel",
  "why": "O hotspot móvel permite que o notebook use a rede celular do smartphone para se conectar à Internet. É a tecnologia que dá conectividade à rede de celulares."
 },
 {
  "id": 29,
  "mod": 4,
  "fonte": "ensa",
  "tp": "WAN",
  "ty": "multi",
  "text": "Quais três fatores relacionados ao tráfego influenciariam a seleção de um tipo de link de WAN específico? (Escolha três.)",
  "opts": [
   "confiabilidade",
   "custo do link",
   "tipo de tráfego",
   "necessidades de segurança",
   "distância entre os sites",
   "quantidade de tráfego"
  ],
  "cor": [
   2,
   3,
   5
  ],
  "sub": "Escolha 3 alternativas",
  "why": "A escolha de um tipo de WAN depende do tipo de tráfego (voz, vídeo, dados), das necessidades de segurança e da quantidade de tráfego. Não depende de fatores como a marca do equipamento ou o número de usuários isoladamente."
 },
 {
  "id": 30,
  "mod": 4,
  "fonte": "ensa",
  "tp": "WAN",
  "ty": "single",
  "text": "Qual solução de VPN permite o uso de um navegador da Web para estabelecer um túnel VPN de acesso remoto seguro para o ASA?",
  "opts": [
   "SSL sem cliente",
   "site a site usando uma chave pré-compartilhada",
   "SSL baseada em cliente",
   "site a site usando uma ACL"
  ],
  "cor": 0,
  "sub": "SSL sem cliente",
  "why": "A VPN SSL sem cliente usa o próprio navegador para estabelecer o túnel, sem instalar software. É a opção quando o usuário não pode ou não quer instalar um cliente dedicado."
 },
 {
  "id": 31,
  "mod": 4,
  "fonte": "ensa",
  "tp": "WAN",
  "ty": "multi",
  "text": "Quais são as duas afirmações que descrevem as VPNs de acesso remoto? (Escolha duas.)",
  "opts": [
   "Os usuários finais não sabem que a VPN existe.",
   "As VPNs de acesso remoto suportam as necessidades de trabalhadores remotos e usuários móveis.",
   "Uma linha alugada é necessária para implementar VPNs de acesso remoto.",
   "O software cliente geralmente é necessário para ter acesso à rede.",
   "As VPNs de acesso remoto são usadas para conectar redes inteiras, como filiais de escritórios a sedes."
  ],
  "cor": [
   1,
   3
  ],
  "sub": "Escolha 2 alternativas",
  "why": "As VPNs de acesso remoto atendem trabalhadores remotos e normalmente exigem um software cliente instalado no dispositivo do usuário para criar o túnel até a empresa."
 },
 {
  "id": 32,
  "mod": 4,
  "fonte": "ensa",
  "tp": "WAN",
  "ty": "single",
  "text": "Qual afirmativa descreve um recurso da VPN site a site?",
  "opts": [
   "Os hosts individuais podem ativar e desativar a conexão VPN.",
   "Hosts internos enviam pacotes normais, não encapsulados.",
   "O software cliente da VPN está instalado em todos os hosts.",
   "A conexão VPN não está definida estaticamente."
  ],
  "cor": 1,
  "sub": "Hosts internos enviam pacotes normais, não encapsulados.",
  "why": "Na VPN site a site, os hosts internos enviam pacotes normais, sem encapsulamento. Quem faz o encapsulamento são os gateways VPN nas duas pontas do túnel, de forma transparente para os hosts."
 },
 {
  "id": 33,
  "mod": 4,
  "fonte": "ensa",
  "tp": "WAN",
  "ty": "multi",
  "text": "Quais dois tipos de VPNs são exemplos de VPNs de acesso remoto gerenciado pela empresa? (Escolha dois.)",
  "opts": [
   "VPN IPsec",
   "VPN GRE sobre IPsec",
   "VPN SSL sem cliente",
   "VPN de interface de túnel virtual IPsec",
   "VPN IPsec baseada em cliente"
  ],
  "cor": [
   2,
   4
  ],
  "sub": "Escolha 2 alternativas",
  "why": "As VPNs de acesso remoto gerenciadas pela empresa incluem a VPN SSL sem cliente e a VPN IPsec baseada em cliente. Ambas são provisionadas e administradas pela organização."
 },
 {
  "id": 34,
  "mod": 4,
  "fonte": "ensa",
  "tp": "QoS",
  "ty": "single",
  "text": "Que técnica de QoS retém os pacotes excedentes em uma fila separada para transmissão posterior?",
  "opts": [
   "enfileiramento",
   "classificação",
   "shaping (modelagem)",
   "marcação"
  ],
  "cor": 2,
  "sub": "shaping (modelagem)",
  "why": "O shaping (modelagem) retém os pacotes excedentes em uma fila separada para enviá-los depois, suavizando a taxa de saída. O policing simplesmente descarta o excesso."
 },
 {
  "id": 35,
  "mod": 4,
  "fonte": "ensa",
  "tp": "QoS",
  "ty": "single",
  "text": "Qual mecanismo de QoS permite que dados sensíveis a atrasos, como de voz, sejam enviados antes do envio de pacotes em outras filas?",
  "opts": [
   "FCFS",
   "FIFO",
   "CBWFQ",
   "LLQ"
  ],
  "cor": 3,
  "sub": "LLQ",
  "why": "A LLQ (Low Latency Queueing) cria uma fila prioritária para tráfego sensível a atraso, como voz, que é atendida antes das demais filas. É o mecanismo indicado para garantir baixa latência à voz."
 },
 {
  "id": 36,
  "mod": 4,
  "fonte": "ensa",
  "tp": "QoS",
  "ty": "single",
  "text": "Qual termo descreve a adição de um valor ao cabeçalho do pacote, o mais próximo possível da origem, para que o pacote corresponda a uma política definida?",
  "opts": [
   "policiamento",
   "weighted random early detection ou WRED (detecção inicial aleatória ponderada).",
   "marcação de tráfego",
   "queda de cauda",
   "organização de tráfego"
  ],
  "cor": 2,
  "sub": "marcação de tráfego",
  "why": "A marcação de tráfego adiciona um valor ao cabeçalho do pacote o mais próximo possível da origem, para que os dispositivos seguintes reconheçam a classe do tráfego sem precisar reclassificá-lo."
 },
 {
  "id": 37,
  "mod": 4,
  "fonte": "ensa",
  "tp": "Gerência",
  "ty": "single",
  "text": "Qual comando fará o backup da configuração armazenada na NVRAM em um servidor TFTP?",
  "opts": [
   "copy tftp startup-config",
   "copy running-config tftp",
   "copy startup-config tftp",
   "copy tftp running-config"
  ],
  "cor": 2,
  "sub": "copy startup-config tftp",
  "why": "O comando copy startup-config tftp copia a configuração salva na NVRAM para um servidor TFTP. É o procedimento padrão de backup da configuração.",
  "fig": "img/m3-q075.webp",
  "figAlt": "Figura da questão 37 do exame final ENSA",
  "code": "Router# show version\nCisco IOS Software, 1841 Software (C1841-ADVIPSERVICESK9-M), Version 12.4(15)T1,\n RELEASE SOFTWARE (fc2)\nTechnical Support: http://www.cisco.com/techsupport\nCopyright (c) 1986-2007 by Cisco Systems, Inc.\nCompiled Wed 18-Jul-07 04:52 by pt_team\n\nROM: System Bootstrap, Version 12.3(8r)T8, RELEASE SOFTWARE (fc1)\n\nSystem returned to ROM by power-on\nSystem image file is \"flash:c1841-advipservicesk9-mz.124-15.T1.bin\"\n\n<output omitted>\n\nCisco 1841 (revision 5.0) with 114688K/16384K bytes of memory.\nProcessor board ID FTX0947Z18E\nM860 processor: part number 0, mask 49\n2 FastEthernet/IEEE 802.3 interface(s)\n191K bytes of NVRAM.\n63488K bytes of ATA CompactFlash (Read/Write)\n\nConfiguration register is 0x2102\n\nRouter#"
 },
 {
  "id": 38,
  "mod": 4,
  "fonte": "ensa",
  "tp": "Gerência",
  "ty": "single",
  "text": "Por que um administrador de rede usaria o comando config-register 0x2102 em um dispositivo de rede Cisco?",
  "opts": [
   "para monitorar e gerenciar o desempenho da rede, localizar e resolver problemas de rede e planejar o crescimento da rede",
   "para garantir que o dispositivo carrega o arquivo de configuração de inicialização durante a inicialização",
   "para aprender nomes de dispositivos, versões IOS e o número e tipo de interfaces de dispositivos conectados",
   "para fazer backup da configuração em execução em uma unidade USB"
  ],
  "cor": 1,
  "sub": "para garantir que o dispositivo carrega o arquivo de configuração de inicialização durante a in",
  "why": "O valor 0x2102 no config-register faz o roteador carregar a configuração de inicialização (startup-config) da NVRAM ao ligar. Os 2 últimos bits 0x2 indicam exatamente isso."
 },
 {
  "id": 39,
  "mod": 4,
  "fonte": "ensa",
  "tp": "Gerência",
  "ty": "single",
  "text": "Que número representa o nível mais grave de registro de syslog?",
  "opts": [
   "7",
   "10",
   "1",
   "0",
   "100"
  ],
  "cor": 3,
  "sub": "0",
  "why": "O nível 0 do syslog é emergência (emergencies), o mais grave de todos. A escala vai de 0 (emergência) a 7 (debug)."
 },
 {
  "id": 40,
  "mod": 4,
  "fonte": "ensa",
  "tp": "Gerência",
  "ty": "single",
  "text": "Que tipo de mensagem SNMP informa o NMS (network management system, sistema de gerenciamento de rede) imediatamente sobre determinados eventos especificados?",
  "opts": [
   "solicitação SET",
   "resposta GET",
   "Trap",
   "solicitação GET"
  ],
  "cor": 2,
  "sub": "Trap",
  "why": "O Trap é a mensagem SNMP enviada espontaneamente pelo dispositivo ao NMS, sem que o NMS tenha pedido. É usado para alertar sobre eventos como falhas e mudanças de estado."
 },
 {
  "id": 41,
  "mod": 4,
  "fonte": "ensa",
  "tp": "Arquitetura",
  "ty": "single",
  "text": "O que é a densidade de portas de um switch?",
  "opts": [
   "o número de portas disponíveis em um switch",
   "a taxa de transferência de uma porta",
   "a largura de banda combinada de todas as portas em um switch",
   "a largura de banda de uma porta"
  ],
  "cor": 0,
  "sub": "o número de portas disponíveis em um switch",
  "why": "A densidade de portas de um switch é o número de portas disponíveis nele. Não tem relação com a velocidade por porta nem com o tamanho da tabela MAC."
 },
 {
  "id": 42,
  "mod": 4,
  "fonte": "ensa",
  "tp": "Arquitetura",
  "ty": "multi",
  "text": "Quais os dois métodos que ajudam a impedir interrupções de serviços de rede? (Escolha duas.)",
  "opts": [
   "usar conexões redundantes para fornecer caminhos físicos alternativos",
   "instalar equipamento duplicado para fornecer serviços de failover",
   "remover os switches que causam loop",
   "alterar os protocolos de roteamento em intervalos regulares",
   "usar VLANs para segmentar o tráfego de rede"
  ],
  "cor": [
   0,
   1
  ],
  "sub": "Escolha 2 alternativas",
  "why": "Conexões redundantes fornecem caminhos físicos alternativos e equipamentos duplicados garantem failover dos serviços. Juntas, essas duas medidas reduzem o tempo de indisponibilidade."
 },
 {
  "id": 43,
  "mod": 4,
  "fonte": "ensa",
  "tp": "Arquitetura",
  "ty": "single",
  "text": "Qual é a função dos ASICs em um switch de várias camadas?",
  "opts": [
   "Eles fornecem energia a dispositivos como telefones IP e pontos de acesso sem fio por portas Ethernet.",
   "Eles otimizam o encaminhamento de pacotes de IP em um switch de várias camadas ao ignorar a CPU.",
   "Eles evitam loops de Camada 2 ao desabilitar links redundantes entre os switches.",
   "Eles agregam várias portas de switch físicas em uma única porta lógica."
  ],
  "cor": 1,
  "sub": "Eles otimizam o encaminhamento de pacotes de IP em um switch de várias camadas ao ignorar a CPU",
  "why": "Os ASICs são circuitos dedicados que executam o encaminhamento de pacotes IP em hardware, muito mais rápido que o processamento por software. É o que dá desempenho aos switches multicamada."
 },
 {
  "id": 44,
  "mod": 4,
  "fonte": "ensa",
  "tp": "Arquitetura",
  "ty": "single",
  "text": "Indique uma característica da camada de distribuição do modelo hierárquico de três camadas.",
  "opts": [
   "representa a borda da rede",
   "fornece acesso ao restante da rede por meio dos processos de switching e roteamento, além das políticas de acesso à rede",
   "distribui acesso aos usuários finais",
   "atua como o backbone da rede, agregando e distribuindo o tráfego de rede por todo o campus"
  ],
  "cor": 1,
  "sub": "fornece acesso ao restante da rede por meio dos processos de switching e roteamento, além das p",
  "why": "A camada de distribuição fornece acesso ao restante da rede por meio dos processos de switching e faz a ligação entre a camada de acesso e a de núcleo. Ela também aplica políticas e agrega links."
 },
 {
  "id": 45,
  "mod": 4,
  "fonte": "ensa",
  "tp": "Arquitetura",
  "ty": "single",
  "text": "Qual tipo de ferramenta um administrador usaria para capturar os pacotes que entram e saem de um dispositivo específico?",
  "opts": [
   "base de dados de conhecimento, base de dados",
   "ferramenta de criação de linha de base",
   "ferramenta NMS",
   "analisador de protocolos"
  ],
  "cor": 3,
  "sub": "analisador de protocolos",
  "why": "O analisador de protocolos (sniffer) captura os pacotes que entram e saem de uma interface e permite analisar o conteúdo. É a ferramenta de diagnóstico de tráfego."
 },
 {
  "id": 46,
  "mod": 4,
  "fonte": "ensa",
  "tp": "Arquitetura",
  "ty": "single",
  "text": "Um usuário relata que a estação de trabalho não pode se conectar a uma impressora conectada à rede do escritório para imprimir um relatório criado com o software de processamento de texto. Que ação de identificação e solução de problemas do técnico de suporte seguiria a abordagem divide-and-conquer?",
  "opts": [
   "Pedir ao usuário para salvar o documento de trabalho.",
   "Pedir ao usuário para iniciar o navegador da Web.",
   "Pedir ao usuário para desconectar e conectar o cabo de rede.",
   "Pedir ao usuário para emitir o comando ipconfig."
  ],
  "cor": 3,
  "sub": "Pedir ao usuário para emitir o comando ipconfig.",
  "why": "O primeiro passo é verificar a configuração IP da estação com ipconfig — endereço, máscara e gateway. Sem esses dados não é possível saber se o problema é de endereçamento, de rede ou de impressora."
 },
 {
  "id": 47,
  "mod": 4,
  "fonte": "ensa",
  "tp": "ACLs",
  "ty": "single",
  "text": "Um técnico de rede usou o comando access-list 1 permit 172.16.0.0 0.0.255 para configurar o NAT em um roteador de borda para traduzir somente quatro redes, 172.16.0.0 /24, 172.16.1.0 /24, 172.16.2.0 /24 e 172.16.3.0 /24. Depois de receber reclamações sobre acesso limitado à Internet, emitir o comando show ip nat translations revela que algumas redes estão faltando na saída. Qual alteração resolverá o problema?",
  "opts": [
   "A lista de acesso deve ser substituída pela lista de acesso 1 permissão 172.16.0.0 0.0.0.255.",
   "A lista de acesso deve ser substituída pela lista de acesso 1 permissão 172.16.0.0 0.0.1.255.",
   "A lista de acesso deve ser substituída pela lista de acesso 1 permissão 172.16.0.0 255.255.0.",
   "A lista de acesso deve ser substituída pela lista de acesso 1 permissão 172.16.0.0 0.0.3.255."
  ],
  "cor": 3,
  "sub": "A lista de acesso deve ser substituída pela lista de acesso 1 permissão 172.16.0.0 0.0.3.255.",
  "why": "A máscara curinga 0.0.255 da access-list 1 não corresponde ao bloco de quatro redes que se quer traduzir. A lista deve ser substituída por outra com a máscara curinga correta para a faixa desejada."
 },
 {
  "id": 48,
  "mod": 4,
  "fonte": "ensa",
  "tp": "OSPF",
  "ty": "single",
  "text": "Consulte a figura. Por que os roteadores R1 e R2 não conseguem estabelecer uma adjacência OSPF?",
  "opts": [
   "As interfaces seriais não estão na mesma área.",
   "Os valores de ID do roteador não são os mesmos em ambos os roteadores.",
   "Os números de processo não são os mesmos em ambos os roteadores.",
   "Um roteador backbone não pode estabelecer uma adjacência com um roteador ABR."
  ],
  "cor": 0,
  "sub": "As interfaces seriais não estão na mesma área.",
  "why": "As interfaces seriais de R1 e R2 estão configuradas em áreas OSPF diferentes. OSPF só forma adjacência entre interfaces na mesma área — por isso a adjacência não estabelece.",
  "fig": "img/m3-q048.webp",
  "figAlt": "Topologia OSPF: R2 na Area 0 e R1 na Area 1, com os blocos de configuração OSPF de cada roteador"
 },
 {
  "id": 49,
  "mod": 4,
  "fonte": "ensa",
  "tp": "SDN/Cloud",
  "ty": "multi",
  "text": "Quais duas camadas do modelo OSI são associadas às funções de plano de controle de rede SDN que tomam decisões de encaminhamento? (Escolha duas.)",
  "opts": [
   "Camada 1",
   "Camada 2",
   "Camada 4",
   "Camada 5",
   "Camada 3"
  ],
  "cor": [
   1,
   4
  ],
  "sub": "Escolha 2 alternativas",
  "why": "As funções de plano de controle do SDN (como ARP e a tabela de roteamento) atuam nas camadas 2 e 3 do modelo OSI. O plano de dados é que encaminha os pacotes efetivamente."
 },
 {
  "id": 50,
  "mod": 4,
  "fonte": "ensa",
  "tp": "SDN/Cloud",
  "ty": "single",
  "text": "O que define uma topologia de folha espinhal de duas camadas?",
  "opts": [
   "A camada lombada pode ser implementada com switches Cisco Nexus 9500 conectados uns aos outros e aos switches de folha.",
   "Tudo é dois saltos de tudo o resto.",
   "Os dispositivos CISCO APICs e todos os outros dispositivos da rede se conectam fisicamente aos switches leaf.",
   "O controlador APIC manipula o caminho de dados diretamente."
  ],
  "cor": 2,
  "sub": "Os dispositivos CISCO APICs e todos os outros dispositivos da rede se conectam fisicamente aos",
  "why": "Na topologia spine-leaf de duas camadas, os APICs e todos os outros dispositivos da rede se conectam fisicamente aos leaf switches. Os spines conectam-se apenas aos leaves, formando a malha."
 },
 {
  "id": 51,
  "mod": 4,
  "fonte": "ensa",
  "tp": "SDN/Cloud",
  "ty": "single",
  "text": "Qual tipo de Hypervisor é implementado quando um usuário com um notebook executando o sistema operacional do Mac instala uma instância de sistema operacional do Windows virtual?",
  "opts": [
   "do banco de dados",
   "tipo 2",
   "bare metal",
   "tipo 1"
  ],
  "cor": 1,
  "sub": "tipo 2",
  "why": "O hypervisor Tipo 2 roda como um aplicativo sobre um sistema operacional hospedeiro — é o caso de VirtualBox ou VMware Workstation instalados no Windows do notebook. O Tipo 1 roda direto no hardware."
 },
 {
  "id": 52,
  "mod": 4,
  "fonte": "ensa",
  "tp": "SDN/Cloud",
  "ty": "single",
  "text": "Qual é a diferença entre as funções da computação em nuvem e da virtualização?",
  "opts": [
   "A computação em nuvem usa a tecnologia de data center, enquanto a virtualização não é usada em data centers.",
   "A computação em nuvem fornece serviços de acesso baseado na Web, enquanto a virtualização fornece serviços de acesso a dados por meio de conexões virtualizadas com a Internet.",
   "A computação em nuvem separa o aplicativo do hardware, enquanto a virtualização separa o SO do hardware subjacente.",
   "A computação em nuvem requer a tecnologia de hipervisor, enquanto a virtualização é uma tecnologia de tolerância a falhas."
  ],
  "cor": 2,
  "sub": "A computação em nuvem separa o aplicativo do hardware, enquanto a virtualização separa o SO do ",
  "why": "A computação em nuvem separa o aplicativo do hardware (o app roda em infraestrutura remota e elástica), enquanto a virtualização separa o sistema operacional do hardware subjacente. São conceitos diferentes que se complementam."
 },
 {
  "id": 53,
  "mod": 4,
  "fonte": "ensa",
  "tp": "Automação",
  "ty": "single",
  "text": "Consulte a figura. Qual formato de dados é usado para representar os dados para aplicativos de automação de rede?",
  "opts": [
   "JSON",
   "YAML",
   "XML",
   "HTML"
  ],
  "cor": 1,
  "sub": "YAML",
  "why": "O YAML é o formato de dados usado para representar a configuração de aplicativos de automação de rede, por ser legível por humanos e usar indentação em vez de chaves.",
  "fig": "img/m3-q076.webp",
  "figAlt": "Figura da questão 53 do exame final ENSA"
 },
 {
  "id": 54,
  "mod": 4,
  "fonte": "ensa",
  "tp": "Automação",
  "ty": "single",
  "text": "Um usuário está lendo um livro do site https://www.books-info.com/author1a/book2.html#page100. Qual parte do link da Web é chamada de fragmento?",
  "opts": [
   "/autor1a",
   "#page100",
   "/livro2.html",
   "https://"
  ],
  "cor": 1,
  "sub": "#page100",
  "why": "O fragmento (#page100) é a parte do link que aponta para uma âncora dentro da página. Ele não é enviado ao servidor: é interpretado pelo navegador para rolar até o ponto indicado."
 },
 {
  "id": 55,
  "mod": 4,
  "fonte": "ensa",
  "tp": "Automação",
  "ty": "single",
  "text": "Quando o formato de dados JSON está sendo usado, quais caracteres são usados para armazenar objetos?",
  "opts": [
   "dois-pontos duplos : :",
   "suportes duplos []",
   "aspas duplas \"\"",
   "chaves duplas {}"
  ],
  "cor": 3,
  "sub": "chaves duplas {}",
  "why": "No JSON, os objetos são delimitados por chaves duplas { }. Os colchetes [ ] delimitam arrays e as aspas duplas delimitam strings."
 },
 {
  "id": 56,
  "mod": 4,
  "fonte": "srwe",
  "tp": "Roteamento",
  "ty": "single",
  "text": "Consulte a figura. O host A (IP: 10.1.1.10, MAC: 00E0.FE10.17A3) enviou um pacote ao host B (IP: 192.168.1.20). O último roteador antes do host B possui a interface de saída com IP 192.168.1.1 e MAC 00E0.FE91.7799. Quais serão os endereços MAC e IP origem no pacote quando ele chegar ao host B?",
  "opts": [
   "MAC origem: 00E0.FE91.7799 / IP origem: 192.168.1.1",
   "MAC origem: 00E0.FE10.17A3 / IP origem: 10.1.1.10",
   "MAC origem: 00E0.FE91.7799 / IP origem: 10.1.1.10",
   "MAC origem: 00E0.FE10.17A3 / IP origem: 192.168.1.1",
   "MAC origem: 00E0.FE91.7799 / IP origem: 10.1.1.1"
  ],
  "cor": 2,
  "sub": "Encapsulamento de quadro a cada hop",
  "why": "O endereço IP origem nunca muda durante o roteamento (permanece 10.1.1.10 — host A). O MAC origem, porém, é substituído a cada hop: ao chegar ao host B o MAC origem é o da interface de saída do último roteador (00E0.FE91.7799).",
  "fig": "img/srwe-q001.webp",
  "figAlt": "Figura da questão 1 do exame final SRWE"
 },
 {
  "id": 57,
  "mod": 4,
  "fonte": "srwe",
  "tp": "Switching",
  "ty": "match",
  "text": "Faça a correspondência de cada etapa com sua descrição na sequência de inicialização do switch.",
  "pairs": [
   {
    "l": "Etapa 1",
    "r": "Executar o POST (Power-On Self-Test)"
   },
   {
    "l": "Etapa 2",
    "r": "Carregar o boot loader da ROM"
   },
   {
    "l": "Etapa 3",
    "r": "Inicializar os registradores da CPU"
   },
   {
    "l": "Etapa 4",
    "r": "Inicializar o sistema de arquivos em flash"
   },
   {
    "l": "Etapa 5",
    "r": "Transferir o controle do switch para o IOS"
   },
   {
    "l": "Etapa 6",
    "r": "Entrar no modo de configuração global"
   }
  ],
  "sub": "Sequência de boot do switch Cisco",
  "why": "Ordem padrão Cisco: (1) POST testa hardware; (2) boot loader é carregado da ROM; (3) boot loader inicializa registradores CPU; (4) boot loader inicializa flash; (5) IOS é carregado e recebe controle; (6) arquivo de configuração é carregado e entra em modo de configuração global."
 },
 {
  "id": 58,
  "mod": 4,
  "fonte": "srwe",
  "tp": "VLANs",
  "ty": "single",
  "text": "Um administrador está tentando remover as configurações de um switch. Após usar o comando erase startup-config e reiniciar o switch, o administrador descobre que as VLANs 10 e 100 ainda estão presentes. Por que essas VLANs não foram removidas?",
  "opts": [
   "Essas VLANs são VLANs padrão e não podem ser removidas.",
   "Essas VLANs não podem ser removidas a menos que o switch esteja no modo cliente VTP.",
   "Essas VLANs só podem ser removidas com os comandos no vlan 10 e no vlan 100.",
   "As VLANs são armazenadas em um arquivo chamado vlan.dat na memória flash, que precisa ser apagado manualmente."
  ],
  "cor": 3,
  "sub": "Arquivo vlan.dat na memória flash",
  "why": "O comando erase startup-config apaga apenas a startup-config na NVRAM. As VLANs criadas pelo usuário são gravadas em vlan.dat na flash. Para removê-las, é necessário executar 'delete flash:vlan.dat' e reiniciar o switch."
 },
 {
  "id": 59,
  "mod": 4,
  "fonte": "srwe",
  "tp": "Inter-VLAN",
  "ty": "single",
  "text": "Consulte a configuração. Um administrador está configurando roteamento entre VLANs (router-on-a-stick). Qual é o parâmetro que falta no ponto de interrogação do comando encapsulation dot1Q?",
  "opts": [
   "Identifica a subinterface.",
   "Identifica o número da VLAN.",
   "Identifica o número da VLAN nativa.",
   "Identifica o tipo de encapsulamento usado.",
   "Identifica o número de hosts permitidos na interface."
  ],
  "cor": 1,
  "sub": "Comando encapsulation dot1Q — parâmetro VLAN",
  "why": "O comando 'encapsulation dot1Q <vlan-id>' associa a subinterface a uma VLAN específica. O parâmetro obrigatório que falta é o número da VLAN (ex.: encapsulation dot1Q 7).",
  "fig": "img/srwe-q004.webp",
  "figAlt": "Figura da questão 4 do exame final SRWE"
 },
 {
  "id": 60,
  "mod": 4,
  "fonte": "srwe",
  "tp": "Inter-VLAN",
  "ty": "multi",
  "text": "Consulte a figura. Um switch de Camada 3 faz roteamento entre VLANs e conecta-se a um roteador para obter acesso à Internet pela interface GigabitEthernet1/1 (IP: 192.168.1.2/30). Quais as duas configurações que deveriam ser aplicadas ao switch? (Escolha duas.)",
  "opts": [
   "(config)# interface gigabitethernet 1/1\n(config-if)# no switchport\n(config-if)# ip address 192.168.1.2 255.255.255.252",
   "(config)# interface vlan 1\n(config-if)# ip address 192.168.1.2 255.255.255.0\n(config-if)# no shutdown",
   "(config)# interface gigabitethernet1/1\n(config-if)# switchport mode trunk",
   "(config)# interface fastethernet0/4\n(config-if)# switchport mode trunk",
   "(config)# ip routing"
  ],
  "cor": [
   0,
   4
  ],
  "sub": "Switch Camada 3: no switchport + ip routing",
  "why": "Para conectar o switch L3 a um roteador como ponto de uplink roteado: (1) a interface de uplink deve ser configurada com 'no switchport' para desabilitar o modo switch e atribuir endereço IP diretamente; (2) 'ip routing' habilita o roteamento IPv4 no switch de Camada 3.",
  "fig": "img/srwe-q005.webp",
  "figAlt": "Figura da questão 5 do exame final SRWE"
 },
 {
  "id": 61,
  "mod": 4,
  "fonte": "srwe",
  "tp": "Roteamento",
  "ty": "single",
  "text": "Consulte a topologia. O roteador HQ possui rotas estáticas para as redes 10.10.0.0/16 e 10.20.0.0/16 e foi configurado com o comando acima. Qual é a finalidade desse comando?",
  "opts": [
   "Pacotes com redes destino não presentes na tabela de roteamento do HQ serão descartados.",
   "Pacotes com destino diferente de 10.10.0.0/16, 10.20.0.0/16 ou redes diretamente conectadas serão enviados à Internet.",
   "Pacotes recebidos da Internet serão enviados a uma das LANs conectadas ao R1 ou R2.",
   "Pacotes da rede 10.10.0.0/16 serão encaminhados para 10.20.0.0/16 e vice-versa."
  ],
  "cor": 1,
  "sub": "Rota padrão — ip route 0.0.0.0 0.0.0.0",
  "why": "O comando cria uma rota padrão (gateway of last resort). Todo pacote cujo destino não corresponde a nenhuma rota mais específica da tabela é encaminhado pela interface serial 0/1/1 em direção à Internet.",
  "fig": "img/srwe-q006.webp",
  "figAlt": "Figura da questão 6 do exame final SRWE"
 },
 {
  "id": 62,
  "mod": 4,
  "fonte": "srwe",
  "tp": "Roteamento",
  "ty": "single",
  "text": "Consulte a topologia. Um engenheiro está configurando roteamento IPv6 no roteador HQ. Qual comando configura uma rota padrão IPv6 para enviar pacotes à Internet quando o destino não está na tabela de roteamento?",
  "opts": [
   "ipv6 route ::/0 serial 0/0/0",
   "ip route 0.0.0.0 0.0.0.0 0.0.0.0 serial 0/1/1",
   "ipv6 route ::1/0 serial 0/1/1",
   "ipv6 route ::/0 serial 0/1/1"
  ],
  "cor": 3,
  "sub": "Rota padrão IPv6 — ::/0",
  "why": "A rota padrão IPv6 é representada por '::/0' (equivalente a 0.0.0.0/0 no IPv4). A interface de saída deve ser a que conecta à Internet (serial 0/1/1). O comando correto é: ipv6 route ::/0 serial 0/1/1.",
  "fig": "img/srwe-q007.webp",
  "figAlt": "Figura da questão 7 do exame final SRWE"
 },
 {
  "id": 63,
  "mod": 4,
  "fonte": "srwe",
  "tp": "Roteamento",
  "ty": "single",
  "text": "Como um roteador tratará o roteamento estático se o Cisco Express Forwarding (CEF) estiver desabilitado?",
  "opts": [
   "Ele não executará pesquisas recursivas.",
   "Interfaces ponto-a-ponto seriais exigirão rotas estáticas totalmente especificadas para evitar inconsistências.",
   "Interfaces multiacesso Ethernet exigirão rotas estáticas totalmente especificadas para evitar inconsistências.",
   "Rotas estáticas que usam uma interface de saída serão desnecessárias."
  ],
  "cor": 2,
  "sub": "CEF desabilitado — rotas em interfaces Ethernet",
  "why": "Quando o CEF está desabilitado, o roteador usa process switching. Em interfaces multiacesso (Ethernet), é necessário especificar tanto a interface de saída quanto o próximo salto (rota totalmente especificada), pois sem CEF a resolução ARP pode falhar com apenas o next-hop."
 },
 {
  "id": 64,
  "mod": 4,
  "fonte": "srwe",
  "tp": "Switching",
  "ty": "single",
  "text": "Consulte a figura (SW1: Fa0/1-PCA, Fa0/2-PCB, Fa0/23 trunk para SW2; SW2: Fa0/24 trunk para SW1, Fa0/3-PCC, Fa0/4-PCD). Como um quadro é enviado do PCA ao PCC se a tabela de endereços MAC no switch SW1 está vazia?",
  "opts": [
   "O SW1 envia o quadro por todas as portas exceto a de entrada e a interconectada ao SW2.",
   "O SW1 envia o quadro por todas as portas do switch, exceto a porta de entrada (flooding).",
   "O SW1 encaminha diretamente ao SW2 que, por sua vez, encaminha apenas a PCC.",
   "O SW1 descarta o quadro porque não conhece o endereço MAC destino."
  ],
  "cor": 1,
  "sub": "Flooding de unicast desconhecido — tabela MAC vazia",
  "why": "Com a tabela MAC vazia, o SW1 não sabe em qual porta está o destino. O switch realiza flooding: envia o quadro por TODAS as portas exceto a porta de entrada (Fa0/1). Isso inclui a porta trunk para SW2, que por sua vez também fará flooding para PCC e PCD.",
  "fig": "img/srwe-q009.webp",
  "figAlt": "Figura da questão 9 do exame final SRWE"
 },
 {
  "id": 65,
  "mod": 4,
  "fonte": "srwe",
  "tp": "Switching",
  "ty": "multi",
  "text": "Quais são os dois motivos pelos quais um administrador de redes segmentaria uma rede com um switch de Camada 2? (Escolha duas.)",
  "opts": [
   "para criar menos domínios de colisão",
   "para melhorar a largura de banda disponível para os usuários",
   "para criar mais domínios de broadcast",
   "para eliminar circuitos virtuais",
   "para isolar o tráfego entre os segmentos",
   "para isolar mensagens ARP do restante da rede"
  ],
  "cor": [
   1,
   4
  ],
  "sub": "Benefícios da segmentação com switch L2",
  "why": "Um switch L2 cria um domínio de colisão por porta (mais domínios, não menos). Os benefícios reais da segmentação são: (1) melhorar a largura de banda — cada porta tem largura de banda dedicada; (2) isolar o tráfego entre segmentos — frames só cruzam para outras portas quando necessário."
 },
 {
  "id": 66,
  "mod": 4,
  "fonte": "srwe",
  "tp": "Inter-VLAN",
  "ty": "single",
  "text": "Um administrador configura o roteador R1 para roteamento entre VLAN 10 e VLAN 20. Os dispositivos das VLANs não conseguem se comunicar. Com base na configuração exibida, qual é a causa provável do problema?",
  "opts": [
   "O número da subinterface GigabitEthernet 0/0.1 está incorreto.",
   "A porta Gi0/0 do switch conectado ao roteador deve ser configurada como porta de tronco.",
   "O encapsulamento está configurado incorretamente em uma das subinterfaces.",
   "Um comando no shutdown deve ser adicionado em cada subinterface."
  ],
  "cor": 1,
  "sub": "Router-on-a-stick — porta do switch deve ser trunk",
  "why": "No roteamento inter-VLAN router-on-a-stick, a porta do switch conectada à interface física do roteador (Gi0/0) deve ser configurada como modo trunk. Se estiver em modo access, somente o tráfego de uma VLAN passará, impedindo a comunicação entre VLANs."
 },
 {
  "id": 67,
  "mod": 4,
  "fonte": "srwe",
  "tp": "DHCPv4",
  "ty": "single",
  "text": "Considerando que o gateway padrão (192.168.10.1) e o servidor DNS (192.168.11.5) estão corretos, qual é o problema nessa configuração DHCP?",
  "opts": [
   "O servidor DNS e o gateway padrão devem estar na mesma sub-rede.",
   "O endereço IP do gateway padrão não está na lista de endereços excluídos.",
   "Os comandos default-router e dns-server precisam ser configurados com máscaras de sub-rede.",
   "O endereço IP do servidor DNS não está na lista de endereços excluídos."
  ],
  "cor": 1,
  "sub": "Exclusão do gateway padrão no pool DHCP",
  "why": "O gateway padrão 192.168.10.1 pertence à sub-rede 192.168.10.0/24 do pool, mas não foi adicionado à lista de exclusão (ip dhcp excluded-address). Isso pode causar conflito de endereço se o DHCP atribuir esse IP a um cliente."
 },
 {
  "id": 68,
  "mod": 4,
  "fonte": "srwe",
  "tp": "STP",
  "ty": "multi",
  "text": "Quais os dois protocolos spanning tree que podem causar uso insuficiente de tráfego porque assumem somente uma instância de spanning tree para toda a rede bridged? (Escolha duas.)",
  "opts": [
   "STP",
   "Rapid PVST+",
   "PVST+",
   "MSTP",
   "RSTP"
  ],
  "cor": [
   0,
   4
  ],
  "sub": "STP e RSTP — única instância para toda a rede",
  "why": "STP (802.1D) e RSTP (802.1w) usam uma única instância de spanning tree para todas as VLANs, independentemente de quantas existam. Isso pode bloquear links que poderiam ser usados por VLANs diferentes, resultando em uso ineficiente. PVST+ e Rapid PVST+ criam uma instância por VLAN."
 },
 {
  "id": 69,
  "mod": 4,
  "fonte": "srwe",
  "tp": "FHRP",
  "ty": "single",
  "text": "Consulte a figura (roteador virtual HSRP com roteador de encaminhamento ativo e roteador em standby). Qual endereço MAC destino é usado quando os quadros são enviados da estação de trabalho ao gateway padrão?",
  "opts": [
   "O endereço MAC do roteador de encaminhamento (ativo)",
   "Os endereços MAC dos roteadores de encaminhamento e em standby",
   "O endereço MAC do roteador em standby",
   "O endereço MAC do roteador virtual"
  ],
  "cor": 3,
  "sub": "HSRP — endereço MAC virtual do grupo",
  "why": "No HSRP, a estação de trabalho usa o IP virtual como gateway padrão. Ao enviar um quadro, ela usa o MAC virtual do grupo HSRP (00-00-0C-07-AC-xx) como destino, não o MAC físico do roteador ativo ou standby. O roteador ativo responde por esse MAC virtual.",
  "fig": "img/srwe-q014.webp",
  "figAlt": "Figura da questão 14 do exame final SRWE"
 },
 {
  "id": 70,
  "mod": 4,
  "fonte": "srwe",
  "tp": "STP",
  "ty": "multi",
  "text": "Para obter uma visão geral do spanning tree de uma rede comutada, um engenheiro emite o comando show spanning-tree. Quais dois itens são exibidos por esse comando? (Escolha duas.)",
  "opts": [
   "O BID (Bridge ID) da bridge raiz",
   "A função das portas em todas as VLANs",
   "O status das portas de VLANs nativas",
   "O número de broadcasts recebidos em cada porta raiz",
   "O endereço IP da interface VLAN de gerenciamento"
  ],
  "cor": [
   0,
   1
  ],
  "sub": "Saída do show spanning-tree",
  "why": "O comando 'show spanning-tree' exibe: o BID da root bridge (incluindo prioridade e MAC); a função e estado de cada porta por VLAN (root, designated, alternate, blocking, forwarding, etc.). Não exibe estatísticas de broadcast nem endereços IP de gerenciamento."
 },
 {
  "id": 71,
  "mod": 4,
  "fonte": "srwe",
  "tp": "WLAN",
  "ty": "single",
  "text": "Que método de autenticação sem fio depende de um servidor de autenticação RADIUS?",
  "opts": [
   "WEP",
   "WPA Personal",
   "WPA2 Personal",
   "WPA2 Enterprise"
  ],
  "cor": 3,
  "sub": "WPA2 Enterprise — autenticação via RADIUS",
  "why": "WPA2 Enterprise usa o protocolo 802.1X com EAP, que requer um servidor RADIUS para autenticar usuários individualmente com credenciais (usuário/senha ou certificados). WPA/WPA2 Personal utilizam apenas uma chave pré-compartilhada (PSK), sem necessidade de servidor RADIUS."
 },
 {
  "id": 72,
  "mod": 4,
  "fonte": "srwe",
  "tp": "WLAN",
  "ty": "single",
  "text": "Qual é o método de criptografia sem fio mais seguro disponível atualmente?",
  "opts": [
   "WPA",
   "WEP",
   "WPA2 com TKIP",
   "WPA2 com AES"
  ],
  "cor": 3,
  "sub": "WPA2-AES — criptografia mais forte",
  "why": "WPA2 com AES (Advanced Encryption Standard, 128-bit) é o método mais seguro. WEP é facilmente quebrado. WPA com TKIP é obsoleto. WPA2 com TKIP é mais forte que WEP/WPA, mas ainda inferior ao AES. WPA2-AES é o padrão atual recomendado (base do WPA3)."
 },
 {
  "id": 73,
  "mod": 4,
  "fonte": "srwe",
  "tp": "WLAN",
  "ty": "single",
  "text": "Um engenheiro decide configurar um SSID na banda de 5 GHz para melhorar o desempenho de serviços de streaming de vídeo. Por que essa solução pode melhorar o desempenho da rede sem fio para esse tipo de serviço?",
  "opts": [
   "A banda de 5 GHz tem maior alcance e provavelmente é livre de interferência.",
   "Exigir que usuários mudem para 5 GHz é inconveniente e reduzirá o número de usuários.",
   "A banda de 5 GHz tem mais canais disponíveis e é menos congestionada que a de 2,4 GHz, sendo mais adequada para multimídia.",
   "Apenas usuários com placas de rede mais recentes podem usar 5 GHz, reduzindo o uso geral."
  ],
  "cor": 2,
  "sub": "Banda de 5 GHz — menos congestionamento para multimídia",
  "why": "A banda de 5 GHz oferece mais canais não sobrepostos (23 canais de 20 MHz vs. 3 na de 2,4 GHz) e sofre menos interferência de dispositivos domésticos (micro-ondas, Bluetooth). Isso resulta em maior throughput e menor latência para streaming de vídeo. A desvantagem é o menor alcance comparado a 2,4 GHz."
 },
 {
  "id": 74,
  "mod": 4,
  "fonte": "srwe",
  "tp": "EtherChannel",
  "ty": "multi",
  "text": "Considere a saída do comando show etherchannel summary acima. Quais as duas conclusões que podem ser obtidas? (Escolha duas.)",
  "opts": [
   "O EtherChannel está inoperante.",
   "O ID do port-channel é 2.",
   "O port-channel é de Camada 3.",
   "O pacote está totalmente operacional.",
   "O método de balanceamento de carga é da porta origem para destino."
  ],
  "cor": [
   0,
   1
  ],
  "sub": "Flags SD e D no show etherchannel summary",
  "why": "O flag 'S' indica Layer 2 e 'D' indica Down. 'Po2(SD)' significa que o port-channel 2 está inativo (Down). As portas Fa0/1(D) e Fa0/2(D) também estão inativas. O ID do port-channel é 2 (Po2). O EtherChannel está inoperante — não há protocolo (−) negociando."
 },
 {
  "id": 75,
  "mod": 4,
  "fonte": "srwe",
  "tp": "STP",
  "ty": "single",
  "text": "Consulte a figura. Quais são as funções das portas A, B, C e D nessa rede habilitada por RSTP?",
  "opts": [
   "A=alternativa, B=raiz, C=designada, D=raiz",
   "A=designada, B=raiz, C=alternativa, D=raiz",
   "A=alternativa, B=designada, C=raiz, D=raiz",
   "A=designada, B=alternativa, C=raiz, D=raiz"
  ],
  "cor": 0,
  "sub": "RSTP — funções de portas: raiz, designada, alternativa",
  "why": "B (S2→S1): porta raiz de S2 — melhor caminho ao root. D (S3→S1): porta raiz de S3. C (S2→hosts): porta designada — único switch no segmento de acesso. A (S2↔S3): como S2 tem melhor caminho ao root que S3 nesse segmento, S2 vence e sua porta seria designada — mas como S3 também conecta diretamente ao root (via D), S2's porta A pode ser alternativa. A ordem correta é: A=alternativa, B=raiz, C=designada, D=raiz.",
  "fig": "img/srwe-q020.webp",
  "figAlt": "Figura da questão 20 do exame final SRWE"
 },
 {
  "id": 76,
  "mod": 4,
  "fonte": "srwe",
  "tp": "STP",
  "ty": "single",
  "text": "Consulte a figura acima. Qual link de tronco não encaminhará tráfego após a eleição da bridge raiz?",
  "opts": [
   "Tronco1",
   "Tronco2",
   "Tronco3",
   "Tronco4"
  ],
  "cor": 1,
  "sub": "STP — eleição da root bridge e porta alternativa",
  "why": "S4 tem o menor MAC (000A.0003.1212) com mesma prioridade, portanto é a root bridge. S2 usa Tronco3 (→S4) como root port. S3 usa Tronco4 (→S4) como root port. S1 precisa de um root port: entre Tronco1 (→S2→S4) e Tronco2 (→S3→S4), S2 tem MAC menor que S3, então S1 prefere Tronco1. Tronco2 (S1-S3) fica como porta alternativa/bloqueada.",
  "fig": "img/srwe-q021.webp",
  "figAlt": "Figura da questão 21 do exame final SRWE"
 },
 {
  "id": 77,
  "mod": 4,
  "fonte": "srwe",
  "tp": "WLAN",
  "ty": "multi",
  "text": "Quais são as duas configurações padrão de um roteador sem fio que podem comprometer a segurança da rede? (Escolha duas.)",
  "opts": [
   "O SSID é transmitido (broadcast).",
   "A filtragem de endereços MAC está habilitada.",
   "A criptografia WEP está ativada.",
   "O canal sem fio é selecionado automaticamente.",
   "Uma senha de administrador conhecida/padrão está definida."
  ],
  "cor": [
   0,
   4
  ],
  "sub": "Configurações padrão inseguras em roteadores sem fio",
  "why": "SSID em broadcast expõe o nome da rede a qualquer dispositivo próximo. A senha de administrador padrão (ex.: 'admin', 'password') é amplamente conhecida e permite acesso ao painel de configuração. Ambas devem ser alteradas na configuração inicial de segurança.",
  "fig": "img/srwe-q022.webp",
  "figAlt": "Figura da questão 22 do exame final SRWE"
 },
 {
  "id": 78,
  "mod": 4,
  "fonte": "srwe",
  "tp": "Segurança L2",
  "ty": "single",
  "text": "Durante o processo AAA, quando a autorização será implementada?",
  "opts": [
   "Imediatamente após a autenticação bem-sucedida em uma fonte de dados AAA",
   "Imediatamente após a contabilidade e auditoria da AAA receberem relatórios detalhados",
   "Imediatamente após um cliente AAA enviar informações de autenticação ao servidor centralizado",
   "Imediatamente após a determinação de quais recursos um usuário pode acessar"
  ],
  "cor": 0,
  "sub": "AAA — ordem: autenticação → autorização → contabilidade",
  "why": "No modelo AAA: (A) Autenticação verifica a identidade; (A) Autorização determina o que o usuário autenticado pode fazer — ocorre imediatamente após autenticação bem-sucedida; (A) Contabilidade registra o que foi feito. A autorização só acontece após a identidade ser confirmada."
 },
 {
  "id": 79,
  "mod": 4,
  "fonte": "srwe",
  "tp": "DHCPv4",
  "ty": "single",
  "text": "Que ação um cliente DHCPv4 toma se receber mais de um DHCPOFFER de vários servidores DHCP?",
  "opts": [
   "Descarta ambas as ofertas e envia um novo DHCPDISCOVER.",
   "Envia um DHCPREQUEST identificando qual oferta de locação está aceitando.",
   "Envia um DHCPNAK e inicia o processo DHCP novamente.",
   "Aceita ambas as mensagens DHCPOFFER e envia um DHCPACK."
  ],
  "cor": 1,
  "sub": "DORA — cliente aceita a primeira oferta com DHCPREQUEST",
  "why": "O cliente aceita normalmente a primeira oferta recebida e responde com um DHCPREQUEST broadcast, que inclui o Server Identifier do servidor escolhido. Os demais servidores veem esse broadcast e retornam suas ofertas ao pool. O servidor escolhido responde com DHCPACK para concluir a negociação."
 },
 {
  "id": 80,
  "mod": 4,
  "fonte": "srwe",
  "tp": "DHCPv4",
  "ty": "single",
  "text": "Consulte a figura (SW1: Fa0/1-Servidor DHCP, Fa0/2-PC1, Fa0/3-PC2, Fa0/4-PC3). O PC3 acabou de ser ligado e envia uma solicitação DHCP IPv4 de broadcast pela porta Fa0/4. A quais portas o SW1 encaminhará essa solicitação?",
  "opts": [
   "Apenas a Fa0/1",
   "Apenas a Fa0/1 e Fa0/2",
   "Apenas a Fa0/1, Fa0/2 e Fa0/3",
   "A Fa0/1, Fa0/2, Fa0/3 e Fa0/4",
   "Apenas a Fa0/1, Fa0/2 e Fa0/4"
  ],
  "cor": 2,
  "sub": "Flooding de broadcast pelo switch",
  "why": "Um frame de broadcast é sempre encaminhado a todas as portas do switch, exceto a porta de entrada. O PC3 enviou o broadcast pela Fa0/4, portanto o switch encaminha para Fa0/1 (servidor DHCP), Fa0/2 (PC1) e Fa0/3 (PC2) — todas as outras portas exceto a de entrada.",
  "fig": "img/srwe-q025.webp",
  "figAlt": "Figura da questão 25 do exame final SRWE"
 },
 {
  "id": 81,
  "mod": 4,
  "fonte": "srwe",
  "tp": "Segurança L2",
  "ty": "single",
  "text": "Um administrador encontrou um usuário enviando um quadro 802.1Q com duas tags (double tagging) para um switch. Qual é a melhor solução para prevenir esse tipo de ataque (VLAN hopping)?",
  "opts": [
   "As VLANs das portas de acesso de usuário devem ser diferentes das VLANs nativas usadas nas portas de tronco.",
   "As portas de tronco devem usar a VLAN padrão (VLAN 1) como VLAN nativa.",
   "As portas de tronco devem ser configuradas com port security.",
   "A VLAN nativa usada em qualquer tronco deve ser uma das VLANs de dados ativas."
  ],
  "cor": 0,
  "sub": "VLAN hopping por double tagging — mitigação",
  "why": "O ataque de double tagging explora o fato de que a tag da VLAN nativa é removida pelo switch. Se um atacante na VLAN 10 enviar um frame com duas tags (VLAN 10 externa, VLAN 20 interna), o switch remove a tag 10 (nativa) e encaminha na VLAN 20. A mitigação é garantir que as portas de acesso de usuário estejam em VLANs diferentes da VLAN nativa dos troncos."
 },
 {
  "id": 82,
  "mod": 4,
  "fonte": "srwe",
  "tp": "Switching",
  "ty": "match",
  "text": "Faça a correspondência de cada característica com o método de encaminhamento de switch correto.",
  "pairs": [
   {
    "l": "Adequado para aplicações de computação de alto desempenho",
    "r": "Cut-through"
   },
   {
    "l": "O processo de encaminhamento inicia após receber o endereço MAC destino",
    "r": "Cut-through"
   },
   {
    "l": "Pode enviar quadros com erros (inválidos)",
    "r": "Cut-through"
   },
   {
    "l": "Verifica erros no frame antes de encaminhar (CRC)",
    "r": "Store-and-forward"
   },
   {
    "l": "O encaminhamento só inicia após receber o quadro inteiro",
    "r": "Store-and-forward"
   },
   {
    "l": "Encaminha apenas frames válidos (sem erros)",
    "r": "Store-and-forward"
   }
  ],
  "sub": "Cut-through vs Store-and-forward",
  "why": "Cut-through inicia o encaminhamento assim que lê o MAC destino — menor latência, maior desempenho, mas pode propagar frames com erros. Store-and-forward aguarda o frame completo para verificar o FCS (CRC) — maior latência, mas garante que apenas frames válidos são encaminhados."
 },
 {
  "id": 83,
  "mod": 4,
  "fonte": "srwe",
  "tp": "Roteamento",
  "ty": "single",
  "text": "Qual comando criará uma rota estática no R2 para acessar a rede 172.16.2.0/24?",
  "opts": [
   "R2(config)# ip route 172.16.2.1 255.255.255.0 172.16.3.1",
   "R2(config)# ip route 172.16.2.0 255.255.255.0 172.16.2.254",
   "R2(config)# ip route 172.16.2.0 255.255.255.0 172.16.3.1",
   "R2(config)# ip route 172.16.3.0 255.255.255.0 172.16.2.254"
  ],
  "cor": 2,
  "sub": "Rota estática — rede destino + próximo salto",
  "why": "O R2 precisa chegar à rede 172.16.2.0/24 via R1. O próximo salto é 172.16.3.1 (interface de R1 no link entre os roteadores). O comando correto é: ip route 172.16.2.0 255.255.255.0 172.16.3.1. O destino deve ser o endereço de rede (não host) e o next-hop deve ser alcançável diretamente.",
  "fig": "img/srwe-q028.webp",
  "figAlt": "Figura da questão 28 do exame final SRWE"
 },
 {
  "id": 84,
  "mod": 4,
  "fonte": "srwe",
  "tp": "Switching",
  "ty": "single",
  "text": "Qual instrução está correta sobre como um switch de Camada 2 determina como encaminhar quadros?",
  "opts": [
   "Quadros unicast são sempre encaminhados, independentemente do endereço MAC destino.",
   "Apenas quadros com endereço de broadcast são encaminhados por todas as portas ativas.",
   "O encaminhamento cut-through garante que quadros inválidos sejam descartados.",
   "Decisões de encaminhamento são baseadas em endereços MAC e mapeamentos de porta na tabela CAM."
  ],
  "cor": 3,
  "sub": "Tabela CAM — base das decisões de encaminhamento",
  "why": "O switch usa a tabela CAM (Content Addressable Memory), também chamada de tabela MAC, que mapeia endereços MAC às portas. Quando um frame chega, o switch consulta a tabela para determinar a porta de saída. Se o MAC destino não estiver na tabela, o switch realiza flooding."
 },
 {
  "id": 85,
  "mod": 4,
  "fonte": "srwe",
  "tp": "Roteamento",
  "ty": "single",
  "text": "Consulte a topologia (R1: S0/0/0=209.165.200.225, S0/0/1=209.165.200.226; Branch1 via S0/0/0; Branch2 via S0/0/1 com EIGRP; rede 10.10.0.0/16 em Branch1). O roteador R1 usa uma rota EIGRP para acessar a rede 10.10.0.0/16 via Branch2. Qual rota estática flutuante cria uma rota de backup caso o link para Branch2 fique inativo?",
  "opts": [
   "ip route 10.10.0.0 255.255.255.0 Serial 0/0/0 100",
   "ip route 10.10.0.0 255.255.0.0 209.165.200.226 100",
   "ip route 10.10.0.0 255.255.0.0 209.165.200.225 100",
   "ip route 10.10.0.0 255.255.0.0 209.165.200.225 50"
  ],
  "cor": 2,
  "sub": "Rota estática flutuante — AD maior que EIGRP (90)",
  "why": "EIGRP tem distância administrativa 90. Para criar uma rota flutuante de backup, precisa-se de AD > 90 (ex.: 100). O backup usa o link alternativo S0/0/0 (next-hop 209.165.200.225 via Branch1). A máscara correta para /16 é 255.255.0.0. Opção incorreta usar AD=50 pois seria preferida em vez do EIGRP.",
  "fig": "img/srwe-q030.webp",
  "figAlt": "Figura da questão 30 do exame final SRWE"
 },
 {
  "id": 86,
  "mod": 4,
  "fonte": "srwe",
  "tp": "Segurança L2",
  "ty": "single",
  "text": "Uma política de segurança exige que endereços MAC sejam aprendidos dinamicamente e adicionados tanto à tabela de endereços MAC quanto à configuração de execução (running-config) do switch. Qual configuração de port security implementa isso?",
  "opts": [
   "auto secure MAC addresses",
   "dynamic secure MAC addresses",
   "static secure MAC addresses",
   "sticky secure MAC addresses"
  ],
  "cor": 3,
  "sub": "Sticky MAC — aprendizado dinâmico salvo na config",
  "why": "O recurso 'sticky' (switchport port-security mac-address sticky) permite que o switch aprenda automaticamente os MACs conectados e os salve na running-config como endereços seguros estáticos. Isso combina a facilidade do aprendizado dinâmico com a persistência da configuração estática."
 },
 {
  "id": 87,
  "mod": 4,
  "fonte": "srwe",
  "tp": "Roteamento",
  "ty": "single",
  "text": "Consulte a tabela de roteamento exibida. Qual entrada representa uma rota estática para uma rede específica configurada com endereço de próximo salto?",
  "opts": [
   "S 10.17.2.0/24 [1/0] via 10.16.2.2",
   "S 0.0.0.0/0 [1/0] via 10.16.2.2",
   "C 10.16.2.0/24 is directly connected, Serial0/0/0",
   "S 10.17.2.0/24 is directly connected, Serial 0/0/0"
  ],
  "cor": 0,
  "sub": "Leitura da tabela de roteamento — rota estática com next-hop",
  "why": "A entrada 'S 10.17.2.0/24 [1/0] via 10.16.2.2' indica: S=rota estática, rede específica 10.17.2.0/24, AD=1, métrica=0, próximo salto=10.16.2.2. Isso é uma rota estática para rede específica com next-hop. A rota 0.0.0.0/0 é a rota padrão, não específica."
 },
 {
  "id": 88,
  "mod": 4,
  "fonte": "srwe",
  "tp": "Roteamento",
  "ty": "single",
  "text": "Qual prefixo IPv6 foi projetado para comunicação link-local?",
  "opts": [
   "fe80::/10",
   "fc::/07",
   "2001::/3",
   "ff00::/8"
  ],
  "cor": 0,
  "sub": "Endereços link-local IPv6 — fe80::/10",
  "why": "Endereços com prefixo fe80::/10 são link-local — válidos apenas no segmento de rede local e não roteáveis. São usados para comunicação entre vizinhos (NDP, routing protocols). São configurados automaticamente em toda interface IPv6 habilitada. ff00::/8 é multicast; 2001::/3 é unicast global; fc::/7 é unicast local único (ULA)."
 },
 {
  "id": 89,
  "mod": 4,
  "fonte": "srwe",
  "tp": "Roteamento",
  "ty": "single",
  "text": "Depois que um host gera um endereço IPv6 por DHCPv6 ou SLAAC, como ele verifica se o endereço é único e utilizável?",
  "opts": [
   "O host envia uma mensagem de echo request ICMPv6 ao endereço aprendido e, se não houver resposta, considera-o único.",
   "O host envia uma mensagem Neighbor Solicitation ICMPv6 ao endereço aprendido e, se não receber Neighbor Advertisement, considera-o único.",
   "O host verifica no cache de vizinhos local e, se o endereço não estiver armazenado, considera-o único.",
   "O host envia um broadcast ARP no link local e, se não houver resposta, considera o endereço único."
  ],
  "cor": 1,
  "sub": "DAD — Duplicate Address Detection (ICMPv6 NS/NA)",
  "why": "O processo DAD (Duplicate Address Detection) usa mensagens ICMPv6 Neighbor Solicitation (NS) enviadas ao endereço multicast solicited-node do novo endereço. Se nenhuma mensagem Neighbor Advertisement (NA) for recebida, o endereço é considerado único e é atribuído à interface. ARP é IPv4; IPv6 usa NDP."
 },
 {
  "id": 90,
  "mod": 4,
  "fonte": "srwe",
  "tp": "Segurança L2",
  "ty": "single",
  "text": "Qual ataque de rede busca criar um DoS para clientes, impedindo-os de obter um endereço DHCP?",
  "opts": [
   "Privação de DHCP (DHCP starvation)",
   "DHCP Spoofing",
   "Spoofing de endereço IP",
   "Ataque de tabela CAM"
  ],
  "cor": 0,
  "sub": "DHCP Starvation — esgotamento do pool DHCP",
  "why": "O ataque de DHCP starvation usa ferramentas como Gobbler para enviar centenas de DHCPDISCOVER com MACs falsificados aleatórios, esgotando o pool de endereços do servidor. Clientes legítimos não conseguem obter IP (DoS). DHCP Spoofing implanta um servidor DHCP falso para redirecionar tráfego."
 },
 {
  "id": 91,
  "mod": 4,
  "fonte": "srwe",
  "tp": "Segurança L2",
  "ty": "single",
  "text": "Qual é uma opção de configuração segura para acesso remoto a um dispositivo de rede?",
  "opts": [
   "Configurar SSH",
   "Configurar Telnet",
   "Configurar 802.1x",
   "Configurar uma ACL e aplicá-la às linhas VTY"
  ],
  "cor": 0,
  "sub": "SSH — acesso remoto seguro e criptografado",
  "why": "SSH (Secure Shell) criptografa todo o tráfego da sessão, incluindo credenciais. Telnet transmite tudo em texto claro, sendo vulnerável a sniffing. 802.1x é usado para autenticação de acesso à porta (não gerenciamento remoto). ACL nas VTY restringe quem pode acessar, mas não criptografa a sessão — deve ser combinada com SSH."
 },
 {
  "id": 92,
  "mod": 4,
  "fonte": "srwe",
  "tp": "WLAN",
  "ty": "single",
  "text": "Um técnico conecta quatro PCs a um switch, configura o SSID e as propriedades de autenticação de uma WLAN, testa a conectividade e configura um firewall antes de conectar à Internet. Que tipo de dispositivo de rede inclui todas essas funcionalidades?",
  "opts": [
   "Switch",
   "Roteador sem fio",
   "Dispositivo de firewall dedicado",
   "Ponto de acesso sem fio autônomo"
  ],
  "cor": 1,
  "sub": "Roteador sem fio — switch + AP + roteador + firewall",
  "why": "Um roteador sem fio residencial/SOHO combina: switch Ethernet (portas LAN), ponto de acesso Wi-Fi (SSID/autenticação), roteador (conectividade WAN/Internet) e firewall básico (NAT, filtragem de pacotes). É o dispositivo all-in-one descrito na questão."
 },
 {
  "id": 93,
  "mod": 4,
  "fonte": "srwe",
  "tp": "Roteamento",
  "ty": "single",
  "text": "Consulte a topologia (R1 com S0/0/0=192.168.0.33 e S0/0/1=192.168.0.37; ISP com S0/0/0=192.168.0.34 e S0/0/1=192.168.0.38; OSPF ativo no link 192.168.0.32/30; backup via S0/0/1). O comando ip route 0.0.0.0 0.0.0.0 S0/0/1 100 foi configurado no R1, mas o tráfego está usando o backup mesmo com OSPF ativo. O que deve ser alterado?",
  "opts": [
   "Adicionar o endereço de próximo salto 192.168.0.38.",
   "Alterar a distância administrativa para 1.",
   "Alterar a rede destino para 192.168.0.34.",
   "Alterar a distância administrativa para 120."
  ],
  "cor": 3,
  "sub": "Rota estática flutuante — AD deve ser maior que OSPF (110)",
  "why": "OSPF tem distância administrativa 110. Para que a rota estática seja flutuante (backup), sua AD deve ser maior que 110. Com AD=100, a rota estática é preferida em relação ao OSPF (100 < 110). Alterar para AD=120 garante que o OSPF seja preferido enquanto ativo, e o backup só é ativado quando o OSPF falha.",
  "fig": "img/srwe-q038.webp",
  "figAlt": "Figura da questão 38 do exame final SRWE"
 },
 {
  "id": 94,
  "mod": 4,
  "fonte": "srwe",
  "tp": "Roteamento",
  "ty": "single",
  "text": "Qual é o tipo de rota estática configurada com uma distância administrativa maior para fornecer uma rota de backup quando o protocolo de roteamento dinâmico falha?",
  "opts": [
   "Rota estática padrão",
   "Rota estática flutuante",
   "Rota estática de host",
   "Rota estática de sumarização"
  ],
  "cor": 1,
  "sub": "Rota estática flutuante — definição",
  "why": "Uma rota estática flutuante tem distância administrativa maior que a do protocolo de roteamento dinâmico. Enquanto o protocolo dinâmico estiver funcionando, a rota estática não aparece na tabela (fica 'flutuando'). Quando a rota dinâmica desaparece, a rota estática entra em ação como backup."
 },
 {
  "id": 95,
  "mod": 4,
  "fonte": "srwe",
  "tp": "DHCPv4",
  "ty": "multi",
  "text": "Consulte a topologia (R1: G0/0=10.1.0.254/16 nova sub-rede, G0/1=10.0.0.1/30; R2: G0/1=10.0.0.2/30, G0/0=10.2.0.254/16; servidor DHCP=10.2.0.250). Uma nova sub-rede foi adicionada à rede de R1. Quais dois comandos permitirão que os hosts da nova sub-rede recebam endereços do servidor DHCP em 10.2.0.250? (Escolha dois.)",
  "opts": [
   "R1(config)# interface G0/0",
   "R1(config-if)# ip helper-address 10.2.0.250",
   "R2(config)# interface G0/0",
   "R2(config-if)# ip helper-address 10.2.0.250",
   "R1(config-if)# ip helper-address 10.1.0.254",
   "R1(config)# interface G0/1"
  ],
  "cor": [
   0,
   1
  ],
  "sub": "DHCP Relay — ip helper-address na interface do cliente",
  "why": "O ip helper-address deve ser configurado na interface do roteador que conecta à sub-rede dos clientes (R1 G0/0 = 10.1.0.254/16). Primeiro entra-se na interface (R1 G0/0) e depois aplica-se o helper com o IP do servidor DHCP (10.2.0.250). Isso faz o roteador encaminhar broadcasts DHCP como unicast ao servidor.",
  "fig": "img/srwe-q040.webp",
  "figAlt": "Figura da questão 40 do exame final SRWE"
 },
 {
  "id": 96,
  "mod": 4,
  "fonte": "srwe",
  "tp": "Roteamento",
  "ty": "single",
  "text": "Consulte a tabela de roteamento com a entrada RIP acima. Qual rota estática flutuante um técnico precisa inserir para criar backup para a rede 172.16.1.0, que só deve ser usada se o RIP primário falhar?",
  "opts": [
   "ip route 172.16.1.0 255.255.255.0 s0/0/0 91",
   "ip route 172.16.1.0 255.255.255.0 s0/0/0",
   "ip route 172.16.1.0 255.255.255.0 s0/0/0 111",
   "ip route 172.16.1.0 255.255.255.0 s0/0/0 121"
  ],
  "cor": 3,
  "sub": "Rota flutuante com AD > RIP (120)",
  "why": "RIP tem distância administrativa 120. Para uma rota flutuante de backup, a AD deve ser > 120. AD=121 garante que a rota estática só entre em ação quando a rota RIP desaparecer. AD=111 seria incorreto pois 111 < 120, tornando a estática preferida ao RIP. AD=91 seria preferida ao EIGRP mas incorreta para backup de RIP."
 },
 {
  "id": 97,
  "mod": 4,
  "fonte": "srwe",
  "tp": "Roteamento",
  "ty": "single",
  "text": "Consulte a tabela de roteamento IPv6 do R1 acima. O que o roteador fará com um pacote destinado a 2001:db8:cafe:5::1?",
  "opts": [
   "Descartar o pacote",
   "Encaminhar pela GigabitEthernet0/1",
   "Encaminhar pela GigabitEthernet0/0",
   "Encaminhar pela interface Serial0/0/0"
  ],
  "cor": 3,
  "sub": "Rota padrão IPv6 ::/0 — gateway of last resort",
  "why": "O endereço 2001:db8:cafe:5::1 não corresponde a nenhuma rede específica na tabela (não é :1:, :2:, :3:, nem :4:/128). A correspondência mais longa é a rota padrão ::/0, que aponta para Serial0/0/0. O roteador encaminha o pacote por essa interface."
 },
 {
  "id": 98,
  "mod": 4,
  "fonte": "srwe",
  "tp": "Gerência",
  "ty": "match",
  "text": "Faça a correspondência entre o estado do link e o status exibido pelos comandos show interface / show ip interface.",
  "pairs": [
   {
    "l": "Operacionais (funcionando normalmente)",
    "r": "Ativo / ativo (up/up)"
   },
   {
    "l": "Problema na Camada 2 (encapsulamento, keepalive)",
    "r": "Ativo / inativo (up/down)"
   },
   {
    "l": "Desativado administrativamente (shutdown)",
    "r": "Administrativamente desativado"
   },
   {
    "l": "Problema na Camada 1 (cabo, sinal físico)",
    "r": "Inativo / inativo (down/down)"
   }
  ],
  "sub": "Status de interface: up/up, up/down, down/down, admin down",
  "why": "'Ativo/ativo' (up/up) = interface funcionando. 'Ativo/inativo' (up/down) = problema L2 (mismatch de encapsulamento, keepalives ausentes). 'Administrativamente desativado' = comando shutdown aplicado. 'Inativo/inativo' (down/down) = problema físico (cabo desconectado, sinal ausente)."
 },
 {
  "id": 99,
  "mod": 4,
  "fonte": "srwe",
  "tp": "VLANs",
  "ty": "multi",
  "text": "Consulte a figura (SW-1 e SW-2 com trunk na Fa0/4; VLAN 1: hosts A, C, D, F; VLAN 2: hosts B, E, G). Quais três hosts receberão a solicitação ARP enviada pelo host A, se a porta Fa0/4 dos dois switches for configurada para receber tráfego de múltiplas VLANs? (Escolha três.)",
  "opts": [
   "host B",
   "host C",
   "host D",
   "host E",
   "host F",
   "host G"
  ],
  "cor": [
   1,
   2,
   4
  ],
  "sub": "ARP broadcast — limitado à mesma VLAN",
  "why": "ARP é um broadcast da Camada 2, confinado à VLAN. O host A está na VLAN 1. Broadcasts da VLAN 1 chegam apenas a outros membros da VLAN 1: hosts C, D e F. Os hosts B, E e G estão na VLAN 2 e não receberão o broadcast, mesmo que a porta trunk transporte ambas as VLANs.",
  "fig": "img/srwe-q044.webp",
  "figAlt": "Figura da questão 44 do exame final SRWE"
 },
 {
  "id": 100,
  "mod": 4,
  "fonte": "srwe",
  "tp": "EtherChannel",
  "ty": "single",
  "text": "Consulte a figura (SW1 e SW2 conectados por Po1 e Po2 — dois EtherChannels redundantes com STP ativo). Um administrador conectou dois switches com EtherChannel. Se o STP estiver em execução, qual será o resultado?",
  "opts": [
   "Os switches farão balanceamento de carga e usarão ambos os EtherChannels para encaminhar pacotes.",
   "O STP bloqueará um dos EtherChannels redundantes.",
   "O loop resultante criará tempestade de broadcast.",
   "Os dois port-channels serão desligados."
  ],
  "cor": 1,
  "sub": "STP bloqueia links redundantes — mesmo EtherChannels",
  "why": "O STP trata cada EtherChannel (port-channel) como um único link lógico. Com dois links lógicos entre os mesmos switches, há um loop de Camada 2. O STP elegerá um deles como blocked (alternativa), permitindo apenas um caminho ativo. O EtherChannel não elimina a necessidade do STP.",
  "fig": "img/srwe-q045.webp",
  "figAlt": "Figura da questão 45 do exame final SRWE"
 },
 {
  "id": 101,
  "mod": 4,
  "fonte": "srwe",
  "tp": "FHRP",
  "ty": "single",
  "text": "Consulte a figura (HSRP grupo 1; IP virtual=10.1.1.254/24; MAC virtual=00-00-0C-07-AC-01; R1 e R2 configurados). Um usuário no Host1 não tem conectividade com a Internet. O administrador verifica o HSRP e a tabela ARP do Host1. Qual entrada deve estar na tabela ARP do Host1 para que ele tenha conectividade?",
  "opts": [
   "O IP e o MAC físico do R1",
   "O IP virtual e o MAC virtual do grupo 1 do HSRP",
   "O IP virtual do grupo 1 do HSRP e o MAC físico do R1",
   "O IP virtual do grupo 1 do HSRP e o MAC físico do R2"
  ],
  "cor": 1,
  "sub": "HSRP — ARP do host aponta para IP/MAC virtual",
  "why": "O gateway padrão configurado no Host1 deve ser o IP virtual (10.1.1.254). A entrada ARP correspondente deve mapear esse IP virtual ao MAC virtual do grupo HSRP (00-00-0C-07-AC-01). Usar o IP/MAC de R1 ou R2 individualmente quebraria a redundância e causaria falha quando o roteador ativo mudasse.",
  "fig": "img/srwe-q046.webp",
  "figAlt": "Figura da questão 46 do exame final SRWE"
 },
 {
  "id": 102,
  "mod": 4,
  "fonte": "srwe",
  "tp": "VLANs",
  "ty": "multi",
  "text": "Quais dois modos VTP permitem a criação, modificação e exclusão de VLANs no switch local? (Escolha duas.)",
  "opts": [
   "cliente",
   "slave",
   "servidor",
   "transparente",
   "master",
   "distribuição"
  ],
  "cor": [
   2,
   3
  ],
  "sub": "VTP modos servidor e transparente — gerenciamento de VLANs",
  "why": "No modo servidor VTP: VLANs podem ser criadas/modificadas/deletadas localmente e as mudanças são propagadas pelo domínio VTP. No modo transparente: VLANs são gerenciadas localmente (criadas/modificadas/deletadas) mas as mudanças NÃO são propagadas — o switch apenas encaminha mensagens VTP. No modo cliente: não é possível modificar VLANs."
 },
 {
  "id": 103,
  "mod": 4,
  "fonte": "srwe",
  "tp": "VLANs",
  "ty": "multi",
  "text": "Um novo switch deve ser adicionado a uma rede existente. O administrador não quer que os técnicos do escritório remoto adicionem novas VLANs, mas o switch deve receber atualizações VLAN do domínio VTP. Quais duas etapas devem ser executadas? (Escolha duas.)",
  "opts": [
   "Configurar um endereço IP no novo switch.",
   "Configurar o nome de domínio VTP existente no novo switch.",
   "Configurar todas as portas dos dois switches em modo acesso.",
   "Configurar o novo switch como cliente VTP.",
   "Ativar a poda VTP (VTP pruning)."
  ],
  "cor": [
   1,
   3
  ],
  "sub": "VTP cliente — recebe atualizações, não cria VLANs",
  "why": "Para que o switch receba atualizações VTP sem poder criar VLANs: (1) configurar o mesmo domínio VTP da rede existente (sem isso, o switch ignora mensagens VTP); (2) configurar o modo cliente VTP (switchport mode vtp client). No modo cliente, o switch sincroniza VLANs mas não pode criar/modificar/deletar localmente."
 },
 {
  "id": 104,
  "mod": 4,
  "fonte": "srwe",
  "tp": "Segurança L2",
  "ty": "single",
  "text": "Qual técnica de mitigação impediria servidores DHCP invasores (rogue) de fornecer parâmetros de configuração IP falsos aos clientes?",
  "opts": [
   "Desativar o CDP nas portas de borda",
   "Implementar port security nas portas de borda",
   "Ativar o DHCP Snooping",
   "Implementar segurança de porta (port security)"
  ],
  "cor": 2,
  "sub": "DHCP Snooping — filtragem de respostas DHCP não autorizadas",
  "why": "DHCP Snooping classifica portas como confiáveis (trusted) ou não confiáveis (untrusted). Mensagens DHCP de servidor (DHCPOFFER, DHCPACK) recebidas em portas não confiáveis são descartadas. Somente a porta conectada ao servidor DHCP legítimo é marcada como trusted. Isso impede servidores rogue de fornecer configurações falsas."
 },
 {
  "id": 105,
  "mod": 4,
  "fonte": "srwe",
  "tp": "FHRP",
  "ty": "match",
  "text": "Faça a correspondência do número da etapa com a descrição correta do processo de failover do HSRP.",
  "pairs": [
   {
    "l": "Etapa 1",
    "r": "O roteador de encaminhamento (ativo) falha"
   },
   {
    "l": "Etapa 2",
    "r": "O roteador em standby para de receber mensagens Hello do roteador de encaminhamento"
   },
   {
    "l": "Etapa 3",
    "r": "O roteador standby assume a função de encaminhamento, usando os endereços IP e MAC do roteador virtual"
   }
  ],
  "sub": "HSRP failover — sequência de 3 etapas",
  "why": "O processo de failover HSRP: (1) o roteador ativo falha; (2) o roteador standby detecta a falha ao não receber mensagens Hello dentro do hold time; (3) o standby assume o papel ativo, respondendo pelo IP e MAC virtuais do grupo — transparente para os hosts da rede."
 },
 {
  "id": 106,
  "mod": 4,
  "fonte": "srwe",
  "tp": "WLAN",
  "ty": "single",
  "text": "Na interface gráfica do Cisco WLC 3504 (Advanced Summary), qual aba permite que um administrador configure uma WLAN específica com uma política de segurança WPA2?",
  "opts": [
   "WLANs",
   "SEGURANÇA",
   "SEM FIO (WIRELESS)",
   "GERENCIAMENTO"
  ],
  "cor": 0,
  "sub": "WLC — configuração de WLAN e segurança WPA2",
  "why": "Na interface do WLC Cisco, a aba 'WLANs' lista todas as redes sem fio configuradas. Ao clicar em uma WLAN específica e acessar a guia 'Security', o administrador pode configurar a política WPA2 (camada 2), incluindo método de autenticação (PSK ou 802.1X) e tipo de criptografia (AES/TKIP)."
 },
 {
  "id": 107,
  "mod": 4,
  "fonte": "srwe",
  "tp": "WLAN",
  "ty": "single",
  "text": "Um administrador está configurando a segurança WLAN usando WPA2 PSK em uma pequena empresa. Que credencial os usuários precisarão para conectar seus laptops à WLAN?",
  "opts": [
   "Uma senha de usuário individual",
   "Uma chave pré-compartilhada que corresponde à chave configurada no AP",
   "Um nome de usuário e senha configurados no AP",
   "Nome de usuário e senha da empresa via Active Directory"
  ],
  "cor": 1,
  "sub": "WPA2 PSK — chave pré-compartilhada para autenticação",
  "why": "No modo WPA2 Personal (PSK — Pre-Shared Key), todos os dispositivos usam a mesma senha (passphrase) configurada no ponto de acesso. O usuário precisa conhecer essa chave para se conectar. Não há servidor de autenticação. WPA2 Enterprise (com RADIUS/802.1X) usa credenciais individuais por usuário."
 },
 {
  "id": 108,
  "mod": 4,
  "fonte": "srwe",
  "tp": "Roteamento",
  "ty": "single",
  "text": "Uma rota estática foi configurada em um roteador, mas a rede destino não existe mais. O que o administrador deve fazer para remover a rota estática da tabela de roteamento?",
  "opts": [
   "Alterar a métrica de roteamento dessa rota.",
   "Nada — a rota estática desaparecerá automaticamente.",
   "Alterar a distância administrativa dessa rota.",
   "Remover a rota com o comando no ip route."
  ],
  "cor": 3,
  "sub": "Remoção de rota estática — comando no ip route",
  "why": "Diferente de rotas dinâmicas, rotas estáticas não expiram automaticamente. Para removê-la, o administrador deve usar o comando 'no ip route <rede> <máscara> <next-hop ou interface>'. Alterar métrica ou AD não remove a rota da tabela."
 },
 {
  "id": 109,
  "mod": 4,
  "fonte": "srwe",
  "tp": "Switching",
  "ty": "single",
  "text": "Que ação ocorre quando um quadro que entra em um switch possui um endereço MAC destino multicast?",
  "opts": [
   "O switch encaminha o quadro para todas as portas, exceto a porta de entrada.",
   "O switch adiciona o MAC de destino e a porta de entrada à tabela CAM.",
   "O switch atualiza o temporizador de atualização para a entrada existente.",
   "O switch adiciona uma entrada na tabela MAC para o destino e a porta de saída."
  ],
  "cor": 0,
  "sub": "Flooding de frames multicast pelo switch",
  "why": "Por padrão (sem IGMP snooping), um switch trata frames com endereço MAC multicast de forma similar a broadcasts: encaminha para todas as portas ativas exceto a porta de entrada (flooding). O switch não aprende endereços multicast na tabela CAM a partir do endereço destino — apenas aprende o MAC origem."
 },
 {
  "id": 110,
  "mod": 4,
  "fonte": "srwe",
  "tp": "Inter-VLAN",
  "ty": "multi",
  "text": "Um novo switch de Camada 3 está sendo configurado para roteamento inter-VLAN. Quais são três das etapas necessárias para essa configuração? (Escolha três.)",
  "opts": [
   "Atribuir portas às VLANs",
   "Criar interfaces SVI (Switch Virtual Interface)",
   "Criar as VLANs",
   "Instalar uma rota estática",
   "Implementar um protocolo de roteamento",
   "Ajustar a métrica de rota",
   "Modificar a VLAN padrão"
  ],
  "cor": [
   0,
   1,
   2
  ],
  "sub": "Switch L3 inter-VLAN: criar VLANs, SVIs e atribuir portas",
  "why": "Para roteamento inter-VLAN em um switch L3: (1) criar as VLANs (vlan <id>); (2) criar SVIs (interface vlan <id> + ip address) — uma por VLAN para ser o gateway; (3) atribuir as portas de acesso às VLANs corretas (switchport access vlan). Também é necessário 'ip routing', mas as três etapas essenciais listadas são as três primeiras."
 },
 {
  "id": 111,
  "mod": 4,
  "fonte": "srwe",
  "tp": "EtherChannel",
  "ty": "multi",
  "text": "Selecione os três modos usados no protocolo PAgP para estabelecimento de EtherChannel. (Escolha três.)",
  "opts": [
   "on (ligado)",
   "desirable",
   "auto (automático)",
   "active (ativo)",
   "passive (passivo)",
   "extended (estendido)"
  ],
  "cor": [
   0,
   1,
   2
  ],
  "sub": "PAgP: modos on, desirable e auto",
  "why": "PAgP (Port Aggregation Protocol, proprietário Cisco) usa três modos: 'on' (força o canal sem PAgP), 'desirable' (inicia ativamente a negociação) e 'auto' (aguarda passivamente). Os modos 'active' e 'passive' são exclusivos do LACP (IEEE 802.3ad). Um canal PAgP é formado entre desirable-desirable ou desirable-auto."
 },
 {
  "id": 112,
  "mod": 4,
  "fonte": "srwe",
  "tp": "STP",
  "ty": "single",
  "text": "Qual protocolo ou tecnologia desabilita caminhos redundantes para eliminar loops na Camada 2?",
  "opts": [
   "STP",
   "DTP",
   "EtherChannel",
   "VTP"
  ],
  "cor": 0,
  "sub": "STP — prevenção de loops na Camada 2",
  "why": "O Spanning Tree Protocol (STP/802.1D) previne loops de Camada 2 colocando portas redundantes em estado de bloqueio (blocking). DTP negocia trunking. EtherChannel agrega links (mas não elimina loops por si só). VTP distribui informações de VLAN. Apenas STP é projetado especificamente para eliminar loops L2."
 },
 {
  "id": 113,
  "mod": 4,
  "fonte": "srwe",
  "tp": "WLAN",
  "ty": "single",
  "text": "Um administrador está configurando uma WLAN. Por que ele alteraria os endereços IPv4 do pool DHCP padrão configurado no AP?",
  "opts": [
   "Para dificultar que invasores externos identifiquem a faixa de endereços usada na rede, já que a faixa padrão é amplamente conhecida.",
   "Para reduzir o risco de interferência por dispositivos externos como fornos de micro-ondas.",
   "Para restringir o acesso à WLAN apenas a usuários autorizados e autenticados.",
   "Para monitorar o funcionamento da rede sem fio."
  ],
  "cor": 0,
  "sub": "Alteração do DHCP padrão no AP — segurança por obscuridade",
  "why": "Roteadores sem fio domésticos geralmente usam faixas conhecidas como 192.168.0.x ou 192.168.1.x. Um atacante que conseguir acesso à rede saberá qual faixa usar. Alterar para uma sub-rede menos óbvia dificulta ataques automatizados e scanning de rede, adicionando uma camada de segurança por obscuridade."
 },
 {
  "id": 114,
  "mod": 4,
  "fonte": "srwe",
  "tp": "Gerência",
  "ty": "single",
  "text": "Um administrador observa que um grande número de pacotes está sendo descartado em um dos roteadores de filial. O que deve ser verificado primeiramente?",
  "opts": [
   "Verificar a tabela de roteamento para identificar uma rota estática ausente ou incorreta.",
   "Criar rotas estáticas extras para o mesmo destino com AD=1.",
   "Verificar as estatísticas da rota padrão para sobrecarga.",
   "Criar rotas estáticas para todas as redes internas e uma rota padrão para a Internet."
  ],
  "cor": 0,
  "sub": "Diagnóstico de descarte de pacotes — tabela de roteamento",
  "why": "Pacotes descartados (dropped) em um roteador geralmente indicam que o destino não tem correspondência na tabela de roteamento (rota ausente). A primeira ação de troubleshooting deve ser verificar a tabela de roteamento (show ip route) para identificar rotas ausentes ou incorretas antes de tomar outras ações."
 },
 {
  "id": 115,
  "mod": 4,
  "fonte": "srwe",
  "tp": "VLANs",
  "ty": "single",
  "text": "Qual é o efeito de inserir o comando switchport mode access em uma interface de switch?",
  "opts": [
   "Ele desativa o DTP (Dynamic Trunking Protocol) em uma interface que não está em modo trunk.",
   "Ele ativa manualmente um link de tronco na interface.",
   "Ele desativa uma porta não utilizada do switch.",
   "Ele habilita o BPDU guard em uma porta específica."
  ],
  "cor": 0,
  "sub": "switchport mode access — desativa DTP na porta de acesso",
  "why": "O comando 'switchport mode access' configura a porta como modo acesso permanente e desativa o DTP. A porta não irá negociar nem aceitar trunk. Isso é uma prática de segurança recomendada para portas conectadas a hosts finais, pois impede ataques que exploram a negociação automática de trunk (DTP)."
 },
 {
  "id": 116,
  "mod": 4,
  "fonte": "cert",
  "tp": "Arquitetura",
  "ty": "single",
  "text": "Um instrutor está revisando as respostas dos alunos em um exame de termo anterior para se preparar para uma palestra sobre IPv6. Qual seria um bom ponto para o instrutor fazer ao explicar um GUA IPv6 (endereço unicast global)?",
  "opts": [
   "Pode ser configurado estaticamente ou atribuído dinamicamente em um roteador.",
   "É considerado uma prática recomendada usar o endereço IPV6 GUA do roteador como o endereço de gateway padrão para hosts Windows.",
   "Ele só pode ser configurado estaticamente em uma interface de host usando o comando ipv6 address .",
   "É roteável na internet IPv6."
  ],
  "cor": 3,
  "why": "O endereço GUA IPv6 pode ser configurado estaticamente em um roteador, e de forma estática ou dinâmica em uma interface de host. É boa prática usar o endereço link-local do roteador como gateway padrão dos hosts."
 },
 {
  "id": 117,
  "mod": 4,
  "fonte": "cert",
  "tp": "Switching",
  "ty": "single",
  "text": "Um técnico está revisando um relatório de lentidão durante os períodos de pico de tráfego e está analisando o desempenho de um switch específico. O que o técnico deve estar ciente sobre o buffer de memória em um switch?",
  "opts": [
   "A memória compartilhada permite que o tráfego recebido em uma porta seja transmitido para outra porta sem mover os dados para uma fila diferente.",
   "O método de memória baseada em porta é mais apropriado para comutação assimétrica.",
   "A quantidade de memória buffer requerida por uma porta é alocada dinamicamente quando a memória baseada em porta é usada.",
   "Se a memória compartilhada for usada, um único quadro poderá atrasar a transmissão de todos os outros na memória devido a uma porta de destino ocupada."
  ],
  "cor": 0,
  "why": "A memória compartilhada em um switch armazena todos os quadros em um único pool de memória acessível a qualquer porta, permitindo que um quadro recebido em uma porta seja encaminhado diretamente para a porta de destino sem ser movido para uma fila separada. Isso torna a alocação dinâmica: portas com mais tráfego utilizam mais memória conforme necessário. É essa característica que diferencia a memória compartilhada da memória baseada em porta, onde cada porta recebe um buffer fixo independentemente da carga."
 },
 {
  "id": 118,
  "mod": 4,
  "fonte": "cert",
  "tp": "Arquitetura",
  "ty": "single",
  "text": "Como são calculadas as transmissões de dados de rede?",
  "opts": [
   "goodput + latência = largura de banda",
   "taxa de transferência + taxa de transferência = largura de banda",
   "taxa de transferência + taxa de transferência = largura de banda",
   "goodput + sobrecarga de tráfego = taxa de transferência"
  ],
  "cor": 3,
  "why": "A taxa de transferência (throughput) representa o total de dados efetivamente transmitidos na rede, composto pelo goodput — os dados úteis recebidos pela aplicação — mais a sobrecarga de tráfego (cabeçalhos de protocolo, retransmissões, sinalizações). O goodput é sempre menor que o throughput justamente porque parte da capacidade é consumida por essa sobrecarga. A relação goodput + sobrecarga = taxa de transferência descreve corretamente como a transmissão real é calculada."
 },
 {
  "id": 119,
  "mod": 4,
  "fonte": "cert",
  "tp": "Arquitetura",
  "ty": "single",
  "text": "Os alunos de uma aula de rede de dados estão revisando materiais em preparação para um questionário. Qual instrução descreve a operação de um método de controle de acesso para mídia de rede compartilhada?",
  "opts": [
   "Em uma rede multiacesso baseada em contenção, cada nó tem seu próprio tempo para usar a mídia.",
   "No método CSMA/CD, quando dois dispositivos transmitem ao mesmo tempo, uma colisão é detectada e os dados são reenviados imediatamente.",
   "O método de acesso baseado em controle, usado em LANs Ethernet de topologia de barramento legadas, decidiu a ordem de transmissão de cada dispositivo.",
   "O método CSMA/CA tenta evitar colisões fazendo com que cada dispositivo informe as outras pessoas quanto tempo a mídia ficará indisponível."
  ],
  "cor": 3,
  "why": "O CSMA/CA não detecta colisões: ele tenta evitá-las esperando antes de transmitir. Cada dispositivo que transmite informa por quanto tempo precisa do meio, e todos os outros dispositivos sem fio recebem essa informação e sabem por quanto tempo o meio ficará indisponível."
 },
 {
  "id": 120,
  "mod": 4,
  "fonte": "cert",
  "tp": "WLAN",
  "ty": "multi",
  "text": "Um administrador precisa implementar uma WLAN de 2,4 GHz que exija vários APs. Quais são as características dos canais de 2,4 GHz? (Escolha duas.)",
  "opts": [
   "Se forem necessários três APs adjacentes, os canais 1, 21 e 41 não sobrepostos são recomendados.",
   "Cada canal é separado do próximo canal por 20 MHz.",
   "Cada canal é atribuído 22 MHz largura de banda.",
   "Existem 11 canais para a América do Norte identificados pelo padrão 802.11b.",
   "Eles podem fornecer uma transmissão de dados mais rápida para clientes sem fio em redes sem fio densamente povoadas que os canais de 5 GHz."
  ],
  "cor": [
   2,
   3
  ],
  "sub": "Escolha as alternativas corretas",
  "why": "A faixa de 2,4 GHz é subdividida em vários canais. Cada canal recebe 22 MHz de largura de banda e é separado do seguinte por 5 MHz. Com três APs adjacentes, usam-se os canais 1, 6 e 11. O padrão 802.11b identifica 11 canais para a América do Norte. O 5 GHz entrega transmissão mais rápida em redes densamente povoadas porque oferece muito mais canais sem sobreposição."
 },
 {
  "id": 121,
  "mod": 4,
  "fonte": "cert",
  "tp": "Arquitetura",
  "ty": "single",
  "text": "Um grupo de técnicos de rede está discutindo processos de multicast IPv6. O que é um recurso de um tipo de endereço multicast IPv6 que deve ser discutido?",
  "opts": [
   "Ele tem o prefixo fe00::/8.",
   "O grupo multicast de todos os nós tem o mesmo efeito que um endereço de difusão IPv4.",
   "Um endereço multicast de nó solicitado é semelhante ao endereço multicast de todos os roteadores.",
   "Pode ser um endereço de origem ou de destino."
  ],
  "cor": 1,
  "why": "No IPv6 não existe endereço de difusão (broadcast); em vez disso, o endereço multicast de todos os nós (FF02::1) alcança todos os dispositivos no enlace local, cumprindo função equivalente ao broadcast do IPv4. O prefixo dos endereços multicast IPv6 é FF00::/8, não FE00::/8 como indicado nas opções incorretas. Endereços multicast também não podem ser usados como endereço de origem em pacotes IPv6."
 },
 {
  "id": 122,
  "mod": 4,
  "fonte": "cert",
  "tp": "SDN/Cloud",
  "ty": "multi",
  "text": "Quais são os dois benefícios de usar a virtualização? (Escolha duas.)",
  "opts": [
   "Como todos os sistemas operacionais virtuais estão contidos em uma única rede virtual, as conexões de rede são simplificadas.",
   "O sistema operacional da máquina virtual não requer licenciamento quando é virtualizado.",
   "Várias máquinas virtuais podem ser executadas simultaneamente em um único dispositivo físico.",
   "O desempenho de uma máquina virtual é mais rápido do que o desempenho do sistema operacional em execução no hardware físico.",
   "A máquina virtual não depende mais de uma plataforma de hardware específica."
  ],
  "cor": [
   2,
   4
  ],
  "sub": "Escolha as alternativas corretas",
  "why": "A virtualização permite executar várias máquinas virtuais simultaneamente em um único host físico, reduzindo custos de hardware e melhorando o aproveitamento dos recursos. Além disso, uma VM é abstraída do hardware subjacente — seu sistema operacional e aplicações não dependem de uma plataforma física específica, o que possibilita migrá-la entre servidores diferentes sem reconfigurações. Esses dois benefícios são os fundamentos da virtualização em ambientes corporativos."
 },
 {
  "id": 123,
  "mod": 4,
  "fonte": "cert",
  "tp": "WLAN",
  "ty": "single",
  "text": "Um técnico precisa adicionar um novo dispositivo sem fio a uma pequena WLAN. A WLAN é uma mistura de dispositivos antigos e recentes 802.11b e 802.11g. Que escolha de novo dispositivo daria mais interoperabilidade para o crescimento presente e futuro ?",
  "opts": [
   "Adicionar um novo dispositivo 802.11a.",
   "Adicionar um novo dispositivo 802.11g.",
   "Adicionar um novo dispositivo 802.11b.",
   "Adicionar um novo dispositivo 802.11n."
  ],
  "cor": 3,
  "why": "Os dispositivos 802.11n são interoperáveis com todos os outros padrões e oferecem mais largura de banda. O 802.11a não é interoperável com nenhum outro padrão. O 802.11b e o 802.11g interoperam entre si, mas não entregam a largura de banda do 802.11n."
 },
 {
  "id": 124,
  "mod": 4,
  "fonte": "cert",
  "tp": "Arquitetura",
  "ty": "single",
  "text": "Um engenheiro de rede está dando um tour pelo centro de operações de rede da empresa para uma classe universitária. O engenheiro está tentando descrever como uma WAN e conectividade com a Internet se relacionam com a infraestrutura de rede. Qual declaração descreve corretamente a infra-estrutura de rede e a comunicação de rede?",
  "opts": [
   "A internet é uma coleção mundial de redes interconectadas pertencentes a uma organização.",
   "As LANs são usadas para conectar WANs ao redor do mundo.",
   "Uma LAN conecta pequenas redes a grandes redes globais.",
   "A comunicação através da internet requer a aplicação de tecnologias e padrões reconhecidos."
  ],
  "cor": 3,
  "why": "A internet não pertence a nenhum indivíduo ou grupo. Garantir a comunicação eficaz nessa infraestrutura diversa exige o uso de tecnologias e padrões consistentes e reconhecidos, além da cooperação de muitas agências de administração de redes."
 },
 {
  "id": 125,
  "mod": 4,
  "fonte": "cert",
  "tp": "Arquitetura",
  "ty": "single",
  "text": "Dois recém-formados de redes de uma faculdade local acabaram de ser contratados por uma empresa de comunicação para trabalhar em vários projetos de cabeamento de rede em todo o estado. Por que a empresa consideraria o uso de cabeamento de fibra óptica em redes de longo curso?",
  "opts": [
   "para fornecer soluções de alta capacidade para teletrabalhadores",
   "para fornecer cabeamento de backbone para aplicativos e dispositivos de infra-estrutura de interconexão para clientes",
   "fornecer serviços de banda larga sempre ativos a clientes em residências e pequenas empresas",
   "para fornecer conectividade entre países ou entre cidades"
  ],
  "cor": 3,
  "why": "A fibra óptica transmite dados como pulsos de luz, sofrendo atenuação muito menor do que o cobre ao longo de grandes distâncias. Para conexões de longa distância, como enlaces entre cidades ou entre países, a fibra é o meio preferencial justamente por suportar altíssimas taxas de transmissão por centenas de quilômetros sem a necessidade de regeneradores frequentes. As demais opções descrevem cenários de acesso residencial ou de backbone de edifício, não de longa distância."
 },
 {
  "id": 126,
  "mod": 4,
  "fonte": "cert",
  "tp": "Arquitetura",
  "ty": "multi",
  "text": "Quais duas instruções descrevem uma opção de conectividade baseada na Internet? (Escolha duas.)",
  "opts": [
   "Na tecnologia de cabo, cada assinante local tem uma conexão direta separada com o headend do provedor.",
   "Ao usar um satélite para se conectar à internet, a recepção de sinais pode ser afetada por tempestades.",
   "As VPNs fornecem segurança para teletrabalhadores que usam DSL para acessar a rede corporativa através da Internet.",
   "LTE é uma tecnologia de acesso móvel 5G mais recente.",
   "O ADSL2 + fornece maior largura de banda de upload do que a largura de banda de upload."
  ],
  "cor": [
   1,
   2
  ],
  "sub": "Escolha as alternativas corretas",
  "why": "O ADSL2+ oferece mais largura de banda de download do que de upload ao usuário. Na tecnologia de cabo, todos os assinantes locais compartilham a mesma largura de banda do cabo. O LTE é uma tecnologia mais nova e rápida, parte do 4G. Na conexão via satélite, árvores e chuvas fortes podem afetar a recepção do sinal. Para tratar questões de segurança, os serviços de banda larga permitem conexões VPN com um dispositivo que as aceite, normalmente na sede da empresa."
 },
 {
  "id": 127,
  "mod": 4,
  "fonte": "cert",
  "tp": "WLAN",
  "ty": "single",
  "text": "Ao configurar uma LAN sem fio, a qual categoria pertence um roteador sem fio doméstico?",
  "opts": [
   "Baseado no protocolo CAPWAP",
   "Baseado no protocolo LWAPP",
   "AP autônomo",
   "AP baseado em controlador"
  ],
  "cor": 2,
  "why": "Os pontos de acesso sem fio se dividem em APs autônomos ou APs baseados em controlador. APs autônomos são dispositivos independentes, configurados por linha de comando ou pela interface gráfica do próprio equipamento. APs baseados em controlador não exigem configuração inicial: a configuração e o gerenciamento são feitos por um controlador WLAN (WLC)."
 },
 {
  "id": 128,
  "mod": 4,
  "fonte": "cert",
  "tp": "STP",
  "ty": "multi",
  "text": "Considere a figura. Todos os switches exibidos são switches Cisco 2960 com a mesma prioridade padrão e operando na mesma largura de banda. Três portas serão designadas como portas de STP. Quais? (Escolha três.)",
  "opts": [
   "fa0/11",
   "fa0/13",
   "fa0/9",
   "fa0/21",
   "fa0/10",
   "fa0/20"
  ],
  "cor": [
   1,
   3,
   4
  ],
  "sub": "Escolha as alternativas corretas",
  "why": "Como todos os switches têm a mesma prioridade padrão e operam na mesma largura de banda, o switch com o menor endereço MAC se torna a raiz (root bridge). Esse é o SW3, e todas as suas portas serão designadas. O SW1 tem MAC menor que o SW2, portanto a porta fa0/10 será a porta designada nesse enlace.",
  "fig": "img/cert-q013.webp",
  "figAlt": "Figura da questão 13 do exame de certificação 200-301"
 },
 {
  "id": 129,
  "mod": 4,
  "fonte": "cert",
  "tp": "STP",
  "ty": "single",
  "text": "O que é um benefício do PortFast configurado em uma porta de switch Cisco?",
  "opts": [
   "Ele permite que a porta evite um atraso de 30 segundos para acessar a rede fazendo a transição imediata do estado desativado para o encaminhamento.",
   "Ele permite que um dispositivo conectado a essa porta acesse a rede sem aguardar a convergência de STP em cada VLAN.",
   "Evita a criação de um loop de árvore de abrangência com outros switches conectados diretamente.",
   "Ele minimiza o tempo que as portas de tronco devem aguardar a convergência da árvore de abrangência."
  ],
  "cor": 1,
  "why": "Com o PortFast configurado, a porta passa de bloqueio para encaminhamento imediatamente, pulando os estados de escuta e aprendizado do 802.1D STP e evitando o atraso de 30 segundos. Pode-se usar PortFast em portas de acesso para que dispositivos como clientes DHCP acessem a rede na hora, sem esperar a convergência do STP em cada VLAN."
 },
 {
  "id": 130,
  "mod": 4,
  "fonte": "cert",
  "tp": "VLANs",
  "ty": "single",
  "text": "Qual característica descreve como as VLANs de dados ou de voz são configuradas em uma rede?",
  "opts": [
   "Uma porta de switch configurada no modo de acesso só pode pertencer a uma VLAN de dados por vez.",
   "O comando switchport access vlan deve especificar uma VLAN configurada no momento no arquivo vlan.dat.",
   "As VLANs de dados e de voz têm um intervalo de valores diferente para IDs de VLAN.",
   "As VLANs de voz são configuradas em um link de tronco entre o telefone IP e o switch."
  ],
  "cor": 0,
  "why": "Uma porta de acesso do switch pertence a apenas uma VLAN de dados por vez, mas também pode ser associada a uma VLAN de voz. Uma porta de acesso ligada a um telefone IP precisa suportar o tráfego das VLANs de voz e de dados. O comando switchport access vlan cria a VLAN automaticamente se ela ainda não existir no switch."
 },
 {
  "id": 131,
  "mod": 4,
  "fonte": "cert",
  "tp": "EtherChannel",
  "ty": "single",
  "text": "Considere a figura. Um administrador de rede está verificando a configuração do switch S1. Que protocolo foi executado para agrupar portas físicas no link lógico?",
  "opts": [
   "STP",
   "LACP",
   "PAgP",
   "DTP"
  ],
  "cor": 2,
  "why": "O protocolo de EtherChannel PAgP agrupa interfaces físicas usando os modos auto e desirable. O LACP agrupa interfaces físicas usando os modos passive e active. DTP e STP não agrupam interfaces físicas em um único enlace lógico.",
  "fig": "img/cert-q016.webp",
  "figAlt": "Figura da questão 16 do exame de certificação 200-301"
 },
 {
  "id": 132,
  "mod": 4,
  "fonte": "cert",
  "tp": "VLANs",
  "ty": "single",
  "text": "Consulte a figura. Um administrador de redes está verificando a porta e as atribuições de VLAN no switch S2 e percebe que as interfaces Gi0/1 e Gi0/2 não estão incluídas na saída. Por que as interfaces estão faltando na saída?",
  "opts": [
   "Elas são configuradas como interfaces trunk.",
   "Não há meio físico conectado às interfaces.",
   "Elas estão administratively down.",
   "Há uma incompatibilidade de VLAN nativa entre os switches."
  ],
  "cor": 0,
  "why": "Interfaces configuradas como trunk não pertencem a uma VLAN e por isso não aparecem na saída do comando show vlan brief.",
  "fig": "img/cert-q017.webp",
  "figAlt": "Figura da questão 17 do exame de certificação 200-301"
 },
 {
  "id": 133,
  "mod": 4,
  "fonte": "cert",
  "tp": "EtherChannel",
  "ty": "multi",
  "text": "Quais são os dois métodos de balanceamento de carga da tecnologia EtherChannel? (Escolha duas.)",
  "opts": [
   "MAC origem para MAC destino",
   "combinação de porta origem e IP com porta destino e IP",
   "IP origem para IP destino",
   "porta origem para porta destino",
   "combinação de MAC origem e IP com MAC destino e IP"
  ],
  "cor": [
   0,
   2
  ],
  "sub": "Escolha as alternativas corretas",
  "why": "Depending on the hardware platform, one or more load-balancing methods can be implemented. These methods include source MAC to destination MAC load balancing or source IP to destination IP load balancing, across the physical links."
 },
 {
  "id": 134,
  "mod": 4,
  "fonte": "cert",
  "tp": "WLAN",
  "ty": "multi",
  "text": "Uma empresa implanta APs FlexConnect no escritório remoto e usa CAPWAP para permitir que uma WLC em seu escritório da sede corporativa gerencie WLANs no escritório remoto. Um dia, o administrador de rede no escritório remoto observa que os APs FlexConnect estão operando no modo autônomo. Quais duas funções esses APs podem executar nesse modo? (Escolha duas.)",
  "opts": [
   "tradução de quadros para outros protocolos",
   "associação de clientes de roaming",
   "autenticação de cliente localmente",
   "alternando localmente o tráfego de dados do cliente",
   "Reassociação de clientes de roaming"
  ],
  "cor": [
   2,
   3
  ],
  "sub": "Escolha as alternativas corretas",
  "why": "O modo autônomo do FlexConnect é ativado quando o AP perde contato com a WLC. Nesse modo, o AP mantém a rede operacional realizando autenticação de clientes localmente — sem precisar consultar a WLC — e comutando o tráfego de dados dos clientes diretamente na rede local. Funções que dependem de comunicação ativa com a WLC, como roaming entre APs de sites distintos, não estão disponíveis nesse modo."
 },
 {
  "id": 135,
  "mod": 4,
  "fonte": "cert",
  "tp": "WLAN",
  "ty": "single",
  "text": "Em uma rede sem fio baseada em controlador, o dispositivo WLC pode ter várias portas conectadas a um switch para formar um pacote que fornece balanceamento de carga e redundância. Qual protocolo suporta o pacote de portas entre um Cisco WLC e um Cisco Switch?",
  "opts": [
   "CAPWAP",
   "LAG",
   "LACP",
   "PAgP"
  ],
  "cor": 1,
  "why": "Os WLCs da Cisco podem usar várias portas para se conectar à infraestrutura de switching. Essas portas são agrupadas em um link aggregation group (LAG), que oferece redundância e balanceamento de carga. Porém, os WLCs não suportam PAgP nem LACP."
 },
 {
  "id": 136,
  "mod": 4,
  "fonte": "cert",
  "tp": "Switching",
  "ty": "single",
  "text": "Consulte a figura. Um administrador de rede usa o comando show lldp neighbors para exibir informações sobre os dispositivos vizinhos. O que pode ser determinado com base nas informações recebidas?",
  "opts": [
   "Que o dispositivo B1 é um access point da WLAN.",
   "Que o dispositivo C1 é um switch.",
   "O dispositivo A1 está conectado à porta Fa0/5 no dispositivo B1.",
   "Que o dispositivo C1 está conectado ao dispositivo B1 por meio da porta Fa0/3."
  ],
  "cor": 1,
  "why": "Na saída do comando show lldp neighbors, a letra B representa uma bridge — ou seja, um switch. A letra R representa um roteador. Se o vizinho for um access point WLAN, usa-se a letra W. O dispositivo A1 está conectado à porta Fa0/1 do B1. O A1 também está conectado à Fa0/3 do C1, e por isso o C1 não pode se conectar ao B1 por essa mesma porta Fa0/3.",
  "fig": "img/cert-q021.webp",
  "figAlt": "Figura da questão 21 do exame de certificação 200-301"
 },
 {
  "id": 137,
  "mod": 4,
  "fonte": "cert",
  "tp": "STP",
  "ty": "multi",
  "text": "Combine o estado da porta STP com a descrição apropriada.",
  "opts": [
   "A porta se prepara para participar do encaminhamento do quadro e começa a preencher a tabela de endereços MAC.",
   "A porta recebe quadros BPDU mas não encaminha quadros.",
   "A porta não participa da spanning tree e não encaminha quadros."
  ],
  "cor": [
   0,
   1,
   2
  ],
  "sub": "Escolha as alternativas corretas",
  "why": "No STP existem estados distintos com comportamentos específicos. O estado de aprendizado (learning) é aquele em que a porta se prepara para encaminhar quadros e já começa a popular a tabela de endereços MAC, mas ainda não encaminha tráfego de dados. O estado de bloqueio (blocking) faz a porta receber BPDUs para manter informações de topologia, porém não encaminha quadros de dados. O estado desativado (disabled) significa que a porta foi administrativamente desligada, não participando do STP nem encaminhando quadros."
 },
 {
  "id": 138,
  "mod": 4,
  "fonte": "cert",
  "tp": "VLANs",
  "ty": "single",
  "text": "Consulte a figura. Um técnico de rede usa o comando show vlan para verificar a configuração da VLAN. Com base na saída, qual porta deve ser atribuída à VLAN nativa?",
  "opts": [
   "Fa0/24",
   "Fa0/12",
   "Fa0/20",
   "Gig0/1"
  ],
  "cor": 2,
  "why": "Na saída, a porta F0/20 não aparece, o que significa que está configurada como trunk. Uma VLAN nativa só pode ser atribuída a uma porta trunk.",
  "fig": "img/cert-q023.webp",
  "figAlt": "Figura da questão 23 do exame de certificação 200-301"
 },
 {
  "id": 139,
  "mod": 4,
  "fonte": "cert",
  "tp": "OSPF",
  "ty": "single",
  "text": "Um engenheiro de rede está examinando configurações de roteador Cisco em uma rede de Internet. Considere a seguinte entrada da tabela de roteamento\n\nO 10.0.4.0/24 [110/50] via 10.0.3.2, 00:24:22, Serial0/1/1\n\nQual é a distância administrativa dessa rota?",
  "opts": [
   "50",
   "110",
   "160",
   "24"
  ],
  "cor": 1,
  "why": "Quando o roteador aprende uma rede de destino por várias fontes, a distância administrativa (AD) define qual rota entra na tabela. O menor valor de AD é o escolhido. A distância administrativa do OSPF é 110."
 },
 {
  "id": 140,
  "mod": 4,
  "fonte": "cert",
  "tp": "Roteamento",
  "ty": "single",
  "text": "Ao criar uma rota estática IPv6, quando devem ser especificados um endereço do próximo salto IPv6 e uma interface?",
  "opts": [
   "quando o próximo salto é um endereço de link local",
   "quando a interface de saída é uma interface ponto a ponto",
   "quando o CEF está habilitado",
   "quando a rota estática é uma rota padrão"
  ],
  "cor": 0,
  "why": "Endereços link-local são únicos apenas no enlace, e o mesmo endereço pode existir em várias interfaces. Por isso, quando uma rota estática usa um endereço link-local como próximo salto, ela precisa indicar também a interface de saída. Isso é uma rota estática totalmente especificada."
 },
 {
  "id": 141,
  "mod": 4,
  "fonte": "cert",
  "tp": "Roteamento",
  "ty": "single",
  "text": "O que caracteriza uma rota estática flutuante?",
  "opts": [
   "Ele fornece balanceamento de carga com outra rota estática para o mesmo destino.",
   "Ele serve como um backup para uma rota aprendida pelo OSPF, desde que seja configurado com uma distância administrativa de 105.",
   "É configurado com uma distância administrativa mais baixa que o roteador principal.",
   "É uma rota menos confiável do que a rota principal."
  ],
  "cor": 3,
  "why": "Rotas estáticas flutuantes servem como caminho de backup para uma rota principal estática ou dinâmica, caso o enlace falhe. Como backup de uma rota OSPF, ela deve ter distância administrativa maior que a do OSPF, que é 110. Aumentar a AD de uma rota estática a torna menos preferível que outra rota estática ou que uma rota aprendida por protocolo dinâmico."
 },
 {
  "id": 142,
  "mod": 4,
  "fonte": "cert",
  "tp": "Roteamento",
  "ty": "single",
  "text": "Considere a seguinte rota estática configurada em um roteador Cisco:\nrota ipv6 2001:db8:acad:4::/64 2001:db8:acad:3::2\nQue rede remota é especificada nesta rota?",
  "opts": [
   "2001:db8:acad:4:: /64",
   "2001:db8:acad:2:: 0/64",
   "2001:db8:acad:0:: /64",
   "2001:db8:acad:3:: /64"
  ],
  "cor": 0,
  "why": "O comando ipv6 route configura uma rota estática IPv6. O primeiro endereço informado é a rede remota e o segundo é o endereço de próximo salto, no roteador vizinho."
 },
 {
  "id": 143,
  "mod": 4,
  "fonte": "cert",
  "tp": "Roteamento",
  "ty": "single",
  "text": "Quando duas ou mais rotas para o mesmo destino são aprendidas a partir de protocolos de roteamento diferentes, o que um roteador usa para escolher entre as rotas?",
  "opts": [
   "custo",
   "administrative distance (distância administrativa)",
   "contagem de saltos",
   "métrica"
  ],
  "cor": 1,
  "why": "Quando um roteador aprende rotas para o mesmo destino por protocolos diferentes, ele usa a distância administrativa (DA) para escolher qual rota instalar na tabela de roteamento. A DA indica o grau de confiabilidade de cada fonte de roteamento — quanto menor o valor, maior a confiança (por exemplo, OSPF tem DA 110, enquanto RIP tem DA 120). A métrica, por sua vez, é usada para comparar rotas dentro de um mesmo protocolo, não entre protocolos distintos."
 },
 {
  "id": 144,
  "mod": 4,
  "fonte": "cert",
  "tp": "OSPF",
  "ty": "single",
  "text": "Em uma rede OSPF quando as eleições de DR e BDR são necessárias?",
  "opts": [
   "quando os dois vizinhos adjacentes estão em duas redes diferentes",
   "quando os roteadores estão interligados através de uma rede Ethernet comum",
   "quando os dois vizinhos adjacentes estão interligados através de um link ponto a ponto",
   "quando todos os roteadores em uma área OSPF não podem formar adjacências"
  ],
  "cor": 1,
  "why": "Quando os roteadores estão interligados por uma rede Ethernet comum, é preciso eleger um roteador designado (DR) e um BDR de backup."
 },
 {
  "id": 145,
  "mod": 4,
  "fonte": "cert",
  "tp": "Roteamento",
  "ty": "match",
  "text": "Considere a figura. Faça a correspondência dos pacotes com o endereço IP destino com as interfaces de saída no roteador.",
  "opts": [
   "Serial0/0/0",
   "FastEthernet1/0",
   "FastEthernet0/0",
   "FastEthernet0/1",
   "FastEthernet1/1"
  ],
  "cor": null,
  "pairs": [
   {
    "l": "pacotes com destino a 172.17.6.15",
    "r": "FastEthernet0/0"
   },
   {
    "l": "pacotes com destino a 172.17.14.8",
    "r": "FastEthernet0/1"
   },
   {
    "l": "pacotes com destino a 172.17.12.10",
    "r": "FastEthernet1/0"
   },
   {
    "l": "pacotes com destino a 172.17.10.5",
    "r": "FastEthernet1/1"
   },
   {
    "l": "pacotes com destino a 172.17.8.20",
    "r": "Serial0/0/0"
   }
  ],
  "why": "Pacotes para 172.17.6.15 saem por Fa0/0; 172.17.10.5 por Fa1/1; 172.17.12.10 por Fa1/0; 172.17.14.8 por Fa0/1. A rede 172.17.8.0 não tem entrada na tabela de roteamento, então usa o gateway de último recurso e sai por Serial0/0/0. Como existe um gateway de último recurso, nenhum pacote é descartado.",
  "fig": "img/cert-q030.webp",
  "figAlt": "Figura da questão 30 do exame de certificação 200-301"
 },
 {
  "id": 146,
  "mod": 4,
  "fonte": "cert",
  "tp": "FHRP",
  "ty": "single",
  "text": "Qual é o propósito de um Protocolo de Redundância de Primeiro Hop?",
  "opts": [
   "para fornecer um link físico para um novo roteador padrão para substituir o gateway padrão inacessível",
   "para fornecer dois ou mais roteadores trabalhando juntos, compartilhando um endereço IP e MAC de um gateway padrão virtual",
   "para fornecer uma lista de endereços IP de dispositivos que podem assumir a função do roteador de encaminhamento",
   "para fornecer um método dinâmico pelo qual os dispositivos em uma LAN podem determinar o endereço de um novo gateway padrão"
  ],
  "cor": 1,
  "why": "Uma forma de evitar ponto único de falha no gateway padrão é usar um roteador virtual. O FHRP faz essa redundância: vários roteadores trabalham juntos para parecer um único roteador para os hosts da LAN. Compartilhando um endereço IP e um endereço MAC, dois ou mais roteadores atuam como um roteador virtual."
 },
 {
  "id": 147,
  "mod": 4,
  "fonte": "cert",
  "tp": "Roteamento",
  "ty": "single",
  "text": "Um engenheiro de rede que examina a configuração de um roteador Cisco vê uma entrada de rede em uma tabela de roteamento listada com um código O. Que tipo de rota é essa?",
  "opts": [
   "uma rota para uma rede diretamente conectada à interface do roteador local",
   "uma rota usada para o gateway padrão",
   "uma rota estática",
   "uma rota aprendida dinamicamente por meio do protocolo de roteamento OSPF"
  ],
  "cor": 3,
  "why": "Uma rota de host é um endereço IPv4 com máscara de 32 bits, ou um IPv6 com máscara de 128 bits. Quando uma interface ativa recebe um endereço IPv4 ou IPv6, uma rota de host local é adicionada automaticamente à tabela e marcada com L. Em rotas estáticas IPv6, o próximo salto pode ser o link-local do vizinho — nesse caso é obrigatório informar o tipo e o número da interface local."
 },
 {
  "id": 148,
  "mod": 4,
  "fonte": "cert",
  "tp": "Roteamento",
  "ty": "single",
  "text": "O que define uma rota de host em um roteador Cisco?",
  "opts": [
   "O endereço de link local é adicionado automaticamente à tabela de roteamento como uma rota de host IPv6.",
   "Uma rota de host IPv6 estático deve incluir o tipo de interface e o número da interface do roteador de salto seguinte.",
   "Uma configuração de rota de host estático IPv4 usa um endereço IP de destino de um dispositivo específico e uma máscara de sub-rede /32.",
   "Uma rota de host é designada com um C na tabela de roteamento."
  ],
  "cor": 2,
  "why": "Best effort é o modelo padrão de encaminhamento de pacotes e não oferece QoS. Serviços diferenciados e serviços integrados são modelos de aplicação de mecanismos de QoS. Classificação e marcação, gerenciamento de congestionamento e prevenção de congestionamento são as três categorias de ferramentas de QoS aplicadas a redes IP."
 },
 {
  "id": 149,
  "mod": 4,
  "fonte": "cert",
  "tp": "FHRP",
  "ty": "single",
  "text": "Na terminologia do FHRP, o que representa um conjunto de roteadores que dão a ilusão de um único roteador para os hosts?",
  "opts": [
   "roteador de encaminhamento",
   "roteador virtual",
   "roteador em standby",
   "gateway padrão"
  ],
  "cor": 1,
  "why": "No FHRP, múltiplos roteadores físicos formam um grupo que se apresenta aos hosts como um único roteador virtual, compartilhando um endereço IP virtual e um endereço MAC virtual. Os hosts configuram esse roteador virtual como gateway padrão e não precisam saber da existência de roteadores redundantes. Se o roteador ativo falhar, o roteador em espera assume a identidade virtual de forma transparente, sem interrupção visível para os hosts."
 },
 {
  "id": 150,
  "mod": 4,
  "fonte": "cert",
  "tp": "Roteamento",
  "ty": "multi",
  "text": "Consulte a figura. Os pacotes que se destinam a duas redes exigem que o roteador execute uma pesquisa recursiva? (Escolha duas.)",
  "opts": [
   "192.168.1.0/24",
   "64.100.0.0/16",
   "10.0.0.0/8",
   "128.107.0.0/16",
   "172.16.40.0/24",
   "192.168.2.0/24"
  ],
  "cor": [
   2,
   5
  ],
  "sub": "Escolha as alternativas corretas",
  "why": "Uma pesquisa recursiva ocorre quando a entrada na tabela de roteamento aponta para um próximo salto especificado por endereço IP (e não por interface diretamente conectada), obrigando o roteador a realizar uma segunda busca na tabela para determinar por qual interface alcançar aquele próximo salto. As redes 10.0.0.0/8 e 192.168.2.0/24 possuem esse tipo de entrada — com endereço IP de próximo salto —, enquanto as demais redes da tabela estão associadas diretamente a interfaces de saída.",
  "fig": "img/cert-q035.webp",
  "figAlt": "Figura da questão 35 do exame de certificação 200-301"
 },
 {
  "id": 151,
  "mod": 4,
  "fonte": "cert",
  "tp": "Roteamento",
  "ty": "single",
  "text": "Um engenheiro de rede está examinando a tabela de roteamento de um roteador Cisco. Considere a seguinte entrada da tabela de roteamento:\nS 10.2.2.0/30 [1/0] via 10.1.1.2, 00:00:13, Serial0/0/0\n\nQual é o significado do Serial0/0/0?",
  "opts": [
   "É a interface no roteador de próximo salto que está diretamente conectada à rede 10.2.2.0/30.",
   "É a interface que o R4 usa para enviar dados destinados a 10.2.2.0/30.",
   "É a interface no roteador do próximo salto que está diretamente conectada à rede 10.1.1.0/24.",
   "É a interface R4 através da qual a atualização OSPF foi aprendida."
  ],
  "cor": 1,
  "why": "Uma rota estática aparece na tabela de roteamento com S no início da entrada. Se a rota foi inserida como rota estática IPv4 diretamente conectada, a entrada mostra a rede remota e, ao final, a interface que o roteador usa para enviar dados àquele destino."
 },
 {
  "id": 152,
  "mod": 4,
  "fonte": "cert",
  "tp": "Roteamento",
  "ty": "single",
  "text": "A tabela de roteamento de um roteador Cisco tem quatro rotas estáticas para a rede 10.0.0.0. Qual rota é a melhor correspondência para um pacote que entra no roteador com um destino de 10.16.0.10?",
  "opts": [
   "S 10.16.0.0/16 está diretamente conectado, GigabitEthernet 0/0",
   "S 10.0.0.0/16 está diretamente conectado, GigabitEthernet 0/1",
   "S 10.16.0.0/24 [1/0] via 202.16.0.2",
   "S 10.0.0.0/8 [1/0] via 202.16.0.2"
  ],
  "cor": 2,
  "why": "Quando o roteador tem várias opções de rota para um destino, escolhe a de maior correspondência (longest match). 10.16.0.0/24 tem mais bits iguais ao pacote roteado do que a entrada /8 ou as duas entradas /16."
 },
 {
  "id": 153,
  "mod": 4,
  "fonte": "cert",
  "tp": "DHCPv4",
  "ty": "single",
  "text": "Um engenheiro de rede está configurando um roteador Cisco como um reencaminhamento DHCP. Ao emitir o comando ip helper-address no modo de configuração da interface qual endereço IPv4 é adicionado ao comando?",
  "opts": [
   "Endereço do cliente DHCPv4",
   "Endereço de gateway padrão do cliente DHCPv4",
   "Endereço do servidor DHCPv4",
   "Endereço de sub-rede DHCPv4"
  ],
  "cor": 2,
  "why": "O endereço IPv4 do servidor DHCPv4 remoto é usado no comando ip helper-address, na configuração da interface do roteador."
 },
 {
  "id": 154,
  "mod": 4,
  "fonte": "cert",
  "tp": "DHCPv4",
  "ty": "single",
  "text": "Um engenheiro de rede está examinando a configuração de um roteador e percebe que a interface Gi0/0 foi configurada com o comando ip address dhcp . Qual instrução descreve a condição de endereço IP desta interface?",
  "opts": [
   "A interface usará um endereço IPv6 em vez de um endereço IPv4.",
   "Nenhum endereço IP é necessário para que esta interface funcione.",
   "O roteador está configurado como um servidor DHCPv4.",
   "A interface do roteador é configurada como um cliente DHCPv4."
  ],
  "cor": 3,
  "why": "Configurar o comando ip address dhcp em uma interface de roteador Cisco faz com que ela funcione como cliente DHCPv4, solicitando um endereço IPv4 ao roteador de uplink ou ao provedor de serviços."
 },
 {
  "id": 155,
  "mod": 4,
  "fonte": "cert",
  "tp": "Gerência",
  "ty": "single",
  "text": "Um engenheiro de rede está usando o software gerenciador SNMP para monitorar e gerenciar o desempenho da rede. Além de sondar dispositivos de rede em intervalos de tempo regulares, o engenheiro está configurando os dispositivos para gerar mensagens que informam o gerenciador SNMP sobre eventos especificados. Que tipo de mensagem está configurado nos dispositivos que lhes permite enviar mensagens não solicitadas?",
  "opts": [
   "get-bulk-request",
   "get-response",
   "trap",
   "solicitação set"
  ],
  "cor": 2,
  "why": "O dispositivo de rede guarda as informações do SNMP na MIB. Essas informações podem ser enviadas ao gerente SNMP quando solicitadas por uma mensagem get. Mensagens não solicitadas, enviadas quando ocorrem eventos pré-configurados, são as traps."
 },
 {
  "id": 156,
  "mod": 4,
  "fonte": "cert",
  "tp": "QoS",
  "ty": "single",
  "text": "Qual é um modelo de QoS que um engenheiro de rede implementaria para garantir um padrão de qualidade de serviço de origem para destino para um fluxo de dados especificado?",
  "opts": [
   "enfileiramento de baixa latência",
   "serviços diferenciados",
   "melhor esforço",
   "serviços integrados",
   "enfileiramento justo ponderado baseado em classe"
  ],
  "cor": 3,
  "why": "O modelo IntServ (Serviços Integrados) é o único que oferece garantias de QoS fim a fim para fluxos de dados individuais, reservando recursos em cada nó ao longo do caminho por meio do protocolo RSVP. Essa reserva explícita garante largura de banda, latência e jitter desde a origem até o destino para aquele fluxo específico. O DiffServ classifica tráfego em classes, mas não realiza reservas por fluxo; o melhor esforço simplesmente não garante nada."
 },
 {
  "id": 157,
  "mod": 4,
  "fonte": "cert",
  "tp": "Gerência",
  "ty": "single",
  "text": "Um engenheiro de rede deseja sincronizar a hora de um roteador com um servidor NTP no endereço IPv4 209.165.200.225.A interface de saída do roteador é configurada com um endereço IPv4 de 192.168.212.11. Qual comando de configuração global deve ser usado para configurar o servidor NTP como a fonte de tempo para este roteador?",
  "opts": [
   "ntp server 209.165.200.225",
   "peer ntp 192.168.212.11",
   "servidor ntp 192.168.212.11",
   "ponto ntp 209.165.200.225"
  ],
  "cor": 0,
  "why": "O comando de configuração global ntp server <endereço-ip> define o servidor daquele endereço como fonte de hora do roteador. O comando ntp peer, que permite ao roteador tanto atualizar quanto sincronizar com outro roteador configurado de forma semelhante, não é o adequado nesse caso."
 },
 {
  "id": 158,
  "mod": 4,
  "fonte": "cert",
  "tp": "Segurança",
  "ty": "single",
  "text": "Qual protocolo define a autenticação baseada em porta para restringir os hosts não autorizados na conexão à LAN por portas de switch acessíveis publicamente?",
  "opts": [
   "TACACS+",
   "802.1x",
   "RADIUS",
   "SSH"
  ],
  "cor": 1,
  "why": "O 802.1x é um padrão IEEE que define controle de acesso baseado em porta. Ao autenticar cada cliente que tenta se conectar à LAN, o 802.1x protege a rede contra clientes não autorizados."
 },
 {
  "id": 159,
  "mod": 4,
  "fonte": "cert",
  "tp": "WLAN",
  "ty": "single",
  "text": "Um engenheiro de rede sem fio está implementando equipamentos sem fio atualizados dentro da empresa. Qual declaração descreve um protocolo de segurança sem fio?",
  "opts": [
   "O WPA3-Personal usa autenticação 802.1X/EAP que requer o uso de um pacote criptográfico de 192 bits.",
   "O WPA protege os dados usando o método de criptografia Rivest Cipher 4 com uma chave estática.",
   "O WPA2-Pessoal destina-se a redes domésticas ou de pequenas empresas e utiliza autenticação 802.1X/EAP.",
   "WPA2-Enterprise é destinado a redes corporativas e os usuários devem se autenticar usando o padrão 802.1X."
  ],
  "cor": 3,
  "why": "O WPA2-Personal é indicado para redes domésticas ou de pequeno escritório, com autenticação por chave pré-compartilhada. O WPA2-Enterprise é destinado a redes corporativas, com autenticação pelo padrão 802.1X. O WPA protege os dados com o algoritmo TKIP. O WPA3-Enterprise usa autenticação 802.1X/EAP, exige um conjunto criptográfico de 192 bits e elimina a mistura de protocolos de segurança dos padrões 802.11 anteriores."
 },
 {
  "id": 160,
  "mod": 4,
  "fonte": "cert",
  "tp": "ACLs",
  "ty": "single",
  "text": "Consulte a figura. Qual configuração de lista de acesso no roteador R1 impedirá que o tráfego da LAN 192.168.2.0 atinja a LAN restrita enquanto permite o tráfego de qualquer outra LAN?",
  "opts": [
   "R1(config-std-nacl)# deny 192.168.2.0\nR1(config-std-nacl)# permit any\nR1(config)# interface G0/2\nR1(config-if)# ip access-group BLOCK_LAN2 out",
   "R1(config-std-nacl)# permit any\nR1(config-std-nacl)# deny 192.168.2.0\nR1(config)# interface G0/2\nR1(config-if)# ip access-group BLOCK_LAN2 out",
   "R1(config-std-nacl)# permit any\nR1(config-std-nacl)# deny 192.168.3.0\nR1(config)# interface G0/2\nR1(config-if)# ip access-group BLOCK-LAN2 in",
   "R1(config-std-nacl)# deny 192.168.3.0\nR1(config-std-nacl)# permit any\nR1(config)# interface G0/2\nR1(config-if)# ip access-group BLOCK_LAN2 in"
  ],
  "cor": 0,
  "why": "A sintaxe correta da ACL exige que a instrução deny do IP de origem (192.168.2.0) venha antes do permit, de modo que só o tráfego originado na LAN 192.168.2.0 seja negado. Depois a ACL deve ser aplicada na interface G0/2, na direção de saída.",
  "fig": "img/cert-q045.webp",
  "figAlt": "Figura da questão 45 do exame de certificação 200-301"
 },
 {
  "id": 161,
  "mod": 4,
  "fonte": "cert",
  "tp": "ACLs",
  "ty": "single",
  "text": "Consulte a figura. Um administrador de rede precisa adicionar uma ACE à ACL TRAFFIC-CONTROL, que negará o tráfego de IP da sub-rede 172.23.16.0/20. Qual será a ACE responsável por cumprir esta exigência?",
  "opts": [
   "30 deny 172.23.16.0 0.0.15.255",
   "5 deny 172.23.16.0 0.0.255.255",
   "15 deny 172.23.16.0 0.0.15.255",
   "5 deny 172.23.16.0 0.0.15.255"
  ],
  "cor": 3,
  "why": "O único critério de filtragem de uma ACL padrão é o endereço IPv4 de origem. A máscara curinga é escrita com bit 0 para as partes do endereço que devem coincidir e bit 1 para as que devem ser ignoradas. O roteador avalia as ACEs do menor para o maior número de sequência. Se for preciso inserir uma ACE em uma ACL existente, deve-se informar o número de sequência para que ela fique na posição correta durante a avaliação.",
  "fig": "img/cert-q046.webp",
  "figAlt": "Figura da questão 46 do exame de certificação 200-301"
 },
 {
  "id": 162,
  "mod": 4,
  "fonte": "cert",
  "tp": "ACLs",
  "ty": "single",
  "text": "Qual é a ACE que permitirá tráfego de hosts exclusivamente na sub-rede 192.168.8.0/22?",
  "opts": [
   "permit 192.168.8.0 0.0.7.255",
   "permit 192.168.0.0 0.0.15.255",
   "permit 192.168.8.0 255.255.248.0",
   "permit 192.168.8.0 0.0.3.255"
  ],
  "cor": 3,
  "why": "O único critério de filtragem de uma ACL padrão é o endereço IPv4 de origem. A máscara curinga é escrita com bit 0 para as partes do endereço que devem coincidir e bit 1 para as que devem ser ignoradas."
 },
 {
  "id": 163,
  "mod": 4,
  "fonte": "cert",
  "tp": "Segurança",
  "ty": "single",
  "text": "Um funcionário que viaja constantemente para trabalhar precisa acessar a rede da empresa remotamente. Qual mecanismo de segurança oferece uma conexão segura?",
  "opts": [
   "lista de controle de acesso",
   "sistema de prevenção de intrusão (IPS)",
   "rede virtual privada",
   "sistema de firewall dedicado"
  ],
  "cor": 2,
  "why": "Uma VPN (Rede Virtual Privada) cria um túnel criptografado sobre a internet pública, permitindo que o funcionário remoto acesse a rede corporativa como se estivesse fisicamente conectado a ela. A VPN garante confidencialidade, autenticidade e integridade dos dados transmitidos, protegendo contra interceptação em redes não confiáveis. ACLs, IPS e firewalls são mecanismos de controle de acesso ou detecção, mas não fornecem conectividade remota segura por si sós."
 },
 {
  "id": 164,
  "mod": 4,
  "fonte": "cert",
  "tp": "Segurança",
  "ty": "single",
  "text": "Um funcionário está fazendo login em uma conta da empresa e outro funcionário está de tal forma para ver o ID da conta e a senha. Que tipo de ameaça é essa?",
  "opts": [
   "interceptação e roubo de dados",
   "spyware",
   "roubo de identidade",
   "adware"
  ],
  "cor": 2,
  "why": "Spyware e adware: softwares instalados no dispositivo do usuário que coletam informações sobre ele às escondidas. Interceptação e roubo de dados: capturam informações privadas da rede de uma organização. Roubo de identidade: apodera-se das credenciais de login de um usuário para acessar dados privados."
 },
 {
  "id": 165,
  "mod": 4,
  "fonte": "cert",
  "tp": "Segurança",
  "ty": "single",
  "text": "Consulte a figura. Qual interface no switch S1 precisa ser configurada como uma porta confiável de snooping de DHCP para ajudar a mitigar ataques de spoofing de DHCP?",
  "opts": [
   "G0/22",
   "G0/24",
   "G0/1",
   "G0/23"
  ],
  "cor": 3,
  "why": "Com o DHCP snooping configurado, a interface ligada ao servidor DHCP é definida como porta confiável. Portas confiáveis podem originar solicitações e confirmações DHCP. Todas as portas não marcadas como confiáveis são consideradas não confiáveis pelo switch e só podem originar solicitações DHCP.",
  "fig": "img/cert-q050.webp",
  "figAlt": "Figura da questão 50 do exame de certificação 200-301"
 },
 {
  "id": 166,
  "mod": 4,
  "fonte": "cert",
  "tp": "SDN/Cloud",
  "ty": "single",
  "text": "Qual função do sistema de rede baseado em intenção da Cisco (IBNS) permite que os operadores de rede expressem o comportamento esperado de rede que melhor dará suporte à intenção de negócios?",
  "opts": [
   "tradução",
   "ativação",
   "garantia",
   "Análise de ACL"
  ],
  "cor": 0,
  "why": "O recurso de tradução do Cisco IBNS permite que os operadores de rede expressem o comportamento esperado da rede — aquele que melhor atende ao objetivo do negócio."
 },
 {
  "id": 167,
  "mod": 4,
  "fonte": "cert",
  "tp": "Automação",
  "ty": "single",
  "text": "O que é uma característica da API REST?",
  "opts": [
   "evoluiu para o que se tornou SOAP",
   "API mais usada para serviços da web",
   "usado para trocar informações estruturadas XML sobre HTTP ou SMTP",
   "considerado lento, complexo e rígido"
  ],
  "cor": 1,
  "why": "O REST responde por mais de 80% de todos os tipos de API usados em serviços web, o que o torna a API de serviço web mais utilizada."
 },
 {
  "id": 168,
  "mod": 4,
  "fonte": "cert",
  "tp": "Automação",
  "ty": "single",
  "text": "Consulte a figura. O que o símbolo de hífen (–) indica na estrutura de dados YAML?",
  "opts": [
   "um único par de chave/valor",
   "um elemento em uma matriz",
   "uma string sendo usada tanto para a chave quanto para o valor",
   "um par chave/valor que representa um endereço IP"
  ],
  "cor": 1,
  "why": "Na sintaxe YAML, os pares chave-valor são separados por dois-pontos, sem uso de aspas, e um hífen separa cada elemento de uma lista ou matriz.",
  "fig": "img/cert-q053.webp",
  "figAlt": "Figura da questão 53 do exame de certificação 200-301"
 },
 {
  "id": 169,
  "mod": 4,
  "fonte": "cert",
  "tp": "Automação",
  "ty": "single",
  "text": "Um usuário está lendo um livro do site https://www.books-info.com/author50/book1.html#page150. Qual termo é usado para descrever o componente www.books-info.com/author50/book1.html?",
  "opts": [
   "URL",
   "fragmento",
   "URN",
   "URI",
   "protocolo"
  ],
  "cor": 2,
  "why": "Ansible e SaltStack são ferramentas de gerenciamento de configuração desenvolvidas em Python. Chef e Puppet são desenvolvidas em Ruby. Ruby costuma ser considerada mais difícil de aprender que Python. O NETCONF é um protocolo de gerenciamento de rede."
 },
 {
  "id": 170,
  "mod": 4,
  "fonte": "cert",
  "tp": "Automação",
  "ty": "single",
  "text": "Consulte a figura. Na representação de dados JSON exibida, qual símbolo deve ser usado para substituir o ponto de interrogação nas linhas 2 e 15?",
  "opts": [
   "chaves {}",
   "colchetes [ ]",
   "vírgulas ,",
   "aspas duplas \" \""
  ],
  "cor": 1,
  "why": "Na sintaxe JSON, os colchetes [ ] delimitam uma matriz (array).",
  "fig": "img/cert-q055.webp",
  "figAlt": "Figura da questão 55 do exame de certificação 200-301"
 },
 {
  "id": 171,
  "mod": 4,
  "fonte": "cert",
  "tp": "Automação",
  "ty": "single",
  "text": "Qual é uma restrição de arquitetura à qual um verdadeiro serviço da web RESTful API deve aderir?",
  "opts": [
   "É executado como modelo de cliente / servidor.",
   "Opera como um serviço de nuvem.",
   "Ele usa HTTPS para transportar dados.",
   "Ele deve suportar o formato de dados XML."
  ],
  "cor": 0,
  "why": "O Ansible usa o nome Playbook para descrever o conjunto de instruções a ser executado."
 },
 {
  "id": 172,
  "mod": 4,
  "fonte": "cert",
  "tp": "Tabela MAC",
  "ty": "single",
  "text": "Que ação ocorre quando o endereço MAC de origem de um quadro que entra em um switch está na tabela de endereços MAC?",
  "opts": [
   "O switch encaminha o quadro para fora da porta especificada.",
   "O switch substitui a entrada antiga e usa a porta mais atual.",
   "O switch atualiza o temporizador de atualização para a entrada.",
   "O switch adiciona uma entrada de tabela de endereços MAC para o endereço MAC de destino e a porta de saída."
  ],
  "cor": 2,
  "why": "Se o endereço MAC de destino for de broadcast ou multicast, o quadro também é inundado por todas as portas, exceto a de origem."
 },
 {
  "id": 173,
  "mod": 4,
  "fonte": "cert",
  "tp": "Segurança",
  "ty": "single",
  "text": "Qual ataque de LAN permite que o tráfego de uma VLAN seja visto por outra VLAN sem a ajuda de um roteador?",
  "opts": [
   "Ataque de salto de VLAN",
   "Ataque DHCP spoofing",
   "Ataques ARP",
   "Ataque de privação do DHCP"
  ],
  "cor": 0,
  "why": "O ataque de salto de VLAN (VLAN hopping) explora a sinalização de tronco 802.1Q para fazer o tráfego de uma VLAN alcançar outra VLAN sem passar por um roteador. As duas técnicas mais comuns são o switch spoofing — em que o atacante negocia um tronco com o switch — e o double tagging — em que dois cabeçalhos 802.1Q são inseridos no quadro para enganar o switch. Isso viola o isolamento de camada 2 que as VLANs foram projetadas para fornecer."
 },
 {
  "id": 174,
  "mod": 4,
  "fonte": "cert",
  "tp": "Roteamento",
  "ty": "single",
  "text": "Que característica completa a seguinte afirmação?\nQuando uma rota estática IPv6 é configurada, o uso de um endereço de link local como um endereço de próximo salto requer a inserção...",
  "opts": [
   "o tipo e o número da interface.",
   "uma distância administrativa de 2.",
   "o comando \"show ipv6 route static\".",
   "uma rota de host de destino com um prefixo /128."
  ],
  "cor": 0,
  "why": "Endereços de link local (FE80::/10) têm escopo restrito ao enlace e podem existir em várias interfaces do mesmo roteador com o mesmo valor. Por isso, ao configurar uma rota estática IPv6 com um endereço de link local como próximo salto, o roteador não consegue determinar sozinho por qual interface enviar o pacote. É obrigatório informar o tipo e o número da interface de saída (por exemplo, GigabitEthernet 0/0) junto ao endereço de próximo salto para que a rota funcione corretamente."
 },
 {
  "id": 175,
  "mod": 4,
  "fonte": "cert",
  "tp": "QoS",
  "ty": "single",
  "text": "Qual termo descreve permitir que pacotes sensíveis a atrasos, como voz, sejam enviados antes de pacotes em outras filas com base em enfileiramento de prioridade estrita (PQ)?",
  "opts": [
   "class-based weighted fair queuing (CBWFQ)",
   "atraso de playout",
   "low latency queuing (LLQ)",
   "queda cauda",
   "weighted fair queuing (WFQ)"
  ],
  "cor": 2,
  "why": "O LLQ (Low Latency Queuing) combina a prioridade estrita com o CBWFQ, criando uma fila de prioridade absoluta destinada ao tráfego sensível a atraso, como voz e vídeo. Pacotes nessa fila são sempre atendidos antes das demais filas, independentemente de outras classes, minimizando latência e jitter. O CBWFQ garante largura de banda mínima por classe, mas sem prioridade absoluta; o WFQ distribui a largura de banda de forma proporcional, sem garantias de baixa latência."
 },
 {
  "id": 176,
  "mod": 4,
  "fonte": "cert",
  "tp": "Switching",
  "ty": "single",
  "text": "Um técnico está solucionando problemas de um dispositivo de rede e suspeita que pode haver uma incompatibilidade duplex. O que poderia causar uma incompatibilidade duplex?",
  "opts": [
   "configuração incorreta da interface",
   "Falha de detecção automática do MDIX",
   "interconexão de dispositivos diferentes",
   "Corrupção de dados"
  ],
  "cor": 0,
  "why": "Uma incompatibilidade duplex acontece quando um lado da conexão está em full-duplex e o outro em half-duplex. A causa típica é configuração manual errada da interface — velocidade ou duplex fixados em um lado e autonegociação no outro. Em casos raros pode ser falha de autonegociação. O sintoma engana porque a comunicação continua funcionando, só com lentidão, colisões e erros de CRC."
 },
 {
  "id": 177,
  "mod": 4,
  "fonte": "cert",
  "tp": "Roteamento",
  "ty": "single",
  "text": "Um administrador de redes está projetando um esquema de endereçamento IPv4 e exige essas sub-redes.\nUma sub-rede de 100 hosts\nDuas sub-redes de 80 hosts\nDuas sub-redes de 30 hosts\nQuatro sub-redes de 20 hosts\nQual combinação de sub-redes e máscaras fornecerá o plano de endereçamento recomendado para essas exigências?",
  "opts": [
   "Nove sub-redes de 126 hosts com uma máscara 255.255.255.128\nUma sub-rede de 126 hosts com uma máscara 255.255.255.192",
   "Duas sub-redes de 80 hosts com uma máscara 255.255.255.224\nSeis sub-redes de 30 hosts com uma máscara 255.255.255.240",
   "Três sub-redes de 126 hosts com uma máscara 255.255.255.128\nSeis sub-redes de 30 hosts com uma máscara 255.255.255.224",
   "Três sub-redes de 126 hosts com uma máscara 255.255.255.192\nSeis sub-redes de 30 hosts com uma máscara 255.255.255.240"
  ],
  "cor": 2,
  "why": "O critério é agrupar por capacidade, não por quantidade pedida. 100 hosts exige 7 bits de host: 2^7 = 128, menos 2 = 126 utilizáveis, máscara /25 (255.255.255.128). As duas redes de 80 também cabem em /25, somando 3 sub-redes de 126. Já 30 hosts exige 5 bits de host: 2^5 = 32, menos 2 = 30 utilizáveis, máscara /27 (255.255.255.224). As quatro redes de 20 cabem em /27, somando 6 sub-redes de 30. Total: 3 redes /25 mais 6 redes /27."
 },
 {
  "id": 178,
  "mod": 4,
  "fonte": "cert",
  "tp": "SDN/Cloud",
  "ty": "single",
  "text": "Uma empresa farmacêutica deseja contratar os serviços de um provedor de nuvem para armazenar dados de funcionários e aplicativos específicos da empresa com segurança de acesso rigorosa. Qual tipo de nuvem seria o mais apropriado para esse cenário?",
  "opts": [
   "nuvem pública",
   "nuvem híbrida",
   "nuvem comunitária",
   "nuvem privada"
  ],
  "cor": 3,
  "why": "A nuvem privada é destinada a uma organização ou entidade específica, como o governo. Pode ser montada na rede privada da própria empresa — embora seja cara de construir e manter — ou gerenciada por uma organização externa com segurança de acesso rigorosa. Nuvem pública é compartilhada; híbrida combina as duas; comunitária é dividida entre organizações com interesses comuns."
 },
 {
  "id": 179,
  "mod": 4,
  "fonte": "cert",
  "tp": "Switching",
  "ty": "single",
  "text": "Um administrador de rede está considerando se os recursos PoE são necessários em uma instalação de rede específica. Qual opção fornece informações válidas sobre PoE?",
  "opts": [
   "Qualquer porta de switch pode ser configurada com comandos IOS para funcionar como uma porta PoE.",
   "PoE permite que o switch forneça energia a um dispositivo através da rede elétrica existente.",
   "O recurso de passagem PoE é suportado somente pelo modelo de switch compacto Cisco Catalyst 3560-C Series ou superior.",
   "Ele pode ser usado por telefones IP, permitindo que eles sejam instalados em qualquer lugar onde haja um cabo Ethernet."
  ],
  "cor": 3,
  "why": "O PoE entrega energia ao dispositivo pelo próprio cabo Ethernet, não pela rede elétrica. Isso permite instalar telefones IP e pontos de acesso sem fio em qualquer lugar onde haja um cabo de rede, sem precisar de tomada. Só portas específicas do switch suportam PoE — não qualquer porta por comando IOS. O pass-through PoE é suportado pelos compactos Catalyst 2960-C e 3560-C."
 },
 {
  "id": 180,
  "mod": 4,
  "fonte": "cert",
  "tp": "Arquitetura",
  "ty": "multi",
  "text": "Os dados estão sendo enviados de um PC de origem para um servidor de destino. Quais são as três afirmativas que descrevem corretamente a função TCP ou UDP nessa situação? (Escolha três.)",
  "opts": [
   "O processo do TCP em execução no PC seleciona aleatoriamente a porta de destino ao estabelecer uma sessão com o servidor.",
   "O número da porta de origem do TCP identifica o host de envio da rede.",
   "O campo de porta de origem identifica o aplicativo ou serviço atual responsável por manusear os dados que retornam para o PC.",
   "O TCP é o protocolo que deve ser usado quando uma função exigir a diminuição dos custos da rede.",
   "O número de porta de destino do UDP identifica o aplicativo ou o serviço do servidor responsável por manusear os dados.",
   "Os segmentos UDP são encapsulados em pacotes IP para que possam ser transportados pela Internet."
  ],
  "cor": [
   2,
   4,
   5
  ],
  "sub": "Escolha as alternativas corretas",
  "why": "As portas de camada 4 identificam o aplicativo ou serviço que vai tratar os dados. A porta de origem é escolhida pelo dispositivo que envia e será a porta de destino quando a resposta voltar. Os segmentos da camada 4 são encapsulados em pacotes IP. Quem identifica o host é o endereço IP, não a porta. A porta de destino é definida pelo serviço procurado, não sorteada. E é o UDP, não o TCP, que serve quando se quer menor sobrecarga."
 },
 {
  "id": 181,
  "mod": 4,
  "fonte": "cert",
  "tp": "WLAN",
  "ty": "single",
  "text": "Qual recurso ou função um AP fornece em uma LAN sem fio?",
  "opts": [
   "Um AP é mais fácil de configurar e configurar do que os extensores de alcance Wi-Fi.",
   "Um dispositivo sem fio deve ser associado a um AP para ter acesso a recursos de rede.",
   "Um cliente sem fio pode se conectar a mais de um ponto de acesso por vez.",
   "Cada AP anuncia um ou mais SSIDs e um usuário pode optar por se conectar ao SSID mais próximo."
  ],
  "cor": 1,
  "why": "O cliente sem fio usa a placa de rede para descobrir APs próximos que anunciam SSID; em seguida tenta se associar e se autenticar. Só depois de associado é que ele acessa os recursos da rede. Extensores de alcance são fáceis de configurar, mas o AP dedicado é a solução melhor. Um cliente não se conecta a mais de um AP ao mesmo tempo, e o SSID não indica proximidade física."
 },
 {
  "id": 182,
  "mod": 4,
  "fonte": "cert",
  "tp": "Arquitetura",
  "ty": "single",
  "text": "Um engenheiro de rede está projetando uma rede comutada sem fronteiras de forma hierárquica. Que diretriz pode fazer com que o engenheiro implemente um modelo de camada de três camadas?",
  "opts": [
   "A camada de acesso fornece agregação de domínios de difusão da Camada 2.",
   "O isolamento de falhas é um dos objetivos principais da camada de distribuição.",
   "A camada principal fornece serviços diferenciados para várias classes de aplicativos de serviço na borda da rede.",
   "Os switches L2 da camada de acesso se conectam aos switches L3 da camada de distribuição, que implementam roteamento, qualidade de serviço e segurança."
  ],
  "cor": 3,
  "why": "A camada de acesso é a borda da rede, onde o tráfego entra e sai. Os switches de acesso se conectam aos switches da camada de distribuição, e são estes que implementam as tecnologias de base da rede: roteamento, qualidade de serviço e segurança. Por isso a separação entre acesso L2 e distribuição L3 justifica o modelo de três camadas."
 },
 {
  "id": 183,
  "mod": 4,
  "fonte": "cert",
  "tp": "WLAN",
  "ty": "multi",
  "text": "Em uma rede sem fio baseada em controlador, um dispositivo Cisco WLC tem quatro portas conectadas a um switch para formar um pacote. Este pacote fornece balanceamento de carga e redundância. Quais duas configurações devem ser executadas nas quatro portas de switch que se conectam ao WLC? (Escolha duas.)",
  "opts": [
   "VLAN nativa",
   "EtherChannel",
   "modo de entroncamento",
   "VLAN padrão",
   "LACP"
  ],
  "cor": [
   1,
   2
  ],
  "sub": "Escolha as alternativas corretas",
  "why": "Todas as portas do switch ligadas ao WLC precisam estar em modo trunk e agrupadas com EtherChannel. O trunk carrega as várias VLANs das WLANs e o EtherChannel forma o enlace lógico único que dá balanceamento de carga e redundância. O WLC não suporta PAgP nem LACP para esse agrupamento — ele usa LAG."
 },
 {
  "id": 184,
  "mod": 4,
  "fonte": "cert",
  "tp": "WLAN",
  "ty": "single",
  "text": "Um administrador de rede está configurando uma WLAN com WPA2 Enterprise em uma WLC Cisco 3500 Series. As autenticações de cliente serão tratadas por um servidor RADIUS. Qual guia o administrador deve usar para adicionar as informações do servidor RADIUS?",
  "opts": [
   "SEGURANÇA",
   "GERENCIAMENTO",
   "WLANs",
   "SEM FIO"
  ],
  "cor": 0,
  "why": "Na WLC, o servidor RADIUS fica na guia SEGURANÇA: SECURITY > RADIUS > Authentication, e depois em New... para cadastrar o servidor. A guia GERENCIAMENTO é usada para SNMP e trap receivers; WLANs define as redes sem fio; SEM FIO trata de rádio, antenas e canais."
 },
 {
  "id": 185,
  "mod": 4,
  "fonte": "cert",
  "tp": "VLANs",
  "ty": "single",
  "text": "Um administrador emite o comando show vlan brief em um switch Cisco e a saída mostra que todas as portas estão atribuídas atualmente à VLAN padrão. O que se pode concluir?",
  "opts": [
   "Todo o tráfego de dados do usuário será separado e protegido de outros usuários.",
   "O switch não pode ser gerenciado remotamente usando Telnet ou SSH até que uma VLAN de gerenciamento seja criada.",
   "O tráfego de controle da camada 2 não está associado a nenhuma VLAN.",
   "Há um risco de segurança porque a VLAN de gerenciamento e a VLAN nativa são as mesmas."
  ],
  "cor": 3,
  "why": "Se todas as portas estão na VLAN 1 (padrão), nenhuma VLAN nativa foi atribuída explicitamente e não há outras VLANs ativas. Logo, a VLAN nativa acabou sendo a mesma da VLAN de gerenciamento — o que é considerado risco de segurança. Por padrão, todo o tráfego de controle da camada 2 já está associado à VLAN 1."
 },
 {
  "id": 186,
  "mod": 4,
  "fonte": "cert",
  "tp": "VLANs",
  "ty": "single",
  "text": "Qual é a finalidade de se configurar a VLAN nativa separada das VLANs de dados?",
  "opts": [
   "A segurança dos quadros de gerenciamento transportados na VLAN nativa pode ser aumentada.",
   "A VLAN nativa serve somente para transportar o tráfego de gerenciamento da VLAN.",
   "A VLAN nativa serve para os roteadores e switches trocarem suas informações de gerenciamento, por isso ela deve ser diferente das VLANs de dados.",
   "Uma VLAN separada deve ser utilizada para transportar quadros não marcados de maneira a evitar a contenção da largura de banda nas VLANs de dados."
  ],
  "cor": 3,
  "why": "Quando uma porta trunk recebe quadros sem marcação (incomum em redes bem projetadas), ela os encaminha para a VLAN nativa. Movendo a VLAN nativa para fora das VLANs de dados, esses quadros não marcados não disputam largura de banda com o tráfego de dados. A VLAN nativa não foi criada para transportar tráfego de gerenciamento — ela existe por compatibilidade com cenários de LAN legados."
 },
 {
  "id": 187,
  "mod": 4,
  "fonte": "cert",
  "tp": "Roteamento",
  "ty": "single",
  "text": "Qual atributo em um roteador Cisco permite o encaminhamento de tráfego para o qual não haja rota específica?",
  "opts": [
   "O gateway do último recurso",
   "interface de saída",
   "origem da rota",
   "endereços do próximo salto"
  ],
  "cor": 0,
  "why": "Uma rota estática padrão funciona como gateway de último recurso: encaminha o tráfego de destino desconhecido para um próximo salto ou interface de saída. As outras opções são apenas campos da tabela de roteamento — o próximo salto e a interface de saída dizem para onde mandar o pacote já roteado, e a origem da rota indica de onde a rota foi aprendida."
 },
 {
  "id": 188,
  "mod": 4,
  "fonte": "cert",
  "tp": "FHRP",
  "ty": "match",
  "text": "Combine os protocolos FHRP com a descrição apropriada.",
  "pairs": [
   {
    "l": "VRRP",
    "r": "um FHRP de padrão aberto que fornece redundância com o uso de roteadores mestres virtuais e um ou mais backups"
   },
   {
    "l": "HSRP",
    "r": "FHRP proprietário da Cisco que fornece redundância através do uso de um dispositivo ativo e dispositivo em espera"
   },
   {
    "l": "GLBP",
    "r": "FHRP proprietário da Cisco que fornece compartilhamento de carga, além de redundância"
   }
  ],
  "why": "VRRP é padrão aberto (RFC) e usa o conceito de roteador mestre com backups. HSRP é proprietário da Cisco e trabalha com um roteador ativo e um em espera (standby). GLBP também é da Cisco, mas vai além da redundância: distribui o tráfego entre vários roteadores, fazendo balanceamento de carga."
 },
 {
  "id": 189,
  "mod": 4,
  "fonte": "cert",
  "tp": "OSPF",
  "ty": "single",
  "text": "Qual é a prática recomendada da Cisco para configurar um roteador habilitado para OSPF para que cada roteador possa ser facilmente identificado ao solucionar problemas de roteamento?",
  "opts": [
   "Use o endereço IP mais alto atribuído a uma interface ativa que participa do processo de roteamento.",
   "Use o endereço IP de interface ativa mais alto configurado no roteador.",
   "Configure um valor usando o comando router-id.",
   "Use uma interface de loopback configurada com o endereço IP mais alto no roteador."
  ],
  "cor": 2,
  "why": "O router ID identifica unicamente o roteador no domínio OSPF. Ele pode ser atribuído automaticamente (IP mais alto de uma interface, ou de uma loopback) ou definido manualmente com o comando router-id. A Cisco recomenda o router-id explícito porque ele não muda quando uma interface cai — o que facilita a identificação durante o troubleshooting."
 },
 {
  "id": 190,
  "mod": 4,
  "fonte": "cert",
  "tp": "Roteamento",
  "ty": "single",
  "text": "Um engenheiro de rede foi solicitado a preparar um roteador e garantir que ele possa rotear pacotes IPv6. Qual comando o engenheiro de rede deve garantir que foi inserido no roteador?",
  "opts": [
   "rota ipv6",
   "ipv6 enable",
   "ipv6 address",
   "roteamento unicast-ipv6"
  ],
  "cor": 3,
  "why": "O comando ipv6 unicast-routing habilita o roteamento IPv6 no roteador. Sem ele, o equipamento tem endereços IPv6 nas interfaces mas não encaminha pacotes entre redes. O ipv6 enable ativa IPv6 numa interface; o ipv6 address atribui endereço; o ipv6 route cria rota estática — nenhum deles liga o roteamento globalmente."
 },
 {
  "id": 191,
  "mod": 4,
  "fonte": "cert",
  "tp": "Gerência",
  "ty": "single",
  "text": "Um engenheiro de rede está configurando um switch Cisco quando essa mensagem é exibida.\n%LINK-3-UPDOWN: Interface Port-Channel1, estado alterado para cima\nQual é o nível de gravidade do Syslog desta mensagem?",
  "opts": [
   "Erro",
   "Informativo",
   "Notificação",
   "Alerta"
  ],
  "cor": 0,
  "why": "O número 3 logo após o nome do recurso (%LINK-3-UPDOWN) é o nível de severidade do Syslog. A escala vai de 0 a 7: 0 emergência, 1 alerta, 2 crítico, 3 erro, 4 aviso, 5 notificação, 6 informativo, 7 depuração. Portanto nível 3 = erro."
 },
 {
  "id": 192,
  "mod": 4,
  "fonte": "cert",
  "tp": "QoS",
  "ty": "multi",
  "text": "Quais são as três categorias de ferramentas que podem ser usadas em redes IP para implementar QoS? (Escolha três.)",
  "opts": [
   "gestão de congestionamentos",
   "classificação e marcação",
   "serviços integrados",
   "melhor esforço",
   "serviços diferenciados",
   "congestion avoidance (prevenção de congestionamento)"
  ],
  "cor": [
   0,
   1,
   5
  ],
  "sub": "Escolha as alternativas corretas",
  "why": "As três categorias de ferramentas de QoS são classificação e marcação, gerenciamento de congestionamento e prevenção de congestionamento. Melhor esforço é o modelo padrão de encaminhamento e não oferece QoS. Serviços integrados e serviços diferenciados são modelos de aplicação de QoS, não categorias de ferramentas."
 },
 {
  "id": 193,
  "mod": 4,
  "fonte": "cert",
  "tp": "Arquitetura",
  "ty": "single",
  "text": "Em comunicações de rede de computadores qual processo de transferência de dados o protocolo de camada de aplicativo FTP usa?",
  "opts": [
   "servidor cliente",
   "bloco de mensagens do servidor",
   "Gnutella",
   "peer-to-peer"
  ],
  "cor": 0,
  "why": "O FTP usa o processo cliente-servidor: o cliente inicia a conexão e o servidor responde. Gnutella é um protocolo peer-to-peer. Bloco de mensagens do servidor (SMB) é um protocolo para compartilhar recursos de rede estruturados."
 },
 {
  "id": 194,
  "mod": 4,
  "fonte": "cert",
  "tp": "Segurança",
  "ty": "single",
  "text": "O que é uma ameaça de spyware?",
  "opts": [
   "As informações privadas são capturadas da rede de uma organização.",
   "Uma pessoa mal-intencionada ataca dispositivos de usuário ou recursos de rede.",
   "As credenciais de login de um usuário são roubadas e usadas para acessar dados privados.",
   "O software instalado em um dispositivo de usuário coleta secretamente informações sobre o usuário."
  ],
  "cor": 3,
  "why": "Spyware é um tipo de software instalado no dispositivo do usuário que coleta informações sobre ele às escondidas. Capturar informações privadas da rede de uma organização é interceptação de dados; roubar credenciais de login é roubo de identidade; e o ataque direto de uma pessoa mal-intencionada a dispositivos ou recursos é outra categoria de ameaça."
 },
 {
  "id": 195,
  "mod": 4,
  "fonte": "cert",
  "tp": "Segurança",
  "ty": "multi",
  "text": "Quais dois protocolos são usados para fornecer a autenticação baseada em servidor AAA? (Escolha duas.)",
  "opts": [
   "SSH",
   "SNMP",
   "RADIUS",
   "TACACS+",
   "802.1x"
  ],
  "cor": [
   2,
   3
  ],
  "sub": "Escolha as alternativas corretas",
  "why": "A autenticação AAA baseada em servidor usa um servidor externo TACACS+ ou RADIUS para manter o banco de usuários e senhas. Quando o cliente se conecta a um dispositivo com AAA habilitado, o dispositivo consulta esses servidores para autenticar. SSH é acesso remoto, SNMP é gerenciamento e 802.1x é o padrão de controle de acesso por porta — nenhum dos três é o protocolo de servidor AAA."
 },
 {
  "id": 196,
  "mod": 4,
  "fonte": "cert",
  "tp": "Segurança",
  "ty": "single",
  "text": "Um administrador que está solucionando problemas de conectividade em um switch percebeu que uma porta do switch que estava configurada como segurança de porta na verdade estava com um estado desativado por erro. Após verificar a causa da violação, como o administrador deve reativar a porta sem interromper as operações de rede?",
  "opts": [
   "Emita o comando shutdown seguido por um comando no shutdown na interface.",
   "Emitir o comando no switchport port-security e, em seguida, reativar a segurança de porta.",
   "Emitir o comando no switchport port-security violation shutdown na interface.",
   "Reinicializar o switch."
  ],
  "cor": 0,
  "why": "Para tirar a porta do estado err-disabled, entra-se no modo de configuração da interface e aplica-se shutdown, depois no shutdown. Isso reinicia o estado da porta sem reiniciar o switch nem remover a configuração de port security. Reiniciar o switch derrubaria toda a rede; remover a port security abriria mão da proteção."
 },
 {
  "id": 197,
  "mod": 4,
  "fonte": "cert",
  "tp": "Segurança",
  "ty": "single",
  "text": "Qual solução de segurança identifica ameaças recebidas e impede que elas entrem na rede corporativa?",
  "opts": [
   "sistemas de prevenção de intrusões",
   "filtragem de firewall",
   "redes privadas virtuais",
   "sistemas de controle de acesso"
  ],
  "cor": 0,
  "why": "Os sistemas de prevenção de intrusões (IPS) identificam ameaças de propagação rápida — como ataques zero-day — e as bloqueiam antes que entrem na rede corporativa. Firewalls filtram grandes volumes de tráfego com granularidade, as ACLs filtram por endereço IP e aplicação, e as VPNs dão acesso remoto seguro. Nenhum deles tem o papel de detectar e impedir a intrusão."
 },
 {
  "id": 198,
  "mod": 4,
  "fonte": "cert",
  "tp": "Automação",
  "ty": "single",
  "text": "Um programador está usando o Ansible como a ferramenta de gerenciamento de configuração. Qual termo é usado para descrever um conjunto de instruções para execução?",
  "opts": [
   "Pilar",
   "Guia de atividades",
   "Cookbook",
   "Manifesto"
  ],
  "cor": 1,
  "why": "No Ansible, o conjunto de instruções a executar se chama Playbook — traduzido na plataforma como guia de atividades. Pilar é conceito do SaltStack, Cookbook é do Chef e Manifesto é do Puppet."
 },
 {
  "id": 199,
  "mod": 4,
  "fonte": "cert",
  "tp": "Automação",
  "ty": "multi",
  "text": "Quais são as duas ferramentas de gerenciamento de configuração desenvolvidas usando Python? (Escolha duas.)",
  "opts": [
   "SaltStack",
   "Puppet",
   "Chef",
   "NETCONF",
   "Ansible"
  ],
  "cor": [
   0,
   4
  ],
  "sub": "Escolha as alternativas corretas",
  "why": "Ansible e SaltStack são ferramentas de gerenciamento de configuração desenvolvidas em Python. Chef e Puppet são desenvolvidas em Ruby, que costuma ser considerada mais difícil de aprender que Python. O NETCONF não é ferramenta de gerenciamento de configuração — é um protocolo de gerenciamento de rede."
 },
 {
  "id": 200,
  "mod": 4,
  "fonte": "cert",
  "tp": "SDN/Cloud",
  "ty": "single",
  "text": "Um administrador de rede está usando o Cisco DNA Center para monitorar a integridade da rede e solucionar problemas de rede. Qual área o administrador deve usar para executar essas tarefas?",
  "opts": [
   "POLÍTICA",
   "PROVISÃO",
   "GARANTIA",
   "PLATAFORMA"
  ],
  "cor": 2,
  "why": "No Cisco DNA Center, a área GARANTIA (Assurance) é a que monitora a saúde da rede, mostra métricas dos dispositivos e clientes e serve para troubleshooting. PROVISÃO é para implantar configuração nos dispositivos; POLÍTICA define regras de acesso e intenção; PLATAFORMA cuida da administração do próprio sistema, integrações e APIs."
 },
 {
  "id": 201,
  "mod": 4,
  "fonte": "cert",
  "tp": "Automação",
  "ty": "multi",
  "text": "Quais são os três componentes usados na parte de consulta de uma solicitação típica de API RESTful? (Escolha três.)",
  "opts": [
   "parâmetros",
   "formatar",
   "protocolo",
   "recursos",
   "Servidor de API",
   "chave"
  ],
  "cor": [
   0,
   1,
   5
  ],
  "sub": "Escolha as alternativas corretas",
  "why": "A parte de consulta de uma solicitação RESTful especifica o formato dos dados e a informação que o cliente está pedindo. Ela pode conter: formato (JSON, YAML, XML), chave (para autenticar a origem da solicitação) e parâmetros (para enviar informações relativas à consulta). Protocolo, recursos e servidor de API fazem parte da URI, não da query."
 },
 {
  "id": 202,
  "mod": 4,
  "fonte": "cert",
  "tp": "Segurança",
  "ty": "single",
  "text": "Qual ataque de LAN envolve um servidor não autorizado conectado à rede, fornecendo parâmetros de configuração IP falsos para clientes legítimos?",
  "opts": [
   "Ataque de privação do DHCP",
   "ataque de falsificação de endereço",
   "Ataques ARP",
   "Ataque STP"
  ],
  "cor": 0,
  "why": "Um servidor DHCP não autorizado (rogue) conectado à rede responde aos clientes antes do servidor legítimo e entrega parâmetros falsos: gateway errado, DNS malicioso ou IP inválido. Isso permite ataque man-in-the-middle ou negação de serviço. Na plataforma em português esse ataque aparece como ataque de privação do DHCP; tecnicamente o nome correto em inglês é DHCP spoofing (falsificação de DHCP) — privação (starvation) é o outro ataque, que esgota o pool de endereços."
 },
 {
  "id": 203,
  "mod": 4,
  "fonte": "cert",
  "tp": "QoS",
  "ty": "single",
  "text": "Qual termo descreve um método de enfileiramento padrão em que os pacotes são enviados de uma interface na ordem em que chegam?",
  "opts": [
   "first-in, first-out (FIFO)",
   "low latency queuing (LLQ)",
   "weighted fair queuing (WFQ)",
   "organização de tráfego",
   "weighted random early detection ou WRED (detecção inicial aleatória ponderada)."
  ],
  "cor": 0,
  "why": "FIFO (first-in, first-out) é o método de enfileiramento padrão: o primeiro pacote que chega é o primeiro que sai, sem qualquer priorização. LLQ e WFQ aplicam prioridade e pesos; WRED descarta pacotes antes do congestionamento; e organização de tráfego (traffic shaping) controla a taxa de saída."
 },
 {
  "id": 204,
  "mod": 4,
  "fonte": "cert",
  "tp": "Tabela MAC",
  "ty": "single",
  "text": "Que ação ocorre quando o endereço MAC de origem de um quadro que entra em um switch aparece na tabela de endereços MAC associada a uma porta diferente?",
  "opts": [
   "O switch substitui a entrada antiga e usa a porta mais atual.",
   "O switch atualiza o temporizador de atualização para a entrada.",
   "O switch encaminha o quadro para fora da porta especificada.",
   "O switch expurga toda a tabela de endereços MAC."
  ],
  "cor": 0,
  "why": "Se o switch recebe um quadro cujo MAC de origem já está na tabela mas associado a OUTRA porta, ele entende que o dispositivo mudou de lugar: substitui a entrada antiga pela porta atual e atualiza o temporizador. CUIDADO: se o MAC está na MESMA porta, a ação é apenas atualizar o temporizador, sem trocar a porta."
 },
 {
  "id": 205,
  "mod": 4,
  "fonte": "cert",
  "tp": "Roteamento",
  "ty": "single",
  "text": "Que característica completa a seguinte afirmação?\nQuando uma rota estática IPv6 é configurada e o tráfego deve ser direcionado para um servidor específico, a rota estática requer...",
  "opts": [
   "uma rota de host de destino com um prefixo /128.",
   "o tipo e o número da interface.",
   "o comando \"show ipv6 route static\".",
   "uma distância administrativa de 2."
  ],
  "cor": 0,
  "why": "Para enviar tráfego a UM servidor específico, a rota precisa apontar para aquele endereço único: uma rota de host, com prefixo /128 em IPv6 (o equivalente ao /32 do IPv4). CUIDADO: quando o próximo salto é um endereço link-local, a exigência é outra — informar o tipo e o número da interface."
 }
];
