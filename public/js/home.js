const myModal = new bootstrap.Modal("#transaction-modal"); //CONFIGURARL MODAL//
let logged = sessionStorage.getItem("logged");
const session = localStorage.getItem("session");
let data = {
    transactions: []
};


document.getElementById("button-logout").addEventListener("click", logout);
document.getElementById("transactions-button").addEventListener("click", function () {
    window.location.href = "./transactions.html";
})

//ADICIONAR LANÇAMENTO

document.getElementById("transaction-form").addEventListener("submit",function (e){
    e.preventDefault();

    const value = parseFloat(document.getElementById("value-input").value);
    const description = document.getElementById("description-input").value;
    const date = document.getElementById("date-input").value;
    const type = document.querySelector('input[name="inlineRadioOptions"]:checked').value;
    
    //Verificando o saldo quando houver transação de saida.
    if(type == "2"){
        const sal = saldo(data.transactions);
      
        if(sal < value){
            myModal.hide();
         alert("Atenção Saldo Negativo. :( ");
        salvarTransaction(value, type, description, date, e);
        }
    }
    salvarTransaction(value, type, description, date, e);
    atualizarSaldo();
});

checkLogged();
atualizarSaldo();

function salvarTransaction(value, type, description, date, e) {
    data.transactions.unshift({
        value: value, type: type, description: description, date: date
    });
    saveData(data);
    e.target.reset();
    myModal.hide();

    getCashIn();
    getCashOut();

    alert("Lançamento adicionado com sucesso");
}
checkLogged();

//VERIFICAR LOGIN//
function checkLogged() {
    if (session) {
        sessionStorage.setItem("logged", session);
        logged = session;
    }

    if (!logged) {
        window.location.href = "index.html";
        return;

    }
    const dataUser = localStorage.getItem(logged);
    if (dataUser) {
        data = JSON.parse(dataUser);
    }

    getCashIn();
    getCashOut();

}

function logout() {
    sessionStorage.removeItem("logged");
    sessionStorage.removeItem("session");
    window.location.href = "index.html";
    return;

};

function saveData(data) {
    localStorage.setItem(data.login, JSON.stringify(data))
}

function saldo(transactions) {
    let total = 0;
    if (transactions.length == 0) {
        return 0;
    }
    for (let transaction of transactions) {
        if (transaction.type == "1") {
            total = total + transaction.value;
        } else {
            total = total - transaction.value;
        }
    }
    return total;
}

//MOSTRAR VALOR USUÁRIO NA PÁGINA-ENTRADAS
function getCashIn() {
    const transaction = data.transactions;

    const cashIn = transaction.filter((item) => item.type === "1");

    if (cashIn.length) {
        let cashInHtml = ``;
        let limit = 0;

        if (cashIn.length > 5) {
            limit = 5;

        } else {
            limit = cashIn.length;
        }

        for (let index = 0; index < limit; index++) {
            cashInHtml += `
             <div class ="row mb-4">
                <div class="col-12">
                    <h3 class="fs-2">R$ ${cashIn[index].value.toFixed(2)}</h3>
                <div class="container p-0 ">
                 <div class="row">
                    <div class="col-12 col-md-8">
                    <p> ${cashIn[index].description} </p>
                    </div>
                    <div class="col-12 col-md-3 justify-content-end">
                    ${cashIn[index].date} 
                    </div>
                </div>
             </div>
             </div>
            </div>  
              `
        }

        document.getElementById("cash-in-list").innerHTML = cashInHtml;

    }
}

//MOSTRAR VALOR USUÁRIO NA PÁGINA- SAIDAS
function getCashOut() {
    const transaction = data.transactions;

    const cashIn = transaction.filter((item) => item.type === "2");

    if (cashIn.length) {
        let cashInHtml = ``;
        let limit = 0;

        if (cashIn.length > 5) {
            limit = 5;

        } else {
            limit = cashIn.length;
        }

        for (let index = 0; index < limit; index++) {
            cashInHtml += `
             <div class ="row mb-4">
                <div class="col-12">
                    <h3 class="fs-2">R$ ${cashIn[index].value.toFixed(2)}</h3>
                <div class="container p-0 ">
                 <div class="row">
                    <div class="col-12 col-md-8">
                    <p> ${cashIn[index].description} </p>
                    </div>
                    <div class="col-12 col-md-3 justify-content-end">
                    ${cashIn[index].date} 
                    </div>
                </div>
             </div>
             </div>
            </div>  
              `
        }

        document.getElementById("cash-out-list").innerHTML = cashInHtml;

    }
}

function atualizarSaldo() {
    document.getElementById("saldo-total").innerHTML = 'R$ ' + saldo(data.transactions).toFixed(2).replace('.', ',');
}

