import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "lucide-react"
import type { Purchase } from "./lib/types"
import { formatarDataParaBR, formatarValorToBR } from "./utils/utils"

type PurchaseHistoryModalProps = {
  isOpen: boolean;
  onClose: () => void;
  purchasesByDate: Record<string, Purchase[]>;
  sortedDates: string[];
}

export default function PurchaseHistoryModal({ isOpen, onClose, purchasesByDate, sortedDates }: PurchaseHistoryModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="text-xl font-bold">Histórico de Compras</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-4">
            {sortedDates.map(date => (
              <Card key={date}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-md font-medium flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    {formatarDataParaBR(date)}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {purchasesByDate[date].map(purchase => (
                      <div key={purchase.id} className="flex justify-between items-center p-2 rounded-md hover:bg-gray-50">
                        <div>
                          <p className="font-medium text-sm">{purchase.descricao}</p>
                          <p className="text-xs text-muted-foreground">{purchase.local}</p>
                        </div>
                        <Badge variant="outline">R$ {formatarValorToBR(purchase.preco)}</Badge>
                      </div>
                    ))}
                    <div className="flex justify-between items-center pt-2 border-t">
                      <span className="text-sm font-medium">Total do dia</span>
                      <span className="font-bold">
                        R$ {formatarValorToBR(purchasesByDate[date].reduce((sum, p) => sum + p.preco, 0))}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {sortedDates.length === 0 && (
              <p className="text-center text-muted-foreground">Nenhuma compra registrada.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}