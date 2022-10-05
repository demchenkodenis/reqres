<template>
    <div>
        <form @submit.prevent="onSubmit">
            <div>
                <label for="name">Enter username:</label>
                <input type="text" id="name" placeholder="Name" v-model="name" required>
            </div>
            <div>
                <label for="job">Enter user job:</label>
                <input type="text" id="job" placeholder="Job" v-model="job" required>
            </div>
            <button type="submit" :class="(name && job) ? 'btn-success' : ''" class="btn" :disabled="!name || !job">Create user</button>
        </form>
        <div v-if="Object.keys(userdata).length > 0">
            <pre>{{ userdata }}</pre>
        </div>
    </div>
</template>
<script setup>
import axios from 'axios'
import { ref } from 'vue'

const name = ref('')
const job = ref('')

const userdata = ref({})

console.log(userdata.value, userdata.value.length)

const onSubmit = async () => {
    await axios.post('https://reqres.in/api/users', {
        name: name.value,
        job: job.value
    })
        .then(response => {
            if(response.status === 201){
                alert('User added')
                userdata.value = response.data
            }else{
                alert('User not added')
            }
        })
}

</script>
<style scoped>
label {
    display: block;
}
input {
    font-size: 18px;
    padding: 4px;
    margin: 10px 0 20px;
}
.btn {
    min-width: 80px;
    padding: 8px 14px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #aaa;
    border-radius: 4px;
    color: #fff;
    cursor: pointer;
}
.btn-success {
    background: green;
}

button:disabled {
  cursor: not-allowed;
  pointer-events: all !important;
}
</style>