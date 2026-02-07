// --- THEME MANAGER ---
const Theme = {
    init: () => {
        const toggleBtn = document.getElementById('theme-toggle');
        const sunIcon = document.getElementById('sun-icon');
        const moonIcon = document.getElementById('moon-icon');
        const html = document.documentElement;

        // Check Local Storage or System Preference
        if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            html.classList.add('dark');
            sunIcon.classList.remove('hidden');
        } else {
            html.classList.remove('dark');
            moonIcon.classList.remove('hidden');
        }

        toggleBtn.addEventListener('click', () => {
            if (html.classList.contains('dark')) {
                html.classList.remove('dark');
                localStorage.theme = 'light';
                sunIcon.classList.add('hidden');
                moonIcon.classList.remove('hidden');
            } else {
                html.classList.add('dark');
                localStorage.theme = 'dark';
                moonIcon.classList.add('hidden');
                sunIcon.classList.remove('hidden');
            }
            Charts.updateTheme(); // Trigger chart color update
            UI.refreshActiveCard(); // Refresh current card highlight
        });
    }
};

// --- DATA STORE ---
const cvData = {
    experience: [
        {
            id: 1,
            company: "TOTVS TECHFIN",
            role: "Software Developer Analyst (Back-End)",
            period: "Nov 2022 – Present",
            location: "São Paulo, SP (Remote)",
            summary: "Leading refactoring of legacy systems into modern microservices for FinTech products.",
            points: [
                "Designing and implementing scalable microservices for the financial credit sector (Antecipa, Mais Negócios).",
                "Leading architectural refactoring of legacy systems into modern microservices using C# (.NET Core) and Java.",
                "Developing high-performance REST APIs ensuring resilience and security.",
                "Orchestrating containerized applications using Kubernetes and Docker in a Cloud-Native environment.",
                "Implementing asynchronous messaging with RabbitMQ to decouple services.",
                "Managing CI/CD pipelines in Azure DevOps for continuous delivery.",
                "Technical mentor for onboarding new developers."
            ],
            skills: [".NET Core", "C#", "Java", "Kubernetes", "Docker", "RabbitMQ", "PostgreSQL", "Azure DevOps", "Scrum"]
        },
        {
            id: 2,
            company: "Freelance",
            role: "Full-Stack Java Developer",
            period: "May 2022 – Aug 2022",
            location: "São Paulo, SP",
            summary: "Delivering end-to-end web and mobile solutions on demand.",
            points: [
                "Developed web and mobile systems on demand.",
                "Built robust back-end services using Spring Boot.",
                "Managed data persistence with MySQL.",
                "Implemented responsive front-end interfaces using Angular (JS, CSS, HTML).",
                "Collaborated directly with clients to define requirements and deliver MVP solutions."
            ],
            skills: ["Java", "Spring Boot", "Angular", "MySQL", "Full-Stack", "Git"]
        },
        {
            id: 3,
            company: "Generation Brasil",
            role: "Full-Stack Java Developer (Bootcamp)",
            period: "Feb 2022 – May 2022",
            location: "São Paulo, SP",
            summary: "Developed a social impact microblogging platform.",
            points: [
                "Designed and built a microblogging social platform focused on social impact.",
                "Developed Back-end API with Spring Boot and PostgreSQL.",
                "Deployed Front-end application using AngularJS on Netlify.",
                "Applied agile methodologies (Scrum)."
            ],
            skills: ["Java", "Spring Boot", "PostgreSQL", "Heroku", "Netlify", "Social Impact"]
        }
    ],
    chartData: {
        radar: {
            labels: ['Backend Logic', 'Cloud/DevOps', 'Database', 'Frontend', 'Soft Skills/Agile', 'System Arch'],
            data: [95, 85, 80, 60, 85, 90]
        },
        doughnut: {
            labels: ['C# / .NET', 'Java / Spring', 'Kubernetes / Docker', 'SQL / Postgres', 'JS / Angular'],
            data: [35, 30, 20, 10, 5]
        }
    }
};

