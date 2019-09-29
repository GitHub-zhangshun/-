<template>
  <div class="bg">
    <div class="banner">
      <img src="@/assets/img/theme.png" alt="">
    </div>
    <van-button class="submit_btn" type="default" round @click="$router.push('/info')">点击领取</van-button>
    <div class="tips">
      <p>网贷有风险 出借需谨慎</p>
      <p>本活动最终解释权归成都融证通互联网信息服务有限公司所有</p>
    </div>
  </div>
</template>

<script>
  import {
    Button
  } from 'vant';
  import request from '../utils/request.js'
  export default {
    components: {
      'van-button': Button
    },
    data() {
      return {
      }
    },
    created() {
      if (!window.localStorage.getItem('tokenA')) {
        this.$router.push('/login')
      }
    },
  }

</script>

<style lang="less" scoped>
  .bg {
    display: flex;
    flex-flow: column;
    align-items: center;
    height: 100vh;
    background: url('../assets/img/bg1.png') center center no-repeat;
    background-size: 100% 100%;
    position: relative;

    .banner {
      padding-top: 105px;
      width: 686px;
      height: 551px;

      img {
        width: 100%;
        height: 100%;
      }
    }

    .van-button {
      margin-top: 150px;
      width: 582px;
      height: 90px;
      border: none;
      background: #ffd50a;
      font-size: 32px;
      color: #870405;
    }

    .tips {
      position: absolute;
      bottom: 62px;
      color: #ffffff;
      text-align: center;

      p:first-child {
        font-size: 26px;
        padding-bottom: 26px;
      }

      p:nth-of-type(2) {
        font-size: 22px;
      }
    }
  }

</style>
