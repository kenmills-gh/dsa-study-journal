import { useState, useEffect } from 'react';
import API from '../api/axios';
import Navbar from '../components/Navbar';
import AddProblemModal from '../components/AddProblemModal';
import EditProblemModal from '../components/EditProblemModal';
import AttemptLogsModal from '../components/AttemptLogsModal';
import { Plus, ExternalLink, BookOpen, Layers, Edit2, Trash2 } from 'lucide-react';

const Dashboard = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAttemptsModalOpen, setIsAttemptsModalOpen] = useState(false);
  
  const [selectedProblem, setSelectedProblem] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchProblems = async () => {
      try {
        const res = await API.get('/problems');
        if (isMounted) setProblems(res.data);
      } catch (err) {
        console.error('Failed to fetch problems', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchProblems();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleProblemAdded = (newProblem) => {
    setProblems((prev) => [newProblem, ...prev]);
  };

  const handleProblemUpdated = (updatedProblem) => {
    setProblems((prev) =>
      prev.map((p) => (p.id === updatedProblem.id ? updatedProblem : p))
    );
  };

  const handleDeleteProblem = async (problemId) => {
    if (!window.confirm('Are you sure you want to delete this problem and all its attempt history?')) {
      return;
    }

    try {
      await API.delete(`/problems/${problemId}`);
      setProblems((prev) => prev.filter((p) => p.id !== problemId));
    } catch (err) {
      console.error('Failed to delete problem', err);
      alert('Failed to delete problem. Please try again.');
    }
  };

  const handleAttemptAdded = (problemId) => {
    setProblems((prev) =>
      prev.map((p) =>
        p.id === problemId
          ? { ...p, total_attempts: (p.total_attempts || 0) + 1 }
          : p
      )
    );
  };

  const filteredProblems =
    selectedCategory === 'All'
      ? problems
      : problems.filter((p) => p.pattern_category === selectedCategory);

  const getDifficultyBadge = (difficulty) => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'Medium':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'Hard':
        return 'bg-red-500/10 text-red-400 border-red-500/20';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  const getStatusBadge = (status = 'Learning') => {
    switch (status) {
      case 'Mastered':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'Needs Review':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'Learning':
      default:
        return 'bg-sky-500/10 text-sky-400 border-sky-500/20';
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Problem Tracker</h2>
            <p className="text-slate-400 text-sm mt-1">
              Organize algorithms by patterns and track attempt histories
            </p>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold px-4 py-2.5 rounded-lg flex items-center gap-2 text-sm transition-colors shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>New Problem</span>
          </button>
        </div>

        {/* Filter bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none">
          {[
            'All',
            'Two Pointers',
            'Sliding Window',
            'Fast & Slow Pointers',
            'Monotonic Stack',
            'Binary Search',
            'Backtracking',
            'Trees & Graphs',
            'Dynamic Programming',
          ].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors border ${
                selectedCategory === cat
                  ? 'bg-emerald-500 text-slate-950 border-emerald-500'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Problem grid */}
        {loading ? (
          <div className="text-center py-12 text-slate-500">Loading problems...</div>
        ) : filteredProblems.length === 0 ? (
          <div className="text-center py-16 bg-slate-900/50 border border-slate-800 rounded-xl">
            <BookOpen className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-slate-300 font-semibold">No problems logged yet</h3>
            <p className="text-slate-500 text-sm mt-1">Click "New Problem" above to get started.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProblems.map((problem) => (
              <div
                key={problem.id}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-5 flex flex-col justify-between transition-colors group"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-semibold text-slate-100 text-lg line-clamp-1">
                      {problem.title}
                    </h3>
                    
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span
                        className={`text-[11px] px-2 py-0.5 rounded-full border font-medium ${getStatusBadge(
                          problem.status
                        )}`}
                      >
                        {problem.status || 'Learning'}
                      </span>
                      <span
                        className={`text-[11px] px-2 py-0.5 rounded-full border font-medium ${getDifficultyBadge(
                          problem.difficulty
                        )}`}
                      >
                        {problem.difficulty}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-400 mb-4">
                    <div className="flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{problem.pattern_category}</span>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => {
                          setSelectedProblem(problem);
                          setIsEditModalOpen(true);
                        }}
                        className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition-colors"
                        title="Edit problem"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteProblem(problem.id)}
                        className="text-slate-400 hover:text-red-400 p-1 rounded hover:bg-slate-800 transition-colors"
                        title="Delete problem"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                  {problem.external_url ? (
                    <a
                      href={problem.external_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-emerald-400 transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>LeetCode / Link</span>
                    </a>
                  ) : (
                    <span className="text-xs text-slate-600">No external link</span>
                  )}

                  <button
                    onClick={() => {
                      setSelectedProblem(problem);
                      setIsAttemptsModalOpen(true);
                    }}
                    className="text-xs font-semibold text-emerald-400 hover:underline"
                  >
                    Attempts: {problem.total_attempts ?? 0} →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <AddProblemModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onProblemAdded={handleProblemAdded}
      />

      <EditProblemModal
        key={selectedProblem?.id}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        problem={selectedProblem}
        onProblemUpdated={handleProblemUpdated}
      />

      <AttemptLogsModal
        isOpen={isAttemptsModalOpen}
        onClose={() => setIsAttemptsModalOpen(false)}
        problem={selectedProblem}
        onAttemptAdded={handleAttemptAdded}
      />
    </div>
  );
};

export default Dashboard;