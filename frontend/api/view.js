// view.js
import BaseURL from "./route.js";

const selectors = {
    checkboxes: document.querySelectorAll('.filter-cb'),
    allCheckbox: document.querySelector('.filter-cb[data-filter="all"]'),
    searchInput: document.getElementById('searchInput'),
    tableBody: document.querySelector('#roomTable tbody'),
    footerInfo: document.querySelector('.table-footer-info'),

    modal: document.getElementById("createRoomModal"),
    modalTitle: document.getElementById("modalTitle"),
    openBtn: document.getElementById("openCreateRoomBtn"),
    closeBtn: document.querySelector(".close-btn"),
    submitBtn: document.getElementById("submitCreateRoomBtn"),
    isEditMode: document.getElementById("isEditMode"),
    logoutBtn: document.getElementById("logoutBtn"),

    inputs: {
        roomNum: document.getElementById("inpRoomNum"),
        group: document.getElementById("inpGroup"),
        price: document.getElementById("inpPrice"),
        deposit: document.getElementById("inpDeposit"),
        occupants: document.getElementById("inpOccupants"),
        checkinDate: document.getElementById("inpCheckinDate"),
        contractTerm: document.getElementById("inpContractTerm"),
        status: document.getElementById("inpStatus")
    }
};

//api

function getAuthHeaders() {
    const token = localStorage.getItem("token");
    if (!token) return console.warn("⚠️ Chưa có Token");
    return {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
    };
}

const getRoomsService = async (searchText = '') => {
    try {
        let url = `${BaseURL}/getRoom?limit=10`
        if (searchText) {
            url += `&search = ${encodeURIComponent(searchText)}`
        }
        const response = await fetch(url,
            {
                method: 'GET',
                headers: getAuthHeaders()
            }
        )
        const data = await response.json();
        if (response.status === 401 || response.status === 403) {
            alert('Hết phiên đăng nhập.Hãy đăng nhập lại')
            window.location.href = 'login.html'
            return null
        }
        if (!response.ok) {
            throw new Error(data.message || 'Lỗi tải dữ liệu')
        }
        return data
    } catch (error) {
        console.error('Error : ', error)
        return { error: true, message: error.message }
    }
}

const createRoomService = async (payload) => {
    try {

        const response = await fetch(`${BaseURL}/createRoom`,
            {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(payload)
            }
        )
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Lỗi tạo dữ liệu')
        }
        return { success: true, data }

    } catch (error) {
        console.error('Error : ', error)
        return { error: true, message: error.message }
    }
}

const updateRoomService = async (roomNum, payload) => {
    try {
        const response = await fetch(`${BaseURL}/updateRoom/${encodeURIComponent(roomNum)}`,
            {
                method: 'PATCH',
                headers: getAuthHeaders(),
                body: JSON.stringify(payload)
            }
        )
        const data = await response.json()
        if (!response.ok) {
            throw new Error(data.message || 'Lỗi cập nhật dữ liệu')
        }
        return { success: true, data : data }
    } catch (error) {
        console.error('Error : ', error)
        return { success: false, message: error.message }
    }
}

const deleteService = async (roomNum) => {
    try {
        const response = await fetch(`${BaseURL}/deleteRoom/${encodeURIComponent(roomNum)}`, 
            {
                method : 'DELETE',
                headers : getAuthHeaders()
            }
        )

        const data = await response.json()

        if(!response.ok) {
            throw new Error(data.message || 'Lỗi xóa phòng')
        }
        return {success : true, message : 'Đã xóa phòng'}

    } catch(error){
        console.error('Error : ', error)
        return {success : false, message : error.message}
    }
}

