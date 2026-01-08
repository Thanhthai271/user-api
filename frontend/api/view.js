import BaseURL from "./route.js";

// ---  SELECTORS ---
const selectors = {
    // --- Navigation & Sections ---
    navItems: document.querySelectorAll('.nav-item'),
    statSection: document.querySelector('.stats-container'),
    dashboardSection: document.querySelector('.body-nav'),
    billSection: document.getElementById('billListSection'),
    imgSection: document.querySelector('.image-gallery-grid'),
    reportSection: document.getElementById('reportSection'),
    contractSection: document.getElementById('contractSection'),

    // --- Filter & Search ---
    checkboxes: document.querySelectorAll('.filter-cb'),
    searchInput: document.getElementById('searchInput'),

    // --- Room Table ---
    tableBody: document.querySelector('#roomTable tbody'),
    footerInfo: document.querySelector('.table-footer-info'),
    reportBody: document.querySelector('#revenueReportTable'),
    imgBody: document.querySelectorAll('.gallery-item'),
    statBody: document.querySelectorAll('.stat-card'),

    // --- Bill Table ---
    billTableBody: document.getElementById('billTableBody'),

    // --- Modal Create/Edit Room ---
    modal: document.getElementById("createRoomModal"),
    modalTitle: document.getElementById("modalTitle"),
    openBtn: document.getElementById("openCreateRoomBtn"),
    closeBtn: document.querySelector(".close-btn"),
    submitBtn: document.getElementById("submitCreateRoomBtn"),
    isEditMode: document.getElementById("isEditMode"),

    // --- Modal Create Bill ---
    billModal: document.getElementById("createBillModal"),
    closeBillModal: document.querySelector(".close-bill-btn"),
    submitBillBtn: document.getElementById("submitCreateBillBtn"),
    billRoomNumInput: document.getElementById("billRoomNum"),
    displayRoomNumSpan: document.getElementById("displayRoomNum"),

    // --- User Actions ---
    logoutBtn: document.getElementById("logoutBtn"),

    // --- Inputs Room ---
    inputs: {
        roomNum: document.getElementById("inpRoomNum"),
        group: document.getElementById("inpGroup"),
        price: document.getElementById("inpPrice"),
        deposit: document.getElementById("inpDeposit"),
        occupants: document.getElementById("inpOccupants"),
        checkinDate: document.getElementById("inpCheckinDate"),
        contractTerm: document.getElementById("inpContractTerm"),
        status: document.getElementById("inpStatus")
    },

    // --- Inputs Bill ---
    billInputs: {
        oldElectric: document.getElementById("inpOldElectric"),
        newElectric: document.getElementById("inpNewElectric"),
        electricUnit: document.getElementById("inpElectricUnit"),
        waterPrice: document.getElementById("inpWaterPrice"),
        wifiPrice: document.getElementById("inpWifiPrice")
    }
};

// --- HELPER FUNCTIONS ---
const formatVND = (num) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);

const extractRoomNumber = (name) => {
    if (!name) return 0;
    const match = name.match(/\d+/);
    return match ? parseInt(match[0], 10) : 0;
};

// Hàm logic lọc dữ liệu từ checkbox
const filterRoomsLogic = (rooms) => {
    const activeCheckboxes = Array.from(selectors.checkboxes)
        .filter(cb => cb.checked)
        .map(cb => cb.value);

    if (activeCheckboxes.includes('all') || activeCheckboxes.length === 0) return rooms;

    return rooms.filter(room => {
        const isOccupied = room.status && room.status.toLowerCase().includes('đang ở');

        if (activeCheckboxes.includes('occupied') && isOccupied) return true;
        if (activeCheckboxes.includes('empty') && !isOccupied) return true;
        return false;
    });
};

// --- API SERVICES ---

function getAuthHeaders() {
    const token = localStorage.getItem("token");
    return {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
    };
}

const createRoomService = async (payload) => {
    const response = await fetch(`${BaseURL}/createRoom`, { method: 'POST', headers: getAuthHeaders(), body: JSON.stringify(payload) });
    return await response.json();
};

