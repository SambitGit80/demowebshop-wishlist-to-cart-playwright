export interface NewUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export function generateUser(): NewUser {
  const uniqueId = `${Date.now()}${Math.floor(Math.random() * 1000)}`;
  return {
    firstName: 'Test',
    lastName: 'Shopper',
    email: `shopper.${uniqueId}@example.com`,
    password: 'Passw0rd!123',
  };
}

export function parsePrice(text: string): number {
  const value = Number(text.replace(/[^0-9.]/g, ''));
  if (Number.isNaN(value)) {
    throw new Error(`Unable to parse price from "${text}"`);
  }
  return value;
}
