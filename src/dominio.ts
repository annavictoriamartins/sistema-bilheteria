import type { EventoInfo } from "./tipos.ts";

export abstract class ErroDeNegocio extends Error {
  constructor(mensagem: string, public status: number) {
    super(mensagem);
  }
}

export class DadosInvalidosErro extends ErroDeNegocio {
  constructor(mensagem: string) {
    super(mensagem, 400);
  }
}

export class NaoEncontradoErro extends ErroDeNegocio {
  constructor(mensagem: string) {
    super(mensagem, 404);
  }
}

export class PoltronaOcupadaErro extends ErroDeNegocio {
  constructor(mensagem: string) {
    super(mensagem, 409);
  }
}

export class PagamentoErro extends ErroDeNegocio {
  constructor(mensagem: string) {
    super(mensagem, 502);
  }
}

export class Evento {
  #vendidas: number[] = [];

  constructor(
    public id: number,
    public nome: string,
    public preco: number,
    public capacidade: number
  ) {}

  get disponivel(): number {
    return this.capacidade - this.#vendidas.length;
  }

  reservar(poltronas: number[]): void {
    if (poltronas.length === 0) {
      throw new DadosInvalidosErro("Lista de poltronas vazia");
    }

    for (const poltrona of poltronas) {
      if (!Number.isInteger(poltrona) || poltrona < 1 || poltrona > this.capacidade) {
        throw new DadosInvalidosErro("Poltrona inválida");
      }

      if (poltronas.indexOf(poltrona) !== poltronas.lastIndexOf(poltrona)) {
        throw new DadosInvalidosErro("Poltrona repetida");
      }
    }

    for (const poltrona of poltronas) {
      if (this.#vendidas.includes(poltrona)) {
        throw new PoltronaOcupadaErro("já vendida");
      }
    }

    this.#vendidas.push(...poltronas);
  }

  liberar(poltronas: number[]): void {
    for (const poltrona of poltronas) {
      if (!this.#vendidas.includes(poltrona)) {
        throw new DadosInvalidosErro("Poltrona não vendida");
      }
    }

    this.#vendidas = this.#vendidas.filter(
      poltrona => !poltronas.includes(poltrona)
    );
  }

  info(): EventoInfo {
    return {
      id: this.id,
      nome: this.nome,
      preco: this.preco,
      capacidade: this.capacidade,
      disponivel: this.disponivel
    };
  }
}