<script lang="ts" setup>
import SidBar from "@/components/Sidebar/index.vue"
import MDEdit from "@/components/MDEdit/index.vue"
</script>

<template>
   <div class="home">
      <SidBar />
      <div class="edit">
         <MDEdit />
      </div>
   </div>
</template>

<style lang="scss" scoped>
.home {
   display: flex;

   .edit {
      height: 100vh;
      flex: 1;
      overflow: auto;
   }
}
</style>


