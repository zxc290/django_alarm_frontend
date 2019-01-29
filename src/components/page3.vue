<template>
  <el-main>
    <el-row>
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick">

        <el-tab-pane label="默认发送规则" name="default_rule">
          <el-row style="float: left; margin: 20px 0">
            <el-form :inline="true" :model="alarmRuleForm" class="demo-form-inline">
              <el-form-item>
                <!--<el-select v-model="alarmRuleForm.rule_id" placeholder="请选择"  @change="handleSelectRule" >-->
                <el-select v-model="alarmRuleForm.rule_id" placeholder="请选择规则"  @change="handleSelectRule" >
                  <el-option
                    v-for="item in rules"
                    :key="item.id"
                    :label="item.description"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="handleSaveAlarmRule">保存</el-button>
              </el-form-item>
            </el-form>
          </el-row>
        </el-tab-pane>

        <el-tab-pane label="默认发送收件人" name="default_receivers">
          <el-row>
            <el-form :inline="true"  class="demo-form-inline" style="float: left; margin: 20px 0;">
              <!--<el-form-item>-->
              <!--<el-button type="danger" @click="handleSearch">搜索</el-button>-->
              <!--</el-form-item>-->
              <el-form-item>
                <el-button type="primary" @click="handleClickAddAlarmReceiver" icon="el-icon-plus">新建</el-button>
              </el-form-item>
              <el-form-item>
                <el-button type="danger" @click="handleMultiDelete">批量删除</el-button>
              </el-form-item>
            </el-form>
            <!--<el-table :data="FilteredTableData" @selection-change="handleSelectionChange">-->
            <el-table :data="alarmReceivers" @selection-change="handleSelectionChange">
              <el-table-column type="selection" width="55">
              </el-table-column>
              <el-table-column label="用户id" width="180" prop="userid" sortable>
                <template slot-scope="scope">
                  <span>{{ scope.row.userid }}</span>
                </template>
              </el-table-column>
              <el-table-column label="用户名" width="180" prop="useridentity" sortable>
                <template slot-scope="scope">
                  <span>{{ scope.row.useridentity }}</span>
                </template>
              </el-table-column>
              <el-table-column label="邮箱" width="180" prop="emailaddress" sortable>
                <template slot-scope="scope">
                  <span>{{ scope.row.emailaddress }}</span>
                </template>
              </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <!--<el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>-->
                  <el-button size="mini" type="danger" @click="handleDeleteAlarmReceiver(scope.$index, scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>

            <el-dialog title="添加报警收件人" :visible.sync="addAlarmReceiverFormVisible" center>
              <el-form ref="form" :model="addAlarmReceiverForm">
                <el-form-item label="收件人" :label-width="formLabelWidth">
                  <el-select v-model="addAlarmReceiverForm.user_id" placeholder="请选择收件人" style="width: 100%">
                    <el-option v-for="(item, index) in users" :key="index" :label="item.useridentity" :value="item.userid"></el-option>
                  </el-select>
                </el-form-item>
              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button @click="cancelAddAlarmReceiverForm">取 消</el-button>
                <el-button type="primary" @click="submitAddAlarmReceiverForm">确 定</el-button>
              </div>
            </el-dialog>

          </el-row>
        </el-tab-pane>

        <el-tab-pane label="游戏发送规则" name="game_rule">
          <el-row>
            <el-form :inline="true" :model="gameRuleForm" class="demo-form-inline" style="float: left">
              <el-form-item label="游戏">
                <!--<el-select v-model="alarmRuleForm.rule_id" placeholder="请选择"  @change="handleSelectRule" >-->
                <el-select :disabled="!hasGameSettings" v-model="gameRuleForm.game" placeholder="请选择游戏" style="float: left; margin-bottom: 20px" @change="handleSelectGame">
                  <el-option
                    v-for="item in alarmGames"
                    :key="item.game"
                    :label="item.game"
                    :value="item.game">
                  </el-option>
                </el-select>
              </el-form-item>

              <el-form-item label="规则">
                <el-select :disabled="!hasGameSettings" v-model="gameRuleForm.rule_id" placeholder="请选择规则" style="float: left; margin-bottom: 20px" @change="handleSelectGame">
                  <el-option
                    v-for="item in rules"
                    :key="item.id"
                    :label="item.description"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="handleSaveAlarmRule">保存</el-button>
              </el-form-item>
            </el-form>
          </el-row>

        </el-tab-pane>

        <el-tab-pane label="游戏发送收件人" name="game_receivers">
          <el-table :data="gameReceivers" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55">
            </el-table-column>
            <el-table-column label="用户名" width="180" prop="useridentity" sortable>
              <template slot-scope="scope">
                <span>{{ scope.row.useridentity }}</span>
              </template>
            </el-table-column>
            <el-table-column label="邮箱" width="180" prop="emailaddress" sortable>
              <template slot-scope="scope">
                <span>{{ scope.row.emailaddress }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-row>
    <!--工具框-->
    <!--<el-col :span="8">-->
      <!--<el-form :inline="true" :model="formInline"  class="demo-form-inline">-->
        <!--&lt;!&ndash;<el-form-item>&ndash;&gt;-->
        <!--&lt;!&ndash;<el-button type="danger" @click="handleSearch">搜索</el-button>&ndash;&gt;-->
        <!--&lt;!&ndash;</el-form-item>&ndash;&gt;-->
        <!--<el-form-item>-->
          <!--<el-button type="primary" @click="handleAddNew" icon="el-icon-plus">新建</el-button>-->
        <!--</el-form-item>-->
        <!--<el-form-item>-->
          <!--<el-button type="danger" @click="handleMultiDelete">批量删除</el-button>-->
        <!--</el-form-item>-->
        <!--<el-form-item>-->
          <!--<el-input v-model="formInline.game" placeholder="游戏名"></el-input>-->
        <!--</el-form-item>-->
      <!--</el-form>-->
    <!--</el-col>-->
    <!--&lt;!&ndash;表格&ndash;&gt;-->

    <!--&lt;!&ndash;弹出表单&ndash;&gt;-->
    <!--<el-dialog :title=ruleForm.title :visible.sync="dialogFormVisible" center>-->
      <!--<el-form ref="form" :model="ruleForm">-->
        <!--<el-form-item label="邮件类型" :label-width="formLabelWidth">-->
          <!--<el-input v-model="ruleForm.alarm_type" readonly></el-input>-->
        <!--</el-form-item>-->
        <!--<el-form-item label="描述" :label-width="formLabelWidth">-->
          <!--<el-input v-model="ruleForm.description" readonly></el-input>-->
        <!--</el-form-item>-->
        <!--<el-form-item label="游戏名" :label-width="formLabelWidth">-->
          <!--<el-select v-model="ruleForm.game" placeholder="请选择游戏" style="width: 100%">-->
            <!--<el-option v-for="(item, index) in gameList" :key="index" :label="item.gname" :value="item.gname"></el-option>-->
          <!--</el-select>-->
        <!--</el-form-item>-->
        <!--<el-form-item label="收件人" :label-width="formLabelWidth" >-->
          <!--<el-select v-model="ruleForm.receiver" placeholder="请选择收件人" style="width: 100%">-->
            <!--<el-option v-for="(item, index) in userList" :key="index" :label="item.useridentity" :value="item.useridentity"></el-option>-->
          <!--</el-select>-->
        <!--</el-form-item>-->
        <!--<el-form-item label="发送规则" :label-width="formLabelWidth" >-->
          <!--<el-select v-model="ruleForm.send_rule" placeholder="请选择发送规则" style="width: 100%">-->
            <!--<el-option v-for="(item, index) in sendRuleList" :key="index" :label="item.description" :value="item.description"></el-option>-->
          <!--</el-select>-->
        <!--</el-form-item>-->
      <!--</el-form>-->
      <!--<div slot="footer" class="dialog-footer">-->
        <!--<el-button @click="cancelRuleForm">取 消</el-button>-->
        <!--<el-button type="primary" @click="submitRuleForm">确 定</el-button>-->
      <!--</div>-->
    <!--</el-dialog>-->

  </el-main>
</template>

<script>
  import { getDetail, addRule, editRule, deleteRule, multiDeleteRule, getInitialOptions } from "../api/api";

  export default {
    name: "page3",
    data() {
      return {
        // 游戏选项
        games: [],
        gameValue: '',
        // 规则选项
        rules: [],
        alarmRuleValue: '',
        gameRuleValue: '',
        // 人员选项
        users: [],

        activeName: 'first',
        // 报警下是否按游戏分
        hasGameSettings: false,
        // 报警收件人
        alarmReceivers: [],
        // 报警下游戏
        alarmGames: [],
        // 游戏收件人
        gameReceivers: [],
        // 游戏发送规则
        gameRule: '',
        // 默认报警表单
        alarmRuleForm: {
          'alarm_id': '',
          'rule_id': '',
        },
        // 新增报警收件人表单
        addAlarmReceiverForm: {
          'alarm_id': '',
          'user_id': '',
        },
        addAlarmReceiverFormVisible: false,
        // 游戏报警表单
        gameRuleForm: {
          'alarm_id': '',
          'game': '',
          'rule_id': '',
        },


        formLabelWidth: '120px',
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
        // gameList: [],
        // 用户列表
        // 发送规则列表
        sendRuleList: [],
        // 弹出框

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
        editRuleId: 0,
        defaultRule: '',
        messageType: ''
      }
    },
    methods: {
      handleClick(tab, event) {
        console.log(tab, event);
      },
      handleSelectGame(value) {
        // this.ruleValue = this.games.filter(data => data.game === value)[0].send_rules
        let selectedGame = this.alarmGames.filter(data => data.game === value)[0];
        this.alarmRuleValue = selectedGame.id;
        this.gameRuleForm.game = selectedGame.game;
        this.gameRuleForm.rule_id = selectedGame.rule_id;
        this.gameReceivers = selectedGame.receivers;
        // console.log('daying rule')
        // console.log(this.ruleValue)
      },
      handleSelectRule(value) {
        // console.log(this.alarmRuleValue)
        // console.log(value)
      },

      handleSaveAlarmRule() {
        let data = this.alarmRuleForm;
        data.alarm_id = this.id;
        // 提交请求
        // console.log(this.id)
      },

      handleDeleteAlarmReceiver() {
        this.$confirm('确认删除？').then(_ => {
          // let game = row.game;
          // let receiver = row.receiver;
          // let alarmId = this.id;
          let userId = row.id;
          let alarmId = this.id;

          // this.delArr.push(GameOperationId);
          deleteRule(GameOperationId).then(res => {
            let data = res.data;
            if (data.code === 1) {
              this.messageType = 'success';
              this.getAlarmDetail();
            } else if (data.code === 0) {
              this.messageType = 'error';
            }
            this.alertMessage(data.message);
          })
        })
        // .catch(_ => {});
      },

      handleClickAddAlarmReceiver() {
        this.addAlarmReceiverFormVisible = true;
      },

      submitAddAlarmReceiverForm() {
        console.log(this.addAlarmReceiverForm)
        this.addAlarmReceiverForm.user_id = '';
        this.addAlarmReceiverForm.alarm_id = '';
        this.addAlarmReceiverFormVisible = false;
      },

      cancelAddAlarmReceiverForm() {
        this.addAlarmReceiverForm.user_id = '';
        this.addAlarmReceiverForm.alarm_id = '';
        this.addAlarmReceiverFormVisible = false;
      },

      handleAddNew() {
        getRuleFormOptions().then(res => {
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
              this.getAlarmDetail();
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
              this.getAlarmDetail();
            } else if (data.code ===0 ) {
              this.messageType = 'error';
            }
            this.alertMessage(data.message);
          })
        })
        // .catch(_ => {});
      },
      getAlarmDetail(){
        let alarmId = this.id;
        getDetail(alarmId).then(res => {
          let data = res.data;
          console.log(data);
          if (data.code ===1 ) {
            this.messageType = 'success';

            this.gameValue = '';
            this.gameRuleValue = '';

            this.hasGameSettings = data.alarm_rule_dict.receivers_by_games;

            this.alarmRuleForm.rule_id = data.alarm_rule_dict.rule_id;

            this.alarmReceivers = data.alarm_rule_dict.receivers;
            this.alarmGames = data.alarm_rule_dict.GameOperation_set;

            // if (!this.hasGameSettings) {
            //
            //   this.alarmReceivers = data.alarm_rule_dict.receivers;
            //
            //   // this.games = data.alarm_rule_dict.GameOperation_set;
            //   // this.ruleValue = data.alarm_rule_dict.rule_id;
            //   // console.log(this.alarmData)
            // } else {
            //   this.alarmGames = data.alarm_rule_dict.GameOperation_set;
            //   // let gameOperations = data.alarm_rule_dict.GameOperation_set;
            //   // gameOperations.forEach(data => {
            //   //   this.alarmGames.push(data.game)
            //   // });
            //   // this.alarmGames =
            // }


            // this.tableData = data.alarm_rule_dict.GameOperation_set;
            // this.ruleForm.alarm_type = data.alarm_rule_dict.alarm_type;
            // this.ruleForm.description = data.alarm_rule_dict.description;
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
              this.getAlarmDetail();
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
              this.getAlarmDetail();
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
        // console.log(this.tableData);
        // console.log('submit!');
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
          this.users = data.users;
          this.games = data.games;
          this.rules = data.rules;
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
      '$route': 'getAlarmDetail'
    },
  }
</script>

<style scoped>

</style>
