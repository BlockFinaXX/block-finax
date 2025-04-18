export async function registerUser(email: string, password: string) {
  const res = await fetch("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return await res.json();
}

export async function loginUser(email: string, password: string) {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return await res.json(); // contains token
}

export async function createWallet(token: string) {
  const res = await fetch("/api/wallet/create", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return await res.json();
}
