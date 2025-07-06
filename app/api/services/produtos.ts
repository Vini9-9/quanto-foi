import { Purchase } from "@/app/lib/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function updateProductDescription(sku: string, newDescription: string): Promise<boolean> {
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

export async function createProduct(compra: Omit<Purchase, "id">): Promise<Purchase | void> {
  try {
    const response = await fetch(`${API_URL}/produtos`, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        data: compra.data,
        local: compra.local,
        descricao: compra.descricao,
        sku: compra.sku,
        preco: compra.preco
      })
    });

    if (!response.ok) {
      console.error(`Erro ao criar produto: ${response.status}`);
      return
    }

    const data = await response.json();
    console.log('Produto criado com sucesso:', data);
    return data;
  } catch (error) {
    console.error('Erro na requisição de criação:', error);
    return
  }
};
