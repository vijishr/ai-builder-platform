# Advanced Reasoning Agent - Real-World Examples

**Version:** 1.0.0  
**Date:** December 7, 2025

## Overview

This guide provides practical, copy-paste examples for using the Advanced Reasoning Agent in real-world scenarios.

---

## Example 1: Technology Stack Selection

### Scenario
You need to choose a technology stack for a new web application.

### Objective
```
Select the best technology stack for a real-time collaborative document editor 
with 100K+ concurrent users, requiring low latency, high throughput, and 
excellent developer experience.
```

### Context
```json
{
  "budget": "moderate",
  "teamExperience": "intermediate",
  "deploymentTarget": "cloud",
  "scalability": "critical",
  "latencyRequirement": "sub-100ms"
}
```

### Frontend Implementation

```javascript
const [result, setResult] = useState(null)

async function selectTechStack() {
  const response = await api.post('/reasoning/reason', {
    objective: `Select the best technology stack for a real-time collaborative document editor 
with 100K+ concurrent users, requiring low latency, high throughput, and 
excellent developer experience.`,
    context: {
      budget: "moderate",
      teamExperience: "intermediate",
      deploymentTarget: "cloud",
      scalability: "critical",
      latencyRequirement: "sub-100ms"
    },
    autoExecute: true,
    maxSteps: 10
  })

  setResult(response.data.data)
  
  console.log('Recommended Stack:', response.data.data.execution.finalResult)
}
```

### Expected Output

```
Plan Generation:
- Step 1: Search for real-time collaboration technologies
- Step 2: Search for low-latency solutions
- Step 3: Analyze team capability requirements
- Step 4: Synthesize findings into recommendations

Execution Results:
- Step 1: Found WebSocket frameworks, CRDT libraries (Yjs, Automerge)
- Step 2: Found Edge computing options, CDN solutions
- Step 3: Identified need for strong async/reactive skills
- Step 4: Generated detailed stack recommendations

Final Synthesis:
Summary: "Node.js + React + WebSocket + PostgreSQL recommended for this use case"
Key Insights:
  - CRDT libraries (Yjs) essential for conflict-free synchronization
  - Redis recommended for session/cache layer
  - Consider edge functions for latency optimization
Recommendations:
  - Backend: Node.js with Express + Socket.io
  - Frontend: React + TipTap (with Yjs)
  - Database: PostgreSQL + Redis
  - Deployment: Vercel (edge) + AWS (backend)
```

---

## Example 2: Customer Data Analysis

### Scenario
Analyze customer feedback to identify satisfaction trends and improvement areas.

### Objective
```
Analyze customer feedback data from Q4 2025 to identify satisfaction patterns,
common pain points, and feature requests with high demand.
```

### Context
```json
{
  "timeframe": "Q4 2025",
  "minConfidence": 0.75,
  "focusAreas": ["pricing", "features", "support"],
  "customerSegments": ["enterprise", "SMB", "startup"]
}
```

### API Call

```powershell
$token = "YOUR_JWT_TOKEN"

$body = @{
    objective = @"
Analyze customer feedback data from Q4 2025 to identify satisfaction patterns,
common pain points, and feature requests with high demand.
"@
    context = @{
        timeframe = "Q4 2025"
        minConfidence = 0.75
        focusAreas = @("pricing", "features", "support")
        customerSegments = @("enterprise", "SMB", "startup")
    }
    autoExecute = $true
    maxSteps = 12
} | ConvertTo-Json -Depth 5

$response = Invoke-WebRequest -Uri "http://localhost:5000/api/v1/reasoning/reason" `
    -Method POST `
    -Headers @{ "Authorization" = "Bearer $token"; "Content-Type" = "application/json" } `
    -Body $body

$result = $response.Content | ConvertFrom-Json
Write-Host "Analysis Complete!" -ForegroundColor Green
Write-Host ($result.data.execution.finalResult | ConvertTo-Json -Depth 10)
```

### Expected Output

```
Key Findings:
- 68% of customers satisfied with core features (↑12% from Q3)
- Pricing complaints decreased 23% after October revision
- Top 3 feature requests: API webhooks, SSO, Advanced reporting

