import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Search, Target, BarChart3, ArrowRight, Clock, AlertCircle } from "lucide-react"

export function DashboardContent() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary/10 to-accent/10 animate-gradient rounded-xl p-6 border border-border/50 hover-lift animate-slide-up">
        <h2 className="text-2xl font-bold mb-2 gradient-text">Welcome to UdgatiSEO</h2>
        <p className="text-muted-foreground mb-4 text-pretty">
          Transform your website's SEO performance with AI-powered optimization tools.
        </p>
        <Button
          className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white shadow-lg hover-lift transition-all duration-300 border-0 opacity-100"
          style={{
            background: "linear-gradient(to right, rgb(37, 99, 235), rgb(22, 163, 74))",
            color: "white",
          }}
        >
          Get Started
          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1 text-white" />
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: "Websites Optimized", value: "0", subtitle: "Start optimizing today", icon: TrendingUp },
          { title: "Keywords Extracted", value: "0", subtitle: "Ready to discover", icon: Search },
          { title: "SEO Score", value: "--", subtitle: "Analyze your site", icon: Target },
          { title: "Improvements", value: "0", subtitle: "Suggestions pending", icon: BarChart3 },
        ].map((stat, index) => (
          <Card
            key={index}
            className="glass-morphism hover-lift animate-slide-up transition-all duration-300"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.subtitle}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          {
            title: "Keyword Extraction",
            description: "Discover high-impact keywords for your content strategy",
            icon: Search,
            color: "text-primary",
          },
          {
            title: "Competitor Analysis",
            description: "Analyze competitor strategies and find opportunities",
            icon: TrendingUp,
            color: "text-accent",
          },
          {
            title: "Meta Tag Optimization",
            description: "AI-powered meta tags for better search visibility",
            icon: Target,
            color: "text-primary",
          },
        ].map((feature, index) => (
          <Card
            key={index}
            className="glass-morphism hover-lift animate-scale-in transition-all duration-300 group"
            style={{ animationDelay: `${index * 0.15}s` }}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <feature.icon className={`h-5 w-5 ${feature.color} transition-transform group-hover:scale-110`} />
                {feature.title}
              </CardTitle>
              <CardDescription className="text-pretty">{feature.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <Badge variant="secondary" className="transition-colors group-hover:bg-primary/20">
                  <Clock className="mr-1 h-3 w-3" />
                  Ready
                </Badge>
                <Button variant="outline" size="sm" className="hover-lift bg-transparent">
                  Start Analysis
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <Card className="glass-morphism hover-lift animate-slide-up">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Your latest SEO optimization activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/20 transition-colors hover:bg-muted/30">
              <AlertCircle className="h-5 w-5 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-sm font-medium">No recent activity</p>
                <p className="text-xs text-muted-foreground text-pretty">Start by entering a website URL to optimize</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
