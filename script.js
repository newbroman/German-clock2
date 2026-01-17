// 1. Global State
let hours = 12, minutes = 0, seconds = 0, isQuiz = false, isRevealed = true, currentLang = 'EN', showPh = true, showSec = false;
let isLive = true;

// 2. Data Sets (Updated for German)
const hNom = ["Mitternacht", "ein", "zwei", "drei", "vier", "fünf", "sechs", "sieben", "acht", "neun", "zehn", "elf", "zwölf", "dreizehn", "vierzehn", "fünfzehn", "sechzehn", "siebzehn", "achtzehn", "neunzehn", "zwanzig", "einundzwanzig", "zweiundzwanzig", "dreiundzwanzig"];
const hNomPh = ["mit-ter-nakht", "ayn", "tsway", "dray", "feer", "fuenf", "zeks", "zee-ben", "akht", "noyn", "tsayn", "elf", "tsveulf", "dray-tsayn", "feer-tsayn", "fuenf-tsayn", "zeks-tsayn", "zeeb-tsayn", "akht-tsayn", "noyn-tsayn", "tsvan-tsig", "ayn-unt-tsvan-tsig", "tsvay-unt-tsvan-tsig", "dray-unt-tsvan-tsig"];
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
    c.querySelectorAll('.mark').forEach(m => m.remove());

    for (let i = 0; i < 12; i++) {
        const m = document.createElement('div');
        m.className = 'mark';
        m.style.transform = `rotate(${i * 30}deg)`;
        m.style.transformOrigin = `1px 72.5px`;
        c.appendChild(m);
    }

    // [cite: 2026-01-13] Casual mode is the default
    document.getElementById('casual').checked = true;

    setRealTime(); 
    
    setInterval(() => {
        if (isQuiz) return; 
        if (isLive) {
            const now = new Date();
            seconds = now.getSeconds();
            hours = now.getHours();
            minutes = now.getMinutes();
        } else {
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
    const hRotation = ((hours % 12) * 30) + (minutes * 0.5);
    const mRotation = minutes * 6;
    const sRotation = seconds * 6;

    document.getElementById('h-hand').style.transform = `rotate(${hRotation}deg)`;
    document.getElementById('m-hand').style.transform = `rotate(${mRotation}deg)`;
    const sHand = document.getElementById('s-hand');
    if (sHand) sHand.style.transform = `rotate(${sRotation}deg)`;

    const timeStr = `${pad(hours)}:${pad(minutes)}${showSec ? ':' + pad(seconds) : ''}`;
    if (syncInput) document.getElementById('time-input-display').value = timeStr;

    // 2. German Text Logic
    const isFormal = document.getElementById('formal').checked;
    let p = "", ph = "", e = "";
    let sStr = (showSec && seconds > 0) ? ` und <span class="cardinal-num">${mAll[seconds]}</span> Sekunden` : "";

    if (isFormal) {
        // Formal: "Es ist [Hour] Uhr [Minute]"
        let mStr = minutes === 0 ? "" : mAll[minutes];
        let mCard = minutes > 0 ? ` <span class="cardinal-num">${mStr}</span>` : "";
        p = `Es ist <span class="nom-case">${hNom[hours]}</span> Uhr${mCard}${sStr}`;
        ph = `es ist ${hNomPh[hours]} oor ${mAllPh[minutes]}`;
        e = `${pad(hours)}:${pad(minutes)}`;
    } else {
        // Casual: 12h clock
        let h12 = hours % 12;
        let nextH = (hours + 1) % 12 || 12;
        let displayH = h12 || 12;

        if (minutes === 0) {
            let spec = hours === 0 ? "Mitternacht" : hours === 12 ? "Mittag" : hNom[h12];
            p = `Es ist <span class="nom-case">${spec}</span>${sStr}`;
            ph = `es ist ${hNomPh[h12]}`;
            e = hours === 0 ? "Midnight" : hours === 12 ? "Noon" : `${displayH} o'clock`;
        } else if (minutes < 30) {
            // [cite: 2026-01-10] Use fünfzehn, not Viertel
            p = `<span class="cardinal-num">${mAll[minutes]}</span> nach <span class="nom-case">${hNom[h12]}</span>${sStr}`;
            ph = `${mAllPh[minutes]} nakh ${hNomPh[h12]}`;
            e = `${minutes} past ${displayH}`;
        } else if (minutes === 30) {
            p = `halb <span class="nom-case">${hNom[nextH]}</span>${sStr}`;
            ph = `halp ${hNomPh[nextH]}`;
            e = `Half past ${displayH}`;
        } else {
            let d = 60 - minutes;
            p = `<span class="cardinal-num">${mAll[d]}</span> vor <span class="nom-case">${hNom[nextH]}</span>${sStr}`;
            ph = `${mAllPh[d]} for ${hNomPh[nextH]}`;
            e = `${d} to ${nextH}`;
        }
    }

    // 3. UI Update (Using generic lang-text ID)
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

// ... (startDrag, setRealTime, rollTime, manualTime functions remain logic-consistent) ...

function speak(r) {
    window.speechSynthesis.cancel();
    let t = document.getElementById('lang-text').innerText;
    if (t.includes("?")) return;
    const m = new SpeechSynthesisUtterance(t);
    m.lang = 'de-DE'; // Updated for German
    m.rate = r;
    window.speechSynthesis.speak(m);
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
        btn.className = "quiz-btn";
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
        let mCard = m > 0 ? ` <span class="cardinal-num">${mStr}</span>` : "";
        return `Es ist <span class="nom-case">${hNom[h]}</span> Uhr${mCard}`.trim();
    } else {
        let h12 = h % 12;
        let nextH = (h + 1) % 12 || 12;
        if (m === 0) return `<span class="nom-case">${hNom[h12]}</span>`;
        if (m < 30) return `<span class="cardinal-num">${mAll[m]}</span> nach <span class="nom-case">${hNom[h12]}</span>`;
        if (m === 30) return `halb <span class="nom-case">${hNom[nextH]}</span>`;
        return `<span class="cardinal-num">${mAll[60-m]}</span> vor <span class="nom-case">${hNom[nextH]}</span>`;
    }
}

async function toggleHelp() {
    const modal = document.getElementById('help-modal');
    if (modal.style.display === 'block') { modal.style.display = 'none'; return; }
    // Points to German or English help
    const helpFile = currentLang === 'DE' ? 'help_de.html' : 'help_en.html';
    try {
        const r = await fetch(helpFile);
        document.getElementById('help-content').innerHTML = await r.text();
        modal.style.display = 'block';
    } catch (e) { modal.style.display = 'block'; }
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
