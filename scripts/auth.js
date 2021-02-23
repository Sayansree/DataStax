window.onload =()=>{
    const signup=document.getElementById("form-signup");
    const login=document.getElementById("form-login");
    const btnsignup=document.getElementById("btn-signup");
    const btnlogin=document.getElementById("btn-login");
    const loginbtn=document.getElementById("login");
    signup.style.display="none";
    btnlogin.onclick = () => {
      login.style.display="block";
      signup.style.display="none";  
    }
    btnsignup.onclick = () => {
        login.style.display="none";
        signup.style.display="block";
    }
    
    loginbtn.onclick = async () => {
        const email=document.getElementById("login-email").value;
        const pass=document.getElementById("login-pass").value;
        const msg=document.getElementById("login-msg");
        msg.innerHTML= "loading...";
        fetch('/login',
        {
            method:'post',
            mode:'cors',
            credentials: 'same-origin',
            body : JSON.stringify({'email':email,'password':CryptoJS.SHA512(pass).toString()}),
            headers: {"Content-type": "application/json; charset=UTF-8"},
        }
        ).then((resp)=>{return resp.json();} )
        .then((resp)=>{console.log(resp);
                if(resp.pass){
                    msg.innerHTML = "login successful";
                    setTimeout(()=>window.open("/","_self"),2000);
                }else{
                    msg.innerHTML = (resp.email)?"incorrect password":"account not registered with the current email";
                }
            })
        .catch(()=>{console.log('connection error')})
    }
}