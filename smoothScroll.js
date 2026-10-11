/**
 * Плавний скрол до секцій + кнопка «вгору».
 *
 * @param {string} menuSelector  Селектор посилань меню. Ціль береться з
 *                               data-goto=".selector" або з href="#id".
 * @param {object} [options]
 * @param {string|null} [options.headerSelector='header']  Хедер, висота якого віднімається
 *                               (тільки якщо він fixed або sticky). null — не враховувати.
 * @param {number} [options.offset=0]            Додатковий відступ зверху, px.
 * @param {string|null} [options.pageUpSelector='.pageup']  Кнопка «вгору». null — вимкнути.
 * @param {number} [options.pageUpThreshold=10]  Після скількох px скролу показувати кнопку.
 * @param {string} [options.visibleClass='is-visible']  Клас видимої кнопки.
 * @param {boolean} [options.updateHash=true]    Оновлювати #hash в адресі, якщо ціль має id.
 * @returns {() => void} Функція, що знімає всі обробники.
 */
function smoothScroll(menuSelector, options = {}) {
	const {
		headerSelector = 'header',
		offset = 0,
		pageUpSelector = '.pageup',
		pageUpThreshold = 10,
		visibleClass = 'is-visible',
		updateHash = true,
	} = options;

	const controller = new AbortController();
	const { signal } = controller;

	const menuLinks = menuSelector ? document.querySelectorAll(menuSelector) : [];
	const header = headerSelector ? document.querySelector(headerSelector) : null;
	const pageUp = pageUpSelector ? document.querySelector(pageUpSelector) : null;
	const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

	function getHeaderHeight() {
		if (!header) return 0;
		const { position } = getComputedStyle(header);
		return position === 'fixed' || position === 'sticky' ? header.offsetHeight : 0;
	}

	function getTarget(link) {
		const selector = link.dataset.goto || link.getAttribute('href');
		if (!selector || selector === '#') return null;
		try {
			return document.querySelector(selector);
		} catch {
			return null; // невалідний селектор або звичайний URL у href
		}
	}

	function scrollToTarget(target) {
		const top = target.getBoundingClientRect().top + window.scrollY - getHeaderHeight() - offset;

		window.scrollTo({
			top: Math.max(0, top),
			behavior: reducedMotion.matches ? 'auto' : 'smooth',
		});
	}

	function onMenuLinkClick(event) {
		const target = getTarget(event.currentTarget);
		if (!target) return; // цілі нема — посилання працює як звичайне

		event.preventDefault();
		scrollToTarget(target);

		if (updateHash && target.id) {
			history.pushState(null, '', `#${target.id}`);
		}

		// Переносимо фокус, щоб Tab продовжував із секції, а не з меню
		if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
		target.focus({ preventScroll: true });
	}

	menuLinks.forEach(link => link.addEventListener('click', onMenuLinkClick, { signal }));

	if (pageUp) {
		let ticking = false;

		const togglePageUp = () => {
			const visible = window.scrollY > pageUpThreshold;
			pageUp.classList.toggle(visibleClass, visible);
			pageUp.style.opacity = visible ? '1' : '0';
			pageUp.style.pointerEvents = visible ? '' : 'none';
			ticking = false;
		};

		const onScroll = () => {
			if (ticking) return;
			ticking = true;
			requestAnimationFrame(togglePageUp);
		};

		window.addEventListener('scroll', onScroll, { passive: true, signal });
		togglePageUp();
	}

	return () => controller.abort();
}

export default smoothScroll;
