import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import userData from '@constants/data.json'
import { useStorage } from '@vueuse/core'

export const useUserDataStore = defineStore('data', () => {
  const all_users = useStorage('users', userData as User[])
  // other options...
  const users = ref(all_users.value)
  const filter = ref<{
    payment?: UserInventory['paymentStatus'] | 'all'
    status?: User['userInfo']['status'] | 'all'
  }>({})
  const filterUsers = (status?: UserInventory['paymentStatus'] | 'all') => {
    filter.value.payment = status
    users.value =
      status && status !== 'all'
        ? all_users.value.filter(({ inventory }) =>
            inventory.some((i) => i.paymentStatus.toLowerCase() === status.toLowerCase())
          )
        : (all_users.value as User[])
  }
  const filterUsersByStatus = (status?: User['userInfo']['status'] | 'all') => {
    filter.value.status = status
    users.value =
      status && status !== 'all'
        ? all_users.value.filter(({ userInfo }) => userInfo.status === status)
        : users.value
  }

  const sortUsersByName = (feild: 'firstName' | 'lastName', order?: 'asc' | 'desc') => {
    order = order ?? 'asc'
    const f = feild.toLowerCase().replace('name', '') as 'first' | 'last'
    users.value = users.value.sort((a, b) => {
      const aValue = a.userInfo.name[f]
      const bValue = b.userInfo.name[f]

      if (aValue === bValue) return 0
      if (order === 'asc') {
        return aValue < bValue ? -1 : 1
      } else {
        return aValue > bValue ? -1 : 1
      }
    }) as User[]
  }

  const sortUsersByDate = (feild: 'dueDate' | 'lastSeen', order?: 'asc' | 'desc') => {
    order = order ?? 'asc'
    users.value = users.value.sort((a, b) => {
      const aValue =
        feild === 'lastSeen'
          ? new Date(a.lastSeen).getMilliseconds()
          : new Date(
              a.inventory.sort((c, d) =>
                new Date(c.dueDate).getTime() === new Date(d.dueDate).getTime()
                  ? 0
                  : new Date(c.dueDate).getTime() > new Date(d.dueDate).getTime()
                    ? 1
                    : 1
              )[0].dueDate
            ).getTime()
      const bValue =
        feild === 'lastSeen'
          ? new Date(b.lastSeen).getMilliseconds()
          : new Date(
              a.inventory.sort((c, d) =>
                new Date(c.dueDate).getTime() === new Date(d.dueDate).getTime()
                  ? 0
                  : new Date(c.dueDate).getTime() > new Date(d.dueDate).getTime()
                    ? 1
                    : 1
              )[0].dueDate
            ).getTime()
      if (aValue === bValue) return 0
      if (order === 'asc') {
        return aValue < bValue ? -1 : 1
      } else {
        return aValue > bValue ? -1 : 1
      }
    }) as User[]
  }

  const searchUser = (val: string) => {
    filterUsers(filter.value.payment)

    users.value = val.length
      ? users.value.filter(({ userInfo, lastSeen, inventory, activities }) => {
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
        })
      : all_users.value
  }

  const getUser = (id: string | number) =>
    users.value.find(({ userId }) => userId === id.toString()) as User | undefined

  const makePaid = (id: string | number) => {
    users.value = users.value.map((user) => {
      const { inventory, userId } = user
      if (id !== userId) return user
      return {
        ...user,
        inventory: inventory.map((e) => ({ ...e, paymentStatus: 'paid' }))
      }
    })
  }

  const deleteUser = (id: string) => {
    users.value = users.value.filter(({ userId }) => userId !== id.toString()) as User[]
  }
  return {
    all_users,
    users,
    filter,
    filterUsers,
    filterUsersByStatus,
    searchUser,
    sortUsersByDate,
    sortUsersByName,
    getUser,
    deleteUser,
    makePaid
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
  lastSeen: Date | string | number
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
