<template>
  <div id="app">
    <el-container>
      <!--页面头部-->
      <el-header>

      </el-header>

      <el-container>
        <!--左边栏-->
        <el-aside width="200px">
              <el-menu :data="menuData" router class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose" >
                <!--<el-menu-item :route="{path: item.url, params:{test:'123'}}">-->
                  <!--<el-menu-item v-for="(item, index) in menuData" :key="index" :index="'' + index" :route="{name: 'rulelist', params: {id: item.id}}">-->
                  <el-menu-item v-for="(item, index) in menuData" :key="index" :index="item.description" :route="{name: 'rulelist', params: {id: item.id}}">
                  <i class="el-icon-menu"></i>
                  <span slot="title">{{item.description}}</span>
                </el-menu-item>
              </el-menu>
        </el-aside>
        <!--内容区域-->
        <el-main>
            <div style="margin-top:10px">
              <router-view></router-view>    <!-- 最重要的标签，用来显示跳转的页面 -->
            </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { getAlarmRuleList } from "../api/api";

export default {
    name: "Home",
    messageType: '',
    data() {
      return {
        menuData:''
      }
    },
    methods: {
      handleOpen(key, keyPath) {
        console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
      },
      alertMessage(message) {
        // this.$message({
        //   showClose: true,
        //   message: message,
        //   type: this.messageType
        // });
          this.$notify({
            message: message,
            type: this.messageType
          });
      },
      // handleSelect(key, keyPath) {
      //   console.log(key)
      //   // switch (key) {
      //   //   case '0-0':
      //   //     this.$router.push('/page1');
      //   //     break;
      //   //   case '0-1':
      //   //     this.$router.push('/page2');
      //   //     break;
      //   // }
      // },
    },
    created() {
      getAlarmRuleList().then(res => {
        let data = res.data;
        if (data.code ===1) {
          this. menuData = data.alarm_rule_list;
          this.messageType = 'success';
        }
        this.alertMessage(data.message);
        // for (each in res.data){
        //   console.log(each.description)
        // }
      })
    }
  }
</script>

<style scoped>

</style>
