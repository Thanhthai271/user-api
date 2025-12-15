// view.js
/**
 * SCRIPT QUẢN LÝ NHÀ TRỌ - GIAO DIỆN MỚI
 */

import BaseURL from "./route.js";

// --- 1. CẤU HÌNH & SELECTORS ---
const selectors = {
    checkboxes: document.querySelectorAll('.filter-cb'),
    allCheckbox: document.querySelector('.filter-cb[data-filter="all"]'),
    searchInput: document.getElementById('searchInput'),
    tableBody: document.querySelector('#roomTable tbody'),
    footerInfo: document.querySelector('.table-footer-info'),
    
    // Modal Elements
    modal: document.getElementById("createRoomModal"),
    modalTitle: document.getElementById("modalTitle"),
    openBtn: document.getElementById("openCreateRoomBtn"),
    closeBtn: document.querySelector(".close-btn"),
    submitBtn: document.getElementById("submitCreateRoomBtn"),
    isEditMode: document.getElementById("isEditMode"),
    
    // Form Inputs
    inputs: {
        roomNum: document.getElementById("inpRoomNum"),
        group: document.getElementById("inpGroup"),
        price: document.getElementById("inpPrice"),
        deposit: document.getElementById("inpDeposit"),
        occupants: document.getElementById("inpOccupants"),
        checkinDate: document.getElementById("inpCheckinDate"), // Dùng cho Ngày lập HĐ
        contractTerm: document.getElementById("inpContractTerm"),
        status: document.getElementById("inpStatus") // Trạng thái phòng (Trống/Đang ở)
    }
};

// --- 2. CÁC HÀM GỌI API (GIỮ NGUYÊN) ---

function getAuthHeaders() {
    const token = localStorage.getItem("token");
    if (!token) console.warn("⚠️ Chưa có Token");
    return {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
    };
}

async function getRoomsService(searchText = '') {
    try {
        let url = `${BaseURL}/getRoom?limit=100`; 
        if (searchText) url += `&search=${encodeURIComponent(searchText)}`;
        const response = await fetch(url, { method: 'GET', headers: getAuthHeaders() });
        const data = await response.json();
        if (response.status === 401 || response.status === 403) {
            alert("Hết phiên đăng nhập. Vui lòng đăng nhập lại.");
            window.location.href = "login.html";
            return null;
        }
        if (!response.ok) throw new Error(data.message || "Lỗi tải dữ liệu");
        return data; 
    } catch (error) {
        console.error("Fetch Error:", error);
        return { error: true, message: error.message };
    }
}

