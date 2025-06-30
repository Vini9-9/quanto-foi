export function formatarValorToBR(valor: number): string {
    const formatador = new Intl.NumberFormat('pt-BR', {
        minimumIntegerDigits: 1,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
    return formatador.format(valor);
}