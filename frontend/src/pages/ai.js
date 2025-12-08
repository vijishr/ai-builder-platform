import { useState } from 'react';
import { useRouter } from 'next/router';

export default function AIGenerator() {
  const router = useRouter();
  const [generationType, setGenerationType] = useState('');
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');

  const handleGenerate = async () => {
    if (!generationType || !prompt.trim()) {
      alert('Please select a generation type and enter a prompt');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/v1/ai/${generationType}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify({ prompt })
      });

      const data = await response.json();
      if (response.ok) {
        setResult(data.data?.result || 'Generation completed');
      } else {
        alert(data.message || 'Generation failed');
      }
    } catch (error) {
      alert('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <button
            onClick={() => router.back()}
            className="mb-6 px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            ← Back
          </button>

          <h1 className="text-4xl font-bold mb-2 text-gray-900">AI Generator</h1>
          <p className="text-gray-600 mb-8">Generate content using advanced AI</p>

          <div className="space-y-6">
            {/* Generation Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                What would you like to generate?
              </label>
              <select
                value={generationType}
                onChange={(e) => setGenerationType(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="">Select an option...</option>
                <option value="generate-content">Content</option>
                <option value="generate-code">Code</option>
                <option value="generate-website">Website HTML</option>
                <option value="generate-app">App Code</option>
                <option value="generate-logo">Logo Design</option>
              </select>
            </div>

            {/* Prompt Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Describe what you want
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Enter your prompt here..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                rows="6"
              />
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 transition-colors"
            >
              {loading ? 'Generating...' : 'Generate'}
            </button>

            {/* Result */}
            {result && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-green-900 mb-3">Generated Result:</h3>
                <div className="bg-white p-4 rounded border border-green-100 max-h-96 overflow-auto">
                  <pre className="whitespace-pre-wrap text-sm text-gray-700">{result}</pre>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
