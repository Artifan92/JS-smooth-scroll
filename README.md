# JS-smooth-scroll

Невеликий ES-модуль без залежностей: плавний скрол до секцій із урахуванням фіксованого хедера та кнопка «вгору».

## Розмітка

```html
<header>
	<nav>
		<a class="menu__link" data-goto=".about" href="#about">Про нас</a>
		<a class="menu__link" href="#contacts">Контакти</a>
	</nav>
</header>

<section class="about" id="about">…</section>
<section id="contacts">…</section>

<a class="pageup menu__link" href="#" data-goto="body">↑</a>
```

Ціль береться з `data-goto` (будь-який CSS-селектор) або, якщо його нема, з `href="#id"`.

## Підключення

```html
<script type="module">
	import smoothScroll from './smoothScroll.js';

	smoothScroll('.menu__link');
</script>
```

## Опції

```js
const destroy = smoothScroll('.menu__link', {
	headerSelector: 'header', // null — не віднімати висоту хедера
	offset: 0, // додатковий відступ зверху, px
	pageUpSelector: '.pageup', // null — без кнопки «вгору»
	pageUpThreshold: 10, // після скількох px показувати кнопку
	visibleClass: 'is-visible', // клас видимої кнопки
	updateHash: true, // оновлювати #hash в адресі
});

destroy(); // зняти всі обробники
```

## Поведінка

- Висота хедера віднімається лише коли він `position: fixed` або `sticky`.
- Якщо хедера, кнопки «вгору» чи цілі посилання нема на сторінці — помилок не буде; посилання без цілі працює як звичайне.
- Кнопка «вгору» отримує клас `is-visible`, а також `opacity` і `pointer-events`, тож прихована кнопка не клікається.
- За `prefers-reduced-motion: reduce` скрол миттєвий.
- Після переходу фокус клавіатури переноситься на секцію, а адреса отримує `#id` (працює кнопка «назад» і прямі посилання).
