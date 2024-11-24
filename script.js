// Sorting Function
function sortTable(tableId, columnIndex, dataType) {
    const table = document.getElementById(tableId);
    const tbody = table.querySelector("tbody");
    const rows = Array.from(tbody.querySelectorAll("tr"));

    // Sort rows based on the specified data type
    const sortedRows = rows.sort((a, b) => {
        const aText = a.cells[columnIndex].innerText.trim();
        const bText = b.cells[columnIndex].innerText.trim();

        if (dataType === "number") {
            return parseFloat(aText) - parseFloat(bText); // Sort numerically
        } else if (dataType === "date") {
            return new Date(aText) - new Date(bText); // Sort by date
        } else {
            return aText.localeCompare(bText); // Sort alphabetically
        }
    });

    // Clear existing rows and append sorted rows
    tbody.innerHTML = "";
    sortedRows.forEach(row => tbody.appendChild(row));
}

// Event Listener for Dropdown (Sort Options)
document.getElementById("sort-options").addEventListener("change", (event) => {
    const sortOption = event.target.value;

    // Call the sortTable function based on the selected option
    if (sortOption === "date") {
        sortTable("expenses-table", 0, "date"); // Sort by Date
    } else if (sortOption === "category") {
        sortTable("expenses-table", 1, "string"); // Sort by Category
    } else if (sortOption === "amount") {
        sortTable("expenses-table", 2, "number"); // Sort by Amount
    }
});

// BudgetManager Class
class MonthlyBudget {
    constructor(currentBudgetId, newBudgetInputId, totalExpensesId, remainBudgetId, tableId) {
        // Initialize DOM elements and state variables
        this.currentBudgetElement = document.getElementById(currentBudgetId);
        this.newBudgetInput = document.getElementById(newBudgetInputId);
        this.totalExpensesElement = document.getElementById(totalExpensesId);
        this.remainBudgetElement = document.getElementById(remainBudgetId);
        this.expensesTable = document.getElementById(tableId).querySelector("tbody");

        this.currentBudget = 0; // Current budget value
        this.totalExpenses = 0; // Total expenses value
        this.expenses = []; // Array to store expense objects
    }

    // Update the current budget
    updateBudget() {
        const newBudget = parseFloat(this.newBudgetInput.value);
        if (isNaN(newBudget) || newBudget < 0) {
            alert("Please enter a valid budget amount."); // Validation check
            return;
        }
        this.currentBudget = newBudget; // Set new budget
        this.renderBudget(); // Update the budget display
        this.updateRemainingBudget(); // Recalculate remaining budget
        this.newBudgetInput.value = ""; // Clear input field
    }

    // Add a new expense
    addExpense(date, category, amount) {
        const expenseAmount = parseFloat(amount);
        if (isNaN(expenseAmount) || expenseAmount <= 0) {
            alert("Please enter a valid expense amount."); // Validation check
            return;
        }
        const expense = { date, category, amount: expenseAmount }; // Create expense object
        this.expenses.push(expense); // Add expense to array
        this.totalExpenses += expenseAmount; // Update total expenses
        this.renderExpensesTable(); // Update the expenses table
        this.updateTotalExpenses(); // Update total expenses display
        this.updateRemainingBudget(); // Update remaining budget display
    }

    // Render the expenses table
    renderExpensesTable() {
        this.expensesTable.innerHTML = ""; // Clear table
        this.expenses.forEach(expense => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${expense.date}</td>
                <td>${expense.category}</td>
                <td>${Number.isInteger(expense.amount) ? expense.amount : expense.amount.toFixed(2)}</td>
            `;
            this.expensesTable.appendChild(row); // Add row to table
        });
    }

    // Update total expenses display
    updateTotalExpenses() {
        const total = this.totalExpenses;
        this.totalExpensesElement.innerText = `$${Number.isInteger(total) ? total : total.toFixed(2)}`;
    }

    // Update remaining budget display
    updateRemainingBudget() {
        const remainingBudget = this.currentBudget - this.totalExpenses;
        this.remainBudgetElement.innerText = `$${Number.isInteger(remainingBudget) ? remainingBudget : remainingBudget.toFixed(2)}`;
    }

    // Render the updated budget
    renderBudget() {
        const budget = this.currentBudget;
        this.currentBudgetElement.innerText = `$${Number.isInteger(budget) ? budget : budget.toFixed(2)}`;
    }
}

// Initialize the MonthlyBudget class
const budgetManager = new MonthlyBudget(
    "monthly-budget", // Current budget display
    "new-budget", // New budget input
    "total-expenses", // Total expenses display
    "remain-budget", // Remaining budget display
    "expenses-table" // Expenses table ID
);

// Event Listener for Budget Update
document.getElementById("update-budget").addEventListener("click", () => {
    budgetManager.updateBudget(); // Update budget on button click
});

// Event Listener for Adding Expenses
document.getElementById("expense-form").addEventListener("submit", (event) => {
    event.preventDefault(); // Prevent form submission
    const date = document.getElementById("date").value;
    const category = document.getElementById("category").value;
    const amount = document.getElementById("amount").value;

    if (date && category && amount) {
        budgetManager.addExpense(date, category, amount); // Add expense
        document.getElementById("expense-form").reset(); // Reset form
    }
});
