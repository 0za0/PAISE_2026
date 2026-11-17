
let tokens = 0;
let juniors = 0;
let debt = 0;
let price = 10;
let refactoring = false;

// Spielstand laden
try {
  const saved = JSON.parse(localStorage.getItem("gameSave"));
  if (saved) {
    tokens = saved.tokens ?? 0;
    juniors = saved.juniors ?? 0;
    debt = saved.debt ?? 0;
    price = saved.price ?? 10;
  }
} catch (e) {
  console.warn("Spielstand konnte nicht geladen werden");
}

function writeCode() {
  tokens += 1;
  update();
}

function buyJunior() {
  if (tokens >= price) {
    tokens -= price;
    juniors++;
    price = Math.ceil(price * 1.15);
    update();
  }
}

function refactor() {
  if (refactoring || debt <= 0) return;

  refactoring = true;
  setTimeout(() => {
    debt = Math.max(0, debt - 20);
    refactoring = false;
    update();
  }, 10000);
}

// Automatische Produktion
setInterval(() => {
  const multiplier =
    debt >= 75 ? 0.5 :
    debt >= 50 ? 0.75 :
    debt >= 25 ? 0.9 : 1;

  const tps = juniors * multiplier *
    (refactoring ? 0.5 : 1);

  tokens += tps / 10;
  debt = Math.min(100, debt + juniors * 0.0005);

  update();
}, 100);

function update() {
  const multiplier =
    debt >= 75 ? 0.5 :
    debt >= 50 ? 0.75 :
    debt >= 25 ? 0.9 : 1;

  const tps = juniors * multiplier *
    (refactoring ? 0.5 : 1);

  document.getElementById("tokens").textContent =
    tokens.toFixed(1);
  document.getElementById("tps").textContent =
    tps.toFixed(1);
  document.getElementById("juniors").textContent = juniors;
  document.getElementById("price").textContent = price;
  document.getElementById("debt").textContent =
    debt.toFixed(1);

  localStorage.setItem("gameSave", JSON.stringify({
    tokens, juniors, debt, price
  }));
}

update();
