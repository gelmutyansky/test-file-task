<script>
    import Icon from '@iconify/svelte';
    import paperclipIcon from '@iconify/icons-mdi/paperclip';
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();

    export let hasFile = false;
    let files;

    function onChange() {
        dispatch('upload', {
            file: files[0],
        });
    }

    $: caption = hasFile ? 'Перезаписать файл' : 'Загрузить файл';
</script>

<label class="beautiful-box">
    <input type="file" bind:files on:change={onChange}/>
    <Icon icon={paperclipIcon} inline="true"/> {caption}
</label>

<style>
    input[type="file"] {
        position: fixed;
        right: 100%;
        bottom: 100%;
    }

    .beautiful-box {
        border: 1px solid #ccc;
        display: inline-block;
        padding: 5px 5px;
        cursor: pointer;
    }
</style>