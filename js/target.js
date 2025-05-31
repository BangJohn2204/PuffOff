
const imageEl = document.getElementById("hero-image");
const nameEl = document.getElementById("hero-name");
const button = document.getElementById("spin-button");
const roleSelect = document.getElementById("role-filter");

function getFilteredHeroes(role) {
  if (role === "All") return heroes;
  return heroes.filter(h => Array.isArray(h.role) ? h.role.includes(role) : h.role === role);
}

button.addEventListener("click", () => {
  const selectedRole = roleSelect.value;
  const filtered = getFilteredHeroes(selectedRole);
  if (filtered.length === 0) {
    alert("No hero found for this role!");
    return;
  }

  let index = 0;
  let totalSpins = 25 + Math.floor(Math.random() * 10);
  let spinSpeed = 100;

  const spinner = setInterval(() => {
    const hero = filtered[index % filtered.length];
    imageEl.src = hero.img;
    nameEl.textContent = hero.name;
    index++;

    if (index >= totalSpins) {
      clearInterval(spinner);
    }
  }, spinSpeed);
});
