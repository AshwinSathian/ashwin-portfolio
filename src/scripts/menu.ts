// Mobile menu: a native <dialog>.
const menu = document.getElementById("menu") as HTMLDialogElement | null;
document.getElementById("menu-open")?.addEventListener("click", () => menu?.showModal());
document.getElementById("menu-close")?.addEventListener("click", () => menu?.close());
// A click that lands on the dialog element itself is on the backdrop.
menu?.addEventListener("click", (e) => e.target === menu && menu.close());
menu?.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => menu.close()));
