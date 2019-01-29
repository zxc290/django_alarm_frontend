<template>
  <el-main>
    <!--工具框-->
    <el-col :span="8">
    <el-form :inline="true" :model="formInline"  class="demo-form-inline">
      <!--<el-form-item>-->
        <!--<el-button type="danger" @click="handleSearch">搜索</el-button>-->
      <!--</el-form-item>-->
      <el-form-item>
        <el-button type="primary" @click="handleAddNew" icon="el-icon-plus">新建</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="danger" @click="handleMultiDelete">批量删除</el-button>
      </el-form-item>
      <el-form-item>
        <el-input v-model="formInline.game" placeholder="游戏名"></el-input>
      </el-form-item>
    </el-form>
    </el-col>
    <!--表格-->
  <el-table :data="FilteredTableData" @selection-change="handleSelectionChange">
    <el-table-column type="selection" width="55">
    </el-table-column>
    <el-table-column label="序号" width="180" prop="id" sortable>
      <template slot-scope="scope">
        <span>{{ scope.row.id }}</span>
      </template>
    </el-table-column>
    <el-table-column label="游戏名" width="180" prop="game" sortable>
      <template slot-scope="scope">
        <span>{{ scope.row.game }}</span>
      </template>
    </el-table-column>
    <el-table-column label="收件人" width="180" prop="receiver" sortable>
      <template slot-scope="scope">
        <span>{{ scope.row.receiver }}</span>
      </template>
    </el-table-column>
    <el-table-column label="发送规则" width="180" prop="receiver" sortable>
      <template slot-scope="scope">
        <span>{{ scope.row.send_rules }}</span>
      </template>
    </el-table-column>
    <el-table-column label="操作">
      <template slot-scope="scope">
        <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
        <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
    <!--弹出表单-->
    <el-dialog :title=ruleForm.title :visible.sync="dialogFormVisible" center>
      <el-form ref="form" :model="ruleForm">
        <el-form-item label="邮件类型" :label-width="formLabelWidth">
          <el-input v-model="ruleForm.alarm_type" readonly></el-input>
        </el-form-item>
        <el-form-item label="描述" :label-width="formLabelWidth">
          <el-input v-model="ruleForm.description" readonly></el-input>
        </el-form-item>
        <el-form-item label="游戏名" :label-width="formLabelWidth">
          <el-select v-model="ruleForm.game" placeholder="请选择游戏" style="width: 100%">
            <el-option v-for="(item, index) in gameList" :key="index" :label="item.gname" :value="item.gname"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="收件人" :label-width="formLabelWidth" >
          <el-select v-model="ruleForm.receiver" placeholder="请选择收件人" style="width: 100%">
            <el-option v-for="(item, index) in userList" :key="index" :label="item.useridentity" :value="item.useridentity"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="发送规则" :label-width="formLabelWidth" >
          <el-select v-model="ruleForm.send_rule" placeholder="请选择发送规则" style="width: 100%">
            <el-option v-for="(item, index) in sendRuleList" :key="index" :label="item.description" :value="item.description"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelRuleForm">取 消</el-button>
        <el-button type="primary" @click="submitRuleForm">确 定</el-button>
      </div>
    </el-dialog>

  </el-main>
</template>

