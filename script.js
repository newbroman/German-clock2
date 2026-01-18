const APP_VERSION = "german-clock-v103"; // Increment this whenever you change your code
// 1. Global State
let hours = 12, minutes = 0, seconds = 0, isQuiz = false, isRevealed = true, currentLang = 'EN', showPh = true, showSec = false;
let isLive = true;

// 2. Data Sets (German)
const hNom = ["Mitternacht", "eins", "zwei", "drei", "vier", "fünf", "sechs", "sieben", "acht", "neun", "zehn", "elf", "zwölf", "dreizehn", "vierzehn", "fünfzehn", "sechzehn", "siebzehn", "achtzehn", "neunzehn", "zwanzig", "einundzwanzig", "zweiundzwanzig", "dreiundzwanzig"];

const hNomPh = ["mit-ter-nakht", "ayns", "tsway", "dray", "feer", "fuenf", "zeks", "zee-ben", "akht", "noyn", "tsayn", "elf", "tsveulf", "dray-tsayn", "feer-tsayn", "fuenf-tsayn", "zeks-tsayn", "zeeb-tsayn", "akht-tsayn", "noyn-tsayn", "tsvan-tsig", "ayn-unt-tsvan-tsig", "tsvay-unt-tsvan-tsig", "dray-unt-tsvan-tsig"];

const mAll = ["null", "eins", "zwei", "drei", "vier", "fünf", "sechs", "sieben", "acht", "neun", "zehn", "elf", "zwölf", "dreizehn", "vierzehn", "fünfzehn", "sechzehn", "siebzehn", "achtzehn", "neunzehn", "zwanzig", "einundzwanzig", "zweiundzwanzig", "dreiundzwanzig", "vierundzwanzig", "fünfundzwanzig", "sechsundzwanzig", "siebenundzwanzig", "achtundzwanzig", "neunundzwanzig", "dreißig", "einunddreißig", "zweiunddreißig", "dreiunddreißig", "vierunddreißig", "fünfunddreißig", "sechsunddreißig", "siebenunddreißig", "achtunddreißig", "neununddreißig", "vierzig", "einundvierzig", "zweiundvierzig", "dreiundvierzig", "vierundvierzig", "fünfundvierzig", "sechsundvierzig", "siebenundvierzig", "achtundvierzig", "neunundvierzig", "fünfzig", "einundfünfzig", "zweiundfünfzig", "dreiundfünfzig", "vierundfünfzig", "fünfundfünfzig", "sechsundfünfzig", "siebenundfünfzig", "achtundfünfzig", "neunundfünfzig"];

const mAllPh = ["null", "ayns", "tsway", "dray", "feer", "fuenf", "zeks", "zee-ben", "akht", "noyn", "tsayn", "elf", "tsveulf", "dray-tsayn", "feer-tsayn", "fuenf-tsayn", "zeks-tsayn", "zeeb-tsayn", "akht-tsayn", "noyn-tsayn", "tsvan-tsig", "ayn-unt-tsvan-tsig", "tsvay-unt-tsvan-tsig", "dray-unt-tsvan-tsig", "feer-unt-tsvan-tsig", "fuenf-unt-tsvan-tsig", "zeks-unt-tsvan-tsig", "zeeb-unt-tsvan-tsig", "akht-unt-tsvan-tsig", "noyn-unt-tsvan-tsig", "dray-sig", "ayn-unt-dray-sig", "tsvay-unt-dray-sig", "dray-unt-dray-sig", "feer-unt-dray-sig", "fuenf-unt-dray-sig", "zeks-unt-dray-sig", "zeeb-unt-dray-sig", "akht-unt-dray-sig", "noyn-unt-dray-sig", "feer-tsig", "ayn-unt-feer-tsig", "tsvay-unt-feer-tsig", "dray-unt-feer-tsig", "feer-unt-feer-tsig", "fuenf-unt-feer-tsig", "zeks-unt-feer-tsig", "zeeb-unt-feer-tsig", "akht-unt-feer-tsig", "noyn-unt-feer-tsig", "fuenf-tsig", "ayn-unt-fuenf-tsig", "tsvay-unt-fuenf-tsig", "dray-unt-fuenf-tsig", "feer-unt-fuenf-tsig", "fuenf-unt-fuenf-tsig", "zeks-unt-fuenf-tsig", "zeeb-unt-fuenf-tsig", "akht-unt-fuenf-tsig", "noyn-unt-fuenf-tsig"];
const dict = {

    EN: { title: "Say the Time in German", actual: "ACTUAL TIME", random: "RANDOM TIME", listen: "🔊 LISTEN", slow: "½ SPEED", ask: "How do you say?", reveal: "REVEAL", close: "Close Help", qOn: "Quiz: ON", qOff: "Quiz: OFF" },
    DE: { title: "Sag die Uhrzeit auf Deutsch", actual: "AKTUELL", random: "ZUFALL", listen: "🔊 HÖREN", slow: "½ TEMPO", ask: "Wie sagt man?", reveal: "ZEIGEN", close: "Schließen", qOn: "Quiz: AN", qOff: "Quiz: AUS" }
};

