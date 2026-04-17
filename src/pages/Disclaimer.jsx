import React, { useEffect } from 'react';
import Layout from '../components/layout/Layout';
import { AlertTriangle } from 'lucide-react';
import './Disclaimer.css';

const Disclaimer = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Layout>
      <div className="container disclaimerContainer">
        <div className="disclaimerHeader">
          <AlertTriangle size={48} color="var(--primary-color)" />
          <h1>Disclaimer & Kebijakan</h1>
        </div>

        <div className="disclaimerContent">
          <section>
            <h2>Tentang Platform</h2>
            <p>
              Website <strong>KOMIK</strong> adalah platform yang menampilkan informasi komik/manga
              dari berbagai sumber API pihak ketiga. Kami <strong>TIDAK menyimpan</strong>,
              <strong>TIDAK mengupload</strong>, dan <strong>TIDAK meng-host</strong> file gambar apapun di server kami.
            </p>
          </section>

          <section>
            <h2>Sumber Data</h2>
            <p>
              Semua data komik (judul, deskripsi, cover, dan link pembaca) diperoleh dari
              API eksternal yang disediakan oleh KOMIKCAST dan KOMIKU. Kami hanya berfungsi sebagai agregator
              data yang menampilkan informasi tersebut kepada pengguna.
            </p>
          </section>

          <section>
            <h2>Hak Cipta</h2>
            <p>
              Semua konten komik yang ditampilkan di website ini adalah milik dari pemilik hak cipta masing-masing.
              Jika Anda adalah pemilik hak cipta dan merasa konten Anda ditampilkan tanpa izin,
              silakan hubungi penyedia data (KOMIKCAST atau KOMIKU).
            </p>
          </section>

          <section>
            <h2>Batasan Tanggung Jawab</h2>
            <p>
              KOMIK <strong>TIDAK bertanggung jawab</strong> atas:
            </p>
            <ul>
              <li>Keakuratan, kelengkapan, atau ketersediaan data komik yang ditampilkan</li>
              <li>Pelanggaran hak cipta atau masalah hukum terkait konten</li>
              <li>Kerugian atau kerusakan dari penggunaan website ini</li>
              <li>Masalah teknis, downtime, atau error dari sumber API</li>
              <li>Konten yang mungkin tidak pantas atau menyinggung</li>
            </ul>
          </section>

          <section>
            <h2>Penggunaan Website</h2>
            <p>
              Dengan menggunakan website ini, Anda menyetujui bahwa:
            </p>
            <ul>
              <li>Anda menggunakan website ini atas risiko Anda sendiri</li>
              <li>Anda memahami kami hanya agregator data dari pihak ketiga</li>
              <li>Anda bertanggung jawab mematuhi hukum wilayah Anda</li>
              <li>Kami berhak mengubah atau menghentikan layanan kapan saja</li>
            </ul>
          </section>

          <section>
            <h2>Perubahan Disclaimer</h2>
            <p>
              Kami berhak mengubah disclaimer ini kapan saja. Perubahan berlaku segera setelah dipublikasikan.
              Penggunaan website yang berkelanjutan berarti Anda menerima disclaimer yang telah diperbarui.
            </p>
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default Disclaimer;
