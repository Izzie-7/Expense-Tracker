const modeBtn = document.getElementById("modeButton");
const modeIcon = document.getElementById("modeIcon");
const AddTransactionSection = document.getElementById("AddTransactionSection");
const closeAddTransaction = document.querySelectorAll(".closeAddTransaction");
const openAddTransaction = document.getElementById("openAddTransaction");
const formHtml = document.getElementById("AddTrasactionForm");
const no_Transaction = document.getElementById("no_Transaction");
const displayIncome = document.getElementById("display_income");
const displayExpense = document.getElementById("display_expense");
const amountInput = document.getElementById("amountInput");
const SearchInput = document.getElementById("SearchInput");
const selectByCategories = document.getElementById(
  "filterTransaction_BYCategories"
);

const typeBtn = document.querySelectorAll(".typeBtn");

const transaction_History = document.querySelector(".TransactionsHistory");

const theme = localStorage.getItem("expense_Tracker_theme");
let formObject;
let PastTransaction = JSON.parse(localStorage.getItem("ExpenseTracker"));
let transactions = PastTransaction ?? [];
let currentBalance = 0;
let total_Expense = 0;
let total_Income = 0;

// Function to format number with commas and two decimal places
function formatNumber(num) {
  return Number(num).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

// Display transaction
function DisplayTransaction() {
  if (transactions.length !== 0) {
    no_Transaction.classList.add("hidden");
    transactions.forEach((transaction) => {
      currentBalance =
        currentBalance +
        convert_Amount_to_Integar(
          transaction.transactionType,
          transaction.amount
        );
      transaction_History.innerHTML += ` 
                      <tr class="row1"">
                        <td>${transaction.date}</td>
                        <td>${transaction.description}</td>
                        <td>${transaction.category}</td>
                        <td id="${transaction.transactionType}">NGN ${formatNumber(transaction.amount)}</td>
                        <td id="${
                          transaction.transactionType
                        }">$${convert_to_Dollar(transaction.amount)}</td>
                        <td class="delete"><img src="images/delete.png" alt="deleteBtn"   /></td>
                        <td class="hidden">${transaction.id}</td>
                      </tr>`;
    });
  } else {
    no_Transaction.classList.remove("hidden");
  }
  display_Balance();
}

function convert_Amount_to_Integar(type, amount) {
  if (type === "expense") {
    total_Expense += parseInt(amount);
    return parseInt(-amount);
  } else {
    total_Income += parseInt(amount);
    return parseInt(amount);
  }
}

function display_Balance() {
  document.getElementById("currentBalance").innerHTML = formatNumber(currentBalance);
  document.getElementById("display_Income").innerHTML = formatNumber(total_Income);
  document.getElementById("display_Expense").innerHTML = formatNumber(total_Expense);
  document.getElementById("income_Naria").innerHTML =
    convert_to_Dollar(total_Income);
  document.getElementById("expense_Naria").innerHTML =
    convert_to_Dollar(total_Expense);
  document.getElementById("currentBalance_Naria").innerHTML =
    convert_to_Dollar(currentBalance);
}

function convert_to_Dollar(amount) {
  return (amount / 1550).toFixed(3);
}

DisplayTransaction();

// end of the Display transaction

function clear_typeBtn_color() {
  typeBtn.forEach((Btn) => {
    Btn.classList.remove("active");
  });
}

// Theme manipulation
if (theme === "dark-mode") {
  document.body.classList.add("dark-mode");
  modeIcon.src = "images/Moon.png";
}

modeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  if (document.body.classList.contains("dark-mode")) {
    modeIcon.src = "images/Moon.png";
    localStorage.setItem("expense_Tracker_theme", "dark-mode");
  } else {
    modeIcon.src = "images/Sun.png";
    localStorage.setItem("expense_Tracker_theme", "light-mode");
  }
});

// end of Theme manipulation

// opening of the Add transaction section
closeAddTransaction.forEach((Btn) => {
  Btn.addEventListener("click", () => {
    AddTransactionSection.classList.add("hidden");
  });
});

openAddTransaction.addEventListener("click", () => {
  AddTransactionSection.classList.remove("hidden");
});

//end of the opening of the Add transaction section

// manipulating the form value
typeBtn.forEach((Btn) => {
  Btn.addEventListener("click", () => {
    clear_typeBtn_color();
    Btn.classList.add("active");
  });
});

function genratenum() {
  return Math.floor(Math.random() * 1000);
}

formHtml.addEventListener("submit", (e) => {
  let transactionType = document.querySelector(".active");
  e.preventDefault();
  formObject = new FormData(formHtml);
  let object = {
    id: genratenum(),
    transactionType: transactionType.innerHTML,
    amount: formObject.get("amount"),
    description: formObject.get("description"),
    category: formObject.get("category"),
    date: formObject.get("date"),
  };
  transactions.push(object);
  storeTransaction();
});

function storeTransaction() {
  localStorage.setItem("ExpenseTracker", JSON.stringify(transactions));
  window.location.reload();
}

// Input manipulation
amountInput.addEventListener("input", () => {
  document.getElementById("naria_amount").innerHTML = `$${convert_to_Dollar(
    amountInput.value
  )}`;
});

// end of the Input manipulation

// delete the transaction
document.querySelectorAll(".delete").forEach((del) => {
  del.addEventListener("click", () => {
    const transactionId = del.nextElementSibling.innerHTML;
    const transactionDesc = del.parentElement.children[1].innerHTML;
    
    // Show confirmation dialog
    const confirmDelete = confirm(`Are you sure you want to delete the transaction:\n"${transactionDesc}"?`);
    
    if (confirmDelete) {
      deleteTransaction(transactionId);
    }
  });
});

function deleteTransaction(id) {
  let updatedTransaction = [];
  transactions.forEach((transaction) => {
    if (transaction.id != id) {
      updatedTransaction.push(transaction);
    }
  });
  transactions = updatedTransaction;
  storeTransaction();
}

// filtering the Transaction based on the search input and select element
SearchInput.addEventListener("input", () => {
  let arr = [];
  document.querySelectorAll(".row1").forEach((row) => {
    if (
      !row.children[1].innerHTML
        .toLocaleLowerCase()
        .includes(SearchInput.value.toLocaleLowerCase())
    ) {
      row.classList.add("hidden");
    } else {
      row.classList.remove("hidden");
      arr.push(1);
    }
  });
});

selectByCategories.addEventListener("change", () => {
  let arr = [];
  if (selectByCategories.value.length > 0) {
    document.querySelectorAll(".row1").forEach((row) => {
      if (row.children[2].innerHTML !== selectByCategories.value) {
        row.classList.add("hidden");
      } else {
        row.classList.remove("hidden");
        arr.push(1);
      }
    });
  } else {
    document.querySelectorAll(".row1").forEach((row) => {
      row.classList.remove("hidden");
    });
  }
});