const getRoomsService = async (searchText = '') => {
    try {
        let url = `${BaseURL}/getRoom?limit=100${searchText ? `&search=${encodeURIComponent(searchText)}` : ''}`;
        const response = await fetch(url, { method: 'GET', headers: getAuthHeaders() });
        if (response.status === 401 || response.status === 403) return handleLogout();
        return await response.json();
    } catch (error) {
        console.error('Error:', error);
        return { error: true, message: error.message };
    }
};

const updateRoomService = async (roomNum, payload) => {
    const response = await fetch(`${BaseURL}/updateRoom/${encodeURIComponent(roomNum)}`, { method: 'PATCH', headers: getAuthHeaders(), body: JSON.stringify(payload) });
    return await response.json();
};

const deleteRoomService = async (roomNum) => {
    const response = await fetch(`${BaseURL}/deleteRoom/${encodeURIComponent(roomNum)}`, { method: 'DELETE', headers: getAuthHeaders() });
    return await response.json();
};

const createBillService = async (payload) => {
    try {
        const response = await fetch(`${BaseURL}/createBill`, { method: 'POST', headers: getAuthHeaders(), body: JSON.stringify(payload) });
        return await response.json();
    } catch (error) { return { message: error.message }; }
};

const getAllBillsService = async () => {
    try {
        const response = await fetch(`${BaseURL}/getAllBills`, { method: 'GET', headers: getAuthHeaders() });
        if (!response.ok) throw new Error(`Server Error: ${response.status}`);
        return await response.json();
    } catch (error) { return { success: false, message: error.message }; }
};

const payBillService = async (billId) => {
    try {
        const res = await fetch(`${BaseURL}/payBill/${encodeURIComponent(billId)}`, { method: "PATCH", headers: getAuthHeaders() });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Lỗi Thanh Toán');
        return data;
    } catch (error) { return { message: error.message }; }
};

const deleteBillService = async (billId) => {
    try {
        const res = await fetch(`${BaseURL}/deleteBill/${encodeURIComponent(billId)}`, { method: 'DELETE', headers: getAuthHeaders() });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Lỗi xóa bill');
        return data;
    } catch (error) { return { message: error.message }; }
};

//--- HANDLE ---

window.switchTab = (tabName) => {
    selectors.navItems.forEach(item => item.classList.remove('active'));
    selectors.statBody.forEach(item => item.classList.remove('active'))

    if (tabName === 'bills') {
        selectors.billSection.style.display = 'block'
        selectors.dashboardSection.style.display = 'none'
        selectors.imgSection.style.display = 'none'
        selectors.reportSection.style.display = 'none'
        if (selectors.navItems[2]) selectors.navItems[2].classList.add('active');
        selectors.contractSection.style.display = 'none'
        initBillList();

    } else if (tabName == 'home') {
        selectors.imgSection.style.display = 'grid'
        selectors.statSection.style.display = 'flex'
        selectors.dashboardSection.style.display = 'none'
        selectors.billSection.style.display = 'none'
        selectors.reportSection.style.display = 'none'
        selectors.contractSection.style.display = 'none'
        if (selectors.navItems[0]) selectors.navItems[0].classList.add('active');

    } else if (tabName === 'report') {
        selectors.reportSection.style.display = 'block'
        selectors.dashboardSection.style.display = 'none'
        selectors.imgSection.style.display = 'none'
        selectors.billSection.style.display = 'none'
        selectors.contractSection.style.display = 'none'
        if (selectors.navItems[3]) selectors.navItems[3].classList.add('active')
        initReportList()


    } else if (tabName === 'contract') {
        selectors.contractSection.style.display = 'block'
        selectors.reportSection.style.display = 'none'
        selectors.dashboardSection.style.display = 'none'
        selectors.imgSection.style.display = 'none'
        selectors.billSection.style.display = 'none'
        selectors.statSection.style.display = 'flex'
        if (selectors.statBody[0]) selectors.statBody[0].classList.add('active')
    } else if (tabName === 'deposit') {
        selectors.contractSection.style.display = 'none'
        selectors.reportSection.style.display = 'none'
        selectors.dashboardSection.style.display = 'none'
        selectors.imgSection.style.display = 'none'
        selectors.billSection.style.display = 'none'
        selectors.statSection.style.display = 'flex'
        if (selectors.statBody[1]) selectors.statBody[1].classList.add('active')
    } else if (tabName === 'contact') {
        selectors.contractSection.style.display = 'none'
        selectors.reportSection.style.display = 'none'
        selectors.dashboardSection.style.display = 'none'
        selectors.imgSection.style.display = 'none'
        selectors.billSection.style.display = 'none'
        selectors.statSection.style.display = 'flex'
        if (selectors.statBody[2]) selectors.statBody[2].classList.add('active')
    } else if (tabName === 'problem') {
        selectors.contractSection.style.display = 'none'
        selectors.reportSection.style.display = 'none'
        selectors.dashboardSection.style.display = 'none'
        selectors.imgSection.style.display = 'none'
        selectors.billSection.style.display = 'none'
        selectors.statSection.style.display = 'flex'
        if(selectors.statBody[3]) selectors.statBody[3].classList.add('active')
    }

    else {
        selectors.dashboardSection.style.display = 'block'
        selectors.imgSection.style.display = 'none'
        selectors.billSection.style.display = 'none'
        selectors.reportSection.style.display = 'none'
        selectors.contractSection.style.display = 'none'
        if (selectors.navItems[1]) selectors.navItems[1].classList.add('active');
        initApp();
    }
};

