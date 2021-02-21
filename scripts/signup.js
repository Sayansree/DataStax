async function sub(){
    const email=document.getElementById("email").value;
    const pass=document.getElementById("pass").value;
    const uname=document.getElementById("uname").value;
    const msg=document.getElementById("msg");
    msg.innerHTML= "loading...";
    var resp = await fetch('/signup',
    {
        method:'post',
        mode:'cors',
        credentials: 'same-origin',
        body : JSON.stringify({'username':uname,'email':email,'password':pass}),
        headers: {"Content-type": "application/json; charset=UTF-8"},
    }
    ).then((resp)=>{return resp.text();} )
    .then((resp)=>{console.log(resp);
        msg.innerHTML= resp;})
   .catch((err)=>{console.log('fail',resp)})
}