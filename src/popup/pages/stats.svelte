<script>
    import { onMount } from "svelte";
    import { Card } from "flowbite-svelte";
    import { t } from "../lib/i18n";

    let history = [];

    onMount(async () => {
        const result = await chrome.storage.local.get([
            "rickRollHistory"
        ]);

        history = Array.isArray(result.rickRollHistory)
            ? result.rickRollHistory
            : [];
    });

    const startOfToday = () => {
        const date = new Date();

        date.setHours(0, 0, 0, 0);

        return date.getTime();
    };

    const startOfWeek = () => {
        const date = new Date();

        const day = date.getDay();

        const diff = day === 0 ? 6 : day - 1;

        date.setDate(date.getDate() - diff);
        date.setHours(0, 0, 0, 0);

        return date.getTime();
    };

    const startOfMonth = () => {
        const date = new Date();

        date.setDate(1);
        date.setHours(0, 0, 0, 0);

        return date.getTime();
    };

    $: today = history.filter(
        timestamp => timestamp >= startOfToday()
    ).length;

    $: week = history.filter(
        timestamp => timestamp >= startOfWeek()
    ).length;

    $: month = history.filter(
        timestamp => timestamp >= startOfMonth()
    ).length;

    $: total = history.length;
</script>

<div class="p-3 space-y-3 select-none">
    <h2 class="text-lg font-semibold text-gray-700">
        {$t.statistics}
    </h2>

    <Card padding="none">
        <div class="flex items-center text-gray-700">
            <span class="p-4 flex-grow border-r">
                {$t.totalRickRolls}
            </span>

            <span class="p-4 font-bold text-lg">
                {total}
            </span>
        </div>
    </Card>

    <Card padding="none">
        <div class="flex items-center text-gray-700">
            <span class="p-4 flex-grow border-r">
                {$t.today}
            </span>

            <span class="p-4 font-bold text-lg">
                {today}
            </span>
        </div>
    </Card>

    <Card padding="none">
        <div class="flex items-center text-gray-700">
            <span class="p-4 flex-grow border-r">
                {$t.thisWeek}
            </span>

            <span class="p-4 font-bold text-lg">
                {week}
            </span>
        </div>
    </Card>

    <Card padding="none">
        <div class="flex items-center text-gray-700">
            <span class="p-4 flex-grow border-r">
                {$t.thisMonth}
            </span>

            <span class="p-4 font-bold text-lg">
                {month}
            </span>
        </div>
    </Card>
</div>
