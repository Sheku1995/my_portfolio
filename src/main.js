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
	const overlay = document.getElementById('menu-overlay');
	if (!menuToggle || !mobileMenu) return;

	function openMenu() {
		menuToggle.setAttribute('aria-expanded', 'true');
		mobileMenu.removeAttribute('hidden');
		if (overlay) overlay.removeAttribute('hidden');
		document.documentElement.classList.add('no-scroll');
		const firstLink = mobileMenu.querySelector('a');
		if (firstLink) firstLink.focus();
	}

	function closeMenu() {
		menuToggle.setAttribute('aria-expanded', 'false');
		mobileMenu.setAttribute('hidden', '');
		if (overlay) overlay.setAttribute('hidden', '');
		document.documentElement.classList.remove('no-scroll');
		menuToggle.focus();
	}

	menuToggle.addEventListener('click', () => {
		const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
		if (expanded) closeMenu(); else openMenu();
	});

	// Close menu when a link is clicked
	mobileMenu.addEventListener('click', (e) => {
		if (e.target.tagName === 'A') {
			closeMenu();
		}
	});

	// allow clicking the overlay to close
	if (overlay) {
		overlay.addEventListener('click', closeMenu);
	}
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
				const overlay = document.getElementById('menu-overlay');
				if (mobileMenu && !mobileMenu.hasAttribute('hidden')) {
					mobileMenu.setAttribute('hidden', '');
					if (menuToggle) menuToggle.setAttribute('aria-expanded', 'false');
					if (overlay) overlay.setAttribute('hidden', '');
					document.documentElement.classList.remove('no-scroll');
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
