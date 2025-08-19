// src/app/(auth)/login/manager/page.tsx
'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ManagerLogin() {
	const [pin, setPin] = useState('');
	const [loading, setLoading] = useState(false);
	const router = useRouter();

	const handleKeyPress = (key: string) => {
		if (pin.length < 4 && !loading) setPin(pin + key);
	};

	const handleSubmit = async () => {
		if (pin.length === 4) {
			setLoading(true);
			await new Promise(r => setTimeout(r, 800));
			router.push('/dashboard');
		}
	};

	const keys = ['1','2','3','4','5','6','7','8','9','0'];

	return (
		<div className="min-h-screen flex">
			{/* Left: dark label panel */}
			<div className="flex-1 bg-[#111111] flex flex-col justify-between p-8">
				<div />
				<div className="text-center">
					<h1 className="text-[#d1ab35] text-4xl font-light">Manager</h1>
				</div>
				<div className="flex items-center text-gray-400 text-sm">
					<div className="w-4 h-4 bg-[#d1ab35] rounded mr-2 flex items-center justify-center">
						<span className="text-black text-xs font-bold">T</span>
					</div>
					<span>Powered by Tri Tech Technology</span>
				</div>
			</div>

			{/* Right: keypad card */}
			<div className="flex-1 bg-gray-50 flex items-center justify-center">
				<div className="bg-white rounded-3xl shadow-lg p-10 w-[360px]">
					<div className="text-center mb-8">
						<p className="text-gray-500 text-sm mb-2">WELCOME BACK</p>
						<h2 className="text-gray-900 text-lg font-medium">Log In to your Account</h2>
					</div>
					<div className="flex justify-center mb-8">
						{[0,1,2,3].map(i => (
							<div key={i} className={`w-3 h-3 rounded-full mx-1 ${i < pin.length ? 'bg-black' : 'bg-gray-300'}`} />
						))}
					</div>
					<div className="grid grid-cols-3 gap-4 mb-6">
						{keys.slice(0,9).map(n => (
							<button key={n} onClick={() => handleKeyPress(n)} disabled={loading}
								className="w-16 h-16 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center text-xl font-medium text-gray-700 transition-colors disabled:opacity-50">
								{n}
							</button>
						))}
					</div>
					<div className="flex justify-center mb-6">
						<button onClick={() => handleKeyPress('0')} disabled={loading}
							className="w-16 h-16 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center text-xl font-medium text-gray-700 transition-colors disabled:opacity-50">
							0
						</button>
					</div>
					<div className="text-center">
						<button onClick={handleSubmit} disabled={loading || pin.length !== 4}
							className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50">
							{loading ? 'LOGGING IN...' : 'LOGIN'}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}