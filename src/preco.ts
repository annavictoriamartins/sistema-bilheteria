import type { Pessoa, Ingresso, TipoIngresso } from "./tipos.ts";

export function valorDoIngresso(precoBase: number) {
  return (tipo: TipoIngresso): number =>
    tipo === "meia" ? Math.round(precoBase / 2 * 100) / 100 : precoBase;
}

export function aplicarTaxa(percentual: number) {
  return (valor: number): number =>
    Math.round(valor * (1 + percentual) * 100) / 100;
}

export function montarIngressos(precoBase: number, pessoas: Pessoa[], temDireitoAMeia: (pessoa: Pessoa) => boolean): Ingresso[] {
  return pessoas.map((pessoa) => {
    const tipo: TipoIngresso = temDireitoAMeia(pessoa) ? "meia" : "inteira";

    return {
      nome: pessoa.nome,
      poltrona: pessoa.poltrona,
      tipo: tipo,
      valor: valorDoIngresso(precoBase)(tipo)
    };
  });
}

export function calcularTotal(ingressos: Ingresso[]): number {
  const soma = ingressos.reduce((total, ingresso) => total + ingresso.valor, 0);
  return aplicarTaxa(0.1)(soma);
}