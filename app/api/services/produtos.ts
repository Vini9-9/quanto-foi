import { ProductResponse, Purchase } from "@/app/lib/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const mockPurchases: ProductResponse = {
  produtos: [
    {
        "id": "01",
        "data": "29/06/2025",
        "local": "ASSAÍ - Terminal",
        "sku": "7896283800818",
        "descricao": "LTE DESN JUSSARA 1L",
        "preco": 4.69
    },
    {
        "id": "03",
        "data": "29/06/2025",
        "local": "ASSAÍ - Terminal",
        "sku": "7896283800818",
        "descricao": "LTE DESN JUSSARA 1L",
        "preco": 4.69
    },
    {
        "id": "02",
        "data": "29/06/2025",
        "local": "ASSAÍ - Terminal",
        "sku": "7898936507457",
        "descricao": "OVO BCO EXTRA 20UN",
        "preco": 12.9
    }
]};

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

export async function fetchPurchases(): Promise<ProductResponse> {
  try {
    console.log('Iniciando requisição para:', `${API_URL}/produtos`);
    
    const response = await fetch(`${API_URL}/produtos`, {
      headers: {
        'Accept': 'application/json',
      }
    });

    console.log('Resposta recebida, status:', response.status);

    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }

    const data = await response.json();
    console.log('Dados recebidos:', data);
    return data;

  } catch (error) {
    console.error('Erro na requisição:', error);
    console.warn('Retornando dados mockados como fallback');
    return mockPurchases;
  }
};

