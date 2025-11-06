// src/lib/auth.mock.ts
export type User = {
  userType: string;
  id: string;
  username: string;
  email: string;
  accountType: "user" | "developer";
};

type UserRecord = User & { password: string };

const AUTH_USERS_KEY = "auth_users";
const AUTH_CURRENT_KEY = "auth_current_user";

// seed inicial
const seedUsers: UserRecord[] = [
  { id: "1", username: "player1", email: "player@example.com", password: "password", accountType: "user" },
  { id: "2", username: "gamedev", email: "dev@example.com", password: "password", accountType: "developer" },
];

function readUsers(): UserRecord[] {
  try {
    const raw = localStorage.getItem(AUTH_USERS_KEY);
    if (raw) return JSON.parse(raw) as UserRecord[];
  // eslint-disable-next-line no-empty
  } catch {}
  localStorage.setItem(AUTH_USERS_KEY, JSON.stringify(seedUsers));
  return [...seedUsers];
}

function writeUsers(list: UserRecord[]) {
  localStorage.setItem(AUTH_USERS_KEY, JSON.stringify(list));
}

export function getCurrentUser(): User | null {
  try {
    const raw = localStorage.getItem(AUTH_CURRENT_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}

export function signOut() {
  localStorage.removeItem(AUTH_CURRENT_KEY);
}

export function signIn(email: string, password: string): User | null {
  const users = readUsers();
  const found = users.find((u) => u.email === email && u.password === password);
  if (!found) return null;
  const { password: _pw, ...user } = found;
  localStorage.setItem(AUTH_CURRENT_KEY, JSON.stringify(user));
  return user;
}

export function signUp(username: string, email: string, password: string, accountType: User["accountType"]): User {
  const users = readUsers();
  if (users.some((u) => u.email === email)) {
    throw new Error("E-mail já cadastrado.");
  }
  const record: UserRecord = {
    id: Date.now().toString(),
    username,
    email,
    password,
    accountType,
  };
  users.push(record);
  writeUsers(users);
  const { password: _pw, ...user } = record;
  localStorage.setItem(AUTH_CURRENT_KEY, JSON.stringify(user));
  return user;
}
