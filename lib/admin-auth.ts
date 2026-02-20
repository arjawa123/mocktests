const ADMIN_KEY = "jft-admin-auth";
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "Rjw#2023";

export function signInAdmin(username: string, password: string) {
  if (typeof window === "undefined") {
    return false;
  }
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    window.localStorage.setItem(ADMIN_KEY, "true");
    return true;
  }
  return false;
}

export function signOutAdmin() {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.removeItem(ADMIN_KEY);
}

export function isAdminAuthenticated() {
  if (typeof window === "undefined") {
    return false;
  }
  return window.localStorage.getItem(ADMIN_KEY) === "true";
}
