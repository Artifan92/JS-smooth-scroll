'use strict';

function smoothScroll(menuSelector) {
	const menuLinks = document.querySelectorAll(menuSelector);

	function onMenuLinkClick(event) {
		event.preventDefault();
		const target = event.target;

		console.log(document.querySelector(target.dataset.goto));

		if (target.dataset.goto && document.querySelector(target.dataset.goto)) {
			const gotoBlock = document.querySelector(target.dataset.goto);
			const gotoBlockValue =
				gotoBlock.getBoundingClientRect().top +
				pageYOffset -
				document.querySelector('header').offsetHeight;

			window.scrollTo({
				top: gotoBlockValue,
				behavior: 'smooth',
			});
			e.preventDefault();
		}
	}

	if (menuLinks.length > 0) {
		menuLinks.forEach(menuLink => {
			menuLink.addEventListener('click', onMenuLinkClick);
		});
	}
}

export default smoothScroll;
