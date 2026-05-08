/* ============================================
   AUTO-ÉVALUATION TDAH - Application Logic
   @le.neuropsy
   ============================================ */

// ==========================================
// DATA: Questionnaire Structure
// ==========================================

const QUESTIONNAIRE = {
    etape1: {
        label: "Étape 1 : Sévérité des symptômes",
        period: "Au cours des 6 derniers mois, à quelle fréquence avez-vous tendance à...",
        intro: "Il n'y a pas de bonne ou de mauvaise réponse. L'objectif est de décrire ce que l'on observe, pas de se juger.",
        sections: [
            {
                id: "inattention",
                title: "Section A : Inattention",
                badge: "Étape 1 – A",
                questions: [
                    { text: "Négliger les <b>détails</b>, manquer de <b>précision</b>, et/ou faire des <b>erreurs d'étourderie</b>", detail: "(en particulier pendant une activité jugée inintéressante ou difficile, que ce soit au travail ou dans ma vie privée)" },
                    { text: "Trouver difficile de <b>maintenir</b> mon <b>attention</b>, avoir une <b>concentration</b> fluctuante", detail: "(en particulier pendant une activité longue, répétitive ou ennuyeuse)" },
                    { text: "Donner l'impression aux autres de <b>ne pas écouter</b>, <b>décrocher</b> pendant une conversation", detail: "même si mon interlocuteur s'adresse à moi, et en l'absence de distraction évidente" },
                    { text: "Avoir du mal à suivre les <b>consignes</b> et à mener un <b>projet à terme</b>", detail: "(commencer des tâches domestiques, obligations professionnelles, activités créatives... et ne pas les finir, notamment lorsque le plus intéressant a été fait et qu'il me reste les détails à peaufiner)" },
                    { text: "Avoir du mal à <b>organiser</b> mes activités, mes affaires ou mes idées, les projets impliquant plusieurs étapes", detail: "(désordre, gestion du temps inefficace, délais non tenus...)" },
                    { text: "Éviter, <b>remettre à plus tard</b>/au dernier moment, ou avoir <b>en aversion</b>, une tâche peu motivante et qui me demande un effort mental soutenu", detail: "(formulaires administratifs, analyse, synthèse, rédaction de documents...)" },
                    { text: "<b>Perdre</b> mes affaires, le <b>matériel</b> nécessaire à mes activités", detail: "(personnelles et professionnelles), et perdre du temps à les chercher" },
                    { text: "Me laisser facilement <b>distraire</b> par de l'activité et des <b>stimuli</b> autour de moi", detail: "(sons, visuels, lumières, odeurs, matières, mouvements...) ou par mes propres pensées" },
                    { text: "<b>Oublier</b> des rendez-vous, des événements, des obligations, ce que j'ai à faire au quotidien", detail: "(rappeler des personnes, régler des factures, accomplir les tâches ménagères...)" }
                ]
            },
            {
                id: "hyperactivite",
                title: "Section B : Hyperactivité / Impulsivité",
                badge: "Étape 1 – B",
                questions: [
                    { text: "<b>Remuer</b>, me tortiller sur mon siège, <b>tapoter</b> des doigts et/ou des pieds, <b>agiter</b> les mains et/ou les jambes", detail: "(ou avoir du mal à y résister), lorsque je suis contraint·e de rester assis·e un long moment" },
                    { text: "Me <b>lever</b>, quitter ma place / la salle dans laquelle je suis", detail: "(en trouvant éventuellement des excuses) par incapacité à rester assis·e" },
                    { text: "Me sentir excessivement <b>agité·e</b>, contraint·e à m'activer", detail: "sans pouvoir me contenir ou avoir le sentiment d'un cerveau en ébullition, d'un flot incessant de pensées" },
                    { text: "Avoir du mal à me <b>détendre</b>, à m'arrêter de m'activer", detail: "à profiter calmement d'une activité de loisir" },
                    { text: "M'agiter, être <b>difficile à suivre</b>, faire du <b>bruit</b>", detail: "(ex : « penser tout haut ») au point de perturber les autres (ou faire beaucoup d'efforts pour m'en empêcher)" },
                    { text: "Trop <b>parler</b> / laisser peu mon interlocuteur·ice s'exprimer", detail: "et/ou manquer de tact" },
                    { text: "<b>Finir les phrases</b> / répondre aux questions de mes interlocuteurs avant qu'ils n'aient le temps de les poser entièrement", detail: "couper la parole" },
                    { text: "Me sentir <b>tendu·e</b>, <b>impatient·e</b>, dans les situations où je dois attendre mon tour", detail: "(files d'attente, embouteillages, rendez-vous...)" },
                    { text: "<b>Interrompre / déranger</b> d'autres personnes / leur imposer ma présence alors qu'elles sont occupées", detail: "(déjà engagées dans une conversation, dans une activité)" }
                ]
            }
        ]
    },
    etape2: {
        label: "Étape 2 : Répercussions fonctionnelles & bien-être",
        period: "Au cours du dernier mois, à quelle fréquence...",
        intro: "Il n'y a pas de bonne ou de mauvaise réponse. L'objectif est de décrire ce que l'on observe, pas de se juger.",
        sections: [
            {
                id: "rub1",
                title: "1. Attention, mémoire et charge mentale",
                badge: "Étape 2 – R1",
                color: "#FF08C3",
                questions: [
                    { text: "J'ai du mal à rester <b>concentré·e</b> suffisamment <b>longtemps</b> sur une tâche." },
                    { text: "J'ai du mal à ne mener qu'<b>une seule tâche à la fois</b>." },
                    { text: "J'<b>oublie</b> ce que j'ai à faire (tâches, rendez-vous) ou des <b>informations</b>", detail: "(délais, consignes...)" },
                    { text: "J'ai la sensation d'avoir l'esprit <b>surchargé</b> ou <b>embrouillé</b>." },
                    { text: "Je dépends d'une <b>aide extérieure</b> pour me rappeler certaines choses importantes." }
                ]
            },
            {
                id: "rub2",
                title: "2. Organisation matérielle et environnement",
                badge: "Étape 2 – R2",
                color: "#FDD27E",
                questions: [
                    { text: "J'ai du mal à maintenir mon logement ou mon espace de travail <b>en ordre</b> / <b>propre</b>." },
                    { text: "Je <b>perds</b> ou cherche souvent mes <b>affaires / documents</b>", detail: "(car non rangé·e·s)." },
                    { text: "J'ai des difficultés à <b>retrouver</b> mes <b>papiers, informations</b>, dossiers..." },
                    { text: "La gestion de l'<b>administratif</b> (papiers, mails, démarches) me met en difficulté." },
                    { text: "Le <b>désordre</b> / <b>manque d'organisation</b> de mes informations me nuit." }
                ]
            },
            {
                id: "rub3",
                title: "3. Gestion du temps et planification",
                badge: "Étape 2 – R3",
                color: "#FF743E",
                questions: [
                    { text: "J'ai du mal à <b>estimer</b> le temps que prend une tâche et/ou à gérer un <b>agenda</b>." },
                    { text: "Je perds la <b>notion</b> du <b>temps</b> lorsque je suis absorbé·e par une activité." },
                    { text: "Je fais souvent les choses à la <b>dernière minute</b> / je ne <b>planifie</b> pas ma semaine." },
                    { text: "Je ne respecte pas les <b>délais</b> ou oublie mes <b>obligations</b>", detail: "(rendez-vous manqués, retards)." },
                    { text: "Je manque de <b>temps</b> pour réaliser mes tâches / faire ce qui est important pour moi." }
                ]
            },
            {
                id: "rub4",
                title: "4. Initiation de l'action et priorités",
                badge: "Étape 2 – R4",
                color: "#EE2E63",
                questions: [
                    { text: "Quand j'ai plusieurs choses à faire, je ne sais pas <b>par quoi commencer</b>." },
                    { text: "J'ai du mal à distinguer ce qui est <b>prioritaire</b> de ce qui peut attendre." },
                    { text: "Je <b>repousse</b> les tâches peu stimulantes ou contraignantes." },
                    { text: "J'ai besoin d'une <b>pression extérieure</b> (urgence, autre personne) pour m'y mettre." },
                    { text: "Je me consacre peu aux <b>activités importantes</b> pour moi, même non urgentes." }
                ]
            },
            {
                id: "rub5",
                title: "5. Motivation et engagement",
                badge: "Étape 2 – R5",
                color: "#EE2E63",
                questions: [
                    { text: "Je me lasse <b>rapidement</b>, même pour des projets importants pour moi." },
                    { text: "Je commence des tâches que j'ai du mal à poursuivre <b>jusqu'au bout</b>." },
                    { text: "Je m'engage dans trop de <b>projets</b> ou poursuis trop d'<b>idées</b> en même temps." },
                    { text: "Je me fixe peu d'<b>objectifs</b> (à court terme ou à long terme)." },
                    { text: "J'ai du mal à maintenir un <b>effort régulier</b> dans le temps." }
                ]
            },
            {
                id: "rub6",
                title: "6. Impulsivité, émotions et comportements à risque",
                badge: "Étape 2 – R6",
                color: "#FF93D6",
                questions: [
                    { text: "J'agis <b>sans</b> forcément <b>réfléchir</b> aux conséquences." },
                    { text: "J'ai du mal à <b>résister</b> aux <b>tentations</b> (achats, écrans, nourriture…)." },
                    { text: "Certaines <b>consommations</b> / <b>comportements</b> nuisent à ma productivité (écrans...)" },
                    { text: "Il m'arrive d'avoir des <b>comportements à risque</b> (relations, conduite, substances…)." },
                    { text: "J'ai du mal à <b>contrôler</b> mes <b>réactions émotionnelles</b> (colère, frustration, débordement)." }
                ]
            },
            {
                id: "rub7",
                title: "7. Vie quotidienne et hygiène de vie",
                badge: "Étape 2 – R7",
                color: "#C7A2DE",
                questions: [
                    { text: "J'ai des horaires et/ou un volume de <b>sommeil</b> irrégulier·s / insuffisant·s." },
                    { text: "Mes horaires et/ou l'équilibre de mes <b>repas</b> sont irréguliers / désorganisés." },
                    { text: "Ma pratique d'une <b>activité physique</b> est irrégulière / insuffisante." },
                    { text: "J'ai du mal à tenir une <b>routine quotidienne</b> stable", detail: "(soin de soi, tâches ménagères)." },
                    { text: "Je néglige mon <b>suivi médical</b> et/ou mon <b>hygiène</b>, ou celle de mes proches." }
                ]
            },
            {
                id: "rub8",
                title: "8. Fonctionnement au travail / dans les études",
                badge: "Étape 2 – R8",
                color: "#C7A2DE",
                questions: [
                    { text: "Mes difficultés impactent mon <b>efficacité</b> et/ou mes <b>performances</b>." },
                    { text: "J'ai du mal à répondre aux attentes et/ou à <b>honorer mes engagements</b>." },
                    { text: "J'ai du mal à m'<b>organiser</b> de façon <b>autonome</b>." },
                    { text: "Je me sens souvent <b>en difficulté</b> et/ou <b>en décalage</b> par rapport aux autres." },
                    { text: "Ces difficultés nuisent à mon <b>estime</b> et à la <b>confiance en moi</b>." }
                ]
            },
            {
                id: "rub9",
                title: "9. Interactions sociales et communication",
                badge: "Étape 2 – R9",
                color: "#88D8B7",
                questions: [
                    { text: "Les autres me font des <b>reproches</b>." },
                    { text: "Je dois faire face à des <b>conflits</b> et/ou <b>incompréhensions</b> / malentendus." },
                    { text: "Mes paroles/réactions peuvent blesser, me nuire. Il m'arrive de le regretter." },
                    { text: "Je passe peu de temps avec ma <b>famille</b>, mes <b>amis</b> ; je réponds peu aux appels." },
                    { text: "Mes difficultés compliquent mes <b>relations</b> avec mes proches / les autres." }
                ]
            },
            {
                id: "rub10",
                title: "10. Bien-être mental global",
                badge: "Étape 2 – R10",
                color: "#05CF8F",
                questions: [
                    { text: "Je sens que j'ai de l'<b>énergie</b>." },
                    { text: "Je me sens <b>utile</b>." },
                    { text: "Je me sens <b>confiant·e</b> quant à ma capacité à <b>faire face</b> aux difficultés." },
                    { text: "Je ressens du <b>plaisir</b> ou de l'<b>intérêt</b> à être avec les autres et/ou apprendre et/ou « faire »." },
                    { text: "Je me sens globalement <b>joyeux·se</b> et/ou <b>serein·e</b> et/ou <b>détendu·e</b>." }
                ]
            }
        ]
    }
};

