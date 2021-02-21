async function sub(){
    var resp = await fetch('/logs',
    {
        method:'post',
        mode:'cors',
        credentials: 'same-origin',
        headers: {"Content-type": "application/json; charset=UTF-8"},
    }
    ).then((resp)=>{return resp.json();} )
    .then((resp)=>{console.log(resp);})
   .catch((err)=>{console.log('fail',resp)})
}