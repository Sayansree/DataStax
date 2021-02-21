
const login=document.getElementById("login");
login.onclick = () => {
    const email=document.getElementById("email").value;
    const pass=document.getElementById("pass").value;
    const msg=document.getElementById("msg");
    msg.innerHTML= "loading...";
    fetch('/login',
    {
        method:'post',
        mode:'cors',
        credentials: 'same-origin',
        body : JSON.stringify({'email':email,'password':pass}),
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