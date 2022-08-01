<script>
    import Icon from '@iconify/svelte';
    import closeIcon from '@iconify/icons-mdi/close';
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();

    export let file = null;

    function toDelete() {
        dispatch('delete', file.fileId);
    }

    function toDownload() {
        dispatch('download', { fileId: file.fileId, fileName: file.fileName });
    }
</script>

{#if file.fileName}
    <button class="link" on:click={toDownload}>{file.fileName}</button>
    <label class="beautiful-box">
        <button on:click={toDelete} class="hide"/>
        <Icon icon={closeIcon} inline={true}/>
    </label>
{:else}
    Файла нет
{/if}

<style>
    .beautiful-box {
        border: 1px solid #ccc;
        display: inline-block;
        padding: 5px 5px;
        cursor: pointer;
    }

    .hide {
        position: fixed;
        right: 100%;
        bottom: 100%;
    }

    button.link {
        align-items: normal;
        background-color: rgba(0, 0, 0, 0);
        border-color: rgb(0, 0, 238);
        border-style: none;
        box-sizing: content-box;
        color: rgb(0, 0, 238);
        cursor: pointer;
        display: inline;
        font: inherit;
        height: auto;
        padding: 0;
        perspective-origin: 0 0;
        text-align: start;
        text-decoration: underline;
        transform-origin: 0 0;
        width: auto;
        -moz-appearance: none;
        -webkit-logical-height: 1em; /* Chrome ignores auto, so we have to use this hack to set the correct height  */
        -webkit-logical-width: auto; /* Chrome ignores auto, but here for completeness */
    }

    /* Mozilla uses a pseudo-element to show focus on buttons, */
    /* but anchors are highlighted via the focus pseudo-class. */

    @supports (-moz-appearance:none) {
        /* Mozilla-only */
        button.link::-moz-focus-inner { /* reset any predefined properties */
            border: none;
            padding: 0;
        }

        button.link:focus { /* add outline to focus pseudo-class */
            outline-style: dotted;
            outline-width: 1px;
        }
    }
</style>