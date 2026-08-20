"use client";

import { QRCodeSVG } from "qrcode.react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QrCode, Download, Printer, Copy } from "lucide-react";
import { useRef } from "react";
import { toast } from "sonner";

interface QRCodeDisplayProps {
  url: string;
  ticket: string;
  size?: number;
}

export function QRCodeDisplay({ url, ticket, size = 200 }: QRCodeDisplayProps) {
  const qrRef = useRef<HTMLDivElement>(null);

  // A URL já vem com o IP da rede local gerada pelo servidor (helpers.ts)
  const qrUrl = url;

  function handlePrint() {
    const svgEl = qrRef.current?.querySelector("svg");
    if (!svgEl) return;

    const svgData = new XMLSerializer().serializeToString(svgEl);
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>QR Code - Pedido #${ticket}</title>
          <style>
            body {
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              margin: 0;
              font-family: system-ui, sans-serif;
            }
            h2 { margin-bottom: 8px; color: #15803d; }
            p { margin-top: 4px; color: #666; font-size: 14px; }
            .ticket { font-family: monospace; font-size: 24px; font-weight: bold; margin: 12px 0; }
            @media print {
              body { padding: 20px; }
            }
          </style>
        </head>
        <body>
          <h2>🌿 SharkLeaf</h2>
          <div>${svgData}</div>
          <p class="ticket">#${ticket}</p>
          <p>Escaneie para rastrear seu pedido</p>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.onload = () => {
      printWindow.print();
    };
  }

  function handleDownload() {
    const svgEl = qrRef.current?.querySelector("svg");
    if (!svgEl) return;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const svgData = new XMLSerializer().serializeToString(svgEl);
    const img = new Image();
    const svgBlob = new Blob([svgData], {
      type: "image/svg+xml;charset=utf-8",
    });
    const url2 = URL.createObjectURL(svgBlob);

    img.onload = () => {
      canvas.width = size + 40;
      canvas.height = size + 80;
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 20, 10, size, size);

      // Adicionar texto do ticket
      ctx.fillStyle = "#000000";
      ctx.font = "bold 16px monospace";
      ctx.textAlign = "center";
      ctx.fillText(`#${ticket}`, canvas.width / 2, size + 35);

      ctx.fillStyle = "#666666";
      ctx.font = "12px sans-serif";
      ctx.fillText("SharkLeaf - Rastreio", canvas.width / 2, size + 55);

      const link = document.createElement("a");
      link.download = `qrcode-pedido-${ticket}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();

      URL.revokeObjectURL(url2);
    };

    img.src = url2;
  }

  async function handleCopiarLink() {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(qrUrl);
      } else {
        // Fallback para contexto sem Clipboard API (ex: http em rede local)
        const textarea = document.createElement("textarea");
        textarea.value = qrUrl;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      toast.success("Link do rastreio copiado para área de transferência");
    } catch {
      toast.error("Não foi possível copiar o link");
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-2 space-y-0 pb-2">
        <QrCode className="h-5 w-5 text-green-600" />
        <CardTitle className="text-sm font-medium">QR Code do Pedido</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4">
        <div ref={qrRef} className="rounded-lg border bg-white p-4">
          <QRCodeSVG
            value={qrUrl}
            size={size}
            level="M"
            includeMargin={false}
            bgColor="#ffffff"
            fgColor="#000000"
          />
        </div>
        <p className="font-mono text-lg font-bold text-green-700">#{ticket}</p>
        <p className="text-center text-xs text-muted-foreground">
          Escaneie para rastrear o pedido
        </p>
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
          <Button variant="outline" size="sm" onClick={handlePrint}>
            <Printer className="mr-1 h-4 w-4" />
            Imprimir
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownload}>
            <Download className="mr-1 h-4 w-4" />
            Baixar PNG
          </Button>
          <Button variant="outline" size="sm" onClick={handleCopiarLink}>
            <Copy className="mr-1 h-4 w-4" />
            Copiar Link
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
