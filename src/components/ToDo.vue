<template>
  <div style="margin: 100px;">
    <div class="title-button-container" style="display: flex;align-items: center;justify-content: space-between;margin-bottom: 20px;">
    <h2>Todo Creation</h2>
    <button class="btn btn-danger"  @click="logout()">Logout</button>
  </div>
  <hr>
  <form @submit.prevent="save">
    <div class="form-group">
      <label>ToDo title</label>
      <input type="text" v-model="todo.title" class="form-control" placeholder="title">
    </div>
    <button type="submit" class="btn btn-primary">Save</button>
  </form>
<hr>
<hr>
<hr>
<hr>

  <div style="background-color: rgba(57, 57, 57, 0.605); margin: 50px">
  <h2 style="margin-top: 30px;">ToDo View</h2>
  <table class="table table-dark">
    <thead>
      <tr>
        <th scope="col">ID</th>
        <th scope="col">Title</th>
        <th scope="col">Action</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="todo in result" v-bind:key="todo.id">
        <td>{{ todo.id }}</td>
        <td>{{ todo.title }}</td>
        <td>
          <button type="button" class="btn btn-warning" @click="edit(todo)">Edit</button>
          <button type="button" class="btn btn-danger" @click="remove(todo)">Delete</button>
        </td>
      </tr>
    </tbody>
  </table>
</div>
  </div>
  </template>
<script>
import axios from 'axios'
import router from '@/router' // Import your Vue Router instance
import dotEnv from 'dotenv'

dotEnv.config()

export default {
  name: 'ToDoView',
  data () {
    return {
      result: {},
      todo: {
        id: '',
        title: ''
      },
      auth_token: localStorage.getItem('auth_token')
    }
  },
  created () {
    this.TodoLoad()
  },
  mounted () {
    console.log('mounted() called.....')
  },

  methods: {

    async TodoLoad () {
      // let baseUrl = process.env.API_URL
      let page = 'http://127.0.0.1:8000/api/user/todos'
      const token = this.auth_token
      if (token) {
        await axios.get(page, {
          headers: {
            'Authorization': `Bearer ${token}` // Pass the token here
          }
        })
          .then(
            ({data}) => {
              if (data.auth_status === false) {
                router.push({ name: 'UnAuthenticated' })
              } else {
                this.result = data.data
              }
            }
          )
          .catch(error => {
            if (error.response.auth_status === false) {
              router.push({ name: 'UnAuthenticated' })
            }
          })
      } else {
        router.push({ name: 'UnAuthenticated' })
      }
    },
    save () {
      if (this.todo.id === '') {
        this.saveData()
      } else {
        this.updateData()
      }
    },
    async saveData () {
      const token = this.auth_token
      await axios.post('http://127.0.0.1:8000/api/user/save', this.todo, {
        headers: {
          'Authorization': `Bearer ${token}` // Pass the token here
        }
      })
        .then(
          ({data}) => {
            alert('saved!')
            this.TodoLoad()
          }
        )
    },
    async logout () {
      const token = this.auth_token
      await axios.post('http://127.0.0.1:8000/api/user/logout', this.todo, {
        headers: {
          'Authorization': `Bearer ${token}` // Pass the token here
        }
      })
        .then(
          ({data}) => {
            alert(data.message)
            localStorage.removeItem('auth_token')
            this.$router.push({ name: 'Login' })
          }
        )
    },
    edit (todo) {
      this.todo = todo
    },
    async updateData () {
      const token = this.auth_token
      let editRecords = 'http://127.0.0.1:8000/api/user/update/' + this.todo.id
      await axios.put(editRecords, this.todo, {
        headers: {
          'Authorization': `Bearer ${token}` // Pass the token here
        }
      })
        .then(
          ({data}) => {
            this.todo.title = ''
            this.todo.id = ''
            alert('updated')
            this.TodoLoad()
          }
        )
    },
    async remove (todo) {
      const token = this.auth_token

      let url = 'http://127.0.0.1:8000/api/user/delete/' + todo.id
      await axios.delete(url, {
        headers: {
          'Authorization': `Bearer ${token}` // Pass the token here
        }
      })
      alert('deleted')
      this.TodoLoad()
    }
  }
}
</script>
