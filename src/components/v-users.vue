<template>
    <div class="controls">
        <button @click="sorting" class="btn">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 7.5L7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5" />
            </svg>
            <span>{{ direction === 'no' ? 'No sorting' : 'Sorting by ' + direction }}</span>
        </button>

        <input type="text" v-model="search" placeholder="Search by last name">
        
        <router-link :to="{ name: 'Add-user' }">
            <button class="btn">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                Add user
            </button>
        </router-link>
    </div>

    

    <ul>
        <li v-for="(user, index) in filteringUser" :key="user.id">
            <router-link :to="{ name: 'User', params: { id: user.id }}">
                <img :src="user.avatar" />
            </router-link>
            <router-link :to="{ name: 'User', params: { id: user.id }}">
                <p>{{ user.first_name }} {{ user.last_name}}</p>
            </router-link>
            <p>{{ user.email }}</p>
            <button @click="deleteUser(index)" class="btn btn-danger">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                </svg>
                <span>Delete</span>
            </button>
        </li>
    </ul>
    <div id="pagination">
        
        <svg @click="prevPage" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" :class="pageNumber > 1 ? 'chevron-active' : 'chevron-nonactive'" class="chevron">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>

        <span v-for="page in users.total_pages" :key="page" :class="pageNumber === page ? 'border' : ''" @click="changePage(page)">{{ page }}</span>

        <svg @click="nextPage" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" :class="pageNumber < users.total_pages ? 'chevron-active' : 'chevron-nonactive'" class="chevron">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>

    </div>
    
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'


// Users
const users      = ref([])
const perPage    = ref(5)
const pageNumber = ref(1)

const getUsers = async () => 
    await axios
        .get(`https://reqres.in/api/users?per_page=${perPage.value}&page=${pageNumber.value}`)
        .then(response => users.value = response.data)
        .catch(error => console.log(error))

async function deleteUser (index) {
    let id = users.value.data[index].id
    
    await axios.delete(`https://reqres.in/api/users/${id}`)
        .then(response => {
            if(response.status === 204) {
                users.value.data.splice(index, 1)
                alert('Пользователь удален')
            }
        })
        .catch(error => console.log(error))
}

// Sorting
const direction = ref('no')

const defaultSorting = () => direction.value = 'no'

const sorting = () => { 
    direction.value = direction.value === 'A' ? 'Z' : 'A'
    direction.value === 'A' ? users.value.data = sortByNameA() : users.value.data = sortByNameZ()
}
    
const sortByNameA = () => users.value.data.slice(0).sort((a, b) => `${a.first_name} ${a.last_name}` > `${b.first_name} ${b.last_name}` ? 1 : -1)

const sortByNameZ = () => users.value.data.slice(0).sort((a, b) => `${a.first_name} ${a.last_name}` < `${b.first_name} ${b.last_name}` ? 1 : -1)

// Filtering
const search = ref('')

const filteringUser = computed(() => 
    search.value ? users.value.data.filter((user) => user.last_name.toLowerCase().includes(search.value.toLowerCase())) : users.value.data)


// Pagination
const changePage = (page) => { pageNumber.value = page, defaultSorting(), getUsers() }

const prevPage = () => { 
    if(pageNumber.value > 1){
        pageNumber.value--
        defaultSorting()
        getUsers()
    }
}

const nextPage = () => { 
    if(pageNumber.value < users.value.total_pages){
        pageNumber.value++
        defaultSorting()
        getUsers()
    }
}
// Lifecycle
onMounted(() => {
    getUsers()
})
</script>

<style scoped>
    .controls {
        display: flex;
        justify-content: space-around;
    }
    .controls input {
        font-size: 18px;
    }
    ul{
        display: flex;
        justify-content: space-between;
        height: 300px;
    }
    ul li {
        text-align: center;
        list-style: none;
    }
    ul li button {
        margin: 0 auto;
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
    .btn-danger {
        background: #bc544b;
        border-color: #bc544b;
    }
    svg {
        width: 24px;
        height: 24px;
    }
    #pagination {
        display: flex;
        justify-content: center;
    }
    #pagination span {
        display: block;
        padding: 8px 14px;
        margin: 0 10px; 
        border-radius: 4px;
        cursor: pointer;
    }
    .border {
        background: #959595;
        color: #fff;
        font-weight: bold;
        border: 1px solid #959595;
    }
    .chevron{
        width: 24px;
        height: 24px;
        padding: 8px 14px;
    }
    .chevron-active {
        stroke: #222;
        cursor: pointer;
    }
    .chevron-nonactive {
        stroke: #aaa;
    }
</style>