async function createRoomService(payload) {
    try {
        const res = await fetch(`${BaseURL}/createRoom`, {
            method: 'POST', headers: getAuthHeaders(), body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        return { success: true, data };
    } catch (error) { return { success: false, message: error.message }; }
}

async function updateRoomService(roomNum, payload) {
    try {
        const res = await fetch(`${BaseURL}/updateRoom/${encodeURIComponent(roomNum)}`, {
            method: 'PATCH', headers: getAuthHeaders(), body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        return { success: true, data };
    } catch (error) { return { success: false, message: error.message }; }
}

// --- 3. HIỂN THỊ GIAO DIỆN (RENDER) - CẬP NHẬT QUAN TRỌNG ---

function renderTable(data) {
    selectors.tableBody.innerHTML = '';

    if (!data || (data.error)) {
        selectors.tableBody.innerHTML = `<tr><td colspan="10" style="text-align:center; color:#ff7675; padding: 20px;">${data ? data.message : 'Lỗi kết nối đến máy chủ'}</td></tr>`;
        return;
    }

    const rooms = data.rooms || [];
    const pagination = data.pagination;

    // CẬP NHẬT STATS: Phần này cần API trả về số liệu thống kê (Nợ, Cọc, Sự cố...).
    // Hiện tại API getRoom chỉ trả về danh sách phòng.
    // Tạm thời comment lại để tránh lỗi vì ID cũ (statTotalRoom) đã bị xóa.
    /*
    if(pagination && document.getElementById('statTotalRoom')) {
        // document.getElementById('statTotalRoom').innerText = pagination.totalRoom;
        // Cần thêm logic cập nhật cho statDebt, statTotalDeposit, v.v. khi có API
    }
    */

    if (rooms.length === 0) {
        selectors.tableBody.innerHTML = `<tr><td colspan="10" style="text-align:center; color:#aaa; padding: 20px;">Không tìm thấy phòng nào.</td></tr>`;
        return;
    }

    rooms.forEach((room, index) => {
        const roomName = room.roomNum || `Phòng ${index + 1}`;
        // Sử dụng checkinDate làm Ngày lập HĐ
        const contractDate = room.checkinDate || 'Chưa có'; 
        
        // Logic giả định cho trạng thái thanh toán (Cột Tình trạng mới)
        // Bạn cần thay đổi logic này dựa trên dữ liệu thực tế từ Backend (ví dụ: room.paymentStatus)
        let paymentStatusHtml = '<span class="badge badge-paid">Đã thanh toán</span>';
        let rowTags = 'paid';

        // Ví dụ: Nếu createBill chứa chữ 'nợ' hoặc 'chưa' thì coi như chưa thanh toán
        const billTextForLogic = room.createBill || '';
        if (billTextForLogic.toLowerCase().includes('nợ') || billTextForLogic.toLowerCase().includes('chưa')) {
            paymentStatusHtml = '<span class="badge badge-unpaid">CHƯA THANH TOÁN</span>';
            rowTags = 'debt';
        }
        
        // Thêm tag cho bộ lọc Occupied/Empty dựa trên status phòng
        if(room.status && room.status.toLowerCase().includes('đang ở')) rowTags += ' occupied';
        else rowTags += ' empty';

        const tr = document.createElement('tr');
        // Lưu data phòng vào tr để dùng cho chức năng Sửa (nếu cần kích hoạt lại sau này)
        tr.dataset.room = JSON.stringify(room);
        tr.setAttribute('data-status', rowTags);

        // Render các cột khớp với Header mới trong HTML
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
            <td>${paymentStatusHtml}</td> <td><button class="btn-create-bill" onclick="handleBill('${roomName}')">Tạo Bill</button></td> `;
        selectors.tableBody.appendChild(tr);
    });
    
    // Update footer
    if (selectors.footerInfo && pagination) {
        selectors.footerInfo.innerText = `Hiển thị ${rooms.length} / ${pagination.totalRoom} phòng | Trang ${pagination.page}`;
    }
}

// --- 4. XỬ LÝ SỰ KIỆN & MODAL (GIỮ NGUYÊN LOGIC CŨ) ---

function openCreateModal() {
    selectors.isEditMode.value = "false";
    selectors.modalTitle.innerText = "THÊM PHÒNG MỚI";
    selectors.inputs.roomNum.disabled = false;
    toggleModal(true);
}

// Hàm này có thể được gọi bằng cách khác, ví dụ double-click vào dòng
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
        initApp(); // Tải lại bảng
    } else {
        alert("Có lỗi xảy ra: " + res.message);
    }
}

// Hàm xử lý khi nhấn nút Tạo Bill (Cần implement logic sau)
window.handleBill = (roomNum) => {
    console.log(`Tạo bill cho phòng: ${roomNum}`);
    alert(`Chức năng tạo bill cho ${roomNum} đang phát triển.`);
}

function setupFilters() {
    selectors.checkboxes.forEach(cb => {
        cb.addEventListener('change', function() {
            if (this.checked) selectors.checkboxes.forEach(c => { if (c !== this) c.checked = false; });
            else { if(selectors.allCheckbox) { selectors.allCheckbox.checked = true; selectors.allCheckbox.dispatchEvent(new Event('change')); } return; }
            
            const type = this.getAttribute('data-filter');
            document.querySelectorAll('#roomTable tbody tr').forEach(row => {
                const tags = row.getAttribute('data-status');
                // Logic lọc đơn giản: hiển thị nếu là 'all' HOẶC row có chứa tag tương ứng
                row.style.display = (type === 'all' || (tags && tags.includes(type))) ? '' : 'none';
            });
        });
    });
}

let searchTimeout;
function setupSearch() {
    if(!selectors.searchInput) return;
    selectors.searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => { initApp(e.target.value); }, 400);
    });
}

function toggleModal(show) {
    selectors.modal.style.display = show ? "block" : "none";
    if(!show) {
        // Reset form khi đóng
        Object.values(selectors.inputs).forEach(i => { if(i.tagName !== 'SELECT') i.value = ''; });
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

// Khởi tạo ứng dụng
document.addEventListener('DOMContentLoaded', () => {
    initApp();
    setupFilters();
    setupSearch();
    
    if (selectors.openBtn) selectors.openBtn.onclick = openCreateModal;
    if (selectors.closeBtn) selectors.closeBtn.onclick = () => toggleModal(false);
    if (selectors.submitBtn) selectors.submitBtn.onclick = handleSubmit;
    window.onclick = (e) => { if (e.target == selectors.modal) toggleModal(false); };
    
    // Ví dụ: Thêm sự kiện double-click vào dòng để sửa (thay cho nút sửa đã bị ẩn)
    selectors.tableBody.addEventListener('dblclick', (e) => {
        const tr = e.target.closest('tr');
        if(tr) window.openEditModal(tr);
    });
});