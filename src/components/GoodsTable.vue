// список для вывода информации о группе товаров
<template>
  <ul class="collection with-header goods">
    <li class="collection-header">
      <h6>{{ group.groupName }}</h6>
    </li>
    <good-info
      v-for="(good, goodId) in group.goods"
      :key="goodId"
      :good-id="goodId"
    />
  </ul>
</template>

<script>
import {mapGetters} from 'vuex';
import GoodInfo from "@/components/GoodInfo"

export default {
  name: "GoodsTable",
  components: {
    GoodInfo
  },
  props: {
      group: Object
  },
  computed: {
    ...mapGetters({
      goods: 'GET_GOODS',
      changeRate: 'GET_CHANGE_RATE'
    })
  },
}
</script> 

<style lang="scss" scoped>
  .goods {

    &__item {
      cursor: pointer;

      &:hover {
        background-color: rgba(0,0,0, 0.05);
      }
    }
  }
</style>