window.addEventListener('DOMContentLoaded', () => {
	const tabsBtn = document.querySelectorAll('.tab-btn');
	const tabsContent = document.querySelectorAll('.catalog-item');

	const catalogs = document.querySelectorAll(".catalog-item__wrapper")
	const moreButtons = document.querySelectorAll('.more');
	const backButtons = document.querySelectorAll('.back');

	const modalBtn = document.querySelectorAll(".button");
	const close = document.querySelectorAll('.modal__close');
	const overlay = document.querySelector('.overlay');

	const btnOrder = document.querySelectorAll(".button-mini");

	const scroll = calcScroll();

	window.addEventListener('scroll', function () {
		if(this.window.scrollY > 700) {
			document.querySelector(".pageup").style.display = "block"
		} else {
			document.querySelector(".pageup").style.display = "none"
		}
	});

	function calcScroll() {
		let div = document.createElement('div');
		div.style.width = '50px';
		div.style.height = '50px';
		div.style.overflowY = 'scroll';
		div.style.visibility = 'hidden';

		document.body.appendChild(div);
		let scrollWidth = div.offsetWidth - div.clientWidth;
		div.remove();

		return scrollWidth;
	}
	const slider = tns({
		container: '.carousel__inner',
		items: 1,
		slideBy: 'page',
		autoplay: false,
		controls: false,
		navPosition: "bottom",
		speed: 800,
		mouseDrag: true,
		responsive: {
			768: {
				nav: true,

			},
			992: {
				nav: false,

			},
		}
	});

	const sliderReviews = tns({
		container: '.reviews__carousel-wrap',
		items: 1,
		slideBy: 'page',
		autoplay: false,
		controls: false,
		navPosition: "bottom",
		speed: 800,
		mouseDrag: true,
		responsive: {
			768: {
				nav: true,

			},
			992: {
				nav: false,

			},
		}
	});
	const navCarousel = (item, next, prev) => {
		document.querySelector(next).addEventListener('click', function () {
			item.goTo('next');
		});
		document.querySelector(prev).addEventListener('click', function () {
			item.goTo('prev');
		});
	};
	navCarousel(slider, ".next", ".prev");
	navCarousel(sliderReviews, ".reviews-next", ".reviews-prev");

	const handleTabsContent = () => {
		tabsBtn.forEach(item => {
			item.addEventListener('click', () => {
				const currentBtn = item;
				const dataTab = currentBtn.dataset.btn;

				filterTabContent(dataTab);

				tabsBtn.forEach(item => {
					item.classList.remove('active')
				});

				currentBtn.classList.add('active')
			});
		});
	};

	const filterTabContent = (tab) => {
		tabsContent.forEach(el => {
			const currentContent = el;
			const dataContent = currentContent.dataset.content;
			if (tab === dataContent) {
				el.classList.add('active-item');
				el.classList.add('hide');
			} else {
				el.classList.remove('active-item');
				el.classList.remove('hide');
			};
		});
	};

	const handleToggleShow = () => {
		moreButtons.forEach((item, i) => {
			item.addEventListener('click', function () {
				catalogs.forEach((content, index) => {
					if (i === index) {
						content.querySelector(".catalog-item__content").classList.add("catalog-item__hidden")
						content.querySelector(".catalog-item__list").classList.remove("catalog-item__hidden")
					}
				});
			});
		});
	};

	const handleToggleHidden = () => {
		backButtons.forEach((item, i) => {
			item.addEventListener('click', function () {
				catalogs.forEach((content, index) => {
					if (i === index) {
						content.querySelector(".catalog-item__content").classList.remove("catalog-item__hidden")
						content.querySelector(".catalog-item__list").classList.add("catalog-item__hidden")
					}
				});
			});
		});
	};
	// modal
	const onModalShowClick = (data, id) => {
		modalBtn.forEach(item => {
			item.addEventListener('click', () => {
				if (item.dataset.modal === data) {
					modalShow(id)
				}

			});
		});
	};
	const onModalHideClick = () => {
		close.forEach(item => {
			item.addEventListener('click', () => {
				modalHide(".modal");
			})
		})
	};
	const modalShow = (id) => {
		overlay.style.display = "block";
		document.getElementById(id).classList.remove('modal-hide');
		document.body.style.marginRight = `${scroll}px`;
		document.body.style.overflow = "hidden";
	}

	const modalHide = (itemModal) => {
		const modal = document.querySelector(itemModal)
		overlay.style.display = "none";
		modal.classList.add('modal-hide');
		document.body.style.marginRight = `0px`
		document.body.style.overflow = "auto";
	}
	const getProductName = () => {
		btnOrder.forEach((item, indexBtn) => {
			item.addEventListener("click", () => {
				const modalText = document.querySelector("#order .modal__descr")
				const product = document.querySelectorAll(".item__subtitle");
				product.forEach((itemProd, i) => {
					if (indexBtn === i) {
						modalText.textContent = itemProd.textContent
					}
				});
			});
		});
	};

	//server
	const closureOfAllModal = (id) => {
		const modal = document.getElementById(id);
		modal.classList.add('modal-hide')
	};

	const ajaxSend = async (formData) => {
		const response = await fetch("mailer/smart.php", {
			method: "POST",
			body: formData
		});
		if (!response.ok) {
			throw new Error(`Ошибка по адресу ${url}, статус ошибки ${response.status}`);
		}
		return await response.text();
	};

	const forms = () => {
		const forms = document.querySelectorAll("form");
		forms.forEach(form => {
			form.addEventListener("submit", function (e) {
				e.preventDefault();

				const formData = new FormData(form);
				ajaxSend(formData)
					.then(() => {
						closureOfAllModal("consultation");
						closureOfAllModal("order")
						modalShow("success");
						form.reset();
					})
					.catch((err) => console.error(err))
					.finally(() => {
						setTimeout(() => {
							modalHide(".modal-min");
						}, 3000);
					})
			});
		});
	}

	handleToggleShow();
	handleToggleHidden();
	handleTabsContent();
	onModalShowClick("consultation", "consultation");
	onModalShowClick("buy", "order");
	onModalHideClick();
	getProductName();
	forms();
});
