const container = document.querySelector(".container");
const bookListContainer = document.querySelector(".book-list-container");
const openDialogBtn = document.querySelector(".open-dialog-btn");
const dialog = document.querySelector(".dialog");
const form = document.querySelector(".form");

let myLibrary = [];

renderLibrary();

function renderLibrary() {
	bookListContainer.innerHTML = "";

	const ul = document.createElement("ul");

	if (myLibrary.length === 0) {
		ul.textContent = "(Empty)";
		bookListContainer.appendChild(ul);
		return;
	}

	for (let i = 0; i < myLibrary.length; i++) {
		const book = myLibrary[i];
		const li = createNewBookLi(book);
		ul.appendChild(li);
	}
	bookListContainer.appendChild(ul);
}

function createNewBookLi(book) {
	const li = document.createElement("li");
	li.className = "card";
	li.setAttribute("id", book.id);

	const form = document.createElement("form");

	const h3Title = document.createElement("h3");
	h3Title.textContent = book.title;

	const pAuthor = document.createElement("p");
	pAuthor.textContent = `by: ${book.author}`;

	const pPages = document.createElement("p");
	pPages.textContent = `${book.pages}/pages`;

	const wasReadFieldSet = document.createElement("fieldset");

	const legend = document.createElement("legend");
	legend.textContent = "Have you read this book?";

	const wasNotReadRadioButton = document.createElement("input");
	wasNotReadRadioButton.setAttribute("id", "wasNotReadRadioBtn");
	wasNotReadRadioButton.setAttribute("type", "radio");
	wasNotReadRadioButton.setAttribute("name", "wasRead");
	wasNotReadRadioButton.setAttribute("data-book-id", book.id);

	wasNotReadRadioButton.addEventListener("change", toggleWasRead);

	const wasReadRadioButton = document.createElement("input");
	wasReadRadioButton.setAttribute("id", "wasReadRadioBtn");
	wasReadRadioButton.setAttribute("type", "radio");
	wasReadRadioButton.setAttribute("name", "wasRead");
	wasReadRadioButton.setAttribute("data-book-id", book.id);

	wasReadRadioButton.addEventListener("change", toggleWasRead);
	function toggleWasRead(e) {
		const bookId = e.target.dataset.bookId;

		myLibrary = myLibrary.map(book =>
			book.id === bookId ? book.toggleWasRead() : book
		);
		renderLibrary();
	}

	if (book.wasRead) {
		wasReadRadioButton.setAttribute("checked", true);
	} else {
		wasNotReadRadioButton.setAttribute("checked", true);
	}

	const wasNotReadLabel = document.createElement("label");
	wasNotReadLabel.setAttribute("for", "wasNotReadRadioBtn");
	wasNotReadLabel.textContent = "No:";
	wasNotReadLabel.appendChild(wasNotReadRadioButton);

	const wasReadLabel = document.createElement("label");
	wasReadLabel.setAttribute("for", "wasReadRadioBtn");
	wasReadLabel.textContent = "Yes:";
	wasReadLabel.appendChild(wasReadRadioButton);

	wasReadFieldSet.appendChild(legend);
	wasReadFieldSet.appendChild(wasNotReadLabel);
	wasReadFieldSet.appendChild(wasReadLabel);

	const removeBookButton = document.createElement("button");
	removeBookButton.setAttribute("type", "button");
	removeBookButton.setAttribute("data-id", book.id);

	const trashImg = document.createElement("img");
	trashImg.setAttribute("src", "./imgs/trash-can-outline.svg");
	trashImg.setAttribute("alt", "trash icon");
	trashImg.setAttribute("width", "30px");
	trashImg.setAttribute("height", "30px");
	const pRemove = document.createElement("p");
	pRemove.textContent = "Remove book";

	removeBookButton.appendChild(trashImg);
	removeBookButton.appendChild(pRemove);

	removeBookButton.addEventListener("click", handleRemoveBook);

	form.appendChild(h3Title);
	form.appendChild(pAuthor);
	form.appendChild(pPages);
	form.appendChild(wasReadFieldSet);

	form.appendChild(removeBookButton);

	li.appendChild(form);

	return li;
}

function handleRemoveBook(e) {
	const id = e.currentTarget.dataset.id;
	myLibrary = myLibrary.filter(book => book.id !== id);
	renderLibrary();
}

function addBookToLibrary(
	title = "(empty)",
	author = "(empty)",
	pages = 0,
	wasRead = false
) {
	wasRead = wasRead === "read" ? true : false;
	myLibrary.push(new Book(title, author, pages, wasRead));
	renderLibrary();
}

function Book(title = "", author = "", pages = 0, wasRead = false) {
	if (!new.target) {
		throw Error("You must use the 'new' operator to call the constructor");
	}
	this.id = crypto.randomUUID();
	this.title = title;
	this.author = author;
	this.pages = pages;
	this.wasRead = wasRead;
}

Book.prototype.toggleWasRead = function () {
	this.wasRead = !this.wasRead;
	return this;
};

openDialogBtn.addEventListener("click", handleOpenDialog);
function handleOpenDialog() {
	dialog.showModal();
}

form.addEventListener("submit", handleSubmit);
function handleSubmit(e) {
	e.preventDefault();
	const submitterValue = e.submitter.value;
	if (submitterValue === "submitBook") {
		const formData = new FormData(form);

		const title = formData.get("title") || undefined;
		const author = formData.get("author") || undefined;
		const pages = Number(formData.get("pages")) || undefined;
		const wasRead = formData.get("wasRead") || undefined;

		addBookToLibrary(title, author, pages, wasRead);

		form.reset();
		dialog.close();
		return;
	}
	dialog.close();
}
