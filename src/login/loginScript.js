const show_pw_btn = document.querySelector('#show-password')
const show_pw_icon= show_pw_btn.querySelector('img')
const pw_input = document.querySelector('#password')

show_pw_btn.addEventListener('click', () => {

    const isPassword = pw_input.type === 'password'
    pw_input.type =  isPassword
    ? 'text'
     : 'password'

    show_pw_icon.src = show_pw_icon.src.includes('mostra') ? '../assets/nascondi.svg' : '../assets/mostra.svg'
})

const API_URL = "http://localhost:8080/api/users"

async function login(event){
    hiddenMessage()

    event.preventDefault();

    const email = document.getElementById("email").value;

    const password = document.getElementById("password").value;

    try{
    const response = await fetch(`${API_URL}/login`,{
        
        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            email,
            password
        })

    });
    
    const user = await response.json();
    if(!response.ok){
        showMessage("error", user.message || "Email o password errati");
        return;
    }

    saveUser(user);
    showMessage("succes", "Login effettuato!")
    window.location.href = "../dashboard/dashboard.html";

    }
    catch(error)
    {
        showMessage("error", "Errore di connessione al server");

        console.error(error);
    }


}

//---------------------------------------------------------------------------
//MOSTRA E NASCONDI MESSAGGI DI ERRORE
function hiddenMessage(){
    const box = document.getElementById("messageBox");
    box.classList.add("hidden");
    box.innerText = "";
}

function showMessage(type, text)
{
    const box = document.getElementById("messageBox");

    box.classList.add(type);
    box.innerText = text;

    box.style.display = "block";

}