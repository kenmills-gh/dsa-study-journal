import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Code2, LogOut, User } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="bg-slate-900 border-b border-slate-800 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/20">
            <Code2 className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight">DSA Journal</h1>
            <p className="text-xs text-slate-400">Pattern & Progress Tracker</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-slate-300 text-sm bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
            <User className="w-4 h-4 text-emerald-400" />
            <span>{user?.username}</span>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-2 text-sm text-slate-400 hover:text-red-400 bg-slate-950 hover:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-800 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;