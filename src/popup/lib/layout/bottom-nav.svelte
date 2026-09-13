<script>
    import {
        faHome,
        faChartBar,
        faServer,
        faCog,
    } from "@fortawesome/free-solid-svg-icons";

    import NavIcon from "./nav-icon.svelte";
    import { t } from "../i18n";
</script>

<div class="flex border-t cursor-pointer">
    <NavIcon target={0} icon={faHome} title={$t.home} />
    <NavIcon target={1} icon={faChartBar} title={$t.stats} />
    <NavIcon target={2} icon={faServer} title={$t.database} />
    <NavIcon target={3} icon={faCog} title={$t.settings} />
</div>
