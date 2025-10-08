"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Video, Upload, Youtube, Loader2, Sparkles } from "lucide-react"

export function VideoTranscriptModule() {
  const [youtubeUrl, setYoutubeUrl] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [optimizedTranscript, setOptimizedTranscript] = useState("")

  const handleProcess = async () => {
    if (!youtubeUrl) return

    setIsProcessing(true)
    // Simulate API call
    setTimeout(() => {
      setTranscript(
        "Welcome to our comprehensive guide on SEO optimization. In this video, we'll cover the essential strategies that can help improve your website's search engine rankings...",
      )
      setOptimizedTranscript(
        "Welcome to our comprehensive guide on **SEO optimization**. In this video, we'll cover the essential **search engine optimization strategies** that can help improve your website's **search engine rankings** and **organic traffic**...",
      )
      setIsProcessing(false)
    }, 4000)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Video className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Video Transcript Optimization</h1>
          <p className="text-muted-foreground">Generate SEO-optimized transcripts from your videos</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card/60 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle>Upload Video or YouTube Link</CardTitle>
            <CardDescription>We'll extract and optimize the transcript for SEO</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="youtube-url">YouTube URL</Label>
              <div className="flex gap-2">
                <Input
                  id="youtube-url"
                  placeholder="https://youtube.com/watch?v=..."
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  className="flex-1"
                />
                <Button variant="outline" size="icon">
                  <Youtube className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border/50" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or</span>
              </div>
            </div>

            <div className="border-2 border-dashed border-border/50 rounded-lg p-8 text-center">
              <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-sm text-muted-foreground mb-2">Drag and drop your video file here</p>
              <Button variant="outline" size="sm">
                Choose File
              </Button>
            </div>

            <Button onClick={handleProcess} disabled={isProcessing || !youtubeUrl} className="w-full">
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing Video...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate Optimized Transcript
                </>
              )}
            </Button>

            {isProcessing && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Extracting transcript...</span>
                  <span>60%</span>
                </div>
                <Progress value={60} className="h-2" />
              </div>
            )}
          </CardContent>
        </Card>

        {transcript && (
          <Card className="bg-card/60 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Original Transcript
                <Badge variant="outline">Extracted</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea value={transcript} readOnly className="min-h-[200px] bg-muted/20" />
            </CardContent>
          </Card>
        )}
      </div>

      {optimizedTranscript && (
        <Card className="bg-card/60 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              SEO-Optimized Transcript
              <Badge className="bg-gradient-to-r from-primary to-accent text-primary-foreground">
                <Sparkles className="mr-1 h-3 w-3" />
                AI Enhanced
              </Badge>
            </CardTitle>
            <CardDescription>Keywords and phrases have been optimized for better SEO performance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea value={optimizedTranscript} className="min-h-[200px] bg-background/50" readOnly />
            <div className="flex gap-2">
              <Button>Copy Transcript</Button>
              <Button variant="outline">Download as TXT</Button>
              <Button variant="outline">Export as SRT</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
