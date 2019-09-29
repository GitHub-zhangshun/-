<template>
  <div class="bg">
    <div class="banner">
      <img src="@/assets/img/theme.png" alt="">
    </div>
    <div class="form">
      <div class="phone">
        <div class="left">
          <img src="@/assets/img/PositioningLeft.png" alt="">
        </div>
        <input type="text" placeholder="请输入手机号" v-model="phone">
        <div class="right">
          <img src="@/assets/img/PositioningRight.png" alt="">
        </div>
      </div>
      <div class="code">
        <input type="text" placeholder="请输入验证码" v-model="code">
        <van-button class="code_btn" :disabled="code_disabled" type="default" round :loading="code_loading"
          @click="sendCode">{{word}}</van-button>
      </div>
    </div>
    <van-button class="submit_btn" type="default" round :loading="login_loading" @click="login">确定</van-button>
    <div class="tips">
      <p>网贷有风险 出借需谨慎</p>
      <p>本活动最终解释权归成都融证通互联网信息服务有限公司所有</p>
    </div>
  </div>
</template>

<script>
  import {
    Button,
    Notify,
    Dialog
  } from 'vant';
  import request from '../utils/request.js'
  export default {
    components: {
      'van-button': Button
    },
    data() {
      return {
        code_loading: false,
        login_loading: false,
        phone: '',
        code: '',
        code_disabled: false,
        word: '获取验证码',
      }
    },
    methods: {
      testPhone() {
        const bo = !(/^1[345789]\d{9}$/.test(this.phone))
        return bo
      },
      testCode() {
        const bo = !(/^\d{6}$/.test(this.code))
        return bo
      },
      sendCode() {
        if (this.testPhone()) {
          Notify({
            type: 'danger',
            message: '请输入正确手机号',
            duration: 2000
          });
          return
        }
        this.code_loading = true
        request({
          url: '/security/sendCode',
          data: {
            phone: this.phone,
            type: 'auth'
          }
        }).then(data => {
          this.code_loading = false
          if (data.success) {
            this.code_disabled = true
            Notify({
              type: 'danger',
              message: '验证码发送成功，请注意查收',
              duration: 2000
            });
            let time = 60,
              that = this
            var sendTimer = window.setInterval(function () {
              time--;
              that.word = time + 'S';
              if (time < 0) {
                that.code_disabled = false;
                window.clearInterval(sendTimer);
                that.word = "获取验证码";
              }
            }, 1000)
          }else{
            this.code_loading = false
            Notify({
              type: 'danger',
              message: data.errorDescription || '系统繁忙',
              duration: 2000
            })
            if (data.error === 'PHONE_UNREGISTERED') {
              Dialog.confirm({
                title: '提示',
                message: '账号未注册，注册完成后可进行"和"粉认证，是否去注册？'
              }).then(() => {
                window.location.href = 'https://m.139lc.com/views/dl/register/register.html'
              })
              .catch( () => {})
            }
          }
        }).catch(() => {
          this.code_loading = false
          Notify({
              type: 'danger',
              message: data.errorDescription || '系统繁忙',
              duration: 2000
            });
        })
      },
      login() {
        if (this.testPhone() || this.testCode()) {
          return
        }
        this.login_loading = true
        request({
          url: '/security/login',
          data: {
            phone: this.phone,
            code: this.code,
            type: 'auth'
          }
        }).then(data => {
          this.login_loading = false
          if (data.success && data.result) {
            window.localStorage.setItem('tokenA', data.result)
            this.$router.push('/info')
          } else {
            Notify({
              type: 'danger',
              message: data.errorDescription || '系统繁忙',
              duration: 2000
            });
          }
        }).catch(() => {
          this.login_loading = false
          Notify({
            type: 'danger',
            message: data.errorDescription || '系统繁忙',
            duration: 2000
          });
        })
      }
    }
  }

</script>

<style lang="less" scoped>
  .bg {
    display: flex;
    flex-flow: column;
    align-items: center;
    min-height: 100vh;
    background: url('../assets/img/bg1.png') center center no-repeat;
    background-size: 100% 100%;
    position: relative;

    .banner {
      padding-top: 60px;
      width: 686px;
      height: 551px;

      img {
        width: 100%;
        height: 100%;
      }
    }

    .form {
      padding-top: 56px;

      .phone {
        display: flex;
        align-items: center;
        .left,
        .right {
          width: 43px;
          height: 94px;
          img {
            width: 100%;
            height: 100%;
          }
        }

        input {
          text-align: center;
          outline: none;
          border: none;
          margin: 0 14px;
          height: 90px;
          width: 582px;
          border-radius: 90px;
          font-size: 30px;
        }
        input::placeholder{
          padding-top: 5px;
        }
      }

      .code {
        padding: 32px 58px 54px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        input {
          text-align: center;
          outline: none;
          border: none;
          height: 90px;
          width: 362px;
          border-radius: 90px;
          font-size: 30px;
        }
        input::placeholder{
          padding-top: 5px;
        }
        .code_btn {
          width: 202px;
          height: 90px;
          background: #fffbb2;
          border: none;
          color: #ff3119;
          font-size: 26px;
        }
      }
    }

    /deep/.submit_btn {
      width: 582px;
      height: 90px;
      border: none;
      background: #ffd50a;
      font-size: 32px;
      color: #870405;
    }

    .tips {
      margin-top: 60px;
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
