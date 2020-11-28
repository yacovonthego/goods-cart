// весь компонент создан только для того чтобы для каждого input внутри был v-model 
// можно было бы и отдельно повесить @input для обновления свойства и :value для вывода
// но как я понял этого требовало тестовое задание
<template>
  <input type="number" class="browser-default amount" v-model="amount">  
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'AmountInput',
  props: {
    goodId: String
  },
  computed: {
    ...mapGetters({
      addedGoods: 'GET_ADDED_GOODS'
    }),
    amount: {
      get() {
        return this.addedGoods[this.goodId];
      },
      
      set(newAmount) {
        this.setAmount({goodId: this.goodId, amount: newAmount})
      }
    }
  },
  methods: {
    ...mapActions({
      setAmount: 'SET_AMOUNT'
    })
  }
}
</script>

<style>

</style>