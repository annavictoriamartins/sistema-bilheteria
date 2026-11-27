# Bilheteria concorrente

Projeto final de Paradigmas de Linguagens de Programação. Enunciado completo no Blackboard.

Os arquivos de `src/` que vocês escrevem já existem, vazios; o `tipos.ts` e o `servidor.ts` vêm prontos. O que vai em cada um está no passo
indicado do enunciado:

| Arquivo | Passo do enunciado |
| :--- | :--- |
| `src/tipos.ts` (pronto) | 1: os tipos |
| `src/regras.ts` | 2: meia-entrada |
| `src/preco.ts` | 3: preço (funcional) |
| `src/dominio.ts` | 4: evento e erros (orientado a objetos) |
| `src/bilheteria.ts` | 5: a venda, onde a concorrência aparece |
| `src/servidor.ts` (pronto) e `src/main.ts` | 6: ligar o servidor |

Não alterem `src/pagamento.ts`, `src/servidor.ts`, `src/bench.ts` nem `testes/`: a correção usa os originais.

Para começar, sigam o `GUIA.md`. Depois dele, os comandos são:

```bash
npm install
npm test          # correção automática: mostra os pontos
npm start         # serviço em http://localhost:3000
npm run bench     # com o serviço no ar: 200 pedidos simultâneos no evento 1, dois por poltrona
```

Exemplo de pedido:

```bash
curl -X POST localhost:3000/reservas -H 'Content-Type: application/json' \
  -d '{"eventoId":1,"ingressos":[{"nome":"Ana","idade":20,"estudante":true,"pcd":false,"poltrona":7}]}'
```

---

## Preencham (avaliado no vídeo)

**Link do vídeo:** 

### Integrantes

| Nome | Usuário do GitHub | Parte principal |
| :--- | :--- | :--- |
| Anna Victoria Martins Amorim Rosa |  annavictoriamartins | Desenvolvimento completo do projeto  |


### Decisões

1. **Concorrência.** Como vocês garantem que duas pessoas não ficam com a mesma poltrona? Onde estava o
   `await` perigoso? 
   Para evitar que duas pessoas comprem a mesma poltrona, a reserva é feita antes do pagamento. O await seria perigoso antes da reserva, pois outra pessoa poderia reservar a mesma poltrona enquanto o pagamento estivesse em andamento. Caso o pagamento falhe ou exceda o tempo limite, a poltrona é liberada.
2. **OO.** O que o `Evento` esconde e por quê? Por que o `reservar` é tudo ou nada? 
Por que os erros são uma hierarquia de classes?O Evento mantém a lista de poltronas vendidas privada para evitar alterações indevidas. A reserva é tudo ou nada porque todas as poltronas precisam estar válidas e disponíveis antes de confirmar a reserva. Os erros seguem uma hierarquia de classes para facilitar a identificação e o tratamento de cada situação.

3. **Funcional.** O que ganhamos com `preco.ts` puro? Como vocês testariam ele sem subir o servidor?
Com as funções puras, conseguimos realizar os cálculos dos ingressos de forma independente, sem alterar outros dados do sistema. Podemos testar essas funções diretamente, passando valores e verificando se os resultados estão corretos, sem precisar iniciar o servidor.
4. **Se fosse em outro paradigma.** Escolham uma das partes e expliquem como ficaria em outro
   paradigma, e se ficaria melhor ou pior.
   O cálculo dos preços poderia ser desenvolvido utilizando orientação a objetos, com uma classe responsável pelos valores dos ingressos e pelas taxas. Porém, nesse caso, a programação funcional é mais adequada por tornar os cálculos mais simples e facilitar os testes.
5. **Concorrente × paralelo.** O Node roda o JavaScript numa linha só: os pedidos de vocês são
   concorrentes, não paralelos. O que mudaria se a venda rodasse em vários núcleos ao mesmo tempo?
Na concorrência, o sistema consegue atender outros pedidos enquanto aguarda a confirmação de um pagamento. Se as vendas fossem executadas em vários núcleos ao mesmo tempo, seria necessário utilizar mecanismos de sincronização para impedir que dois pedidos reservassem a mesma poltrona simultaneamente.
### Resultados do bench

| Cenário | Pedidos | Tempo (ms) | Vendidos | Poltrona ocupada | Falha de pagamento |
| :--- | ---: | ---: | ---: | ---: | ---: |
| Padrão (`main.ts`) | 200 | 274 | 91 | 100 | 9 |

O bench ocupa as poltronas do evento 1: para rodar de novo, parem o `npm start` (Ctrl+C) e subam outra
vez.

O que os números mostram:
