export default function WorkerCodeFlowDiagram() {
  return (
    <div className="min-h-screen w-full bg-white text-gray-900 p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <header className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">ai-travel-agent-worker: Request Flow</h1>
          <p className="text-sm text-gray-600">Cloudflare Worker (<code>src/index.js</code>) orchestrating: request → OpenAI (gpt-5) → function call to OpenWeather → OpenAI finalizes → client response.</p>
        </header>

        {/* Diagram */}
        <div className="w-full overflow-auto rounded-2xl border border-gray-200 shadow p-6 bg-gray-50">
          <svg viewBox="0 0 1200 500" className="w-full h-[420px]" role="img" aria-label="Cloudflare Worker flow diagram">
            <defs>
              <marker id="arrow-blue" markerWidth="10" markerHeight="10" refX="10" refY="5" orient="auto">
                <polygon points="0 0, 10 5, 0 10" className="fill-blue-600" />
              </marker>
              <marker id="arrow-green" markerWidth="10" markerHeight="10" refX="10" refY="5" orient="auto">
                <polygon points="0 0, 10 5, 0 10" className="fill-green-600" />
              </marker>
              <marker id="arrow-orange" markerWidth="10" markerHeight="10" refX="10" refY="5" orient="auto">
                <polygon points="0 0, 10 5, 0 10" className="fill-orange-600" />
              </marker>
              <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="1.5" stdDeviation="1.5" floodOpacity="0.15" />
              </filter>
            </defs>

            {/* Swimlanes */}
            <text x="120" y="30" className="fill-blue-600 text-xs font-semibold">Client</text>
            <text x="600" y="30" className="fill-green-600 text-xs font-semibold">Cloudflare Worker</text>
            <text x="1020" y="30" className="fill-orange-600 text-xs font-semibold">External Services</text>
            <line x1="120" y1="40" x2="120" y2="460" className="stroke-gray-200" strokeDasharray="4 6" />
            <line x1="600" y1="40" x2="600" y2="460" className="stroke-gray-200" strokeDasharray="4 6" />
            <line x1="1020" y1="40" x2="1020" y2="460" className="stroke-gray-200" strokeDasharray="4 6" />

            {/* Client */}
            <g filter="url(#shadow)">
              <rect x="40" y="70" rx="12" ry="12" width="160" height="60" className="fill-blue-50 stroke-blue-300" />
            </g>
            <text x="120" y="105" textAnchor="middle" className="fill-blue-800 text-sm font-semibold">Web/Mobile App</text>

            {/* Worker */}
            <g filter="url(#shadow)">
              <rect x="510" y="70" rx="12" ry="12" width="180" height="60" className="fill-green-50 stroke-green-300" />
            </g>
            <text x="600" y="105" textAnchor="middle" className="fill-green-800 text-sm font-semibold">fetch(event)</text>

            <g filter="url(#shadow)">
              <rect x="510" y="150" rx="12" ry="12" width="180" height="60" className="fill-green-50 stroke-green-300" />
            </g>
            <text x="600" y="185" textAnchor="middle" className="fill-green-800 text-sm font-semibold">Router</text>

            <g filter="url(#shadow)">
              <rect x="510" y="230" rx="12" ry="12" width="180" height="60" className="fill-green-50 stroke-green-300" />
            </g>
            <text x="600" y="265" textAnchor="middle" className="fill-green-800 text-sm font-semibold">Middleware</text>

            <g filter="url(#shadow)">
              <rect x="510" y="310" rx="12" ry="12" width="180" height="60" className="fill-green-50 stroke-green-300" />
            </g>
            <text x="600" y="345" textAnchor="middle" className="fill-green-800 text-sm font-semibold">Handler</text>

            {/* External */}
            <g filter="url(#shadow)">
              <rect x="930" y="100" rx="12" ry="12" width="180" height="60" className="fill-orange-50 stroke-orange-300" />
            </g>
            <text x="1020" y="135" textAnchor="middle" className="fill-orange-800 text-sm font-semibold">OpenAI (gpt-5)</text>

            <g filter="url(#shadow)">
              <rect x="930" y="180" rx="12" ry="12" width="180" height="60" className="fill-orange-50 stroke-orange-300" />
            </g>
            <text x="1020" y="215" textAnchor="middle" className="fill-orange-800 text-sm font-semibold">Function Call</text>
            <text x="1020" y="233" textAnchor="middle" className="fill-gray-500 text-xs">weather_tool</text>

            <g filter="url(#shadow)">
              <rect x="930" y="260" rx="12" ry="12" width="180" height="60" className="fill-orange-50 stroke-orange-300" />
            </g>
            <text x="1020" y="295" textAnchor="middle" className="fill-orange-800 text-sm font-semibold">OpenWeather API</text>

            {/* Arrows */}
            <line x1="200" y1="100" x2="510" y2="100" className="stroke-blue-600" markerEnd="url(#arrow-blue)" />
            <text x="355" y="90" textAnchor="middle" className="fill-blue-600 text-xs">1) HTTPS request</text>

            <line x1="600" y1="370" x2="930" y2="130" className="stroke-green-600" markerEnd="url(#arrow-green)" />
            <text x="765" y="120" textAnchor="middle" className="fill-green-600 text-xs">2) call OpenAI</text>

            <line x1="1020" y1="160" x2="1020" y2="180" className="stroke-orange-600" markerEnd="url(#arrow-orange)" />
            <text x="1040" y="170" className="fill-orange-600 text-xs">tool_call</text>

            <line x1="1020" y1="240" x2="1020" y2="260" className="stroke-orange-600" markerEnd="url(#arrow-orange)" />
            <text x="1040" y="250" className="fill-orange-600 text-xs">invoke OpenWeather</text>

            <line x1="1020" y1="320" x2="1020" y2="260" className="stroke-orange-600" markerEnd="url(#arrow-orange)" />
            <text x="1040" y="305" className="fill-orange-600 text-xs">weather result</text>

            <line x1="930" y1="130" x2="600" y2="370" className="stroke-green-600" markerEnd="url(#arrow-green)" />
            <text x="765" y="360" textAnchor="middle" className="fill-green-600 text-xs">3) OpenAI final response</text>

            <line x1="510" y1="400" x2="200" y2="400" className="stroke-blue-600" markerEnd="url(#arrow-blue)" />
            <text x="355" y="390" textAnchor="middle" className="fill-blue-600 text-xs">4) respond (JSON)</text>
          </svg>
        </div>

        {/* Callouts */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-2xl border p-4 bg-white">
            <h2 className="font-semibold mb-2">Key Flow</h2>
            <ul className="list-disc ml-5 text-sm text-gray-700 space-y-1">
              <li><span className="text-blue-700 font-medium">Client</span> calls Worker endpoint.</li>
              <li><span className="text-green-700 font-medium">Worker</span> routes and validates request.</li>
              <li>Handler calls <span className="text-orange-700 font-medium">OpenAI (gpt-5)</span>.</li>
              <li>Model issues <code>tool_call</code> → <code>weather_tool</code>.</li>
              <li><span className="text-green-700 font-medium">Worker</span> invokes <span className="text-orange-700 font-medium">OpenWeather API</span>.</li>
              <li>Weather data returned to <span className="text-orange-700 font-medium">OpenAI</span> as <code>tool_result</code>.</li>
              <li><span className="text-orange-700 font-medium">OpenAI</span> finalizes answer and streams it back.</li>
              <li><span className="text-green-700 font-medium">Worker</span> responds to <span className="text-blue-700 font-medium">Client</span> (<code>JSON</code>).</li>
            </ul>
          </div>
          <div className="rounded-2xl border p-4 bg-white">
            <h2 className="font-semibold mb-2">Implementation Notes</h2>
            <ul className="list-disc ml-5 text-sm text-gray-700 space-y-1">
              <li>Secrets: <code>OPENAI_API_KEY</code>, <code>OPENWEATHER_KEY</code> from env.</li>
              <li>Model: <code>gpt-5</code> with <code>tools</code> array for function calling.</li>
              <li>Tool schema: JSON Schema for inputs (city, lat/lon).</li>
              <li><span className="text-green-700 font-medium">Worker</span> passes weather JSON to <span className="text-orange-700 font-medium">OpenAI</span> as <code>tool_result</code>.</li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
