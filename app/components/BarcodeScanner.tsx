"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Camera, X, Scan, AlertCircle } from "lucide-react"
import { BrowserMultiFormatReader, NotFoundException } from "@zxing/library"

interface BarcodeScannerProps {
  onScanResult: (barcode: string) => void
  onClose: () => void
  isOpen: boolean
}

export default function BarcodeScanner({ onScanResult, onClose, isOpen }: BarcodeScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)
  const codeReader = useRef<BrowserMultiFormatReader | null>(null)

  useEffect(() => {
    if (isOpen) {
      initializeScanner()
    } else {
      stopScanning()
    }

    return () => {
      stopScanning()
    }
  }, [isOpen])

  const initializeScanner = async () => {
    try {
      setError(null)

      // Verificar se o navegador suporta getUserMedia
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setError("Seu navegador não suporta acesso à câmera")
        return
      }

      // Solicitar permissão para câmera
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment", // Usar câmera traseira se disponível
        },
      })

      setHasPermission(true)

      // Parar o stream temporário
      stream.getTracks().forEach((track) => track.stop())

      // Inicializar o leitor de código de barras
      codeReader.current = new BrowserMultiFormatReader()
      startScanning()
    } catch (err) {
      console.error("Erro ao acessar câmera:", err)
      setHasPermission(false)
      if (err instanceof Error) {
        if (err.name === "NotAllowedError") {
          setError("Permissão para câmera negada. Por favor, permita o acesso à câmera.")
        } else if (err.name === "NotFoundError") {
          setError("Nenhuma câmera encontrada no dispositivo.")
        } else {
          setError("Erro ao acessar a câmera: " + err.message)
        }
      }
    }
  }

  const startScanning = async () => {
    if (!codeReader.current || !videoRef.current) return

    try {
      setIsScanning(true)
      setError(null)

      await codeReader.current.decodeFromVideoDevice(
        undefined, // Usar câmera padrão
        videoRef.current,
        (result, error) => {
          if (result) {
            const barcode = result.getText()
            console.log("Código de barras detectado:", barcode)
            onScanResult(barcode)
            stopScanning()
            onClose()
          }

          if (error && !(error instanceof NotFoundException)) {
            console.error("Erro na leitura:", error)
          }
        },
      )
    } catch (err) {
      console.error("Erro ao iniciar scanner:", err)
      setError("Erro ao iniciar o scanner")
      setIsScanning(false)
    }
  }

  const stopScanning = () => {
    if (codeReader.current) {
      codeReader.current.reset()
    }
    setIsScanning(false)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Scan className="h-5 w-5" />
              Scanner de Código de Barras
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {error ? (
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-2 text-red-600">
                <AlertCircle className="h-5 w-5" />
                <span className="text-sm">{error}</span>
              </div>
              <Button onClick={initializeScanner} variant="outline">
                Tentar Novamente
              </Button>
            </div>
          ) : hasPermission === false ? (
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-2 text-amber-600">
                <Camera className="h-5 w-5" />
                <span className="text-sm">Permissão para câmera necessária</span>
              </div>
              <Button onClick={initializeScanner} variant="outline">
                Permitir Câmera
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative">
                <video ref={videoRef} className="w-full h-64 bg-black rounded-lg object-cover" playsInline muted />
                {isScanning && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="border-2 border-red-500 w-48 h-32 rounded-lg relative">
                      <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-red-500"></div>
                      <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-red-500"></div>
                      <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-red-500"></div>
                      <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-red-500"></div>
                    </div>
                  </div>
                )}
              </div>

              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground">Posicione o código de barras dentro da área vermelha</p>
                {isScanning && (
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    <span className="text-sm text-blue-600">Escaneando...</span>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={stopScanning}
                  variant="outline"
                  className="flex-1 bg-transparent"
                  disabled={!isScanning}
                >
                  Parar
                </Button>
                <Button onClick={startScanning} className="flex-1" disabled={isScanning}>
                  {isScanning ? "Escaneando..." : "Iniciar"}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
