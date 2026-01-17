**PROJENİN AMACI**

Bu proje, HBO Max Türkiye Veri Analitiği ve İçerik Stratejisi Birimi bünyesinde görev yapan yöneticilere, platformdaki içerik ve kullanıcı verilerini analiz ederek veri temelli karar desteği sunmak amacıyla geliştirilmiştir. Sistem, kullanıcı davranışlarını, içerik performansını ve dönemsel trendleri değerlendirerek stratejik ve taktiksel kararlar için yöneticilere rehberlik etmeyi hedeflemektedir.

**SENARYO**

Platformda yer alan kullanıcı profilleri, izleme davranışları, içerik türleri ve dönemsel trendler analiz edilerek KPI’lar ve grafikler oluşturulmaktadır. Yöneticiler, bu veriler ışığında içerik yatırımlarını hangi türlere yönlendireceklerini, hangi kullanıcı segmentlerinin platformdan ayrılma riski taşıdığını ve dönemsel olarak hangi içeriklerin daha fazla ilgi gördüğünü belirleyebilir. Sistem, 6–12 aylık dönemleri kapsayan veri temelli içerik ve kullanıcı stratejileri geliştirilmesine imkân tanımaktadır.

**KURULUM**

1) Node.js ve MySQL bilgisayara kurulur.

2) Proje dosyaları indirilir ve proje klasörüne girilir.

3) Gerekli paketler npm install komutu ile yüklenir.

4) MySQL üzerinde veritabanı ve tablolar oluşturulur.

5) Veritabanı bağlantı ayarları yapılandırılır (.env dosyası kullanılarak).

6) Sunucu npm start komutu ile başlatılır ve dashboard paneli tarayıcı üzerinden erişilebilir hâle gelir.

**KULLANILAN TEKNOLOJİLER**

- Node.js
- Express.js
- MySQL
- JavaScript
- HTML / CSS
- Chart.js
- Leaflet.js

**İŞ KURALLARI**

**1) Veri ve dönem kısıtlaması:**
Sistem yalnızca mevcut 3 yıllık izleme ve etkileşim verilerini analiz eder. Bu dönem dışındaki veriler seçildiğinde KPI ve grafikler üretilmez.

**2) KPI ve grafik hesaplama kuralı:**
Ana panelde ve seasonality grafikleri için tüm içeriklerin ilgili dönemlerdeki izlenme ve beğeni verileri toplanarak hesaplanır. Bu sayede trend ve performans görselleştirmeleri doğru şekilde sunulur.

**3) İçerik ve dönem eşleştirme kuralı:**
Seçilen içerik veya dönem için veriler yoksa ilgili grafik veya tablo boş gösterilir.

**4) Veri bütünlüğü ve güncellik kuralı:**
Yeni kullanıcı, içerik veya izleme verileri eklendiğinde sistem analizleri otomatik olarak günceller; böylece KPI ve trendler her zaman güncel kalır.

**5) Grafik ve panel kullanımı zorunluluğu:**
Dashboard panelinde içerik tipine göre dağılım, izlenme ve beğeni trendleri, dönemsel analizler ve harita görselleştirmeleri minimum bir içerik seçilmeden gösterilemez.

**API ENDPOİNTLERİ**

- GET /api/analiz/kpi – Ana paneldeki KPI değerlerini getirir (toplam içerik, izlenme, beğeni vb.)
- GET /api/analiz/icerik-tipi-dagilim – İçerik türüne göre dağılımı gösterir (bar/pasta grafikleri için)
- GET /api/analiz/izlenme-trend – İçeriklerin izlenme trendini döndürür (seasonality grafikleri için)
- GET /api/analiz/begeni-trend – İçeriklerin beğeni trendini döndürür (seasonality veya performans grafikleri)
- GET /api/analiz/etkileşim-haritasi – İçerik bazlı etkileşim yoğunluğunu harita üzerinde gösterir

- POST /api/analiz/kpi – Yeni KPI değeri ekler
- POST /api/analiz/icerik-tipi-dagilim – Yeni içerik tipi dağılım verisi ekler
- POST /api/analiz/izlenme-trend – Yeni izlenme trend verisi ekler
- POST /api/analiz/begeni-trend – Yeni beğeni trend verisi ekler
- POST /api/analiz/etkileşim-haritasi – Yeni harita verisi ekler

- PUT /api/analiz/kpi – Mevcut KPI değerini günceller
- PUT /api/analiz/icerik-tipi-dagilim – Mevcut içerik tipi dağılımını günceller
- PUT /api/analiz/izlenme-trend – Mevcut izlenme trendini günceller
- PUT /api/analiz/begeni-trend – Mevcut beğeni trendini günceller
- PUT /api/analiz/etkileşim-haritasi – Mevcut harita verisini günceller

- DELETE /api/analiz/kpi – KPI değerini siler
- DELETE /api/analiz/icerik-tipi-dagilim – İçerik tipi dağılımını siler
- DELETE /api/analiz/izlenme-trend – İzlenme trend verisini siler
- DELETE /api/analiz/begeni-trend – Beğeni trend verisini siler
- DELETE /api/analiz/etkileşim-haritasi – Harita verisini siler

**ER DİYAGRAMI**

<img width="1572" height="551" alt="kds_er_diyagramı" src="https://github.com/user-attachments/assets/2cbef92b-14c3-4d2a-89ab-f2fa52436326" />








