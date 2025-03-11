<template>
    <layout-div>
      <h2 class="text-center">List Data Barang</h2>
      <div class="container">
        <div class="card shadow-lg">
          <div class="card-header text-white d-flex justify-content-between align-items-center" style="background-color: #2c3e50;">
            <h5 class="mb-0">📢 Notifikasi Pengembalian Barang</h5>
            <button class="btn btn-sm btn-light" @click="fetchNotifications">🔄 Refresh</button>
          </div>
          <div class="card-body">
            <ul v-if="notifications.length > 0" class="list-group">
              <li 
                v-for="(notif, index) in notifications"
                :key="index"
                class="list-group-item d-flex justify-content-between align-items-center"
              >
                <div>
                  <strong>{{ notif.namabarang }} ({{ notif.jumlahbarang }})</strong> - {{ notif.nama }} ({{ notif.kelas }})
                  <br>
                  <small class="text-muted">Dipinjam sejak: {{ formatDate(notif.tanggalKembali) }}</small>
                </div>
                <button class="btn btn-danger btn-sm" @click="removeNotification(notif, index)">❌ Hapus</button>
              </li>
            </ul>
            <p v-else class="text-center text-muted">✅ Tidak ada barang yang perlu dikembalikan.</p>
          </div>
        </div>
      </div>
    </layout-div>
  </template>
  
  <script>
  import axios from 'axios';
  import Swal from 'sweetalert2';
  import LayoutDiv from '../LayoutDiv.vue';
  
  export default {
    components: { LayoutDiv },
    data() {
      return {
        notifications: [], // Menyimpan daftar notifikasi
      };
    },
    mounted() {
      this.fetchNotifications();
      setInterval(this.fetchNotifications, 10000); // Refresh otomatis setiap 10 detik
    },
    methods: {
      async fetchNotifications() {
  try {
    const { data } = await axios.get('http://localhost:3000/notifikasi');
    console.log(data); // Periksa struktur data yang diterima

    this.notifications = data.filter(item => item.status !== 'Dikembalikan');
  } catch (error) {
    console.error('Error fetching notifications:', error);
  }
},
  
async removeNotification(notif, index) {
  try {
    const confirm = await Swal.fire({
      title: "Apakah Anda yakin?",
      text: `Barang \"${notif.namabarang}\" akan dihapus dan dicatat ke riwayat.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, lanjutkan!",
    });

    if (!confirm.isConfirmed) return;

    // 1️⃣ Ambil data barang dari database untuk mendapatkan tanggal dipinjam
    const { data: dbData } = await axios.get(`http://localhost:3000/database/${notif.id}`);
    if (!dbData) throw new Error("Data barang tidak ditemukan di database");

    // 2️⃣ Ambil data stok barang dari /users
    const { data: users } = await axios.get(`http://localhost:3000/users?barang=${notif.namabarang}`);
    if (!users.length) throw new Error("Barang tidak ditemukan di users");

    const userData = users[0];
    const updatedStock = userData.stok + notif.jumlahbarang; // Tambahkan stok kembali

    // 3️⃣ Simpan ke riwayat
    await axios.post('http://localhost:3000/riwayat', {
      id: notif.id,
      nama: notif.nama,
      kelas: notif.kelas,
      namabarang: notif.namabarang,
      jumlahbarang: notif.jumlahbarang,
      tanggalDipinjam: dbData.tanggal, // Dari database
      tanggalDikembalikan: notif.tanggalKembali, // Dari notifikasi
      status: "Dikembalikan"
    });

    // 4️⃣ Update stok barang di /users
    await axios.patch(`http://localhost:3000/users/${userData.id}`, { stok: updatedStock });

    // 5️⃣ Hapus data dari /notifikasi
    await axios.delete(`http://localhost:3000/notifikasi/${notif.id}`);

    // 6️⃣ Hapus data dari /database
    await axios.delete(`http://localhost:3000/database/${notif.id}`);

    // 7️⃣ Perbarui daftar notifikasi
    this.notifications.splice(index, 1);

    Swal.fire("Berhasil!", `Barang \"${notif.namabarang}\" telah dikembalikan dan dicatat ke riwayat.`, "success");
  } catch (error) {
    Swal.fire("Gagal!", error.message || "Terjadi kesalahan.", "error");
  }
},
  
      formatDate(timestamp) {
  if (!timestamp) return "Tanggal tidak tersedia"; // Tangani kasus undefined/null

  console.log("Menerima timestamp:", timestamp); // 🔍 Cek apakah timestamp dikirim ke fungsi

  // Pisahkan tanggal dan waktu berdasarkan koma
  const [datePart, timePart] = timestamp.split(", ");

  if (!datePart || !timePart) return "Format tidak valid"; // Tangani format yang tidak sesuai

  // Pisahkan hari, bulan, dan tahun
  const [day, month, year] = datePart.split("-").map(Number);
  const [hour, minute, second] = timePart.split(".").map(Number);

  // Buat objek tanggal baru
  const date = new Date(year, month - 1, day, hour, minute, second);

  return date.toLocaleString("id-ID", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).replace(/\//g, "-");
}
    }
  };
  </script>
  
  <style scoped>
  .card {
    border-radius: 10px;
  }
  
  .list-group-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-left: 5px solid #2c3e50;
    padding: 10px;
  }
  
  .list-group-item strong {
    color: #0052D4;
  }
  
  .btn-danger {
    font-size: 12px;
  }
  </style>  