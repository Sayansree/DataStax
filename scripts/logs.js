window.onload = ()=>{
    refresh();
    const commit=document.getElementById("commit");
    commit.onclick= async()=>{
            const msg=document.getElementById("msg");
            msg.innerHTML= "loading...";
            var resp = await fetch('/commit',
            {
                method:'post',
                mode:'cors',
                credentials: 'same-origin',
                headers: {"Content-type": "application/json; charset=UTF-8"},
            }
            ).then((resp)=>{return resp.text();} )
            .then((resp)=>{console.log(resp);
                msg.innerHTML= resp;
                refresh();
            })
           .catch(()=>{console.log('fail')})
        }

}
const refresh =async()=>{
    
    const name=document.getElementById("name");
    const email=document.getElementById("email");
    const list=document.getElementById("list");
    var resp = await fetch('/logs',
    {
        method:'post',
        mode:'cors',
        credentials: 'same-origin',
        headers: {"Content-type": "application/json; charset=UTF-8"},
    }
    ).then((resp)=>resp.json())
    .then((resp)=>{
        if(resp.pass){
        let data = resp.data;
        name.innerHTML="name: " +data.name;
        email.innerHTML="email: " +data.email;
        delete data.name;
        delete data.email;
        s="<ul>";
        for (var key of Object.keys(data))
        {
            val=data[key];
            s+=`<li>${key} : ${(val==null)?0:val}</li>`;
        }
        s+="</ul>";
        list.innerHTML=s;
    }
    
    })
   .catch(()=>{console.log('fail')})
}