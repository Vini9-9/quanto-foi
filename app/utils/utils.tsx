export function formatarValorToBR(valor: number): string {
    const formatador = new Intl.NumberFormat('pt-BR', {
        minimumIntegerDigits: 1,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
    return formatador.format(valor);
}

export function formatarDataParaBR(dataString: string): string {
  // Verifica se a string está no formato esperado (YYYY-MM-dd)
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dataString)) {
    throw new Error('Formato de data inválido. Use YYYY-MM-dd');
  }

  // Divide a string em partes
  const partes = dataString.split('-');
  const ano = partes[0];
  const mes = partes[1];
  const dia = partes[2];

  return `${dia}/${mes}/${ano}`;
}