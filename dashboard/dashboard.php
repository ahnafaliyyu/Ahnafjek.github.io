<?php
session_start();

// Jika belum login, redirect ke halaman login
if (!isset($_SESSION['username'])) {
    header('Location: ../login/login.php');
    exit();
}

$username = $_SESSION['username'];
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard Admin - AhnafJek</title>
    <link rel="stylesheet" href="dashboard.css">
</head>
<body>
    <div class="dashboard-container">
        <aside class="sidebar">
            <div class="sidebar-header">
                <h2>AhnafJek</h2>
                <span>Admin Panel</span>
            </div>
            <nav class="sidebar-nav">
                <ul>
                    <li><a href="#" class="active">📊 Dashboard</a></li>
                    <li><a href="#">📝 Atur Konten</a></li>
                    <li><a href="#">👥 Manajemen Mitra</a></li>
                    <li><a href="#">⚙️ Pengaturan</a></li>
                </ul>
            </nav>
            <div class="sidebar-footer">
                <a href="../logout.php" class="logout-btn">Logout</a>
            </div>
        </aside>
        <main class="main-content">
            <header class="main-header">
                <div class="header-title">
                    <h1>Selamat Datang, <?php echo htmlspecialchars($username); ?>!</h1>
                    <p>Ini adalah pusat kendali untuk website AhnafJek Anda.</p>
                </div>
            </header>
            <div class="content-area">
                <div class="widget-grid">
                    <div class="widget">
                        <h3>Konten Website</h3>
                        <p>Atur teks, gambar, dan layanan yang tampil di halaman utama.</p>
                        <button>Kelola Konten</button>
                    </div>
                    <div class="widget">
                        <h3>Data Mitra</h3>
                        <p>Lihat dan kelola pendaftaran mitra baru.</p>
                        <button>Lihat Mitra</button>
                    </div>
                    <div class="widget">
                        <h3>Analitik</h3>
                        <p>Pantau statistik pengunjung website Anda.</p>
                        <button>Lihat Analitik</button>
                    </div>
                </div>
            </div>
        </main>
    </div>
</body>
</html>