const logoutService = async () => {
    try {
        const headers = getAuthHeaders()

        if(!headers.Authorization){
            localStorage.removeItem('token')
            return {success : true, message : 'Không tìm thấy token. Đã chuyển hướng'}
        }

        const response = await fetch(`${BaseURL}/logout`, {
            method: 'POST',
            headers: headers
        })

        localStorage.removeItem('token')
        const data = await response.json()

        if (!response.ok || response.status !== 401) {
            throw new Error(data.message || 'Lỗi đăng xuất')
        }
        return { success: true, message: data.message || 'Đăng xuất thành công' }

    } catch (error) {
        console.error('Error : ', error)
        localStorage.removeItem('token')
        return { success: false, message: error.message || 'Lỗi server' }
    }
}

window.handleDelete = async (roomNum) => {
    if(confirm(`Ban có chắc chắn muốn xóa phòng ${roomNum} không ?`)){
        const res = await deleteService(roomNum)
        if(res.success){
            alert(`Đã xóa thành công ${roomNum}`)
            initApp()
        }
    }else {
        alert('Có lỗi xảy ra khi xóa phòng : ' + res.message)
    }
}

async function handleLogout() {
    const res = await logoutService()
    alert(res.data || 'Đã đăng xuất')
    window.location.href = 'login.html'
}

function renderTable(data) {
    selectors.tableBody.innerHTML = '';

    if (!data || (data.error)) {
        selectors.tableBody.innerHTML = `<tr><td colspan="10" style="text-align:center; color:#ff7675; padding: 20px;">${data ? data.message : 'Lỗi kết nối đến máy chủ'}</td></tr>`;
        return;
    }

    const rooms = data.rooms || [];
    const pagination = data.pagination;

    if (rooms.length === 0) {
        selectors.tableBody.innerHTML = `<tr><td colspan="10" style="text-align:center; color:#aaa; padding: 20px;">Không tìm thấy phòng nào.</td></tr>`;
        return;
    }

    rooms.forEach((room, index) => {
        const roomName = room.roomNum || `Phòng ${index + 1}`;
        const contractDate = room.checkinDate || 'Chưa có';

        let paymentStatusHtml = '<span class="badge badge-paid">Đã thanh toán</span>';
        let rowTags = 'paid';

        const billTextForLogic = room.createBill || '';
        if (billTextForLogic.toLowerCase().includes('nợ') || billTextForLogic.toLowerCase().includes('chưa')) {
            paymentStatusHtml = '<span class="badge badge-unpaid">CHƯA THANH TOÁN</span>';
            rowTags = 'debt';
        }

        if (room.status && room.status.toLowerCase().includes('đang ở')) rowTags += ' occupied';
        else rowTags += ' empty';

        const tr = document.createElement('tr');
        tr.dataset.room = JSON.stringify(room);
        tr.setAttribute('data-status', rowTags);

tr.innerHTML = `
    <td><input type="checkbox" style="accent-color: #00ffcc;"></td>
    <td>
        <div class="room-name">
            <div class="room-icon"><i class="fas fa-home"></i></div>
            ${roomName}
        </div>
    </td>
    <td>${room.group || 'Chưa phân nhóm'}</td>
    <td style="font-weight:bold;">${room.price}</td>
    <td>${room.deposit}</td>
    <td><i class="fas fa-user-friends" style="color:#aaa; margin-right:5px;"></i> ${room.occupants}</td>
    <td>${contractDate}</td> <td>${room.contractTerm}</td>
    <td>${paymentStatusHtml}</td> 
    
    <td class="action-cell">
        <button class="btn-action btn-edit" onclick="window.openEditModal(this.closest('tr'))" title="Sửa phòng">
            <i class="fas fa-edit"></i>
        </button>
        <button class="btn-action btn-delete" onclick="window.handleDelete('${room.roomNum}')" title="Xóa phòng">
            <i class="fas fa-trash-alt"></i>
        </button>
        <button class="btn-action btn-create-bill" onclick="window.handleBill('${roomName}')" title="Tạo Bill">
            <i class="fas fa-file-invoice"></i> Bill
        </button>
    </td>
`;
selectors.tableBody.appendChild(tr);
    });

    if (selectors.footerInfo && pagination) {
        selectors.footerInfo.innerText = `Hiển thị ${rooms.length} / ${pagination.totalRoom} phòng | Trang ${pagination.page}`;
    }
}

