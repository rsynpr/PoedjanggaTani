// =======================
// Filter Produk
// =======================
function filterCards() {
  const input = document.getElementById('cari')?.value.toUpperCase();
  const cards = document.querySelectorAll('.sayur-card');
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
function tambahKeKeranjang(nama, harga) {
  const keranjang = JSON.parse(localStorage.getItem("keranjang")) || [];
  keranjang.push({ nama, harga });
  localStorage.setItem("keranjang", JSON.stringify(keranjang));
  alert(`${nama} ditambahkan ke keranjang!`);
}

// =======================
// Beli Sekarang
// =======================
function belisekarang(nama, harga) {
  const keranjang = JSON.parse(localStorage.getItem("keranjang")) || [];
  keranjang.push({ nama, harga });
  localStorage.setItem("keranjang", JSON.stringify(keranjang));
  alert(`${nama} mohon segera dibayar ya ka!`);
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
    totalHarga += item.harga;
    list.innerHTML += `
      <li class="list-group-item d-flex justify-content-between">
        ${item.nama} - Rp${item.harga.toLocaleString()}
        <button class="btn btn-sm btn-custom" onclick="hapusItem(${index})">
          <i class="fa-solid fa-trash" style="color: #ffffff;"></i>
        </button>
      </li>
    `;
  });

  total.textContent = "Rp" + totalHarga.toLocaleString();
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
// Toggle Password (form login)
function togglePassword(id) {
  const input = document.getElementById(id);
  if (input) {
    input.type = input.type === "password" ? "text" : "password";
  }
}

// =======================
// Ganti Section Sayur/Buah
// =======================
function switchSection(type) {
  const sayur = document.getElementById('section-sayur');
  const buah = document.getElementById('section-buah');
  const btnSayur = document.getElementById('btnSayur');
  const btnBuah = document.getElementById('btnBuah');

  if (type === 'sayur') {
    sayur?.classList.remove('d-none');
    buah?.classList.add('d-none');
    btnSayur?.classList.add('active');
    btnBuah?.classList.remove('active');
  } else {
    buah?.classList.remove('d-none');
    sayur?.classList.add('d-none');
    btnBuah?.classList.add('active');
    btnSayur?.classList.remove('active');
  }
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
// Tombol Bayar
// =======================
const tombolBayar = document.querySelector('.btn-bayar');

if (tombolBayar) {
  tombolBayar.addEventListener('click', function (e) {
    const metodePembayaran = document.querySelector('select.form-select')?.value;
    const total = document.getElementById('totalHarga')?.textContent;

    if (!metodePembayaran || metodePembayaran === "Pilih metode pembayaran") {
      alert('Silakan pilih metode pembayaran terlebih dahulu.');
      e.preventDefault();
      return;
    }

    localStorage.setItem('metodePembayaran', metodePembayaran);
    localStorage.setItem('totalHarga', total);

    window.location.href = 'konfirmasi.html';
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

    // Load data saat halaman dibuka
    document.addEventListener("DOMContentLoaded", () => {
      const data = JSON.parse(localStorage.getItem("profil")) || {};
      if (data.nama) namaInput.value = data.nama;
      if (data.email) emailInput.value = data.email;
      if (data.telepon) teleponInput.value = data.telepon;
      if (data.alamat) alamatInput.value = data.alamat;

      // Default: disabled
      [namaInput, emailInput, teleponInput, alamatInput].forEach(i => i.disabled = true);
    });

    // Toggle Edit/Simpan
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

  