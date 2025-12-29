document.addEventListener("DOMContentLoaded", () => {

  /* ================= 1. THEME (TEMA AYARLARI) ================= */
  const body = document.body;
  const themeToggle = document.getElementById("themeToggle");

  if(themeToggle) themeToggle.innerHTML = `<span class="prompt">$</span> theme --dark`;

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const isLight = body.classList.toggle("light");
      themeToggle.innerHTML =
        `<span class="prompt">$</span> theme --${isLight ? "light" : "dark"}`;
    });
  }

  /* ================= 2. PROJE GEÇİŞ SİSTEMİ ================= */
  const projectFiles = document.querySelectorAll(".file-tree .file");
  const projectBlocks = document.querySelectorAll(".code-block");
  const tabNameElement = document.getElementById("tab-name");

  projectFiles.forEach(file => {
    file.addEventListener("click", () => {
      projectFiles.forEach(f => f.classList.remove("active"));
      file.classList.add("active");

      if(tabNameElement) {
        tabNameElement.textContent = file.textContent.trim();
      }

      const targetId = file.getAttribute("data-target");
      projectBlocks.forEach(block => {
        if(block.id === targetId) {
          block.classList.add("active");
        } else {
          block.classList.remove("active");
        }
      });

      updateEditorVisuals();
    });
  });

  /* ================= 3. DUAL ASCII MORPH ENGINE ================= */
  // VERİ 1: LOGOLAR
  const asciiIcons = {
    delphi: [
      "            ************** ",
      "        ********************** ",
      "      *************++==+******** ",
      "    **********=::*:....+*:..:=*###    ",
      "   *********:...-=....+*......=####   ",
      "  *******+.+:...+....+=.....*#######  ",
      " *******=..--..:+..:*-...:########### ",
      "*******++...-:-........:*#############",
      "******=.:=.:-.:.........:=:###########",
      "******+...+.-.........=....*##########",
      "******..+:--:......-:......-##########",
      "******...:.+....:=.....::-+###########",
      "******-:-=--:...-+####################",
      " *****+===+.+.....-.-################ ",
      "  *****:...*:...:..-..:#############  ",
      "   ******####--....:=...*##########   ",
      "    ***#####=.......*-...*########    ",
      "      ################:.:#######      ",
      "        ######################        ",
      "            ##############            "
    ],
    python: [
      "            ************** ",
      "          ****************** ",
      "         **** ************** ",
      "         ******************** ",
      "         ******************** ",
      "   **************************::::::-  ",
      " ****************************:::::::: ",
      "*****************************:::::::::",
      "**************************** :::::::::",
      "************************** ::::::::::",
      "*********** ::::::::::::::::::::::::::",
      "**********:::::::::::::::::::::::::::-",
      "*********::::::::::::::::::::::::::::-",
      " ********:::::::::::::::::::::::::::- ",
      "  *******:::::::::::::::::::::::::-   ",
      "         :::::::::::::::::::-         ",
      "         :::::::::::::::::::-         ",
      "         ::::::::::::::  -::-         ",
      "          :::::::::::::::::-          ",
      "            -:::::::::::--            "
    ],
    csharp: [
      "                +====+                ",
      "            ++==========++            ",
      "         ++=================+         ",
      "      +=========-:::::-========+      ",
      "   +========:.          ..========+   ",
      "  ========.                 -====+@@  ",
      "  ======:       ......       :*@@@@@  ",
      "  =====-      .========:. :*@@@@@@@@  ",
      "  =====      :=========+#@@@-@+=@@@@  ",
      "  ====-     .=======*@@@@@++:+--+@@@  ",
      "  ====-     .===+#@@@@@@@@==.=::=@@@  ",
      "  =====      :@@@@@@@@@@@@@@-@+=@@@@  ",
      "  =====-      .#@@@@@@@-. .+@@@@@@@@  ",
      "  ====+#=       ..::..       :@@@@@@  ",
      "  =+@@@@@#.                 *@@@@@@@  ",
      "   @@@@@@@@@:.          ..#@@@@@@@@   ",
      "      @@@@@@@@@#+-::-=#@@@@@@@@@      ",
      "         @@@@@@@@@@@@@@@@@@@@         ",
      "            @@@@@@@@@@@@@@            ",
      "                @@@@@@                "
    ],
    java: [
      "                                      ",
      "                      *               ",
      "                      #*              ",
      "                     *#               ",
      "                   *##                ",
      "                 ###  *#*             ",
      "               ###  ##*               ",
      "              ##* ###                 ",
      "               #* ###*                ",
      "                #* *##                ",
      "                  +  ##               ",
      "         *** + **** +*                ",
      "           +*+******+         **      ",
      "           ****++++*****+   ***       ",
      "                *****                 ",
      "            ************              ",
      "      ***+                    +       ",
      "      *********************** ++      ",
      "           +++***************+        ",
      "                                      "
    ],
    javascript: [
      "::::::::::::::::::::::::::::::::::::::",
      "::::::::::::::::::::::::::::::::::::::",
      "::::::::::::::::::::::::::::::::::::::",
      "::::::::::::::::::::::::::::::::::::::",
      "::::::::::::::::::::::::::::::::::::::",
      "::::::::::::::::::::::::::::::::::::::",
      "::::::::::::::::-@@@@::::+@@@@@@@=::::",
      "::::::::::::::::-@@@@:::%@@@@%@@@@*:::",
      "::::::::::::::::-@@@@::-@@@#:::-::::::",
      "::::::::::::::::-@@@@:::%@@@@*-:::::::",
      "::::::::::::::::-@@@@::::+@@@@@@@+::::",
      "::::::::::::::::-@@@@:::::::=%@@@@@=::",
      "::::::::::::::::-@@@@::::::::::-@@@%::",
      "::::::::::=@@*::=@@@%::*@@@=:::+@@@%::",
      "::::::::::*@@@@@@@@%:::-%@@@@@@@@@%:::",
      "::::::::::::=+##*+-:::::::=+###*=:::::",
      "::::::::::::::::::::::::::::::::::::::"
    ],
    html: [
      "  ++++++++++++++++++++++++++++++++++  ",
      "  ++++++++++++++++++++++++++++++++++  ",
      "  ++++++++++++++++++++++++++++++++++  ",
      "   ++++++++++++++++++++++++++++++++   ",
      "   +++++=....................=+++++   ",
      "   ++++++....................++++++   ",
      "   ++++++....++++++++++++++++++++++   ",
      "   ++++++:...=+++++++++++++++++++++   ",
      "   ++++++-..................-+++++=   ",
      "   =+++++-.........     ....-+++++=   ",
      "    +++++++++++++++=====.. .=+++++    ",
      "    ++++++==-=++++++++++.  .=+++++    ",
      "    ++++++....+++++++++=. ..++++++    ",
      "    ++++++....::-+++=-:.. .:++++++    ",
      "     +++++-..........    ..-++++++    ",
      "     +++++++++-........:=+++++++++    ",
      "     ++++++++++++++++++++++++++++     ",
      "     ++++++++++++++++++++++++++++     ",
      "       ++++++++++++++++++++++++       ",
      "              ++++++++++              "
    ],
    css: [
      "  ++++++++++++++++++++++++++++++++++  ",
      "  +++++++++++++++++==============+++  ",
      "  =++++++++++++++++==============+++  ",
      "  =++++++==========----------====++=  ",
      "   +++++=............       .-===++   ",
      "   +++++=.................  .-==+++   ",
      "   ++++++++++++++++=====-. ..===+++   ",
      "   ++++++++++++++++=====:. ..===+++   ",
      "   ++++++-................. :===+++   ",
      "   =+++++-.........    ...  :===+++   ",
      "   =++++++=========-----..  :===++=   ",
      "    ++++++----+++++=====.. .-==+++    ",
      "    ++++++....=++++=====. ..-==+++    ",
      "    =+++++:...::-=+=-:... ..===+++    ",
      "    =+++++-......... ..   .:===++=    ",
      "     ++++++++=-........:-======+++    ",
      "     ++++++++++++++===========++++    ",
      "     ++++++++++++++========++++++     ",
      "       ++++++++++++=+++++++++++=      ",
      "              ==++++++==              "
    ],
    mcu: [
      "                                      ",
      "          @@@@@@@@@                   ",
      "          @@@@@@@@@                   ",
      "          @@@@@@@@@    @@@            ",
      "          @@@@@@@@@   @@@@            ",
      "          @@@@@@@@@@@      @@@@@@@@   ",
      "          @@@@@@@@@@@ @@@@ @@@@@@@@   ",
      "          @@@@@@@    @@@@@   @@@@@@   ",
      " @@@@@@@@@@@@@@@@    @@@@    @@@@@@   ",
      "  @@@@@@@@@@@@@@@@@@ @@@@ @@@@@@@@@@@ ",
      "    @@@@@@@@@@@@@@@ @@@@@ @@@@@@@@@@@ ",
      "     @@@@@@@@@@@@@@ @@@@ @@@@@@@@@@@@ ",
      "      @@@@@@@@@@@@@      @@@@@@@@@@   ",
      "       @@@@    @@@@       @@@@@@      ",
      "                @@@@@@@@@@@@@         ",
      "                  @@@@@@@@@@          ",
      "                  @@@@@@@@@           ",
      "                    @@@@@@@           ",
      "                      @@@@@@          ",
      "                                      "
    ]
  };

  // VERİ 2: İSİMLER (ASCII TEXT)
  const asciiNames = {
    delphi: [
      "    ____  _____ _     ____  _   _ ___   ",
      "   |  _ \\| ____| |   |  _ \\| | | |_ _|  ",
      "   | | | |  _| | |   | |_) | |_| || |   ",
      "   | |_| | |___| |___|  __/|  _  || |   ",
      "   |____/|_____|_____|_|   |_| |_|___|  "
    ],
    python: [
      "  ______   _______  _   _  ___  _   _   ",
      " |  _ \\ \\ / /_   _|| | | |/ _ \\| \\ | |  ",
      " | |_) \\ V /  | |  | |_| | | | |  \\| |  ",
      " |  __/ | |   | |  |  _  | |_| | |\\  |  ",
      " |_|    |_|   |_|  |_| |_|\\___/|_| \\_|  "
    ],
    csharp: [
      "         ____     _  _                  ",
      "        / ___|  _| || |_                ",
      "       | |     |_  ..  _|               ",
      "       | |___  |_      _|               ",
      "        \\____|   |_||_|                 "
    ],
    java: [
      "     _    ___    __     __    ___     ",
      "    | |  / \\ \\   \\ \\   / /   / \\ \\   ",
      " _  | | / _ \\ \\   \\ \\ / /   / _ \\ \\  ",
      "| |_| |/ ___ \\ \\   \\ V /   / ___ \\ \\ ",
      " \\___//_/   \\_\\_\\   \\_/   /_/   \\_\\_\\ "
    ],
    javascript: [
        "               _ _____                  ",
        "              | / ____|                 ",
        "              | | (___                  ",
        "          _   | |\\___ \\               ",
        "          | |__| |___) |                ",
        "           \\____/_____/                "
      ],
    html: [
      "      _   _ _____ __  __ _              ",
      "     | | | |_   _|  \\/  | |             ",
      "     | |_| | | | | |\\/| | |             ",
      "     |  _  | | | | |  | | |___          ",
      "     |_| |_| |_| |_|  |_|_____|         "
    ],
    css: [
      "         ____ ____  ____                ",
      "        / ___/ ___|/ ___|               ",
      "       | |   \\___ \\\\___ \\               ",
      "       | |___ ___) |___) |              ",
      "        \\____|____/|____/               "
    ],
    mcu: [
      "        __  __  ____ _   _              ",
      "       |  \\/  |/ ___| | | |             ",
      "       | |\\/| | |   | | | |             ",
      "       | |  | | |___| |_| |             ",
      "       |_|  |_|\\____|\\___/              "
    ]
  };

  const density = " █░▒▓#*+=-:.@_\\|/()[]{}V";
  const wrapperEl = document.querySelector(".ascii-wrapper");
  
  if (wrapperEl) { // Ascii wrapper varsa çalıştır
      const keys = Object.keys(asciiIcons); 
  
      class AsciiAnimator {
      constructor(elementId) {
          this.element = document.getElementById(elementId);
          this.currentLines = [];
          this.targetLines = [];
          this.frame = 0;
          this.totalFrames = 50;
          this.interval = null;
      }
  
      init(initialLines) {
          if(!this.element) return;
          this.currentLines = this.normalize(initialLines);
          this.render(this.currentLines);
      }
  
      normalize(lines) {
          const w = Math.max(...lines.map(l => l.length));
          return lines.map(l => l.padEnd(w, " "));
      }
  
      render(lines) {
          if (this.element) this.element.textContent = lines.join("\n");
      }
  
      dIndex(c) {
          const i = density.indexOf(c);
          return i === -1 ? density.length - 1 : i;
      }
  
      morph(newLines) {
          if (this.interval) clearInterval(this.interval);
          if (!this.element) return;
  
          const target = this.normalize(newLines);
          const current = this.currentLines;
  
          const h = Math.max(current.length, target.length);
          const w = Math.max(
          ...current.map(l => l.length),
          ...target.map(l => l.length)
          );
  
          const delay = Array.from({ length: h }, () =>
          Array.from({ length: w }, () => Math.random() * 0.4)
          );
  
          this.frame = 0;
  
          this.interval = setInterval(() => {
          const t = this.frame / this.totalFrames;
  
          const out = Array.from({ length: h }, (_, y) =>
              Array.from({ length: w }, (_, x) => {
              const from = current[y]?.[x] ?? " ";
              const to   = target[y]?.[x] ?? " ";
  
              const diFrom = this.dIndex(from);
              const diTo   = this.dIndex(to);
              
              const localT = Math.min(1, Math.max(0, (t - delay[y][x]) / 0.4));
  
              if (from === to) {
                  const breathe = Math.sin((t + delay[y][x]) * Math.PI * 2);
                  const offset = Math.round(breathe * 0.5); 
                  return density[Math.max(0, Math.min(density.length - 1, diFrom + offset))];
              }
  
              const d = Math.round(diFrom + (diTo - diFrom) * localT);
              return density[Math.max(0, Math.min(density.length - 1, d))];
              }).join("")
          );
  
          this.render(out);
          this.frame++;
  
          if (this.frame > this.totalFrames) {
              clearInterval(this.interval);
              this.currentLines = target;
          }
          }, 25);
      }
      }
  
      const iconAnimator = new AsciiAnimator("ascii-icon");
      const textAnimator = new AsciiAnimator("ascii-text");
  
      let currentIndex = 0;
      let mainInterval;
  
      iconAnimator.init(asciiIcons[keys[currentIndex]]);
      textAnimator.init(asciiNames[keys[currentIndex]]);
  
      function nextSkill() {
      currentIndex = (currentIndex + 1) % keys.length;
      const key = keys[currentIndex];
      iconAnimator.morph(asciiIcons[key]);
      textAnimator.morph(asciiNames[key]);
      }
  
      function startRotation() {
      if (mainInterval) return;
      mainInterval = setInterval(nextSkill, 3000);
      }
  
      startRotation();
  }

});