function openCreateModal() {
    selectors.isEditMode.value = "false";
    selectors.modalTitle.innerText = "THÊM PHÒNG MỚI";
    selectors.inputs.roomNum.disabled = false;
    toggleModal(true);
}

window.openEditModal = (trElement) => {
    const room = JSON.parse(trElement.dataset.room);
    selectors.isEditMode.value = "true";
    selectors.modalTitle.innerText = `SỬA PHÒNG: ${room.roomNum}`;

    selectors.inputs.roomNum.value = room.roomNum;
    selectors.inputs.roomNum.disabled = true;
    selectors.inputs.group.value = room.group;
    selectors.inputs.price.value = room.price;
    selectors.inputs.deposit.value = room.deposit;
    selectors.inputs.occupants.value = room.occupants;
    selectors.inputs.checkinDate.value = room.checkinDate;
    selectors.inputs.contractTerm.value = room.contractTerm;
    selectors.inputs.status.value = room.status;

    toggleModal(true);
}

async function handleSubmit() {
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

    const submitBtn = selectors.submitBtn;
    const originalText = submitBtn.innerText;
    submitBtn.innerText = "Đang xử lý...";
    submitBtn.disabled = true;

    let res;
    if (isEdit) {
        res = await updateRoomService(payload.roomNum, payload);
    } else {
        res = await createRoomService(payload);
    }

    submitBtn.innerText = originalText;
    submitBtn.disabled = false;

    if (res.success) {
        alert(isEdit ? "Cập nhật phòng thành công!" : "Thêm phòng mới thành công!");
        toggleModal(false);
        initApp();
    } else {
        alert("Có lỗi xảy ra: " + res.message);
    }
}

window.handleBill = (roomNum) => {
    console.log(`Tạo bill cho phòng: ${roomNum}`);
    alert(`Chức năng tạo bill cho ${roomNum} đang phát triển.`);
}

function setupFilters() {
    selectors.checkboxes.forEach(cb => {
        cb.addEventListener('change', function () {
            if (this.checked) selectors.checkboxes.forEach(c => { if (c !== this) c.checked = false; });
            else { if (selectors.allCheckbox) { selectors.allCheckbox.checked = true; selectors.allCheckbox.dispatchEvent(new Event('change')); } return; }

            const type = this.getAttribute('data-filter');
            document.querySelectorAll('#roomTable tbody tr').forEach(row => {
                const tags = row.getAttribute('data-status');
                row.style.display = (type === 'all' || (tags && tags.includes(type))) ? '' : 'none';
            });
        });
    });
}

let searchTimeout;
function setupSearch() {
    if (!selectors.searchInput) return;
    selectors.searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => { initApp(e.target.value); }, 400);
    });
}

function toggleModal(show) {
    selectors.modal.style.display = show ? "block" : "none";
    if (!show) {
        Object.values(selectors.inputs).forEach(i => { if (i.tagName !== 'SELECT') i.value = ''; });
        selectors.isEditMode.value = "false";
    }
}

async function initApp(search = '') {
    if (!localStorage.getItem("token")) {
        window.location.href = "login.html";
        return;
    }
    const data = await getRoomsService(search);
    renderTable(data);
}

document.addEventListener('DOMContentLoaded', () => {
    initApp();
    setupFilters();
    setupSearch();

    if (selectors.openBtn) selectors.openBtn.onclick = openCreateModal;
    if (selectors.closeBtn) selectors.closeBtn.onclick = () => toggleModal(false);
    if (selectors.submitBtn) selectors.submitBtn.onclick = handleSubmit;
    window.onclick = (e) => { if (e.target == selectors.modal) toggleModal(false); };
    if (selectors.logoutBtn) selectors.logoutBtn.onclick = handleLogout;

    selectors.tableBody.addEventListener('dblclick', (e) => {
        const tr = e.target.closest('tr');
        if (tr) window.openEditModal(tr);
    });
});