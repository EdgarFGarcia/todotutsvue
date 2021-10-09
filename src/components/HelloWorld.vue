<template>
  <v-container>
    <v-card max-width="450" class="mx-auto">
      <v-toolbar color="cyan" dark>
        <v-app-bar-nav-icon></v-app-bar-nav-icon>

        <v-toolbar-title>Inbox</v-toolbar-title>

        <v-spacer></v-spacer>

        <v-btn icon @click="addItem">
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </v-toolbar>

      <v-list two-line>
        <v-list-item-group
          v-model="selected"
          active-class="pink--text"
          multiple
        >
          <v-text-field
            v-model="search"
            placeholder="Search here..."
          ></v-text-field>
          <template v-for="(item, index) in items">
            <v-list-item :key="item.title">
              <template v-slot:default="{ }">
                <v-list-item-action>
                  <v-checkbox v-model="select" @click="deleteItem(item)"></v-checkbox>
                </v-list-item-action>
                <v-list-item-content @click="editItem(item)">
                  <v-list-item-title>{{ item.todo }}</v-list-item-title>

                  <v-list-item-subtitle
                    @click="editItem(item)"
                    v-text="item.subtitle"
                  ></v-list-item-subtitle>
                </v-list-item-content>

                <v-list-item-action @click="editItem(item)">
                  <v-list-item-action-text
                    >Start Date: {{ item.startdate }}</v-list-item-action-text
                  >
                  <v-list-item-action-text
                    >Deadline: {{ item.deadline }}</v-list-item-action-text
                  >
                </v-list-item-action>
              </template>
            </v-list-item>

            <v-divider v-if="index < items.length - 1" :key="index"></v-divider>
          </template>
        </v-list-item-group>
      </v-list>
    </v-card>
    <v-dialog
      v-model="openDialogEdit"
      transition="dialog-bottom-transition"
      persistent
    >
      <v-card>
        <v-toolbar color="primary" dark
          ><h3>Edit TODO</h3></v-toolbar
        >
        <v-card-text>
          <v-list three-line subheader>
            <v-list-item>
              <v-list-item-content>
                <v-text-field
                  label="TODO"
                  v-model="toEditItem.todo"
                  filled
                ></v-text-field>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn text @click="sendItem">Edit</v-btn>
          <v-btn text @click="cancelEdit">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- add item -->
    <v-dialog
      v-model="addItemModal"
      transition="dialog-bottom-transition"
      persistent
    >
      <v-card>
        <v-toolbar color="primary" dark
          ><h3>Edit TODO</h3></v-toolbar
        >
        <v-card-text>
          <v-list three-line subheader>
            <v-list-item>
              <v-list-item-content>
                <v-text-field
                  label="TODO"
                  v-model="aItem.todo"
                  filled
                ></v-text-field>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <v-text-field
                  label="Description"
                  v-model="aItem.subtitle"
                  filled
                ></v-text-field>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <!-- <v-text-field
                  label="Start Date"
                  v-model="aItem.startdate"
                  filled
                ></v-text-field> -->

                <v-menu
                  v-model="aItem.startdate"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="date"
                      label="Picker without buttons"
                      prepend-icon="mdi-calendar"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="aItem.startdate"
                    @input="menu = false"
                  ></v-date-picker>
                </v-menu>

              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>

                <v-menu
                  v-model="aItem.deadline"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="date2"
                      label="Picker without buttons"
                      prepend-icon="mdi-calendar"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="aItem.deadline"
                    @input="menu2 = false"
                  ></v-date-picker>
                </v-menu>

                <!-- <v-text-field
                  label="Dealine"
                  v-model="aItem.deadline"
                  filled
                ></v-text-field> -->
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn text @click="sItem">Edit</v-btn>
          <v-btn text @click="cModalAItem">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import {mapGetters} from 'vuex'
export default {
  name: "HelloWorld",

  data: () => ({
    openDialogEdit: false,
    toEditItem: {},
    selected: [],
    select: [],
    menu: false,
    menu2: false,
    date2: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
    date: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
    aItem: {
      startdate: '',
      deadline: '',
      todo: '',
      subtitle: ''
    },
    addItemModal: false,
    search: ''
  }),
  computed: {
    items(){
      return this.$store.getters['getTodo'](this.search)
    },
    ...mapGetters({
      // items: 'getTodo'
    })
  },
  created () {
    // localStorage.setItem('items', JSON.parse(this.items))
    this.getData()
  },
  methods: {
    async getData(){
      await this.$axios.get('getTodos')
      .then(({data}) => {
        this.$store.dispatch('setTodo', data.data)
      })
    },
    editItem(d) {
      this.toEditItem = d;
      this.openDialogEdit = true;
    },
    async sendItem(){
      const toPass = {
        id: this.toEditItem.id,
        todo: this.toEditItem.todo
      }
      await this.$axios.patch('editTodo', toPass)
      .then(({data}) => {
        if(data.response){
          this.$store.dispatch('setTodo', data.data)
          this.openDialogEdit = false
        }
      })
    },
    cancelEdit(){
      this.openDialogEdit = false
      this.getData()
    },
    addItem(){
      this.addItemModal = true
    },
    async sItem(){
      // console.log(this.aItem)
      const toPass = {
        'startdate': this.aItem.startdate,
        'deadline': this.aItem.deadline,
        'todo': this.aItem.todo,
        'subtitle': this.aItem.subtitle
      };
      await this.$axios.post('iItem', toPass)
      .then(({data}) => {
        // console.log(data)
        if(data.response){
          this.$store.dispatch('setTodo', data.data)
          this.addItemModal = false
        }
      })
    },
    async deleteItem(d){
      await this.$axios.delete(`deleteTodo/${d.id}`)
      .then(({data}) => {
        if(data.response){
          this.select = []
          this.$store.dispatch('setTodo', data.data)
        }
      })
    },
    cModalAItem(){
      this.aItem = {
        startdate: '',
        deadline: '',
        todo: '',
        subtitle: ''
      }
      this.addItemModal = false
    }
  },
};
</script>
