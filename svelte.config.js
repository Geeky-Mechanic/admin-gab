import adapter from '@sveltejs/adapter-auto';
/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter(),
		vite: {
			resolve: {
				dedupe: ['@fullcalendar/common']
			},
			optimizeDeps: {
				include: ['@fullcalendar/common'],
				exclude: ['@sendgrid/mail'],
			}
		}
	}
};

export default config;
