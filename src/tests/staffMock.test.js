const { getAll, getSingle,  createStaff } = require('../controllers/staff');

const Staff = require('../models/staff');

jest.mock('../models/staff');
describe('Staff controller: getAllStaff', () => {
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

    it('should return 200 status and a list of staff members', async () => {
        const mockStaff = [
            { firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com', role: 'admin',dateBirth: '08-02-2000', position: 'cashier', startDay: '06-24-2025' },
            { firstName: 'Jane', lastName: 'Doe', email: 'jane.doe@example.com', role: 'employee',dateBirth: '02-08-2007', position: 'coffe shop', startDay: '07-24-2024' },{ firstName: 'Jake', lastName: 'Black', email: 'twilight.wolve@example.com', role: 'admin',dateBirth: '08-02-1999', position: 'guard', startDay: '05-28-2023' }
        ];

        Staff.getAllStaff.mockResolvedValue(mockStaff);

        await getAll(req, res);

        expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockStaff);
    });

    it('should return 500 status if DB conection fails', async () => {
        Staff.getAllStaff.mockRejectedValue(new Error('Error retrieving staff members.'));
        
        await getAll(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
    });
});
describe('Staff controller: getSingle', () => {
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

    it('should return 200 status and the staff member information if ID exists', async () => {
        const mockStaff = { firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com', role: 'admin',dateBirth: '08-02-2000', position: 'cashier', startDay: '06-24-2025' };
        
        Staff.getStaffById.mockResolvedValue(mockStaff);

        await getSingle(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockStaff);
        expect(Staff.getStaffById).toHaveBeenCalledWith('65f9a1b2c3d4e5f6g7h8i9j0'); 
    });

    it('should return 404 status if the book is missing', async () => {
        Staff.getStaffById.mockResolvedValue(null);

        await getSingle(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: 'Library staff not found.' });
    });

    it('should return 500 status if there is an error on DB', async () => {
        Staff.getStaffById.mockRejectedValue(new Error('DB Error'));
        
        await getSingle(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
    });
});

describe('Staff controller: createStaff', () =>{
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
            firstName: 'John', 
            lastName: 'Doe', 
            email: 'john.doe@example.com',
            role: 'admin',
            dateBirth: '08-02-2000',
            position: 'cashier',
            startDay: '06-24-2025'
        }
        Staff.createStaffMember.mockResolvedValue({insertedId: '65f9a1b2c3d4e5f6g7h8i9j0'});

        await createStaff(req, res);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({id:'65f9a1b2c3d4e5f6g7h8i9j0' });

        expect(Staff.createStaffMember).toHaveBeenCalledTimes(1);
        expect(Staff.createStaffMember).toHaveBeenCalledWith(req.body);
    });
   
    const validStaffMember = {
        firstName: 'John', 
        lastName: 'Doe', 
        email: 'john.doe@example.com',
        role: 'admin',
        dateBirth: '08-02-2000',
        position: 'cashier',
        startDay: '06-24-2025'
    };

    const missingCases = [
        ['firstName', 'First name is required and must be a non-empty string.'],
        ['lastName', 'Last Name is required and must be a non-empty string.'],
        ['email', 'A valid email is required.'],
        ['role', 'role is required (e.g. admin, general).'],
        ['dateBirth', 'Date of birth is required and must be a non-empty string.'],
        ['position', 'Position is required (e.g. cashier, recepcionist).'],
        ['startDay', 'Start day is required and must be a non-empty string.']
        ];
    it.each(missingCases)('should return 400 status if %s is missing', async (field, expectedErrorMessage) => {
        req.body = {...validStaffMember};
        delete req.body[field];
        await createStaff(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            error: expectedErrorMessage
        });

        expect(Staff.createStaffMember).not.toHaveBeenCalled();
    });

    it('should return 500 status if DB throws an error', async() =>{
        req.body ={
            firstName: 'John', 
            lastName: 'Doe', 
            email: 'john.doe@example.com',
            role: 'admin',
            dateBirth: '08-02-2000',
            position: 'cashier',
            startDay: '06-24-2025'
        };

        Staff.createStaffMember.mockRejectedValue(new Error('Cannot connect with DB'));

        await createStaff(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            error: 'Cannot connect with DB'
        });
    });
});