// --- UI CONTROLLER ---
let currentJobIndex = 0; // State to track selected job

const UI = {
    renderJobList: () => {
        const listContainer = document.getElementById('job-list');
        listContainer.innerHTML = '';

        cvData.experience.forEach((job, index) => {
            const card = document.createElement('div');
            // Base classes
            let className = `p-5 rounded-xl border cursor-pointer transition-all duration-200 card-hover `;

            // Logic handled in refreshActiveCard, initially just ID
            card.id = `job-card-${index}`;
            card.onclick = () => UI.selectJob(index);

            card.innerHTML = `
                <div class="flex justify-between items-start mb-2">
                    <h3 class="font-bold text-stone-800 dark:text-stone-100">${job.company}</h3>
                    <span class="text-xs font-mono text-stone-500 dark:text-stone-400 bg-stone-100 dark:bg-stone-800 px-2 py-1 rounded">${job.period.split('–')[0]}</span>
                </div>
                <p class="text-sm font-medium text-orange-700 dark:text-orange-400 mb-1">${job.role}</p>
                <p class="text-xs text-stone-500 dark:text-stone-400 line-clamp-2">${job.summary}</p>
            `;
            listContainer.appendChild(card);
        });
        UI.refreshActiveCard();
    },

    refreshActiveCard: () => {
        cvData.experience.forEach((_, i) => {
            const card = document.getElementById(`job-card-${i}`);
            const isDark = document.documentElement.classList.contains('dark');

            if (i === currentJobIndex) {
                // Active Styles
                if (isDark) {
                    card.className = "p-5 rounded-xl border cursor-pointer transition-all duration-200 card-hover border-orange-500 bg-stone-800 ring-1 ring-orange-900";
                } else {
                    card.className = "p-5 rounded-xl border cursor-pointer transition-all duration-200 card-hover border-orange-500 bg-orange-50 ring-1 ring-orange-200";
                }
            } else {
                // Inactive Styles
                if (isDark) {
                    card.className = "p-5 rounded-xl border cursor-pointer transition-all duration-200 card-hover border-stone-700 bg-stone-900 hover:bg-stone-800";
                } else {
                    card.className = "p-5 rounded-xl border cursor-pointer transition-all duration-200 card-hover border-stone-200 bg-white hover:bg-stone-50";
                }
            }
        });
    },

    selectJob: (index) => {
        currentJobIndex = index;
        UI.refreshActiveCard();

        // Render Detail View
        const job = cvData.experience[index];
        const detailContainer = document.getElementById('job-detail-content');

        // Animate change
        detailContainer.classList.remove('fade-in');
        void detailContainer.offsetWidth; // trigger reflow
        detailContainer.classList.add('fade-in');

        detailContainer.innerHTML = `
            <div class="flex flex-col h-full">
                <div class="border-b border-stone-100 dark:border-stone-700 pb-4 mb-4">
                    <div class="flex justify-between items-center flex-wrap gap-2">
                        <h2 class="text-2xl font-bold text-stone-800 dark:text-stone-100">${job.role}</h2>
                        <span class="text-sm text-stone-500 dark:text-stone-400 font-mono">${job.period}</span>
                    </div>
                    <div class="flex items-center gap-2 mt-1 text-stone-600 dark:text-stone-300">
                        <span class="font-semibold">${job.company}</span>
                        <span class="text-stone-300 dark:text-stone-600">•</span>
                        <span class="text-sm">${job.location}</span>
                    </div>
                </div>

                <div class="flex-grow overflow-y-auto pr-2 custom-scrollbar">
                    <h4 class="text-sm uppercase tracking-wide text-stone-400 font-bold mb-3">Key Achievements</h4>
                    <ul class="space-y-3">
                        ${job.points.map(p => `
                            <li class="flex items-start gap-3 text-stone-700 dark:text-stone-300">
                                <span class="mt-1.5 w-1.5 h-1.5 bg-orange-500 rounded-full flex-shrink-0"></span>
                                <span class="leading-relaxed">${p}</span>
                            </li>
                        `).join('')}
                    </ul>
                </div>

                <div class="mt-6 pt-4 border-t border-stone-100 dark:border-stone-700">
                    <h4 class="text-sm uppercase tracking-wide text-stone-400 font-bold mb-3">Advanced Tech Stack</h4>
                    <div class="flex flex-wrap gap-2">
                        ${job.skills.map(s => `
                            <span class="px-3 py-1 bg-stone-800 dark:bg-stone-700 text-stone-100 dark:text-stone-100 rounded-lg text-sm font-medium shadow-sm border border-transparent dark:border-stone-600">${s}</span>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }
};

