// компонент обертка для рендера списков товаров
<template>
  <div class="row">
    <div 
      class="col s6"
      v-for="(group, groupIndex) of groups"
      :key="groupIndex"
    >
      <goods-table
        :group="group"
      />
    </div>
  </div>
</template>

<script>
import GoodsTable from '@/components/GoodsTable';
import {mapGetters} from 'vuex';

export default {
  name: "GoodsList",
  components: {
    GoodsTable
  },
  computed: {
    ...mapGetters({
      groups: 'GET_GROUPS',
      goods: 'GET_GOODS'
    })
  }
}
</script>

<style>

</style>