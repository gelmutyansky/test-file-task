<script context="module">
    export async function load({ params, fetch }) {
        try {
            const url = `http://localhost:3000/api/objects/get`;
            const res = await fetch(url);

            return {
                props:  {
                    message: (await res.json()).message,
                },
            };
        }
        catch (e) {
            return {
                props:  {
                    message: e.message,
                },
            };
        }
    }
</script>

<script>
    import { isObjectCheck } from '$lib/helpers.js';

    export let objects = [];
    export let message = {};
    let error = '';

    if (isObjectCheck(message)) {
        objects = message.objects;
    }
    else {
        error = message || 'Ошибка';
        console.log(error);
    }

</script>

<h1>Список объектов</h1>

{#if error}
    <p>Произошла ошибка. Попробуйте позже</p>
{:else }
    {#each objects as object}
        <a href="/{object.objectId}">Объект №{object.objectId}: {object.objectName}</a><br/>
    {/each}
{/if}