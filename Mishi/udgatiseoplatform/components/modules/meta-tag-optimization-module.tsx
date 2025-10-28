"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Code, Loader2, Sparkles, Copy, Check, AlertCircle } from "lucide-react"

interface MetaTagSuggestions {
  title: {
    current: string
    suggested: string
    score: number
    issues: string[]
  }
  description: {
    current: string
    suggested: string
    score: number
    issues: string[]
  }
  keywords: {
    current: string
    suggested: string
    score: number
    issues: string[]
  }
}

export function MetaTagOptimizationModule() {
  const [url, setUrl] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [suggestions, setSuggestions] = useState<MetaTagSuggestions | null>(null)
  const [copiedField, setCopiedField] = useState<string | null>(null)

  const handleAnalyze = async () => {
    if (!url) return

    setIsAnalyzing(true)
    // Simulate API call
    setTimeout(() => {
      setSuggestions({
        title: {
          current: "Home - My Website",
          suggested: "Professional SEO Services & Digital Marketing Solutions | MyWebsite",
          score: 45,
          issues: ["Too short", "Missing keywords", "Not descriptive"],
        },
        description: {
          current: "Welcome to our website",
          suggested:
            "Boost your online presence with our expert SEO services, digital marketing strategies, and proven optimization techniques. Get more traffic and higher rankings today.",
          score: 30,
          issues: ["Too short", "No call to action", "Missing target keywords"],
        },
        keywords: {
          current: "",
          suggested: "SEO services, digital marketing, website optimization, search engine ranking, online marketing",
          score: 0,
          issues: ["Missing meta keywords", "No target keywords defined"],
        },
      })
      setIsAnalyzing(false)
    }, 3000)
  }

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text)
    setCopiedField(field)
    setTimeout(() => setCopiedField(null), 2000)
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500"
    if (score >= 60) return "text-yellow-500"
    return "text-red-500"
  }

  const getScoreBadge = (score: number) => {
    if (score >= 80) return "default"
    if (score >= 60) return "secondary"
    return "destructive"
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Code className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">HTML Meta Tag Optimization</h1>
          <p className="text-muted-foreground">AI-powered meta tag suggestions for better search visibility</p>
        </div>
      </div>

      <Card className="bg-card/60 backdrop-blur-sm border-border/50">
        <CardHeader>
          <CardTitle>Analyze Meta Tags</CardTitle>
          <CardDescription>Enter your website URL to get AI-powered meta tag suggestions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="url">Website URL</Label>
            <div className="flex gap-4">
              <Input
                id="url"
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleAnalyze} disabled={isAnalyzing || !url}>
                {isAnalyzing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Analyze Meta Tags
                  </>
                )}
              </Button>
            </div>
          </div>

          {isAnalyzing && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Analyzing meta tags...</span>
                <span>80%</span>
              </div>
              <Progress value={80} className="h-2" />
            </div>
          )}
        </CardContent>
      </Card>

      {suggestions && (
        <div className="space-y-6">
          {/* Title Tag */}
          <Card className="bg-card/60 backdrop-blur-sm border-border/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Title Tag</CardTitle>
                <Badge variant={getScoreBadge(suggestions.title.score)}>Score: {suggestions.title.score}/100</Badge>
              </div>
              <CardDescription>The HTML title tag that appears in search results</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Current Title</Label>
                <div className="flex gap-2">
                  <Input value={suggestions.title.current} readOnly className="bg-muted/20 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground self-center">
                    {suggestions.title.current.length} chars
                  </span>
                </div>
                {suggestions.title.issues.length > 0 && (
                  <div className="flex items-start gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                    <AlertCircle className="h-4 w-4 text-destructive mt-0.5" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-destructive">Issues found:</p>
                      <ul className="text-sm text-destructive/80 space-y-1">
                        {suggestions.title.issues.map((issue, index) => (
                          <li key={index}>• {issue}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label>AI-Suggested Title</Label>
                  <Badge className="bg-gradient-to-r from-primary to-accent text-primary-foreground text-xs">
                    <Sparkles className="mr-1 h-2 w-2" />
                    AI Enhanced
                  </Badge>
                </div>
                <div className="flex gap-2">
                  <Textarea value={suggestions.title.suggested} className="bg-background/50 min-h-[60px]" readOnly />
                  <div className="flex flex-col gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => copyToClipboard(suggestions.title.suggested, "title")}
                    >
                      {copiedField === "title" ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                    <span className="text-sm text-muted-foreground text-center">
                      {suggestions.title.suggested.length}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Meta Description */}
          <Card className="bg-card/60 backdrop-blur-sm border-border/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Meta Description</CardTitle>
                <Badge variant={getScoreBadge(suggestions.description.score)}>
                  Score: {suggestions.description.score}/100
                </Badge>
              </div>
              <CardDescription>The description that appears under your title in search results</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Current Description</Label>
                <div className="flex gap-2">
                  <Textarea
                    value={suggestions.description.current}
                    readOnly
                    className="bg-muted/20 text-muted-foreground min-h-[60px]"
                  />
                  <span className="text-sm text-muted-foreground self-center">
                    {suggestions.description.current.length} chars
                  </span>
                </div>
                {suggestions.description.issues.length > 0 && (
                  <div className="flex items-start gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                    <AlertCircle className="h-4 w-4 text-destructive mt-0.5" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-destructive">Issues found:</p>
                      <ul className="text-sm text-destructive/80 space-y-1">
                        {suggestions.description.issues.map((issue, index) => (
                          <li key={index}>• {issue}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label>AI-Suggested Description</Label>
                  <Badge className="bg-gradient-to-r from-primary to-accent text-primary-foreground text-xs">
                    <Sparkles className="mr-1 h-2 w-2" />
                    AI Enhanced
                  </Badge>
                </div>
                <div className="flex gap-2">
                  <Textarea
                    value={suggestions.description.suggested}
                    className="bg-background/50 min-h-[80px]"
                    readOnly
                  />
                  <div className="flex flex-col gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => copyToClipboard(suggestions.description.suggested, "description")}
                    >
                      {copiedField === "description" ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                    <span className="text-sm text-muted-foreground text-center">
                      {suggestions.description.suggested.length}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Meta Keywords */}
          <Card className="bg-card/60 backdrop-blur-sm border-border/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Meta Keywords</CardTitle>
                <Badge variant={getScoreBadge(suggestions.keywords.score)}>
                  Score: {suggestions.keywords.score}/100
                </Badge>
              </div>
              <CardDescription>Target keywords for your page content</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Current Keywords</Label>
                <Input
                  value={suggestions.keywords.current || "No keywords defined"}
                  readOnly
                  className="bg-muted/20 text-muted-foreground"
                />
                {suggestions.keywords.issues.length > 0 && (
                  <div className="flex items-start gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                    <AlertCircle className="h-4 w-4 text-destructive mt-0.5" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-destructive">Issues found:</p>
                      <ul className="text-sm text-destructive/80 space-y-1">
                        {suggestions.keywords.issues.map((issue, index) => (
                          <li key={index}>• {issue}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label>AI-Suggested Keywords</Label>
                  <Badge className="bg-gradient-to-r from-primary to-accent text-primary-foreground text-xs">
                    <Sparkles className="mr-1 h-2 w-2" />
                    AI Enhanced
                  </Badge>
                </div>
                <div className="flex gap-2">
                  <Input value={suggestions.keywords.suggested} className="bg-background/50" readOnly />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard(suggestions.keywords.suggested, "keywords")}
                  >
                    {copiedField === "keywords" ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-2">
            <Button className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90">
              Apply All Suggestions
            </Button>
            <Button variant="outline">Export as HTML</Button>
            <Button variant="outline">Generate Report</Button>
          </div>
        </div>
      )}
    </div>
  )
}