/* ================= 4. İLETİŞİM FORMU (AJAX) ================= */
const contactForm = document.getElementById("contact-form");
const formStatus = document.getElementById("form-status");

if (contactForm) {
contactForm.addEventListener("submit", async function(event) {
  event.preventDefault();

  const data = new FormData(contactForm);
  formStatus.innerHTML = '<span class="prompt">>></span> <span class="comment">Sending packets... please wait...</span>';

  try {
    const response = await fetch(contactForm.action, {
      method: contactForm.method,
      body: data,
      headers: {
          'Accept': 'application/json'
      }
    });

    if (response.ok) {
      formStatus.innerHTML = `
        <div style="margin-top:10px; color: var(--accent);">
          <span class="prompt">[SUCCESS]</span> 200 OK<br>
          <span class="prompt">>></span> Mesajınız başarıyla iletildi! Teşekkürler.
        </div>
      `;
      contactForm.reset();
    } else {
      const jsonData = await response.json();
      let errorMsg = "Bilinmeyen bir hata oluştu.";
      if (jsonData.errors) {
          errorMsg = jsonData.errors.map(error => error.message).join(", ");
      }
      formStatus.innerHTML = `
        <div style="margin-top:10px; color: #ff5f56;">
          <span class="prompt">[ERROR]</span> 400 Bad Request<br>
          <span class="prompt">>></span> ${errorMsg}
        </div>
      `;
    }
  } catch (error) {
    formStatus.innerHTML = `
      <div style="margin-top:10px; color: #ff5f56;">
        <span class="prompt">[ERROR]</span> Connection Failed<br>
        <span class="prompt">>></span> Sunucuya ulaşılamadı. Lütfen internetinizi kontrol edin.
      </div>
    `;
  }
});
}

