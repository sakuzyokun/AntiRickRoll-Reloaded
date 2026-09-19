import { writable } from 'svelte/store';

const translations = {
    ja: {
        home: 'ホーム',
        stats: '統計',
        database: 'RickRoll DB',
        settings: '設定',

        protection: '保護',
        enabled: '有効',
        disabled: '無効',

        totalRickRolls: 'ブロックしたRickRoll',
        databaseVersion: 'データベース',
        upToDate: '最新',
        update: '更新',

        statistics: '統計情報',
        comingSoon: '近日公開',

        language: '言語',
        japanese: '日本語',
        english: 'English',

        about: 'この拡張機能について',
        version: 'バージョン',

        today: '今日',
        thisWeek: '今週',
        thisMonth: '今月',

        rules: 'ルール',
        updating: '更新中...',
        updateFailed: '更新に失敗しました',

        allLinksToRickRoll: '全リンクをRickRollにする',
        allLinksToRickRollDesc: 'すべてのページのリンクをRickRollにします。例えば、<a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" target="_blank" rel="noopener noreferrer" class="text-blue-600 underline">こんな感じです</a>。<br><span class="text-yellow-600">※再読込すると設定が適用されます。</span>',
    },

    en: {
        home: 'Home',
        stats: 'Stats',
        database: 'RickRoll DB',
        settings: 'Settings',

        protection: 'Protection',
        enabled: 'Enabled',
        disabled: 'Disabled',

        totalRickRolls: 'RickRolls blocked',
        databaseVersion: 'Database',
        upToDate: 'Up to date',
        update: 'Update',

        statistics: 'Statistics',
        comingSoon: 'Coming soon',

        language: 'Language',
        japanese: '日本語',
        english: 'English',

        about: 'About',
        version: 'Version',

        today: 'Today',
        thisWeek: 'This week',
        thisMonth: 'This month',

        rules: 'Rules',
        updating: 'Updating...',
        updateFailed: 'Update failed',

        allLinksToRickRoll: 'RickRoll all links',
        allLinksToRickRollDesc: 'All links on every page will be redirected to Rick Astley. For example, <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" target="_blank" rel="noopener noreferrer" class="text-blue-600 underline">like this</a>.<br><span class="text-yellow-600">※Reload the page to apply this setting.</span>',
    }
};

const detectLanguage = () => {
    return navigator.language?.startsWith('ja') ? 'ja' : 'en';
};

const initialLanguage = detectLanguage();

export const locale = writable(initialLanguage);
export const t = writable(translations[initialLanguage]);

locale.subscribe(lang => {
    t.set(translations[lang] ?? translations.en);
});

export const setLanguage = async lang => {
    if (!translations[lang]) return;

    locale.set(lang);

    await chrome.storage.local.set({
        language: lang
    });
};

// 保存された言語設定を読み込む
chrome.storage.local.get(['language'], result => {
    if (result.language && translations[result.language]) {
        locale.set(result.language);
    }
});
