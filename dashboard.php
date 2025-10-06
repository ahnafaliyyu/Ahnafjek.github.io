<?php
session_start();

// Jika belum login, redirect ke halaman login
if (!isset($_SESSION["username"])) {
    header("Location: login.php");
    exit;
}

$username = $_SESSION["username"];
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="dashboard-container">
        <nav class="sidebar">
            <div class="sidebar-header">
                <h3>Admin Panel</h3>
            </div>
            <ul class="sidebar-menu">
                <li><a href="#">Dashboard</a></li>
                <li><a href="#">Manajemen User</a></li>
                <li><a href="#">Pengaturan</a></li>
                <li><a href="#">Laporan</a></li>
            </ul>
        </nav>
        <main class="main-content">
            <header class="main-header">
                <div class="user-info">
                    <span>Selamat datang, <strong><?php echo htmlspecialchars($username); ?></strong>!</span>
                </div>
                <a href="logout.php" class="logout-btn">Logout</a>
            </header>
            <div class="content-body">
                <h1>Dashboard Utama</h1>
                <p>Ini adalah halaman utama dashboard admin. Silakan kelola konten melalui menu di samping.</p>
            </div>
        </main>
    </div>
</body>
</html>
