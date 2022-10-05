<template>
    <div>
        <img :src="user.avatar" />
        <p>{{ user.first_name }} {{ user.last_name}}</p>
        <p>{{ user.email }}</p>
    </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { ref, onMounted } from 'vue'
import axios from 'axios'

const user = ref([])
const id = ref('')
const route = useRoute()

const getUserId = () => id.value = route.params.id

const getUser = async () => 
        await axios
            .get(`https://reqres.in/api/users/${id.value}`)
            .then(response => user.value = response.data.data)
            .catch(error => error.response.status === 404 ? alert('user not found') : false)


onMounted(() => {
    getUserId()
    getUser()
})
</script>

<style scoped>
    button {
        display: flex;
        align-items: center;
    }
    .chevron {
        width: 24px;
        height: 24px;
        padding: 4px;
    }
</style>