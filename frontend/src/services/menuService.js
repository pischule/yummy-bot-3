const baseUrl = process.env.REACT_APP_API_URL;

function getQueryParams() {
  let initData = window.Telegram.WebApp.initData;
  return initData ? "?" + initData : window.location.search;
}

export async function getMenu() {
  return fetch(`${baseUrl}/menu${getQueryParams()}`);
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
