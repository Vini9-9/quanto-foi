const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const updateProductDescription = async (sku: string, newDescription: string): Promise<boolean> => {
  try {
    const response = await fetch(`${API_URL}/produtos/${sku}/descricao`, {
      method: 'PATCH',
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        descricao: newDescription
      })
    });

    if (!response.ok) {
      console.error(`Erro ao atualizar descrição: ${response.status}`);
      return false;
    }

    const data = await response.json();
    console.log('Descrição atualizada com sucesso:', data);
    return true;
  } catch (error) {
    console.error('Erro na requisição de atualização:', error);
    return false;
  }
};

export default updateProductDescription;