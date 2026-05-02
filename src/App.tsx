import React, { useState } from 'react';
import { analyzeReviews, SentimentReport } from './services/gemini';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';
import {
  BrainCircuit,
  MessageSquare,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  BarChart3,
  Loader2,
  FileText
} from 'lucide-react';
import { cn } from './lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [report, setReport] = useState<SentimentReport | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!inputText.trim()) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await analyzeReviews(inputText);
      setReport(data);
    } catch (err) {
      console.error(err);
      setError((err as Error).message || "Failed to analyze reviews. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const loadSampleData = () => {
    setInputText(`
Review 1 (2023-01): The interface is incredibly fast, I love it! The new dashboard is super intuitive.
Review 2 (2023-01): Great product, but customer support took 3 days to reply to my email ticket.
Review 3 (2023-02): I can't figure out how to export my data to CSV. Is this feature missing?
Review 4 (2023-02): Love the dark mode! Huge improvement for my late-night work sessions.
Review 5 (2023-03): Honestly, the pricing is getting a bit steep for the basic tier. I might switch to a competitor.
Review 6 (2023-03): Buggy on mobile. The sidebar menu overlaps with the main content on my iPhone.
Review 7 (2023-04): The latest update broke my API integrations. Nothing was communicated beforehand. Very frustrating.
Review 8 (2023-04): Phenomenal tool. It's saved our team 10 hours a week. Just wish the mobile app was better.
Review 9 (2023-05): Customer service has improved a lot! Reached out and got help in 10 minutes via live chat.
Review 10 (2023-05): API is stable now. Great job on the quick patches.
    `.trim());
  };

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <BrainCircuit className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-semibold tracking-tight">Sentiment<span className="text-indigo-600">Dash</span></h1>
          </div>
          <div className="flex items-center text-sm font-medium text-neutral-500">
            Powered by Gemini
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Input Section */}
        <section className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-neutral-100 bg-neutral-50/50 flex justify-between items-center">
            <div>
              <h2 className="text-lg font-medium text-neutral-900 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-neutral-400" />
                Raw Text Input
              </h2>
              <p className="text-sm text-neutral-500 mt-1">Paste your customer reviews, tickets, or feedback here.</p>
            </div>
            <button 
              onClick={loadSampleData}
              className="text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
            >
              Load Sample Reviews
            </button>
          </div>
          <div className="p-6">
            <textarea
              className="w-full h-48 p-4 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-y text-sm text-neutral-700 font-mono"
              placeholder="Paste hundreds of raw reviews here..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
            
            {error && (
              <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-xl flex items-start gap-3 text-sm">
                <AlertTriangle className="w-5 h-5 shrink-0" />
                <p>{error}</p>
              </div>
            )}

            <div className="mt-4 flex justify-end">
              <button
                onClick={handleAnalyze}
                disabled={isLoading || !inputText.trim()}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm shadow-indigo-200"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Analyzing Data...
                  </>
                ) : (
                  <>
                    <BarChart3 className="w-4 h-4" />
                    Generate Report
                  </>
                )}
              </button>
            </div>
          </div>
        </section>

        {/* Results Section */}
        <AnimatePresence mode="wait">
          {report && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              
              {/* Executive Summary & Key Metrics Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Summary Card */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-neutral-200 shadow-sm p-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-32 bg-indigo-50/50 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
                  <div className="relative">
                    <h3 className="text-sm font-semibold tracking-wider text-indigo-600 uppercase mb-4 flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Executive Summary
                    </h3>
                    <p className="text-lg text-neutral-700 leading-relaxed">
                      {report.summary}
                    </p>
                  </div>
                </div>

                {/* Score Cards */}
                <div className="grid grid-rows-2 gap-6">
                  <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6 flex flex-col justify-center">
                    <p className="text-sm font-medium text-neutral-500 mb-2">Overall Sentiment</p>
                    <div className="flex items-end gap-3">
                      <span className={cn(
                        "text-4xl font-bold tracking-tight",
                        report.overallSentiment >= 70 ? "text-emerald-600" :
                        report.overallSentiment >= 40 ? "text-amber-500" : "text-red-600"
                      )}>
                        {report.overallSentiment}
                      </span>
                      <span className="text-neutral-400 mb-1 font-medium">/ 100</span>
                    </div>
                    <div className="w-full bg-neutral-100 h-2 rounded-full mt-4 overflow-hidden">
                      <div 
                        className={cn(
                          "h-full rounded-full transition-all duration-1000",
                          report.overallSentiment >= 70 ? "bg-emerald-500" :
                          report.overallSentiment >= 40 ? "bg-amber-400" : "bg-red-500"
                        )}
                        style={{ width: `${report.overallSentiment}%` }}
                      />
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6 flex flex-col justify-center">
                    <p className="text-sm font-medium text-neutral-500 mb-2">Total Analyzed</p>
                    <div className="flex items-end gap-3">
                      <span className="text-4xl font-bold tracking-tight text-neutral-900">
                        {report.totalAnalyzed}
                      </span>
                      <span className="text-neutral-400 mb-1 font-medium">Reviews</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actionable Areas & Trend Chart */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Actionable Areas */}
                <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6">
                  <h3 className="text-sm font-semibold tracking-wider text-rose-600 uppercase mb-6 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    Top Areas for Improvement
                  </h3>
                  <ul className="space-y-4">
                    {report.actionableAreas.map((area, idx) => (
                      <li key={idx} className="flex gap-3 text-neutral-700 bg-rose-50/50 p-4 rounded-xl border border-rose-100/50">
                        <span className="shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-rose-100 text-rose-600 font-semibold text-xs mt-0.5">
                          {idx + 1}
                        </span>
                        <span className="text-sm font-medium leading-relaxed">{area}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Trend Chart */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-neutral-200 shadow-sm p-6 flex flex-col">
                  <h3 className="text-sm font-semibold tracking-wider text-indigo-600 uppercase mb-6 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Sentiment Over Time
                  </h3>
                  <div className="flex-1 min-h-[250px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={report.timeline} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorSentiment" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                        <XAxis 
                          dataKey="date" 
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: '#6b7280', fontSize: 12 }}
                          dy={10}
                        />
                        <YAxis 
                          domain={[0, 100]} 
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: '#6b7280', fontSize: 12 }}
                        />
                        <Tooltip 
                          contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="sentiment" 
                          stroke="#4f46e5" 
                          strokeWidth={3}
                          fillOpacity={1} 
                          fill="url(#colorSentiment)" 
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Word Cloud */}
              <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6 overflow-hidden">
                <h3 className="text-sm font-semibold tracking-wider text-neutral-600 uppercase mb-6 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Key Themes & Mentions
                </h3>
                <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4 p-8">
                  {report.wordCloud.map((word, i) => {
                    // Map weight (10-100) to font size (e.g. 0.8rem to 3rem)
                    const normalizedWeight = (word.weight - 10) / 90;
                    const fontSize = 0.875 + (normalizedWeight * 2.5);
                    const isPraise = word.type === 'praise';
                    const isComplaint = word.type === 'complaint';
                    
                    return (
                      <span
                        key={i}
                        className={cn(
                          "transition-all hover:scale-110 cursor-default px-2 py-1 rounded-lg",
                          isPraise ? "text-emerald-600 hover:bg-emerald-50" : 
                          isComplaint ? "text-rose-600 hover:bg-rose-50" : 
                          "text-neutral-500 hover:bg-neutral-100",
                          word.weight > 80 && "font-bold tracking-tight",
                          word.weight <= 80 && word.weight > 40 && "font-medium",
                        )}
                        style={{ fontSize: `${fontSize}rem` }}
                        title={`Frequency/Weight: ${word.weight} / Type: ${word.type}`}
                      >
                        {word.text}
                      </span>
                    );
                  })}
                </div>
              </div>

            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
