import {
  auth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut
} from '@/firebase';

let currentUser = null;

onAuthStateChanged(auth, (user) => {
  currentUser = user;
});

export function getCurrentUser() {
  return currentUser;
}

export async function login(email, password) {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  currentUser = cred.user;
  return cred.user;
}

export async function logout() {
  await signOut(auth);
  currentUser = null;
}

