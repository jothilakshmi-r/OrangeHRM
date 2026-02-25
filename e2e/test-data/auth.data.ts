function requireEnv(name: 'ORANGEHRM_USERNAME' | 'ORANGEHRM_PASSWORD'): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} is not set. Add it to your local .env or CI secrets.`);
  }

  return value;
}

export const authData = {
  username: requireEnv('ORANGEHRM_USERNAME'),
  password: requireEnv('ORANGEHRM_PASSWORD'),
};
