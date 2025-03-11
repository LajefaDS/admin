<template>
  <div>
    <div class="navbar">
      <button class="menu-toggle" @click="toggleMenu">☰</button>
      <div class="user-info">ADMIN</div>
    </div>
    <div class="sidebar" :class="{ open: isMenuOpen }" id="sidebar">
      <h2>Menu</h2>
      <ul>
        <li><router-link to="/list">Dashboard</router-link></li>
        <li>
          <router-link to="/notifikasi" class="notifikasi-link">
            Notifikasi
            <span v-if="hasNewNotifications" class="notif-indicator"></span>
          </router-link>
        </li>
        <li><router-link to="/riwayat">Riwayat</router-link></li>
        <li><router-link to="/databarang">Data Barang</router-link></li>
        <li><a href="#" @click="logoutAction()">Keluar</a></li>
      </ul>
    </div>
    <div class="main-content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'LayoutDiv',
  data() {
    return {
      user: {},
      isMenuOpen: false,
      hasNewNotifications: false, // Untuk tanda notifikasi baru
    };
  },
  mounted() {
    this.checkNewNotifications();
    setInterval(this.checkNewNotifications, 5000); // Cek setiap 5 detik
  },
  methods: {
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
    },
    
    async checkNewNotifications() {
      try {
        const response = await axios.get('https://7a6bc215-6459-47b1-8792-ea59bd0c1918-00-30ru3bjcoagn1.sisko.replit.dev/notifikasi');
        this.hasNewNotifications = response.data.length > 0;
      } catch (error) {
        console.error('Gagal mengambil notifikasi:', error);
      }
    },

    logoutAction() {
      console.log("Token sebelum logout:", localStorage.getItem('token'));
      axios.post('/api/logout', {}, { 
        headers: { Authorization: 'Bearer ' + localStorage.getItem('token') }
      })
      .then((r) => {
        localStorage.removeItem('token');
        console.log("Logout berhasil", r);
        this.$router.push('/');
      })
      .catch((e) => {
        console.error("Error saat logout:", e);
      });
    }
  }
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
body {
  font-family: 'Arial', sans-serif;
  background-color: #f4f4f4;
}
.navbar {
  background-color: #2c3e50;
  color: white;
  padding: 15px 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.navbar .user-info {
  font-size: 18px;
}
.sidebar {
  width: 250px;
  height: 100vh;
  background-color: #34495e;
  color: white;
  position: fixed;
  top: 0;
  left: 0;
  padding-top: 20px;
}
.sidebar h2 {
  text-align: center;
  font-size: 24px;
  margin-bottom: 30px;
}
.sidebar ul {
  list-style: none;
  padding: 0;
}
.sidebar ul li {
  padding: 15px;
  border-bottom: 1px solid #2c3e50;
}
.sidebar ul li a {
  color: white;
  text-decoration: none;
  font-size: 18px;
  position: relative;
}
.notifikasi-link {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.notif-indicator {
  width: 10px;
  height: 10px;
  background-color: red;
  border-radius: 50%;
  display: inline-block;
  margin-left: 8px;
}
.main-content {
  margin-left: 250px;
  padding: 15px 30px;
}
</style>