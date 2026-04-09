function saveUser(user){

    localStorage.setItem(
        "user",
        JSON.stringify(user));
}

function getUser()
{
    const user = localStorage.getItem("user")

    return user ? JSON.parse(user): null;
}

function logout()
{
    localStorage.removeItem("user")

    window.location.href = "../login/login.html";
}

function checkAuth()
{
    const user = getUser();

    if(!user)
        window.location.href = "../login/login.html"
}
