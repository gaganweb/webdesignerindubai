(() => {
  const root = document.documentElement;

  try {
    const isDark = window.localStorage.getItem("theme") === "dark";
    root.classList.toggle("dark", isDark);
    root.classList.toggle("light", !isDark);
  } catch {
    root.classList.add("light");
    root.classList.remove("dark");
  }
})();