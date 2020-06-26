import { getFirstName, isValidPassword } from '../src/utils/user';

describe('Basic Tests', () => {
  test('getFirstName should return first name', () => {
    const first = getFirstName('Julian Nicholls');

    expect(first).toBe('Julian');
  });

  test('getFirstName should be OK with just a first name', () => {
    const first = getFirstName('Julian');

    expect(first).toBe('Julian');
  });

  test('should reject short password', () => {
    expect(isValidPassword('1234567')).toBe(false);
  });

  test('Should reject password with password in it', () => {
    expect(isValidPassword('apassword')).toBe(false);
    expect(isValidPassword('passworda')).toBe(false);
    expect(isValidPassword('apassworda')).toBe(false);
  });

  test('Should accept valid passwords', () => {
    expect(isValidPassword('12345678')).toBe(true);
    expect(isValidPassword('123456789')).toBe(true);

    expect(isValidPassword('apasswor')).toBe(true);
    expect(isValidPassword('assworda')).toBe(true);
    expect(isValidPassword('pass@word')).toBe(true);
  });
});
