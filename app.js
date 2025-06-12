const container = document.querySelector(".container");
const bookListContainer = document.querySelector(".book-list-container");
const openDialogBtn = document.querySelector(".open-dialog-btn");
const dialog = document.querySelector(".dialog");
const form = document.querySelector(".form");

const myLibrary = [];

renderLibrary();

function renderLibrary() {
	document.querySelector(".book-list-container").innerHTML = "";

	const ul = document.createElement("ul");

	for (let i = 0; i < myLibrary.length; i++) {
		const book = myLibrary[i];
		const li = createNewBookLi(book);
		ul.appendChild(li);
	}

	bookListContainer.appendChild(ul);
}

function createNewBookLi(book) {
	const li = document.createElement("li");
	li.setAttribute("id", book.id);
	li.textContent = book.title;
	li.setAttribute("pages", book.pages);
	li.setAttribute("isRead", book.isRead);

	return li;
}

function addBookToLibrary(
	title = "(empty)",
	author = "(empty)",
	pages = 0,
	wasRead = false
) {
	const newBook = new Book(title, author, pages, wasRead);
	myLibrary.push(newBook);
	console.log(myLibrary);
	renderLibrary();
}

function Book(title = "", author = "", pages = 0, isRead = false) {
	if (!new.target) {
		throw Error("You must use the 'new' operator to call the constructor");
	}
	this.id = crypto.randomUUID();
	this.title = title;
	this.author = author;
	this.pages = pages;
	this.isRead = isRead;
}

openDialogBtn.addEventListener("click", handleOpenDialog);
function handleOpenDialog() {
	dialog.showModal();
}

dialog.addEventListener("close", handleCloseDialog);
function handleCloseDialog(e) {
	console.log({ e });
	console.log({ v: e.target.returnValue });
}

form.addEventListener("submit", handleSubmit);
function handleSubmit(e) {
	e.preventDefault();

	const formData = new FormData(form);

	const title = formData.get("title") || undefined;
	const author = formData.get("author") || undefined;
	const pages = Number(formData.get("pages")) || undefined;
	const wasRead = formData.get("wasRead") || undefined;

	addBookToLibrary(title, author, pages, wasRead);

	form.reset();
	dialog.close();
}
