const signup=document.getElementById("signup");
signup.onclick = async() => {
    const email=document.getElementById("sign-email").value;
    const pass=document.getElementById("sign-pass").value;
    const uname=document.getElementById("sign-uname").value;
    const msg=document.getElementById("sign-msg");
    msg.innerHTML= "loading...";
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
        msg.innerHTML= resp;})
   .catch((err)=>{console.log('fail',resp)})
}