// Utility
const pad = (n) => n.toString().padStart(2, '0');

function init() {
    const c = document.getElementById('clock-container');
    // Clear old marks if any
    c.querySelectorAll('.mark').forEach(m => m.remove());

    for (let i = 0; i < 12; i++) {
        const m = document.createElement('div');
        m.className = 'mark';
        m.style.transform = `rotate(${i * 30}deg)`;
        m.style.transformOrigin = `1px 72.5px`; 
        c.appendChild(m);
    }

    // Force Casual Mode at startup [cite: 2026-01-17]
    const casualRadio = document.getElementById('casual');
    if (casualRadio) casualRadio.checked = true;

    // Set the time and initial draw
    setRealTime(); 
    
    // Start the clock interval
    setInterval(() => {
        if (isQuiz) return; 
        if (isLive) {
            const now = new Date();
            seconds = now.getSeconds();
            hours = now.getHours();
            minutes = now.getMinutes();
        } else {
            // Logic for manual/stopped clock progression if needed
        }
        updateDisplay(true);
    }, 1000);
}

function updateDisplay(syncInput) {
    // 1. Hands Alignment
    const hRotation = ((hours % 12) * 30) + (minutes * 0.5);
    const mRotation = minutes * 6;
    const sRotation = seconds * 6;

    document.getElementById('h-hand').style.transform = `rotate(${hRotation}deg)`;
    document.getElementById('m-hand').style.transform = `rotate(${mRotation}deg)`;
    const sHand = document.getElementById('s-hand');
    if (sHand) sHand.style.transform = `rotate(${sRotation}deg)`;

    const timeStr = `${pad(hours)}:${pad(minutes)}${showSec ? ':' + pad(seconds) : ''}`;
    if (syncInput) document.getElementById('time-input-display').value = timeStr;

    // 2. German Grammar Logic
    const isFormal = document.getElementById('formal').checked;
    let p = "", ph = "", e = "";
    
    // Seconds string (Green)
    let sStr = (showSec && seconds > 0) ? ` und <span class="second-text">${mAll[seconds]}</span> Sekunden` : "";
    let sPh = (showSec && seconds > 0) ? ` oont ${mAllPh[seconds]} ze-koon-den` : "";

    if (isFormal) {
        let mCard = minutes > 0 ? ` <span class="minute-text">${mAll[minutes]}</span>` : "";
        let mPh = minutes > 0 ? ` ${mAllPh[minutes]}` : "";
        
        p = `Es ist <span class="hour-text">${hNom[hours]}</span> Uhr${mCard}${sStr}`;
        ph = `es ist ${hNomPh[hours]} oor${mPh}${sPh}`;
    } else {
        let h12 = hours % 12;
        let nextH = (hours + 1) % 12 || 12;
        let displayH = h12 || 12;

        if (minutes === 0) {
            let spec = hours === 0 ? "Mitternacht" : hours === 12 ? "Mittag" : hNom[h12];
            let specPh = hours === 0 ? "mit-ter-nakht" : hours === 12 ? "mit-tahk" : hNomPh[h12];
            p = `Es ist <span class="hour-text">${spec}</span>${sStr}`;
            ph = `es ist ${specPh}${sPh}`;
        } else if (minutes <= 30) {
            if (minutes === 30) {
                p = `halb <span class="hour-text">${hNom[nextH]}</span>${sStr}`;
                ph = `halp ${hNomPh[nextH]}${sPh}`;
            } else {
                // Using 'fünfzehn' for 15 [cite: 2026-01-10]
                p = `<span class="minute-text">${mAll[minutes]}</span> nach <span class="hour-text">${hNom[displayH]}</span>${sStr}`;
                ph = `${mAllPh[minutes]} nakh ${hNomPh[displayH]}${sPh}`;
            }
        } else {
            let d = 60 - minutes;
            p = `<span class="minute-text">${mAll[d]}</span> vor <span class="hour-text">${hNom[nextH]}</span>${sStr}`;
            ph = `${mAllPh[d]} for ${hNomPh[nextH]}${sPh}`;
        }
    }

    // 3. UI Update
    const d = dict[currentLang];
    const pt = document.getElementById('lang-text'); 
    const pht = document.getElementById('phonetic-text');
    const et = document.getElementById('english-text');

    if (isQuiz && !isRevealed) {
        pt.innerText = d.ask; 
        pht.style.visibility = "hidden";
        et.style.visibility = "hidden";
    } else {
        pt.innerHTML = p; 
        pht.style.visibility = "visible";
        et.style.visibility = "visible";
        pht.innerText = showPh ? ph : ""; 
        et.innerText = e;
    }
}
function startDrag(e) {
    isLive = false;
    e.preventDefault();
    const clock = document.getElementById('clock-container');
    const move = (ev) => {
        const rect = clock.getBoundingClientRect();
        const cx = ev.touches ? ev.touches[0].clientX : ev.clientX;
        const cy = ev.touches ? ev.touches[0].clientY : ev.clientY;
        const x = cx - rect.left - rect.width / 2;
        const y = cy - rect.top - rect.height / 2;
        const angle = Math.atan2(y, x) * (180 / Math.PI) + 90;
        const norm = (angle < 0) ? angle + 360 : angle;
        const dist = Math.sqrt(x*x + y*y);

        if (dist < 35) {
            let newH = Math.round(norm / 30) % 12;
            if (hours >= 12) newH += 12;
            hours = newH;
        } else {
            minutes = Math.round(norm / 6) % 60;
        }
        updateDisplay(true);
    };
    const stop = () => {
        window.removeEventListener('mousemove', move);
        window.removeEventListener('touchmove', move);
        if (isQuiz) generateQuizOptions();
    };
    window.addEventListener('mousemove', move);
    window.addEventListener('touchmove', move);
    window.addEventListener('mouseup', stop, {once:true});
    window.addEventListener('touchend', stop, {once:true});
}

