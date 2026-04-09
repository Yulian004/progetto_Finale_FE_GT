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

async function register(event){

    event.preventDefault();

    const username = document.getElementById("username").value;

    const email = document.getElementById("email").value;

    const password = document.getElementById("password").value;

    try{
    const response = await fetch(`${API_URL}/register`,{
        
        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            username,
            email,
            password
        })

    });

    if(!response.ok)
        throw new Error("Errore registrazione");

    alert("Registrazione completata");

    window.location.href = "../login/login.html";

    }
    catch(error)
    {
        alert("Registrazione fallita");

        console.error(error);
    }


}
