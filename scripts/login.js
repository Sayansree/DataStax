async function sub(){
    const email=document.getElementById("email").value;
    const pass=document.getElementById("pass").value;
    const msg=document.getElementById("msg");
    msg.innerHTML= "loading...";
    var resp = await fetch('/login',
    {
        method:'post',
        mode:'cors',
        credentials: 'same-origin',
        body : JSON.stringify({'email':email,'password':pass}),
        headers: {"Content-type": "application/json; charset=UTF-8"},
    }
    ).then((resp)=>{return resp.json();} )
    .then((resp)=>{console.log(resp);
        msg.innerHTML= (!resp.pass)?((!resp.email)?"account not registered with the current email":"incorrect password"):"login successful";})
   .catch((err)=>{console.log('fail',resp)})
}