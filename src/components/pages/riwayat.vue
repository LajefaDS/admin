<template>
  <layout-div>
    <div class="container">
      <h2 class="text-center">Riwayat Peminjaman</h2>

      <!-- Tombol Unduh PDF -->
      <div class="text-end mb-3">
        <button class="btn btn-primary" @click="downloadAndClear">⬇ Unduh PDF</button>
      </div>

      <div id="print-section">
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
              <tr v-for="(item, index) in riwayat" :key="item.id">
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
      </div>

      <p v-if="riwayat.length === 0" class="text-center text-muted">
        🚫 Tidak ada riwayat peminjaman yang selesai.
      </p>
    </div>
  </layout-div>
</template>

<script>
import axios from 'axios';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import LayoutDiv from '../LayoutDiv.vue';

export default {
  components: { LayoutDiv },
  data() {
    return {
      riwayat: [],
      refreshInterval: null,
    };
  },
  mounted() {
    this.fetchRiwayat();
    this.startAutoRefresh();
  },
  beforeUnmount() {
    this.stopAutoRefresh();
  },
  methods: {
    async fetchRiwayat() {
      try {
        const { data } = await axios.get('https://29b1ef8a-9650-4e93-aae4-c5dd204ed3f4-00-29uckvoxpfzx3.sisko.replit.dev/riwayat');
        this.riwayat = data;
      } catch (error) {
        console.error('Gagal mengambil data riwayat:', error);
      }
    },

    startAutoRefresh() {
      this.refreshInterval = setInterval(() => {
        this.fetchRiwayat();
      }, 5000);
    },

    stopAutoRefresh() {
      if (this.refreshInterval) {
        clearInterval(this.refreshInterval);
        this.refreshInterval = null;
      }
    },

    async deleteById(id) {
      try {
        await axios.delete(`https://29b1ef8a-9650-4e93-aae4-c5dd204ed3f4-00-29uckvoxpfzx3.sisko.replit.dev/riwayat/${id}`);
      } catch (error) {
        console.error(`Gagal menghapus ID ${id}:`, error);
      }
    },

    async clearAllRiwayat() {
      for (const item of this.riwayat) {
        await this.deleteById(item.id);
      }
      this.riwayat = [];
    },

    async downloadAndClear() {
      const element = document.getElementById('print-section');
      html2canvas(element, { scale: 2 }).then(async (canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgWidth = 200;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        pdf.addImage(imgData, 'PNG', 5, 10, imgWidth, imgHeight);
        pdf.save('Riwayat_Peminjaman.pdf');
        await this.clearAllRiwayat();
      });
    },
  },
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