Satisfaction by Segment:
- Enterprise: 82% satisfaction (wants webhooks, SSO)
- SMB: 71% satisfaction (wants better support)
- Startup: 65% satisfaction (wants lower pricing tier)

Improvement Opportunities:
1. Implement webhook API (78 mentions)
2. Add SSO integration (64 mentions)
3. Expand support hours (42 mentions)
4. Create pricing tier for startups (38 mentions)

Risk Areas:
- Customer churn risk: 12% of SMB customers unhappy with support
- Pricing: 15% on verge of switching to competitors
```

---

## Example 3: Machine Learning Model Selection

### Scenario
Choose the best ML model for your specific use case.

### Objective
```
Recommend the best machine learning model for predicting customer churn
in a SaaS company with 50,000 active users, 24 months historical data,
and real-time prediction requirements.
```

### Context
```json
{
  "dataSize": "50000 users",
  "historicalData": "24 months",
  "features": "200+",
  "realTimeRequired": true,
  "inferenceLatency": "< 100ms",
  "accuracy": "target 85%+",
  "teamSkills": "intermediate ML"
}
```

### JavaScript Example

```javascript
async function selectMLModel() {
  try {
    // Step 1: Get reasoning plan
    const planRes = await api.post('/reasoning/plan', {
      objective: `Recommend the best machine learning model for predicting customer churn
in a SaaS company with 50,000 active users, 24 months historical data,
and real-time prediction requirements.`,
      context: {
        dataSize: "50000 users",
        historicalData: "24 months",
        features: "200+",
        realTimeRequired: true,
        inferenceLatency: "< 100ms",
        accuracy: "target 85%+",
        teamSkills: "intermediate ML"
      }
    })

    const plan = planRes.data.data
    console.log('Generated Plan:', plan.steps.map(s => s.action))

    // Step 2: Execute the plan
    const execRes = await api.post('/reasoning/execute', {
      plan,
      maxSteps: 15
    })

    const results = execRes.data.data
    
    // Step 3: Display results
    console.log('=== ML Model Selection Results ===')
    results.executedSteps.forEach(step => {
      console.log(`\nStep ${step.stepNumber}: ${step.action}`)
      console.log('Result:', step.result)
    })
    
    console.log('\n=== Final Recommendation ===')
    console.log(results.finalResult)

  } catch (error) {
    console.error('Error:', error.message)
  }
}
```

### Expected Output

```
Recommended Model Comparison:

1. Logistic Regression
   - Pros: Fast inference (< 10ms), interpretable, proven
   - Cons: Limited pattern recognition
   - Score: 72/100

2. Gradient Boosting (XGBoost)
   - Pros: High accuracy (87%), handles non-linear relationships
   - Cons: Slower inference (50-80ms), harder to interpret
   - Score: 88/100 ← RECOMMENDED

3. Neural Network (Small)
   - Pros: High accuracy potential, handles feature interactions
   - Cons: Inference time borderline (80-120ms), overfitting risk
   - Score: 82/100

RECOMMENDATION: XGBoost
Rationale:
- Meets accuracy target (87% > 85%)
- Inference time within budget (50-80ms < 100ms)
- Good interpretability for business stakeholders
- Team can learn quickly (intermediate ML level)

Implementation Steps:
1. Use XGBoost with SHAP for interpretability
2. Set up feature engineering pipeline
3. Implement real-time serving with Flask/FastAPI
4. Use AWS SageMaker or Hugging Face for deployment
```

---

## Example 4: Content Marketing Strategy

### Scenario
Develop a content strategy to improve SEO and engagement.

### Objective
```
Develop a comprehensive content marketing strategy to increase organic traffic
by 150% and improve engagement metrics for a B2B SaaS product targeting
enterprise software engineers.
```

### Context
```json
{
  "currentTraffic": "5000 visitors/month",
  "targetTraffic": "12500 visitors/month",
  "targetAudience": "enterprise software engineers",
  "productType": "B2B SaaS",
  "contentBudget": "moderate",
  "timeline": "6 months"
}
```

### React Hook

```javascript
function useContentStrategy() {
  const [strategy, setStrategy] = useState(null)
  const [loading, setLoading] = useState(false)

  const generateStrategy = async () => {
    setLoading(true)
    try {
      const response = await api.post('/reasoning/reason', {
        objective: `Develop a comprehensive content marketing strategy to increase organic traffic
by 150% and improve engagement metrics for a B2B SaaS product targeting
enterprise software engineers.`,
        context: {
          currentTraffic: "5000 visitors/month",
          targetTraffic: "12500 visitors/month",
          targetAudience: "enterprise software engineers",
          productType: "B2B SaaS",
          contentBudget: "moderate",
          timeline: "6 months"
        },
        autoExecute: true,
        maxSteps: 15
      })

      setStrategy(response.data.data)
      displayStrategy(response.data.data)
    } finally {
      setLoading(false)
    }
  }

  const displayStrategy = (data) => {
    console.log('Content Strategy Generated:')
    console.log('Key Pillars:', data.execution.finalResult.keyInsights)
    console.log('Action Items:', data.execution.finalResult.recommendedAction)
  }

  return { generateStrategy, strategy, loading }
}
```

### Expected Output

```
CONTENT MARKETING STRATEGY

