const baseUrl = process.env.REACT_APP_API_URL;

function getQueryParams() {
  return window.location.search;
}

export async function getMenu() {
  return fetch(`${baseUrl}/menu`);
}

export async function isLoggedIn() {
  const { ok } = await fetch(`${baseUrl}/auth${getQueryParams()}`, {
    method: "HEAD",
  });
  return ok;
}

export async function sendOrder(order, idempotencyKey) {
  return fetch(`${baseUrl}/order${getQueryParams()}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Idempotency-Key": idempotencyKey,
    },
    body: JSON.stringify(order),
  });
}
