<template>
  <layout-div>
    <div class="container">
      <h2 class="text-center mb-3">Detail Peminjaman</h2>
      <div class="card">
        <div class="card-body">
          <table class="table table-bordered">
            <tr>
              <th>Nama</th>
              <td>{{ data.nama }}</td>
            </tr>
            <tr>
              <th>Kelas</th>
              <td>{{ data.kelas }}</td>
            </tr>
            <tr>
              <th>Nama Barang</th>
              <td>{{ data.namabarang }}</td>
            </tr>
            <tr>
              <th>Jumlah Barang</th>
              <td>{{ data.jumlahbarang }}</td>
            </tr>
            <tr>
              <th>Waktu Dipinjam</th>
              <td>{{ data.tanggal }}</td>
            </tr>
          </table>
          <router-link to="/list" class="btn btn-secondary">Kembali</router-link>
        </div>
      </div>
    </div>
  </layout-div>
</template>

<script>
import axios from 'axios';
import LayoutDiv from '../LayoutDiv.vue';

export default {
  name: 'ShowData',
  components: { LayoutDiv },
  data() {
    return {
      data: {}
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      const id = this.$route.params.id;
      try {
        const response = await axios.get(`http://localhost:3000/database/${id}`);
        this.data = response.data;
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
  }
};
</script>