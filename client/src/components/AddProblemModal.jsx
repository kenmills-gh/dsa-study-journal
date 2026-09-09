import { useState } from 'react';
import API from '../api/axios';
import { X, PlusCircle } from 'lucide-react';

const AddProblemModal = ({ isOpen, onClose, onProblemAdded }) => {
  const [formData, setFormData] = useState({
    title: '',
    pattern_category: 'Two Pointers',
    difficulty: 'Easy',
    external_url: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Sends pattern_category and external_url as expected by POST /api/problems
      const res = await API.post('/problems', formData);
      
      // Unwraps the nested problem object from { message, problem }
      onProblemAdded(res.data.problem);
      
      setFormData({
        title: '',
        pattern_category: 'Two Pointers',
        difficulty: 'Easy',
        external_url: '',
      });
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add problem');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-md p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-xl font-bold text-white mb-4">Add New Problem</h3>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Problem Title
            </label>
            <input
              type="text"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. 3Sum"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Pattern Category
              </label>
              <select
                name="pattern_category"
                value={formData.pattern_category}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="Two Pointers">Two Pointers</option>
                <option value="Sliding Window">Sliding Window</option>
                <option value="Fast & Slow Pointers">Fast & Slow Pointers</option>
                <option value="Monotonic Stack">Monotonic Stack</option>
                <option value="Binary Search">Binary Search</option>
                <option value="Backtracking">Backtracking</option>
                <option value="Trees & Graphs">Trees & Graphs</option>
                <option value="Dynamic Programming">Dynamic Programming</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Difficulty
              </label>
              <select
                name="difficulty"
                value={formData.difficulty}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              External URL (Optional)
            </label>
            <input
              type="url"
              name="external_url"
              value={formData.external_url}
              onChange={handleChange}
              placeholder="https://leetcode.com/problems/..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors disabled:opacity-50"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{loading ? 'Adding...' : 'Add Problem'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProblemModal;