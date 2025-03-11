<template>
    <layout-div>
      <div class="container">
        <h2 class="text-center mb-3">Detail Peminjaman</h2>
        <div class="card">
          <div class="card-body">
            <table class="table table-bordered">
              <tr>
                <th>Nama</th>
                <td>{{ data.id }}</td>
              </tr>
              <tr>
                <th>Kelas</th>
                <td>{{ data.barang }}</td>
              </tr>
              <tr>
                <th>Nama Barang</th>
                <td>{{ data.stok }}</td>
              </tr>
            </table>
            <router-link to="/databarang" class="btn btn-secondary">Kembali</router-link>
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
          const response = await axios.get(`http://localhost:3000/users/${id}`);
          this.data = response.data;
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      }
    }
  };
  </script>