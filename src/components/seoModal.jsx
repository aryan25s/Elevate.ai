import { useState , useRef, useEffect} from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function ChartRenderer({ chartConfig }) {
  const canvasRef = useRef(null);
  const chartRef  = useRef(null);

  useEffect(() => {
    if (!chartConfig || !canvasRef.current || !window.Chart) return;
    if (chartRef.current) chartRef.current.destroy();

    const colors = [
      'rgba(99,102,241,0.8)',
      'rgba(16,185,129,0.8)',
      'rgba(245,158,11,0.8)',
      'rgba(239,68,68,0.8)',
      'rgba(139,92,246,0.8)',
    ];

    chartRef.current = new window.Chart(canvasRef.current, {
      type: chartConfig.type || 'bar',
      data: {
        labels: chartConfig.data?.labels || [],
        datasets: (chartConfig.data?.datasets || []).map((ds, i) => ({
          ...ds,
          backgroundColor: colors[i % colors.length],
          borderColor:     colors[i % colors.length].replace('0.8', '1'),
          borderWidth:     1,
          borderRadius:    chartConfig.type === 'bar' ? 4 : 0,
        })),
      },
      options: {
        responsive: true,
        ...(chartConfig.options || {}),
      },
    });

    return () => chartRef.current?.destroy();
  }, [chartConfig]);

  return (
    <div
      className="mt-3 p-3 rounded-xl border border-white/8"
      style={{ background: 'rgba(255,255,255,0.03)' }}
    >
      <canvas ref={canvasRef} />
    </div>
  );
}

export default function SeoModal({ onClose }) {
  const [urls, setUrls] = useState(['', '', '']);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const updateUrl = (i, value) => {
    const copy = [...urls];
    copy[i] = value;
    setUrls(copy);
  };

  const handleAnalyze = async () => {
  console.log("Compare clicked");

  const validUrls = urls.filter(u => u.trim() !== '');
  console.log("Valid URLs:", validUrls);

  if (!validUrls.length) {
    console.warn("No URLs entered");
    return;
  }

  setLoading(true);

  try {
    console.log("Calling API...");

    const res = await fetch(`${API_URL}/seo/compare`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ urls: validUrls }),
    });

    const data = await res.json();
    console.log("API RESPONSE FULL:", data);
    console.log("INSIGHTS:", data.metadata?.insights);
    console.log("SUGGESTIONS:", data.metadata?.suggestions);

    console.log("API response:", data);

    setResult({
    sites: data.metadata?.sites || [],
    insights: data.metadata?.insights || [],
    suggestions: data.metadata?.suggestions || [],
    perSite: data.metadata?.perSite || []
    });

  } catch (err) {
    console.error("SEO ERROR:", err);
  }

  setLoading(false);
};

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="relative bg-[#0b0120]  border border-white/10 p-6 rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto custom-scroll shadow-2xl animate-[fadeIn_.2s_ease]">

        <h2 className="text-lg text-white mb-4">⭐ SEO Comparator</h2>

        {/* URL INPUTS */}
        {urls.map((url, i) => (
          <input
            key={i}
            placeholder="Enter website URL"
            value={url}
            onChange={(e) => updateUrl(i, e.target.value)}
            className="w-full mb-2 p-2 rounded bg-black/40 border border-white/10 text-sm text-white"
          />
        ))}

        <button
          onClick={handleAnalyze}
           disabled={loading}
          className="mt-3 px-4 py-2 bg-indigo-600 rounded text-sm flex items-center gap-2 disabled:opacity-50"
        >
          {loading && (
          <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          )}
        {loading ? "Analyzing..." : "Compare"}
        </button>

        {/* RESULTS */}
        {result && (
          <div className="mt-5 text-sm text-gray-300">
            {result?.sites?.length > 0 && (
  <div className="mt-4">
    <ChartRenderer
      chartConfig={{
        type: 'bar',
        data: {
          labels: result.sites.map(s => new URL(s.url).hostname),
          datasets: [
            {
              label: 'SEO Score',
              data: result.sites.map(s => s.score),
            },
          ],
        },
      }}
    />
  </div>
)}

            {/* SCORES */}
            {result.sites?.map((site, i) => {
            const explanation = result.perSite?.find(p => p.url === site.url);

            return (
            <div key={i} className="border border-white/10 p-3 rounded mb-2">
            <p className="text-white">{site.url}</p>
            <p>Score: {site.score}/100</p>

          {explanation?.analysis && (
          <p className="text-xs text-gray-400 mt-1">
            {explanation.analysis}
          </p>
          )}
    </div>
  );
})}

            {/* INSIGHTS */}
            <div className="mt-3">
            <p className="text-indigo-400 mb-1">Insights</p>

            {(result.insights || []).length > 0 ? (
            result.insights.map((i, idx) => (
            <p key={idx}>• {i}</p>
            ))
            ) : (
            <p className="text-gray-500">No insights available</p>
             )}
            </div>

            {/* SUGGESTIONS */}
            <div className="mt-3">
             <p className="text-indigo-400 mb-1">Suggestions</p>

            {(result.suggestions || []).length > 0 ? (
            result.suggestions.map((s, idx) => (
            <p key={idx}>→ {s}</p>
             ))
            ) : (
          <p className="text-gray-500">No suggestions available</p>
          )}
        </div>
          </div>
        )}

        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition"
        >
          X
        </button>
      </div>
    </div>
  );
}