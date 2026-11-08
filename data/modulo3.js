// CCNA modulo 3 - ENSA - EXAME FINAL do curso
// 55 questoes transcritas dos screenshots do exame (PT-BR) + gabarito validado
window.QUESTIONS_M3 = [
 {
  "id": 1,
  "mod": 3,
  "fonte": "curso",
  "tp": "OSPF",
  "ty": "single",
  "text": "Que tipo de pacote OSPFv2 contém uma lista abreviada do LSDB de um roteador de envio e é usado pelo recebimento de roteadores para verificar o LSDB local?",
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
  "mod": 3,
  "fonte": "curso",
  "tp": "OSPF",
  "ty": "single",
  "text": "Qual etapa no processo de roteamento de estado de link é descrita por um roteador que constrói um banco de dados de estado de link com base em LSAs recebidas?",
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
  "mod": 3,
  "fonte": "curso",
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
  "mod": 3,
  "fonte": "curso",
  "tp": "OSPF",
  "ty": "match",
  "text": "Associe o estado OSPF à ordem em que ocorre.",
  "sub": "Estados da adjacência OSPF",
  "why": "A ordem correta da adjacência OSPF é: Down (inativo) → Init (inicialização) → Two-Way (bidirecional) → ExStart → Exchange → Loading → Full. Cada estado representa uma etapa da troca de informações entre os vizinhos.",
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
  ]
 },
 {
  "id": 5,
  "mod": 3,
  "fonte": "curso",
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
  "mod": 3,
  "fonte": "curso",
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
  "mod": 3,
  "fonte": "curso",
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
  "mod": 3,
  "fonte": "curso",
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
  "mod": 3,
  "fonte": "curso",
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
  "mod": 3,
  "fonte": "curso",
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
  "mod": 3,
  "fonte": "curso",
  "tp": "Segurança",
  "ty": "single",
  "text": "Que tipo de ameaça à segurança pode ser descrito como software que se conecta a outro programa para executar uma função indesejada específica?",
  "opts": [
   "worm",
   "negação de serviço Cavalo de Tróia",
   "vírus",
   "cavalo de Tróia proxy"
  ],
  "cor": 2,
  "sub": "vírus",
  "why": "O vírus precisa se anexar a um programa ou arquivo legítimo e só se executa quando o usuário abre esse hospedeiro. Sem hospedeiro, ele não roda."
 },
 {
  "id": 12,
  "mod": 3,
  "fonte": "curso",
  "tp": "Segurança",
  "ty": "single",
  "text": "Qual é a melhor descrição do malware cavalo de Troia?",
  "opts": [
   "É a forma de malware mais facilmente detectada.",
   "É um malware que só pode ser distribuído pela Internet.",
   "É um software que causa problemas irritando mas não problemas fatais de computador.",
   "Aparece como software útil, mas o código mal-intencionado está escondido nele."
  ],
  "cor": 3,
  "sub": "Aparece como software útil, mas o código mal-intencionado está escondido nele.",
  "why": "O cavalo de Troia se disfarça de software útil ou legítimo para induzir o usuário a executá-lo, mas carrega código malicioso escondido. Ele não se replica sozinho como o worm."
 },
 {
  "id": 13,
  "mod": 3,
  "fonte": "curso",
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
  "mod": 3,
  "fonte": "curso",
  "tp": "ACLs",
  "ty": "multi",
  "text": "Consulte a figura. As interfaces Gigabit em ambos os roteadores foram configuradas com os números de subinterface que correspondem aos números VLAN conectados a eles. Os computadores na VLAN 10 devem ser capazes de imprimir na impressora P1 na VLAN 12. Os PCs na VLAN 20 devem imprimir nas impressoras na VLAN 22. Qual interface e em qual direção você deve colocar uma ACL padrão que permita a impressão na P1 da VLAN 10, mas impeça os PCs na VLAN 20 de usar a impressora P1? (Escolha duas.)",
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
  "why": "A ACL padrão deve ser aplicada o mais próximo possível do destino, no sentido outbound. Nesse cenário, aplica-se na subinterface R1 Gi0/1.12 no sentido outbound para filtrar o tráfego antes de sair."
 },
 {
  "id": 15,
  "mod": 3,
  "fonte": "curso",
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
  "mod": 3,
  "fonte": "curso",
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
  "mod": 3,
  "fonte": "curso",
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
  "why": "A ACL estendida 105 deve ser aplicada perto da origem, na interface gi0/0 do R1 no sentido outbound, e conter uma ACE permitindo TCP da origem 10.0.70.23 para o destino 10.0.54.5 na porta 20 (FTP-data)."
 },
 {
  "id": 18,
  "mod": 3,
  "fonte": "curso",
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
  "why": "O comando no access-list 10 remove a ACL inteira da configuração em execução. Diferente de remover uma única ACE com 'no <número da ACE>', aqui a lista toda é apagada."
 },
 {
  "id": 19,
  "mod": 3,
  "fonte": "curso",
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
  "mod": 3,
  "fonte": "curso",
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
  "mod": 3,
  "fonte": "curso",
  "tp": "ACLs",
  "ty": "single",
  "text": "Consulte a figura. Um administrador de rede configurou o ACL 9 como mostrado. Os usuários na rede 172.31.1.0/24 não podem encaminhar o tráfego através do roteador CiscoVille. Qual é a causa mais provável da falha de tráfego?",
  "opts": [
   "O número da porta para o tráfego não foi identificado com a palavra-chave eq.",
   "A instrução permit especifica uma máscara curinga incorreta.",
   "A palavra-chave estabelecida não é especificada.",
   "A sequência das ACEs está incorreta."
  ],
  "cor": 3,
  "sub": "A sequência das ACEs está incorreta.",
  "why": "A ACL 9 tem a sequência das ACEs na ordem errada: uma ACE de negação aparece antes de uma permissão que deveria vir primeiro, e o roteador processa as ACEs de cima para baixo, parando na primeira que casa."
 },
 {
  "id": 22,
  "mod": 3,
  "fonte": "curso",
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
  "mod": 3,
  "fonte": "curso",
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
  "figAlt": "Figura da questão 23 do exame final ENSA"
 },
 {
  "id": 24,
  "mod": 3,
  "fonte": "curso",
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
  "why": "No NAT estático, o endereço global interno (o endereço público pelo qual o PC1 é visto na Internet) é o 209.165.200.225. É esse IP que os hosts externos usam para alcançar o PC1."
 },
 {
  "id": 25,
  "mod": 3,
  "fonte": "curso",
  "tp": "NAT",
  "ty": "single",
  "text": "Que tipo de NAT mapeia um endereço local interno único para um endereço global interno único?",
  "opts": [
   "overloading",
   "estático",
   "dinamico",
   "conversão do endereço de porta (PAT)"
  ],
  "cor": 1,
  "sub": "estático",
  "why": "O NAT estático faz um mapeamento fixo 1:1 entre um endereço local interno e um endereço global interno. É usado para servidores que precisam ser acessíveis de fora sempre pelo mesmo endereço."
 },
 {
  "id": 26,
  "mod": 3,
  "fonte": "curso",
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
  "why": "Falta marcar a interface S0/0/0 como ip nat outside. Sem uma interface inside e outra outside definidas, o roteador não sabe qual tráfego traduzir e o NAT estático não funciona."
 },
 {
  "id": 27,
  "mod": 3,
  "fonte": "curso",
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
  "mod": 3,
  "fonte": "curso",
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
  "mod": 3,
  "fonte": "curso",
  "tp": "WAN",
  "ty": "multi",
  "text": "Quais três fatores relacionados ao tráfego relacionados influenciariam a seleção de um tipo de link de WAN específico? (Escolha três.)",
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
  "mod": 3,
  "fonte": "curso",
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
  "mod": 3,
  "fonte": "curso",
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
  "mod": 3,
  "fonte": "curso",
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
  "mod": 3,
  "fonte": "curso",
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
  "mod": 3,
  "fonte": "curso",
  "tp": "QoS",
  "ty": "single",
  "text": "Que técnica de QoS retém os pacotes excedentes em uma fila separada para transmissão posterior?",
  "opts": [
   "enfileiramento",
   "classificar",
   "shaping (modelagem)",
   "marcação"
  ],
  "cor": 2,
  "sub": "shaping (modelagem)",
  "why": "O shaping (modelagem) retém os pacotes excedentes em uma fila separada para enviá-los depois, suavizando a taxa de saída. O policing simplesmente descarta o excesso."
 },
 {
  "id": 35,
  "mod": 3,
  "fonte": "curso",
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
  "mod": 3,
  "fonte": "curso",
  "tp": "QoS",
  "ty": "single",
  "text": "Qual termo descreve a adição de um valor ao cabeçalho do pacote, o mais próximo possível da origem, para que o pacote corresponda a uma política definida?",
  "opts": [
   "policiamento",
   "weighted random early detection ou WRED (detecção inicial aleatória ponderada).",
   "marcação de tráfego",
   "queda cauda",
   "organização de tráfego"
  ],
  "cor": 2,
  "sub": "marcação de tráfego",
  "why": "A marcação de tráfego adiciona um valor ao cabeçalho do pacote o mais próximo possível da origem, para que os dispositivos seguintes reconheçam a classe do tráfego sem precisar reclassificá-lo."
 },
 {
  "id": 37,
  "mod": 3,
  "fonte": "curso",
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
  "figAlt": "Figura da questão 37 do exame final ENSA"
 },
 {
  "id": 38,
  "mod": 3,
  "fonte": "curso",
  "tp": "Gerência",
  "ty": "single",
  "text": "Por que um administrador de rede usaria o comando config-register 0x2102 em um dispositivo de rede Cisco?",
  "opts": [
   "to monitor and manage network performance, find and solve network problems, and plan for network growth",
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
  "mod": 3,
  "fonte": "curso",
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
  "mod": 3,
  "fonte": "curso",
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
  "mod": 3,
  "fonte": "curso",
  "tp": "Arquitetura",
  "ty": "single",
  "text": "What is the port density of a switch?",
  "opts": [
   "the number of available ports on a switch",
   "a taxa de transferência de uma porta",
   "a largura de banda combinada de todas as portas em um switch",
   "a largura de banda de uma porta"
  ],
  "cor": 0,
  "sub": "the number of available ports on a switch",
  "why": "A port density de um switch é o número de portas disponíveis nele. Não tem relação com a velocidade por porta nem com o tamanho da tabela MAC."
 },
 {
  "id": 42,
  "mod": 3,
  "fonte": "curso",
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
  "mod": 3,
  "fonte": "curso",
  "tp": "Arquitetura",
  "ty": "single",
  "text": "Qual é a função do ASICs em um switch de várias camadas?",
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
  "mod": 3,
  "fonte": "curso",
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
  "mod": 3,
  "fonte": "curso",
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
  "mod": 3,
  "fonte": "curso",
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
  "mod": 3,
  "fonte": "curso",
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
  "mod": 3,
  "fonte": "curso",
  "tp": "OSPF",
  "ty": "single",
  "text": "Consulte a figura.Por que os roteadores R1 e R2 não conseguem estabelecer uma adjacência OSPF?",
  "opts": [
   "As interfaces seriais não estão na mesma área.",
   "Os valores de ID do roteador não são os mesmos em ambos os roteadores.",
   "Os números de processo não são os mesmos em ambos os roteadores.",
   "Um roteador backbone não pode estabelecer uma adjacência com um roteador ABR."
  ],
  "cor": 0,
  "sub": "As interfaces seriais não estão na mesma área.",
  "why": "As interfaces seriais de R1 e R2 estão configuradas em áreas OSPF diferentes. OSPF só forma adjacência entre interfaces na mesma área — por isso a adjacência não estabelece.",
  "fig": "img/m3-q040.webp",
  "figAlt": "Figura da questão 48 do exame final ENSA"
 },
 {
  "id": 49,
  "mod": 3,
  "fonte": "curso",
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
  "mod": 3,
  "fonte": "curso",
  "tp": "SDN/Cloud",
  "ty": "single",
  "text": "O que define uma topologia de folha espinhal de duas camadas?",
  "opts": [
   "A camada lombada pode ser implementada com switches Cisco Nexus 9500 conectados uns aos outros e aos switches de folha.",
   "Tudo é dois saltos de tudo o resto.",
   "Os dispositivos CISCO APICs e todos os outros dispositivos da rede se conectam, fisicamente aos switches leaf.",
   "O controlador APIC manipula o caminho de dados diretamente."
  ],
  "cor": 2,
  "sub": "Os dispositivos CISCO APICs e todos os outros dispositivos da rede se conectam, fisicamente aos",
  "why": "Na topologia spine-leaf de duas camadas, os APICs e todos os outros dispositivos da rede se conectam fisicamente aos leaf switches. Os spines conectam-se apenas aos leaves, formando a malha."
 },
 {
  "id": 51,
  "mod": 3,
  "fonte": "curso",
  "tp": "SDN/Cloud",
  "ty": "single",
  "text": "Qual tipo de Hypervisor é implementado quando um usuário com um notebook executando o sistema operacional do Mac instala uma instância de sistema opercionado do Windows virtual?",
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
  "mod": 3,
  "fonte": "curso",
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
  "mod": 3,
  "fonte": "curso",
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
  "mod": 3,
  "fonte": "curso",
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
  "mod": 3,
  "fonte": "curso",
  "tp": "Automação",
  "ty": "single",
  "text": "Quando o formato de dados JSON está sendo usado, quais caracteres são usados para armazenar objetos?",
  "opts": [
   "double colons : :",
   "suportes duplos []",
   "aspas duplas \"\"",
   "chaves duplas {}"
  ],
  "cor": 3,
  "sub": "chaves duplas {}",
  "why": "No JSON, os objetos são delimitados por chaves duplas { }. Os colchetes [ ] delimitam arrays e as aspas duplas delimitam strings."
 }
];