window.handleOpenContractTab = (evt, tabName) => {
    let i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tab-content");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].classList.remove("active");
    }
    tablinks = document.getElementsByClassName("tab-btn");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].classList.remove("active");
    }
    document.getElementById(tabName).classList.add("active");
    evt.currentTarget.classList.add("active");
};

window.handleOpenCreateBill = (roomNum) => {
    selectors.billRoomNumInput.value = roomNum;
    if (selectors.displayRoomNumSpan) selectors.displayRoomNumSpan.innerText = roomNum;
    selectors.billInputs.oldElectric.value = '';
    selectors.billInputs.newElectric.value = '';
    selectors.billInputs.waterPrice.value = '';
    selectors.billInputs.wifiPrice.value = '';
    if (!selectors.billInputs.electricUnit.value) selectors.billInputs.electricUnit.value = 3500;
    selectors.billModal.style.display = "block";
};

window.handlePayBill = async (billId) => {
    if (confirm("Xác nhận khách đã thanh toán hóa đơn này?")) {
        const res = await payBillService(billId);
        if (res.success) {
            alert("Thanh toán thành công!");
            initBillList();
        } else alert("Lỗi: " + res.message);
    }
};

window.handleDeleteBill = async (billId) => {
    if (confirm('Bạn có chắc chắn muốn xóa bill này ?')) {
        const res = await deleteBillService(billId);
        if (res.success) {
            alert("Đã xóa thành công!");
            initBillList();
        } else alert('Lỗi : ' + res.message);
    }
};

window.onclick = (e) => {
    if (e.target == selectors.modal) toggleModal(false);
    if (e.target == selectors.billModal) selectors.billModal.style.display = "none";
};

window.handleDelete = async (roomNum) => {
    if (confirm(`Bạn có chắc muốn xóa phòng ${roomNum}?`)) {
        const res = await deleteRoomService(roomNum);
        if (res.message?.includes('success') || res.success) {
            alert("Xóa thành công!");
            initApp();
        } else alert("Lỗi: " + res.message);
    }
};

window.openEditModal = (trElement) => {
    const room = JSON.parse(trElement.dataset.room);
    selectors.isEditMode.value = "true";
    selectors.modalTitle.innerText = `SỬA PHÒNG: ${room.roomNum}`;
    selectors.inputs.roomNum.value = room.roomNum;
    selectors.inputs.roomNum.disabled = true;
    selectors.inputs.group.value = room.group || "";
    selectors.inputs.price.value = room.price || "";
    selectors.inputs.deposit.value = room.deposit || "";
    selectors.inputs.occupants.value = room.occupants || "";
    selectors.inputs.checkinDate.value = room.checkinDate || "";
    selectors.inputs.contractTerm.value = room.contractTerm || "";
    selectors.inputs.status.value = room.status || "Trống";
    toggleModal(true);
};

// --- RENDER TABLES ---

