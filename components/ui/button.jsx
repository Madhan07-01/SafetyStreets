import React from 'react';

export function Button({ children, className = '', variant = 'default', size = 'md', ...props }) {
	const base = 'inline-flex items-center justify-center rounded-md font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none';
	const sizes = {
		sm: 'h-8 px-3 text-sm',
		md: 'h-10 px-4 text-sm',
		lg: 'h-11 px-8 text-base'
	};
	const variants = {
		default: 'bg-emerald-600 text-white hover:bg-emerald-700',
		outline: 'border border-slate-300 text-slate-700 hover:bg-slate-50',
		secondary: 'bg-white text-emerald-700 border border-emerald-200 hover:bg-slate-50'
	};
	return (
		<button className={`${base} ${sizes[size]} ${variants[variant]} ${className}`} {...props}>
			{children}
		</button>
	);
}



