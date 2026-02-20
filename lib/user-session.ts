const USER_KEY = "jft-user-id";

export function getUserId() {
  if (typeof window === "undefined") {
    return "anonymous";
  }
  const existing = window.localStorage.getItem(USER_KEY);
  if (existing) {
    return existing;
  }
  const id =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `user-${Math.random().toString(36).slice(2, 10)}`;
  window.localStorage.setItem(USER_KEY, id);
  return id;
}