const SCALE_LABELS = ["Jamais", "Rarement", "Parfois", "Souvent", "Très souvent"];

// Couleurs = couleur du chapitre guide associé à chaque rubrique
const RUBRIQUE_COLORS = {
    rub1:  "#FF08C3",  // Guide #04 – Magenta
    rub2:  "#FDD27E",  // Guide #07 – Jaune doux
    rub3:  "#FF743E",  // Guide #06 – Orange vif
    rub4:  "#EE2E63",  // Guide #05 – Rouge rosé
    rub5:  "#EE2E63",  // Guide #05 – Rouge rosé
    rub6:  "#FF93D6",  // Guide #03 – Rose clair
    rub7:  "#C7A2DE",  // Guide #02 – Mauve
    rub8:  "#C7A2DE",  // Guide #09 – Mauve
    rub9:  "#88D8B7",  // Guide #08 – Vert menthe
    rub10: "#05CF8F"   // Guide #10 – Vert émeraude
};

const RUBRIQUE_NAMES = {
    rub1: "Attention, mémoire et charge mentale",
    rub2: "Organisation matérielle et environnement",
    rub3: "Gestion du temps et planification",
    rub4: "Initiation de l'action et priorités",
    rub5: "Motivation et engagement",
    rub6: "Impulsivité, émotions et comportements à risque",
    rub7: "Vie quotidienne et hygiène de vie",
    rub8: "Fonctionnement au travail / dans les études",
    rub9: "Interactions sociales et communication",
    rub10: "Bien-être mental global"
};

