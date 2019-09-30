<template>
  <div class="content-wrapper">
    <div class="content">
      <div class="banner">
        <img src="@/assets/images/theme.png" >
      </div>
      <div class="time">
          <img src="@/assets/images/time.png">
      </div>
      <section class="phone">
        <input type="button" value="参与认证" @click="$router.push('/info')">
      </section>
    </div>
    <div class="tip">
      <span>网贷有风险&nbsp;出借需谨慎</span><br>
      <!-- <span>本活动最终解释权归成都融证通互联网信息服务有限公司所有</span> -->
    </div>
  </div>
</template>
<script>
  import '../assets/svg/icon.js'
  export default {
    data() {
      return {}
    },
    created () {
      if(!window.localStorage.getItem('tokenB')){
        this.$router.push('/login')
      }
    },
    methods: {

    }
  }

</script>
<style lang="less" scoped>
  .content-wrapper {
    min-height: 100vh;
    max-width: 100vw;
    width: 100vw;
    background: url('../assets/images/bg.png') no-repeat center center;
    background-size: 100% 100%;
    font-size: 28px;

    position: relative;

    .banner{
      position: absolute;
      top: 0;
      left: 50%;
      transform: translateX(-50%);
      img{
        width: 635px;
      }
    }
  
    .time{ 
      margin-top: 380px;
      text-align: center;
      img{
        width: 670px;
      }
    }

    .content {
      width: 100%;
      padding: 0 88px;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;

      section {
        display: flex;
        width: 100%;
        margin-bottom: 30px;

        >input {
          margin-top: 60px;
          border: none;
          outline: none;
          line-height: 88px;
          border-radius: 50px;
          text-align: center;
          width: 100%;
          background: #fed04f;
          font-size: 32px;
          color: #000000;
          font-weight: 500;
        }

        &.phone {
          position: relative;

          .icon {
            fill: #fff;
            width: 88px;
            height: 88px;
            position: absolute;

            &.left {
              left: -80px;
            }

            &.right {
              right: -75px;
            }
          }
        }
      }
    }

    .tip {
      // border: 1px solid;
      width: 100%;
      position: fixed;
      bottom: 46px;
      left: 0;
      font-size: 22px;
      font-weight: 500;
      text-align: center;
      line-height: 1.8em;
      color: #ffffff;
      span:first-of-type{
        font-size: 28px;
      }

      @media (max-width: 374px) {
        >span {
          display: inline-block;
          padding: 0 56px;
        }
      }
    }
  }

</style>