Goals:
- Increase monthly traffic from 5K to 12.5K visitors (+150%)
- Improve engagement: 30% increase in time-on-page
- Establish thought leadership in enterprise SaaS

Content Pillars (60% of traffic):
1. Technical Deep Dives (Security, Performance, Architecture)
   - Example: "Enterprise-Grade Authentication in Microservices"
   - Target: 10 articles in 6 months
   - Expected traffic: 1,500 visitors/month

2. Best Practices & Guides
   - Example: "DevOps Checklist for Enterprise Deployments"
   - Target: 15 guides in 6 months
   - Expected traffic: 2,000 visitors/month

3. Case Studies & Success Stories
   - Example: "How PayPal Reduced Deployment Time by 80%"
   - Target: 5-8 case studies in 6 months
   - Expected traffic: 1,200 visitors/month

SEO Strategy:
- Target keywords: "enterprise software architecture", "SaaS security", etc.
- Long-tail keywords: "how to implement OAuth 2.0 at scale"
- Topic clusters: Group 15-20 related articles per pillar

Distribution Channels:
1. Blog (40% traffic) - 30 articles
2. Developer Communities (25% traffic) - Reddit, HN, Dev.to
3. LinkedIn (20% traffic) - Executive insights
4. Email Newsletter (10% traffic) - Subscriber nurturing
5. YouTube (5% traffic) - Tutorial videos

Timeline (6 months):
Month 1: Keyword research, outline creation, team setup
Month 2-3: Create 8 core technical articles
Month 4-5: Add 7 guides and 3 case studies
Month 6: Repurpose content, build email sequences

Expected Results:
Month 1: 5,000 visitors (baseline)
Month 2: 6,200 visitors
Month 3: 7,800 visitors
Month 4: 9,500 visitors
Month 5: 11,200 visitors
Month 6: 12,500 visitors (goal reached)

KPIs to Track:
- Organic traffic growth
- Keyword rankings (top 3 keywords in top 10)
- Time-on-page (target: 4 minutes)
- Pages/session (target: 2.5+)
- Bounce rate (target: < 40%)
```

---

## Example 5: Database Optimization

### Scenario
Optimize database performance for slow queries.

### Using Direct Search API

```powershell
$token = "YOUR_JWT_TOKEN"

# First, search for optimization techniques
$searchBody = @{
    query = "database optimization indexes query performance MySQL"
    filters = @{
        category = @("performance", "optimization")
        difficulty = @("intermediate", "advanced")
    }
    limit = 20
} | ConvertTo-Json

$searchResponse = Invoke-WebRequest -Uri "http://localhost:5000/api/v1/reasoning/search" `
    -Method POST `
    -Headers @{ "Authorization" = "Bearer $token"; "Content-Type" = "application/json" } `
    -Body $searchBody

$results = $searchResponse.Content | ConvertFrom-Json
Write-Host "Found $($results.data.resultCount) optimization techniques" -ForegroundColor Green

# Use advanced search for categorized results
$advancedBody = @{
    query = "database indexing strategy"
    facetFields = @("technique", "database", "difficulty")
} | ConvertTo-Json

$advResponse = Invoke-WebRequest -Uri "http://localhost:5000/api/v1/reasoning/search/advanced" `
    -Method POST `
    -Headers @{ "Authorization" = "Bearer $token"; "Content-Type" = "application/json" } `
    -Body $advancedBody