const RUBRIQUE_NAMES_SHORT = {
    rub1: "Attention & mémoire",
    rub2: "Organisation",
    rub3: "Gestion du temps",
    rub4: "Initiation & priorités",
    rub5: "Motivation",
    rub6: "Impulsivité & émotions",
    rub7: "Vie quotidienne",
    rub8: "Travail / études",
    rub9: "Interactions sociales"
};

// Numéros de chapitre guide liés aux rubriques
const RUBRIQUE_GUIDE_CHAPTER = {
    rub1: "#04", rub2: "#07", rub3: "#06", rub4: "#05", rub5: "#05",
    rub6: "#03", rub7: "#02", rub8: "#09", rub9: "#08", rub10: "#10"
};

// Images du guide pour chaque rubrique (numéro du guide = nom du fichier)
const RUBRIQUE_GUIDE_IMAGE = {
    rub1: "assets/guide-04.png",
    rub2: "assets/guide-07.png",
    rub3: "assets/guide-06.png",
    rub4: "assets/guide-05.png",
    rub5: "assets/guide-05.png",
    rub6: "assets/guide-03.png",
    rub7: "assets/guide-02.png",
    rub8: "assets/guide-09.png",
    rub9: "assets/guide-08.png",
    rub10: "assets/guide-10.png"
};

// Titres des chapitres du guide
const RUBRIQUE_GUIDE_TITLE = {
    rub1: "Développer son attention et sa mémoire",
    rub2: "Structurer et aménager son environnement",
    rub3: "S'organiser et gérer son temps",
    rub4: "Trouver la motivation et passer à l'action",
    rub5: "Trouver la motivation et passer à l'action",
    rub6: "Réguler son impulsivité et ses émotions",
    rub7: "Prendre soin de soi",
    rub8: "Suivre son évolution et se faire accompagner",
    rub9: "Améliorer ses interactions et sa communication",
    rub10: "Reprendre le contrôle"
};

// Liens d'achat par rubrique questionnaire (via chapitre guide correspondant)
const RUBRIQUE_BUY_LINK = {
    rub1: "https://symbiosepsychologie.podia.com/04-developper-son-attention-sa-memoire",        // Guide #04
    rub2: "https://symbiosepsychologie.podia.com/test-du",                                       // Guide #07
    rub3: "https://symbiosepsychologie.podia.com/06-s-organiser",                                // Guide #06
    rub4: "https://symbiosepsychologie.podia.com/05-trouver-la-motivation-passer-a-l-action",    // Guide #05
    rub5: "https://symbiosepsychologie.podia.com/05-trouver-la-motivation-passer-a-l-action",    // Guide #05
    rub6: "https://symbiosepsychologie.podia.com/03-reguler-ses-emotions-son-impulsivite",       // Guide #03
    rub7: "https://symbiosepsychologie.podia.com/4-rubriques",                                   // Guide #02
    rub8: "https://symbiosepsychologie.podia.com/4-rubriques",                                   // Guide #09
    rub9: "https://symbiosepsychologie.podia.com/bubdke",                                        // Guide #08
    rub10: "https://symbiosepsychologie.podia.com/4-rubriques"                                   // Guide #10
};

// Lien vers le guide complet
const GUIDE_LINK = "https://symbiosepsychologie.podia.com/guide-interactif-apprivoiser-son-tdah";

// ==========================================
// STATE
// ==========================================

let allSections = [];
let currentSectionIndex = 0;
let answers = {};
let chartInstances = {};

// Build flat list of sections
function buildSections() {
    allSections = [];
    QUESTIONNAIRE.etape1.sections.forEach(s => {
        allSections.push({ ...s, etape: 1, period: QUESTIONNAIRE.etape1.period });
    });
    // Transition marker
    allSections.push({ id: '_transition_1_2', type: 'transition' });
    QUESTIONNAIRE.etape2.sections.forEach(s => {
        allSections.push({ ...s, etape: 2, period: QUESTIONNAIRE.etape2.period });
    });
}

buildSections();

// ==========================================
// STORAGE
// ==========================================

const STORAGE_KEY = 'tdah_current';
const HISTORY_KEY = 'tdah_history';

function saveProgress() {
    const data = { answers, currentSectionIndex, timestamp: Date.now() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function loadProgress() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) return JSON.parse(raw);
    } catch (e) { /* ignore */ }
    return null;
}

function clearProgress() {
    localStorage.removeItem(STORAGE_KEY);
}

function getHistory() {
    try {
        const raw = localStorage.getItem(HISTORY_KEY);
        if (raw) return JSON.parse(raw);
    } catch (e) { /* ignore */ }
    return [];
}