function setRealTime() {
    isLive = true; 
    const n = new Date();
    hours = n.getHours(); minutes = n.getMinutes(); seconds = n.getSeconds();
    isRevealed = !isQuiz;
    updateDisplay(true);
}

function rollTime() {
    isLive = false; 
    hours = Math.floor(Math.random() * 24);
    minutes = Math.floor(Math.random() * 60);
    seconds = 0;
    isRevealed = !isQuiz;
    updateDisplay(true);
    if (isQuiz) generateQuizOptions();
}

function speak(r) {
    window.speechSynthesis.cancel();
    let t = document.getElementById('lang-text').innerText;
    if (t.includes("?")) return;
    const m = new SpeechSynthesisUtterance(t);
    m.lang = 'de-DE'; 
    m.rate = r;
    window.speechSynthesis.speak(m);
}

function toggleSec() {
    showSec = !showSec;
    if (isQuiz) isRevealed = false; 
    document.getElementById('sec-toggle').innerText = showSec ? "Sec: ON" : "Sec: OFF";
    updateDisplay(true);
}

function togglePh() {
    showPh = !showPh;
    updateDisplay(true);
}

function toggleQuiz() {
    isQuiz = !isQuiz;
    const container = document.getElementById('quiz-options');
    if (isQuiz) {
        isRevealed = false; 
        generateQuizOptions();
        document.getElementById('quiz-toggle').innerText = dict[currentLang].qOn;
    } else {
        isRevealed = true; 
        container.style.display = "none";
        document.getElementById('quiz-toggle').innerText = dict[currentLang].qOff;
    }
    updateDisplay(true);
}