$advanced = $advResponse.Content | ConvertFrom-Json
Write-Host "Faceted Results:" -ForegroundColor Cyan
Write-Host ($advanced.data.facets | ConvertTo-Json)
```

---

## Example 6: Feature Prioritization

### Scenario
Determine which features to build next based on multiple factors.

### Objective
```
Prioritize the next 5 features to build for our analytics platform, considering
market demand, technical complexity, competitive advantage, and team capacity.
Focus on features that improve data visualization, automation, and API capabilities.
```

### Context
```json
{
  "teamSize": 8,
  "sprintLength": 2,
  "quarterBudget": "4 sprints",
  "competitorFeatures": "real-time dashboards, custom alerts, integrations",
  "userDemand": "top 20 feature requests analyzed"
}
```

### Full Workflow

```javascript
async function prioritizeFeatures() {
  try {
    console.log('🚀 Starting feature prioritization analysis...\n')

    // Step 1: Generate comprehensive plan
    const planRes = await api.post('/reasoning/plan', {
      objective: `Prioritize the next 5 features to build for our analytics platform, considering
market demand, technical complexity, competitive advantage, and team capacity.
Focus on features that improve data visualization, automation, and API capabilities.`,
      context: {
        teamSize: 8,
        sprintLength: 2,
        quarterBudget: "4 sprints",
        competitorFeatures: "real-time dashboards, custom alerts, integrations",
        userDemand: "top 20 feature requests analyzed"
      }
    })

    console.log('📋 Generated Plan:')
    planRes.data.data.steps.forEach((step, i) => {
      console.log(`  ${i + 1}. ${step.action}`)
    })
    console.log('')

    // Step 2: Execute full end-to-end
    const reasonRes = await api.post('/reasoning/reason', {
      objective: `Prioritize the next 5 features to build for our analytics platform, considering
market demand, technical complexity, competitive advantage, and team capacity.
Focus on features that improve data visualization, automation, and API capabilities.`,
      context: {
        teamSize: 8,
        sprintLength: 2,
        quarterBudget: "4 sprints",
        competitorFeatures: "real-time dashboards, custom alerts, integrations",
        userDemand: "top 20 feature requests analyzed"
      },
      autoExecute: true,
      maxSteps: 20
    })

    // Step 3: Display results
    const finalResult = reasonRes.data.data.execution.finalResult
    
    console.log('✅ Analysis Complete!\n')
    console.log('🎯 Summary:', finalResult.summary)
    console.log('\n💡 Key Insights:')
    finalResult.keyInsights.forEach((insight, i) => {
      console.log(`  ${i + 1}. ${insight}`)
    })
    console.log('\n📌 Recommended Actions:')
    if (Array.isArray(finalResult.recommendedAction)) {
      finalResult.recommendedAction.forEach((action, i) => {
        console.log(`  ${i + 1}. ${action}`)
      })
    } else {
      console.log(`  ${finalResult.recommendedAction}`)
    }

    return finalResult

  } catch (error) {
    console.error('❌ Error:', error.message)
    throw error
  }
}

// Usage
prioritizeFeatures().then(result => {
  // Export results
  const report = {
    timestamp: new Date().toISOString(),
    analysis: result
  }
  console.log('\nGenerated Report:', JSON.stringify(report, null, 2))
})
```

### Expected Output

```
Feature Prioritization Matrix

Score Calculation Formula:
marketDemand (40%) + competitiveValue (30%) + complexity (20%) + teamCapacity (10%)

Ranked Features:

🥇 #1 - Real-Time Dashboard Refresh
  Market Demand: 9/10 (92 user requests)
  Competitive Value: 8/10 (key competitor feature)
  Technical Complexity: 6/10 (moderate)
  Team Capacity: 8/10 (within 2 sprints)
  Estimated Effort: 80 hours (2 sprints for 8-person team)
  Priority Score: 85/100
  Rationale: High user demand, competitive necessity
  Timeline: Q1 Month 1

