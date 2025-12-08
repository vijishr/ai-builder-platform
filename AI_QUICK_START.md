# 🚀 Multi-Model AI - Quick Reference

## 🔑 Setup (30 seconds)

### 1. Get Free API Key
- Go to https://makersuite.google.com/app/apikey
- Click "Create API Key"
- Copy the key

### 2. Add to .env
```bash
GEMINI_API_KEY=your-key-here
```

### 3. Restart
```bash
npm run dev
```

---

## 📡 API Endpoints

### Generate
```bash
curl -X POST http://localhost:5000/api/v1/ai-models/generate \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Hello", "model": "claude"}'
```

### Compare Models
```bash
curl -X POST http://localhost:5000/api/v1/ai-models/compare-models \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"prompt": "What is AI?", "models": ["claude", "openai", "gemini"]}'
```

### Consensus
```bash
curl -X POST http://localhost:5000/api/v1/ai-models/consensus \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Best practices for React"}'
```

### Code Generation
```bash
curl -X POST http://localhost:5000/api/v1/ai-models/generate-code \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "requirements": "Create a counter component",
    "language": "javascript",
    "model": "claude"
  }'
```

### Chat
```bash
curl -X POST http://localhost:5000/api/v1/ai-models/chat \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"message": "What is React?", "model": "claude"}'
```

---

## 🎨 Frontend Usage

```jsx
import AIModels from '@/components/AIModels'

export default function Dashboard() {
  return <AIModels />
}
```

---

## 📊 Model Selection

**Quick Answer?** → Gemini (free, fastest)  
**Generate Code?** → Claude (best quality)  
**Creative Writing?** → OpenAI (GPT-4)  
**Consensus?** → All 3 models  

---

## 🔧 Configuration

```bash
# .env
OPENAI_API_KEY=sk-...
GEMINI_API_KEY=...
ANTHROPIC_API_KEY=sk-ant-...
```

Only need 1! (Gemini recommended - it's free)

---

## 💡 Smart Features

**Auto-Select**
```javascript
{ prompt: "Generate code", task: "code_generation" }
// Automatically uses Claude
```

**Cost Optimize**
```javascript
{ prompt: "Simple question", options: { costOptimize: true } }
// Uses free Gemini instead of expensive Claude
```

**Streaming**
```
POST /api/v1/ai-models/stream
// Real-time response
```

---

## 🆘 Common Issues

**No models?**
- Add API key to .env
- Restart: npm run dev

**Slow?**
- Use Gemini (fastest)
- Enable streaming
- Use cost-optimize

**Token error?**
- Check JWT token valid
- Verify Authorization header

---

## 📚 Full Docs

See **AI_MODELS_GUIDE.md** for:
- Complete API reference
- Usage examples
- Model comparison
- Advanced features
- Troubleshooting

---

## ✨ Key Advantages Over Bolt.new

✅ Multiple AI models (not locked into one)  
✅ Compare outputs (see different perspectives)  
✅ Consensus (get agreement from all)  
✅ Cost optimization (auto-select cheapest)  
✅ Auto-fallback (if one fails, try another)  
✅ Image analysis (Gemini Vision)  
✅ Extended reasoning (Claude)  
✅ Token tracking (cost management)  

---

## 🎯 Next Steps

1. Add API key to .env
2. Test an endpoint (above)
3. Use AIModels component
4. Read AI_MODELS_GUIDE.md

---

**Status:** ✅ Ready to use!  
**Server:** http://localhost:5000  
**API:** /api/v1/ai-models/*
