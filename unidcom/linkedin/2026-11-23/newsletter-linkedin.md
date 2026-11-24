# Newsletter Unidcom para LinkedIn

## Tema principal

O Google publicou um guia oficial para reconhecer o "Google-Agent", o nome dos agentes de IA hospedados na infraestrutura do Google que navegam, pesquisam, filtram, adicionam itens ao carrinho e fazem reservas em sites a pedido dos usuários. O guia alerta que bloqueios genéricos de bot (CAPTCHA, bloqueio de data center, regras gerenciadas) podem estar barrando esse tráfego legítimo no meio da jornada de compra.

## Título recomendado

Seu firewall pode estar barrando o Google — e isso custa vendas

## Alternativas de título

1. O agente de IA do Google já põe produtos no carrinho. Seu site deixa?
2. Google-Agent: o guia que todo site que vende ou capta leads precisa ler
3. Como saber se o seu firewall está fechando a porta para o Google-Agent

## Chamada de apoio

O Google publicou um guia oficial para reconhecer os agentes de IA que navegam, põem itens no carrinho e fazem reservas a pedido dos usuários e alertou que bloqueios genéricos de bot podem estar barrando esse tráfego antes da conversão.

## Texto da newsletter

Até pouco tempo, qualquer tráfego com cara de "agente automatizado" era tratado como suspeito por padrão. No dia 23 de novembro, o Google mexeu nessa conversa: publicou uma página oficial para donos de sites reconhecerem e liberarem o que chama de "Google-Agent".

### O que é o Google-Agent, segundo o próprio Google

![Faixa editorial sobre o guia do Google para reconhecer agentes de IA que navegam e agem em sites a pedido dos usuários](noticia-01-630x115.png)

Google-Agent é o nome dado aos agentes de IA hospedados na infraestrutura do Google que navegam na web e executam ações a pedido do usuário. Na lista de situações que o guia manda cobrir estão a busca interna do site, os filtros, as páginas de detalhe de produto, a adição ao carrinho, as reservas e as chamadas às APIs do site. Ou seja: não é um robô de indexação como os crawlers tradicionais. É um agente que percorre a jornada de compra no lugar de uma pessoa.

O Google ainda não diz quais produtos usam esse agente. Mas o guia detalha três formas de validar se uma requisição vem mesmo dele: o cabeçalho User-Agent contendo "Google-Agent", o IP presente em uma lista oficial publicada em arquivo JSON e, quando disponível, uma assinatura criptográfica do protocolo experimental Web Bot Auth.

### Onde o bloqueio acontece

O guia foi publicado justamente para evitar que esse tráfego legítimo seja barrado. Os pontos de atenção são bem concretos: regras amplas que bloqueiam data centers ou "agentes de IA" como categoria rodando antes da exceção para o Google-Agent; CAPTCHA e desafios em JavaScript aparecendo no meio do caminho; e proteções que liberam a página inicial, mas travam a busca interna, o carrinho ou o formulário de reserva. Na prática, sites que reforçaram a segurança contra scraping e bots maliciosos podem estar fechando a porta justamente para o agente que levaria um cliente até a conversão.

### O que isso significa para quem vende online

Se o seu e-commerce, a sua agência ou o seu provedor de hospedagem usa bloqueio automático de bots, vale revisar as regras agora. Uma lista de IP desatualizada ou um CAPTCHA no lugar errado podem barrar uma compra sem que ninguém perceba, porque esse tipo de perda dificilmente aparece como oportunidade perdida nos relatórios de performance.

As prioridades práticas indicadas pelo Google são três: liberar o Google-Agent verificado nas regras de firewall, CDN e detecção de bots; dispensar CAPTCHA para esse tráfego verificado; e revisar limites de taxa por IP, já que requisições de muitos usuários saem pelo mesmo conjunto de IPs.

### No radar da semana

Duas outras notícias mostram que a forma de medir tráfego e desempenho está mudando mais rápido do que os processos de auditoria. O TikTok lançou uma ferramenta que permite verificar se uma imagem ou vídeo foi criado ou editado com IA, usando a marca d'água digital da própria plataforma. Isso é útil para quem precisa comprovar a autenticidade de conteúdo de campanha ou de criadores. E o Search Engine Journal alertou que parte da queda de rankings registrada em 18 de novembro, com o Core Update de novembro ainda em distribuição, pode ter sido causada por uma falha de coleta de uma ferramenta de rastreamento, e não por uma mudança real do algoritmo. Vale confirmar se os seus dados de ranking vieram completos antes de reagir a uma queda pontual.

### Por que vale medir o que está sendo barrado

Um cliente em potencial barrado por um firewall mal configurado não vira alerta em nenhum painel. Ele simplesmente não converte, e ninguém investiga o motivo. O problema de crescimento nem sempre está na campanha ou na oferta. Às vezes está na porta de entrada do próprio site, numa camada que marketing raramente audita.

## CTA final

