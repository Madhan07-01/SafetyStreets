import React from 'react';

export function Checkbox({ id, checked, onCheckedChange }) {
	return (
		<input
			type="checkbox"
			id={id}
			checked={!!checked}
			onChange={(e) => onCheckedChange && onCheckedChange(e.target.checked)}
			className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
		/>
	);
}


