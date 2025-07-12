// =======================
// Filter Produk
// =======================
function filterCards() {
  const input = document.getElementById('cari')?.value.toUpperCase();
  const cards = document.querySelectorAll('.produk-card');
  let adaHasil = false;

  cards.forEach(card => {
    const title = card.getAttribute('data-title');
    if (title.toUpperCase().includes(input)) {
      card.style.display = 'block';
      adaHasil = true;
    } else {
      card.style.display = 'none';
    }
  });

  if (adaHasil) {
    document.getElementById('produk')?.scrollIntoView({ behavior: 'smooth' });
  }
}

// =======================
// Tambah ke Keranjang
// =======================
function tambahKeKeranjang(id, nama, harga) {
  const keranjang = JSON.parse(localStorage.getItem("keranjang")) || [];
  const index = keranjang.findIndex(item => item.id === id);

  if (index !== -1) {
    keranjang[index].jumlah += 1;
  } else {
    keranjang.push({ id, nama, harga, jumlah: 1 });
  }

  localStorage.setItem("keranjang", JSON.stringify(keranjang));
  console.log(" Keranjang sekarang:", keranjang);
  alert("Produk ditambahkan ke keranjang!");
}

function belisekarang(id, nama, harga) {
  const item = [{ id, nama, harga, jumlah: 1 }];
  localStorage.setItem("keranjang", JSON.stringify(item));
  localStorage.setItem("directBuy", "true"); 
  console.log("🛒 Beli sekarang:", item);
}


// =======================
// Tampilkan Isi Keranjang
// =======================
function tampilkanKeranjang() {
  const list = document.getElementById("listKeranjang");
  const total = document.getElementById("totalHarga");

  if (!list || !total) return;

  const keranjang = JSON.parse(localStorage.getItem("keranjang")) || [];
  list.innerHTML = "";
  let totalHarga = 0;

  keranjang.forEach((item, index) => {
    if (!item.nama || typeof item.harga === 'undefined') return;

    const jumlah = item.jumlah || 1;
    const harga = item.harga || 0;
    const subtotal = harga * jumlah;

    totalHarga += subtotal;

    list.innerHTML += `
      <li class="list-group-item d-flex justify-content-between align-items-center">
        ${item.nama} × ${jumlah}
        <span>
          Rp${subtotal.toLocaleString('id-ID')}
          <button class="btn btn-sm btn-custom ms-2" onclick="hapusItem(${index})">
            <i class="fa-solid fa-trash" style="color: #ffffff;"></i>
          </button>
        </span>
      </li>
    `;
  });

  total.textContent = "Rp" + totalHarga.toLocaleString('id-ID');
}

// =======================
// Hapus Item
// =======================
function hapusItem(index) {
  const keranjang = JSON.parse(localStorage.getItem("keranjang")) || [];
  keranjang.splice(index, 1);
  localStorage.setItem("keranjang", JSON.stringify(keranjang));
  tampilkanKeranjang();
}

// =======================
// Hapus Semua
// =======================
function hapusSemuaItem() {
  localStorage.removeItem("keranjang");
  tampilkanKeranjang();
}

// =======================
// Enter to Search
// =======================
const input = document.getElementById('searchInput');
const button = document.getElementById('searchBtn');

if (input && button) {
  input.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      button.click();
    }
  });
}


// =======================
// Load Keranjang jika ada
// =======================
if (document.getElementById('listKeranjang')) {
  tampilkanKeranjang();
}

// =======================
// Edit Profile
// =======================
const namaInput = document.getElementById("nama");
const emailInput = document.getElementById("email");
const teleponInput = document.getElementById("telepon");
const alamatInput = document.getElementById("alamat");
const btnEdit = document.querySelector(".btn-edit");

if (namaInput && emailInput && teleponInput && alamatInput && btnEdit) {
  document.addEventListener("DOMContentLoaded", () => {
    const data = JSON.parse(localStorage.getItem("profil")) || {};
    if (data.nama) namaInput.value = data.nama;
    if (data.email) emailInput.value = data.email;
    if (data.telepon) teleponInput.value = data.telepon;
    if (data.alamat) alamatInput.value = data.alamat;
    [namaInput, emailInput, teleponInput, alamatInput].forEach(i => i.disabled = true);
  });

  btnEdit.addEventListener("click", function (e) {
    e.preventDefault();
    const isDisabled = namaInput.disabled;

    if (isDisabled) {
      [namaInput, emailInput, teleponInput, alamatInput].forEach(i => i.disabled = false);
      btnEdit.textContent = "Simpan Profil";
      btnEdit.classList.remove("btn-edit");
      btnEdit.classList.add("btn-success");
    } else {
      const data = {
        nama: namaInput.value,
        email: emailInput.value,
        telepon: teleponInput.value,
        alamat: alamatInput.value
      };
      localStorage.setItem("profil", JSON.stringify(data));
      [namaInput, emailInput, teleponInput, alamatInput].forEach(i => i.disabled = true);
      btnEdit.textContent = "Edit Profil";
      btnEdit.classList.remove("btn-success");
      btnEdit.classList.add("btn-edit");
      alert("Data berhasil disimpan.");
    }
  });
}

