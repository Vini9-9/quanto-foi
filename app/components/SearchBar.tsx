"use client"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Hash, Package, Scan } from "lucide-react"

interface SearchBarProps {
  searchTerm: string
  onSearchChange: (term: string) => void
  searchType: "name" | "sku" | "both"
  onSearchTypeChange: (type: "name" | "sku" | "both") => void
  onScanBarcode: () => void
}

export default function SearchBar({
  searchTerm,
  onSearchChange,
  searchType,
  onSearchTypeChange,
  onScanBarcode,
}: SearchBarProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          Pesquisar Produtos
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search Type Selector */}
        <div className="flex gap-2">
          <Button
            variant={searchType === "name" ? "default" : "outline"}
            size="sm"
            onClick={() => onSearchTypeChange("name")}
            className="flex items-center gap-1"
          >
            <Package className="h-3 w-3" />
            Nome
          </Button>
          <Button
            variant={searchType === "sku" ? "default" : "outline"}
            size="sm"
            onClick={() => onSearchTypeChange("sku")}
            className="flex items-center gap-1"
          >
            <Hash className="h-3 w-3" />
            Código
          </Button>
          <Button
            variant={searchType === "both" ? "default" : "outline"}
            size="sm"
            onClick={() => onSearchTypeChange("both")}
          >
            Ambos
          </Button>
        </div>

        {/* Search Input with Scanner Button */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={
                searchType === "name"
                  ? "Pesquisar por nome do produto..."
                  : searchType === "sku"
                    ? "Pesquisar por código de barras..."
                    : "Pesquisar por nome ou código..."
              }
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button
            onClick={onScanBarcode}
            variant="outline"
            size="icon"
            className="shrink-0 bg-transparent"
            title="Escanear código de barras"
          >
            <Scan className="h-4 w-4" />
          </Button>
        </div>

        {/* Search Tips */}
        <div className="text-xs text-muted-foreground space-y-1">
          <p>
            💡 <strong>Dicas de pesquisa:</strong>
          </p>
          <p>• Use o nome completo ou parcial do produto</p>
          <p>• Digite o código de barras para busca exata</p>
          <p>• Clique no ícone 📷 para escanear código de barras</p>
        </div>
      </CardContent>
    </Card>
  )
}
