import './styles/main.scss';

import TypeWriter from './typewriter.js';

function initTypewriter() {
	const heroTitle = document.querySelector('.hero-title');
	if (heroTitle) {
		new TypeWriter(heroTitle, "Hi, I'm Sheku — Front-end developer.", 60).start();
	}
}

function initTheme() {
	const btn = document.getElementById('theme-toggle');
	const saved = localStorage.getItem('theme');
	if (saved === 'dark') document.body.classList.replace('theme-light', 'theme-dark');
	updateThemeButton();

	function updateThemeButton() {
		if (!btn) return;
		const isDark = document.body.classList.contains('theme-dark');
		btn.textContent = isDark ? '☀️' : '🌙';
		btn.setAttribute('aria-pressed', String(isDark));
	}

	if (btn) {
		btn.addEventListener('click', () => {
			const isDark = document.body.classList.toggle('theme-dark');
			if (!document.body.classList.contains('theme-light')) document.body.classList.add('theme-light');
			localStorage.setItem('theme', isDark ? 'dark' : 'light');
			updateThemeButton();
		});
	}
}

function initMobileMenu() {
	const menuToggle = document.getElementById('menu-toggle');
	const mobileMenu = document.getElementById('mobile-menu');
	if (!menuToggle || !mobileMenu) return;
	menuToggle.addEventListener('click', () => {
		const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
		menuToggle.setAttribute('aria-expanded', String(!expanded));
		if (mobileMenu.hasAttribute('hidden')) {
			mobileMenu.removeAttribute('hidden');
			// Focus first nav link for accessibility
			const firstLink = mobileMenu.querySelector('a');
			if (firstLink) firstLink.focus();
		} else {
			mobileMenu.setAttribute('hidden', '');
		}
	});
	// Close menu when a link is clicked
	mobileMenu.addEventListener('click', (e) => {
		if (e.target.tagName === 'A') {
			mobileMenu.setAttribute('hidden', '');
			menuToggle.setAttribute('aria-expanded', 'false');
			menuToggle.focus();
		}
	});
}

function initSmoothScroll() {
	const header = document.querySelector('.site-header');
	const getHeaderHeight = () => (header ? header.getBoundingClientRect().height : 0);

	document.querySelectorAll('a[href^="#"]').forEach((link) => {
		link.addEventListener('click', (e) => {
			const href = link.getAttribute('href');
			if (!href || href === '#') return;
			const target = document.querySelector(href);
			if (target) {
				e.preventDefault();
				const y = target.getBoundingClientRect().top + window.scrollY - getHeaderHeight() - 12; // small offset
				window.scrollTo({ top: Math.max(0, Math.floor(y)), behavior: 'smooth' });

				// close mobile menu if open
				const mobileMenu = document.getElementById('mobile-menu');
				const menuToggle = document.getElementById('menu-toggle');
				if (mobileMenu && !mobileMenu.hasAttribute('hidden')) {
					mobileMenu.setAttribute('hidden', '');
					if (menuToggle) menuToggle.setAttribute('aria-expanded', 'false');
				}
			}
		});
	});
}

function initScrollReveal() {
	const revealSelector = '.section, .project-card, .card, .service-card, .experience-card';
	const observer = new IntersectionObserver((entries) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting) {
				entry.target.classList.add('is-revealed');
				// once revealed, unobserve for performance
				observer.unobserve(entry.target);
			}
		});
	}, { threshold: 0.12 });

	document.querySelectorAll(revealSelector).forEach((el) => {
		// start elements slightly offset for animation
		el.classList.add('reveal');
		observer.observe(el);
	});
}

function initActiveNavOnScroll() {
	const sections = Array.from(document.querySelectorAll('main > section[id]'));
	const navLinks = Array.from(document.querySelectorAll('.primary-nav a'));
	if (!sections.length || !navLinks.length) return;

	const findActive = () => {
		const scrollPos = window.scrollY + (window.innerHeight / 6);
		let currentId = sections[0].id;
		for (const sec of sections) {
			const top = sec.offsetTop;
			if (scrollPos >= top) currentId = sec.id;
		}

		navLinks.forEach((a) => {
			const href = a.getAttribute('href') || '';
			if (href === `#${currentId}`) a.classList.add('active'); else a.classList.remove('active');
		});
	};

	window.addEventListener('scroll', () => {
		findActive();
	}, { passive: true });
	// initial
	findActive();
}

function initContactForm() {
	const form = document.getElementById('contact-form');
	const statusEl = document.getElementById('contact-status');
	if (!form || !statusEl) return;

	form.addEventListener('submit', async (e) => {
		e.preventDefault();
		statusEl.className = 'contact-status';
		statusEl.textContent = 'Sending…';

		const formData = new FormData(form);
		const action = form.getAttribute('action') || window.location.href;

		try {
			const res = await fetch(action, {
				method: form.getAttribute('method') || 'POST',
				headers: { 'Accept': 'application/json' },
				body: formData
			});

			if (res.ok) {
				statusEl.classList.add('success');
				statusEl.textContent = 'Thanks — your message was sent.';
				form.reset();
			} else {
				const data = await res.json().catch(() => ({}));
				statusEl.classList.add('error');
				statusEl.textContent = data.error || data.message || 'Unable to send message. Please try again later.';
			}
		} catch (err) {
			statusEl.classList.add('error');
			statusEl.textContent = 'Network error — check your connection and try again.';
		}
	});
}

document.addEventListener('DOMContentLoaded', () => {
	initTypewriter();
	initTheme();
	initMobileMenu();
	initSmoothScroll();
	initContactForm();
	initScrollReveal();
	initActiveNavOnScroll();
	if (window.AOS) window.AOS.init();
});
