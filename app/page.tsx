'use client';

import { useState } from 'react';

export default function HomePage() {
  const [productDescription, setProductDescription] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [hooks, setHooks] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const generateHooks = async () => {
    setIsLoading(true);
    setError('');
    setHooks([]);

    try {
      const response = await fetch('/api/generate-hooks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productDescription: productDescription,
          targetAudience: targetAudience,
        }),
      });

      if (!response.ok) {
        throw new Error('Something went wrong. Please try again.');
      }

      const data = await response.json();
      setHooks(data.hooks);
    } catch (err: any) {
      setError(err.message);
    }

    setIsLoading(false);
  };

  const copyToClipboard = (text: string) => {
    // This removes the prefix like "(Curiosity):" before copying
    const hookText = text.substring(text.indexOf(':') + 1).trim();
    navigator.clipboard.writeText(hookText);
    alert('Hook copied to clipboard!');
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-12 bg-gray-50">
      <div className="z-10 w-full max-w-4xl items-center justify-between text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          Generate Endless Marketing Hooks & Headlines
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          For Your Social Media Ads in Seconds.
        </p>

        <div className="w-full bg-white p-8 rounded-xl shadow-md">
          <div className="mb-6">
            <label htmlFor="productDescription" className="block text-left font-semibold text-gray-700 mb-2">
              1. Product/Service Description
            </label>
            <textarea
              id="productDescription"
              value={productDescription}
              onChange={(e) => setProductDescription(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition"
              rows={4}
              placeholder="e.g., An online course that teaches people how to bake sourdough bread at home."
            ></textarea>
          </div>

          <div className="mb-8">
            <label htmlFor="targetAudience" className="block text-left font-semibold text-gray-700 mb-2">
              2. Target Audience Description
            </label>
            <textarea
              id="targetAudience"
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition"
              rows={4}
              placeholder="e.g., Busy moms looking for quick meal solutions"
            ></textarea>
          </div>

          <button
            onClick={generateHooks}
            disabled={isLoading || !productDescription || !targetAudience}
            className="w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-all duration-300 text-xl"
          >
            {isLoading ? 'Brewing your brilliant hooks...' : 'Generate Hooks'}
          </button>
        </div>

        {error && <p className="text-red-500 mt-6">{error}</p>}

        {hooks.length > 0 && (
          <div className="mt-10 w-full bg-white p-8 rounded-xl shadow-md text-left">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Your Generated Hooks:</h2>
            <ul className="space-y-4">
              {hooks.map((hook, index) => (
                <li key={index} className="flex items-center justify-between p-4 bg-gray-100 rounded-lg">
                  <span className="text-gray-700">{hook}</span>
                  <button
                    onClick={() => copyToClipboard(hook)}
                    className="ml-4 bg-gray-200 text-gray-600 font-semibold py-1 px-3 rounded-md hover:bg-gray-300"
                  >
                    Copy
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </main>
  );
}