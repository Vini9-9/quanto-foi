import { type NextRequest, NextResponse } from "next/server"

// Adicione dados mock com SKUs:
const mockprecosWithSku: Record<string, { preco: number; sku: string }> = {
  "iPhone 15 Pro": { preco: 899, sku: "IPHONE15PRO-128GB-BLK" },
  "iPhone 14 Pro": { preco: 799, sku: "IPHONE14PRO-128GB-BLK" },
  "MacBook Air M2": { preco: 1099, sku: "MBA-M2-256GB-SLV" },
  "MacBook Pro M3": { preco: 1599, sku: "MBP-M3-512GB-SG" },
  "AirPods Pro": { preco: 229, sku: "AIRPODS-PRO-2ND-GEN" },
  "Samsung Galaxy S24": { preco: 799, sku: "SM-S921B-256GB-GRY" },
}

// Atualize a função GET para aceitar SKU:
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const descricao = searchParams.get("product")
  const sku = searchParams.get("sku")

  if (!descricao && !sku) {
    return NextResponse.json({ error: "Product name or SKU is required" }, { status: 400 })
  }

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Search by SKU first if provided
  if (sku) {
    const skuMatch = Object.entries(mockprecosWithSku).find(([_, data]) => data.sku.toLowerCase() === sku.toLowerCase())

    if (skuMatch) {
      const [name, data] = skuMatch
      return NextResponse.json({
        descricao: name,
        sku: data.sku,
        currentpreco: data.preco,
        source: "Market Average",
      })
    }
  }

  // Then search by product name
  if (descricao) {
    const exactMatch = mockprecosWithSku[descricao]
    if (exactMatch) {
      return NextResponse.json({
        descricao,
        sku: exactMatch.sku,
        currentpreco: exactMatch.preco,
        source: "Market Average",
      })
    }
  }

  // Return estimated preco if no match found
  return NextResponse.json({
    descricao: descricao || `Product with SKU: ${sku}`,
    sku: sku || undefined,
    currentpreco: Math.floor(Math.random() * 1000) + 100,
    source: "Estimated",
    note: "preco estimated - exact product not found",
  })
}
