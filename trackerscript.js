// ================== ELEMENTS ==================
const balance = document.getElementById("balance");
const money_plus = document.getElementById("money-plus");
const money_minus = document.getElementById("money-minus");
const list = document.getElementById("list");
const form = document.getElementById("form");
const text = document.getElementById("text");
const amount = document.getElementById("amount");
const categoryInput = document.getElementById("category");
const dateInput = document.getElementById("date");
const filterDate = document.getElementById("filter-date");

// ================== STORAGE ==================
const localStorageTransactions = JSON.parse(localStorage.getItem("transactions"));
let transactions = localStorage.getItem("transactions") !== null ? localStorageTransactions : [];

// ================== ADD TRANSACTION ==================
function addTransaction(e) {
  e.preventDefault();

  if (text.value.trim() === "" || amount.value.trim() === "") {
    alert("Please enter text and amount");
    return;
  }

  const transaction = {
    id: generateID(),
    text: text.value,
    amount: +amount.value,
    category: categoryInput.value,
    date: dateInput.value || new Date().toISOString().split("T")[0]
  };

  transactions.push(transaction);
  updateLocalStorage();
  Init();

  text.value = "";
  amount.value = "";
}

// ================== GENERATE ID ==================
function generateID() {
  return Math.floor(Math.random() * 1000000000);
}

// ================== ADD TO DOM ==================
function addTransactionDOM(transaction) {
  const item = document.createElement("li");

  item.classList.add(transaction.amount < 0 ? "minus" : "plus");

  item.innerHTML = `
    ${transaction.text}
    <span>₹${Math.abs(transaction.amount)}</span>
    <span class="category">${transaction.category}</span>
    <span class="date">${transaction.date}</span>
    <button class="delete-btn" onclick="removeTransaction(${transaction.id})">x</button>
  `;

  list.appendChild(item);
}

// ================== UPDATE VALUES (FILTERED) ==================
function updateValuesFiltered(data) {
  if (data.length === 0) {
    balance.innerHTML = "₹0";
    money_plus.innerHTML = "+₹0";
    money_minus.innerHTML = "-₹0";
    return;
  }

  const amounts = data.map(t => t.amount);

  const total = amounts.reduce((a, b) => a + b, 0).toFixed(2);
  const income = amounts.filter(a => a > 0).reduce((a, b) => a + b, 0).toFixed(2);
  const expense = (
    amounts.filter(a => a < 0).reduce((a, b) => a + b, 0) * -1
  ).toFixed(2);

  balance.innerHTML = `₹${total}`;
  money_plus.innerHTML = `+₹${income}`;
  money_minus.innerHTML = `-₹${expense}`;
}

// ================== REMOVE TRANSACTION ==================
function removeTransaction(id) {
  transactions = transactions.filter(transaction => transaction.id !== id);
  updateLocalStorage();
  Init();
}

// ================== LOCAL STORAGE ==================
function updateLocalStorage() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

// ================== INIT + FILTER ==================
function Init() {
  list.innerHTML = "";

  const filter = filterDate.value;
  let filteredTransactions = transactions;

  if (filter === "today") {
    const today = new Date().toISOString().split("T")[0];
    filteredTransactions = transactions.filter(t => t.date === today);
  } 
  else if (filter === "week") {
    const now = new Date();
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    filteredTransactions = transactions.filter(t => new Date(t.date) >= startOfWeek);
  } 
  else if (filter === "month") {
    const now = new Date();
    filteredTransactions = transactions.filter(t => {
      const d = new Date(t.date);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    });
  }

  filteredTransactions.forEach(addTransactionDOM);
  updateValuesFiltered(filteredTransactions);
}

// ================== EVENTS ==================
form.addEventListener("submit", addTransaction);
filterDate.addEventListener("change", Init);

// ================== START ==================
Init();
