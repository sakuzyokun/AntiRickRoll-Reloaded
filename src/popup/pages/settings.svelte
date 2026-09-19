<script>
    import { onMount } from "svelte";
    import { Card, Toggle } from "flowbite-svelte";
    import { t } from "../lib/i18n";

    let enabled = true;
    let rickRollAllLinks = false;

    onMount(async () => {
        const result = await chrome.storage.local.get([
            "extDisabled",
            "rickRollAllLinks"
        ]);

        enabled = !result.extDisabled;
        rickRollAllLinks = result.rickRollAllLinks ?? false;
    });

    const toggleProtection = async () => {
        await chrome.storage.local.set({
            extDisabled: !enabled
        });
    };

    const toggleRickRollAllLinks = async () => {
        await chrome.storage.local.set({
            rickRollAllLinks
        });
    };
</script>

<div class="p-3 space-y-3 select-none">
    <h2 class="text-lg font-semibold text-gray-700">
        {$t.settings}
    </h2>

    <Card padding="none">
        <div class="flex items-center p-4 text-gray-700">
            <div class="flex-grow">
                <div class="font-medium">
                    {$t.protection}
                </div>

                <div class="text-sm text-gray-500">
                    {enabled ? $t.enabled : $t.disabled}
                </div>
            </div>

            <Toggle
                bind:checked={enabled}
                on:change={toggleProtection}
            />
        </div>
    </Card>

    <Card padding="none">
        <div class="flex items-center p-4 text-gray-700">
            <div class="flex-grow pr-3">
                <div class="font-medium">
                    {$t.allLinksToRickRoll}
                </div>

                <div class="text-sm text-gray-500">
                    {@html $t.allLinksToRickRollDesc}
                </div>
            </div>

            <Toggle
                bind:checked={rickRollAllLinks}
                on:change={toggleRickRollAllLinks}
            />
        </div>
    </Card>

    <Card padding="none">
        <div class="p-4">
            <div class="font-medium text-gray-700 mb-3">
                {$t.language}
            </div>

            <div class="space-y-2">
                <button
                    class="w-full p-3 text-left border rounded"
                    on:click={() => import("../lib/i18n").then(m => m.setLanguage("ja"))}
                >
                    {$t.japanese}
                </button>

                <button
                    class="w-full p-3 text-left border rounded"
                    on:click={() => import("../lib/i18n").then(m => m.setLanguage("en"))}
                >
                    {$t.english}
                </button>
            </div>
        </div>
    </Card>

    <Card padding="none">
        <div class="flex items-center text-gray-700">
            <span class="p-4 flex-grow border-r">
                {$t.about}
            </span>

            <span class="p-4 font-bold">
                v1.0.1
            </span>
        </div>
    </Card>
</div>