function renderRoomTable(data) {
    selectors.tableBody.innerHTML = '';
    if (!data || data.error) {
        selectors.tableBody.innerHTML = `<tr><td colspan="10" style="text-align:center; color:#ff7675;">${data?.message || 'Lỗi kết nối server'}</td></tr>`;
        return;
    }

    const rooms = data.rooms || [];
    rooms.forEach((room) => {
        const roomName = room.roomNum;
        const isOccupied = room.status && room.status.toLowerCase().includes('đang ở');
        const hasBill = room.createBill === "YES";

        let actionBtn = '';
        let statusText = '';

        if (isOccupied) {
            if (hasBill) {
                statusText = '<span class="badge badge-unpaid">CHỜ THANH TOÁN</span>';
                actionBtn = `<button class="btn-create-bill" style="background:#f1c40f; color:#000;" onclick="window.switchTab('bills')">XEM BILL</button>`;
            } else {
                statusText = '<span class="badge" style="background:#3498db">CHƯA TẠO BILL</span>';
                actionBtn = `<button class="btn-create-bill" onclick="window.handleOpenCreateBill('${roomName}')">TẠO BILL</button>`;
            }
        } else {
            statusText = '<span class="badge" style="background:#95a5a6">TRỐNG</span>';
            actionBtn = `<button class="btn-create-bill" disabled style="opacity:0.3; cursor:not-allowed; background:#555;">TRỐNG</button>`;
        }

        const tr = document.createElement('tr');
        tr.dataset.room = JSON.stringify(room);
        tr.innerHTML = `
            <td><input type="checkbox"></td>
            <td>
                <div class="room-name">
                    <div class="room-icon"><i class="fas fa-home"></i></div>
                    ${roomName}
                </div>
            </td>
            <td>${room.group || '-'}</td>
            <td style="font-weight:bold;">${room.price}</td>
            <td>${room.deposit}</td>
            <td><i class="fas fa-user-friends"></i> ${room.occupants}</td>
            <td>${room.checkinDate || '-'}</td>
            <td>${room.contractTerm || '-'}</td>
            <td>${statusText}</td> 
            <td class="action-cell">
                <button class="btn-action" onclick="window.openEditModal(this.closest('tr'))"><i class="fas fa-edit"></i></button>
                <button class="btn-action" onclick="window.handleDelete('${roomName}')"><i class="fas fa-trash-alt"></i></button>
                ${actionBtn}
            </td>
        `;
        selectors.tableBody.appendChild(tr);
    });
}

