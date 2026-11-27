// Passo 6 - Ligar o servidor.

import { Evento } from "./dominio.ts";
import { criarPagamentoFalso } from "./pagamento.ts";
import { criarBilheteria } from "./bilheteria.ts";
import { criarServidor } from "./servidor.ts";

const eventos = [
  new Evento(1, "Cinema", 40, 100),
  new Evento(2, "Teatro", 60, 80),
  new Evento(3, "Show", 100, 150)
];

const pagar = criarPagamentoFalso({
  latenciaMs: 80,
  taxaDeFalha: 0.1
});

const bilheteria = criarBilheteria({
  eventos: eventos,
  pagar: pagar,
  limitePagamentoMs: 500
});

criarServidor(bilheteria).listen(3000);