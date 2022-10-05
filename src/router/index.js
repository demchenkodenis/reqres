import { createWebHistory, createRouter } from "vue-router"
import Users from "@/views/users.vue"
import User from "@/views/user.vue"
import addUser from '@/views/add-user.vue'

import NotFound from "@/views/notfound.vue"

const routes = [
  {
    path: "/",
    name: "Users",
    component: Users,
  },
  {
    path: "/user/:id",
    name: "User",
    component: User,
  },
  {
    path: "/add-user",
    name: "Add-user",
    component: addUser,
  },
  {
    path: "/:pathMatch(.*)*",
    component: NotFound,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;