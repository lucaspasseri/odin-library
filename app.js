class Library {
	#books = [];
	#display;

	constructor() {
		this.#display = new Display();
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
	readState;

	constructor(
		title = "(empty)",
		author = "(empty)",
		pages = 0,
		readState = false
	) {
		this.id = crypto.randomUUID();
		this.title = title;
		this.author = author;
		this.pages = pages;
		this.readState = readState;
	}

	toggleReadState() {
		this.readState = !this.readState;
	}
}

class Display {
	#openDialogBtn;
	#dialog;
	#form;
	#bookListContainer;
	#leftBtn;
	#rightBtn;

	#carouselCurrItemIndex;

	constructor() {
		this.#openDialogBtn = document.querySelector(".open-dialog-btn");
		this.#dialog = document.querySelector(".dialog");
		this.#form = document.querySelector(".form");
		this.#bookListContainer = document.querySelector(".book-list-container");
		this.#leftBtn = document.querySelector(".carousel-left-btn");
		this.#rightBtn = document.querySelector(".carousel-right-btn");

		this.#carouselCurrItemIndex = 0;
	}

	get currIndex() {
		return this.#carouselCurrItemIndex;
	}

	set currIndex(value) {
		this.#carouselCurrItemIndex = value;
	}

	#updateCarouselIndex(direction) {
		if (myLibrary.size <= 1) return;

		const lastIndex = myLibrary.size - 1;

		if (direction === "next") {
			this.currIndex = this.currIndex === lastIndex ? 0 : this.currIndex + 1;
		} else if (direction === "prev") {
			this.currIndex = this.currIndex === 0 ? lastIndex : this.currIndex - 1;
		}

		return this.currIndex;
	}

	#decreaseCarouselItemIndex() {
		return this.#updateCarouselIndex("prev");
	}

	#increaseCarouselItemIndex() {
		return this.#updateCarouselIndex("next");
	}

	init() {
		this.#leftBtn.addEventListener("click", () => {
			this.#decreaseCarouselItemIndex();

			const booksLi = document.querySelectorAll(".book-list-container li");
			booksLi[this.currIndex]?.scrollIntoView({
				inline: "center",
				behavior: "smooth",
			});
		});

		this.#rightBtn.addEventListener("click", () => {
			this.#increaseCarouselItemIndex();

			const booksLi = document.querySelectorAll(".book-list-container li");
			booksLi[this.currIndex]?.scrollIntoView({
				inline: "center",
				behavior: "smooth",
			});
		});

		this.#openDialogBtn.addEventListener("click", () => {
			this.#dialog.showModal();
		});

		this.#form.addEventListener("submit", e => {
			if (e.submitter.attributes.class?.value === "close-dialog-btn") {
				this.#dialog.close();
				return;
			}

			const formData = new FormData(this.#form);
			const title = formData.get("title") || undefined;
			const author = formData.get("author") || undefined;
			const pages = formData.get("pages") || undefined;
			const readState = formData.get("readState") === "true" ? true : false;

			const newBook = new Book(title, author, pages, readState);

			myLibrary.addBook(newBook);
			this.#form.reset();
			this.render();
		});
	}

	render() {
		this.#bookListContainer.innerHTML = "";

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

			deleteButton.addEventListener("click", _e => {
				myLibrary.removeBookById(book.id);
				this.render();
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
			checkboxWasRead.checked = book.readState;

			checkboxWasRead.addEventListener("change", () => {
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

		this.#bookListContainer.appendChild(ul);
	}
}

const myLibrary = new Library();
myLibrary.init();
