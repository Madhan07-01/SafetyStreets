import React from 'react';

export function Label({ className = '', children, htmlFor }) {
	return (
		<label htmlFor={htmlFor} className={`text-sm font-medium text-slate-700 ${className}`}>
			{children}
		</label>
	);
}



