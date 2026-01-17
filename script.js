// 1. Global State
let hours = 12, minutes = 0, seconds = 0, isQuiz = false, isRevealed = true, currentLang = 'EN', showPh = true, showSec = false;
let isLive = true;

// 2. Data Sets
const hNom = ["Mitternacht", "eins", "zwei", "drei", "vier", "fünf", "sechs", "sieben", "acht", "neun", "zehn", "elf", "Mittag", "dreizehn", "vierzehn", "fünfzehn", "sechzehn", "siebzehn", "achtzehn", "neunzehn", "zwanzig", "einundzwanzig", "zweiundzwanzig", "dreiundzwanzig"];
const hNomPh = ["mit-ter-nakht", "eyens", "tsvay", "dray", "feer", "fuenf", "zex", "zee-ben", "akht", "noyn", "tsayn", "elf", "mit-tahk", "dray-tsayn", "feer-tsayn", "fuenf-tsayn", "zex-tsayn", "zeeb-tsayn", "akh-tsayn", "noyn-tsayn", "tsvan-tsig", "eyen-oond-tsvan-tsig", "tsvay-oond-tsvan-tsig", "dray-oond-tsvan-tsig"];const hGen = ["północy", "pierwszej", "drugiej", "trzeciej", "czwartej", "piątej", "szóstej", "siódmej", "ósmej", "dziewiątej", "dziesiątej", "jedenastej", "południa", "trzynastej", "czternastej", "piętnastej", "szesnastej", "siedemnastej", "osiemnastej", "dziewiętnastej", "dwudziestej", "dwudziestej pierwszej", "dwudziestej drugiej", "dwudziestej trzeciej"];
const hCasual = ["zwölf", "eins", "zwei", "drei", "vier", "fünf", "sechs", "sieben", "acht", "neun", "zehn", "elf", "zwölf"];

const mAll = ["null", "eins", "zwei", "drei", "vier", "fünf", "sechs", "sieben", "acht", "neun", "zehn", "elf", "zwölf", "dreizehn", "vierzehn", "fünfzehn", "sechzehn", "siebzehn", "achtzehn", "neunzehn", "zwanzig", "einundzwanzig", "zweiundzwanzig", "dreiundzwanzig", "vierundzwanzig", "fünfundzwanzig", "sechsundzwanzig", "siebenundzwanzig", "achtundzwanzig", "neunundzwanzig", "dreißig", "einunddreißig", "zweiunddreißig", "dreiunddreißig", "vierunddreißig", "fünfunddreißig", "sechsunddreißig", "siebenunddreißig", "achtunddreißig", "neununddreißig", "vierzig", "einundvierzig", "zweiundvierzig", "dreiundvierzig", "vierundvierzig", "fünfundvierzig", "sechsundvierzig", "siebenundvierzig", "achtundvierzig", "neunundvierzig", "fünfzig", "einundfünfzig", "zweiundfünfzig", "dreiundfünfzig", "vierundfünfzig", "fünfundfünfzig", "sechsundfünfzig", "siebenundfünfzig", "achtundfünfzig", "neunundfünfzig"];
const mAllPh = ["null", "eyens", "tsvay", "dray", "feer", "fuenf", "zex", "zee-ben", "akht", "noyn", "tsayn", "elf", "tsveulf", "dray-tsayn", "feer-tsayn", "fuenf-tsayn", "zex-tsayn", "zeeb-tsayn", "akh-tsayn", "noyn-tsayn", "tsvan-tsig", "eyen-oond-tsvan-tsig", "tsvay-oond-tsvan-tsig", "dray-oond-tsvan-tsig", "feer-oond-tsvan-tsig", "fuenf-oond-tsvan-tsig", "zex-oond-tsvan-tsig", "zeeb-oond-tsvan-tsig", "akh-oond-tsvan-tsig", "noyn-oond-tsvan-tsig", "dry-sig", "eyen-oond-dry-sig", "tsvay-oond-dry-sig", "dray-oond-dry-sig", "feer-oond-dry-sig", "fuenf-oond-dry-sig", "zex-oond-dry-sig", "zeeb-oond-dry-sig", "akh-oond-dry-sig", "noyn-oond-dry-sig", "fiert-sig", "eyen-oond-fiert-sig", "tsvay-oond-fiert-sig", "dray-oond-fiert-sig", "feer-oond-fiert-sig", "fuenf-oond-fiert-sig", "zex-oond-fiert-sig", "zeeb-oond-fiert-sig", "akh-oond-fiert-sig", "noyn-oond-fiert-sig", "fuenf-tsig", "eyen-oond-fuenf-tsig", "tsvay-oond-fuenf-tsig", "dray-oond-fuenf-tsig", "feer-oond-fuenf-tsig", "fuenf-oond-fuenf-tsig", "zex-oond-fuenf-tsig", "zeeb-oond-fuenf-tsig", "akh-oond-fuenf-tsig", "noyn-oond-fuenf-tsig"];
const dict = {
    EN: { title: "Say the Time in German", actual: "ACTUAL TIME", random: "RANDOM TIME", listen: "🔊 LISTEN", slow: "½ SPEED", ask: "How do you say?", reveal: "REVEAL", close: "Close", qOn: "Quiz: ON", qOff: "Quiz: OFF" },
    DE: { title: "Sag die Uhrzeit auf Deutsch", actual: "AKTUELLER ZEITPUNKT", random: "ZUFÄLLIGE ZEIT", listen: "🔊 HÖREN", slow: "½ TEMPO", ask: "Wie sagt man das?", reveal: "ZEIGEN", close: "Schließen", qOn: "Quiz: AN", qOff: "Quiz: AUS" }
};

