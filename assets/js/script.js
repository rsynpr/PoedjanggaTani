
function filterCards() {
    const input = document.getElementById('cari').value.toUpperCase();
    const cards = document.querySelectorAll('.sayur-card');
    let adaHasil = false;

    cards.forEach(card => {
      const title = card.getAttribute('data-title');
      if (title.toUpperCase().includes(input)) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    });
  if (adaHasil) {
    document.getElementById('produk').scrollIntoView({ behavior: 'smooth' });
  }}


    function tambahKeKeranjang(nama, harga) {
      let keranjang = JSON.parse(localStorage.getItem("keranjang")) || [];
      keranjang.push({ nama, harga });
      localStorage.setItem("keranjang", JSON.stringify(keranjang));
      alert(`${nama} ditambahkan ke keranjang!`);
    }
    function belisekarang(nama, harga) {
      let keranjang = JSON.parse(localStorage.getItem("keranjang")) || [];
      keranjang.push({ nama, harga });
      localStorage.setItem("keranjang", JSON.stringify(keranjang));
      alert(`${nama} mohon segera dibayar ya ka!`);
    }
    function tampilkanKeranjang() {
      const list = document.getElementById("listKeranjang");
      const total = document.getElementById("totalHarga");
      const keranjang = JSON.parse(localStorage.getItem("keranjang")) || [];

      list.innerHTML = "";
      let totalHarga = 0;

      keranjang.forEach((item, index) => {
        totalHarga += item.harga;
        list.innerHTML += `
          <li class="list-group-item d-flex justify-content-between">
            ${item.nama} - Rp${item.harga.toLocaleString()}
            <button class="btn btn-sm btn-custom" onclick="hapusItem(${index})"><i class="fa-solid fa-trash" style="color: #ffffff;"></i></button>
          </li>
        `;
      });

      total.textContent = "Rp" + totalHarga.toLocaleString();
    }

    function hapusItem(index) {
      let keranjang = JSON.parse(localStorage.getItem("keranjang")) || [];
      keranjang.splice(index, 1);
      localStorage.setItem("keranjang", JSON.stringify(keranjang));
      tampilkanKeranjang();
    }

    tampilkanKeranjang();

    function hapusSemuaItem() {
      localStorage.removeItem("keranjang");
      tampilkanKeranjang();
    }

    function togglePassword(id) {
      var input = document.getElementById(id);
      if (input.type === "password") {
          input.type = "text";
      } else {
          input.type = "password";
      }
  }
  
  function switchSection(type) {
    const sayur = document.getElementById('section-sayur');
    const buah = document.getElementById('section-buah');
    const btnSayur = document.getElementById('btnSayur');
    const btnBuah = document.getElementById('btnBuah');
  
    if (type === 'sayur') {
      sayur.classList.remove('d-none');
      buah.classList.add('d-none');
      btnSayur.classList.add('active');
      btnBuah.classList.remove('active');
    } else {
      buah.classList.remove('d-none');
      sayur.classList.add('d-none');
      btnBuah.classList.add('active');
      btnSayur.classList.remove('active');
    }
  }

  const input = document.getElementById('searchInput');
  const button = document.getElementById('searchBtn');

  input.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
      event.preventDefault(); 
      button.click(); 
    }
  });
  
  document.querySelector('.btn-bayar').addEventListener('click', function () {
    const metodePembayaran = document.querySelector('select.form-select').value;
    const total = document.getElementById('totalHarga').textContent;

    if (!metodePembayaran || metodePembayaran === "Pilih metode pembayaran") {
      alert('Silakan pilih metode pembayaran terlebih dahulu.');
      return;
    }

    
    localStorage.setItem('metodePembayaran', metodePembayaran);
    localStorage.setItem('totalHarga', total);

    window.location.href = 'konfirmasi.html';
  });

  