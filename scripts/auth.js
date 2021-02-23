window.onload =()=>{
    const signup=document.getElementById("form-signup");
    const login=document.getElementById("form-login");
    const btnsignup=document.getElementById("btn-signup");
    const btnlogin=document.getElementById("btn-login");
    const loginbtn=document.getElementById("login");
    const signupbtn=document.getElementById("signup");
    const msglogin=document.getElementById("login-msg");
    const msgsignup=document.getElementById("sign-msg");
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
        msglogin.innerHTML= "loading...";
        msglogin.style.color = "blue";
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
                    msglogin.innerHTML = "login successful";
                    msglogin.style.color = "green";
                    setTimeout(()=>window.open("/","_self"),2000);
                }else{
                    msglogin.style.color = "red";
                    msglogin.innerHTML = (resp.email)?"incorrect password":"account not registered with the current email";
                }
            })
        .catch(()=>{console.log('connection error')})
    }
    
    signupbtn.onclick = async() => {
        const email=document.getElementById("sign-email").value;
        const pass=document.getElementById("sign-pass").value;
        const uname=document.getElementById("sign-uname").value;       
        msgsignup.innerHTML= "loading...";
        var resp = await fetch('/signup',
        {
            method:'post',
            mode:'cors',
            credentials: 'same-origin',
            body : JSON.stringify({'username':uname,'email':email,'password':CryptoJS.SHA512(pass).toString()}),
            headers: {"Content-type": "application/json; charset=UTF-8"},
        }
        ).then((resp)=>{return resp.text();} )
        .then((resp)=>{console.log(resp);
            msgsignup.innerHTML= resp;})
    .catch((err)=>{console.log('fail',resp)})
    }
}