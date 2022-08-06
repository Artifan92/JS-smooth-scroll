'use strict';

function smoothScroll(menuSelector) {
	const menuLinks = document.querySelectorAll(menuSelector);

	function changeClassCallBack() {
		if (window.pageYOffset > 10) {
			document.querySelector('.pageup').style.opacity = 1;
		} else {
			document.querySelector('.pageup').style.opacity = 0;
		}
	}

	function onMenuLinkClick(event) {
		event.preventDefault();

		if (this.dataset.goto && document.querySelector(this.dataset.goto)) {
			const gotoBlock = document.querySelector(this.dataset.goto);
			const gotoBlockValue =
				gotoBlock.getBoundingClientRect().top +
				pageYOffset -
				document.querySelector('header').offsetHeight;

			window.scrollTo({
				top: gotoBlockValue,
				behavior: 'smooth',
			});
		}
	}

	if (menuLinks.length > 0) {
		menuLinks.forEach(menuLink => {
			menuLink.addEventListener('click', onMenuLinkClick);
		});
	}

	window.addEventListener('scroll', changeClassCallBack);
}

export default smoothScroll;