function renderBillTable(bills) {
    selectors.billTableBody.innerHTML = '';
    if (!bills || bills.length === 0) {
        selectors.billTableBody.innerHTML = `<tr><td colspan="9" style="text-align:center;">Chưa có hóa đơn nào</td></tr>`;
        return;
    }

    bills.forEach(bill => {
        const isPaid = bill.status === 'DA_THANH_TOAN';
        const statusHtml = isPaid
            ? `<span style="color:#2ecc71; font-weight:bold;">Đã Thanh Toán</span>`
            : `<span style="color:#e74c3c; font-weight:bold;">Chưa Thanh Toán</span>`;

        const actionHtml = isPaid
            ? `<button disabled style="opacity:0.5">Hoàn tất</button>`
            : `<button class="btn-create-bill" onclick="window.handlePayBill('${bill._id}')">Thanh toán</button>`;

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>
                <div class="room-name">
                    <div class="room-icon"><i class="fas fa-home"></i></div>
                    ${bill.roomNum}
                </div>
            </td>
            <td><strong>${bill.elecPrice}</strong></td>
            <td><strong>${bill.waterPrice}</strong></td>
            <td><strong>${bill.wifiPrice}</strong></td>
            <td style="color:#00ffcc; font-weight:bold;">${formatVND(bill.totalPrice)}</td>
            <td>${formatVND(bill.deposit)}</td>
            <td>${new Date(bill.createdAt).toLocaleDateString('vi-VN')}</td>
            <td>${statusHtml}</td>
            <td>
                ${actionHtml}
                <button class="btn-action" onclick="window.handleDeleteBill('${bill._id}')"><i class="fas fa-trash-alt"></i></button>
            </td>
        `;
        selectors.billTableBody.appendChild(tr);
    });
}

function renderReportTable(bills) {
    // Kiểm tra selector và làm sạch bảng
    if (!selectors.reportBody) return;
    selectors.reportBody.innerHTML = '';

    // Lọc hóa đơn đã thanh toán
    const paidBills = bills.filter(b => b.status === 'DA_THANH_TOAN');

    if (!paidBills || paidBills.length === 0) {
        selectors.reportBody.innerHTML = `<tr><td colspan="5" style="text-align:center;">Chưa có dữ liệu thanh toán để báo cáo</td></tr>`;
        return;
    }

    const monthlyData = {};
    let grandTotalRent = 0; // Đổi từ const sang let
    let grandTotalService = 0; // Đổi từ const sang let

    // Gom nhóm dữ liệu
    paidBills.forEach(bill => {
        const date = new Date(bill.createdAt);
        const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`; // Thêm () vào getFullYear

        if (!monthlyData[monthYear]) {
            monthlyData[monthYear] = { rent: 0, service: 0, total: 0 };
        }

        // Ép kiểu Number để tránh lỗi cộng chuỗi
        const total = Number(bill.totalPrice) || 0;
        const serviceFee = (Number(bill.elecPrice) || 0) + (Number(bill.waterPrice) || 0) + (Number(bill.wifiPrice) || 0);
        const rentFee = total - serviceFee;

        monthlyData[monthYear].rent += rentFee;
        monthlyData[monthYear].service += serviceFee;
        monthlyData[monthYear].total += total;

        grandTotalRent += rentFee;
        grandTotalService += serviceFee;
    });

    // Vẽ các dòng dữ liệu
    let htmlContent = '';
    Object.keys(monthlyData).forEach(month => {
        const data = monthlyData[month];
        htmlContent += `
        <tr>
            <th>Tháng ${month}</th>
            <th>${data.rent.toLocaleString()} đ</th>
            <th>${data.service.toLocaleString()} đ</th>
            <th><strong style="color: #00ffcc;">${data.total.toLocaleString()} đ</strong></th>
            <th><span class="badge" style="background: #2ecc71;">Hoàn tất</span></th>
        </tr>`;
    });
    selectors.reportBody.innerHTML = htmlContent;

    // Cập nhật dòng tổng cộng (Đảm bảo các ID này tồn tại trong HTML Footer)
    const elTotalRent = document.getElementById('totalRent');
    const elTotalService = document.getElementById('totalService');
    const elTotalRevenue = document.getElementById('totalRevenue');

    if (elTotalRent) elTotalRent.innerText = grandTotalRent.toLocaleString() + " đ";
    if (elTotalService) elTotalService.innerText = grandTotalService.toLocaleString() + " đ";
    if (elTotalRevenue) elTotalRevenue.innerText = (grandTotalRent + grandTotalService).toLocaleString() + " đ";
}

// --- XỬ LÝ SUBMIT ---

if (selectors.submitBillBtn) {
    selectors.submitBillBtn.onclick = async () => {
        const payload = {
            roomNum: selectors.billRoomNumInput.value,
            oldElectric: Number(selectors.billInputs.oldElectric.value),
            newElectric: Number(selectors.billInputs.newElectric.value),
            electricUnit: Number(selectors.billInputs.electricUnit.value),
            waterPrice: Number(selectors.billInputs.waterPrice.value),
            wifiPrice: Number(selectors.billInputs.wifiPrice.value)
        };

        if (payload.newElectric < payload.oldElectric) return alert("Số điện mới phải lớn hơn số điện cũ!");

        selectors.submitBillBtn.innerText = 'Đang xử lý...';
        selectors.submitBillBtn.disabled = true;

        const res = await createBillService(payload);
        selectors.submitBillBtn.innerText = 'XÁC NHẬN & KHẤU TRỪ CỌC';
        selectors.submitBillBtn.disabled = false;

        if (res.success || res.message?.includes('thành công')) {
            alert("Tạo hóa đơn thành công!");
            selectors.billModal.style.display = "none";
            initApp();
        } else alert("Lỗi: " + res.message);
    }
}

