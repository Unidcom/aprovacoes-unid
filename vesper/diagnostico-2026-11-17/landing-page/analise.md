# V?sper ? revis?o da landing page

[P?gina analisada](https://www.vespersolar.com/faleconosco) ? inspe??o ao vivo em desktop e celular, 17/11/2026. Nenhum formul?rio foi enviado e o site n?o foi alterado.

## Resultado da inspe??o

A p?gina j? contextualiza instala??o pr?pria e oferece formul?rio e WhatsApp, al?m de portf?lio, depoimentos e etapas. Cidade e consumo aparecem no formul?rio, mas n?o s?o obrigat?rios no DOM renderizado. Nome, e-mail e telefone est?o obrigat?rios. A valida??o do servidor e o p?s-envio n?o foram testados.

A vers?o m?vel pr?pria do Wix carregou sem transbordamento horizontal no teste. O desafio de verifica??o apareceu carregando na automa??o, o que requer confer?ncia em aparelhos reais antes de diagnosticar falha. N?o foram medidos taxa de convers?o, velocidade real ou impacto causal nas perdas.

## Melhorias propostas

### P1 ? Testar objetivo e momento com poucos campos adicionais

**Observado:** A base geral tem demandas de off-grid, assinatura, suporte e equipamento avulso. Isso não prova que todas vieram desta landing page.

**A??o:** Testar uma pergunta de objetivo e outra de prazo. Manter cidade/consumo e perguntar expansão quando houver obra, carro elétrico ou ar-condicionado. Direcionar suporte/fornecedor para atendimento adequado.

**Medir:** Oportunidades atendíveis por visita e cadastros que respondem ao comercial; comparar com o formulário atual.

### P1 ? Aproximar a abertura do projeto e da área atendida

**Observado:** A página já apresenta instalação em um contato/empresa e tem CTA de instalar no imóvel. A instrução de preencher os campos ocupa bastante espaço antes do formulário.

**A??o:** Preservar o contexto de instalação e testar uma abertura mais direta, com Juiz de Fora/região atendida, avaliação de consumo e estimativa de investimento. Trocar a instrução longa por uma frase sobre o que a pessoa receberá.

**Medir:** Formulário iniciado, concluído e oportunidade gerada por variante de abertura.

### P1 ? Explicar investimento, economia e financiamento com condições

**Observado:** A página enfatiza economia, financiamento e benefícios gerais. Nas conversas há comparação de preços, juros e expectativa de redução na conta.

**A??o:** Acrescentar FAQ sobre investimento em equipamentos, análise de crédito, custos de adequação e valores residuais da conta. Apresentar projeção por imóvel e revisar afirmações absolutas sobre retorno e reajustes.

**Medir:** Menos dúvidas recorrentes e melhor avanço após proposta; sem promessa de conta zerada ou aprovação universal.

### P1 ? Trazer prova próxima do formulário e explicar os cases

**Observado:** Há portfólio, depoimentos e etapas do projeto, mas boa parte aparece depois de financiamento e vários benefícios. A página é extensa nos dois formatos.

**A??o:** Testar um case local enxuto próximo à abertura: tipo de imóvel, sistema, período de medição e economia efetivamente documentada. Manter o portfólio completo abaixo ou em abertura opcional.

**Medir:** Cadastros válidos e avanço; validar os números e a autorização de uso antes de publicar o case.

### P2 ? Simplificar a leitura no celular e preservar o contexto dos campos

**Observado:** A versão móvel própria do Wix foi carregada, sem transbordamento horizontal na inspeção. Os campos de texto usam placeholders e não têm labels associados expostos no DOM consultado. O botão de envio aparece perto do fim da primeira tela capturada.

**A??o:** Usar rótulos visíveis e persistentes, reduzir a instrução inicial e revisar espaçamento para manter a ação principal fácil de encontrar. Testar nome, telefone, teclado e leitura em aparelhos reais.

**Medir:** Conclusão no celular, erros por campo e facilidade de retomar um formulário preenchido parcialmente.

### P2 ? Dar continuidade clara após o envio e no WhatsApp

**Observado:** A página oferece formulário e contato por link Tintim/WhatsApp. O pós-envio não foi testado para não gerar um cadastro fictício.

**A??o:** Revisar a confirmação real e informar próximo passo, canal e prazo de atendimento que a equipe consegue cumprir. No WhatsApp, levar a intenção de simulação e pedir a conta de forma contextual.

**Medir:** Resposta ao primeiro contato, envio de conta e propostas; detalhes de rastreamento estão no documento separado de integração.

## Proposta de abertura ? rascunho para teste

Instale energia solar no seu imóvel em Juiz de Fora e região atendida

Receba uma avaliação do consumo e uma estimativa para seu projeto, com instalação e homologação.

A viabilidade e a economia dependem do imóvel, do consumo e das condições do projeto. Financiamento sujeito à análise e às condições disponíveis.

**CTA:** Solicitar simulação da instalação

Preservar a refer?ncia ? instala??o e explicar que o investimento e a economia dependem do projeto. Para o formul?rio, testar objetivo e prazo com poucos campos adicionais e acompanhar abandono e oportunidades atend?veis.

## Crit?rios de avalia??o

- Visita ? in?cio ? conclus?o do formul?rio ? resposta humana ? conta recebida ? oportunidade ? proposta ? pedido.
- Dados de cidade/consumo utiliz?veis, demanda fora do escopo e motivos de d?vidas registrados.
- Compara??o controlada mantendo p?blico e oferta ao testar a abertura/formul?rio.
- N?o usar apenas aumento de cadastros como sinal de sucesso.
- N?o atribuir ? landing page todos os casos de off-grid, assinatura ou suporte da base geral.

## Registros

- [Topo no desktop](desktop-topo.png)
- [Topo no celular](mobile-topo.png)
- [Inspe??o no navegador](inspecao-ao-vivo.json)

## Refer?ncias

- [Página Vésper inspecionada ao vivo](https://www.vespersolar.com/faleconosco)
- [Google — sinais de público na PMax não são limites rígidos](https://support.google.com/google-ads/answer/14587068?hl=en-GB)
- [Google — negativas na PMax](https://support.google.com/google-ads/answer/15726455?hl=pt-BR)
- [ANEEL — custo-benefício e valores residuais da microgeração](https://www.gov.br/aneel/pt-br/assuntos/geracao-distribuida)
- [web.dev — estrutura e rótulos de formulários](https://web.dev/learn/forms/design-basics)

Versão pública: identificação e transcrições mantidas somente no projeto interno.
