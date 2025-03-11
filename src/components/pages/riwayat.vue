<template>
  <layout-div>
    <div class="container">
      <h2 class="text-center">Riwayat Peminjaman</h2>

      <div class="table-responsive">
        <table class="table table-bordered table-striped">
          <thead class="table-dark">
            <tr>
              <th>No</th>
              <th>Nama</th>
              <th>Kelas</th>
              <th>Nama Barang</th>
              <th>Jumlah</th>
              <th>Tanggal Dipinjam</th>
              <th>Tanggal Dikembalikan</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in riwayat" :key="index">
              <td>{{ index + 1 }}</td>
              <td>{{ item.nama }}</td>
              <td>{{ item.kelas }}</td>
              <td>{{ item.namabarang }}</td>
              <td>{{ item.jumlahbarang }}</td>
              <td>{{ item.tanggalDipinjam }}</td>
              <td>{{ item.tanggalDikembalikan }}</td>
              <td style="color: green; text-align: center;"><b>{{ item.status }}</b></td>
            </tr>
          </tbody>
        </table>
      </div>

      <p v-if="riwayat.length === 0" class="text-center text-muted">
        🚫 Tidak ada riwayat peminjaman yang selesai.
      </p>
    </div>
  </layout-div>
</template>

<script>
import axios from 'axios';
import LayoutDiv from '../LayoutDiv.vue';

export default {
  components: { LayoutDiv },
  data() {
    return {
      riwayat: [],
      refreshInterval: null, // Untuk polling otomatis
    };
  },
  mounted() {
    this.fetchRiwayat();
    this.startAutoRefresh(); // Mulai polling otomatis
  },
  beforeUnmount() {
    this.stopAutoRefresh(); // Hentikan polling saat komponen di-unmount
  },
  methods: {
    async fetchRiwayat() {
      try {
        // Ambil data dari API /riwayat
        const { data } = await axios.get('https://7a6bc215-6459-47b1-8792-ea59bd0c1918-00-30ru3bjcoagn1.sisko.replit.dev/riwayat');
        
        // Debugging: Menampilkan data di console
        console.log("Data dari API:", data);

        // Simpan data ke riwayat
        this.riwayat = data;
      } catch (error) {
        console.error('Gagal mengambil data riwayat:', error);
      }
    },

    // 🔄 **Polling otomatis setiap 5 detik**
    startAutoRefresh() {
      this.refreshInterval = setInterval(() => {
        this.fetchRiwayat();
      }, 5000); // 5 detik
    },

    // 🛑 **Hentikan polling saat komponen di-unmount**
    stopAutoRefresh() {
      if (this.refreshInterval) {
        clearInterval(this.refreshInterval);
        this.refreshInterval = null;
      }
    }
  }
};
</script>

<style scoped>
.container {
  max-width: 100%;
  margin: auto;
}

.table {
  text-align: center;
}

h2 {
  margin-bottom: 20px;
}
</style>