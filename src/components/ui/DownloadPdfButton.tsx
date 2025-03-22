"use client"

import { Button } from "~/components/ui/button"
import { api } from "~/trpc/react"
import { useState } from "react"
import { Loader2 } from "lucide-react"

interface DownloadPdfButtonProps {
  reportType: 'students' | 'employees' | 'classes' | 'subjects';
  data: Array<Record<string, unknown>>;
  headers: string[];
}
export function DownloadPdfButton({ reportType }: DownloadPdfButtonProps) {
  const { mutateAsync: generateReport, isPending } = api.report.generateReport.useMutation()
  const [downloading, setDownloading] = useState(false)

  const handleDownload = async () => {
    try {
      setDownloading(true)

      const result = await generateReport({ reportType })
      if (!result?.pdf || !(result.pdf instanceof Uint8Array)) {
        throw new Error("No valid PDF data received")
      }

      // Convert Uint8Array directly to Blob
      const blob = new Blob([result.pdf], { type: "application/pdf" })

      // Create download link
      const link = document.createElement("a")
      const blobUrl = URL.createObjectURL(blob)
      link.href = blobUrl
      link.download = `${reportType}-report-${new Date().toISOString().split("T")[0]}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      // Cleanup URL object
      URL.revokeObjectURL(blobUrl)
    } catch (error: unknown) {
      let errorMessage = "Failed to generate PDF. Please try again."
      if (error instanceof Error) {
        console.error("Error generating PDF:", error.message)
        errorMessage = error.message
      } else {
        console.error("Unknown error occurred.")
      }
      alert(errorMessage)
    } finally {
      setDownloading(false)
    }
  }

  return (
    <Button
      onClick={handleDownload}
      disabled={isPending || downloading}
      className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
      aria-busy={isPending || downloading}
    >
      {(isPending || downloading) && <Loader2 className="animate-spin h-4 w-4" />}
      {isPending || downloading ? "Generating..." : `Download ${reportType} Report`}
    </Button>
  )
}
