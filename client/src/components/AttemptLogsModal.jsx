import { useState, useEffect } from 'react';
import API from '../api/axios';
import { X, Clock, Code, Send, Calendar } from 'lucide-react';

const AttemptLogsModal = ({ isOpen, onClose, problem, onAttemptAdded }) => {
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    confidence_score: 3,
    time_spent_minutes: 20,
    code_solution: '',
    notes: '',
  });

  useEffect(() => {
    if (!problem || !isOpen) return;

    let isMounted = true;
    const fetchAttempts = async () => {
      setLoading(true);
      setError('');
      try {
        // GET /api/problems/<problem_id>/attempts
        const res = await API.get(`/problems/${problem.id}/attempts`);
        if (isMounted) setAttempts(res.data);
      } catch {
        if (isMounted) setError('Failed to load attempt logs.');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchAttempts();

    return () => {
      isMounted = false;
    };
  }, [problem, isOpen]);

  if (!isOpen || !problem) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'confidence_score' || name === 'time_spent_minutes' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      // POST /api/problems/<problem_id>/attempts
      const res = await API.post(`/problems/${problem.id}/attempts`, formData);
      const newAttempt = res.data.attempt;

      setAttempts((prev) => [newAttempt, ...prev]);
      
      // Notify parent Dashboard to increment total_attempts
      if (onAttemptAdded) {
        onAttemptAdded(problem.id);
      }

      // Reset form text fields
      setFormData((prev) => ({
        ...prev,
        code_solution: '',
        notes: '',
      }));
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to log attempt.');
    } finally {
      setSubmitting(false);
    }
  };

  const getConfidenceBadge = (score) => {
    if (score >= 4) return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    if (score === 3) return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
    return 'bg-red-500/10 text-red-400 border-red-500/20';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl relative overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-start justify-between bg-slate-950/50">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs px-2.5 py-0.5 rounded-full border border-slate-700 bg-slate-800 text-slate-300 font-medium">
                {problem.pattern_category}
              </span>
              <span className="text-xs text-slate-500">•</span>
              <span className="text-xs text-slate-400">{problem.difficulty}</span>
            </div>
            <h2 className="text-xl font-bold text-white">{problem.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-800 overflow-y-auto">
          {/* Left Column: Form to Log New Attempt */}
          <div className="p-6">
            <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Send className="w-4 h-4 text-emerald-400" /> Log New Attempt
            </h3>

            {error && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-lg">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Confidence Score ({formData.confidence_score} / 5)
                </label>
                <input
                  type="range"
                  name="confidence_score"
                  min="1"
                  max="5"
                  value={formData.confidence_score}
                  onChange={handleChange}
                  className="w-full accent-emerald-500 bg-slate-950 h-2 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                  <span>1 - Lost</span>
                  <span>3 - Okay</span>
                  <span>5 - Mastered</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Time Spent (Minutes)
                </label>
                <input
                  type="number"
                  name="time_spent_minutes"
                  min="1"
                  required
                  value={formData.time_spent_minutes}
                  onChange={handleChange}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Code Solution (Optional)
                </label>
                <textarea
                  name="code_solution"
                  rows="3"
                  value={formData.code_solution}
                  onChange={handleChange}
                  placeholder="// Paste your code solution here..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs font-mono text-emerald-400 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Notes / Lessons Learned
                </label>
                <textarea
                  name="notes"
                  rows="2"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Key edge cases or takeaway patterns..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold py-2 rounded-lg text-sm transition-colors disabled:opacity-50"
              >
                {submitting ? 'Saving Attempt...' : 'Save Attempt Log'}
              </button>
            </form>
          </div>

          {/* Right Column: History Timeline */}
          <div className="p-6 bg-slate-950/30 flex flex-col">
            <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-400" /> Past Logs ({attempts.length})
            </h3>

            {loading ? (
              <div className="text-xs text-slate-500 py-8 text-center">Loading attempts...</div>
            ) : attempts.length === 0 ? (
              <div className="text-xs text-slate-500 py-8 text-center">
                No attempt logs yet for this problem.
              </div>
            ) : (
              <div className="space-y-3 overflow-y-auto max-h-[380px] pr-1">
                {attempts.map((attempt) => (
                  <div
                    key={attempt.id}
                    className="p-3.5 bg-slate-900 border border-slate-800 rounded-lg space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`px-2 py-0.5 rounded border font-medium ${getConfidenceBadge(
                          attempt.confidence_score
                        )}`}
                      >
                        Score: {attempt.confidence_score}/5
                      </span>
                      <span className="text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-500" />
                        {attempt.time_spent_minutes} mins
                      </span>
                    </div>

                    {attempt.notes && (
                      <p className="text-slate-300 italic bg-slate-950/50 p-2 rounded border border-slate-800/50">
                        "{attempt.notes}"
                      </p>
                    )}

                    {attempt.code_solution && (
                      <details className="group">
                        <summary className="cursor-pointer text-slate-400 hover:text-emerald-400 flex items-center gap-1 text-[11px]">
                          <Code className="w-3 h-3" /> View Code
                        </summary>
                        <pre className="mt-2 p-2 bg-slate-950 rounded text-[11px] font-mono text-emerald-400 overflow-x-auto border border-slate-800">
                          {attempt.code_solution}
                        </pre>
                      </details>
                    )}

                    <div className="text-[10px] text-slate-500 text-right">
                      {new Date(attempt.created_at).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttemptLogsModal;