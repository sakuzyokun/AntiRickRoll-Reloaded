(() => {
    // Get the latest rules from the service worker.
    // If the network update fails, fall back to locally cached rules.
    const getRules = () => new Promise(resolve => {
        chrome.runtime.sendMessage(
            { type: 'updateDatabase' },
            response => {
                if (chrome.runtime.lastError) {
                    console.warn(
                        'AntiRickRoll Reloaded: failed to contact service worker',
                        chrome.runtime.lastError.message
                    );

                    chrome.storage.local.get(['rules'], res => {
                        resolve(Array.isArray(res.rules) ? res.rules : []);
                    });

                    return;
                }

                if (response?.ok && Array.isArray(response.rules)) {
                    resolve(response.rules);
                    return;
                }

                chrome.storage.local.get(['rules'], res => {
                    resolve(Array.isArray(res.rules) ? res.rules : []);
                });
            }
        );
    });

    // Check whether a rule matches the current URL.
    const matchesRule = (rule, currentUrl) => {
        if (!rule || typeof rule !== 'object') {
            return false;
        }

        // YouTube video ID
        if (rule.type === 'youtube' && typeof rule.id === 'string') {
            try {
                const url = new URL(currentUrl);
                const hostname = url.hostname;

                // youtu.be/<video-id>
                if (hostname === 'youtu.be') {
                    const id = url.pathname.split('/')[1];
                    return id === rule.id;
                }

                // youtube.com/watch?v=<video-id>
                // youtube.com/shorts/<video-id>
                if (
                    hostname === 'youtube.com' ||
                    hostname.endsWith('.youtube.com')
                ) {
                    if (url.pathname === '/watch') {
                        return url.searchParams.get('v') === rule.id;
                    }

                    if (url.pathname.startsWith('/shorts/')) {
                        const id = url.pathname.split('/')[2];
                        return id === rule.id;
                    }
                }
            } catch {
                return false;
            }

            return false;
        }

        // Exact URL
        if (rule.type === 'url' && typeof rule.url === 'string') {
            return currentUrl === rule.url;
        }

        return false;
    };

    const isBlocked = rules => {
        return rules.some(rule => matchesRule(rule, location.href));
    };

    const RICKROLL_URL = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';

    const rickRollAllLinks = () => {
        document.querySelectorAll('a[href]').forEach(link => {
            if (link.dataset.antirickrollProcessed === 'true') {
                return;
            }

            link.dataset.antirickrollProcessed = 'true';
            link.href = RICKROLL_URL;
        });
    };

    const observeLinks = () => {
        const observer = new MutationObserver(() => {
            rickRollAllLinks();
        });

        observer.observe(document.documentElement, {
            childList: true,
            subtree: true
        });
    };

    const checkLink = async () => {
        // Don't do anything if the extension has been disabled.
        const settings = await chrome.storage.local.get([
            'bypassed',
            'totalRickRolls',
            'extDisabled',
            'rickRollHistory'
        ]);

        if (settings.rickRollAllLinks) {
            rickRollAllLinks();
        }

        if (settings.extDisabled) {
            return;
        }

        const rules = await getRules();

        if (!isBlocked(rules)) {
            return;
        }

        // User clicked "Continue" on the warning page.
        if (settings.bypassed) {
            await chrome.storage.local.set({
                bypassed: false
            });

            return;
        }

        // Count blocked RickRolls.
        const now = Date.now();

        const history = Array.isArray(settings.rickRollHistory)
            ? settings.rickRollHistory
            : [];

        history.push(now);

        const total = (settings.totalRickRolls ?? 0) + 1;

        await chrome.storage.local.set({
            totalRickRolls: total,
            rickRollHistory: history
        });

        chrome.runtime.sendMessage({
            type: 'setBadge',
            count: total
        });

        // Show warning page.
        location.replace(
            chrome.runtime.getURL('warn/warn.html') +
            '?' +
            location.href
        );
    };

    // Check the initial page.
    checkLink();

    // Hook into YouTube's SPA navigation.
    addEventListener('yt-navigate-start', checkLink);

    // Also catch normal browser history navigation.
    addEventListener('popstate', checkLink);

    chrome.storage.local.get(['rickRollAllLinks']).then(settings => {
        if (settings.rickRollAllLinks) {
            rickRollAllLinks();
            observeLinks();
        }
    });
})();