Se você quer entender o que está travando o crescimento do seu negócio, da mídia à porta de entrada do site, agende uma conversa de 30 minutos com a Unidcom: https://calendly.com/unidcom/30min

## Capa da newsletter

### Conceito visual

A mesma imagem da faixa da notícia: um fluxo de partículas laranja atravessa uma sequência de portas de vidro e para numa última porta azul, fechada. Representa o agente de IA que percorre a jornada no site e é barrado no fim por uma regra de segurança.

### Texto principal da capa

Seu firewall pode estar barrando o Google

### Texto secundário

Newsletter Unidcom

### Elemento principal

Fileira de portas finas de vidro translúcido em perspectiva, atravessada por um fluxo de partículas laranja que para numa porta azul opaca à direita.

### Composição

Faixa horizontal de elementos no centro vertical da imagem, ocupando quase toda a largura; fundo preto acima e abaixo. A placa original (3:1) foi estendida em fundo preto até 16:9, sem cortar as laterais.

### Espaço para texto

Faixas escuras e uniformes no terço superior e no terço inferior, livres para aplicar o título no editor do LinkedIn.

### Estilo visual

Panorama editorial abstrato, estúdio escuro, alto contraste, minimalista; mesma imagem da faixa da notícia.

### Prompt para geração da imagem

Abstract editorial panorama in a dark studio: a row of thin translucent glass gates in perspective along a horizontal line, a stream of small warm orange (#FF7C1A) light particles flowing left to right through the first gates and stopping at a closed, slightly opaque deep-blue gate near the right. Minimal, elegant, high contrast, dark background. No people, no text, letters, numbers, logos, watermarks, padlocks, shields or UI. (Gerada em formato panorâmico e estendida em fundo preto até 16:9.)

## Imagem gerada

`capa.png` (1920x1080, sem texto incorporado). É a mesma imagem da faixa 1 (placa `noticia-01-fonte.png`, gerada em 24/11/2026 pela CLI do Codex, modelo `gpt-6.1-sol`), estendida em fundo preto até 16:9 (`capa-fonte.png`). A capa anterior, com o portal de luz, ficou preservada em `capa-anterior-portal-fonte.png` e não é mais usada. O título da capa deve ser aplicado no editor do LinkedIn na publicação.

## Imagens geradas

- Capa: `capa.png`
- Faixa 1: ![Faixa editorial sobre o guia do Google para reconhecer agentes de IA que navegam e agem em sites a pedido dos usuários](noticia-01-630x115.png) (630x115, borda inferior `#FF7C1A`; placa-fonte `noticia-01-fonte.png`, composição em `faixas.html`)

## Links utilizados

- Fonte principal (Search Engine Journal, guia do Google-Agent): https://www.searchenginejournal.com/google-publishes-guidance-for-google-agent-crawler/598526/
- Contexto (Social Media Today, detector de IA do TikTok): https://www.socialmediatoday.com/news/tiktok-adds-new-ai-transparency-and-parental-controls/875424/
- Contexto (Search Engine Journal, dados de ranking e Core Update de novembro): https://www.searchenginejournal.com/check-your-nov-18-rank-data-before-blaming-the-core-update/598449/
- CTA (reunião de 30 minutos com a Unidcom, mesmo CTA do e-mail): https://calendly.com/unidcom/30min

## Alterações realizadas

Atualização de 24/11/2026:

- **CTA trocado.** O diagnóstico de CPL saiu, acompanhando a remoção do banner de CPL da newsletter de e-mail. Entrou o CTA de reunião de 30 minutos que já estava no e-mail. A seção final deixou de mencionar o custo por lead.
- **"Compra" removido das afirmações sobre o Google-Agent.** Nem o Google nem a Search Engine Journal dizem que o agente "compra"; a documentação fala em navegar, pesquisar, filtrar, adicionar ao carrinho, reservar e chamar APIs. Título recomendado, alternativas, chamada de apoio, tema principal e texto da capa foram ajustados.
- **Seção "Por que isso virou um guia oficial agora" virou "Onde o bloqueio acontece".** Agora ela traz os pontos concretos do guia (ordem das regras, CAPTCHA, bloqueio no meio da jornada), em vez de uma explicação sobre o motivo da publicação.
- **Frase sobre perdas que "não aparecem em nenhum relatório" suavizada** para algo que as fontes sustentam.
- Preservados: notícia foco, estrutura, "No radar da semana", conceito e prompt da capa, faixa 1 e links das fontes.

## Pontos para validação

- Capa e faixa geradas em 24/11/2026 pela CLI do Codex (o MCP `magnific` seguia sem conexão). Vale uma revisão visual antes de publicar.
- O título do destaque 1 na newsletter de **e-mail** ("Agentes de IA já compram em sites…") tem a mesma imprecisão corrigida aqui. Vale decidir se ajusta o e-mail também.
- Os novos bullets do e-mail (Pinterest + Microsoft Ads e tendências de Natal do TikTok) não entraram nesta versão, que segue o padrão de uma notícia foco com contexto breve.
