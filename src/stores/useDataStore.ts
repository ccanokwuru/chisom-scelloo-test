import { ref } from "vue";
import { defineStore } from "pinia";
import userData from "@constants/data.json";

export const useUserDataStore = defineStore("data", () => {
  // other options...
  const users = ref(userData);
  const filterUsers = (status: "active" | "inactive") =>
    (users.value = userData.filter(
      ({ userInfo }) => status === userInfo.status
    ));
  const sortUsers = (feild: string, order: "asc" | "desc" = "asc") =>
    users.value.sort((a, b) => {
      return order === "asc" && a[feild] >= b[feild] ? a : b;
    });
  const searchUser = (val: string) =>
    users.value.filter(({ userInfo, lastSeen, inventory, activities }) => {
      let { name, email } = userInfo;
      let { first, last, middle } = name;

      return (
        // by user info
        last.includes(val) ||
        first.includes(val) ||
        middle?.includes(val) ||
        email.includes(val) ||
        new Date(lastSeen ?? "").setHours(0, 0, 0) ===
          new Date(val).setHours(0, 0, 0) ||
        // by inventory
        inventory?.find(
          ({ dueDate, name }) =>
            name.includes(val) ||
            new Date(dueDate ?? "").setHours(0, 0, 0) ===
              new Date(val).setHours(0, 0, 0)
        ) ||
        // by activities
        activities?.find(
          ({ type, timestamp, description }) =>
            type.includes(val) ||
            description.includes(val) ||
            new Date(timestamp ?? "").setHours(0, 0, 0) ===
              new Date(val).setHours(0, 0, 0)
        )
      );
    });

  return {
    users,
    filterUsers,
    searchUser,
    sortUsers,
  };
});
