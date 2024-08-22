import { ref } from 'vue'
import { defineStore } from 'pinia'
import userData from '@constants/data.json'

export const useUserDataStore = defineStore('data', () => {
  const all = userData as User[]
  // other options...
  const users = ref(all)
  const filterUsers = (status?: UserInventory['paymentStatus'] | 'all') =>
    (users.value =
      status && status !== 'all'
        ? all.filter(({ inventory }) => inventory.some((i) => i.paymentStatus.toLowerCase() === status.toLowerCase()))
        : all) as User[]

  const sortUsers = (feild: string, order: 'asc' | 'desc' = 'asc') =>
    (users.value = users.value.sort((a, b) => {
      const aValue = feild.split('.').reduce((obj, key) => obj && obj[key], a)
      const bValue = feild.split('.').reduce((obj, key) => obj && obj[key], b)
      if (aValue === bValue) return 0
      if (order === 'asc') {
        return aValue < bValue ? -1 : 1
      } else {
        return aValue > bValue ? -1 : 1
      }
    }) as User[])

  const searchUser = (val: string) =>
    (users.value = users.value.filter(({ userInfo, lastSeen, inventory, activities }) => {
      let { name, email } = userInfo
      let { first, last, middle } = name

      return (
        // by user info
        last.includes(val) ||
        first.includes(val) ||
        middle?.includes(val) ||
        email.includes(val) ||
        new Date(lastSeen ?? '').setHours(0, 0, 0) === new Date(val).setHours(0, 0, 0) ||
        // by inventory
        inventory?.find(
          ({ dueDate, name }) =>
            name.includes(val) ||
            new Date(dueDate ?? '').setHours(0, 0, 0) === new Date(val).setHours(0, 0, 0)
        ) ||
        // by activities
        activities?.find(
          ({ type, timestamp, description }) =>
            type.includes(val) ||
            description.includes(val) ||
            new Date(timestamp ?? '').setHours(0, 0, 0) === new Date(val).setHours(0, 0, 0)
        )
      )
    }))

  const getUser = (id: string | number) =>
    users.value.find(({ userId }) => userId === id.toString()) as User | undefined

  const deleteUser = (userId:string)=>{
users.value = users.value.filter(({ userId }) => userId !== id.toString()) as Users[]
  }
  return {
    users,
    filterUsers,
    searchUser,
    sortUsers,
    getUser,
    deleteUser
  }
})

export type User = {
  userId: string
  userInfo: {
    name: {
      first: string
      last: string
      middle?: string
    }
    email: string
    status: 'active' | 'inactive'
    username: string
  }
  activities: UserActivity[]
  inventory: UserInventory[]
  lastSeen?: null | Date | string | number
}
export type UserActivity = {
  type: string
  timestamp: string
  description: string
}
export type UserInventory = {
  itemId: string
  name: string
  quantity: number
  price: number
  currencySymbol: string
  currencyIsoCode: string
  paymentStatus: 'paid' | 'unpaid' | 'overdue'
  dueDate: Date | string | number
}
