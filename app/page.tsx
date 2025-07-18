"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, DollarSign, Calendar, Hash } from "lucide-react"
import ProductComparison from "./components/ProductComparison"
import AddPurchaseForm from "./components/AddPurchaseForm"
import BarcodeScanner from "./components/BarcodeScanner"
import type { Purchase } from "./lib/types"
import SearchBar from "./components/SearchBar"
import { formatarValorToBR } from "./utils/utils"
import PurchaseHistoryModal from "./PurchaseHistoryModal"
import { createProduct, fetchPurchases, mockPurchases } from "./api/services/produtos"

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null)
  const [searchType, setSearchType] = useState<"name" | "sku" | "both">("both")
  const [isScannerOpen, setIsScannerOpen] = useState(false)
  const [purchases, setPurchases] = useState<Purchase[]>(mockPurchases.produtos);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

  useEffect(() => {
    const loadPurchases = async () => {
      setIsLoading(true);
      const data = await fetchPurchases();
      setPurchases(data.produtos);
      setIsLoading(false);
    };

    loadPurchases();
  }, []);

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  // Get unique product names
  // const uniqueProducts = Array.from(new Set(purchases.map((p) => p.descricao)))

  const productsBySku = purchases.reduce((acc, purchase) => {
  if (!acc[purchase.sku]) {
    acc[purchase.sku] = purchase;
  }
  return acc;
}, {} as Record<string, Purchase>);

const uniqueProducts = Object.values(productsBySku);

  // Filter products based on search
  // const filteredProducts = uniqueProducts.filter((product) => {
  //   const productPurchases = purchases.filter((p) => p.descricao === product)
  //   const productSku = productPurchases[0]?.sku || ""

  //   const searchLower = searchTerm.toLowerCase()

  //   switch (searchType) {
  //     case "name":
  //       return product.toLowerCase().includes(searchLower)
  //     case "sku":
  //       return productSku.toLowerCase().includes(searchLower)
  //     case "both":
  //     default:
  //       return product.toLowerCase().includes(searchLower) || productSku.toLowerCase().includes(searchLower)
  //   }
  // })

  // Substitua a função filteredProducts por:
  const filteredProducts = uniqueProducts.filter((product) => {
    const searchLower = searchTerm.toLowerCase();

    switch (searchType) {
      case "name":
        return product.descricao.toLowerCase().includes(searchLower);
      case "sku":
        return product.sku.toLowerCase().includes(searchLower);
      case "both":
      default:
        return (
          product.descricao.toLowerCase().includes(searchLower) ||
          product.sku.toLowerCase().includes(searchLower)
        );
    }
  });


// Organize purchases by date
const purchasesByDate = purchases.reduce((acc, purchase) => {
  if (!acc[purchase.data]) {
    acc[purchase.data] = [];
  }
  acc[purchase.data].push(purchase);
  return acc;
}, {} as Record<string, Purchase[]>);

// Sort dates in descending order (most recent first)
const sortedDates = Object.keys(purchasesByDate).sort((a, b) => {
  return b.localeCompare(a);
});

  // Get purchases for selected product
  const selectedProductPurchases = purchases.filter((p) => {
    const product = uniqueProducts.find(prod => prod.descricao === selectedProduct);
    return product ? p.sku === product.sku : false;
  });

  // Calculate statistics
  const totalSpent = purchases.reduce((sum, purchase) => sum + purchase.preco, 0)
  const uniqueProductCount = uniqueProducts.length
  const averagepreco = totalSpent / purchases.length

  const handleAddPurchase = async (purchase: Omit<Purchase, "id">) => {
    const newPurchase = await createProduct(purchase)
    if (newPurchase) {
      setPurchases([...purchases, newPurchase])
      } else {
        alert("Não foi possível atualizar a descrição. Tente novamente.");
      }
  }

  const handleBarcodeScanned = (barcode: string) => {
    console.log("Código de barras escaneado:", barcode)
    setSearchTerm(barcode)
    setSearchType("sku")

    // Procurar produto com este código de barras
    const productWithBarcode = purchases.find((p) => p.sku === barcode)
    if (productWithBarcode) {
      setSelectedProduct(productWithBarcode.descricao)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Quanto foi?</h1>
              <p className="text-gray-600">Acompanhe suas compras e compare com os preços que já pagou</p>
            </div>
            
            <button 
              onClick={() => setIsHistoryModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <Calendar className="h-4 w-4" />
              Histórico de Compras
            </button>
          </div>
        </div>


        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Gasto</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R$ {totalSpent.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Todas as compras</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Produtos registrados</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{uniqueProductCount}</div>
              <p className="text-xs text-muted-foreground">Produtos diferentes</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Preço médio</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R$ {averagepreco.toFixed(0)}</div>
              <p className="text-xs text-muted-foreground">Por compra</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Search and Product List */}
          <div className="lg:col-span-1">
            <SearchBar
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              searchType={searchType}
              onSearchTypeChange={setSearchType}
              onScanBarcode={() => setIsScannerOpen(true)}
            />

            <Card>
              <CardHeader>
                <CardTitle>Seus produtos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {filteredProducts.map((product) => {
                    const productPurchases = purchases.filter((p) => p.sku === product.sku);
                    const totalSpentOnProduct = productPurchases.reduce((sum, p) => sum + p.preco, 0);

                    return (
                      <div
                        key={product.sku}
                        className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                          selectedProduct === product.descricao ? "bg-blue-50 border-blue-200" : "hover:bg-gray-50"
                        }`}
                        onClick={() => setSelectedProduct(product.descricao)}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="font-medium text-sm">{product.descricao}</h3>
                            {product.sku && (
                              <div className="flex items-center gap-1 mt-1">
                                <Hash className="h-3 w-3 text-muted-foreground" />
                                <span className="text-xs text-muted-foreground font-mono">{product.sku}</span>
                              </div>
                            )}
                            <p className="text-xs text-muted-foreground mt-1">
                              {productPurchases.length} compra{productPurchases.length !== 1 ? "s" : ""}
                            </p>
                          </div>
                          <Badge variant="secondary">R$ {formatarValorToBR(totalSpentOnProduct)}</Badge>
                        </div>
                      </div>
                    );
                  })}
                  {filteredProducts.length === 0 && (
                    <p className="text-muted-foreground text-sm text-center py-4">Produto não localizado</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Product Details and Add Form */}
          <div className="lg:col-span-2">
            {selectedProduct ? (
              <ProductComparison descricao={selectedProduct} purchases={selectedProductPurchases} />
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Bem vindo ao <b>Quanto foi</b></CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Selecione um produto da lista para ver comparações de preços e tendências detalhadas.
                  </p>
                  <div className="text-sm text-muted-foreground">
                    <p>• Acompanhe seu histórico de compras</p>
                    <p>• Compare com os preços que já pagou</p>
                    <p>• Escaneie códigos de barras para uma rápida pesquisa de produtos</p>
                    <p>• Identifique as melhores ofertas e tendências</p>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="mt-6">
              <AddPurchaseForm onAddPurchase={handleAddPurchase} />
            </div>
          </div>
        </div>
      </div>

      {/* Barcode Scanner Modal */}
      <BarcodeScanner
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onScanResult={handleBarcodeScanned}
      />

      {/* Purchase History Modal */}
      <PurchaseHistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        purchasesByDate={purchasesByDate}
        sortedDates={sortedDates}
      />
    </div>
  )
}
