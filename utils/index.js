const PAGE_TO_PATH = {
	Welcome: '/welcome',
	Dashboard: '/dashboard',
	SafeNavigation: '/safenavigation',
	Emergency: '/emergency',
	SafetyReports: '/safetyreports',
	Profile: '/profile',
	Onboarding: '/onboarding'
};

export function createPageUrl(pageName) {
	return PAGE_TO_PATH[pageName] || '/welcome';
}

export const routes = PAGE_TO_PATH;


