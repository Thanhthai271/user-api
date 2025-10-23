const BaseURL = "http://localhost:5000/api/users";

async function login() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try{
        const res = await fetch(`${BaseURL}/login`, {
            method: "POST", 
            headers:{"Content-Type": "application/json"},
            body:JSON.stringify({username, password}),
        });

        const data = await res.json();
        console.log(data)
        alert("Đăng nhập thành công")
    }catch(err){
        console.error(err);
        alert("Lỗi đăng nhập");
    }
}

document.getElementById("dangnhapBtn").addEventListener("click", login);