<script>
    import { onMount } from "svelte";
    import { Card, Button } from "flowbite-svelte";
    import { t } from "../lib/i18n";

    let dbVersion = null;
    let ruleCount = 0;
    let updating = false;
    let updateResult = null;

    const loadDatabaseInfo = async () => {
        const result = await chrome.storage.local.get([
            "dbVersion",
            "rules"
        ]);

        dbVersion = result.dbVersion ?? null;
        ruleCount = Array.isArray(result.rules)
            ? result.rules.length
            : 0;
    };

    const updateDatabase = () => {
        if (updating) return;

        updating = true;
        updateResult = null;

        chrome.runtime.sendMessage(
            { type: "updateDatabase" },
            async response => {
                if (chrome.runtime.lastError) {
                    updateResult = "error";
                    updating = false;
                    return;
                }

                if (response?.ok) {
                    await loadDatabaseInfo();
                    updateResult = "success";
                } else {
                    updateResult = "error";
                }

                updating = false;
            }
        );
    };

    onMount(() => {
        loadDatabaseInfo();
    });
</script>

<div class="p-3 space-y-3 select-none">
    <h2 class="text-lg font-semibold text-gray-700">
        {$t.database}
    </h2>

    <Card padding="none">
        <div class="flex items-center text-gray-700">
            <span class="p-4 flex-grow border-r">
                {$t.databaseVersion}
            </span>

            <span class="p-4 font-bold">
                {#if dbVersion !== null}
                    v{dbVersion}
                {:else}
                    -
                {/if}
            </span>
        </div>
    </Card>

    <Card padding="none">
        <div class="flex items-center text-gray-700">
            <span class="p-4 flex-grow border-r">
                {$t.rules}
            </span>

            <span class="p-4 font-bold">
                {ruleCount}
            </span>
        </div>
    </Card>

    <Card padding="none">
        <div class="p-4">
            <Button
                size="sm"
                class="w-full"
                disabled={updating}
                on:click={updateDatabase}
            >
                {updating ? $t.updating : $t.update}
            </Button>

            {#if updateResult === "success"}
                <p class="mt-2 text-sm text-green-600">
                    {$t.upToDate}
                </p>
            {:else if updateResult === "error"}
                <p class="mt-2 text-sm text-red-600">
                    {$t.updateFailed}
                </p>
            {/if}
        </div>
    </Card>
</div>
