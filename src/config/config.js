const currentURL = window.location.origin;

export const apiURL =
  currentURL.includes("localhost")
    ? "http://localhost:5000/api/"
    : "https://budget-boss-backend.vercel.app/api/";
