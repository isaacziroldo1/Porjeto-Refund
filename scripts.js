const form = document.querySelector("form") 
const amount = document.getElementById("amount")
const expense = document.getElementById("expense")
const category = document.getElementById("category")

// Select summary/list elements from the page.
const expenseList = document.querySelector("ul")
const expensesQuantity = document.querySelector("aside header p span")
const expensesTotal = document.querySelector("aside header h2")

// Format the amount input as BRL currency while the user types.
amount.oninput = () => {
    // Keep only digits to avoid invalid currency characters.
    let value = amount.value.replace(/\D/g, "")

    // Convert cents to the decimal format used by currency.
    value = Number(value) / 100

    amount.value = formatCurrencyBRL(value)
}

// Convert a numeric value to pt-BR currency format.
function formatCurrencyBRL(value) {
    value = value.toLocaleString("pt-BR",{
        style: "currency",
        currency: "BRL"
    })

    return value
}


// Capture form submission to create and render a new expense.
form.onsubmit = (event) => {
    // Prevent page reload on form submit.
    event.preventDefault()

    // Build the expense payload from the current form values.
    const newExpense = {
        id: new Date().getTime(),
        expense: expense.value,
        category_id: category.value,
        category_name: category.options[category.selectedIndex].text,
        amount: amount.value,
        created_at: new Date(),
    }

    // Render the new expense in the list.
    expenseAdd(newExpense)
}

// Create and append one expense row to the list.
function expenseAdd(newExpense) {
    try {
        // Create the list item wrapper.
        const expenseItem = document.createElement("li")
        expenseItem.classList.add("expense")

        // Create the category icon.
        const expenseIcon = document.createElement("img")
        expenseIcon.setAttribute("src", `img/${newExpense.category_id}.svg`)
        expenseIcon.setAttribute("alt", newExpense.category_name)

        // Create the expense info container.
        const expenseInfo = document.createElement("div")
        expenseInfo.classList.add("expense-info")

        // Create the expense name element.
        const expenseName = document.createElement("strong")
        expenseName.textContent = newExpense.expense

        // Create the category label element.
        const expenseCategory = document.createElement("span")
        expenseCategory.textContent = newExpense.category_name

        // Append name and category to the info container.
        expenseInfo.append(expenseName, expenseCategory)

        // Create the formatted amount element.

        const expenseAmount = document.createElement("span")
        expenseAmount.classList.add("expense-amount")
        expenseAmount.innerHTML = `<small>R$</small>${newExpense.amount.toUpperCase().replace("R$", "")} `

        // Create the remove icon.
        const removeIcon = document.createElement("img")
        removeIcon.classList.add("remove-icon")
        removeIcon.setAttribute("src", "img/remove.svg")
        removeIcon.setAttribute("alt", "Remover")

        // Assemble the expense row.
        expenseItem.append(expenseIcon, expenseInfo, expenseAmount, removeIcon)

        // Append the row to the list.
        expenseList.append(expenseItem)

        // Recalculate summary values.
        updateTotals()

        formClear()

    } catch (error) {
        alert("Não foi possível atualizar a lista de despesas.")
        console.log(error)
    }


}

// Recalculate quantity and total amount from current list items.
function updateTotals() {
    try {
        const items = expenseList.children
        expensesQuantity.textContent = `${items.length} ${items.length > 1 ? "Despesas" : "Despesa"}`
        

        // Accumulator for the list total.
        let total = 0

        for(let item = 0; item < items.length; item++) {

            const itemAmount = items[item].querySelector(".expense-amount")

            // Keep only numeric content and normalize decimal separator.
            let value = itemAmount.textContent.replace(/[^\d,]/g, "").replace(",", ".")

            value = parseFloat(value)

            // Stop and warn if an invalid amount is found.
            if(isNaN(value)){
                return alert("Não foi possível atualizar os totais")
            }

            total += Number(value)
            
        }

        // Render total as symbol + numeric value.
        const symbolBRL = document.createElement("small")
        symbolBRL.textContent = "R$"

        total = formatCurrencyBRL(total).toUpperCase().replace("R$", "")

        expensesTotal.innerHTML = ""

        expensesTotal.append(symbolBRL, total)

    } catch (error) {
        console.log(error)
        alert("Não foi possível atualizar o total!")
    }


}


expenseList.addEventListener("click", function (event){
    if (event.target.classList.contains("remove-icon")) {
        const item = event.target.closest(".expense")
        item.remove()
    }

    updateTotals()
}) 

function formClear(){
    expense.value = ""
    amount.value = ""
    category.value = ""

    expense.focus()
}