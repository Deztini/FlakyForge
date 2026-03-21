import { useState } from 'react';
import { Button } from '../Button';

interface EmailLoginFormProps {
  onSubmit: (email: string, password: string) => void;
}

export function EmailLoginForm({ onSubmit }: EmailLoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(email, password);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label className="block text-[#94A3B8] text-[13px] mb-1.5 font-normal">
          Email address
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full h-11 bg-[#0F1117] border border-[#2D3148] rounded-lg px-4 text-white text-[14px] focus:border-[#6C63FF] focus:outline-none transition-colors"
          placeholder="you@example.com"
        />
      </div>

      <div>
        <label className="block text-[#94A3B8] text-[13px] mb-1.5 font-normal">
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full h-11 bg-[#0F1117] border border-[#2D3148] rounded-lg px-4 text-white text-[14px] focus:border-[#6C63FF] focus:outline-none transition-colors"
          placeholder="••••••••"
        />
      </div>

      <Button
        type="submit"
        className="w-full h-11 bg-[#6C63FF] hover:bg-[#5B52E8] transition-colors rounded-lg text-white text-[15px] font-medium mt-4"
      >
        Sign In
      </Button>
    </form>
  );
}