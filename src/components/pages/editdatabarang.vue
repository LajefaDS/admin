<template>
    <layout-div>
      <div class="container">
        <h2 class="text-center mb-3">Edit Data Barang</h2>
        <div class="card">
          <div class="card-body">
            <form @submit.prevent="updateData">
              <div class="mb-3">
                <label class="form-label">Nama Barang</label>
                <input type="text" v-model="form.barang" class="form-control" required>
              </div>
              <div class="mb-3">
                <label class="form-label">Stok</label>
                <input type="number" v-model="form.stok" class="form-control" required>
              </div>
              <button type="submit" class="btn btn-primary">Update</button>
              <router-link to="/databarang" class="btn btn-secondary ms-2">Cancel</router-link>
            </form>
          </div>
        </div>
      </div>
    </layout-div>
  </template>
  
  <script>
  import axios from 'axios';
  import LayoutDiv from '../LayoutDiv.vue';
  import Swal from 'sweetalert2';
  
  export default {
    name: 'EditBarang',
    components: { LayoutDiv },
    data() {
      return {
        form: {
          barang: '',
          stok: 0
        }
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
          this.form = response.data;
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      },
      async updateData() {
        const id = this.$route.params.id;
        try {
          await axios.put(`http://localhost:3000/users/${id}`, this.form);
          Swal.fire({ icon: 'success', title: 'Data berhasil diperbarui!', timer: 1500 });
          this.$router.push('/databarang');
        } catch (error) {
          console.error('Error updating data:', error);
        }
      }
    }
  };
  </script>