// Utility
const pad = (n) => n.toString().padStart(2, '0');

function init() {
    const c = document.getElementById('clock-container');
    c.querySelectorAll('.mark').forEach(m => m.remove());

    for (let i = 0; i < 12; i++) {
        const m = document.createElement('div');
        m.className = 'mark';
        m.style.transform = `rotate(${i * 30}deg)`;
        m.style.transformOrigin = `1px 72.5px`;
        c.appendChild(m);
    }

    setRealTime(); 
    
    setInterval(() => {
        if (isQuiz) return; // Stop everything during a quiz

        if (isLive) {
            // Standard Live Mode
            const now = new Date();
            seconds = now.getSeconds();
            hours = now.getHours();
            minutes = now.getMinutes();
        } else {
            // Manual Tick: Keep the clock moving from the user's set time
            seconds++;
            if (seconds >= 60) {
                seconds = 0;
                minutes++;
                if (minutes >= 60) {
                    minutes = 0;
                    hours = (hours + 1) % 24;
                }
            }
        }
        updateDisplay(true);
    }, 1000);
}

function updateDisplay(syncInput) {
    // 1. Hands & Digital Sync
    const hRotation = ((hours % 12) * 30) + (minutes * 0.5);
    const mRotation = minutes * 6;
    const sRotation = seconds * 6;

    document.getElementById('h-hand').style.transform = `rotate(${hRotation}deg)`;
    document.getElementById('m-hand').style.transform = `rotate(${mRotation}deg)`;
    const sHand = document.getElementById('s-hand');
    if (sHand) sHand.style.transform = `rotate(${sRotation}deg)`;

    const timeStr = `${pad(hours)}:${pad(minutes)}${showSec ? ':' + pad(seconds) : ''}`;
    if (syncInput) document.getElementById('time-input-display').value = timeStr;

    // 2. Text Logic
    const isFormal = document.getElementById('formal').checked;
    let p = "", ph = "", e = "";
    // Note: Minutes (cardinal-num) are always blue
    let sStr = (showSec && seconds > 0) ? ` i <span class="cardinal-num">${mAll[seconds]}</span> sekund` : "";

   if (isFormal) {
    let mStr = (minutes === 0) ? "Uhr" : `Uhr ${mAll[minutes]}`;
    p = `Es ist ${hNom[hours]} ${mStr}`;
    ph = `ess ist ${hNomPh[hours]} oor ${mAll[minutes]}`; // Phonetic
} else {
    let h12 = hours % 12;
    let nextH = (hours + 1) % 12 || 12;
    let displayH = h12 || 12;

    if (minutes === 0) {
        p = `Es ist ${hCasual[displayH]} Uhr`;
        e = hours === 0 ? "Midnight" : hours === 12 ? "Noon" : `${displayH} o'clock`;
    } else if (minutes < 30) {
        p = `Es ist ${mAll[minutes]} nach ${hCasual[displayH]}`;
        e = `${minutes} past ${displayH}`;
    } else if (minutes === 30) {
        p = `Es ist halb ${hCasual[nextH]}`; // Correct German: 4:30 is "half 5"
        e = `Half past ${displayH}`;
    } else {
        let d = 60 - minutes;
        p = `Es ist ${mAll[d]} vor ${hCasual[nextH]}`;
        e = `${d} to ${nextH}`;
    }
}

  // 3. UI Update (Strict Quiz Hiding with Visibility control)
    const d = dict[currentLang];
    const pt = document.getElementById('polish-text');
    const pht = document.getElementById('phonetic-text');
    const et = document.getElementById('english-text');

    if (isQuiz && !isRevealed) {
        pt.innerText = d.ask; 
        pht.style.visibility = "hidden"; // Hide completely
        et.style.visibility = "hidden"; // Hide completely
        pht.innerHTML = "&nbsp;"; 
        et.innerHTML = "&nbsp;"; 
    } else {
        pt.innerHTML = p; 
        pht.style.visibility = "visible"; // Show again
        et.style.visibility = "visible"; // Show again
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
    isLive = true; // Resume live updates
    const n = new Date();
    hours = n.getHours(); minutes = n.getMinutes(); seconds = n.getSeconds();
    isRevealed = !isQuiz;
    updateDisplay(true);
}

function rollTime() {
    isLive = false; // Stop live updates so the random time stays
    hours = Math.floor(Math.random() * 24);
    minutes = Math.floor(Math.random() * 60);
    seconds = 0;
    isRevealed = !isQuiz;
    updateDisplay(true);
    if (isQuiz) generateQuizOptions();
}

function speak(r) {
    window.speechSynthesis.cancel();
    let t = document.getElementById('polish-text').innerText;
    if (t.includes("?")) return;
    const m = new SpeechSynthesisUtterance(t);
    m.lang = 'de-DE'; m.rate = r;
    window.speechSynthesis.speak(m);
}

function toggleSec() {
    showSec = !showSec;
    // Force isRevealed to false if we are in a quiz so it stays hidden
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
        isRevealed = false; // Ensure the answer is hidden immediately [cite: 2026-01-13]
        generateQuizOptions();
        document.getElementById('quiz-toggle').innerText = dict[currentLang].qOn;
    } else {
        isRevealed = true; // Show text again when quiz is off
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
        btn.style.cssText = "padding:10px; border-radius:8px; border:1px solid #ccc; background:white; cursor:pointer;";
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
        let mStr = (m > 0 && m < 10) ? "zero " + mAll[m] : (m === 0 ? "" : mAll[m]);
        // Wrap the minute string in the blue class
        let mCard = mStr ? `<span class="cardinal-num">${mStr}</span>` : "";
        return `Godzina <span class="nom-case">${hNom[h]}</span> ${mCard}`.trim();
    } else {
        let h12 = h % 12, n12 = (h + 1) % 12;
        if (m === 0) return `<span class="nom-case">${hNom[h12]}</span>`;
        // Wrap minutes in blue cardinal-num class
        if (m < 30) return `<span class="cardinal-num">${mAll[m]}</span> po <span class="gen-case">${hGen[h12]}</span>`;
        if (m === 30) return `w pół do <span class="gen-case">${hGen[n12]}</span>`;
        return `za <span class="cardinal-num">${mAll[60-m]}</span> <span class="nom-case">${hNom[n12]}</span>`;
    }
}
function manualTime(val) {
    isLive = false;
    if(!val.includes(':')) return;
    const parts = val.split(':');
    let ph = parseInt(parts[0]), pm = parseInt(parts[1]);
    if(!isNaN(ph) && !isNaN(pm)) {
        hours = Math.min(23, Math.max(0, ph));
        minutes = Math.min(59, Math.max(0, pm));
        updateDisplay(false);
    }
}

async function toggleHelp() {
    const modal = document.getElementById('help-modal');
    if (modal.style.display === 'block') { modal.style.display = 'none'; return; }
    const helpFile = currentLang === 'PL' ? 'help_pl.html' : 'help_en.html';
    try {
        const r = await fetch(helpFile);
        document.getElementById('help-content').innerHTML = await r.text();
        modal.style.display = 'block';
    } catch (e) { modal.style.display = 'block'; }
}

function toggleLang() {
    currentLang = (currentLang === 'EN' ? 'PL' : 'EN');
    if (isQuiz) isRevealed = false; // Keep quiz hidden after language swap
    const d = dict[currentLang];
    document.getElementById('app-title').innerText = d.title;
    document.getElementById('btn-real').innerText = d.actual;
    document.getElementById('btn-random').innerText = d.random;
    document.getElementById('btn-listen').innerText = d.listen;
    document.getElementById('btn-slow').innerText = d.slow;
    document.getElementById('quiz-toggle').innerText = isQuiz ? d.qOn : d.qOff;
    document.getElementById('help-close').innerText = d.close;
    updateDisplay(true);
}
