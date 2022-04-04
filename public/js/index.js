const myModal = new bootstrap.Modal("#register-modal"); //CONFIGURARL MODAL//
let logged = sessionStorage.getItem("logged");
const session = localStorage.getItem("session");

checkLogged();

//LOGIN SISTEMA
document.getElementById("login-form").addEventListener("submit",function(e){
    e.preventDefault();

    const email= document.getElementById("email-input").value;
    const password= document.getElementById ("password-input").value;
    const Checksession= document.getElementById("session-input").checked;

    const account= getAccount(email);

    if (!account){
        alert("verificar usuario ou a senha");
        return;
    }

    if(account){
        if(account.password !== password){
            alert("Verifique usuario ou a senha");
            return;
        }
       saveSession (email,Checksession);

        window.location.href="home.html";
    }

});

//CRIAR CONTA
document.getElementById("create-form").addEventListener("submit",function(e){
    e.preventDefault();

const email= document.getElementById ("email-create-input").value;
const password =document.getElementById ("password-create-input").value;

if(email.length < 5 ){
    alert("Preencha com um email válido");
    return;
}
if(password.length < 4 ){
    alert("Preencha com uma senha maior que 4 digitos");
    return;
}
saveAccount({
    login:email,
     password:password,
     transactions:[]

});

myModal.hide();
alert("Conta criada com sucesso!");

});

//FUNÇÕES//

 function saveAccount (data){
     localStorage.setItem (data.login , JSON.stringify(data));
 }
//SALVANDO A SESSÃO UTILIZANDO A CAIXA DE CHECK.
function saveSession(data,saveSession){    
    if(saveSession){
        localStorage.setItem("session",data);
    }     
    sessionStorage.setItem("logged",data);
}

 function getAccount (key){
   const account= localStorage.getItem (key);

   if(account){
       return JSON.parse(account);
   }
   return "";
}

function checkLogged() {
if(session) {
 sessionStorage.setItem("logged",session);
  logged=session;
   }

if (logged){
    saveSession(logged,session);

    window.location.href="home.html";
   }
}


