"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, Search, ExternalLink, Loader2, Globe } from "lucide-react"

interface CompetitorData {
  domain: string
  seoScore: number
  keywords: number
  backlinks: number
  traffic: string
  topKeywords: string[]
  similarity: number
}

export function CompetitorAnalysisModule() {
  const [yourSite, setYourSite] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [competitors, setCompetitors] = useState<CompetitorData[]>([])

  const handleAnalyze = async () => {
    if (!yourSite) return

    setIsAnalyzing(true)
    setTimeout(() => {
      setCompetitors([
        {
          domain: "semrush.com",
          seoScore: 92,
          keywords: 15420,
          backlinks: 125000,
          traffic: "2.1M",
          topKeywords: ["SEO tools", "keyword research", "competitor analysis", "backlink checker", "rank tracking"],
          similarity: 95,
        },
        {
          domain: "ahrefs.com",
          seoScore: 89,
          keywords: 12850,
          backlinks: 98000,
          traffic: "1.8M",
          topKeywords: ["backlink analysis", "keyword explorer", "site audit", "rank tracker", "content gap"],
          similarity: 92,
        },
        {
          domain: "moz.com",
          seoScore: 85,
          keywords: 8900,
          backlinks: 75000,
          traffic: "950K",
          topKeywords: ["domain authority", "keyword difficulty", "link explorer", "on-page grader", "local SEO"],
          similarity: 88,
        },
        {
          domain: "spyfu.com",
          seoScore: 78,
          keywords: 6200,
          backlinks: 42000,
          traffic: "420K",
          topKeywords: ["competitor keywords", "PPC research", "SEO research", "domain overview", "keyword grouping"],
          similarity: 82,
        },
        {
          domain: "serpstat.com",
          seoScore: 74,
          keywords: 4800,
          backlinks: 28000,
          traffic: "280K",
          topKeywords: [
            "keyword clustering",
            "site audit",
            "backlink analysis",
            "rank tracking",
            "competitor research",
          ],
          similarity: 79,
        },
      ])
      setIsAnalyzing(false)
    }, 4000)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <TrendingUp className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Competitor Analysis</h1>
          <p className="text-muted-foreground">Discover similar websites and analyze their SEO strategies</p>
        </div>
      </div>

      <Card className="bg-card/60 backdrop-blur-sm border-border/50">
        <CardHeader>
          <CardTitle>Discover Competitors</CardTitle>
          <CardDescription>
            Enter your website URL to find similar websites and competitors in your niche
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="your-site">Your Website URL</Label>
            <Input
              id="your-site"
              placeholder="https://yoursite.com"
              value={yourSite}
              onChange={(e) => setYourSite(e.target.value)}
            />
          </div>

          <Button onClick={handleAnalyze} disabled={isAnalyzing || !yourSite} className="w-full">
            {isAnalyzing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Discovering Competitors...
              </>
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" />
                Find Similar Websites
              </>
            )}
          </Button>

          {isAnalyzing && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Analyzing your website and finding competitors...</span>
                <span>75%</span>
              </div>
              <Progress value={75} className="h-2" />
            </div>
          )}
        </CardContent>
      </Card>

      {competitors.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Discovered Competitors</h2>
            <Badge variant="secondary">{competitors.length} websites found</Badge>
          </div>

          <div className="grid gap-4">
            {competitors.map((competitor, index) => (
              <Card key={index} className="bg-card/60 backdrop-blur-sm border-border/50">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Globe className="h-5 w-5 text-primary" />
                      <div>
                        <CardTitle className="text-lg">{competitor.domain}</CardTitle>
                        <CardDescription>{competitor.similarity}% similarity to your website</CardDescription>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <a href={`https://${competitor.domain}`} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="mr-2 h-3 w-3" />
                        Visit Site
                      </a>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="text-center p-3 rounded-lg bg-muted/20">
                      <div className="text-xl font-bold text-primary">{competitor.seoScore}</div>
                      <div className="text-xs text-muted-foreground">SEO Score</div>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-muted/20">
                      <div className="text-xl font-bold text-accent">{competitor.keywords.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">Keywords</div>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-muted/20">
                      <div className="text-xl font-bold text-primary">{competitor.backlinks.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">Backlinks</div>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-muted/20">
                      <div className="text-xl font-bold text-accent">{competitor.traffic}</div>
                      <div className="text-xs text-muted-foreground">Monthly Traffic</div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2 text-sm">Top Keywords</h4>
                    <div className="flex flex-wrap gap-1">
                      {competitor.topKeywords.map((keyword, keywordIndex) => (
                        <Badge key={keywordIndex} variant="outline" className="text-xs">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
