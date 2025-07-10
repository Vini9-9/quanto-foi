export interface Purchase {
  id: string
  descricao: string
  sku: string // Código de barras do produto
  preco: number
  data: string
  local: string
}

export interface ProductData {
  nome: string
  sku?: string // Código de barras
  precoAtual: number
  compras: Purchase[]
}

export interface ProductResponse {
  filtros_aplicados?: Object
  total?: number
  produtos: Purchase[]
}

export interface precoComparison {
  descricao: string
  sku?: string // Código de barras
  yourpreco: number
  currentpreco: number
  difference: number
  isGoodDeal: boolean
}
