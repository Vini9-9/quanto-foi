"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Calendar, Store, DollarSign, Hash } from "lucide-react"
import type { Purchase } from "../lib/types"
import { formatarValorToBR } from "../utils/utils"

interface ProductComparisonProps {
  descricao: string
  purchases: Purchase[]
}

// Mock current market precos
const mockCurrentprecos: Record<string, number> = {
  "iPhone 15 Pro": 899,
  "MacBook Air M2": 1099,
  "AirPods Pro": 229,
}

export default function ProductComparison({ descricao, purchases }: ProductComparisonProps) {
  const currentpreco = mockCurrentprecos[descricao] || 0
  const sortedPurchases = [...purchases].sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
  const latestPurchase = sortedPurchases[0]
  const averagePaid = purchases.reduce((sum, p) => sum + p.preco, 0) / purchases.length
  const totalSpent = purchases.reduce((sum, p) => sum + p.preco, 0)

  const precoDifference = currentpreco - latestPurchase.preco
  const isCurrentCheaper = precoDifference < 0
  const savingsVsAverage = averagePaid - currentpreco

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            <div>
              <div>{descricao} - Análise de Preços</div>
              {purchases[0]?.sku && (
                <div className="flex items-center gap-1 text-sm font-normal text-muted-foreground">
                  <Hash className="h-3 w-3" />
                  <span className="font-mono">{purchases[0].sku}</span>
                </div>
              )}
            </div>
          </CardTitle>
        </CardHeader>
       <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-muted-foreground">Preço de Mercado Atual</p>
            <p className="text-2xl font-bold text-blue-600">R$ {formatarValorToBR(currentpreco)}</p>
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

        <div className="mt-6 p-4 border rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Comparação de Preços</h3>
              <p className="text-sm text-muted-foreground">Preço atual vs sua última compra</p>
            </div>
            <div className="flex items-center gap-2">
              {isCurrentCheaper ? (
                <>
                  <TrendingDown className="h-4 w-4 text-green-500" />
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    R$ {formatarValorToBR(Math.abs(precoDifference))} mais barato agora
                  </Badge>
                </>
              ) : (
                <>
                  <TrendingUp className="h-4 w-4 text-red-500" />
                  <Badge variant="secondary" className="bg-red-100 text-red-800">
                    R$ {precoDifference} mais caro agora
                  </Badge>
                </>
              )}
            </div>
          </div>
        </div>

        {savingsVsAverage !== 0 && (
          <div className="mt-4 p-4 border rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Oportunidade de Economia</h3>
                <p className="text-sm text-muted-foreground">Preço atual vs seu médio</p>
              </div>
              <div className="flex items-center gap-2">
                {savingsVsAverage > 0 ? (
                  <>
                    <TrendingDown className="h-4 w-4 text-green-500" />
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      Economize R$ {formatarValorToBR(savingsVsAverage)}
                    </Badge>
                  </>
                ) : (
                  <>
                    <TrendingUp className="h-4 w-4 text-red-500" />
                    <Badge variant="secondary" className="bg-red-100 text-red-800">
                      R$ {Math.abs(savingsVsAverage).toFixed(0)} acima da média
                    </Badge>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
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
                  <p className="text-sm font-medium">{purchase.data}</p>
                  <div className="flex items-center gap-1">
                    {purchase.preco <= currentpreco ? (
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
    </div>
  )
}
