const Modal = {
  toggle(event) {
    event.preventDefault() // Para a página não subir ao clicar no link (que leva até o "#")
    document
      .querySelector('.modal-overlay')
      .classList
      .toggle('active')
  }
}

const Storage = {
  get() {
    return JSON.parse(localStorage.getItem('dev.finances:transactions')) || []
  },
  set(transactions) {
    localStorage.setItem('dev.finances:transactions', JSON.stringify(transactions))
  }
}

const Transaction = {
  all: Storage.get(),
  
  add(transaction) {
    Transaction.all.push(transaction)
    App.reload()
  },
  
  remove(index) {
    Transaction.all.splice(index, 1)
    App.reload()
  },
  
  incomes() {
    // Somar as entradas
    let income = 0
    // Pegar todas as transações
    Transaction.all.forEach(transaction => {
      // Se ela for maior que zero
      if (transaction.amount > 0) {
        income += transaction.amount
      }
    })
    return income
  },
  
  expenses() {
    // Somar as saídas
    let expense = 0
    // Pegar todas as transações
    Transaction.all.forEach(transaction => {
      // Se ela for menor que zero
      if (transaction.amount < 0) {
        expense += transaction.amount
      }
    })
    return expense
  },
  
  total() {
    // Entradas - saídas
    let total = Transaction.incomes() + Transaction.expenses()
    
    DOM.totalBG(total)
    
    return total
  }
}

const DOM = {
  transactionContainer: document.querySelector('#data-table tbody'),
  
  addTransaction(transaction, index) {
    const tr = document.createElement('tr')
    tr.innerHTML = DOM.innerHTMLTransaction(transaction, index)
    tr.dataset.index = index

    DOM.transactionContainer.appendChild(tr)
  },
  
  innerHTMLTransaction(transaction, index) {
    const CSSclass = transaction.amount > 0 ? 'income' : 'expense' 
    
    const amount = Utils.formatCurrency(transaction.amount)
    
    const html = `
      <td class="description">${transaction.description}</td>
      <td class="${CSSclass}">${amount}</td>
      <td class="date">${transaction.date}</td>
      <td><img onclick="Transaction.remove(${index})" src="./assets/minus.svg" alt="Remover transação"/></td>
    `
    return html
  },
  
  updateBalance() {
    document
      .getElementById('incomeDisplay')
      .innerHTML = Utils.formatCurrency(Transaction.incomes())
    document
      .getElementById('expenseDisplay')
      .innerHTML = Utils.formatCurrency(Transaction.expenses())
    document
      .getElementById('totalDisplay')
      .innerHTML = Utils.formatCurrency(Transaction.total())
  },
  
  clearTransactions() {
    DOM.transactionContainer
      .innerHTML = ''
  },
  
  /* ===== Incrementos ===== */
  totalBG(value) {
    const totalContainer = document.querySelector('.card.total')
    
    value < 0 ? totalContainer.classList.add('red') : totalContainer.classList.remove('red')
  },
  
  navTrigger() {
    const navEl = document.querySelector('nav')
    const triggerEl = document.querySelector('header img')
    
    const navPointTrigger = navEl.getBoundingClientRect().top
    const triggerPoint = triggerEl.getBoundingClientRect().bottom
    
    if(navPointTrigger > triggerPoint) {
      navEl.classList.add('active')
      triggerEl.classList.add('hide')
    } else {
      navEl.classList.remove('active')
      triggerEl.classList.remove('hide')
    }
  },
  
  toggleMenu(event) {
    event.preventDefault
    const menu = document.querySelector('.menu-overlay')
    menu.classList.toggle('active')
  },
  
  changeTheme(event) {
    event.preventDefault
    const themeBtn = document.querySelector('.themeNow')
    const html = document.querySelector('html')
    
    html.classList.toggle('dark')
    
    if(html.classList.contains('dark')) {
      themeBtn.innerHTML = "<span>Dark<i class='far fa-moon'></i></span>"
    } else {
      themeBtn.innerHTML = "<span>Light<i class='far fa-sun'></i></span>"
    }
  }
}

const Utils = {
  formatCurrency(value) {
    const signal = +value < 0 ? '-' : ''
    
    // As duas barras ([/]\D[/]g (as que estão inclinadas para a direita)) definem a expressão regular
   // "g" fala que vai fazer a pesquisa global
   // "/D" diz para encontrar tudo que for diferente de número
    value = String(value).replace(/\D/g, '')
    
    value = +value / 100
    
    value = value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })
    
    return signal + value
  },
  
  formatAmount(value) {
    value = +value * 100
    return value
  },
  
  formatDate(date) {
    const splittedDate = date.split('-')
    return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
  }
}

const Form = {
  description: document.querySelector('input#description'),
  amount: document.querySelector('input#amount'),
  date: document.querySelector('input#date'),
  
  getValues() {
    return {
      description: Form.description.value,
      amount: Form.amount.value,
      date: Form.date.value
    }
  },
  
  validateFields() {
    const {description, amount, date} = Form.getValues()
    
    if (description.trim() === '' || amount.trim() === '' || date.trim() === '') {
      throw new Error('Por favor, preencha todos os campos')
    }
  },
  
  formatValues() {
    let {description, amount, date} = Form.getValues()
    
    amount = Utils.formatAmount(amount)
    date = Utils.formatDate(date)
    
    return {
      description,
      amount,
      date
    }
  },
  
  clearFields() {
    Form.description.value = ''
    Form.amount.value = ''
    Form.date.value = ''
  },

  submit(event) {
    event.preventDefault()
    
    try {
    // Verificar se todas as informações foram preenchidas
    Form.validateFields()
    
    // Formatar os dados para salvar
    const transaction = Form.formatValues()
    
    // Salvar
    Transaction.add(transaction)
    
    // Apagar os dados do formulário
    Form.clearFields()
    
    // Fechar o modal
    Modal.toggle(event)
    } catch (error) {
      alert(error.message)
    }
  }
}

const App = {
  init() {
    // Passando transaction e index como parâmetro nas duas funções
    Transaction.all.forEach(DOM.addTransaction)
    
    DOM.updateBalance()
    
    Storage.set(Transaction.all)
  },
  
  reload() {
    DOM.clearTransactions()
    App.init()
  }
}

App.init()

// Nav
window.addEventListener('scroll', DOM.navTrigger)