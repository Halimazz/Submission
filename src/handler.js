const { nanoid } = require("nanoid");
const books = require("./books");

const addBookHandler = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  // awal validasi input
  if (!name) {
    const response = h.response({
      status: "fail",
      message: "Gagal menambahkan buku. Mohon isi nama buku", // Ubah 'catatan' menjadi 'buku'
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: "fail",
      message:
        "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount", // Ubah 'catatan' menjadi 'buku'
    });
    response.code(400);
    return response;
  }
  // akhir validasi input
  // default finished
  const id = nanoid(16);
  const finished = pageCount === readPage;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished, // Nilai sudah ditentukan di atas
    reading,
    insertedAt,
    updatedAt,
  };

  books.push(newBook);

  const isSuccess = books.some((book) => book.id === id);

  // Menggunakan h.response() dan menambahkan header
  const response = h
    .response({
      status: isSuccess ? "success" : "fail",
      message: isSuccess
        ? "Buku berhasil ditambahkan" // Ubah 'Catatan' menjadi 'Buku'
        : "Buku gagal ditambahkan", // Ubah 'Catatan' menjadi 'Buku'
      data: isSuccess ? { bookId: id } : undefined, // Ubah 'noteId' menjadi 'bookId' agar konsisten
    })
    .code(isSuccess ? 201 : 500);

  // Menetapkan header CORS pada response
  response.header("Access-Control-Allow-Origin", "*");

  return response;
};

const getAllBooksHandler = (request, h) => {
  const { name, reading, finished } = request.query;
  let filteredBooks = [...books];
  if (name) {
    filteredBooks = filteredBooks.filter((book) =>
      book.name.toLowerCase().includes(name.toLowerCase())
    );
  }

  if (finished !== undefined) {
    filteredBooks = filteredBooks.filter(
      (book) => book.finished === (finished === "1")
    );
  }

  if (reading !== undefined) {
    filteredBooks = filteredBooks.filter(
      (book) => book.reading === (reading === "1")
    );
  }

  const response = h.response({
    status: "success",
    data: {
      books: filteredBooks.map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
      })),
    },
  });

  return response;
};

const getBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  // Cari buku berdasarkan ID
  const foundBook = books.find((book) => book.id === bookId);

  if (foundBook) {
    // Buku ditemukan, kirim respons sukses dengan detail buku
    const response = h.response({
      status: "success",
      data: {
        book: foundBook,
      },
    });
    return response;
  }
  // Buku tidak ditemukan, kirim respons dengan status fail
  const response = h.response({
    status: "fail",
    message: "Buku tidak ditemukan",
  });
  response.code(404); // Mengatur status code 404 (Not Found)
  return response;
};
const editBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  // Cari indeks buku berdasarkan ID
  const bookIndex = books.findIndex((book) => book.id === bookId);

  if (bookIndex === -1) {
    // Jika buku tidak ditemukan, kirim respons dengan status fail
    const response = h.response({
      status: "fail",
      message: "Gagal memperbarui buku. Id tidak ditemukan",
    });
    response.code(404); // Mengatur status code 404 (Not Found)
    return response;
  }

  // Validasi properti name
  if (!name) {
    const response = h.response({
      status: "fail",
      message: "Gagal memperbarui buku. Mohon isi nama buku",
    });
    response.code(400); // Mengatur status code 400 (Bad Request)
    return response;
  }

  // Validasi properti readPage
  if (readPage > pageCount) {
    const response = h.response({
      status: "fail",
      message:
        "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount",
    });
    response.code(400); // Mengatur status code 400 (Bad Request)
    return response;
  }

  // Update data buku dengan data baru
  books[bookIndex] = {
    ...books[bookIndex],
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
    updatedAt: new Date().toISOString(),
  };

  // Kirim respons sukses
  const response = h.response({
    status: "success",
    message: "Buku berhasil diperbarui",
  });
  return response;
};
const deleteBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  // Cari indeks buku berdasarkan ID
  const bookIndex = books.findIndex((book) => book.id === bookId);

  if (bookIndex === -1) {
    // Jika buku tidak ditemukan, kirim respons dengan status fail
    const response = h.response({
      status: "fail",
      message: "Buku gagal dihapus. Id tidak ditemukan",
    });
    response.code(404); // Mengatur status code 404 (Not Found)
    return response;
  }

  // Hapus buku dari array
  books.splice(bookIndex, 1);

  // Kirim respons sukses
  const response = h.response({
    status: "success",
    message: "Buku berhasil dihapus",
  });
  return response;
};

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
};