function saveToHistory(evaluation) {
    const history = getHistory();
    history.push(evaluation);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

function deleteFromHistory(index) {
    const history = getHistory();
    history.splice(index, 1);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

// ==========================================
// NAVIGATION
// ==========================================

function navigateTo(page) {
    document.querySelectorAll('.page').forEach(p => p.style.display = 'none');
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));

    const progressEl = document.getElementById('progress-container');

    switch (page) {
        case 'home':
            document.getElementById('page-home').style.display = 'block';
            document.getElementById('btn-home').classList.add('active');
            progressEl.style.display = 'none';
            checkResume();
            break;
        case 'questionnaire':
            document.getElementById('page-questionnaire').style.display = 'block';
            progressEl.style.display = 'block';
            break;
        case 'transition':
            document.getElementById('page-transition').style.display = 'block';
            progressEl.style.display = 'block';
            break;
        case 'results':
            document.getElementById('page-results').style.display = 'block';
            progressEl.style.display = 'none';
            break;
        case 'history':
            document.getElementById('page-history').style.display = 'block';
            document.getElementById('btn-history').classList.add('active');
            progressEl.style.display = 'none';
            renderHistory();
            break;
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function checkResume() {
    const saved = loadProgress();
    const banner = document.getElementById('resume-banner');
    if (saved && Object.keys(saved.answers).length > 0) {
        banner.style.display = 'flex';
    } else {
        banner.style.display = 'none';
    }
}

// ==========================================
// QUESTIONNAIRE FLOW
// ==========================================

function startQuestionnaire() {
    answers = {};
    currentSectionIndex = 0;
    clearProgress();
    navigateTo('questionnaire');
    renderSection();
}

function resumeQuestionnaire() {
    const saved = loadProgress();
    if (saved) {
        answers = saved.answers || {};
        currentSectionIndex = saved.currentSectionIndex || 0;
        // If we were on a transition, move to it
        if (allSections[currentSectionIndex].type === 'transition') {
            showTransition();
        } else {
            navigateTo('questionnaire');
            renderSection();
        }
    } else {
        startQuestionnaire();
    }
}

function resetCurrent() {
    clearProgress();
    answers = {};
    currentSectionIndex = 0;
    checkResume();
    showToast("Évaluation réinitialisée");
}

function renderSection() {
    const section = allSections[currentSectionIndex];
    if (!section || section.type === 'transition') return;

    // Header with rubrique color accent
    const badge = document.getElementById('section-badge');
    badge.textContent = section.badge;
    document.getElementById('section-title').textContent = section.title;
    document.getElementById('section-description').textContent = section.period;

    // Apply rubrique color to badge if available
    if (section.color) {
        badge.style.background = hexToRgba(section.color, 0.12);
        badge.style.color = section.color;
    } else {
        badge.style.background = '';
        badge.style.color = '';
    }

    // Questions
    const container = document.getElementById('questions-container');
    container.innerHTML = '';

    section.questions.forEach((q, i) => {
        const globalIndex = getGlobalQuestionIndex(currentSectionIndex, i);
        const key = `${section.id}_${i}`;
        // Support both object {text, detail} and plain string questions
        const questionText = typeof q === 'object' ? q.text : q;
        const questionDetail = typeof q === 'object' && q.detail ? q.detail : '';
        const div = document.createElement('div');
        div.className = 'question-item';
        div.innerHTML = `
            <div class="question-text">
                <span class="question-number" ${section.color ? `style="color:${section.color}"` : ''}>${globalIndex}.</span>
                ${questionText}
                ${questionDetail ? `<span class="question-detail">${questionDetail}</span>` : ''}
            </div>
            <div class="options-group" role="radiogroup" aria-label="Question ${globalIndex}">
                ${SCALE_LABELS.map((label, val) => `
                    <button class="option-btn ${answers[key] === val ? 'selected' : ''}"
                            onclick="selectAnswer('${key}', ${val}, this)"
                            role="radio"
                            aria-checked="${answers[key] === val}"
                            aria-label="${label} (${val})"
                            ${section.color && answers[key] === val ? `style="border-color:${section.color};background:${hexToRgba(section.color, 0.08)};color:${section.color}"` : ''}>
                        <span class="option-value">${val}</span>
                        ${label}
                    </button>
                `).join('')}
            </div>
        `;
        container.appendChild(div);
    });

    // Nav buttons
    document.getElementById('btn-prev').disabled = currentSectionIndex === 0;

    const isLast = currentSectionIndex === allSections.length - 1;
    const btnNext = document.getElementById('btn-next');
    btnNext.textContent = '';
    if (isLast) {
        btnNext.innerHTML = 'Voir les résultats <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>';
    } else {
        btnNext.innerHTML = 'Suivant <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>';
    }

    updateProgress();
    saveProgress();
}

function getGlobalQuestionIndex(sectionIdx, questionIdx) {
    let count = 0;
    for (let i = 0; i < sectionIdx; i++) {
        if (allSections[i].questions) {
            count += allSections[i].questions.length;
        }
    }
    return count + questionIdx + 1;
}

function selectAnswer(key, value, btn) {
    answers[key] = value;
    const section = allSections[currentSectionIndex];
    const group = btn.parentElement;
    group.querySelectorAll('.option-btn').forEach(b => {
        b.classList.remove('selected');
        b.setAttribute('aria-checked', 'false');
        b.style.borderColor = '';
        b.style.background = '';
        b.style.color = '';
    });
    btn.classList.add('selected');
    btn.setAttribute('aria-checked', 'true');
    // Apply rubrique color if available
    if (section && section.color) {
        btn.style.borderColor = section.color;
        btn.style.background = hexToRgba(section.color, 0.08);
        btn.style.color = section.color;
    }
    saveProgress();
    updateProgress();
}

function nextSection() {
    const section = allSections[currentSectionIndex];

    // Check all questions answered
    if (section.questions) {
        const unanswered = section.questions.some((_, i) => {
            const key = `${section.id}_${i}`;
            return answers[key] === undefined;
        });
        if (unanswered) {
            showToast("Veuillez répondre à toutes les questions avant de continuer.");
            // Highlight first unanswered
            highlightUnanswered(section);
            return;
        }
    }

    currentSectionIndex++;
    saveProgress();

    if (currentSectionIndex >= allSections.length) {
        showResults();
        return;
    }

    if (allSections[currentSectionIndex].type === 'transition') {
        showTransition();
    } else {
        renderSection();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

function prevSection() {
    if (currentSectionIndex > 0) {
        currentSectionIndex--;
        if (allSections[currentSectionIndex].type === 'transition') {
            currentSectionIndex--;
        }
        saveProgress();
        renderSection();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

function highlightUnanswered(section) {
    const container = document.getElementById('questions-container');
    const items = container.querySelectorAll('.question-item');
    for (let i = 0; i < section.questions.length; i++) {
        const key = `${section.id}_${i}`;
        if (answers[key] === undefined) {
            items[i].scrollIntoView({ behavior: 'smooth', block: 'center' });
            items[i].style.animation = 'none';
            items[i].offsetHeight; // force reflow
            items[i].style.animation = '';
            items[i].style.background = '#FEF9E7';
            setTimeout(() => { items[i].style.background = ''; }, 2000);
            break;
        }
    }
}

function showTransition() {
    document.getElementById('transition-title').textContent = "Passons à l'étape 2";
    document.getElementById('transition-text').textContent =
        "La première partie a exploré la fréquence de vos symptômes. La suite va maintenant évaluer leur impact concret dans votre vie quotidienne. Ces deux dimensions sont complémentaires : la sévérité des symptômes éclaire sur le fonctionnement, les répercussions indiquent où agir en priorité.";
    navigateTo('transition');
    updateProgress();
}

function continueAfterTransition() {
    currentSectionIndex++;
    saveProgress();
    if (currentSectionIndex < allSections.length) {
        navigateTo('questionnaire');
        renderSection();
    }
}

// ==========================================
// PROGRESS BAR
// ==========================================

function updateProgress() {
    const totalQuestions = getTotalQuestions();
    const answeredCount = Object.keys(answers).length;
    const pct = Math.round((answeredCount / totalQuestions) * 100);
    document.getElementById('progress-fill').style.width = pct + '%';
    document.getElementById('progress-text').textContent = `${answeredCount} / ${totalQuestions} questions (${pct}%)`;
}

function getTotalQuestions() {
    let total = 0;
    allSections.forEach(s => {
        if (s.questions) total += s.questions.length;
    });
    return total;
}

// ==========================================
// SCORING
// ==========================================

function calculateScores() {
    const scores = {};

    // Étape 1
    scores.inattention = sumSection('inattention', 9);
    scores.hyperactivite = sumSection('hyperactivite', 9);

    // Étape 2 - Rubriques 1-9
    for (let r = 1; r <= 9; r++) {
        scores[`rub${r}`] = sumSection(`rub${r}`, 5);
    }

    // Rubrique 10 - Bien-être
    scores.rub10 = sumSection('rub10', 5);

    // Total rubriques 1-9
    scores.totalRepercussions = 0;
    for (let r = 1; r <= 9; r++) {
        scores.totalRepercussions += scores[`rub${r}`];
    }

    return scores;
}

function sumSection(sectionId, count) {
    let sum = 0;
    for (let i = 0; i < count; i++) {
        const key = `${sectionId}_${i}`;
        sum += (answers[key] !== undefined ? answers[key] : 0);
    }
    return sum;
}

function getSymptomLevel(score) {
    if (score <= 11) return { label: "Pas ou peu de symptômes", class: "level-low", color: "#27AE60" };
    if (score <= 23) return { label: "Symptômes modérés", class: "level-moderate", color: "#D4AC0D" };
    return { label: "Symptômes fréquents et marqués", class: "level-very-high", color: "#E74C3C" };
}

function getRubriqueLevel(score) {
    if (score <= 6) return { label: "Priorité faible", class: "level-low", barClass: "bar-low", color: "#27AE60" };
    if (score <= 12) return { label: "Priorité modérée", class: "level-moderate", barClass: "bar-moderate", color: "#D4AC0D" };
    if (score <= 16) return { label: "Priorité élevée", class: "level-high", barClass: "bar-high", color: "#E67E22" };
    return { label: "Priorité très élevée", class: "level-very-high", barClass: "bar-very-high", color: "#E74C3C" };
}

function getWellbeingLevel(score) {
    if (score <= 6) return { label: "Niveau fragile", class: "level-very-high", color: "#E74C3C", desc: "Votre bien-être semble actuellement fragilisé. Un soutien professionnel pourrait vous aider." };
    if (score <= 12) return { label: "Niveau moyen", class: "level-moderate", color: "#D4AC0D", desc: "Votre bien-être est variable. Certains ajustements pourraient l'améliorer." };
    if (score <= 16) return { label: "Niveau élevé", class: "level-low", color: "#27AE60", desc: "Vous disposez de bonnes ressources personnelles." };
    return { label: "Niveau très élevé", class: "level-low", color: "#27AE60", desc: "Vous présentez un bon niveau de bien-être global." };
}

// ==========================================
// RESULTS DISPLAY
// ==========================================

function showResults() {
    const scores = calculateScores();
    clearProgress();
    navigateTo('results');
    renderScoreBlocks(scores);
    renderSymptomsChart(scores);
    renderRubriqueScores(scores);
    renderRadarChart(scores);
    renderWellbeing(scores);
    renderTotalScore(scores);
    renderPriorities(scores);
    renderGuideLink();
}

function renderGuideLink() {
    const container = document.getElementById('guide-link-container');
    if (!container) return;
    container.innerHTML = `
        <div class="guide-cta">
            <img src="assets/guide-01.png" alt="Guide TDAH" class="guide-cta-img" onerror="this.style.display='none'">
            <div class="guide-cta-text">
                <h4>Apprivoiser son TDAH au quotidien</h4>
                <p>Retrouvez toutes les stratégies et outils dans le guide interactif complet, conçu pour accompagner votre progression pas à pas.</p>
            </div>
            <a href="${GUIDE_LINK}" target="_blank" rel="noopener" class="btn btn-primary">
                Découvrir le guide complet
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>
            </a>
        </div>
    `;
}

function renderScoreBlocks(scores) {
    const inattLevel = getSymptomLevel(scores.inattention);
    const inattBlock = document.getElementById('score-inattention');
    inattBlock.style.background = hexToRgba(inattLevel.color, 0.08);
    inattBlock.innerHTML = `
        <div class="score-block-label" style="color: ${inattLevel.color};">Inattention</div>
        <div class="score-block-value" style="color: ${inattLevel.color};">${scores.inattention}</div>
        <div class="score-block-max">/ 36</div>
        <span class="score-block-level ${inattLevel.class}">${inattLevel.label}</span>
    `;

    const hyperLevel = getSymptomLevel(scores.hyperactivite);
    const hyperBlock = document.getElementById('score-hyperactivite');
    hyperBlock.style.background = hexToRgba(hyperLevel.color, 0.08);
    hyperBlock.innerHTML = `
        <div class="score-block-label" style="color: ${hyperLevel.color};">Hyperactivité / Impulsivité</div>
        <div class="score-block-value" style="color: ${hyperLevel.color};">${scores.hyperactivite}</div>
        <div class="score-block-max">/ 36</div>
        <span class="score-block-level ${hyperLevel.class}">${hyperLevel.label}</span>
    `;
}

function renderSymptomsChart(scores) {
    destroyChart('chart-symptoms');
    const ctx = document.getElementById('chart-symptoms').getContext('2d');
    const inattLevel = getSymptomLevel(scores.inattention);
    const hyperLevel = getSymptomLevel(scores.hyperactivite);

    chartInstances['chart-symptoms'] = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Inattention', 'Hyperactivité / Impulsivité'],
            datasets: [{
                data: [scores.inattention, scores.hyperactivite],
                backgroundColor: [hexToRgba(inattLevel.color, 0.7), hexToRgba(hyperLevel.color, 0.7)],
                borderColor: [inattLevel.color, hyperLevel.color],
                borderWidth: 2,
                borderRadius: 6,
                barThickness: 48
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: ctx => `${ctx.raw} / 36`
                    }
                }
            },
            scales: {
                x: {
                    max: 36,
                    grid: { color: '#F0F0F0' },
                    ticks: { font: { family: 'Inter' } }
                },
                y: {
                    grid: { display: false },
                    ticks: { font: { family: 'Inter', weight: 500 } }
                }
            }
        }
    });
}

function renderRubriqueScores(scores) {
    const container = document.getElementById('rubrique-scores');
    container.innerHTML = '';

    for (let r = 1; r <= 9; r++) {
        const rubKey = `rub${r}`;
        const score = scores[rubKey];
        const level = getRubriqueLevel(score);
        const rubColor = RUBRIQUE_COLORS[rubKey];
        const pct = (score / 20) * 100;
        const chapter = RUBRIQUE_GUIDE_CHAPTER[rubKey];
        const guideImage = RUBRIQUE_GUIDE_IMAGE[rubKey];
        const guideTitle = RUBRIQUE_GUIDE_TITLE[rubKey];

        container.innerHTML += `
            <div class="rubrique-card" style="border-left: 4px solid ${rubColor};">
                <div class="rubrique-card-header">
                    <img src="${guideImage}" alt="${guideTitle}" class="rubrique-img" onerror="this.style.display='none'">
                    <div class="rubrique-card-info">
                        <span class="rubrique-name" style="color:${rubColor};">${RUBRIQUE_NAMES[rubKey]}</span>
                        <span class="rubrique-chapter-label" style="background:${rubColor};color:#fff;">${chapter} ${guideTitle}</span>
                    </div>
                </div>
                <div class="rubrique-card-score">
                    <div class="rubrique-bar-container">
                        <div class="rubrique-bar" style="width: ${pct}%; background: ${rubColor};"></div>
                    </div>
                    <span class="rubrique-score-text" style="color:${rubColor};">${score}/20</span>
                    <span class="rubrique-level ${level.class}">${level.label}</span>
                </div>
            </div>
        `;
    }
}

function renderRadarChart(scores) {
    destroyChart('chart-radar');
    const ctx = document.getElementById('chart-radar').getContext('2d');
    const labels = [];
    const data = [];
    const pointColors = [];

    for (let r = 1; r <= 9; r++) {
        labels.push(RUBRIQUE_NAMES_SHORT[`rub${r}`]);
        data.push(scores[`rub${r}`]);
        pointColors.push(RUBRIQUE_COLORS[`rub${r}`]);
    }

    // Label colors matching each rubrique
    const labelColors = Object.keys(RUBRIQUE_COLORS).slice(0, 9).map(k => RUBRIQUE_COLORS[k]);

    chartInstances['chart-radar'] = new Chart(ctx, {
        type: 'radar',
        data: {
            labels,
            datasets: [{
                label: 'Score',
                data,
                backgroundColor: 'rgba(91, 143, 185, 0.12)',
                borderColor: '#5B8FB9',
                borderWidth: 2,
                pointBackgroundColor: pointColors,
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: { display: false }
            },
            scales: {
                r: {
                    min: 0,
                    max: 20,
                    ticks: {
                        stepSize: 5,
                        font: { size: 10, family: 'Inter' },
                        backdropColor: 'transparent'
                    },
                    pointLabels: {
                        font: { size: 11, family: 'Inter', weight: 500 },
                        color: labelColors
                    },
                    grid: { color: '#E8ECF0' },
                    angleLines: { color: '#E8ECF0' }
                }
            }
        }
    });
}

function renderWellbeing(scores) {
    const score = scores.rub10;
    const level = getWellbeingLevel(score);
    const rub10Color = RUBRIQUE_COLORS.rub10;
    const container = document.getElementById('wellbeing-container');

    container.innerHTML = `
        <img src="${RUBRIQUE_GUIDE_IMAGE.rub10}" alt="${RUBRIQUE_GUIDE_TITLE.rub10}" class="wellbeing-img" onerror="this.style.display='none'">
        <span class="rubrique-chapter-label" style="background:${rub10Color};color:#fff;">${RUBRIQUE_GUIDE_CHAPTER.rub10} ${RUBRIQUE_GUIDE_TITLE.rub10}</span>
        <div class="wellbeing-score" style="color: ${rub10Color};">${score} <span style="font-size:1rem;color:#B0BEC5;">/ 20</span></div>
        <span class="wellbeing-label ${level.class}">${level.label}</span>
        <p class="wellbeing-desc">${level.desc}</p>
    `;
}

function renderTotalScore(scores) {
    const total = scores.totalRepercussions;
    const pct = (total / 180) * 100;
    let color = '#27AE60';
    if (pct > 70) color = '#E74C3C';
    else if (pct > 50) color = '#E67E22';
    else if (pct > 30) color = '#D4AC0D';

    document.getElementById('total-score-container').innerHTML = `
        <div class="total-score-value" style="color: ${color};">${total} <span class="total-score-max">/ 180</span></div>
        <div class="total-score-bar">
            <div class="total-score-fill" style="width: ${pct}%; background: ${color};"></div>
        </div>
        <p style="font-size:0.85rem;color:#8494A0;margin-top:8px;">Score total des répercussions fonctionnelles (rubriques 1-9)</p>
    `;
}

function renderPriorities(scores) {
    const priorities = [];
    for (let r = 1; r <= 9; r++) {
        const rubKey = `rub${r}`;
        const score = scores[rubKey];
        if (score >= 13) {
            priorities.push({
                name: RUBRIQUE_NAMES[rubKey],
                rubNum: r,
                score,
                level: getRubriqueLevel(score),
                color: RUBRIQUE_COLORS[rubKey],
                chapter: RUBRIQUE_GUIDE_CHAPTER[rubKey],
                guideImage: RUBRIQUE_GUIDE_IMAGE[rubKey],
                guideTitle: RUBRIQUE_GUIDE_TITLE[rubKey]
            });
        }
    }

    const card = document.getElementById('priorities-card');
    const list = document.getElementById('priorities-list');

    if (priorities.length === 0) {
        card.style.display = 'none';
        return;
    }

    card.style.display = 'block';
    priorities.sort((a, b) => b.score - a.score);

    list.innerHTML = priorities.map((p, i) => {
        const rubKey = `rub${p.rubNum}`;
        const buyLink = RUBRIQUE_BUY_LINK[rubKey];
        const showBuyBtn = i < 3 && buyLink;
        // Determine text color for buy button (dark text on light backgrounds like yellow)
        const buyBtnTextColor = isLightColor(p.color) ? '#333' : '#fff';
        return `
        <div class="priority-item" style="border-left-color:${p.color};background:${hexToRgba(p.color, 0.04)};">
            <img src="${p.guideImage}" alt="${p.guideTitle}" class="priority-img" onerror="this.style.display='none'">
            <div class="priority-info">
                <span class="priority-name">${p.name}</span>
                <span class="rubrique-chapter-label" style="background:${p.color};color:${isLightColor(p.color) ? '#555' : '#fff'};">${p.chapter} ${p.guideTitle}</span>
                ${showBuyBtn ? `<a href="${buyLink}" target="_blank" rel="noopener" class="btn-buy" style="background:${p.color};color:${buyBtnTextColor};">Acheter cette rubrique <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg></a>` : ''}
            </div>
            <span class="priority-score" style="color:${p.color}">${p.score}/20</span>
        </div>
    `;
    }).join('');
}

// ==========================================
// SAVE EVALUATION
// ==========================================

function saveEvaluation() {
    const scores = calculateScores();
    const evaluation = {
        date: new Date().toISOString(),
        scores,
        answers: { ...answers }
    };
    saveToHistory(evaluation);
    showToast("Évaluation sauvegardée !");
}

// ==========================================
// HISTORY
// ==========================================

function renderHistory() {
    const history = getHistory();
    const list = document.getElementById('history-list');
    const empty = document.getElementById('history-empty');
    const evoCard = document.getElementById('evolution-card');

    if (history.length === 0) {
        list.style.display = 'none';
        empty.style.display = 'block';
        evoCard.style.display = 'none';
        return;
    }

    list.style.display = 'block';
    empty.style.display = 'none';

    list.innerHTML = history.map((ev, i) => {
        const d = new Date(ev.date);
        const dateStr = d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });
        const timeStr = d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
        return `
            <div class="history-item">
                <div>
                    <div class="history-date">${dateStr} à ${timeStr}</div>
                    <div class="history-scores">
                        Inatt. ${ev.scores.inattention}/36 · Hyp. ${ev.scores.hyperactivite}/36 · Total ${ev.scores.totalRepercussions}/180
                    </div>
                </div>
                <div class="history-actions">
                    <button class="history-btn history-btn-view" onclick="viewHistoryItem(${i})">Voir</button>
                    <button class="history-btn history-btn-delete" onclick="confirmDeleteHistory(${i})">Supprimer</button>
                </div>
            </div>
        `;
    }).join('');

    // Evolution chart
    if (history.length >= 2) {
        evoCard.style.display = 'block';
        renderEvolutionChart(history);
    } else {
        evoCard.style.display = 'none';
    }
}

function viewHistoryItem(index) {
    const history = getHistory();
    const ev = history[index];
    if (!ev) return;
    answers = ev.answers;
    showResults();
}

function confirmDeleteHistory(index) {
    if (confirm("Supprimer cette évaluation ?")) {
        deleteFromHistory(index);
        renderHistory();
        showToast("Évaluation supprimée");
    }
}

function renderEvolutionChart(history) {
    destroyChart('chart-evolution');
    const ctx = document.getElementById('chart-evolution').getContext('2d');

    const labels = history.map(ev => {
        const d = new Date(ev.date);
        return d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
    });

    chartInstances['chart-evolution'] = new Chart(ctx, {
        type: 'line',
        data: {
            labels,
            datasets: [
                {
                    label: 'Inattention (/36)',
                    data: history.map(ev => ev.scores.inattention),
                    borderColor: '#5B8FB9',
                    backgroundColor: 'rgba(91,143,185,0.1)',
                    tension: 0.3,
                    fill: false,
                    pointRadius: 5,
                    pointBackgroundColor: '#5B8FB9'
                },
                {
                    label: 'Hyperactivité (/36)',
                    data: history.map(ev => ev.scores.hyperactivite),
                    borderColor: '#E67E22',
                    backgroundColor: 'rgba(230,126,34,0.1)',
                    tension: 0.3,
                    fill: false,
                    pointRadius: 5,
                    pointBackgroundColor: '#E67E22'
                },
                {
                    label: 'Total réperc. (/180)',
                    data: history.map(ev => ev.scores.totalRepercussions),
                    borderColor: '#27AE60',
                    backgroundColor: 'rgba(39,174,96,0.1)',
                    tension: 0.3,
                    fill: false,
                    pointRadius: 5,
                    pointBackgroundColor: '#27AE60',
                    yAxisID: 'y1'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            interaction: { mode: 'index', intersect: false },
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { font: { family: 'Inter', size: 11 }, usePointStyle: true }
                }
            },
            scales: {
                y: {
                    min: 0,
                    max: 36,
                    title: { display: true, text: 'Symptômes', font: { family: 'Inter', size: 11 } },
                    grid: { color: '#F0F0F0' }
                },
                y1: {
                    min: 0,
                    max: 180,
                    position: 'right',
                    title: { display: true, text: 'Répercussions', font: { family: 'Inter', size: 11 } },
                    grid: { display: false }
                },
                x: {
                    grid: { color: '#F0F0F0' },
                    ticks: { font: { family: 'Inter' } }
                }
            }
        }
    });
}

// ==========================================
// PDF EXPORT
// ==========================================

async function exportPDF() {
    showToast("Génération du PDF en cours...");

    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = 210;
    const margin = 15;
    const contentWidth = pageWidth - 2 * margin;
    let y = margin;

    const scores = calculateScores();

    // Helper functions
    function addText(text, x, yPos, options = {}) {
        const { size = 10, style = 'normal', color = [44, 62, 80], align = 'left', maxWidth = contentWidth } = options;
        pdf.setFontSize(size);
        pdf.setFont('helvetica', style);
        pdf.setTextColor(...color);
        const lines = pdf.splitTextToSize(text, maxWidth);
        pdf.text(lines, x, yPos, { align });
        return lines.length * size * 0.4;
    }

    function checkNewPage(needed) {
        if (y + needed > 280) {
            pdf.addPage();
            y = margin;
        }
    }

    function drawColorBar(x, yPos, width, height, pct, color) {
        pdf.setFillColor(230, 230, 230);
        pdf.roundedRect(x, yPos, width, height, 2, 2, 'F');
        pdf.setFillColor(...color);
        pdf.roundedRect(x, yPos, width * (pct / 100), height, 2, 2, 'F');
    }

    function hexToRgbArray(hex) {
        const m = hex.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
        return m ? [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)] : [0, 0, 0];
    }

    // Title
    addText('Auto-évaluation TDAH', margin, y, { size: 18, style: 'bold', color: [91, 143, 185] });
    y += 10;
    addText('@le.neuropsy', margin, y, { size: 10, color: [128, 148, 160] });
    y += 6;

    const dateStr = new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });
    addText(`Date de l'évaluation : ${dateStr}`, margin, y, { size: 10 });
    y += 10;

    // Line
    pdf.setDrawColor(200, 200, 200);
    pdf.line(margin, y, pageWidth - margin, y);
    y += 8;

    // ÉTAPE 1
    addText('Étape 1 : Sévérité des symptômes', margin, y, { size: 14, style: 'bold', color: [91, 143, 185] });
    y += 10;

    // Inattention
    const inattLevel = getSymptomLevel(scores.inattention);
    addText(`Inattention : ${scores.inattention} / 36`, margin, y, { size: 11, style: 'bold' });
    y += 5;
    drawColorBar(margin, y, contentWidth * 0.6, 5, (scores.inattention / 36) * 100, hexToRgbArray(inattLevel.color));
    y += 7;
    addText(inattLevel.label, margin, y, { size: 9, color: hexToRgbArray(inattLevel.color) });
    y += 8;

    // Hyperactivité
    const hyperLevel = getSymptomLevel(scores.hyperactivite);
    addText(`Hyperactivité / Impulsivité : ${scores.hyperactivite} / 36`, margin, y, { size: 11, style: 'bold' });
    y += 5;
    drawColorBar(margin, y, contentWidth * 0.6, 5, (scores.hyperactivite / 36) * 100, hexToRgbArray(hyperLevel.color));
    y += 7;
    addText(hyperLevel.label, margin, y, { size: 9, color: hexToRgbArray(hyperLevel.color) });
    y += 12;

    // ÉTAPE 2
    checkNewPage(60);
    addText('Étape 2 : Répercussions fonctionnelles & bien-être', margin, y, { size: 14, style: 'bold', color: [91, 143, 185] });
    y += 10;

    for (let r = 1; r <= 9; r++) {
        checkNewPage(16);
        const score = scores[`rub${r}`];
        const level = getRubriqueLevel(score);
        const name = RUBRIQUE_NAMES[`rub${r}`];
        const rubColor = RUBRIQUE_COLORS[`rub${r}`];
        const chapter = RUBRIQUE_GUIDE_CHAPTER[`rub${r}`];

        // Rubrique number circle + name
        pdf.setFillColor(...hexToRgbArray(rubColor));
        pdf.circle(margin + 3, y - 1.5, 3, 'F');
        pdf.setFontSize(7);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(255, 255, 255);
        pdf.text(`${r}`, margin + 3, y - 0.5, { align: 'center' });

        addText(`${name} : ${score} / 20`, margin + 8, y, { size: 10, style: 'bold' });
        addText(`${level.label}  ${chapter}`, margin + contentWidth * 0.7, y, { size: 8, color: hexToRgbArray(rubColor) });
        y += 5;
        drawColorBar(margin + 8, y, contentWidth * 0.55, 4, (score / 20) * 100, hexToRgbArray(rubColor));
        y += 8;
    }

    // Bien-être
    checkNewPage(20);
    y += 4;
    const wbLevel = getWellbeingLevel(scores.rub10);
    const rub10Col = hexToRgbArray(RUBRIQUE_COLORS.rub10);
    pdf.setFillColor(...rub10Col);
    pdf.circle(margin + 3, y - 1.5, 3, 'F');
    pdf.setFontSize(7);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(255, 255, 255);
    pdf.text('10', margin + 3, y - 0.5, { align: 'center' });
    addText(`Bien-être mental global : ${scores.rub10} / 20`, margin + 8, y, { size: 11, style: 'bold' });
    y += 6;
    addText(`${wbLevel.label} – ${wbLevel.desc}`, margin + 8, y, { size: 9, color: rub10Col });
    y += 10;

    // Total
    checkNewPage(20);
    addText(`Score total des répercussions : ${scores.totalRepercussions} / 180`, margin, y, { size: 12, style: 'bold', color: [91, 143, 185] });
    y += 10;

    // Priorities
    const priorities = [];
    for (let r = 1; r <= 9; r++) {
        if (scores[`rub${r}`] >= 13) {
            priorities.push({ name: RUBRIQUE_NAMES[`rub${r}`], score: scores[`rub${r}`], rubNum: r, color: RUBRIQUE_COLORS[`rub${r}`], chapter: RUBRIQUE_GUIDE_CHAPTER[`rub${r}`] });
        }
    }
    if (priorities.length > 0) {
        checkNewPage(20 + priorities.length * 8);
        addText('Priorités d\'action', margin, y, { size: 12, style: 'bold', color: [231, 76, 60] });
        y += 6;
        priorities.sort((a, b) => b.score - a.score);
        priorities.forEach((p, i) => {
            addText(`${i + 1}. ${p.name} (${p.score}/20) – ${p.chapter}`, margin + 4, y, { size: 9, color: hexToRgbArray(p.color) });
            y += 5;
        });
        y += 6;
    }

    // Capture radar chart
    try {
        const radarCanvas = document.getElementById('chart-radar');
        if (radarCanvas) {
            checkNewPage(90);
            addText('Profil des répercussions fonctionnelles', margin, y, { size: 11, style: 'bold', color: [91, 143, 185] });
            y += 6;
            const imgData = radarCanvas.toDataURL('image/png');
            const imgWidth = 100;
            const imgHeight = 100;
            pdf.addImage(imgData, 'PNG', margin + (contentWidth - imgWidth) / 2, y, imgWidth, imgHeight);
            y += imgHeight + 8;
        }
    } catch (e) {
        // Silently skip if chart can't be captured
    }

    // Disclaimers
    checkNewPage(30);
    pdf.setDrawColor(200, 200, 200);
    pdf.line(margin, y, pageWidth - margin, y);
    y += 6;

    addText('Avertissement', margin, y, { size: 9, style: 'bold', color: [230, 126, 34] });
    y += 4;
    const disclaimer = "Cet outil d'auto-évaluation a une visée psychoéducative et d'orientation vers des stratégies concrètes. Il ne constitue en aucun cas un diagnostic médical. Les scores sont des repères pour observer votre fonctionnement et votre progression, non pour poser un diagnostic clinique.";
    y += addText(disclaimer, margin, y, { size: 8, color: [128, 128, 128] });
    y += 6;

    addText('Pour un accompagnement professionnel : symbiosepsychologie.podia.com', margin, y, { size: 8, color: [91, 143, 185] });
    y += 6;
    addText('Outil développé par @le.neuropsy', margin, y, { size: 8, color: [128, 148, 160] });

    // Save
    const filename = `Autoevaluation_TDAH_${new Date().toISOString().slice(0, 10)}.pdf`;
    pdf.save(filename);
    showToast("PDF téléchargé !");
}

// ==========================================
// UTILITIES
// ==========================================

function hexToRgba(hex, alpha) {
    const m = hex.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
    if (!m) return hex;
    return `rgba(${parseInt(m[1], 16)}, ${parseInt(m[2], 16)}, ${parseInt(m[3], 16)}, ${alpha})`;
}

function isLightColor(hex) {
    const m = hex.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
    if (!m) return false;
    const r = parseInt(m[1], 16), g = parseInt(m[2], 16), b = parseInt(m[3], 16);
    // Luminance relative (formule perceptuelle)
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.6;
}

function destroyChart(id) {
    if (chartInstances[id]) {
        chartInstances[id].destroy();
        delete chartInstances[id];
    }
}

function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
}

// ==========================================
// INIT
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    navigateTo('home');
});
