const { getAll, getSingle,  createBook } = require('../controllers/books');

const Book = require('../models/book');

jest.mock('../models/book');
describe('Book controller: getAll', () => {
    let req, res;

    beforeEach(() => {
        jest.clearAllMocks();
        req ={};
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            setHeader: jest.fn()
        };
    });

    it('should return 200 status and a list of books', async () => {
        const mockBooks = [
            { title: 'Book 1', author: 'Author 1', genre: 'Genre 1', publishedYear: 2000, isbn:'XXX-XXXXXXXXXX' },
            { title: 'Book 2', author: 'Autor 2', genre: 'Genre 2', publishedYear: 2000, isbn:'XXX-XXXXXXXXXX' },
            { title: 'Book 3', author: 'Autor 3', genre: 'Genre 3', publishedYear: 2000, isbn:'XXX-XXXXXXXXXX' },
        ];

        Book.getAllBooks.mockResolvedValue(mockBooks);

        await getAll(req, res);

        expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockBooks);
    });

    it('should return 500 status if DB conection fails', async () => {
        Book.getAllBooks.mockRejectedValue(new Error('Error retrieving books.'));
        
        await getAll(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
    });
});
describe('Book controller: getSingle', () => {
    let req, res;

    beforeEach(() => {
        jest.clearAllMocks();
        req = {
            params: { id: '65f9a1b2c3d4e5f6g7h8i9j0' }
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            setHeader: jest.fn()
        };
    });

    it('should return 200 status and the book information if ID exists', async () => {
        const mockBook = { title: 'Amazing Book', author: 'Jane Doe', genre: 'Adventure', publishedYear: 2018, isbn: '978-0743273565' };
        
        Book.getBookById.mockResolvedValue(mockBook);

        await getSingle(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockBook);
        expect(Book.getBookById).toHaveBeenCalledWith('65f9a1b2c3d4e5f6g7h8i9j0'); 
    });

    it('should return 404 status if the book is missing', async () => {
        Book.getBookById.mockResolvedValue(null);

        await getSingle(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: 'Book not found.' });
    });

    it('should return 500 status if there is an error on DB', async () => {
        Book.getBookById.mockRejectedValue(new Error('DB Error'));
        
        await getSingle(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
    });
});

describe('Book controller: createBook', () =>{
    let req, res;

    beforeEach(() => {
        jest.clearAllMocks();

        req={
            body:{}
        };
        
        res ={
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };        
    });

    it('should return 201 status and ID if each value is valid', async () => {
        req.body = {
            title: 'Amazing Book', 
            author: 'Jane Doe', 
            genre: 'Adventure',
            publishedYear: 2018,
            isbn: '978-0743273565'
        }
        Book.createBook.mockResolvedValue({insertedId: '65f9a1b2c3d4e5f6g7h8i9j0'});

        await createBook(req, res);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({id:'65f9a1b2c3d4e5f6g7h8i9j0' });

        expect(Book.createBook).toHaveBeenCalledTimes(1);
        expect(Book.createBook).toHaveBeenCalledWith(req.body);
    });
   
    const validBook = {
        title: 'Amazing Book',
        author: 'Jane Doe',
        genre: 'Adventure',
        publishedYear: 2018,
        isbn: '978-0743273565'
    };

    const missingCases = [
        ['title', 'title is required and must be a non-empty string.'],
        ['author', 'author is required and must be a non-empty string.'],
        ['genre', 'genre is required and must be a non-empty string.'],
        ['publishedYear', 'publishedYear is required and must be a number.'],
        ['isbn', 'isbn is required and must be a non-empty string.']
    ];
    it.each(missingCases)('should return 400 status if %s is missing', async (field, expectedErrorMessage) => {
        req.body = {...validBook};
        delete req.body[field];
        await createBook(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            error: expectedErrorMessage
        });

        expect(Book.createBook).not.toHaveBeenCalled();
    });

    it('should return 500 status if DB throws an error', async() =>{
        req.body ={
            title: 'Amazing Book', 
            author: 'Jane Doe', 
            genre: 'Adventure',
            publishedYear: 2018,
            isbn: '978-0743273565'
        };

        Book.createBook.mockRejectedValue(new Error('Cannot connect with DB'));

        await createBook(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            error: 'Cannot connect with DB'
        });
    });
});