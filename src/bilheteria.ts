// Parte A - Processo de venda dos ingressos.
// Parte B - Tratamento de falhas no pagamento.
// Parte C - Controle do tempo limite de pagamento.

import type { ConfigBilheteria, Pedido, Comprovante, EventoInfo } from "./tipos.ts";
import { Evento, DadosInvalidosErro, NaoEncontradoErro, PagamentoErro } from "./dominio.ts";
import type { Pagamento } from "./pagamento.ts";
import { direitoAMeia } from "./regras.ts";
import { montarIngressos, calcularTotal } from "./preco.ts";

function comTempoLimite<T>(promessa: Promise<T>, ms: number): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const limite = new Promise<never>((_, rejeitar) => {
    timer = setTimeout(() => rejeitar(new Error("tempo esgotado")), ms);
  });
  // O finally desliga o relógio quando a cobrança termina antes.
  return Promise.race([promessa, limite]).finally(() => clearTimeout(timer));
}

export class Bilheteria {

  #eventos: Evento[];
  #pagar: Pagamento;
  #limitePagamentoMs: number;
  #reservaId: number = 0;

  constructor(config: ConfigBilheteria) {
    this.#eventos = config.eventos;
    this.#pagar = config.pagar;
    this.#limitePagamentoMs = config.limitePagamentoMs;
  }

  listarEventos(): EventoInfo[] {
    return this.#eventos.map((evento) => evento.info());
  }

  async reservar(pedido: Pedido): Promise<Comprovante> {

    if (!Array.isArray(pedido.ingressos) || pedido.ingressos.length === 0) {
      throw new DadosInvalidosErro("Pedido inválido");
    }

    const evento = this.#eventos.find(
      (evento) => evento.id === pedido.eventoId
    );

    if (!evento) {
      throw new NaoEncontradoErro("Evento não encontrado");
    }

    const poltronas = pedido.ingressos.map(
      (pessoa) => pessoa.poltrona
    );

    evento.reservar(poltronas);

    const ingressos = montarIngressos(
      evento.preco,
      pedido.ingressos,
      direitoAMeia
    );

    const total = calcularTotal(ingressos);

    try {
      await comTempoLimite(this.#pagar(total), this.#limitePagamentoMs);
    } catch {
      evento.liberar(poltronas);
      throw new PagamentoErro("Pagamento recusado");
    }

    this.#reservaId += 1;

    return {
      reservaId: this.#reservaId,
      eventoId: evento.id,
      ingressos: ingressos,
      total: total
    };
  }
}

export function criarBilheteria(config: ConfigBilheteria) {
  return new Bilheteria(config);
}