<script>
  import { getDetail, getInitialOptions, getUser, getGame, getRule, addRule, editRule, deleteRule, multiDeleteRule } from "../api/api";

  export default {
    name: "page2",
    data() {
      return {
        // 路由
        path: this.$router.currentRoute.path,
        // 表单数据
        tableData: [],
        // 选中项
        multipleSelection: [],
        // 删除项
        delArr: [],
        // 工具栏
        formInline: {
          game: '',
          receiver: ''
        },
        // 游戏列表
        gameList: [],
        // 用户列表
        userList: [],
        // 发送规则列表
        sendRuleList: [],
        // 弹出框
        dialogFormVisible: false,
        ruleForm: {
          title: '',
          alarm_type: '',
          description: '',
          game: '',
          receiver: '',
          send_rule: '',
          // delivery: false,
          // type: [],
          // resource: '',
          // desc: ''
        },
        formLabelWidth: '120px',
        editRuleId: 0,
        defaultRule: '',
        messageType: ''
      }
    },
    methods: {
      handleAddNew() {
        getInitialOptions().then(res => {
          let data = res.data;
          if (data.code === 1) {
            this.userList = data.user_list;
            this.gameList = data.game_list;
            this.sendRuleList = data.send_rule_list;
            this.messageType = 'success';
          }
          this.alertMessage(data.message);
        });
        this.dialogFormVisible = true;
        this.ruleForm.title = '新建规则';
        this.ruleForm.game = '';
        this.ruleForm.receiver = '';
        this.ruleForm.send_rule = this.defaultRule;
      },
      handleEdit(index, row) {
        this.dialogFormVisible = true;
        this.editRuleId = row.id;
        this.ruleForm.title = '编辑规则';
        this.ruleForm.game = row.game;
        this.ruleForm.receiver = row.receiver;
        this.ruleForm.send_rule = row.send_rules;
        // this.ruleForm.
        // console.log(index, row);
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
        // console.log(val)
      },
      // 删除列表单项
      handleDelete(index, row) {
        this.$confirm('确认删除？').then(_ => {
          // let game = row.game;
          // let receiver = row.receiver;
          // let alarmId = this.id;
          let GameOperationId = row.id;
          // this.delArr.push(GameOperationId);
          deleteRule(GameOperationId).then(res => {
            let data = res.data;
            if (data.code === 1) {
              this.messageType = 'success';
              this.fetchData();
            } else if (data.code === 0) {
              this.messageType = 'error';
            }
            this.alertMessage(data.message);
          })
        })
          // .catch(_ => {});

      },

      // 批量删除
      handleMultiDelete() {
        this.$confirm('确认批量删除？').then(_ => {
          let alarmId = this.id;
          let length = this.multipleSelection.length;
          for (let i = 0; i < length; i++){
            this.delArr.push(this.multipleSelection[i].id)
          }
          multiDeleteRule(this.delArr).then(res => {
            let data = res.data;
            if (data.code ===1 ) {
              this.messageType = 'success';
              this.fetchData();
            } else if (data.code ===0 ) {
              this.messageType = 'error';
            }
            this.alertMessage(data.message);
          })
        })
          // .catch(_ => {});
      },
      fetchData(){
        let alarmId = this.id;
        getDetail(alarmId).then(res => {
          let data = res.data;
          console.log(data);
          if (data.code ===1 ) {
            this.messageType = 'success';
            this.tableData = data.alarm_rule_dict.GameOperation_set;
            this.defaultRule = data.alarm_rule_dict.send_rules;
            this.ruleForm.alarm_type = data.alarm_rule_dict.alarm_type;
            this.ruleForm.description = data.alarm_rule_dict.description;
          }
          this.alertMessage(data.message);
          // let alarmDetail = res.data;
          // console.log(alarmDetail);
          // this.tableData = alarmDetail.GameOperation_set;
          // this.defaultRule = alarmDetail.send_rules;
          // this.ruleForm.alarm_type = alarmDetail.alarm_type;
          // this.ruleForm.description = alarmDetail.description;
        })
      },

      submitRuleForm() {
        let formData = this.ruleForm;
        if (this.editRuleId !== 0) {
          editRule(formData, this.editRuleId).then(res => {
            let data = res.data;
            if (data.code === 1) {
              this.messageType = 'success';
              this.fetchData();
            } else if (data.code === 0) {
              this.messageType = 'error';
            }
            this.alertMessage(data.message);
          });
        } else {
          addRule(formData).then(res => {
            let data = res.data;
            if (data.code === 1) {
              this.messageType = 'success';
              this.fetchData();
            } else if (data.code ===0 ) {
              this.messageType = 'error';
            }
            this.alertMessage(data.message);
          });
        }
        this.dialogFormVisible = false;
        this.editRuleId = 0;
        // console.log('submit!');
      },
      cancelRuleForm() {
        this.dialogFormVisible = false;
        this.editRuleId = 0;
      },
      handleSearch() {
        console.log(this.tableData);
        console.log('submit!');
      },

      handleClose(done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {});
      },
      alertMessage(message) {
        // this.$message({
        //   showClose: true,
        //   message: message,
        //   type: this.messageType
        // });
        this.$notify({
          // title: '成功',
          message: message,
          type: this.messageType
        });
      },
    },
    created() {
      getInitialOptions().then(res => {
        let data = res.data;
        if (data.code === 1) {
          this.userList = data.user_list;
          this.gameList = data.game_list;
          this.sendRuleList = data.send_rule_list;
          this.messageType = 'success';
        }
        this.alertMessage(data.message);
      });
    },
    computed: {
      FilteredTableData() {
        let gameSearch = this.formInline.game;
        if (gameSearch) {
          return this.tableData.filter(data => {
            return Object.keys(data).some(key => {
              return String(data[key]).toLowerCase().indexOf(gameSearch) > -1
            })
          })
        }
        return this.tableData;
      }
    },
    props: ['id'],
    watch: {
      '$route': 'fetchData'
    },
    }
</script>

<style scoped>

</style>