/* ================= 5. SCROLL TO TOP BUTONU ================= */
document.addEventListener("DOMContentLoaded", () => {
const scrollTopBtn = document.getElementById("scrollTopBtn");

if (scrollTopBtn) {
  window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
      scrollTopBtn.classList.add("show");
    } else {
      scrollTopBtn.classList.remove("show");
    }
  });

  scrollTopBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });
}
});


/* ========================================= */
/* MERKEZİ SİSTEM YÖNETİCİSİ (FOOTER + SLIDER SENKRONİZE) */
/* ========================================= */

const sysTrack = document.getElementById('sys-track');
const sysDots = document.querySelectorAll('.s-dot');
const cpuBars = document.querySelectorAll('.bar-col');
let sysIndex = 0;

// 1. SLIDER OTOMATİK GEÇİŞ (Loop)
function nextSysSlide() {
// Eğer elementler yoksa hata verme
if(!sysTrack) return;

sysIndex = (sysIndex + 1) % 3; // 3 Ekran var (CPU, RAM, PING)

sysTrack.style.transform = `translateX(-${sysIndex * 100}%)`;

sysDots.forEach(dot => dot.classList.remove('active'));
if(sysDots[sysIndex]) sysDots[sysIndex].classList.add('active');
}

// 4 saniyede bir ekran değişsin
if(sysTrack) {
  setInterval(nextSysSlide, 4000);
}


