import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { Lock, Mail, AlertCircle, ShieldCheck, UserCheck, Wrench, ArrowRight } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e?: React.FormEvent, customEmail?: string, customPassword?: string) => {
    if (e) e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    const emailToUse = customEmail || email;
    const passwordToUse = customPassword || password;

    const result = await login(emailToUse, passwordToUse);

    setIsSubmitting(false);

    if (result.success) {
      navigate('/', { replace: true });
    } else {
      setErrorMessage(result.error || 'Authentication failed');
    }
  };

  const handleDemoLogin = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('Password123!');
    handleSubmit(undefined, demoEmail, 'Password123!');
  };

  return (
    <div className="min-h-screen bg-[#122117] flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#2d6a4f] text-white font-bold text-2xl shadow-lg mb-4">
          F
        </div>
        <h2 className="text-2xl font-bold text-stone-100 tracking-tight">
          FieldOps
        </h2>
        <p className="mt-1 text-sm text-stone-400">
          Field Service Dispatch & Operations Platform
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 shadow-xl rounded-2xl sm:px-10 border border-stone-200">
          {errorMessage && (
            <div className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-xs text-rose-700">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative rounded-lg shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@apexservices.lk"
                  className="block w-full pl-9 pr-3 py-2 border border-stone-300 rounded-lg text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#2d6a4f] focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative rounded-lg shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="block w-full pl-9 pr-3 py-2 border border-stone-300 rounded-lg text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#2d6a4f] focus:border-transparent transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-[#2d6a4f] hover:bg-[#204c38] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2d6a4f] transition-colors disabled:opacity-50 mt-2 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign in</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Demo Accounts */}
          <div className="mt-6 pt-6 border-t border-stone-100">
            <span className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-3 text-center">
              Demo Accounts
            </span>
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => handleDemoLogin('admin@apexservices.lk')}
                disabled={isSubmitting}
                className="w-full text-left p-2.5 rounded-lg border border-stone-200 hover:border-stone-400 hover:bg-stone-50 flex items-center justify-between text-xs transition-colors group cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-md bg-stone-100 text-stone-700">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-stone-800 block">Administrator</span>
                    <span className="text-stone-500 text-[11px]">admin@apexservices.lk</span>
                  </div>
                </div>
                <span className="text-[11px] font-semibold text-[#2d6a4f]">Select →</span>
              </button>

              <button
                type="button"
                onClick={() => handleDemoLogin('dispatch@apexservices.lk')}
                disabled={isSubmitting}
                className="w-full text-left p-2.5 rounded-lg border border-stone-200 hover:border-stone-400 hover:bg-stone-50 flex items-center justify-between text-xs transition-colors group cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-md bg-stone-100 text-stone-700">
                    <UserCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-stone-800 block">Dispatcher</span>
                    <span className="text-stone-500 text-[11px]">dispatch@apexservices.lk</span>
                  </div>
                </div>
                <span className="text-[11px] font-semibold text-[#2d6a4f]">Select →</span>
              </button>

              <button
                type="button"
                onClick={() => handleDemoLogin('kasun.technician@apexservices.lk')}
                disabled={isSubmitting}
                className="w-full text-left p-2.5 rounded-lg border border-stone-200 hover:border-stone-400 hover:bg-stone-50 flex items-center justify-between text-xs transition-colors group cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-md bg-stone-100 text-stone-700">
                    <Wrench className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-stone-800 block">Field Technician</span>
                    <span className="text-stone-500 text-[11px]">kasun.technician@apexservices.lk</span>
                  </div>
                </div>
                <span className="text-[11px] font-semibold text-[#2d6a4f]">Select →</span>
              </button>
            </div>
          </div>
        </div>

        <p className="mt-4 text-center text-xs text-stone-400">
          FieldOps • Apex Mechanical & Electrical Operations
        </p>
      </div>
    </div>
  );
};

