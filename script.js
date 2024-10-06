document.addEventListener("DOMContentLoaded", () => {
    const balanceEl = document.getElementById('balance');
    const totalIncomeEl = document.getElementById('total-income');
    const totalExpensesEl = document.getElementById('total-expenses');
    const descriptionEl = document.getElementById('description');
    const amountEl = document.getElementById('amount');
    const typeEl = document.getElementById('type');
    const transactionList = document.getElementById('transaction-list');
    const filterEls = document.querySelectorAll('input[name="filter"]');
    let transactions = JSON.parse(localStorage.getItem('transactions')) || [];


    function updateForm() {
        transactionList.innerHTML = '';
        let totalIncome = 0, totalExpenses = 0, balance = 0;

        transactions.forEach((transaction, index) => {
            const { type, description, amount } = transaction;
            const listItem = document.createElement('li');
            listItem.innerHTML = `
          ${description} <span>₹${amount}</span>
          <button class="edit-btn" data-index="${index}">Edit</button>
          <button class="delete-btn" data-index="${index}">Delete</button>
        `;

            transactionList.appendChild(listItem);

            if (type === 'income') {
                totalIncome += amount;
            } else {
                totalExpenses += amount;
            }
        });

        balance = totalIncome - totalExpenses;
        balanceEl.textContent = `₹${balance.toFixed(2)}`;
        totalIncomeEl.textContent = `₹${totalIncome.toFixed(2)}`;
        totalExpensesEl.textContent = `₹${totalExpenses.toFixed(2)}`;

        filterTransactions();
    }

    function addTransaction() {
        const description = descriptionEl.value.trim();
        const amount = parseFloat(amountEl.value.trim());
        const type = typeEl.value;

        if (description && !isNaN(amount)) {
            transactions.push({ type, description, amount });
            localStorage.setItem('transactions', JSON.stringify(transactions));
            updateForm();
        }
    }

    function editTransaction(index) {
        const transaction = transactions[index];
        descriptionEl.value = transaction.description;
        amountEl.value = transaction.amount;
        typeEl.value = transaction.type;
        transactions.splice(index, 1);
        updateForm();
    }

    function deleteTransaction(index) {
        transactions.splice(index, 1);
        localStorage.setItem('transactions', JSON.stringify(transactions));
        updateForm();
    }

    function filterTransactions() {
        const selectedFilter = document.querySelector('input[name="filter"]:checked').value;
        const filteredTransactions = transactions.filter(transaction => {
            return selectedFilter === 'all' || transaction.type === selectedFilter;
        });

        transactionList.innerHTML = '';
        filteredTransactions.forEach((transaction, index) => {
            const { type, description, amount } = transaction;
            const listItem = document.createElement('li');
            listItem.innerHTML = `
          ${description} <span>₹${amount}</span>
          <button class="edit-btn" data-index="${index}">Edit</button>
          <button class="delete-btn" data-index="${index}">Delete</button>
        `;
            transactionList.appendChild(listItem);
        });
    }

    // Add Event Listeners
    document.getElementById('add-btn').addEventListener('click', addTransaction);

    transactionList.addEventListener('click', (e) => {
        const index = e.target.dataset.index;
        if (e.target.classList.contains('edit-btn')) {
            editTransaction(index);
        } else if (e.target.classList.contains('delete-btn')) {
            deleteTransaction(index);
        }
    });

    filterEls.forEach(filterEl => {
        filterEl.addEventListener('change', filterTransactions);
    });

    updateForm();
});