// 2. VERİ GÜNCELLEME (Hem Footer Hem Slider Aynı Veriyi Kullanır)
function updateSystemData() {

// --- CPU HESAPLAMA ---
const cpu = Math.floor(Math.random() * 30) + 5; // %5 - %35 arası

// Footer'a Yaz
const fCpu = document.getElementById('cpu-usage');
if(fCpu) fCpu.innerText = cpu;

// Slider'a Yaz
const sCpu = document.getElementById('cpu-val-slider');
if(sCpu) sCpu.innerText = cpu;

// Slider Çubuklarını Oynat (Görsel Efekt)
if(cpuBars.length > 0) {
    cpuBars.forEach(bar => {
      const h = Math.min(100, Math.max(10, cpu * 2 + (Math.random() * 40 - 20)));
      bar.style.height = `${h}%`;
    });
}

// --- RAM HESAPLAMA ---
let currentRam = parseInt(document.getElementById('ram-usage')?.innerText || 400);
const change = Math.floor(Math.random() * 20) - 10;
let newRam = currentRam + change;
if (newRam < 300) newRam = 300;
if (newRam > 900) newRam = 900;

// Footer'a Yaz
const fRam = document.getElementById('ram-usage');
if(fRam) fRam.innerText = newRam;

// Slider'a Yaz
const sRamText = document.getElementById('ram-val-slider');
const sRamBar = document.getElementById('ram-bar');

if(sRamText) sRamText.innerText = newRam;
if(sRamBar) {
  const percentage = (newRam / 1024) * 100;
  sRamBar.style.width = `${percentage}%`;
}

// --- PING HESAPLAMA ---
const ping = Math.floor(Math.random() * 60) + 20;

// Footer'a Yaz
const fPing = document.getElementById('ping');
if(fPing) fPing.innerText = ping;

// Slider'a Yaz
const sPing = document.getElementById('ping-val-slider');
if(sPing) sPing.innerText = ping;
}