// =======================
// Maps
// =======================
function bukaMaps() {
  const alamat = document.getElementById("alamat").value;
  if (alamat.trim() !== "") {
    const query = encodeURIComponent(alamat);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, "_blank");
  } else {
    alert("Silakan isi alamat terlebih dahulu.");
  }
}

// =======================
// Fetch with Token
// =======================
async function fetchWithToken(url, options = {}) {
  let token = localStorage.getItem("token");

  options.headers = {
    ...(options.headers || {}),
    Authorization: "Bearer " + token,
    "Content-Type": "application/json",
  };

  let response = await fetch(url, options);

  if (response.status === 401 || response.status === 403) {
    const refresh = await fetch("http://localhost:5000/api/auth/refresh", {
      method: "POST",
      credentials: "include",
    });

    if (refresh.ok) {
      const data = await refresh.json();
      localStorage.setItem("token", data.accessToken);
      options.headers.Authorization = "Bearer " + data.accessToken;
      response = await fetch(url, options); 
    } else {
      localStorage.removeItem("token");
      return null;
    }
  }

  return response;
}

function toggleKeranjangPopup() {
  const popup = document.getElementById("popupKeranjang");
  const overlay = document.getElementById("keranjangOverlay");
  const isVisible = popup.style.transform === "translateX(0%)";

  if (isVisible) {
    popup.style.transform = "translateX(100%)";
    overlay.style.display = "none";
  } else {
    popup.style.transform = "translateX(0%)";
    overlay.style.display = "block";
    tampilkanIsiKeranjang();
  }
}


function tampilkanIsiKeranjang() {
  const isi = document.getElementById("isiKeranjang");
  const keranjang = JSON.parse(localStorage.getItem("keranjang")) || [];
  isi.innerHTML = "";

  if (keranjang.length === 0) {
    isi.innerHTML = "<p class='text-muted text-center mt-4'>Keranjang masih kosong.</p>";
    document.getElementById("keranjangTotal").innerHTML = "";
    return;
  }

  let total = 0;

  keranjang.forEach((item, index) => {
    const subtotal = item.harga * item.jumlah;
    total += subtotal;

    isi.innerHTML += `
      <div class="keranjang-item">
        <div class="info">
          <strong>${item.nama}</strong><br>
          <small>Rp${item.harga.toLocaleString('id-ID')} x ${item.jumlah}</small>
        </div>
        <div class="controls">
          <button class="btn btn-sm btn-outline-secondary" onclick="ubahJumlah(${index}, -1)">–</button>
          <span>${item.jumlah}</span>
          <button class="btn btn-sm btn-outline-secondary" onclick="ubahJumlah(${index}, 1)">+</button>
          <button class="btn btn-sm btn-danger" onclick="hapusItemKeranjang(${index})"><i class="fa fa-trash"></i></button>
        </div>
      </div>
    `;
  });

  document.getElementById("keranjangTotal").innerHTML = `
    <div class="mt-3">
      <div class="d-flex justify-content-between mb-2">
        <strong>Total:</strong>
        <strong>Rp${total.toLocaleString('id-ID')}</strong>
      </div>
      <a href="keranjang.html" class="btn btn-detail w-100">Lihat Detail</a>
    </div>
  `;
}



function hapusItemKeranjang(index) {
  let keranjang = JSON.parse(localStorage.getItem("keranjang")) || [];
  keranjang.splice(index, 1);
  localStorage.setItem("keranjang", JSON.stringify(keranjang));
  tampilkanIsiKeranjang();
  updateJumlahKeranjang();
}

function updateJumlahKeranjang() {
  const keranjang = JSON.parse(localStorage.getItem("keranjang")) || [];
  document.getElementById("keranjangCount").textContent = keranjang.length;
}


