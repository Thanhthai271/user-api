import BaseURL from './route.js'
async function register() {
    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const phone = document.getElementById("phone").value;
    const address = document.getElementById("address").value;
    const room = document.getElementById("room").value;

    try {
        const res = await fetch(`${BaseURL}/create`, {
            method: "POST",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify({ username, email, password, phone, address, room }),
        })

        const data = await res.json()

        if (!res.ok) {
            console.log(data)
            return alert("Lỗi đăng ký")
        }

        console.log(data)
        return alert("Đăng ký thành công")

        // window.location.href="login.html";

    } catch (err) {
        console.error(err);
        alert("Lỗi đăng nhập");
    }
}

document.getElementById("dangkyBtn").addEventListener("click", register)