// Sistemi her 2 saniyede bir güncelle
setInterval(updateSystemData, 2000);
// İlk açılışta hemen çalıştır
document.addEventListener("DOMContentLoaded", updateSystemData);


/* ========================================= */
/* BAŞLAT MENÜSÜ TIKLAMA KONTROLÜ      */
/* ========================================= */

document.addEventListener("DOMContentLoaded", () => {
  const startBtn = document.querySelector('.start-btn-trigger');
  const startMenu = document.querySelector('.start-popup');

  if(startBtn && startMenu) {
      // 1. Butona tıklayınca aç/kapa
      startBtn.addEventListener('click', function(e) {
          e.stopPropagation();
          startMenu.classList.toggle('show');
      });

      // 2. Menü içindeki linklere tıklayınca menüyü kapat
      const menuLinks = startMenu.querySelectorAll('a');
      menuLinks.forEach(link => {
          link.addEventListener('click', () => {
              startMenu.classList.remove('show');
          });
      });

      // 3. Sayfanın herhangi bir yerine tıklayınca menüyü kapat
      document.addEventListener('click', function(e) {
          if (!startMenu.contains(e.target) && !startBtn.contains(e.target)) {
              startMenu.classList.remove('show');
          }
      });
  }
});


/* ========================================= */
/* CANLI SCROLL VE MOUSE TAKİBİ (Ln, Col)    */
/* ========================================= */

