import React from 'react';

export function Progress({ value = 0, className = '' }) {
	return (
		<div className={`w-full bg-slate-200 rounded-full h-2 ${className}`}>
			<div
				className="bg-emerald-600 h-2 rounded-full"
				style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
			/>
		</div>
	);
}


