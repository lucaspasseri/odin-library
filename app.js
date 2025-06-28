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

const myLibrary = (function () {
	const myLibraryArr = [];

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
		getLibrary,
		addBook,
		removeBookById,
	};
})();
const b1 = new Book("era uma vez", "artesão", 201);
const b2 = new Book("Aqueles passos", "artesão", 123);
myLibrary.addBook(b1);
myLibrary.addBook(b2);
console.log(myLibrary.getLibrary());