// 1. SCROLL OLAYI: Sayfayı kaydırdıkça 'Ln' (Satır) artsın
window.addEventListener('scroll', () => {
let totalHeight = document.body.scrollHeight - window.innerHeight;
let progress = window.scrollY;
const totalCodeLines = 1200; 

let currentLine = Math.floor((progress / totalHeight) * totalCodeLines) + 1;
// NaN olursa 1 yazsın
if(isNaN(currentLine)) currentLine = 1;

const lineEl = document.getElementById('line-num');
if (lineEl) lineEl.innerText = currentLine;
});


// 2. MOUSE OLAYI: Fareyi sağa-sola çektikçe 'Col' (Sütun) değişsin
window.addEventListener('mousemove', (e) => {
let screenWidth = window.innerWidth;
let mouseX = e.clientX;
const maxColumns = 120;

let currentCol = Math.floor((mouseX / screenWidth) * maxColumns) + 1;

const colEl = document.getElementById('col-num');
if (colEl) colEl.innerText = currentCol;
});

/* ========================================= */
/* MINI MUSIC PLAYER LOGIC                   */
/* ========================================= */

// Müzik Çubuğunu İlerlet
function updateMusicPlayer() {
  const bar = document.getElementById('music-bar');
  const timeDisplay = document.getElementById('curr-time');
  
  if(bar && timeDisplay) {
    // Rastgele değil, yavaşça ilerlesin
    // Mevcut genişliği al (yüzde olarak)
    let currentWidth = parseFloat(bar.style.width) || 0;
    
    // Arttır
    currentWidth += 0.5; // Her çalışmada %0.5 artır
    if(currentWidth > 100) currentWidth = 0; // Başa sar
    
    bar.style.width = `${currentWidth}%`;
    
    // Süreyi (Dakika:Saniye) simüle et
    // 3:45 toplam süre = 225 saniye. %1 = 2.25 saniye
    let totalSeconds = 225 * (currentWidth / 100);
    let min = Math.floor(totalSeconds / 60);
    let sec = Math.floor(totalSeconds % 60);
    if(sec < 10) sec = "0" + sec;
    
    timeDisplay.innerText = `${min}:${sec}`;
  }
}

// Her saniye güncelle
setInterval(updateMusicPlayer, 1000);