🥈 #2 - Custom Alert Rules Engine
  Market Demand: 8/10 (78 user requests)
  Competitive Value: 7/10 (competitor advantage)
  Technical Complexity: 7/10 (moderate-high)
  Team Capacity: 7/10 (2.5 sprints)
  Estimated Effort: 100 hours
  Priority Score: 78/100
  Timeline: Q1 Month 2-3

🥉 #3 - Webhook/API Webhooks
  Market Demand: 7/10 (65 requests)
  Competitive Value: 8/10 (high value)
  Technical Complexity: 5/10 (lower)
  Team Capacity: 9/10 (1.5 sprints)
  Estimated Effort: 60 hours
  Priority Score: 77/100
  Timeline: Q1 Month 1-2 (can run parallel with #1)

#4 - Advanced Filter UI Components
  Market Demand: 8/10 (user feedback)
  Competitive Value: 6/10 (somewhat common)
  Technical Complexity: 4/10 (low)
  Team Capacity: 9/10 (quick implementation)
  Estimated Effort: 40 hours
  Priority Score: 73/100
  Timeline: Q1 Month 3 (quick win)

#5 - Data Export (PDF/CSV) Enhancements
  Market Demand: 6/10 (moderate requests)
  Competitive Value: 6/10 (table stakes)
  Technical Complexity: 3/10 (very low)
  Team Capacity: 10/10 (0.5 sprints)
  Estimated Effort: 20 hours
  Priority Score: 63/100
  Timeline: Between other features

Executive Summary:
✅ Recommended Q1 Feature Roadmap:
  - Week 1-2: Real-Time Dashboard + Webhooks (parallel)
  - Week 3-4: Webhooks completion + Alert Rules start
  - Week 5-6: Alert Rules continuation + UI Components
  - Week 7-8: Data Export + Buffer for issues
  
This achieves 85% delivery confidence while maintaining quality and team morale.
```

---

## Example 7: Security Audit Recommendations

### Scenario
Comprehensive security review of application.

### Objective
```
Perform a security audit of our Node.js/React application with MongoDB backend,
identify top 10 vulnerabilities, assess risk level, and provide remediation steps
for deployment to production.
```

### Context
```json
{
  "framework": "Node.js/Express",
  "frontend": "React",
  "database": "MongoDB",
  "hasAuth": true,
  "acceptsPayments": false,
  "publicAPI": true,
  "userDataTypes": ["email", "password", "profile"]
}
```

---

## Quick Copy-Paste Templates

### Template 1: Basic Search

```javascript
async function search(query) {
  return api.post('/reasoning/search', {
    query,
    limit: 10,
    sortBy: 'relevance'
  })
}
```

### Template 2: Filtered Search

```javascript
async function filteredSearch(query, filters) {
  return api.post('/reasoning/search', {
    query,
    filters,
    limit: 20,
    sortBy: 'relevance'
  })
}
```

### Template 3: Quick Reasoning

```javascript
async function quickReason(objective) {
  return api.post('/reasoning/reason', {
    objective,
    autoExecute: true,
    maxSteps: 8
  })
}
```

### Template 4: Detailed Analysis

```javascript
async function detailedAnalysis(objective, context) {
  return api.post('/reasoning/reason', {
    objective,
    context,
    autoExecute: true,
    maxSteps: 15
  })
}
```

### Template 5: Multi-Step with Plan Review

```javascript
async function planThenExecute(objective, context) {
  // First get the plan
  const planRes = await api.post('/reasoning/plan', {
    objective,
    context
  })

  // Review plan (in real app, show to user)
  const plan = planRes.data.data
  console.log('Plan:', plan.steps)

  // Execute when ready
  const execRes = await api.post('/reasoning/execute', {
    plan,
    maxSteps: 10
  })

  return execRes.data.data
}
```

---

## Performance Tips

### For Faster Results
- Reduce `maxSteps` (default 10, can go lower)
- Use specific objectives (avoid vague requests)
- Provide relevant context (filters results)

### For Better Quality
- Increase `maxSteps` (10-15 for complex analysis)
- Provide detailed context
- Use specific, well-formed objectives

### For Cost Optimization
- Cache search results (built-in LRU cache)
- Batch similar queries
- Reuse plans when possible

---

**Version:** 1.0.0  
**Last Updated:** December 7, 2025  
**Status:** ✅ Production Ready
