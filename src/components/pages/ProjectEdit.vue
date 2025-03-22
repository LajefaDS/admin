<template>
  <layout-div>
    <div class="container">
      <h2 class="text-center mb-3">Edit Data Peminjaman</h2>
      <div class="card">
        <div class="card-body">
          <form @submit.prevent="updateData">
            <div class="mb-3">
              <label class="form-label">Nama</label>
              <input type="text" v-model="form.nama" class="form-control" required>
            </div>
            <div class="mb-3">
              <label class="form-label">Kelas</label>
              <input type="text" v-model="form.kelas" class="form-control" required>
            </div>
            <div class="mb-3">
              <label class="form-label">Nama Barang</label>
              <select v-model="form.namabarang" class="form-control" required @change="updateStock">
                <option v-for="barang in barangList" :key="barang.id" :value="barang.barang">
                  {{ barang.barang }}
                </option>
              </select>
            </div>
            <div class="mb-3">
              <label class="form-label">Jumlah Barang</label>
              <input type="number" v-model="form.jumlahbarang" class="form-control" required @input="validateJumlah">
            </div>
            <button type="submit" class="btn btn-primary" :disabled="form.jumlahbarang < 0">Update</button>
            <router-link to="/list" class="btn btn-secondary ms-2">Cancel</router-link>
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
  name: 'EditData',
  components: { LayoutDiv },
  data() {
    return {
      form: {
        nama: '',
        kelas: '',
        namabarang: '',
        jumlahbarang: 0,
        tanggal: ''
      },
      barangList: [],
      stokBarang: 0,
      oldJumlah: 0,
      oldNamabarang: '',
    };
  },
  created() {
    this.fetchData();
    this.fetchBarangList();
  },
  methods: {
    async fetchData() {
      const id = this.$route.params.id;
      try {
        const response = await axios.get(`https://29b1ef8a-9650-4e93-aae4-c5dd204ed3f4-00-29uckvoxpfzx3.sisko.replit.dev/database/${id}`);
        this.form = response.data;
        this.oldJumlah = response.data.jumlahbarang;
        this.oldNamabarang = response.data.namabarang;
        this.updateStock();
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    },
    async fetchBarangList() {
      try {
        const response = await axios.get('https://29b1ef8a-9650-4e93-aae4-c5dd204ed3f4-00-29uckvoxpfzx3.sisko.replit.dev/users');
        this.barangList = response.data;
      } catch (error) {
        console.error('Error fetching barang list:', error);
      }
    },
    updateStock() {
      const barang = this.barangList.find(b => b.barang === this.form.namabarang);
      if (barang) {
        this.stokBarang = barang.stok;
      }
    },
    validateJumlah() {
      if (this.form.jumlahbarang < 0) {
        Swal.fire({ icon: 'error', title: 'Jumlah barang tidak boleh kurang dari 0!', timer: 1500 });
        this.form.jumlahbarang = 0;
      }
    },
    async updateData() {
  const id = this.$route.params.id;
  const barangBaru = this.barangList.find(b => b.barang === this.form.namabarang);
  const barangLama = this.barangList.find(b => b.barang === this.oldNamabarang);

  if (!barangBaru) {
    Swal.fire({ icon: 'error', title: 'Barang tidak ditemukan!', timer: 1500 });
    return;
  }

  try {
    // 1️⃣ Jika nama barang berubah, kembalikan stok barang lama
    if (this.oldNamabarang !== this.form.namabarang && barangLama) {
      await axios.put(`https://29b1ef8a-9650-4e93-aae4-c5dd204ed3f4-00-29uckvoxpfzx3.sisko.replit.dev/users/${barangLama.id}`, {
        ...barangLama,
        stok: barangLama.stok + this.oldJumlah, // Kembalikan stok barang lama sepenuhnya
      });
    }

    // 2️⃣ Jika hanya jumlah barang yang berubah pada barang yang sama
    if (this.oldNamabarang === this.form.namabarang) {
      const selisih = this.form.jumlahbarang - this.oldJumlah;

      if (barangBaru.stok - selisih < 0) {
        Swal.fire({ icon: 'error', title: 'Stok barang tidak mencukupi!', timer: 1500 });
        return;
      }

      // Update stok hanya jika jumlahnya berubah
      await axios.put(`https://29b1ef8a-9650-4e93-aae4-c5dd204ed3f4-00-29uckvoxpfzx3.sisko.replit.dev/users/${barangBaru.id}`, {
        ...barangBaru,
        stok: barangBaru.stok - selisih, // Kurangi atau tambahkan stok sesuai perubahan jumlah
      });
    }

    // 3️⃣ Jika nama barang berubah, kurangi stok barang baru dengan jumlah baru
    if (this.oldNamabarang !== this.form.namabarang) {
      if (barangBaru.stok - this.form.jumlahbarang < 0) {
        Swal.fire({ icon: 'error', title: 'Stok barang tidak mencukupi!', timer: 1500 });
        return;
      }

      await axios.put(`https://29b1ef8a-9650-4e93-aae4-c5dd204ed3f4-00-29uckvoxpfzx3.sisko.replit.dev/users/${barangBaru.id}`, {
        ...barangBaru,
        stok: barangBaru.stok - this.form.jumlahbarang, // Kurangi stok dengan jumlah baru
      });
    }

    // 4️⃣ Update data peminjaman
    await axios.put(`https://29b1ef8a-9650-4e93-aae4-c5dd204ed3f4-00-29uckvoxpfzx3.sisko.replit.dev/database/${id}`, this.form);

    Swal.fire({ icon: 'success', title: 'Data updated successfully!', timer: 1500 });
    this.$router.push('/list');
  } catch (error) {
    console.error('Error updating data:', error);
  }
}
  }
};
</script>