// Play/Pause Butonu
const ppBtn = document.getElementById('play-pause-btn');
if(ppBtn) {
  ppBtn.addEventListener('click', () => {
    if(ppBtn.classList.contains('fa-pause')) {
      ppBtn.classList.remove('fa-pause');
      ppBtn.classList.add('fa-play');
    } else {
      ppBtn.classList.remove('fa-play');
      ppBtn.classList.add('fa-pause');
    }
  });
}

/* ========================================= */
/* REAL WEATHER FETCH (GÜNCEL - DAHA KARARLI API) */
/* ========================================= */

// ... (Üstteki değişkenler ve weatherAscii objesi aynı kalabilir) ...

const wTemp = document.getElementById('w-temp');
const wDesc = document.getElementById('w-desc');
const wLoc = document.getElementById('w-loc');
const wWind = document.getElementById('w-wind');
const wHum = document.getElementById('w-hum'); 
const wAscii = document.getElementById('w-ascii');

const weatherAscii = {
  clear: `
     \\   /
      .-.
  -- (   ) --
      \`-’
     /   \\`,
  cloudy: `
      .--.
   .-(    ).
  (___.__)__)`,
  rain: `
      .--.
   .-(    ).
  (___.__)__)
   ‘ ‘ ‘ ‘`,
  snow: `
      .--.
   .-(    ).
  (___.__)__)
   * * * *`,
  thunder: `
      .--.
   .-(    ).
  (___.__)__)
   ⚡⚡⚡`
};

// 1. BAŞLAT
function initWeather() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (pos) => fetchWeather(pos.coords.latitude, pos.coords.longitude),
      (err) => loadDefaultWeather(),
      { timeout: 4000 } 
    );
  } else {
    loadDefaultWeather();
  }
}

// 2. Varsayılan Konum (Aksaray)
function loadDefaultWeather() {
  fetchWeather(38.3687, 34.0297, "Aksaray");
}

// 3. Verileri Çek
async function fetchWeather(lat, lon, manualCity = null) {
  try {
    // A) ŞEHİR İSMİNİ BUL (YENİ VE DAHA GÜÇLÜ API)
    let cityName = manualCity;
    
    if (!cityName) {
        try {
            // BigDataCloud API: Daha hızlı ve engellenme riski yok
            const cityRes = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=tr`);
            const cityData = await cityRes.json();
            
            // Şehir ismini yakalamak için farklı alanları kontrol et
            cityName = cityData.city || cityData.locality || cityData.principalSubdivision || "Konum Bulundu";
            
            // Bazen "Aksaray Merkez" gibi uzun gelebilir, sadeleştirebiliriz
            cityName = cityName.replace(" Merkez", "").replace(" Province", "");
            
        } catch (e) {
            // Yine de bulamazsa koordinat yaz (Çok düşük ihtimal)
            console.error("Şehir ismi alınamadı:", e);
            cityName = `${lat.toFixed(1)}, ${lon.toFixed(1)}`;
        }
    }

    // B) HAVA DURUMU VE NEMİ ÇEK
    const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m`);
    const weatherData = await weatherRes.json();
    
    // C) ARAYÜZÜ GÜNCELLE
    updateWeatherUI(weatherData.current, cityName);

  } catch (error) {
    console.error("Hava durumu hatası:", error);
    if(wDesc) wDesc.innerText = "Bağlantı Yok";
  }
}

// 4. Ekrana Bas
function updateWeatherUI(current, city) {
  if(!wTemp) return;

  wTemp.innerText = `${Math.round(current.temperature_2m)}°C`;
  wWind.innerText = `Rüzgar: ${current.wind_speed_10m} km/s`;
  wHum.innerText  = `Nem: %${current.relative_humidity_2m}`;
  wLoc.innerText = city; 

  const code = current.weather_code;
  
  // Varsayılan: Açık
  let condition = "Açık"; 
  let art = weatherAscii.clear;
  let color = "#facc15";

  if (code >= 1 && code <= 3) {
    condition = "Bulutlu"; art = weatherAscii.cloudy; color = "#9ca3af";
  } else if (code >= 45 && code <= 48) {
    condition = "Sisli"; art = weatherAscii.cloudy; color = "#6b7280";
  } else if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) {
    condition = "Yağmurlu"; art = weatherAscii.rain; color = "#60a5fa";
  } else if ((code >= 71 && code <= 77) || code >= 85) {
    condition = "Karlı"; art = weatherAscii.snow; color = "#e8eaed";
  } else if (code >= 95) {
    condition = "Fırtına"; art = weatherAscii.thunder; color = "#fbbf24";
  }

  wDesc.innerText = condition;
  wAscii.innerText = art;
  wAscii.style.color = color;
}

