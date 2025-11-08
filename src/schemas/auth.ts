import { api } from '../lib/axios';

export async function register({ username, password, userType }: { username:string; password:string; userType:'PLAYER'|'DEV' }) {
  const { data } = await api.post('/auth/register', { username, password, userType });
  localStorage.setItem('token', data.token);
  localStorage.setItem('user', JSON.stringify(data.user));
  return data.user;
}

export async function login({ username, password }: { username:string; password:string }) {
  const { data } = await api.post('/auth/login', { username, password });
  localStorage.setItem('token', data.token);
  localStorage.setItem('user', JSON.stringify(data.user));
  return data.user;
}

export function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}
