const btnPwd = document.querySelector("#btnPwd");
const pwdInput = document.querySelector("#account_password");

btnPwd.addEventListener("click", ()=>{
    const type = pwdInput.getAttribute("type");
    if (type == "password"){
        pwdInput.setAttribute("type", "text");
        btnPwd.innerText = "Hide Password";
    }
    else{
        pwdInput.setAttribute("type", "password");
        btnPwd.innerText = "Show Password";
    }
});