document.addEventListener("DOMContentLoaded", initWeather);

/* ========================================= */
/* KOD KOPYALAMA İŞLEVİ                      */
/* ========================================= */

document.addEventListener("DOMContentLoaded", () => {
  const copyBtns = document.querySelectorAll('.copy-btn');

  copyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // 1. Butonun içinde bulunduğu ana pencereyi (.code-window) bul
      const codeWindow = btn.closest('.code-window');
      
      // 2. O pencere içindeki kod metnini (.code-content pre) bul
      // Not: pre etiketi içindeki metni alıyoruz
      const codeBlock = codeWindow.querySelector('.code-content pre');

      if (codeBlock) {
        // 3. Metni al (innerText formatı korur)
        const codeText = codeBlock.innerText;

        // 4. Panoya kopyala (Clipboard API)
        navigator.clipboard.writeText(codeText).then(() => {
          
          // --- Görsel Geri Bildirim ---
          
          // Orijinal HTML'i (İkon + Yazı) saklamaya gerek yok, elle yazarız.
          // Geçici olarak değiştir:
          btn.innerHTML = '<i class="fa-solid fa-check"></i> <span class="btn-text">Kopyalandı!</span>';
          btn.classList.add('copied'); // İstersen CSS ile yeşil renk verebilirsin

          // 2 saniye sonra eski haline döndür
          setTimeout(() => {
            btn.innerHTML = '<i class="fa-regular fa-copy"></i> <span class="btn-text">Kopyala</span>';
            btn.classList.remove('copied');
          }, 2000);

        }).catch(err => {
          console.error('Kopyalama başarısız:', err);
          btn.innerHTML = '<i class="fa-solid fa-xmark"></i> <span class="btn-text">Hata</span>';
        });
      }
    });
  });
});

/* ========================================= */
/* TEXT EDITOR: SATIR NUMARALARI VE CURSOR   */
/* ========================================= */

function updateEditorVisuals() {
  const activeBlock = document.querySelector('.code-block.active');
  const numbersCol = document.getElementById('line-numbers');
  
  if (!activeBlock || !numbersCol) return;

  // 1. Satır Sayısını Hesapla
  // Kod içeriğindeki "yeni satır" (\n) karakterlerini sayıyoruz
  const codeText = activeBlock.innerText;
  // Satır sayısı = \n sayısı + 1
  const lineCount = codeText.split('\n').length;

  // 2. Numaraları Oluştur
  let numbersHtml = '';
  for (let i = 1; i <= lineCount; i++) {
    numbersHtml += `${i}<br>`;
  }
  numbersCol.innerHTML = numbersHtml;

  // 3. Cursor Ekle (Eğer yoksa)
  // Önce eski cursor'ları temizle (tekrar eklenmesin)
  const oldCursors = activeBlock.querySelectorAll('.code-cursor');
  oldCursors.forEach(c => c.remove());

  // Yeni cursor ekle
  const cursorSpan = document.createElement('span');
  cursorSpan.className = 'code-cursor';
  activeBlock.appendChild(cursorSpan);
}

// Sayfa yüklendiğinde çalıştır
document.addEventListener("DOMContentLoaded", updateEditorVisuals);

// Sekme (Tab) değiştiğinde de çalışması lazım
// Mevcut "click" event listener'ının içine bu fonksiyonu ekleyeceğiz.