#!/bin/bash
# Test Multi-Model AI Integrations

API_URL="http://localhost:5000/api/v1"
TOKEN="your-jwt-token-here"  # Replace with real token

echo "🧪 Testing Multi-Model AI Integration"
echo "=========================================="
echo ""

# Test 1: Health Check
echo "✓ Test 1: Health Check"
curl -s "$API_URL/health" | jq '.' || echo "FAILED"
echo ""

# Test 2: Get Available Models
echo "✓ Test 2: Get Available Models"
curl -s "$API_URL/ai-models/models" \
  -H "Authorization: Bearer $TOKEN" | jq '.' || echo "FAILED"
echo ""

# Test 3: Generate with Default Model
echo "✓ Test 3: Generate with Default Model"
curl -s -X POST "$API_URL/ai-models/generate" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "What is machine learning in 2 sentences?",
    "model": "claude"
  }' | jq '.' || echo "FAILED"
echo ""

# Test 4: Generate Code
echo "✓ Test 4: Generate Code"
curl -s -X POST "$API_URL/ai-models/generate-code" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "requirements": "Create a function that validates email addresses",
    "language": "javascript",
    "model": "claude"
  }' | jq '.' || echo "FAILED"
echo ""

# Test 5: Compare Models
echo "✓ Test 5: Compare Models"
curl -s -X POST "$API_URL/ai-models/compare-models" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Explain blockchain technology",
    "models": ["claude", "openai", "gemini"]
  }' | jq '.' || echo "FAILED"
echo ""

# Test 6: Get Consensus
echo "✓ Test 6: Get Consensus"
curl -s -X POST "$API_URL/ai-models/consensus" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Best practices for database indexing"
  }' | jq '.' || echo "FAILED"
echo ""

# Test 7: Multi-turn Chat
echo "✓ Test 7: Multi-turn Chat"
curl -s -X POST "$API_URL/ai-models/chat" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What is React?",
    "model": "claude"
  }' | jq '.' || echo "FAILED"
echo ""

# Test 8: Get Agent Status
echo "✓ Test 8: Get Agent Status"
curl -s "$API_URL/ai-models/status" \
  -H "Authorization: Bearer $TOKEN" | jq '.' || echo "FAILED"
echo ""

echo "=========================================="
echo "✅ All tests completed!"
echo ""
echo "Notes:"
echo "- Replace 'your-jwt-token-here' with a real JWT token"
echo "- Tests require API keys to be configured in .env"
echo "- Some tests may fail if models are not configured"
echo ""
echo "For more info, see AI_MODELS_GUIDE.md"
