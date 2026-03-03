const form = document.querySelector("form") 
const amount = document.getElementById("amount")
const expense = document.getElementsByClassName("expanse")
const category = document.getElementById("category")

amount.oninput = () => {
    let value = amount.value.replace(/\D/g, "")

    value = Number(value) / 100

    amount.value = formatCurrencyBRL(value)
}

function formatCurrencyBRL(value) {
    value = value.toLocaleString("pt-BR",{
        style: "currency",
        currency: "BRL"
    })

    return value
}


//captura o submit do formulário para obter valores
form.onsubmit = (event) => {
    
    //previne o comportamento padrão de recarregar a página
    event.preventDefault()

    const newExpanse = {
        id: new Date().getTime(),
        expense: expense.value,
        category_id: category.value,
        category_name: category.options[category.selectedIndex].text,
        amount: amount.value,
        created_at: new Date()
    }
    expandAdd(newExpanse)

}

function expandAdd(newExpanse) {
    try {
        alert("Despesa adcionada!!!")
    } catch (error) {
        alert("Não foi possível atualizar a lista de despesas.")
        console.log(error)
    }
}