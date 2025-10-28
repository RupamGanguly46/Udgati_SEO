"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ImageIcon, Upload, Loader2, Sparkles, Copy, Check } from "lucide-react"

interface ImageAnalysis {
  id: string
  url: string
  originalAlt: string
  optimizedAlt: string
  confidence: number
}

export function ImageAltTextModule() {
  const [isProcessing, setIsProcessing] = useState(false)
  const [images, setImages] = useState<ImageAnalysis[]>([])
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const handleUpload = async () => {
    setIsProcessing(true)
    // Simulate API call
    setTimeout(() => {
      setImages([
        {
          id: "1",
          url: "/business-meeting-collaboration.png",
          originalAlt: "image1.jpg",
          optimizedAlt: "Professional business team meeting in modern conference room discussing strategy",
          confidence: 95,
        },
        {
          id: "2",
          url: "/laptop-coding.jpg",
          originalAlt: "",
          optimizedAlt: "Developer coding on laptop with multiple monitors showing code editor and terminal",
          confidence: 92,
        },
        {
          id: "3",
          url: "/data-analytics-dashboard.png",
          originalAlt: "chart.png",
          optimizedAlt: "Interactive data analytics dashboard displaying colorful charts and key performance metrics",
          confidence: 88,
        },
      ])
      setIsProcessing(false)
    }, 3000)
  }

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <ImageIcon className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Image Alt Text Generator</h1>
          <p className="text-muted-foreground">AI-powered alt text generation for better accessibility and SEO</p>
        </div>
      </div>

      <Card className="bg-card/60 backdrop-blur-sm border-border/50">
        <CardHeader>
          <CardTitle>Upload Images</CardTitle>
          <CardDescription>Upload your images and we'll generate optimized alt text</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border-2 border-dashed border-border/50 rounded-lg p-8 text-center">
            <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-sm text-muted-foreground mb-2">Drag and drop your images here</p>
            <p className="text-xs text-muted-foreground mb-4">Supports JPG, PNG, WebP up to 10MB each</p>
            <Button variant="outline" onClick={handleUpload} disabled={isProcessing}>
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Choose Images"
              )}
            </Button>
          </div>

          {isProcessing && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Analyzing images...</span>
                <span>75%</span>
              </div>
              <Progress value={75} className="h-2" />
            </div>
          )}
        </CardContent>
      </Card>

      {images.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Generated Alt Text</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {images.map((image) => (
              <Card key={image.id} className="bg-card/60 backdrop-blur-sm border-border/50">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Image Analysis</CardTitle>
                    <Badge variant={image.confidence > 90 ? "default" : "secondary"}>
                      {image.confidence}% confidence
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="aspect-video relative rounded-lg overflow-hidden bg-muted/20">
                    <img
                      src={image.url || "/placeholder.svg"}
                      alt={image.optimizedAlt}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-medium">Original Alt Text:</span>
                        {!image.originalAlt && (
                          <Badge variant="outline" className="text-xs">
                            Missing
                          </Badge>
                        )}
                      </div>
                      <Input
                        value={image.originalAlt || "No alt text"}
                        readOnly
                        className="bg-muted/20 text-muted-foreground"
                      />
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-medium">AI-Generated Alt Text:</span>
                        <Badge className="bg-gradient-to-r from-primary to-accent text-primary-foreground text-xs">
                          <Sparkles className="mr-1 h-2 w-2" />
                          AI Enhanced
                        </Badge>
                      </div>
                      <div className="flex gap-2">
                        <Input value={image.optimizedAlt} readOnly className="bg-background/50" />
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => copyToClipboard(image.optimizedAlt, image.id)}
                        >
                          {copiedId === image.id ? (
                            <Check className="h-4 w-4 text-green-500" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex gap-2">
            <Button>Export All Alt Text</Button>
            <Button variant="outline">Download as CSV</Button>
          </div>
        </div>
      )}
    </div>
  )
}
