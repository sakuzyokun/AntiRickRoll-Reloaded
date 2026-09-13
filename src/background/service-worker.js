const VERSION_URL = 'https://sakuzyo.net/antirickroll/version.json';
const LINKS_URL = 'https://sakuzyo.net/antirickroll/links.json';

let updatePromise = null;

async function updateDatabase() {
    if (updatePromise) {
        return updatePromise;
    }

    updatePromise = doUpdate();

    try {
        return await updatePromise;
    } finally {
        updatePromise = null;
    }
}

async function doUpdate() {
    const versionResponse = await fetch(VERSION_URL, {
        cache: 'no-store'
    });

    if (!versionResponse.ok) {
        throw new Error(`version.json: HTTP ${versionResponse.status}`);
    }

    const versionData = await versionResponse.json();

    if (typeof versionData.v !== 'number') {
        throw new Error('Invalid version.json');
    }

    const local = await chrome.storage.local.get([
        'dbVersion',
        'rules'
    ]);

    if (local.dbVersion === versionData.v && Array.isArray(local.rules)) {
        return local.rules;
    }

    const linksResponse = await fetch(
        `${LINKS_URL}?v=${encodeURIComponent(versionData.v)}`,
        {
            cache: 'no-store'
        }
    );

    if (!linksResponse.ok) {
        throw new Error(`links.json: HTTP ${linksResponse.status}`);
    }

    const linksData = await linksResponse.json();

    if (!Array.isArray(linksData.rules)) {
        throw new Error('Invalid links.json');
    }

    await chrome.storage.local.set({
        dbVersion: versionData.v,
        rules: linksData.rules
    });

    console.log(
        `AntiRickRoll Reloaded: database updated to v${versionData.v}`
    );

    return linksData.rules;
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message?.type !== 'updateDatabase') {
        return;
    }

    updateDatabase()
        .then(rules => {
            sendResponse({
                ok: true,
                rules
            });
        })
        .catch(error => {
            console.error(
                'AntiRickRoll Reloaded database update failed:',
                error
            );

            sendResponse({
                ok: false,
                error: error.message
            });
        });

    return true;
});
