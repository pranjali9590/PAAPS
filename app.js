/**
 * Play_time - Interactive Game & State Machine (Custom Group Edition with Strict Lore Verification)
 */

document.addEventListener('DOMContentLoaded', () => {
    // Exact Answer Key
    const ANSWER_KEY = {
        sankalpName: "Sankulan",
        readyToLeave: "Prashita",
        gayCouple: "Anjee and Shubhank",
        marketGoin: "Ankan Relationship Status",
        teaGiver: "Shreeya",
        bestClub: "Events comm"
    };

    // Game State
    const state = {
        currentScreen: 1,
        userChoices: {
            sankalpName: null,
            readyToLeave: null,
            gayCouple: null,
            marketGoin: null,
            teaGiver: null,
            bestClub: 'Events comm'
        },
        evasionCornerIndex: 0,
        memberId: 'PAAPS-' + Math.floor(1000 + Math.random() * 9000),
        currentUserName: 'sAnKuLaN_cO_pIlOt'
    };

    // Screens
    const screens = {
        1: document.getElementById('screen-1'),
        2: document.getElementById('screen-2'),
        3: document.getElementById('screen-3'),
        4: document.getElementById('screen-4'),
        5: document.getElementById('screen-5'),
        6: document.getElementById('screen-6'),
        7: document.getElementById('screen-7'),
        8: document.getElementById('screen-8'),
        9: document.getElementById('screen-9'),
        'reject': document.getElementById('screen-reject')
    };

    const progressFill = document.getElementById('progressFill');
    const hudScreenText = document.getElementById('hudScreenText');
    const soundToggleBtn = document.getElementById('soundToggleBtn');
    const themeToggleCheckbox = document.getElementById('themeToggleCheckbox');
    const shutterFlash = document.getElementById('shutterFlash');
    const runawayArena = document.getElementById('runawayArena');
    const runawayContainer = document.getElementById('runawayContainer');
    const runawayYesBtn = document.getElementById('runawayYesBtn');
    const evasionSpeech = document.getElementById('evasionSpeech');
    const btnNoScreen1 = document.getElementById('btnNoScreen1');
    const btnBunkYes = document.getElementById('btnBunkYes');
    const restartBtn = document.getElementById('restartBtn');
    const downloadBadgeBtn = document.getElementById('downloadBadgeBtn');
    const badgeUserName = document.getElementById('badgeUserName');
    const btnChangeName = document.getElementById('btnChangeName');
    const pastLivesModal = document.getElementById('pastLivesModal');
    const customUserNameInput = document.getElementById('customUserNameInput');
    const mixedCapsCheckbox = document.getElementById('mixedCapsCheckbox');
    const btnConfirmNameAndPass = document.getElementById('btnConfirmNameAndPass');
    const btnRetryInterview = document.getElementById('btnRetryInterview');
    const scoreBreakdownPills = document.getElementById('scoreBreakdownPills');

    // =========================================================================
    // THEME TOGGLE
    // =========================================================================
    if (themeToggleCheckbox) {
        const savedTheme = localStorage.getItem('playtime_theme');
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-mode');
            themeToggleCheckbox.checked = true;
        }

        themeToggleCheckbox.addEventListener('change', () => {
            if (themeToggleCheckbox.checked) {
                document.body.classList.add('dark-mode');
                localStorage.setItem('playtime_theme', 'dark');
            } else {
                document.body.classList.remove('dark-mode');
                localStorage.setItem('playtime_theme', 'light');
            }
            window.soundFx.playPop(480);
        });
    }

    // =========================================================================
    // SOUND TOGGLE
    // =========================================================================
    if (soundToggleBtn) {
        soundToggleBtn.addEventListener('click', () => {
            const isMuted = window.soundFx.toggleMute();
            soundToggleBtn.textContent = isMuted ? '🔇' : '🔊';
            if (!isMuted) window.soundFx.playPop(520);
        });
    }

    // Screen Navigation (Page-Aligned, In-Place Bounce)
    function goToScreen(screenKey) {
        Object.values(screens).forEach(screen => {
            if (screen) {
                screen.classList.remove('active');
                screen.style.display = 'none';
            }
        });

        const nextEl = screens[screenKey];
        if (!nextEl) return;

        nextEl.style.display = 'flex';
        void nextEl.offsetWidth; // Force reflow
        nextEl.classList.add('active');

        state.currentScreen = screenKey;

        // Progress HUD update
        if (typeof screenKey === 'number') {
            const progressPct = Math.min(100, Math.round((screenKey / 9) * 100));
            if (progressFill) progressFill.style.width = `${progressPct}%`;
            if (hudScreenText) hudScreenText.textContent = `Phase ${screenKey}/9`;
        } else if (screenKey === 'reject') {
            if (hudScreenText) hudScreenText.textContent = `REJECTED ❌`;
            if (progressFill) progressFill.style.width = `100%`;
        }

        if (screenKey === 9) {
            setupFinalBadge();
        }
    }

    // =========================================================================
    // SCREEN 1: RUNAWAY "YES" BUTTON (SLOWER, PROPERLY FORMATTED GLIDE)
    // =========================================================================
    const evasionPrompts = [
        "Are you sure about your life choices? 🤔",
        "Bro... are you SURE about your life choices?! 💀",
        "Think about your future life choices! 😂",
        "Attendance percentage says: NO WAY! 📉",
        "Are you REALLY sure about this?! 🚨",
        "Life choices alert: BUNK INSTEAD! ✨"
    ];

    let speechTimer = null;
    let isMoving = false;

    function moveButtonInsideArena() {
        if (state.currentScreen !== 1 || !runawayArena || isMoving) return;

        isMoving = true;
        window.soundFx.playBoing();

        // Update speech bubble prompt
        const promptMsg = evasionPrompts[Math.floor(Math.random() * evasionPrompts.length)];
        evasionSpeech.textContent = promptMsg;
        evasionSpeech.classList.add('show');
        clearTimeout(speechTimer);
        speechTimer = setTimeout(() => {
            evasionSpeech.classList.remove('show');
        }, 1800);

        const arenaRect = runawayArena.getBoundingClientRect();
        const btnRect = runawayYesBtn.getBoundingClientRect();

        // 4 Safe corners inside the arena
        const padding = 16;
        const maxX = arenaRect.width - btnRect.width - padding;
        const maxY = arenaRect.height - btnRect.height - padding;

        const positions = [
            { x: maxX, y: padding, rot: 5 },                                // Top Right
            { x: maxX, y: maxY, rot: -4 },                                   // Bottom Right
            { x: Math.max(padding, maxX * 0.5), y: padding, rot: -6 },       // Top Center
            { x: Math.max(padding, maxX * 0.6), y: maxY, rot: 4 },          // Bottom Center
            { x: maxX - 20, y: Math.max(padding, maxY * 0.5), rot: 0 }      // Center Right
        ];

        state.evasionCornerIndex = (state.evasionCornerIndex + 1 + Math.floor(Math.random() * 2)) % positions.length;
        const target = positions[state.evasionCornerIndex];

        // Format position properly inside arena
        runawayYesBtn.style.position = 'absolute';
        runawayYesBtn.style.left = `${Math.round(target.x)}px`;
        runawayYesBtn.style.top = `${Math.round(target.y)}px`;
        runawayYesBtn.style.transform = `rotate(${target.rot}deg)`;

        setTimeout(() => {
            isMoving = false;
        }, 550);
    }

    runawayYesBtn.addEventListener('mouseenter', moveButtonInsideArena);
    runawayYesBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        moveButtonInsideArena();
    });

    window.addEventListener('mousemove', (e) => {
        if (state.currentScreen !== 1) return;

        const rect = runawayYesBtn.getBoundingClientRect();
        const btnCenterX = rect.left + rect.width / 2;
        const btnCenterY = rect.top + rect.height / 2;

        const distance = Math.hypot(e.clientX - btnCenterX, e.clientY - btnCenterY);
        const threshold = Math.max(rect.width, rect.height) / 2 + 30;

        if (distance < threshold) {
            moveButtonInsideArena();
        }
    });

    // Screen 1 Stationary "No" Button (Smooth Photo-Snap In-Place Transition)
    btnNoScreen1.addEventListener('click', () => {
        window.soundFx.playShutter();

        // Camera shutter flash
        shutterFlash.classList.add('flash-active');
        setTimeout(() => shutterFlash.classList.remove('flash-active'), 120);

        // Smooth in-place polaroid snap animation
        screens[1].classList.add('photo-snap');
        setTimeout(() => {
            screens[1].classList.remove('photo-snap');
            goToScreen(2);
        }, 380);
    });

    // =========================================================================
    // SCREEN 2: THE BUNK PITCH
    // =========================================================================
    btnBunkYes.addEventListener('click', () => {
        window.soundFx.playFanfare();
        fireConfettiBlast();

        const clubModal = document.getElementById('welcomeModal');
        if (clubModal) {
            clubModal.style.display = 'flex';
            setTimeout(() => {
                clubModal.style.display = 'none';
                goToScreen(3);
            }, 1400);
        } else {
            setTimeout(() => goToScreen(3), 600);
        }
    });

    // =========================================================================
    // SCREENS 3 TO 7: QUESTIONS SETUP
    // =========================================================================
    function setupQuestionCards(screenNum, stateKey, nextScreenNum) {
        const screenEl = screens[screenNum];
        if (!screenEl) return;

        const cards = screenEl.querySelectorAll('.choice-card');
        cards.forEach(card => {
            card.addEventListener('click', () => {
                window.soundFx.playPop(580);

                cards.forEach(c => c.classList.remove('selected'));
                card.classList.add('selected');

                const val = card.getAttribute('data-value');
                state.userChoices[stateKey] = val;

                setTimeout(() => {
                    goToScreen(nextScreenNum);
                }, 380);
            });
        });
    }

    setupQuestionCards(3, 'sankalpName', 4);
    setupQuestionCards(4, 'readyToLeave', 5);
    setupQuestionCards(5, 'gayCouple', 6);
    setupQuestionCards(6, 'marketGoin', 7);
    setupQuestionCards(7, 'teaGiver', 8);

    // =========================================================================
    // SCREEN 8: COLLEGE BEST CLUB & STRICT ANSWER EVALUATION
    // =========================================================================
    const eventsCommCard = document.getElementById('cardEventsComm');
    const bprCard = document.getElementById('cardBPR');
    const otherCard = document.getElementById('cardOther');

    function triggerWrongClub(cardElement, errorMsg) {
        window.soundFx.playBuzzer();
        cardElement.classList.add('shake-error');

        let tooltip = cardElement.querySelector('.error-hint');
        if (!tooltip) {
            tooltip = document.createElement('div');
            tooltip.className = 'error-hint';
            tooltip.style.cssText = 'position:absolute; bottom:-14px; left:50%; transform:translateX(-50%); background:#EF476F; color:#fff; font-size:0.82rem; font-weight:700; padding:4px 12px; border-radius:14px; white-space:nowrap; z-index:10; box-shadow:0 4px 8px rgba(0,0,0,0.25);';
            cardElement.appendChild(tooltip);
        }
        tooltip.textContent = errorMsg;
        tooltip.style.display = 'block';

        setTimeout(() => {
            cardElement.classList.remove('shake-error');
        }, 500);

        setTimeout(() => {
            if (tooltip) tooltip.style.display = 'none';
        }, 1600);
    }

    if (bprCard) {
        bprCard.addEventListener('click', () => {
            triggerWrongClub(bprCard, "BPR? Did you mean Events comm? 😂");
        });
        bprCard.addEventListener('mouseenter', () => {
            bprCard.style.transform = 'translateY(8px) scale(0.96)';
            setTimeout(() => bprCard.style.transform = '', 300);
        });
    }

    if (otherCard) {
        otherCard.addEventListener('click', () => {
            triggerWrongClub(otherCard, "Error 404: Events comm is the only answer! 👑");
        });
        otherCard.addEventListener('mouseenter', () => {
            otherCard.style.transform = 'translateY(8px) scale(0.96)';
            setTimeout(() => otherCard.style.transform = '', 300);
        });
    }

    if (eventsCommCard) {
        eventsCommCard.addEventListener('click', () => {
            state.userChoices.bestClub = "Events comm";
            eventsCommCard.classList.add('selected');

            evaluateAllAnswers();
        });
    }

    function evaluateAllAnswers() {
        const results = [
            { q: "Sankalp's Real Name", expected: ANSWER_KEY.sankalpName, actual: state.userChoices.sankalpName },
            { q: "Most Ready to Leave", expected: ANSWER_KEY.readyToLeave, actual: state.userChoices.readyToLeave },
            { q: "Gay Couple", expected: ANSWER_KEY.gayCouple, actual: state.userChoices.gayCouple },
            { q: "Market Goin Meaning", expected: ANSWER_KEY.marketGoin, actual: state.userChoices.marketGoin },
            { q: "Best Tea Giver", expected: ANSWER_KEY.teaGiver, actual: state.userChoices.teaGiver },
            { q: "Best College Club", expected: ANSWER_KEY.bestClub, actual: state.userChoices.bestClub }
        ];

        let correctCount = 0;
        results.forEach(r => {
            if (r.actual === r.expected) correctCount++;
        });

        const allCorrect = (correctCount === 6);

        if (allCorrect) {
            // SUCCESS! 6/6 DRAMATIC CELEBRATION
            window.soundFx.playPastLivesChime();
            window.soundFx.playEventsCommTriumph();
            fireGoldConfettiBlast();

            setTimeout(() => {
                if (pastLivesModal) {
                    pastLivesModal.classList.add('active');
                } else {
                    goToScreen(9);
                }
            }, 500);

        } else {
            // REJECTION! AT LEAST ONE WRONG ANSWER
            window.soundFx.playSadTrombone();
            window.soundFx.playBuzzer();

            if (scoreBreakdownPills) {
                scoreBreakdownPills.innerHTML = '';
                results.forEach((r, idx) => {
                    const pill = document.createElement('div');
                    const isRight = (r.actual === r.expected);
                    pill.className = `score-pill ${isRight ? 'correct' : 'wrong'}`;
                    pill.innerHTML = `<span>${isRight ? '✔️' : '❌'}</span> <span>Q${idx + 1}: ${r.q} (${isRight ? 'Correct' : 'Failed'})</span>`;
                    scoreBreakdownPills.appendChild(pill);
                });
            }

            setTimeout(() => {
                goToScreen('reject');
            }, 600);
        }
    }

    // Retry Interview
    if (btnRetryInterview) {
        btnRetryInterview.addEventListener('click', () => {
            window.soundFx.playPop(440);
            state.userChoices = {
                sankalpName: null,
                readyToLeave: null,
                gayCouple: null,
                marketGoin: null,
                teaGiver: null,
                bestClub: 'Events comm'
            };
            document.querySelectorAll('.choice-card').forEach(c => c.classList.remove('selected'));
            runawayYesBtn.style.position = '';
            runawayYesBtn.style.left = '';
            runawayYesBtn.style.top = '';
            runawayYesBtn.style.transform = '';
            goToScreen(1);
        });
    }

    // =========================================================================
    // PAST LIVES MODAL & USERNAME HANDLING
    // =========================================================================
    function formatMixedCaps(str) {
        return str.split('').map(char => {
            if (char === '_' || char === ' ' || !isNaN(char)) return char;
            return Math.random() > 0.5 ? char.toUpperCase() : char.toLowerCase();
        }).join('');
    }

    if (btnConfirmNameAndPass) {
        btnConfirmNameAndPass.addEventListener('click', () => {
            window.soundFx.playPop(620);
            let rawName = customUserNameInput.value.trim() || "Sankulan's Co-Pilot";

            if (mixedCapsCheckbox && mixedCapsCheckbox.checked) {
                state.currentUserName = formatMixedCaps(rawName);
            } else {
                state.currentUserName = rawName;
            }

            badgeUserName.textContent = state.currentUserName;
            pastLivesModal.classList.remove('active');

            goToScreen(9);
        });
    }

    if (btnChangeName) {
        btnChangeName.addEventListener('click', () => {
            window.soundFx.playPop(520);
            pastLivesModal.classList.add('active');
        });
    }

    // =========================================================================
    // SCREEN 9: OFFICIAL PAAPS MEMBER BADGE LOADED
    // =========================================================================
    function setupFinalBadge() {
        window.soundFx.playSparkle();

        document.getElementById('badgeMemberId').textContent = state.memberId;
        document.getElementById('badgeRole').textContent = "Past-Life Soulmate & Lore Master 👑";
        document.getElementById('badgeClub').textContent = "Events comm (Supreme Choice 👑)";
        document.getElementById('badgeDate').textContent = new Date().toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });

        initGlitter();
        fireConfettiBlast();
    }

    if (restartBtn) {
        restartBtn.addEventListener('click', () => {
            window.soundFx.playPop(440);
            state.userChoices = {
                sankalpName: null,
                readyToLeave: null,
                gayCouple: null,
                marketGoin: null,
                teaGiver: null,
                bestClub: 'Events comm'
            };
            document.querySelectorAll('.choice-card').forEach(c => c.classList.remove('selected'));
            runawayYesBtn.style.position = '';
            runawayYesBtn.style.left = '';
            runawayYesBtn.style.top = '';
            runawayYesBtn.style.transform = '';
            goToScreen(1);
        });
    }

    // Download Pass as High-Res PNG
    if (downloadBadgeBtn) {
        downloadBadgeBtn.addEventListener('click', () => {
            window.soundFx.playPop(600);
            renderAndDownloadPass();
        });
    }

    function renderAndDownloadPass() {
        const canvas = document.createElement('canvas');
        canvas.width = 850;
        canvas.height = 1050;
        const ctx = canvas.getContext('2d');

        const isDark = document.body.classList.contains('dark-mode');
        const bgGrad = ctx.createLinearGradient(0, 0, 850, 1050);
        if (isDark) {
            bgGrad.addColorStop(0, '#16102B');
            bgGrad.addColorStop(1, '#23183D');
        } else {
            bgGrad.addColorStop(0, '#ECE5F8');
            bgGrad.addColorStop(1, '#FFF3F6');
        }
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, 850, 1050);

        // Frame
        ctx.fillStyle = isDark ? '#1C1533' : '#FFFFFF';
        ctx.strokeStyle = '#8B5CF6';
        ctx.lineWidth = 10;
        roundRect(ctx, 40, 40, 770, 970, 36, true, true);

        // Header Title
        ctx.fillStyle = '#8B5CF6';
        ctx.font = 'bold 36px "Fredoka", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText("★ PAAPS BUNK CLUB ★", 425, 115);

        ctx.fillStyle = '#FF6B8B';
        ctx.font = 'bold 19px "Quicksand", sans-serif';
        ctx.fillText("OFFICIAL LIFETIME PASS • PAST-LIFE SOULMATE VERIFIED", 425, 155);

        // Dashed line
        ctx.strokeStyle = isDark ? '#3D2F63' : '#E2D9F3';
        ctx.lineWidth = 4;
        ctx.setLineDash([12, 10]);
        ctx.beginPath();
        ctx.moveTo(80, 190);
        ctx.lineTo(770, 190);
        ctx.stroke();
        ctx.setLineDash([]);

        // Details
        ctx.textAlign = 'left';
        const userName = state.currentUserName || "sAnKuLaN_cO_pIlOt";
        const role = document.getElementById('badgeRole').textContent;
        const id = document.getElementById('badgeMemberId').textContent;
        const date = document.getElementById('badgeDate').textContent;

        drawPassField(ctx, 90, 245, "OFFICIAL REGISTERED NAME", userName, '#FF6B8B', isDark);
        drawPassField(ctx, 90, 350, "MEMBER IDENTIFICATION", id, isDark ? '#F5EEFF' : '#2D223B', isDark);
        drawPassField(ctx, 90, 455, "SPECIALIST SQUAD ROLE", role, '#8B5CF6', isDark);
        drawPassField(ctx, 90, 560, "CAMPUS ALLEGIANCE", "Events comm (The Only Best Club 👑)", '#FFB703', isDark);
        drawPassField(ctx, 90, 665, "DATE OF ISSUE", date, isDark ? '#F5EEFF' : '#2D223B', isDark);

        // Official Stamps
        ctx.save();
        ctx.translate(610, 740);
        ctx.rotate(-15 * Math.PI / 180);
        ctx.strokeStyle = '#FF6B8B';
        ctx.lineWidth = 6;
        roundRect(ctx, -130, -35, 260, 70, 16, false, true);
        ctx.fillStyle = '#FF6B8B';
        ctx.font = 'bold 22px "Fredoka", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText("CERTIFIED BUNKER", 0, 10);
        ctx.restore();

        ctx.save();
        ctx.translate(220, 750);
        ctx.rotate(12 * Math.PI / 180);
        ctx.strokeStyle = '#FFB703';
        ctx.lineWidth = 5;
        roundRect(ctx, -140, -35, 280, 70, 16, false, true);
        ctx.fillStyle = '#FFB703';
        ctx.font = 'bold 18px "Fredoka", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText("EVENTS COMM APPROVED", 0, 10);
        ctx.restore();

        // Barcode lines
        ctx.fillStyle = isDark ? '#F8F6FF' : '#2D223B';
        const startX = 175;
        const barY = 860;
        let curX = startX;
        for (let i = 0; i < 44; i++) {
            const width = (i % 3 === 0) ? 7 : (i % 2 === 0 ? 4 : 2);
            ctx.fillRect(curX, barY, width, 55);
            curX += width + ((i % 4 === 0) ? 8 : 4);
        }

        // Trigger Download
        const link = document.createElement('a');
        link.download = `PAAPS_PASS_${userName}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    }

    function drawPassField(ctx, x, y, label, value, valColor, isDark) {
        ctx.fillStyle = isDark ? '#9A8FB3' : '#8B8399';
        ctx.font = 'bold 14px "Quicksand", sans-serif';
        ctx.fillText(label, x, y);

        ctx.fillStyle = valColor || (isDark ? '#F8F6FF' : '#2D223B');
        ctx.font = 'bold 24px "Fredoka", sans-serif';
        ctx.fillText(value, x, y + 36);
    }

    function roundRect(ctx, x, y, width, height, radius, fill, stroke) {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
        if (fill) ctx.fill();
        if (stroke) ctx.stroke();
    }

    // Confetti
    function fireConfettiBlast() {
        if (window.confetti) {
            window.confetti({
                particleCount: 80,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#FF6B8B', '#8B5CF6', '#2EC4B6', '#FFD166']
            });
        }
    }

    function fireGoldConfettiBlast() {
        if (window.confetti) {
            window.confetti({
                particleCount: 130,
                spread: 100,
                origin: { y: 0.5 },
                colors: ['#FFD166', '#FFB703', '#FFFFFF', '#8B5CF6', '#FF6B8B']
            });
        }
    }

    // Glitter Particles Canvas (Final Screen)
    const glitterCanvas = document.getElementById('glitterCanvas');
    let glitterCtx = null;
    let sparkles = [];

    function initGlitter() {
        if (!glitterCanvas) return;
        glitterCanvas.width = window.innerWidth;
        glitterCanvas.height = window.innerHeight;
        glitterCtx = glitterCanvas.getContext('2d');

        sparkles = [];
        for (let i = 0; i < 40; i++) {
            sparkles.push({
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                size: Math.random() * 6 + 2,
                alpha: Math.random(),
                speed: Math.random() * 0.03 + 0.01,
                color: ['#FFD166', '#FF6B8B', '#B39DDB', '#FFFFFF'][Math.floor(Math.random() * 4)]
            });
        }

        renderSparkles();
    }

    function renderSparkles() {
        if (state.currentScreen !== 9 || !glitterCtx) return;

        glitterCtx.clearRect(0, 0, glitterCanvas.width, glitterCanvas.height);

        sparkles.forEach(s => {
            s.alpha += s.speed;
            if (s.alpha > 1 || s.alpha < 0) s.speed = -s.speed;

            glitterCtx.save();
            glitterCtx.globalAlpha = Math.max(0, Math.min(1, s.alpha));
            glitterCtx.fillStyle = s.color;

            drawStar(glitterCtx, s.x, s.y, 4, s.size, s.size / 2);
            glitterCtx.restore();
        });

        requestAnimationFrame(renderSparkles);
    }

    function drawStar(ctx, cx, cy, spikes, outerRadius, innerRadius) {
        let rot = Math.PI / 2 * 3;
        let x = cx;
        let y = cy;
        let step = Math.PI / spikes;

        ctx.beginPath();
        ctx.moveTo(cx, cy - outerRadius);
        for (let i = 0; i < spikes; i++) {
            x = cx + Math.cos(rot) * outerRadius;
            y = cy + Math.sin(rot) * outerRadius;
            ctx.lineTo(x, y);
            rot += step;

            x = cx + Math.cos(rot) * innerRadius;
            y = cy + Math.sin(rot) * innerRadius;
            ctx.lineTo(x, y);
            rot += step;
        }
        ctx.lineTo(cx, cy - outerRadius);
        ctx.closePath();
        ctx.fill();
    }

    window.addEventListener('resize', () => {
        if (glitterCanvas) {
            glitterCanvas.width = window.innerWidth;
            glitterCanvas.height = window.innerHeight;
        }
    });

    // Start with Screen 1
    goToScreen(1);
});
