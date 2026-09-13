<script>
    import { onMount } from "svelte";
    import { Card, Toggle } from "flowbite-svelte";
    import { t } from "../../lib/i18n";

    let enabled = true;

    const save = () => {
        chrome.storage.local.set({
            extDisabled: !enabled
        });
    };

    onMount(() => {
        chrome.storage.local.get("extDisabled", result => {
            enabled = !result.extDisabled;
        });
    });
</script>

<Card padding="none">
    <div class="flex py-4 pl-4">
        <span class="flex-grow text-gray-700">
            {$t.protection}: {$t[enabled ? "enabled" : "disabled"]}
        </span>

        <div>
            <Toggle bind:checked={enabled} on:change={save} />
        </div>
    </div>
</Card>