async function handleSubmitRoom() {
    const isEdit = selectors.isEditMode.value === "true";
    const payload = {
        roomNum: selectors.inputs.roomNum.value,
        group: selectors.inputs.group.value,
        price: selectors.inputs.price.value,
        deposit: selectors.inputs.deposit.value,
        occupants: selectors.inputs.occupants.value,
        checkinDate: selectors.inputs.checkinDate.value,
        contractTerm: selectors.inputs.contractTerm.value,
        status: selectors.inputs.status.value
    };

    if (!payload.roomNum) return alert("Vui lòng nhập tên phòng!");
    selectors.submitBtn.disabled = true;
    const res = isEdit ? await updateRoomService(payload.roomNum, payload) : await createRoomService(payload);
    selectors.submitBtn.disabled = false;

    if (res.message?.includes('success') || res.room) {
        alert(isEdit ? "Cập nhật thành công!" : "Thêm phòng thành công!");
        toggleModal(false);
        initApp();
    } else alert("Lỗi: " + res.message);
}

// --- INIT APP ---

async function initApp(search = '') {
    if (!localStorage.getItem("token")) return window.location.href = "login.html";

    const data = await getRoomsService(search);
    if (data && data.rooms) {
        // Sắp xếp
        data.rooms.sort((a, b) => extractRoomNumber(a.roomNum) - extractRoomNumber(b.roomNum));

        // Lọc
        const filteredRooms = filterRoomsLogic(data.rooms);

        // Render
        renderRoomTable({ ...data, rooms: filteredRooms });
    }
}

async function initBillList() {
    const res = await getAllBillsService();
    if (res.success) renderBillTable(res.data);
    else alert("Không thể tải danh sách hóa đơn");
}

async function initReportList() {
    const res = await getAllBillsService();
    if (res.success) renderReportTable(res.data)
    else alert('Không thể tải danh sách báo cáo')
}

function handleLogout() {
    localStorage.removeItem('token');
    window.location.href = 'login.html';
}

function toggleModal(show) {
    selectors.modal.style.display = show ? "block" : "none";
    if (!show) {
        Object.values(selectors.inputs).forEach(i => { if (i.tagName !== 'SELECT') i.value = ''; });
        selectors.isEditMode.value = "false";
    }
}

// --- DOM ---

document.addEventListener('DOMContentLoaded', () => {
    initApp();

    selectors.checkboxes.forEach(cb => {
        cb.onchange = () => {
            if (cb.value === 'all' && cb.checked) {
                selectors.checkboxes.forEach(other => { if (other !== cb) other.checked = false; });
            } else if (cb.checked) {
                const allCb = Array.from(selectors.checkboxes).find(c => c.value === 'all');
                if (allCb) allCb.checked = false;
            }
            initApp(selectors.searchInput.value);
        };
    });

    if (selectors.navItems.length > 0) {
        selectors.navItems[0].onclick = () => window.switchTab('home')
        selectors.navItems[1].onclick = () => window.switchTab('rooms');
        selectors.navItems[2].onclick = () => window.switchTab('bills');
        selectors.navItems[3].onclick = () => window.switchTab('report')
    }


    if (selectors.imgBody.length > 0) {
        selectors.imgBody[0].onclick = () => selectors.imgBody[0].style.display = 'none'
        selectors.imgBody[1].onclick = () => selectors.imgBody[1].style.display = 'none'
        selectors.imgBody[2].onclick = () => selectors.imgBody[2].style.display = 'none'
    }

    if (selectors.statBody.length > 0) {
        selectors.statBody[0].onclick = () => window.switchTab('contract')
        selectors.statBody[1].onclick = () => window.switchTab('deposit')
        selectors.statBody[2].onclick = () => window.switchTab('contact')
        selectors.statBody[3].onclick = () => window.switchTab('problem')
    }

    let timeout;
    selectors.searchInput.oninput = (e) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => initApp(e.target.value), 500);
    };

    if (selectors.openBtn) selectors.openBtn.onclick = () => {
        selectors.inputs.roomNum.disabled = false;
        selectors.modalTitle.innerText = "THÊM PHÒNG MỚI";
        toggleModal(true);
    };
    if (selectors.closeBtn) selectors.closeBtn.onclick = () => toggleModal(false);
    if (selectors.submitBtn) selectors.submitBtn.onclick = handleSubmitRoom;
    if (selectors.closeBillModal) selectors.closeBillModal.onclick = () => selectors.billModal.style.display = "none";
    if (selectors.logoutBtn) selectors.logoutBtn.onclick = handleLogout;


});