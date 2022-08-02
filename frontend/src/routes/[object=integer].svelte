<script context="module">
    export async function load({ params, fetch }) {
        const objectId = params.object;
        let message = '';

        try {
            const url = `http://localhost:3000/api/objects/get/${ objectId }`;
            const res = await fetch(url);

            message = (await res.json()).message;
        }
        catch (e) {
            message = e.message;
        }

        return {
            props: {
                message,
                objectId,
            },
        };
    }
</script>

<script>
    import { isObjectCheck } from '$lib/helpers.js';
    import FileTemplate from '$lib/FileTemplate.svelte';
    import FileUploader from '$lib/FileUploader.svelte';

    export let objectId;
    export let message = '';

    const apiUrl = 'http://localhost:3000/api/objects';
    console.log(apiUrl);

    let unique = '';
    let multiple = [];
    let error = '';

    $: hasUniqueFile = !!unique;
    $: uniqueFile = { fileId: null, fileName: unique };

    if (isObjectCheck(message)) {
        unique = message.unique;
        multiple = message.multiple;
    }
    else {
        error = message;
        console.log(error);
    }

    async function uploadUniqueFile(event) {
        const file = event.detail.file;
        const formData = new FormData();

        formData.append('file', file);
        formData.append('objectId', objectId);

        const res = await fetch(`${ apiUrl }/unique/upload`, {
            method: 'POST',
            body:   formData,
        });

        message = (await res.json()).message;

        if (isObjectCheck(message) && 'fileName' in message && message.fileName) {
            unique = message.fileName;
        }
        else {
            console.log(JSON.stringify(message));
        }
    }

    async function uploadMultipleFile(event) {
        const file = event.detail.file;
        const formData = new FormData();

        formData.append('file', file);
        formData.append('objectId', objectId);

        const res = await fetch(`${ apiUrl }/multiple/upload`, {
            method: 'POST',
            body:   formData,
        });

        message = (await res.json()).message;

        if (isObjectCheck(message) && 'fileName' in message && message.fileName && 'fileId' in message
            && message.fileId) {
            multiple.push({
                              fileId:   message.fileId,
                              fileName: message.fileName,
                          });
            multiple = multiple;
        }
        else {
            console.log(JSON.stringify(message));
        }
    }

    async function deleteUniqueFile() {
        const res = await fetch(`${ apiUrl }/unique/delete`, {
            method:  'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body:    JSON.stringify({ objectId }),
        });
        message = (await res.json()).message;

        if (isObjectCheck(message) && 'success' in message && message.success) {
            unique = '';
        }
        else {
            console.log(JSON.stringify(message));
        }
    }

    async function deleteMultipleFile(event) {
        const fileId = event.detail;

        const res = await fetch(`${ apiUrl }/multiple/delete`, {
            method:  'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body:    JSON.stringify({ objectId, fileId }),
        });
        message = (await res.json()).message;

        if (isObjectCheck(message) && 'success' in message && message.success) {
            multiple = multiple.filter(x => x.fileId !== fileId);
        }
        else {
            console.log(JSON.stringify(message));
        }
    }

    async function downloadUniqueFile() {
        const res = await fetch(`${ apiUrl }/unique/download`, {
            method:  'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body:    JSON.stringify({ objectId }),
        });
        const blob = await res.blob();

        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = unique;
        document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
        a.click();
        a.remove();  //afterwards we remove the element again
    }

    async function downloadMultipleFile(event) {
        const { fileId, fileName } = event.detail;

        const res = await fetch(`${ apiUrl }/multiple/download`, {
            method:  'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body:    JSON.stringify({ objectId, fileId }),
        });
        const blob = await res.blob();

        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
        a.click();
        a.remove();  //afterwards we remove the element again
    }
</script>

{#if error}
    Произошла ошибка. Попробуйте позже
{:else}
    <h1>Уникальный файл</h1>
    <FileTemplate bind:file={uniqueFile} on:delete={deleteUniqueFile} on:download={downloadUniqueFile}/>
    <FileUploader bind:hasFile={hasUniqueFile} on:upload={uploadUniqueFile}/>

    <h1>Множественные файлы</h1>
    {#each multiple as file (file.fileId)}
        <FileTemplate file={file} on:delete={deleteMultipleFile} on:download={downloadMultipleFile}/>
        {#if file !== multiple[multiple.length - 1]}
            ;
        {/if}<br/>
    {/each}
    <FileUploader on:upload={uploadMultipleFile}/>
{/if}

<br/><a href="/">Вернуться к списку</a>
