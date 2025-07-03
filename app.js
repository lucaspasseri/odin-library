class Library {
	#books = [];
	#display;

	constructor() {
		this.#display = createDisplay();
	}

	init() {
		this.#display.init();
		this.#display.render();
	}

	get books() {
		return [...this.#books];
	}

	get size() {
		return this.#books.length;
	}

	addBook(book) {
		if (book instanceof Book) {
			this.#books.push(book);
		}
	}

	removeBookById(id) {
		if (typeof id === "string") {
			const index = this.#books.findIndex(book => book.id === id);
			if (index !== -1) {
				this.#books.splice(index, 1);
			}
		}
	}

	getBookById(id) {
		if (typeof id === "string") {
			const book = this.#books.find(book => book.id === id);
			return book;
		}
	}
}

class Book {
	id;
	title;
	author;
	pages;
	wasRead;

	constructor(
		title = "(empty)",
		author = "(empty)",
		pages = 0,
		wasRead = false
	) {
		this.id = crypto.randomUUID();
		this.title = title;
		this.author = author;
		this.pages = pages;
		this.wasRead = wasRead;
	}

	toggleReadState() {
		this.wasRead = !this.wasRead;
	}
}

function createDisplay() {
	const bookListContainer = document.querySelector(".book-list-container");
	const openDialogBtn = document.querySelector(".open-dialog-btn");
	const dialog = document.querySelector(".dialog");
	const form = document.querySelector(".form");
	const carouselLeftBtn = document.querySelector(".carousel-left-btn");
	const carouselRightBtn = document.querySelector(".carousel-right-btn");

	let carouselCurrentItemIndex = 0;

	function increaseCarouselItemIndex() {
		if (myLibrary.size === 0 || myLibrary.size === 1) {
			return;
		}

		if (carouselCurrentItemIndex === myLibrary.size - 1) {
			carouselCurrentItemIndex = 0;
			return carouselCurrentItemIndex;
		}
		carouselCurrentItemIndex += 1;
		return carouselCurrentItemIndex;
	}
	function decreaseCarouselItemIndex() {
		if (myLibrary.size === 0 || myLibrary.size === 1) {
			return;
		}

		if (carouselCurrentItemIndex === 0) {
			carouselCurrentItemIndex = myLibrary.size - 1;
			return carouselCurrentItemIndex;
		}
		carouselCurrentItemIndex -= 1;
		return carouselCurrentItemIndex;
	}

	function getCarouselItemIndex() {
		return carouselCurrentItemIndex;
	}

	function init() {
		carouselLeftBtn.addEventListener("click", () => {
			const booksLi = document.querySelectorAll(".book-list-container li");
			decreaseCarouselItemIndex();

			booksLi[getCarouselItemIndex()]?.scrollIntoView({
				inline: "center",
				behavior: "smooth",
			});
		});
		carouselRightBtn.addEventListener("click", () => {
			const booksLi = document.querySelectorAll(".book-list-container li");
			increaseCarouselItemIndex();

			booksLi[getCarouselItemIndex()]?.scrollIntoView({
				inline: "center",
				behavior: "smooth",
			});
		});

		openDialogBtn.addEventListener("click", () => {
			dialog.showModal();
		});

		form.addEventListener("submit", e => {
			if (e.submitter.attributes.class?.value === "close-dialog-btn") {
				dialog.close();
				return;
			}

			const formData = new FormData(form);
			const title = formData.get("title") || undefined;
			const author = formData.get("author") || undefined;
			const pages = formData.get("pages") || undefined;
			const wasRead = formData.get("wasRead") === "wasRead" ? true : false;

			const newBook = new Book(title, author, pages, wasRead);

			myLibrary.addBook(newBook);
			form.reset();
			render();
		});
	}

	function render() {
		bookListContainer.innerHTML = "";

		const ul = document.createElement("ul");

		myLibrary.books.forEach(book => {
			const li = document.createElement("li");
			li.setAttribute("data-id", book.id);
			li.classList.add("card");

			const cardTitle = document.createElement("h3");
			cardTitle.textContent = book.title;

			const cardAuthor = document.createElement("p");
			cardAuthor.textContent = `Author: ${book.author}`;

			const cardPages = document.createElement("p");
			cardPages.textContent = `# of pages: ${book.pages}`;

			const cardInfo = document.createElement("div");
			cardInfo.appendChild(cardAuthor);
			cardInfo.appendChild(cardPages);

			const deleteButton = document.createElement("button");

			deleteButton.addEventListener("click", e => {
				myLibrary.removeBookById(book.id);
				render();
			});

			const trashIcon = `
				<svg xmlns="http://www.w3.org/2000/svg" 
						viewBox="0 0 24 24" 
						fill="currentColor" 
						width="24" 
						height="24">
					<path d="M9,3V4H4V6H5V19A2,2 0 0,0 7,21H17A2,2 0 0,0 19,19V6H20V4H15V3H9M7,6H17V19H7V6M9,8V17H11V8H9M13,8V17H15V8H13Z" />
				</svg>
			`;

			deleteButton.innerHTML = trashIcon;

			const deleteButtonLabel = document.createElement("label");

			deleteButtonLabel.textContent = "Delete";
			deleteButtonLabel.appendChild(deleteButton);

			const checkboxWasRead = document.createElement("input");
			checkboxWasRead.id = `checkbox-${book.id}`;
			checkboxWasRead.setAttribute("type", "checkbox");
			checkboxWasRead.checked = book.wasRead;

			checkboxWasRead.addEventListener("change", () => {
				// myLibrary.toggleWasReadById(book.id);
				myLibrary.getBookById(book.id).toggleReadState();
			});

			const checkboxLabel = document.createElement("label");
			checkboxLabel.setAttribute("for", `checkbox-${book.id}`);

			const checkboxContainer = document.createElement("div");
			checkboxContainer.classList.add("checkboxContainer");

			const title = document.createElement("span");
			title.textContent = "Did you read it?";

			checkboxLabel.appendChild(title);

			checkboxContainer.appendChild(checkboxWasRead);
			checkboxContainer.appendChild(checkboxLabel);

			const checkboxContainerWrapper = document.createElement("div");

			checkboxContainerWrapper.appendChild(checkboxContainer);
			checkboxContainerWrapper.appendChild(deleteButtonLabel);

			li.appendChild(cardTitle);
			li.appendChild(cardInfo);
			li.appendChild(checkboxContainerWrapper);

			ul.appendChild(li);
		});

		bookListContainer.appendChild(ul);
	}

	return {
		init,
		render,
	};
}

const myLibrary = new Library();
myLibrary.init();
