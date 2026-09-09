import { CheckCircle2, Code2, Flame } from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6">
      <div className="flex items-center gap-3 mb-4">
        <Code2 className="w-10 h-10 text-emerald-400" />
        <h1 className="text-3xl font-bold tracking-tight">DSA Study Journal</h1>
      </div>
      <div className="flex items-center gap-2 bg-slate-800 px-4 py-2 rounded-lg border border-slate-700">
        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
        <span className="text-slate-300">Tailwind CSS & Lucide Icons are Active!</span>
        <Flame className="w-5 h-5 text-amber-500 ml-2" />
      </div>
    </div>
  );
}

export default App;