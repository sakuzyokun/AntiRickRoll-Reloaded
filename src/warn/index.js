(() => {
        const translations = {
                ja: {
                        title: 'このリンクは RickRoll として登録されています!',
                        description: 'あなたはRick Astleyの動画に連れていかれようとしていました!',
                        back: '戻る',
                        continue: '続行',
                        pageTitle: 'Rickroll 注意!'
                },

                en: {
                        title: 'This link is registered as a RickRoll!',
                        description: 'You were about to be redirected to a Rick Astley video!',
                        back: 'Back',
                        continue: 'Continue',
                        pageTitle: 'Rickroll Warning!'
                }
        };

        // Japanese if the browser language starts with "ja".
        const lang = navigator.language.split('-')[0];

        const t = translations[lang] ?? translations.en;

        document.title = t.pageTitle;

        document.getElementById('warning-title').textContent = t.title;
        document.getElementById('warning-description').textContent = t.description;
        document.getElementById('back-btn').textContent = t.back;
        document.getElementById('continue-btn').textContent = t.continue;

        document.getElementById('back-btn').addEventListener('click', () => {
                if (history.length > 2) {
                        history.go(-2);
                } else {
                        // Close tab if we're on the first page
                        chrome.tabs.getCurrent(tab => chrome.tabs.remove(tab.id));
                }
        });

        document.getElementById('continue-btn').addEventListener('click', () => {
                chrome.storage.local.set({ bypassed: true });
                location.replace(window.location.search.slice(1));
        });
})();