document.addEventListener("DOMContentLoaded", updateJumlahKeranjang);


function tambahKeKeranjang(id, nama, harga) {
  const keranjang = JSON.parse(localStorage.getItem("keranjang")) || [];
  const index = keranjang.findIndex(item => item.id === id);

  if (index !== -1) {
    keranjang[index].jumlah += 1;
  } else {
    keranjang.push({ id, nama, harga, jumlah: 1 });
  }

  localStorage.setItem("keranjang", JSON.stringify(keranjang));
  updateJumlahKeranjang();
}
function ubahJumlah(index, delta) {
  const keranjang = JSON.parse(localStorage.getItem("keranjang")) || [];
  keranjang[index].jumlah += delta;

  
  if (keranjang[index].jumlah <= 0) {
    keranjang.splice(index, 1);
  }

  localStorage.setItem("keranjang", JSON.stringify(keranjang));
  tampilkanIsiKeranjang();
  updateJumlahKeranjang();
}
function toggleRiwayatPopup() {
  const panel = document.getElementById('popupRiwayat');
  const overlay = document.getElementById('riwayatOverlay');

  if (panel.classList.contains('active')) {
    panel.classList.remove('active');
    overlay.style.display = 'none';
  } else {
    panel.classList.add('active');
    overlay.style.display = 'block';
    loadRiwayatMini(); 
  }
}



async function loadRiwayatMini() {
  const container = document.getElementById("isiRiwayat");
  const countBadge = document.getElementById("riwayatCount");

  if (!container) return; 

  container.innerHTML = "<p class='text-muted text-center'>Memuat...</p>";

  try {
    const token = localStorage.getItem("token");
    if (!token) {
      container.innerHTML = "<p class='text-danger text-center'>Anda belum login.</p>";
      if (countBadge) countBadge.style.display = "none";
      return;
    }

    const res = await fetch("http://localhost:5000/api/transactions/mine", {
      headers: { Authorization: `Bearer ${token}` },
      credentials: "include"
    });

    const data = await res.json();
    const belumSelesai = data.filter(trx => trx.statusPenyelesaian !== 'selesai');
    const totalCount = data.length;

    if (countBadge) {
      if (belumSelesai.length > 0) {
        countBadge.textContent = belumSelesai.length;
        countBadge.style.display = "inline-block";
      } else {
        countBadge.style.display = "none";
      }
    }

    if (!data.length) {
      container.innerHTML = "<p class='text-muted text-center mt-4'>Belum ada transaksi.</p>";
      return;
    }

    let totalSemua = 0;

    const htmlRiwayat = data.slice(0, 5).map((trx) => {
      const idTrx = trx._id.slice(-6);
      const total = trx.total;
      totalSemua += total;

      const status = trx.statusPenyelesaian || trx.statusPengiriman || trx.statusPembayaran || "belum";
      const badgeClass = getBadgeColor(status);

      const tanggal = new Date(trx.createdAt).toLocaleDateString('id-ID', {
        day: 'numeric', month: 'short', year: 'numeric'
      });

      return `
        <div class="keranjang-item">
          <div class="info">
            <strong>ID: ${idTrx}</strong><br>
            <small>${tanggal}</small><br>
            <span class="badge bg-${badgeClass}">${status}</span>
          </div>
          <div class="controls">
            <span><strong>Rp${total.toLocaleString('id-ID')}</strong></span>
          </div>
        </div>
      `;
    }).join("");

    container.innerHTML = htmlRiwayat + `
      <div class="mt-3 border-top pt-2">
        <div class="d-flex justify-content-between small mb-2 text-muted">
          Menampilkan ${Math.min(5, totalCount)} dari ${totalCount} transaksi
        </div>
        <div class="d-flex justify-content-between mb-2">
          <strong>Total semua transaksi:</strong>
          <strong>Rp${totalSemua.toLocaleString('id-ID')}</strong>
        </div>
        <a href="riwayat.html" class="btn btn-detail w-100">Lihat Selengkapnya</a>
      </div>
    `;

  } catch (err) {
    console.error(err);
    container.innerHTML = "<p class='text-danger text-center'>Gagal memuat riwayat.</p>";
    if (countBadge) countBadge.style.display = "none";
  }
}



window.addEventListener("DOMContentLoaded", loadRiwayatMini);


function getBadgeColor(status) {
  const map = {
    pending: "warning",
    diterima: "success",
    dikirim: "info",
    selesai: "success",
    batal: "danger",
  };
  return map[status] || "secondary";
}
