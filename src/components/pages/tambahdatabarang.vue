<template>
    <layout-div>
      <div class="container">
        <h2 class="text-center">Tambah Data Barang</h2>
        <div class="card shadow-lg mt-2">
          <div class="card-body">
            <form @submit.prevent="confirmSubmit">
              <div class="mb-3">
                <label class="form-label">ID (Auto)</label>
                <input type="text" v-model="id" class="form-control bg-light" readonly>
              </div>
              <div class="mb-3">
                <label class="form-label">Nama Barang</label>
                <input type="text" v-model="namaBarang" class="form-control" required>
              </div>
              <div class="mb-3">
                <label class="form-label">Stok</label>
                <input type="number" v-model="stok" class="form-control" required>
              </div>
              <button type="submit" class="btn btn-primary w-100">Simpan</button>
              <router-link to="/databarang" class="btn btn-secondary w-100 mt-2">Kembali</router-link>
            </form>
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
      const id = ref("1");
      const namaBarang = ref("");
      const stok = ref("");
  
      const fetchLastId = async () => {
        try {
          const response = await fetch("https://29b1ef8a-9650-4e93-aae4-c5dd204ed3f4-00-29uckvoxpfzx3.sisko.replit.dev/users");
          if (response.ok) {
            const data = await response.json();
            const lastId = data.length > 0 ? parseInt(data[data.length - 1].id) + 1 : 1;
            id.value = lastId.toString();
          }
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Terjadi kesalahan saat mengambil data!",
          });
        }
      };
  
      const confirmSubmit = () => {
        Swal.fire({
          title: "Yakin ingin menyimpan?",
          text: "Pastikan data yang dimasukkan sudah benar!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Ya, Simpan!",
          cancelButtonText: "Batal",
        }).then((result) => {
          if (result.isConfirmed) {
            handleSubmit();
          }
        });
      };
  
      const handleSubmit = async () => {
        const data = {
          id: id.value,
          barang: namaBarang.value,
          stok: stok.value,
        };
  
        try {
          const response = await fetch("https://29b1ef8a-9650-4e93-aae4-c5dd204ed3f4-00-29uckvoxpfzx3.sisko.replit.dev/users", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          });
  
          if (response.ok) {
            Swal.fire({
              title: "Berhasil!",
              text: "Data berhasil ditambahkan.",
              icon: "success",
              showConfirmButton: false,
              timer: 2000,
            });
            namaBarang.value = "";
            stok.value = "";
            fetchLastId();
          } else {
            Swal.fire({
              icon: "error",
              title: "Gagal!",
              text: "Gagal menambahkan data.",
            });
          }
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Terjadi kesalahan saat menyimpan data!",
          });
        }
      };
  
      onMounted(fetchLastId);
  
      return { id, namaBarang, stok, confirmSubmit };
    },
  };
  </script>
  
  <style>
  .container {
    max-width: 100%;
  }
  </style>  