<script>
    import { Card } from "flowbite-svelte";
    import { t } from "../../lib/i18n";

    const getTotalRickRolls = () => {
        return new Promise(resolve => {
            chrome.storage.local.get("totalRickRolls", result => {
                resolve(result.totalRickRolls ?? 0);
            });
        });
    };
</script>

<Card padding="none">
    <div class="flex items-center text-gray-700">
        <span class="p-4 flex-grow border-r">
            {$t.totalRickRolls}
        </span>

        <span class="p-4 font-bold text-lg">
            {#await getTotalRickRolls()}
                <span>...</span>
            {:then totalRickRolls}
                {totalRickRolls}
            {/await}
        </span>
    </div>
</Card>
