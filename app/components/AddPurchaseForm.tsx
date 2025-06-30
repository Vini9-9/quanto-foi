"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Plus, Scan } from "lucide-react"
import type { Purchase } from "../lib/types"
import BarcodeScanner from "./BarcodeScanner"

interface AddPurchaseFormProps {
  onAddPurchase: (purchase: Omit<Purchase, "id">) => void
}

export default function AddPurchaseForm({ onAddPurchase }: AddPurchaseFormProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isScannerOpen, setIsScannerOpen] = useState(false)
  const [formData, setFormData] = useState({
    descricao: "",
    sku: "",
    preco: "",
    date: "",
    store: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.descricao || !formData.preco || !formData.date) {
      return
    }

    onAddPurchase({
      descricao: formData.descricao,
      sku: formData.sku || undefined,
      preco: Number.parseFloat(formData.preco),
      date: formData.date,
      store: formData.store || "Unknown",
    })

    setFormData({
      descricao: "",
      sku: "",
      preco: "",
      date: "",
      store: "",
    })
    setIsOpen(false)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleBarcodeScanned = (barcode: string) => {
    setFormData((prev) => ({
      ...prev,
      sku: barcode,
    }))
  }

  if (!isOpen) {
    return (
      <Card>
        <CardContent className="pt-6">
          <Button onClick={() => setIsOpen(true)} className="w-full" variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Add New Purchase
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Add New Purchase</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="descricao">Product Name</Label>
              <Input
                id="descricao"
                value={formData.descricao}
                onChange={(e) => handleInputChange("descricao", e.target.value)}
                placeholder="e.g., iPhone 15 Pro"
                required
              />
            </div>

            <div>
              <Label htmlFor="sku">Código de Barras (Opcional)</Label>
              <div className="flex gap-2">
                <Input
                  id="sku"
                  value={formData.sku}
                  onChange={(e) => handleInputChange("sku", e.target.value)}
                  placeholder="e.g., 7891234567890"
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => setIsScannerOpen(true)}
                  title="Escanear código de barras"
                >
                  <Scan className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Código de barras do produto para facilitar a pesquisa
              </p>
            </div>

            <div>
              <Label htmlFor="preco">preco ($)</Label>
              <Input
                id="preco"
                type="number"
                step="0.01"
                value={formData.preco}
                onChange={(e) => handleInputChange("preco", e.target.value)}
                placeholder="999.99"
                required
              />
            </div>

            <div>
              <Label htmlFor="date">Purchase Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange("date", e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="store">Store (Optional)</Label>
              <Input
                id="store"
                value={formData.store}
                onChange={(e) => handleInputChange("store", e.target.value)}
                placeholder="e.g., Amazon, Best Buy"
              />
            </div>

            <div className="flex gap-2">
              <Button type="submit" className="flex-1">
                Add Purchase
              </Button>
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Barcode Scanner Modal */}
      <BarcodeScanner
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onScanResult={handleBarcodeScanned}
      />
    </>
  )
}
