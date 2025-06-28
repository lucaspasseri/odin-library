const myLibrary = (function () {
	const myLibraryArr = [];
	const display = createDisplay();

	function init() {
		display.init();
		display.render();
	}

	function getLibrary() {
		return [...myLibraryArr];
	}

	function addBook(book) {
		if (book instanceof Book) {
			myLibraryArr.push(book);
		}
	}

	function removeBookById(id) {
		if (typeof id === "string") {
			const index = myLibraryArr.findIndex(book => book.id === id);
			if (index !== -1) {
				myLibraryArr.splice(index, 1);
			}
		}
	}

	return {
		init,
		getLibrary,
		addBook,
		removeBookById,
	};
})();

class Book {
	id;
	title;
	author;
	pages;

	constructor(title = "(empty)", author = "(empty)", pages = 0) {
		this.id = crypto.randomUUID();
		this.title = title;
		this.author = author;
		this.pages = pages;
	}
}

function createDisplay() {
	const bookListContainer = document.querySelector(".book-list-container");
	const openDialogBtn = document.querySelector(".open-dialog-btn");
	const dialog = document.querySelector(".dialog");
	const form = document.querySelector(".form");

	function init() {
		openDialogBtn.addEventListener("click", () => {
			dialog.showModal();
		});

		form.addEventListener("submit", e => {
			const form = e.target;

			const formData = new FormData(form);
			const title = formData.get("title") || undefined;
			const author = formData.get("author") || undefined;
			const pages = formData.get("pages") || undefined;

			const newBook = new Book(title, author, pages);

			myLibrary.addBook(newBook);
			render();
		});
	}

	function render() {
		bookListContainer.innerHTML = "";

		const ul = document.createElement("ul");

		myLibrary.getLibrary().forEach(book => {
			const li = document.createElement("li");
			li.textContent = book.title;
			li.setAttribute("data-id", book.id);
			li.classList.add("card");

			const deleteButton = document.createElement("button");
			deleteButton.textContent = "delete book";

			deleteButton.addEventListener("click", e => {
				const bookId = e.target.parentNode.dataset.id;
				myLibrary.removeBookById(bookId);
				render();
			});

			li.appendChild(deleteButton);

			ul.appendChild(li);
		});

		bookListContainer.appendChild(ul);
	}

	return {
		init,
		render,
	};
}

myLibrary.init();
