"use client"

import { useFinancial } from "@/lib/financial-context"
import { RecommendationCard } from "@/components/recommendation-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { recommendationService } from "@/lib/api-services"
import { Sparkles, Loader2 } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

export default function RecommendationsPage() {
  const { data, updateRecommendation, addRecommendation } = useFinancial()
  const [activeTab, setActiveTab] = useState("all")
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerateRecommendations = async () => {
    setIsGenerating(true)
    try {
      // Call backend AI service to generate recommendations
      const result = await recommendationService.generate()
      
      // Add generated recommendations to the context
      if (result.recommendations && Array.isArray(result.recommendations)) {
        result.recommendations.forEach((rec: any) => {
          addRecommendation({
            title: rec.title || rec.category || 'Financial Recommendation',
            description: rec.description || rec.text || rec.detail || '',
            category: (rec.category === 'general' ? 'savings' : rec.category) || 'savings',
            status: 'pending',
          })
        })
        
        toast.success('AI Recommendations Generated!', {
          description: `Generated ${result.recommendations.length} personalized insights based on your financial data.`,
        })
      } else if (result.textSummary) {
        // If backend returns text summary, create a single recommendation
        addRecommendation({
          title: 'AI Financial Analysis',
          description: result.textSummary,
          category: 'savings',
          status: 'pending',
        })
        
        toast.success('AI Analysis Complete!', {
          description: 'Review your personalized financial insights below.',
        })
      }
    } catch (error) {
      console.error('Failed to generate recommendations:', error)
      toast.error('Failed to Generate Recommendations', {
        description: error instanceof Error ? error.message : 'Please try again later.',
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const pendingRecommendations = data.recommendations.filter((rec) => rec.status === "pending")
  const inProgressRecommendations = data.recommendations.filter((rec) => rec.status === "in-progress")
  const completedRecommendations = data.recommendations.filter((rec) => rec.status === "completed")
  const dismissedRecommendations = data.recommendations.filter((rec) => rec.status === "dismissed")

  const filteredRecommendations =
    activeTab === "all"
      ? data.recommendations
      : data.recommendations.filter((rec) => {
          if (activeTab === "pending") return rec.status === "pending"
          if (activeTab === "in-progress") return rec.status === "in-progress"
          if (activeTab === "completed") return rec.status === "completed"
          if (activeTab === "dismissed") return rec.status === "dismissed"
          return true
        })

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI Recommendations</h1>
          <p className="text-muted-foreground">Personalized financial advice based on your data</p>
        </div>
        <Button onClick={handleGenerateRecommendations} disabled={isGenerating}>
          {isGenerating ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 mr-2" />
              Generate New Insights
            </>
          )}
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-gradient-to-br from-yellow-500/10 to-amber-500/10 border-2 border-yellow-500/20 hover:shadow-lg hover:shadow-yellow-500/20 transition-all">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold bg-gradient-to-r from-yellow-600 to-amber-600 bg-clip-text text-transparent">
              {pendingRecommendations.length}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-2 border-blue-500/20 hover:shadow-lg hover:shadow-blue-500/20 transition-all">
          <CardHeader>
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              {inProgressRecommendations.length}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-2 border-green-500/20 hover:shadow-lg hover:shadow-green-500/20 transition-all">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              {completedRecommendations.length}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-gray-500/10 to-slate-500/10 border-2 border-gray-500/20 hover:shadow-lg hover:shadow-gray-500/20 transition-all">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Dismissed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold bg-gradient-to-r from-gray-600 to-slate-600 bg-clip-text text-transparent">
              {dismissedRecommendations.length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="in-progress">In Progress</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="dismissed">Dismissed</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4 mt-6">
          {filteredRecommendations.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8 text-muted-foreground">
                  <Sparkles className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium mb-2">No recommendations in this category</p>
                  <p className="text-sm">
                    {activeTab === "all"
                      ? "Add your financial data to get personalized recommendations"
                      : "Try switching to a different tab"}
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            filteredRecommendations.map((recommendation) => (
              <RecommendationCard
                key={recommendation.id}
                recommendation={recommendation}
                onStatusChange={updateRecommendation}
              />
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
