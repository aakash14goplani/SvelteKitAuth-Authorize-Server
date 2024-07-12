import type { HandleServerError } from '@sveltejs/kit';

export const handleError: HandleServerError = ({ error }) => {
	const message = 'Error caught in [server-hooks]: ' + (error as any)?.message;
	console.log(message, error);
	return { message };
};
