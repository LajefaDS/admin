<template>
  <layout-div>
    <div class="container">
      <h2 class="text-center mb-3">List Peminjaman</h2>
      
      <input v-model="searchQuery" type="text" class="form-control mb-3" placeholder="Cari berdasarkan nama..." />
      
      <div class="card-body">
        <table class="table table-bordered">
          <thead>
            <tr>
              <th>Nama</th>
              <th>Kelas</th>
              <th>Nama Barang</th>
              <th>Jumlah Barang</th>
              <th>Waktu Dipinjam</th>
              <th width="240px">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="filteredDataList.length === 0">
              <td colspan="6" class="text-center text-muted">Tidak ada list peminjaman</td>
            </tr>
            <tr v-for="item in filteredDataList" :key="item.id">
              <td>{{ item.nama }}</td>
              <td>{{ item.kelas }}</td>
              <td>{{ item.namabarang }}</td>
              <td>{{ item.jumlahbarang }}</td>
              <td>{{ item.tanggal }}</td>
              <td style="text-align: center;">
                <template v-if="isInNotifikasi(item.id)"><span class="text-success"><b>Proses</b></span></template>
                <template v-else>
                  <router-link :to="`/show/${item.id}`" class="btn btn-info mx-1">Show</router-link>
                  <router-link :to="`/edit/${item.id}`" class="btn btn-success mx-1">Edit</router-link>
                  <button @click="handleDelete(item.id)" class="btn btn-danger mx-1">Delete</button>
                </template>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </layout-div>
</template>

<script>
import axios from 'axios';
import LayoutDiv from '../LayoutDiv.vue';
import Swal from 'sweetalert2';

export default {
  name: 'DataList',
  components: { LayoutDiv },
  data() {
    return {
      user: {},
      dataList: [],
      notifikasiList: [],
      searchQuery: '',
      refreshInterval: null,
    };
  },
  computed: {
    filteredDataList() {
      return this.dataList.filter(item => 
        item.nama.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
  },
  created() {
    this.checkAuth();
    this.fetchDataList();
    this.startAutoRefresh();
  },
  beforeUnmount() {
    this.stopAutoRefresh();
  },
  methods: {
    checkAuth() {
      const token = localStorage.getItem('token');
      if (!token) {
        this.$router.push('/');
      } else {
        this.getUser();
      }
    },

    getUser() {
      axios.get('/api/user', { headers: { Authorization: 'Bearer ' + localStorage.getItem('token') } })
        .then((r) => {
          this.user = r.data;
        })
        .catch((e) => {
          console.error(e);
        });
    },

    async fetchDataList() {
      try {
        const databaseResponse = await axios.get('https://29b1ef8a-9650-4e93-aae4-c5dd204ed3f4-00-29uckvoxpfzx3.sisko.replit.dev/database');
        this.dataList = databaseResponse.data;
        const notifikasiResponse = await axios.get('https://29b1ef8a-9650-4e93-aae4-c5dd204ed3f4-00-29uckvoxpfzx3.sisko.replit.dev/notifikasi');
        this.notifikasiList = notifikasiResponse.data.map(n => n.id);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    },

    isInNotifikasi(id) {
      return this.notifikasiList.includes(id);
    },

    handleDelete(id) {
      Swal.fire({
        title: 'Apakah Anda yakin?',
        text: "Data yang dihapus tidak dapat dikembalikan!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Ya, hapus!',
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            const response = await axios.get(`https://29b1ef8a-9650-4e93-aae4-c5dd204ed3f4-00-29uckvoxpfzx3.sisko.replit.dev/database/${id}`);
            const { namabarang, jumlahbarang } = response.data;
            const barangResponse = await axios.get('https://29b1ef8a-9650-4e93-aae4-c5dd204ed3f4-00-29uckvoxpfzx3.sisko.replit.dev/users');
            const barang = barangResponse.data.find(b => b.barang === namabarang);
            if (barang) {
              await axios.put(`https://29b1ef8a-9650-4e93-aae4-c5dd204ed3f4-00-29uckvoxpfzx3.sisko.replit.dev/users/${barang.id}`, {
                ...barang,
                stok: barang.stok + jumlahbarang,
              });
            }
            await axios.delete(`https://29b1ef8a-9650-4e93-aae4-c5dd204ed3f4-00-29uckvoxpfzx3.sisko.replit.dev/database/${id}`);
            Swal.fire({ icon: 'success', title: 'Data berhasil dihapus!', timer: 1500 });
            this.fetchDataList();
          } catch (error) {
            console.error('Error saat menghapus data:', error);
            Swal.fire({ icon: 'error', title: 'Gagal menghapus data!', text: error.message });
          }
        }
      });
    },

    logoutAction() {
      axios.post('/api/logout', {}, { headers: { Authorization: 'Bearer ' + localStorage.getItem('token') } })
        .then(() => {
          localStorage.setItem('token', "");
          this.$router.push('/');
        })
        .catch((e) => {
          console.error(e);
        });
    },

    startAutoRefresh() {
      this.refreshInterval = setInterval(() => {
        this.fetchDataList();
      }, 5000);
    },

    stopAutoRefresh() {
      if (this.refreshInterval) {
        clearInterval(this.refreshInterval);
        this.refreshInterval = null;
      }
    },
  },
};
</script>