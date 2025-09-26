import React from 'react';

export function Tabs({ value, onValueChange, children }) {
	return <div>{children}</div>;
}

export function TabsList({ className = '', children }) {
	return <div className={className}>{children}</div>;
}

export function TabsTrigger({ value, children, ...props }) {
	return (
		<button {...props} className="px-3 py-2 text-sm border rounded-md">
			{children}
		</button>
	);
}

export function TabsContent({ value, children, className = '' }) {
	return <div className={className}>{children}</div>;
}



