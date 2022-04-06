const myModal = new bootstrap.Modal("#transaction-modal"); //CONFIGURARL MODAL//
let logged = sessionStorage.getItem("logged");
const session = localStorage.getItem("session");
let data = {
transactions:[]
};

document.getElementById("button-logout").addEventListener("click", logout);



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
        console.log(sal);
        if(sal < value){

            myModal.hide();
              alert("Atenção Saldo Negativo. :( ");
              salvarTransaction(value, type, description, date, e);

        }
    } else {
        salvarTransaction(value, type, description, date, e);
    }
    atualizarSaldo();
});

checkLogged();
function salvarTransaction(value, type, description, date, e) {
    data.transactions.unshift({
        value: value, type: type, description: description, date: date
    });
    saveData(data);
    e.target.reset();
    myModal.hide();
    getTransactions();
    alert("Lançamento adicionado com sucesso");
}

function checkLogged() {
    if(session) {
     sessionStorage.setItem("logged",session);
      logged = session;
       }

    if (!logged) {
        window.location.href="index.html";
        return;

       }
       const dataUser = localStorage.getItem(logged);
       if(dataUser){
           data=JSON.parse(dataUser);
       }

       getTransactions();
    }

    function logout (){
        sessionStorage.removeItem("logged");
        sessionStorage.removeItem("session");
        window.location.href="index.html";
     return;

    };

    function saldo(transactions){
        console.log(transactions)
        let total = 0;
        if(transactions.length == 0){
            return 0;
        }
        for (let transaction of transactions){
            if(transaction.type == "1"){
                total = total + transaction.value;
            } else {
                total = total - transaction.value;
            }
        }
        return total;
    }

    function getTransactions() {
        const transactions=data.transactions;
        let transactionsHtml=``;

        if (transactions.length){
            transactions.forEach((item)=>{
                let type="Entrada";

                if(item.type==="2"){
                    type="Saida";

                }

                transactionsHtml += `
            <tr>
               <th scope="row"> ${item.date} </th>
               <td>${item.value.toFixed(2)}</td>
               <td class=> ${type}</td>
               <td>${item.description}</td>
             </tr>
                `
            })
            document.getElementById("transactions-list").innerHTML=transactionsHtml;
        }
    }

    function saveData (data){
        localStorage.setItem(data.login, JSON.stringify(data))
    }

    function atualizarSaldo() {
        document.getElementById("saldo-total").innerHTML = 'R$ ' + saldo(data.transactions).toFixed(2).replace('.', ',');
    }