// --- CHARTS CONTROLLER ---
let radarChartInstance = null;
let doughnutChartInstance = null;

const Charts = {
    getThemeColors: () => {
        const isDark = document.documentElement.classList.contains('dark');
        return {
            text: isDark ? '#e7e5e4' : '#4b5563', // stone-200 vs stone-600
            grid: isDark ? '#44403c' : '#e5e7eb', // stone-700 vs gray-200
            bg: isDark ? '#1c1917' : '#ffffff'    // stone-900 vs white
        };
    },

    init: () => {
        Chart.defaults.font.family = "'Inter', sans-serif";
        const colors = Charts.getThemeColors();
        Chart.defaults.color = colors.text;

        // Radar Chart
        const radarCtx = document.getElementById('skillRadarChart').getContext('2d');
        radarChartInstance = new Chart(radarCtx, {
            type: 'radar',
            data: {
                labels: cvData.chartData.radar.labels,
                datasets: [{
                    label: 'Proficiency Level',
                    data: cvData.chartData.radar.data,
                    backgroundColor: 'rgba(234, 88, 12, 0.2)',
                    borderColor: 'rgba(234, 88, 12, 1)',
                    pointBackgroundColor: colors.bg,
                    pointBorderColor: 'rgba(234, 88, 12, 1)',
                    pointHoverBackgroundColor: colors.bg,
                    pointHoverBorderColor: 'rgba(234, 88, 12, 1)'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    r: {
                        angleLines: { color: colors.grid },
                        grid: { color: colors.grid },
                        pointLabels: {
                            font: { size: 12, weight: '600' },
                            color: colors.text
                        },
                        ticks: { display: false, max: 100, backdropColor: 'transparent' }
                    }
                },
                plugins: { legend: { display: false } }
            }
        });

        // Doughnut Chart
        const doughnutCtx = document.getElementById('techStackChart').getContext('2d');
        doughnutChartInstance = new Chart(doughnutCtx, {
            type: 'doughnut',
            data: {
                labels: cvData.chartData.doughnut.labels,
                datasets: [{
                    data: cvData.chartData.doughnut.data,
                    backgroundColor: [
                        '#ea580c', // Orange 600
                        '#f97316', // Orange 500
                        '#44403c', // Stone 700
                        '#78716c', // Stone 500
                        '#d6d3d1'  // Stone 300
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '65%',
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { usePointStyle: true, padding: 20, color: colors.text }
                    }
                }
            }
        });
    },

    updateTheme: () => {
        const colors = Charts.getThemeColors();

        // Update Radar
        if (radarChartInstance) {
            radarChartInstance.options.scales.r.angleLines.color = colors.grid;
            radarChartInstance.options.scales.r.grid.color = colors.grid;
            radarChartInstance.options.scales.r.pointLabels.color = colors.text;
            radarChartInstance.data.datasets[0].pointBackgroundColor = colors.bg;
            radarChartInstance.data.datasets[0].pointHoverBackgroundColor = colors.bg;
            radarChartInstance.update();
        }

        // Update Doughnut
        if (doughnutChartInstance) {
            doughnutChartInstance.options.plugins.legend.labels.color = colors.text;
            doughnutChartInstance.update();
        }
    }
};

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    Theme.init();
    UI.renderJobList();
    UI.selectJob(0); // Select first job by default
    Charts.init();
});