function generateQuizOptions() {
    const container = document.getElementById('quiz-options');
    const isFormal = document.getElementById('formal').checked;
    const correctAnswer = getCorrectStr(hours, minutes, isFormal);
    let options = [correctAnswer];
    while (options.length < 4) {
        let rH = Math.floor(Math.random() * 24);
        let rM = Math.floor(Math.random() * 60);
        let wrong = getCorrectStr(rH, rM, isFormal);
        if (!options.includes(wrong)) options.push(wrong);
    }
    options.sort(() => Math.random() - 0.5);
    container.innerHTML = "";
    container.style.display = "grid";
    options.forEach(opt => {
        const btn = document.createElement('button');
        btn.innerHTML = opt;
        btn.onclick = () => {
            if (opt === correctAnswer) {
                btn.style.background = "#28a745"; btn.style.color = "white";
                setTimeout(() => { isRevealed = true; updateDisplay(true); container.style.display="none"; }, 500);
            } else {
                btn.style.background = "#dc3545"; btn.style.color = "white"; btn.disabled = true;
            }
        };
        container.appendChild(btn);
    });
}

function getCorrectStr(h, m, formal) {
    if (formal) {
        let mStr = m === 0 ? "" : mAll[m];
        // Blue for Hour, Red for Minute
        let mCard = m > 0 ? ` <span class="minute-text">${mStr}</span>` : "";
        return `Es ist <span class="hour-text">${hNom[h]}</span> Uhr${mCard}`.trim();
    } else {
        let h12 = h % 12;
        let nextH = (h + 1) % 12 || 12;
        let displayH = h12 || 12;

        if (m === 0) {
            let spec = h === 0 ? "Mitternacht" : h === 12 ? "Mittag" : hNom[displayH];
            return `Es ist <span class="hour-text">${spec}</span>`;
        }
        if (m < 30) {
            // Using Red for minutes and Blue for hours
            return `<span class="minute-text">${mAll[m]}</span> nach <span class="hour-text">${hNom[displayH]}</span>`;
        }
        if (m === 30) {
            // Half uses the NEXT hour (Blue)
            return `halb <span class="hour-text">${hNom[nextH]}</span>`;
        }
        // "Vor" logic (Red for remaining minutes, Blue for next hour)
        return `<span class="minute-text">${mAll[60-m]}</span> vor <span class="hour-text">${hNom[nextH]}</span>`;
    }
}

function manualTime(val) {
    isLive = false; // Stop auto-syncing with system time
    
    // Remove anything that isn't a number
    let digits = val.replace(/\D/g, '');
    
    // Logic for "HH:MM" (e.g., 1405 or 205)
    if (digits.length >= 3) {
        let h = parseInt(digits.slice(0, digits.length - 2));
        let m = parseInt(digits.slice(-2));
        
        if (h >= 0 && h < 24 && m >= 0 && m < 60) {
            hours = h;
            minutes = m;
            // Update hands and text, but don't force-sync the input box 
            // so the user can keep typing.
            updateDisplay(false); 
        }
    }
}

async function toggleHelp() {
    const modal = document.getElementById('help-modal');
    const helpContent = document.getElementById('help-content');
    
    if (modal.style.display === 'block') {
        modal.style.display = 'none';
        return;
    }

    const helpFile = currentLang === 'DE' ? 'help_de.html' : 'help_en.html';
    
    try {
        const response = await fetch(helpFile);
        const html = await response.text();
        
        // Injecting the Close Button and Title directly into the black box
        helpContent.innerHTML = `
            <button class="close-help-btn" onclick="toggleHelp()">Close ✕</button>
            <h2 style="text-align:center; margin-top:0; padding-top:10px;">Guide / Anleitung</h2>
            ${html}
        `;
        
        modal.style.display = 'block';
    } catch (err) {
        console.error("Help load error:", err);
    }
}

function toggleLang() {
    currentLang = (currentLang === 'EN' ? 'DE' : 'EN');
    if (isQuiz) isRevealed = false; 
    const d = dict[currentLang];
    document.getElementById('app-title').innerText = d.title;
    document.getElementById('btn-real').innerText = d.actual;
    document.getElementById('btn-random').innerText = d.random;
    document.getElementById('btn-listen').innerText = d.listen;
    document.getElementById('btn-slow').innerText = d.slow;
    document.getElementById('quiz-toggle').innerText = isQuiz ? d.qOn : d.qOff;
    updateDisplay(true);
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // Note the leading slash and the exact repository name
    navigator.serviceWorker.register('/German-clock2/sw.js')
      .then(registration => {
        console.log('Service Worker registered with scope:', registration.scope);
      })
      .catch(error => {
        console.error('Service Worker registration failed:', error);
      });
  });
}
