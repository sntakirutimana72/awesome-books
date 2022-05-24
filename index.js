/* eslint-disable no-plusplus */
/* eslint-disable radix */
/* eslint-disable max-classes-per-file */

const booksList = document.querySelector('.books-list');
const bookUniqueId = 'bookStorage';

class Book {
  constructor(id, title, author) {
    this.bookId = id;
    this.bookTitle = title;
    this.bookAuthor = author;
  }
}

class BooksManager {
  constructor() {
    const idCounterTemp = localStorage.getItem('idCounter');

    if (idCounterTemp !== null) {
      this.idCounter = parseInt(idCounterTemp);
    } else {
      this.idCounter = 0;
    }

    const booksTemp = localStorage.getItem(bookUniqueId);

    if (booksTemp !== null) {
      this.books = JSON.parse(booksTemp);
    } else {
      this.books = [];
    }
  }

  remove(id) {
    this.books = this.books.filter((book) => book.bookId !== id);
    localStorage.setItem(bookUniqueId, JSON.stringify(this.books));
  }

  add(title, author) {
    const newBook = new Book(++this.idCounter, title, author);
    this.books.push(newBook);
    localStorage.setItem(bookUniqueId, JSON.stringify(this.books));
    localStorage.setItem('idCounter', this.idCounter);
    return newBook;
  }

  getAllBooks() {
    return this.books;
  }

  isEmpty() {
    return this.books.length === 0;
  }
}

const booksManager = new BooksManager();

function renderBook(book) {
  const bookItem = document.createElement('div');
  bookItem.id = book.bookId;
  bookItem.className = 'bookItem';
  bookItem.innerHTML = `
    <span><b>“${book.bookTitle}”</b> by ${book.bookAuthor}</span>
    <button class="btn" type="button" name="button" value="remove">Remove</button>
  `;

  return bookItem;
}

function toggleBooksListClasses(force) {
  booksList.classList.toggle('empty-list', force);
}

function populateBooks() {
  const books = booksManager.getAllBooks();
  books.forEach((book) => { booksList.appendChild(renderBook(book)); });

  if (!booksManager.isEmpty()) {
    toggleBooksListClasses(false);
  }
}

function remove(e) {
  if (e.target.classList.contains('btn')) {
    const bookItem = e.target.parentElement;
    bookItem.style.display = 'none';
    booksManager.remove(parseInt(bookItem.id));

    if (booksManager.isEmpty()) {
      toggleBooksListClasses(true);
    }
  }
}

function add(event) {
  event.preventDefault();
  toggleBooksListClasses(false);
  const book = booksManager.add(this.elements.title.value,
    this.elements.author.value);
  booksList.appendChild(renderBook(book));
}

document.forms[0].addEventListener('submit', add);
document.body.addEventListener('click', remove);
document.addEventListener('DOMContentLoaded', populateBooks);
