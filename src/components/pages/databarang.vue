<template>
  <layout-div>
    <div class="container">
      <h3 class="text-center">List Data Barang</h3>
      <div class="mb-3 text-end">
        <router-link to="/tambahdatabarang" class="btn btn-primary">Tambah Data Barang</router-link>
      </div>
      <div class="card shadow-lg">
        <div class="card-body">
          <table class="table table-striped table-hover">
            <thead class="thead-dark">
              <tr>
                <th>ID</th>
                <th>Nama Barang</th>
                <th>Stok</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in items" :key="item.id">
                <td>{{ item.id }}</td>
                <td>{{ item.barang }}</td>
                <td>{{ item.stok }}</td>
                <td>
                  <router-link :to="`/showdatabarang/${item.id}`" class="btn btn-success btn-sm me-2">Show</router-link>
                  <router-link :to="`/editdatabarang/${item.id}`" class="btn btn-warning btn-sm me-2">Edit</router-link>
                  <button @click="confirmDelete(item.id)" class="btn btn-danger btn-sm">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </layout-div>
</template>

<script>
import { ref, onMounted } from "vue";
import LayoutDiv from "../LayoutDiv.vue";
import Swal from "sweetalert2";

export default {
  components: { LayoutDiv },
  setup() {
    const items = ref([]);
    
    const fetchItems = async () => {
      try {
        const response = await fetch("http://localhost:3000/users");
        if (response.ok) {
          items.value = await response.json();
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Terjadi kesalahan saat mengambil data!",
        });
      }
    };

    const confirmDelete = (itemId) => {
      Swal.fire({
        title: "Yakin ingin menghapus?",
        text: "Data ini akan dihapus secara permanen!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Ya, hapus!",
        cancelButtonText: "Batal",
      }).then((result) => {
        if (result.isConfirmed) {
          deleteItem(itemId);
        }
      });
    };

    const deleteItem = async (itemId) => {
      try {
        const response = await fetch(`http://localhost:3000/users/${itemId}`, {
          method: "DELETE",
        });
        if (response.ok) {
          Swal.fire({
            title: "Terhapus!",
            text: "Data berhasil dihapus.",
            icon: "success",
            showConfirmButton: false,
            timer: 2000,
          });
          fetchItems();
        } else {
          Swal.fire({
            icon: "error",
            title: "Gagal!",
            text: "Gagal menghapus data.",
          });
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Terjadi kesalahan saat menghapus data!",
        });
      }
    };

    onMounted(fetchItems);

    return { items, confirmDelete };
  },
};
</script>