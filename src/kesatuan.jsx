import React from 'react';
import { Printer, Plus, Search } from 'lucide-react';
import './index.css';

function Kesatuan() {
  return (
    <main className="main-content">
      <div className="data-panel">
        <div className="data-panel-header">
          <h2 className="panel-title">DATA KESATUAN</h2>
          <div className="panel-actions">
            <button className="btn btn-outline">
              <Printer size={16} />
              <span>Cetak</span>
            </button>
            <button className="btn btn-primary">
              <Plus size={16} />
              <span>Tambah Data</span>
            </button>
          </div>
        </div>
        
        <div className="data-filters">
          <div className="search-wrapper">
            <Search size={18} className="search-icon" />
            <input type="text" className="search-input" placeholder="Cari nama kesatuan, kode..." />
          </div>
          <div className="filter-controls">
            <button className="btn-reset">Reset</button>
          </div>
        </div>

        <div className="empty-state">
          <div className="empty-icon-circle">
            <span>0</span>
          </div>
          <h3 className="empty-title">Belum ada data kesatuan</h3>
          <p className="empty-description">Klik tombol "Tambah Data" untuk menambahkan data kesatuan baru</p>
        </div>
      </div>
    </main>
  );
}

export default Kesatuan;
