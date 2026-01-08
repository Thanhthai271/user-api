import BaseURL from './route.js'
// const BaseURL = "/api/users";
async function login() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {
        const res = await fetch(`${BaseURL}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        });

        const data = await res.json();

        console.log("Dữ liệu từ server:", data);

        if (!res.ok) {
            console.log(data)
            alert("Sai username hoặc password")
            return;
        }

        const tokenValue = data.accessToken || data.token;

        if (tokenValue) {
            console.log("Token lấy được:", tokenValue);

            localStorage.setItem("token", tokenValue);

            alert("Đăng nhập thành công");
            window.location.href = "view.html";
        } else {
            console.error("Lỗi: Server trả về thành công nhưng không có accessToken", data);
            alert("Lỗi hệ thống: Không tìm thấy token đăng nhập.");
        }

    } catch (err) {
        console.log(err)
        console.error(err);
        alert("Lỗi đăng nhập");
    }
}

document.getElementById("dangnhapBtn").addEventListener("click", login);
