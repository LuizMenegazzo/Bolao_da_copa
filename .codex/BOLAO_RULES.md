# Regras do Bolão

## Pontuação

A pontuação compara o palpite da cartela com o resultado oficial salvo/sincronizado.

Critérios:
- Acerto completo: 10 pontos.
- Acerto intermediário: 6 pontos.
  - acertou vencedor/empate e também placar de uma equipe ou diferença de gols.
- Acerto básico: 5 pontos.
  - acertou apenas vencedor ou empate.
- Acerto invertido: -2 pontos.
  - palpite é exatamente o oposto do resultado.
- Nenhum acerto: 0 pontos.

## Ranking

Ordenação da classificação geral:
1. maior pontuação total;
2. mais acertos completos;
3. mais acertos intermediários;
4. mais acertos básicos;
5. menos acertos invertidos;
6. nome do participante como desempate final.

## Setas de movimento

As setas indicam quanto cada pessoa subiu/desceu em relação ao último bloco de jogos atualizado.

Importante:
- Se houver jogos simultâneos, o sistema não compara só um jogo.
- Ele compara o ranking atual contra o ranking antes de todos os jogos daquele mesmo dia/horário.
- Jogos simultâneos são agrupados por `dateLabel + time`.

## Tela Jogo Atual

A tela mostra o último bloco atualizado.

Se for um jogo só:
- mostra o placar daquele jogo.

Se forem jogos simultâneos:
- mostra todos os placares do bloco no topo;
- mostra os palpites de cada participante para todos os jogos do bloco;
- mostra a pontuação total feita naquele bloco.

## Chibis dinâmicos

A ordem de prioridade dos chibis é importante.

Prioridade atual:
1. Casais em sequência na tabela usam chibi do casal.
2. Se fizer 10 pontos em qualquer jogo do bloco atual, usa chibi especial.
3. Se pelo menos 3 entre Amandinha, Carla, Criciele, Cris, Laura e Thieli estiverem em sequência, usam chibi `mate`.
4. Gabriel fazendo -2 em qualquer jogo do bloco usa `gabriel_2_especial`.
5. Primeiro colocado usa chibi especial.
6. Vinicius usa triste se estiver abaixo do Lucas e feliz se estiver acima do Lucas.
7. Últimos 3 colocados ou quem fizer -2 em qualquer jogo do bloco usam triste.
8. Se fizer 5 ou 6 pontos em todos os jogos do bloco, usa feliz.
9. Outros casos com pontuação no bloco, incluindo 0 ou mistura tipo 6 + 0, usam neutro.
10. Caso nenhum dos itens acima aplique, usa chibi padrão.

## Casais

Casais com figurinha especial:
- Luiz + Amandinha: `luiz_amandinha.webp`
- Gustavo + Thieli: `gustavo_thieli.webp`
- Anderson + Celso: `celso_anderson.webp`
- Carla + Lucas: `carla_lucas.webp`
- Criciele + Vinicius: `criciele_vinicius.webp`
- Laura + Daniel: `laura_daniel.webp`

Se os dois estiverem um ao lado do outro na classificação, ambos usam a mesma figurinha do casal.

## Chibis e cache

As imagens usadas no site ficam em `public/chibis-optimized/`.

Quando alguma imagem for atualizada:
1. gerar nova versão WebP otimizada;
2. substituir o arquivo correspondente;
3. atualizar `CHIBI_ASSET_VERSION` em `public/app.js` para forçar o navegador a baixar a imagem nova.
