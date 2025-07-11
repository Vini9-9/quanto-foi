"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Calendar, Store, DollarSign, Hash } from "lucide-react"
import type { Purchase } from "../lib/types"
import { formatarDataParaBR, formatarValorToBR } from "../utils/utils"
import { useState } from "react"
import { fetchImageBySKU, updateProductDescription } from "../api/services/produtos"

interface ProductComparisonProps {
  descricao: string
  purchases: Purchase[]
}

export default function ProductComparison({ descricao, purchases }: ProductComparisonProps) {
  const sortedPurchases = [...purchases].sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
  const latestPurchase = sortedPurchases[0]
  const averagePaid = purchases.reduce((sum, p) => sum + p.preco, 0) / purchases.length
  const totalSpent = purchases.reduce((sum, p) => sum + p.preco, 0)
  const skuProduto = purchases[0]?.sku || '';
  const precoDifference = latestPurchase.preco - averagePaid
  const isCurrentCheaper = precoDifference <= 0
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [newDescription, setNewDescription] = useState(descricao);
  
  const handleSaveDescription = async (sku: string) => {
     const success = await updateProductDescription(sku, newDescription);
  
      if (success) {
        setIsEditModalOpen(false)
      } else {
        alert("Não foi possível atualizar a descrição. Tente novamente.");
      }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              <div>
                <div>{descricao} - Análise de Preços</div>
                {skuProduto && (
                  <div className="flex items-center gap-1 text-sm font-normal text-muted-foreground">
                    <Hash className="h-3 w-3" />
                    <span className="font-mono">{skuProduto}</span>
                  </div>
                )}
              </div>
            </div>
            <button 
              onClick={() => setIsEditModalOpen(true)}
              className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500"
              title="Editar descrição"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path><path d="m15 5 4 4"></path></svg>
            </button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center mb-4">
            {skuProduto && (
              <div className="mr-4 w-24 h-24 flex-shrink-0">
                {/* Imagem do produto */}
                <img 
                  src={fetchImageBySKU(skuProduto)}
                  alt={`Imagem de ${descricao}`}
                  className="w-full h-full object-cover rounded-md"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                  }}
                />
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-grow">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-muted-foreground">Última compra</p>
                <p className="text-2xl font-bold text-blue-600">R$ {formatarValorToBR(latestPurchase.preco)}</p>
              </div>

              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-muted-foreground">Seu Custo Médio</p>
                <p className="text-2xl font-bold text-green-600">R$ {formatarValorToBR(averagePaid)}</p>
              </div>

              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <p className="text-sm text-muted-foreground">Total Gastos</p>
                <p className="text-2xl font-bold text-purple-600">R$ {formatarValorToBR(totalSpent)}</p>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 border rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Comparação de Preços</h3>
                <p className="text-sm text-muted-foreground">Última compra vs seu médio</p>
              </div>
              <div className="flex items-center gap-2">
                {isCurrentCheaper ? (
                  <>
                    <TrendingDown className="h-4 w-4 text-green-500" />
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      R$ {formatarValorToBR(Math.abs(precoDifference))} mais barato
                    </Badge>
                  </>
                ) : (
                  <>
                    <TrendingUp className="h-4 w-4 text-red-500" />
                    <Badge variant="secondary" className="bg-red-100 text-red-800">
                      R$ {formatarValorToBR(Math.abs(precoDifference))} mais caro
                    </Badge>
                  </>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Histórico de compras
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {sortedPurchases.map((purchase) => (
              <div key={purchase.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Store className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">R$ {formatarValorToBR(purchase.preco)}</p>
                    <p className="text-sm text-muted-foreground">{purchase.local}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{formatarDataParaBR(purchase.data)}</p>
                  <div className="flex items-center gap-1">
                    {purchase.preco <= averagePaid ? (
                      <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                        Boa oferta
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="bg-red-100 text-red-800 text-xs">
                        Acima do preço
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Modal de Edição */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            <h3 className="text-lg font-semibold mb-4">Editar Descrição do Produto</h3>
            
            <div className="mb-4">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Descrição
              </label>
              <input
                type="text"
                id="description"
                className="w-full p-2 border rounded-md"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
              />
            </div>
            
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setIsEditModalOpen(false)
                  setNewDescription(descricao)
                }}
                className="px-4 py-2 border rounded-md hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleSaveDescription(skuProduto)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
