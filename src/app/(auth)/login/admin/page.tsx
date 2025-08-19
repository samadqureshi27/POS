// src/app/(auth)/login/admin/page.tsx
'use client';
import React, { useState } from 'react';
import LoginCard from '../../../../components/auth/LoginCard';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
	const [credentials, setCredentials] = useState({ email: '', password: '' });
	const [loading, setLoading] = useState(false);
	const router = useRouter();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		try {
			await new Promise(resolve => setTimeout(resolve, 800));
			router.push('/dashboard');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen flex">
			{/* Left: gold label panel */}
			<div className="flex-1 bg-[#d1ab35] flex flex-col justify-between p-8">
				<div />
				<div className="text-center">
					<h1 className="text-black text-4xl font-light">Admin</h1>
				</div>
				<div className="flex items-center text-black/70 text-sm">
					<div className="w-4 h-4 bg-black rounded mr-2 flex items-center justify-center">
						<span className="text-[#d1ab35] text-xs font-bold">T</span>
					</div>
					<span>Powered by Tri Tech Technology</span>
				</div>
			</div>

			{/* Right: white card form */}
			<div className="flex-1 bg-gray-50 flex items-center justify-center">
				<div className="bg-white rounded-3xl shadow-lg p-10 w-[360px]">
					<div className="text-center mb-8">
						<p className="text-gray-500 text-sm mb-2">WELCOME BACK</p>
						<h2 className="text-gray-900 text-lg font-medium">Log In to your Account</h2>
					</div>
					<form onSubmit={handleSubmit} className="space-y-4">
						<input
							type="email"
							placeholder="Email or Number"
							value={credentials.email}
							onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
							className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d1ab35]"
							required
							disabled={loading}
						/>
						<input
							type="password"
							placeholder="Password"
							value={credentials.password}
							onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
							className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d1ab35]"
							required
							disabled={loading}
						/>
						<button
							type="submit"
							disabled={loading}
							className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50"
						>
							{loading ? 'LOGGING IN...' : 'LOGIN'}
						</button>
					</form>
					<div className="mt-4 text-center">
						<a href="/login/forgot-password" className="text-sm text-gray-600 hover:text-[#d1ab35]">
							Forgot password?
						</a>
					</div>
					<div className="mt-2 text-center">
						<a href="/login" className="text-sm text-gray-600 hover:text-[#d1ab35]">
							← Back to selection
						</a>
					</div>
				</div>
			</div>
		</div>
	);
}