import React, { useState } from 'react';
import { 
  Shield, 
  PlusCircle, 
  List, 
  FileText, 
  Users, 
  LogOut,
  Printer,
  TriangleAlert,
  X,
  Lock,
  BookOpen,
  Trash2
} from 'lucide-react';
import './index.css';
import kaliberList from './kaliber_list.json';
import mainLogo from './assets/images/image.png';
import backgroundImageUrl from './assets/images/background.png';
import { weaponsDataStore } from './data.js';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginPassword, setLoginPassword] = useState('');
  
  const [activeTab, setActiveTab] = useState('pengisian');
  const [verifiedKesatuan, setVerifiedKesatuan] = useState('');
  const [printingKesatuan, setPrintingKesatuan] = useState(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [selectedVerifyKesatuan, setSelectedVerifyKesatuan] = useState('');

  const [weaponsData, setWeaponsData] = useState(weaponsDataStore || []);

  const updateAndSaveWeaponsData = (newData) => {
    setWeaponsData(newData);
    fetch('/api/saveData', {
      method: 'POST',
      body: JSON.stringify(newData)
    }).catch(err => console.error("Error saving data:", err));
  };

  const [formData, setFormData] = useState({
    top: '',
    jenis: '',
    kaliber: '',
    spesifikasi: '',
    nomor: '',
    kondisi: 'B',
    sucad: ''
  });

  const handleAddWeapon = () => {
    if (!formData.spesifikasi || !formData.nomor) {
      alert("Mohon isi Spesifikasi dan Nomor Senjata!");
      return;
    }
    const newWeapon = {
      id: Date.now(),
      jenisBesar: formData.jenis,
      kaliber: formData.kaliber,
      jenis: formData.spesifikasi,
      nomor: formData.nomor,
      kondisi: formData.kondisi,
      top: formData.top,
      sucad: (formData.kondisi === 'RR' || formData.kondisi === 'RB' || formData.kondisi === 'LL') ? formData.sucad : '-',
      kesatuan: verifiedKesatuan,
      ket: ''
    };
    updateAndSaveWeaponsData([...weaponsData, newWeapon]);
    alert('Data berhasil ditambahkan!');
    setFormData({ ...formData, nomor: '', spesifikasi: '', kondisi: 'B', sucad: '', kaliber: '' });
  };

  const jenisSenjataList = [
    "PISTOL ISYARAT", "PISTOL", "SENAPAN", "TP", "GLM", "DMR", "SO", 
    "SMS", "SMB", "SPR", "SLT", "MO 60/CO", "MO 81/120", "MERIAM", "CANON"
  ];
  
  const kesatuanList = [
    "BRIGIF-1/JS", "YONIF 201/JY", "YONIF 202/TM", "YONIF 203/AK", "BRIGIF TP/44", "YONIF TP/843", "YONIF TP/899", "YONIF TP/942"
  ];

  const handleLogin = () => {
    if (loginPassword === '123456') {
      setIsAuthenticated(true);
      setLoginPassword('');
    } else {
      alert('Password salah! (Hint: 123456)');
    }
  };

  const handleDeleteWeapon = (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus data senjata ini?")) {
      updateAndSaveWeaponsData(weaponsData.filter(w => w.id !== id));
    }
  };

  const handlePrintKesatuan = (kesatuan) => {
    setPrintingKesatuan(kesatuan);
    setTimeout(() => {
      window.print();
      setTimeout(() => {
        setPrintingKesatuan(null);
      }, 500);
    }, 100);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setActiveTab('profil');
    setVerifiedKesatuan('');
  };

  if (!isAuthenticated) {
    return (
      <div 
        className="login-container"
        style={{ 
          backgroundImage: `url(${backgroundImageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="login-card">
          <div className="login-icon-wrapper" style={{ padding: 0, backgroundColor: 'transparent', boxShadow: 'none' }}>
            <img src={mainLogo} alt="Logo Paldam Jaya" style={{ width: '80px', height: 'auto' }} />
          </div>
          <h1 className="login-title">Sistem Informasi Materiil</h1>
          <h2 className="login-subtitle">PALDAM JAYA</h2>
          
          <div className="login-form">
            <div className="login-form-group">
              <label>Password Akses</label>
              <div className="login-input-wrapper">
                <Lock size={18} className="login-input-icon" />
                <input 
                  type="password" 
                  className="login-input" 
                  placeholder="Masukkan Password..." 
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleLogin();
                  }}
                />
              </div>
            </div>
            <button className="btn-login" onClick={handleLogin}>
              Masuk Sistem
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="brand-icon" style={{ padding: 0, backgroundColor: 'transparent', boxShadow: 'none' }}>
            <img src={mainLogo} alt="Logo" style={{ width: '32px', height: 'auto' }} />
          </div>
          <div className="brand-text">
            <span className="brand-title">DATA MATERIIL</span>
            <span className="brand-subtitle">PALDAM JAYA</span>
          </div>
        </div>

        <nav className="sidebar-menu">
          <button 
            className={`menu-item ${activeTab === 'profil' ? 'active' : ''}`}
            onClick={() => setActiveTab('profil')}
          >
            <Shield size={18} />
            <span>Profil Paldam</span>
          </button>
          
          <button 
            className={`menu-item ${activeTab === 'pengisian' ? 'active' : ''}`}
            onClick={() => setActiveTab('pengisian')}
          >
            <PlusCircle size={18} />
            <span>Halaman Pengisian</span>
          </button>

          <div className="menu-section">LAPORAN & DATA</div>

          <button 
            className={`menu-item ${activeTab === 'jenis' ? 'active' : ''}`}
            onClick={() => setActiveTab('jenis')}
          >
            <List size={18} />
            <span>Data Per Jenis Senjata</span>
          </button>

          <button 
            className={`menu-item ${activeTab === 'rekap' ? 'active' : ''}`}
            onClick={() => setActiveTab('rekap')}
          >
            <FileText size={18} />
            <span>Rekap Per Kesatuan</span>
          </button>

          <button 
            className={`menu-item ${activeTab === 'nomor' ? 'active' : ''}`}
            onClick={() => setActiveTab('nomor')}
          >
            <Users size={18} />
            <span>No. Senjata Per Kesatuan</span>
          </button>

          <button 
            className={`menu-item ${activeTab === 'rawatan' ? 'active' : ''}`}
            onClick={() => setActiveTab('rawatan')}
          >
            <BookOpen size={18} />
            <span>Rekapjat Rawatan Paldam Jaya</span>
          </button>
          
          <button 
            className={`menu-item ${activeTab === 'kondisi' ? 'active' : ''}`}
            onClick={() => setActiveTab('kondisi')}
          >
            <TriangleAlert size={18} />
            <span>Data Kondisi Senjata</span>
          </button>
        </nav>

        <div className="sidebar-footer">
          <button className="logout-button" onClick={handleLogout}>
            <LogOut size={18} />
            <span>Keluar</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {activeTab === 'profil' && (
          <div className="welcome-card">
            <div className="welcome-header">
              <div className="welcome-icon" style={{ padding: 0, backgroundColor: 'transparent', boxShadow: 'none' }}>
                <img src={mainLogo} alt="Logo" style={{ width: '48px', height: 'auto' }} />
              </div>
              <div className="welcome-text">
                <h1>Selamat Datang</h1>
                <p>Sistem Informasi Data Materiil Senjata Areal Service Paldam Jaya</p>
              </div>
            </div>

            <div className="summary-cards">
              <div className="summary-card">
                <span className="summary-title">Total Senjata</span>
                <span className="summary-value value-green">{weaponsData.length}</span>
              </div>
              
              <div className="summary-card">
                <span className="summary-title">Total Kesatuan</span>
                <span className="summary-value value-blue">{[...new Set(weaponsData.map(w => w.kesatuan))].length}</span>
              </div>
              
              <div className="summary-card">
                <span className="summary-title">Perlu Perbaikan (RR/RB)</span>
                <span className="summary-value value-red">{weaponsData.filter(w => w.kondisi === 'RR' || w.kondisi === 'RB').length}</span>
              </div>
            </div>

            <div style={{ marginTop: '32px' }}>
              <img 
                src={backgroundImageUrl} 
                alt="Profil Paldam" 
                style={{ width: '100%', height: 'auto', borderRadius: '12px', objectFit: 'cover' }} 
              />
            </div>
          </div>
        )}

        {activeTab === 'pengisian' && (
          <>
            {!verifiedKesatuan ? (
              <div className="welcome-card" style={{ position: 'relative' }}>
                <div className="panel-header" style={{ marginBottom: 0 }}>
                  <h2 className="panel-title">Pilih Kesatuan Untuk Pengisian Data</h2>
                </div>
                <p style={{ color: '#64748b', marginTop: '8px' }}>Silakan pilih satuan yang ingin diinput datanya, verifikasi kode khusus diperlukan untuk melanjutkan.</p>

                <div className="kesatuan-selection-grid">
                  {kesatuanList.map(k => (
                    <button 
                      key={k} 
                      className="kesatuan-card-btn"
                      onClick={() => {
                        setSelectedVerifyKesatuan(k);
                        // Show modal by directly rendering it with state
                        setVerificationCode('');
                        document.body.classList.add('modal-open'); 
                        // Using a simple local state variable inside component is better, but since it's missing let's add it or rely on a truthy selectedVerifyKesatuan
                        // Wait, I didn't add showVerifyModal state to App yet.
                        // I will use selectedVerifyKesatuan as the trigger for the modal.
                      }}
                    >
                      <Shield size={32} strokeWidth={2} />
                      <span>{k}</span>
                    </button>
                  ))}
                </div>

                {selectedVerifyKesatuan && (
                  <div className="modal-overlay">
                    <div className="modal-content verify-modal">
                      <div className="modal-header">
                        <h2 className="modal-title">Verifikasi Kesatuan</h2>
                        <button className="modal-close" onClick={() => setSelectedVerifyKesatuan('')}>
                          <X size={20} />
                        </button>
                      </div>
                      <div className="modal-body">
                        <div className="form-group">
                          <label>Pilih Kesatuan <span>*</span></label>
                          <select className="form-control" value={selectedVerifyKesatuan} onChange={(e) => setSelectedVerifyKesatuan(e.target.value)}>
                            <option value="">-- Pilih Kesatuan --</option>
                            {kesatuanList.map(k => <option key={k} value={k}>{k}</option>)}
                          </select>
                        </div>
                        <div className="form-group">
                          <label>Kode Verifikasi <span>*</span></label>
                          <input 
                            type="password" 
                            className="form-control" 
                            placeholder="Masukkan kode khusus..." 
                            value={verificationCode} 
                            onChange={(e) => setVerificationCode(e.target.value)} 
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                if(selectedVerifyKesatuan && verificationCode) {
                                  setVerifiedKesatuan(selectedVerifyKesatuan);
                                  setSelectedVerifyKesatuan('');
                                  setVerificationCode('');
                                } else {
                                  alert("Harap pilih kesatuan dan masukkan kode verifikasi!");
                                }
                              }
                            }}
                          />
                        </div>
                        <button 
                          className="btn-submit-form" 
                          style={{ width: '100%', justifyContent: 'center', marginTop: '8px' }} 
                          onClick={() => {
                            if(selectedVerifyKesatuan && verificationCode) {
                              setVerifiedKesatuan(selectedVerifyKesatuan);
                              setSelectedVerifyKesatuan('');
                              setVerificationCode('');
                            } else {
                              alert("Harap pilih kesatuan dan masukkan kode verifikasi!");
                            }
                          }}
                        >
                          Verifikasi & Masuk
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="input-page-container">
                <div className="form-header-bar">
                  <PlusCircle size={20} />
                  <h2>Halaman Pengisian Data Senjata</h2>
                </div>
                <div className="form-body-content">
                  <div className="warning-banner">
                    <TriangleAlert size={20} strokeWidth={2.5} />
                    <span>PERHATIAN: Sebelum input nomor, mohon cek kembali penulisan nomor senjata. Sesuaikan dengan nomor yang ada fisik senjata.</span>
                  </div>

                  <div className="input-grid-form">
                    <div className="form-group">
                      <label>Kesatuan</label>
                      <select className="form-control" disabled value={verifiedKesatuan}>
                        <option value={verifiedKesatuan}>{verifiedKesatuan}</option>
                      </select>
                    </div>
                    <div></div>

                    <div className="form-group">
                      <label>Jenis Senjata</label>
                      <select className="form-control" value={formData.jenis} onChange={e => setFormData({...formData, jenis: e.target.value})}>
                        <option value="">-- Pilih Jenis --</option>
                        {jenisSenjataList.map(j => <option key={j} value={j}>{j}</option>)}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>TOP (Jumlah)</label>
                      <input type="number" className="form-control" placeholder="Contoh: 120" value={formData.top} onChange={e => setFormData({...formData, top: e.target.value})} />
                    </div>

                    <div className="form-group">
                      <label>Tipe Senjata</label>
                      <select className="form-control" value={formData.spesifikasi} onChange={e => setFormData({...formData, spesifikasi: e.target.value})}>
                        <option value="">-- Pilih Tipe Senjata --</option>
                        {kaliberList.map((k, idx) => <option key={idx} value={k}>{k}</option>)}
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Nomor Senjata</label>
                      <input type="text" className="form-control" placeholder="Contoh: 69.1234" value={formData.nomor} onChange={e => setFormData({...formData, nomor: e.target.value})} />
                    </div>

                    <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                      <label>Kondisi</label>
                      <div className="radio-group">
                        <label className="radio-label">
                          <input type="radio" name="kondisi" value="B" checked={formData.kondisi === 'B'} onChange={e => setFormData({...formData, kondisi: e.target.value})} /> B (Baik)
                        </label>
                        <label className="radio-label">
                          <input type="radio" name="kondisi" value="RR" checked={formData.kondisi === 'RR'} onChange={e => setFormData({...formData, kondisi: e.target.value})} /> RR (Rusak Ringan)
                        </label>
                        <label className="radio-label">
                          <input type="radio" name="kondisi" value="RB" checked={formData.kondisi === 'RB'} onChange={e => setFormData({...formData, kondisi: e.target.value})} /> RB (Rusak Berat)
                        </label>
                        <label className="radio-label">
                          <input type="radio" name="kondisi" value="LL" checked={formData.kondisi === 'LL'} onChange={e => setFormData({...formData, kondisi: e.target.value})} /> LL (Lain-Lain)
                        </label>
                      </div>
                    </div>
                    
                    {(formData.kondisi === 'RR' || formData.kondisi === 'RB' || formData.kondisi === 'LL') && (
                      <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                        <label>Kebutuhan Sucad (Suku Cadang)</label>
                        <textarea 
                          className="form-control" 
                          rows="3" 
                          placeholder="Contoh: Pena Pukul, Pegas Pengembali..." 
                          value={formData.sucad}
                          onChange={e => setFormData({...formData, sucad: e.target.value})}
                        ></textarea>
                      </div>
                    )}
                  </div>

                  <button className="btn-submit-form" onClick={handleAddWeapon}>
                    <PlusCircle size={18} />
                    Tambah Data Senjata
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {activeTab === 'jenis' && (
          <div className="welcome-card">
            <div className="panel-header">
              <h2 className="panel-title">Data Senjata Sesuai Jenis</h2>
              <button className="btn-print" onClick={() => window.print()}>
                <Printer size={18} />
                <span>Cetak</span>
              </button>
            </div>

            <div className="data-table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th rowSpan="2" style={{ width: '50px', textAlign: 'center' }}>NO</th>
                    <th rowSpan="2">JENIS SENJATA</th>
                    <th rowSpan="2">NOMOR SENJATA</th>
                    <th colSpan="4" style={{ textAlign: 'center', backgroundColor: '#e2e8f0' }}>KONDISI</th>
                    <th rowSpan="2">KEB. SUCAD</th>
                    <th rowSpan="2">KESATUAN</th>
                    <th rowSpan="2">KET</th>
                  </tr>
                  <tr className="kondisi-group">
                    <th style={{ backgroundColor: '#f8fafc' }}>B</th>
                    <th style={{ backgroundColor: '#f8fafc' }}>RR</th>
                    <th style={{ backgroundColor: '#f8fafc' }}>RB</th>
                    <th style={{ backgroundColor: '#f8fafc' }}>LL</th>
                  </tr>
                </thead>
                <tbody>
                  {weaponsData.length === 0 ? (
                    <tr><td colSpan="10" className="text-center" style={{ padding: '20px' }}>Belum ada data senjata. Silakan tambahkan melalui Halaman Pengisian.</td></tr>
                  ) : (
                    [...weaponsData].sort((a,b) => (a.jenisBesar || '').localeCompare(b.jenisBesar || '') || (a.jenis || '').localeCompare(b.jenis || '')).map((weapon, index) => (
                      <tr key={weapon.id}>
                        <td className="text-center">{index + 1}</td>
                        <td style={{ textTransform: 'uppercase' }}>{weapon.jenis}</td>
                        <td>{weapon.nomor}</td>
                        <td className="text-center kondisi-b">{weapon.kondisi === 'B' ? '1' : ''}</td>
                        <td className="text-center kondisi-rr">{weapon.kondisi === 'RR' ? '1' : ''}</td>
                        <td className="text-center kondisi-rb">{weapon.kondisi === 'RB' ? '1' : ''}</td>
                        <td className="text-center kondisi-ll">{weapon.kondisi === 'LL' ? '1' : ''}</td>
                        <td>
                          {weapon.sucad.includes('\n') ? (
                            weapon.sucad.split('\n').map((line, i, arr) => (
                              <div key={i} style={i < arr.length - 1 ? { paddingBottom: '4px', borderBottom: '1px solid #e5e7eb', marginBottom: '4px' } : {}}>
                                {line}
                              </div>
                            ))
                          ) : weapon.sucad}
                        </td>
                        <td>{weapon.kesatuan}</td>
                        <td>{weapon.ket}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'rekap' && (
          <div className="welcome-card" style={{ backgroundColor: '#ffffff' }}>
            <div className="panel-header">
              <h2 className="panel-title">Data Rekap Per Kesatuan</h2>
            </div>

            {kesatuanList.map(kesatuan => {
              const kesatuanWeapons = weaponsData.filter(w => w.kesatuan === kesatuan);

              const groupedByJenisBesar = kesatuanWeapons.reduce((acc, w) => {
                const jb = w.jenisBesar || 'LAIN-LAIN';
                if (!acc[jb]) acc[jb] = [];
                acc[jb].push(w);
                return acc;
              }, {});

              let noUrut = 1;

              return (
                <div key={kesatuan} className={`section-container ${printingKesatuan && printingKesatuan !== kesatuan ? 'print-hidden' : ''}`}>
                  <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h3 className="section-title">DATA SENJATA SESUAI DENGAN KESATUAN</h3>
                      <h4 className="section-subtitle">DATA SENJATA SATUAN : {kesatuan}</h4>
                    </div>
                    {verifiedKesatuan === kesatuan && (
                      <button className="btn-print" onClick={() => handlePrintKesatuan(kesatuan)}>
                        <Printer size={18} />
                        <span>Cetak</span>
                      </button>
                    )}
                  </div>

                  <div className="data-table-container">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th rowSpan="2" style={{ width: '50px', textAlign: 'center' }}>NO</th>
                          <th rowSpan="2">JENIS MATERIIL</th>
                          <th rowSpan="2" style={{ textAlign: 'center' }}>TOP</th>
                          <th rowSpan="2" style={{ textAlign: 'center', width: '80px' }}>JUMLAH<br/>NYATA</th>
                          <th colSpan="4" style={{ textAlign: 'center', backgroundColor: '#e2e8f0' }}>KONDISI</th>
                          <th rowSpan="2" style={{ textAlign: 'center' }}>KURANG</th>
                          <th rowSpan="2" style={{ textAlign: 'center' }}>LEBIH</th>
                          <th rowSpan="2">KET</th>
                        </tr>
                        <tr className="kondisi-group">
                          <th style={{ backgroundColor: '#f8fafc', width: '40px' }}>B</th>
                          <th style={{ backgroundColor: '#f8fafc', width: '40px' }}>RR</th>
                          <th style={{ backgroundColor: '#f8fafc', width: '40px' }}>RB</th>
                          <th style={{ backgroundColor: '#f8fafc', width: '40px' }}>LL</th>
                        </tr>
                      </thead>
                      <tbody>
                        {kesatuanWeapons.length === 0 ? (
                          <tr><td colSpan="11" className="text-center" style={{ padding: '20px' }}>Belum ada data senjata.</td></tr>
                        ) : Object.entries(groupedByJenisBesar).map(([jenisBesar, weaponsInJenisBesar]) => {
                          const groupedByJenis = weaponsInJenisBesar.reduce((acc, w) => {
                            if (!acc[w.jenis]) acc[w.jenis] = [];
                            acc[w.jenis].push(w);
                            return acc;
                          }, {});

                          const grandNyata = weaponsInJenisBesar.length;
                          const grandB = weaponsInJenisBesar.filter(w => w.kondisi === 'B').length;
                          const grandRR = weaponsInJenisBesar.filter(w => w.kondisi === 'RR').length;
                          const grandRB = weaponsInJenisBesar.filter(w => w.kondisi === 'RB').length;
                          const grandLL = weaponsInJenisBesar.filter(w => w.kondisi === 'LL').length;
                          
                          const grandTop = parseInt(weaponsInJenisBesar.find(w => w.top)?.top || 0);
                          const jenisRows = [];
                          
                          Object.entries(groupedByJenis).forEach(([jenis, weaponsInJenis]) => {
                            const nyata = weaponsInJenis.length;
                            const b = weaponsInJenis.filter(w => w.kondisi === 'B').length;
                            const rr = weaponsInJenis.filter(w => w.kondisi === 'RR').length;
                            const rb = weaponsInJenis.filter(w => w.kondisi === 'RB').length;
                            const ll = weaponsInJenis.filter(w => w.kondisi === 'LL').length;
                            
                            jenisRows.push(
                              <tr key={jenis}>
                                <td></td>
                                <td className="sub-row-title">{jenis}</td>
                                <td className="text-center">-</td>
                                <td className="text-center">{nyata || ''}</td>
                                <td className="text-center kondisi-b">{b || ''}</td>
                                <td className="text-center kondisi-rr">{rr || ''}</td>
                                <td className="text-center kondisi-rb">{rb || ''}</td>
                                <td className="text-center kondisi-ll">{ll || ''}</td>
                                <td></td>
                                <td></td>
                                <td></td>
                              </tr>
                            );
                          });

                          const grandKurang = grandTop > grandNyata ? grandTop - grandNyata : 0;
                          const grandLebih = grandNyata > grandTop ? grandNyata - grandTop : 0;

                          return (
                            <React.Fragment key={jenisBesar}>
                              <tr className="group-row">
                                <td className="text-center">{noUrut++}</td>
                                <td>{jenisBesar}</td>
                                <td className="text-center">{grandTop || ''}</td>
                                <td className="text-center">{grandNyata || ''}</td>
                                <td className="text-center kondisi-b">{grandB || ''}</td>
                                <td className="text-center kondisi-rr">{grandRR || ''}</td>
                                <td className="text-center kondisi-rb">{grandRB || ''}</td>
                                <td className="text-center kondisi-ll">{grandLL || ''}</td>
                                <td className="text-center text-red">{grandKurang || ''}</td>
                                <td className="text-center text-blue">{grandLebih || ''}</td>
                                <td></td>
                              </tr>
                              {jenisRows}
                            </React.Fragment>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'nomor' && (
          <div className="welcome-card" style={{ backgroundColor: '#ffffff' }}>
            <div className="panel-header">
              <h2 className="panel-title">Data Nomor Senjata Per Kesatuan</h2>
            </div>

            {kesatuanList.map(kesatuan => {
              const kesatuanWeapons = weaponsData.filter(w => w.kesatuan === kesatuan);
              
              return (
                <div key={kesatuan} className={`section-container ${printingKesatuan && printingKesatuan !== kesatuan ? 'print-hidden' : ''}`}>
                  <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h3 className="section-title">DATA NOMOR SENJATA PER KESATUAN</h3>
                      <h4 className="section-subtitle">DATA SENJATA SATUAN : {kesatuan}</h4>
                    </div>
                    {verifiedKesatuan === kesatuan && (
                      <button className="btn-print" onClick={() => handlePrintKesatuan(kesatuan)}>
                        <Printer size={18} />
                        <span>Cetak</span>
                      </button>
                    )}
                  </div>

                  <div className="data-table-container">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th rowSpan="2" style={{ width: '50px', textAlign: 'center' }}>NO</th>
                          <th rowSpan="2">JENIS SENJATA</th>
                          <th rowSpan="2">NOMOR SENJATA</th>
                          <th colSpan="4" style={{ textAlign: 'center', backgroundColor: '#e2e8f0' }}>KONDISI</th>
                          <th rowSpan="2">KEB SUCAD</th>
                          <th rowSpan="2">KESATUAN</th>
                          <th rowSpan="2">KET</th>
                          <th rowSpan="2" style={{ width: '60px', textAlign: 'center' }}>AKSI</th>
                        </tr>
                        <tr className="kondisi-group">
                          <th style={{ backgroundColor: '#f8fafc', width: '40px' }}>B</th>
                          <th style={{ backgroundColor: '#f8fafc', width: '40px' }}>RR</th>
                          <th style={{ backgroundColor: '#f8fafc', width: '40px' }}>RB</th>
                          <th style={{ backgroundColor: '#f8fafc', width: '40px' }}>LL</th>
                        </tr>
                      </thead>
                      <tbody>
                        {kesatuanWeapons.length === 0 ? (
                          <tr><td colSpan="11" className="text-center" style={{ padding: '20px' }}>Belum ada data senjata.</td></tr>
                        ) : kesatuanWeapons.map((weapon, index) => (
                          <tr key={weapon.id}>
                            <td className="text-center">{index + 1}</td>
                            <td style={{ textTransform: 'uppercase' }}>{weapon.jenis}</td>
                            <td>{weapon.nomor}</td>
                            <td className="text-center kondisi-b">{weapon.kondisi === 'B' ? '1' : ''}</td>
                            <td className="text-center kondisi-rr">{weapon.kondisi === 'RR' ? '1' : ''}</td>
                            <td className="text-center kondisi-rb">{weapon.kondisi === 'RB' ? '1' : ''}</td>
                            <td className="text-center kondisi-ll">{weapon.kondisi === 'LL' ? '1' : ''}</td>
                            <td>
                              {weapon.sucad.includes('\n') ? (
                                weapon.sucad.split('\n').map((line, i, arr) => (
                                  <div key={i} style={i < arr.length - 1 ? { paddingBottom: '4px', borderBottom: '1px solid #e5e7eb', marginBottom: '4px' } : {}}>
                                    {line}
                                  </div>
                                ))
                              ) : weapon.sucad}
                            </td>
                            <td>{weapon.kesatuan}</td>
                            <td>{weapon.ket}</td>
                            <td className="text-center">
                              {verifiedKesatuan === weapon.kesatuan && (
                                <button 
                                  onClick={() => handleDeleteWeapon(weapon.id)}
                                  style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px' }}
                                  title="Hapus Data"
                                >
                                  <Trash2 size={16} />
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })}
            
          </div>
        )}

        {activeTab === 'rawatan' && (
          <div className="welcome-card" style={{ backgroundColor: '#ffffff' }}>
            <div className="panel-header">
              <h2 className="panel-title">REKAPJAT RAWATAN PALDAM JAYA</h2>
              <button className="btn-print" onClick={() => window.print()}>
                <Printer size={18} />
                <span>Cetak</span>
              </button>
            </div>

            <div className="section-container">
              <div className="section-header">
                <h3 className="section-title">REKAPITULASI SENJATA RAWATAN</h3>
                <h4 className="section-subtitle">PALDAM JAYA</h4>
              </div>

              <div className="data-table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th rowSpan="2" style={{ width: '40px', textAlign: 'center' }}>NO</th>
                      <th rowSpan="2" style={{ textAlign: 'center' }}>JENIS MATERIIL</th>
                      <th rowSpan="2" style={{ textAlign: 'center', width: '80px' }}>JUMLAH<br/>NYATA</th>
                      <th colSpan="4" style={{ textAlign: 'center', backgroundColor: '#e2e8f0' }}>KONDISI</th>
                      <th rowSpan="2" style={{ textAlign: 'center' }}>KET</th>
                    </tr>
                    <tr className="kondisi-group">
                      <th style={{ backgroundColor: '#f8fafc', width: '35px' }}>B</th>
                      <th style={{ backgroundColor: '#f8fafc', width: '35px' }}>RR</th>
                      <th style={{ backgroundColor: '#f8fafc', width: '35px' }}>RB</th>
                      <th style={{ backgroundColor: '#f8fafc', width: '35px' }}>LL</th>
                    </tr>
                    <tr style={{ backgroundColor: '#f1f5f9', textAlign: 'center', fontWeight: 'bold' }}>
                      <td>1</td>
                      <td>2</td>
                      <td>3</td>
                      <td>4</td>
                      <td>5</td>
                      <td>6</td>
                      <td>7</td>
                      <td>8</td>
                    </tr>
                  </thead>
                  <tbody>
                    {weaponsData.length === 0 ? (
                      <tr><td colSpan="8" className="text-center" style={{ padding: '20px' }}>Belum ada data senjata.</td></tr>
                    ) : (() => {
                      const groupedByJenisBesar = weaponsData.reduce((acc, w) => {
                        const jb = w.jenisBesar || 'LAIN-LAIN';
                        if (!acc[jb]) acc[jb] = {};
                        
                        const type = w.jenis || 'Tanpa Spesifikasi';
                        if (!acc[jb][type]) acc[jb][type] = [];
                        
                        acc[jb][type].push(w);
                        return acc;
                      }, {});

                      let totalGrandNyata = 0;
                      let totalGrandB = 0;
                      let totalGrandRR = 0;
                      let totalGrandRB = 0;
                      let totalGrandLL = 0;

                      const letterIndexToChar = (index) => String.fromCharCode(65 + (index % 26));

                      let jbIndex = 0;

                      return (
                        <>
                          {Object.entries(groupedByJenisBesar).map(([jenisBesar, typesGroup]) => {
                            const currentJBIndex = jbIndex++;
                            const jbLetter = letterIndexToChar(currentJBIndex);
                            
                            let jbNyata = 0;
                            let jbB = 0;
                            let jbRR = 0;
                            let jbRB = 0;
                            let jbLL = 0;

                            const typeRows = Object.entries(typesGroup).map(([type, weaponsInType], tIndex) => {
                                const tNyata = weaponsInType.length;
                                const tB = weaponsInType.filter(w => w.kondisi === 'B').length;
                                const tRR = weaponsInType.filter(w => w.kondisi === 'RR').length;
                                const tRB = weaponsInType.filter(w => w.kondisi === 'RB').length;
                                const tLL = weaponsInType.filter(w => w.kondisi === 'LL').length;

                                jbNyata += tNyata;
                                jbB += tB;
                                jbRR += tRR;
                                jbRB += tRB;
                                jbLL += tLL;

                                return (
                                  <tr key={`type-${jenisBesar}-${type}`}>
                                    <td className="text-center">{tIndex + 1}</td>
                                    <td style={{ paddingLeft: '20px' }}>{type}</td>
                                    <td className="text-center">{tNyata || ''}</td>
                                    <td className="text-center kondisi-b">{tB || ''}</td>
                                    <td className="text-center kondisi-rr">{tRR || ''}</td>
                                    <td className="text-center kondisi-rb">{tRB || ''}</td>
                                    <td className="text-center kondisi-ll">{tLL || ''}</td>
                                    <td className="text-center"></td>
                                  </tr>
                                );
                            });

                            totalGrandNyata += jbNyata;
                            totalGrandB += jbB;
                            totalGrandRR += jbRR;
                            totalGrandRB += jbRB;
                            totalGrandLL += jbLL;

                            return (
                              <React.Fragment key={jenisBesar}>
                                <tr key={`jb-${jenisBesar}`} className="group-row" style={{ fontWeight: 'bold' }}>
                                  <td className="text-center">{jbLetter}</td>
                                  <td>{jenisBesar}</td>
                                  <td className="text-center">{jbNyata || ''}</td>
                                  <td className="text-center kondisi-b">{jbB || ''}</td>
                                  <td className="text-center kondisi-rr">{jbRR || ''}</td>
                                  <td className="text-center kondisi-rb">{jbRB || ''}</td>
                                  <td className="text-center kondisi-ll">{jbLL || ''}</td>
                                  <td className="text-center"></td>
                                </tr>
                                {typeRows}
                              </React.Fragment>
                            );
                          })}
                          
                          <tr style={{ fontWeight: 'bold', backgroundColor: '#f1f5f9' }}>
                            <td colSpan="2" className="text-center">JUMLAH KESELURUHAN</td>
                            <td className="text-center">{totalGrandNyata || ''}</td>
                            <td className="text-center kondisi-b">{totalGrandB || ''}</td>
                            <td className="text-center kondisi-rr">{totalGrandRR || ''}</td>
                            <td className="text-center kondisi-rb">{totalGrandRB || ''}</td>
                            <td className="text-center kondisi-ll">{totalGrandLL || ''}</td>
                            <td></td>
                          </tr>
                        </>
                      );
                    })()}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'kondisi' && (
          <div className="welcome-card" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 80px)', overflow: 'hidden', padding: '32px' }}>
            <div className="panel-header">
              <h2 className="panel-title">Data Kondisi Senjata (RR, RB, LL)</h2>
            </div>
            
            <div className="state-cards-container" style={{ flexGrow: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px', paddingRight: '8px', marginTop: '16px' }}>
               {weaponsData.filter(w => w.kondisi !== 'B').length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                    <p>Tidak ada data senjata dengan kondisi rusak atau lainnya saat ini.</p>
                  </div>
               ) : (
                  weaponsData.filter(w => w.kondisi !== 'B').map((w, idx) => (
                     <div key={idx} className={`state-card kondisi-${w.kondisi.toLowerCase()}`}>
                        <div className="state-card-header">
                           <span className="state-card-nomor">No. Senjata: {w.nomor}</span>
                           <span className="state-card-badge">Kondisi: {w.kondisi}</span>
                        </div>
                        <div className="state-card-body">
                           <p><strong>Jenis Senjata:</strong> {w.jenis}</p>
                           <p><strong>Kesatuan:</strong> {w.kesatuan}</p>
                           <p><strong>Keterangan:</strong> {w.sucad && w.sucad !== '-' ? w.sucad : (w.ket || '-')}</p>
                        </div>
                     </div>
                  ))
               )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
