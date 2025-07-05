export function formatarValorToBR(valor: number): string {
    const formatador = new Intl.NumberFormat('pt-BR', {
        minimumIntegerDigits: 1,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
    return formatador.format(valor);
}

export function formatarDataParaBR(dataString: string): string {
  const data = new Date(dataString);
  
  // Verifica se a data é inválida
  if (isNaN(data.getTime())) {
    throw new Error('Data inválida');
  }

  const dia = String(data.getDate()).padStart(2, '0');
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const ano = data.getFullYear();

  return `${dia}/${mes}/${ano}`;
}