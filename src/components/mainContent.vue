<template>
  <el-main>
    <el-row>
      <el-tabs v-model="activeName" type="card">
        <!--默认发送规则标签页-->
        <el-tab-pane label="默认发送规则" name="default_rule">
          <el-row style="float: left; margin: 20px 0">
            <!--默认发送规则表单-->
            <el-form :inline="true" :model="alarmRuleForm" class="demo-form-inline">
              <el-form-item>
                <el-select v-model="alarmRuleForm.rule_id" placeholder="请选择规则">
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
        <!--默认发送收件人标签页-->
        <el-tab-pane label="默认发送收件人" name="default_receivers">
          <el-row>
            <el-form :inline="true"  class="demo-form-inline" style="float: left;">
              <el-form-item>
                <el-button type="danger" @click="handleEditAlarmReceiver" style="float: left;">编辑</el-button>
              </el-form-item>
            </el-form>
            <!--默认发送收件人列表-->
            <!--<el-table :data="alarmReceivers">-->
            <el-table :data="alarmReceivers.filter(data => !alarmReceiverFilter || data.useridentity.toLowerCase().includes(alarmReceiverFilter.toLowerCase()))">
              <el-table-column label="用户名" width="200" prop="useridentity" sortable>
                <template slot-scope="scope">
                  <span>{{ scope.row.useridentity }}</span>
                </template>
              </el-table-column>
              <el-table-column label="邮箱" width="200" prop="emailaddress" sortable>
                <template slot-scope="scope">
                  <span>{{ scope.row.emailaddress }}</span>
                </template>
              </el-table-column>
              <el-table-column
                width="200" align="right">
                <template slot="header" slot-scope="scope">
                  <el-input v-model="alarmReceiverFilter" size="medium" placeholder="输入收件人搜索"></el-input>
                </template>
              </el-table-column>
            </el-table>
            <!--默认发送收件人弹出编辑表单-->
            <el-dialog title="编辑报警收件人" :visible.sync="editAlarmReceiverFormVisible" center>
              <el-form ref="form" :model="editAlarmReceiverForm">
                <el-form-item label="收件人" :label-width="formLabelWidth">
                  <el-select multiple v-model="editAlarmReceiverForm.user_id_list" placeholder="请选择收件人" style="width: 100%">
                    <el-option v-for="(item, index) in users" :key="index" :label="item.useridentity" :value="item.userid"></el-option>
                  </el-select>
                </el-form-item>
              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button @click="cancelEditAlarmReceiverForm">取 消</el-button>
                <el-button type="primary" @click="submitEditAlarmReceiverForm">确 定</el-button>
              </div>
            </el-dialog>
          </el-row>
        </el-tab-pane>
        <!--游戏发送规则标签页-->
        <el-tab-pane label="游戏发送规则" name="game_rule" v-if="hasGameSettings">
          <el-row>
            <el-form :inline="true"  class="demo-form-inline" style="float: left;">
              <!--<el-form-item>-->
                <!--<el-input placeholder="请输入游戏名" v-model="gameRuleFilter">-->
                <!--</el-input>-->
              <!--</el-form-item>-->
              <el-form-item>
                <el-button type="primary" @click="handleAddGameRule" style="float: left;">新增</el-button>
              </el-form-item>

            </el-form>
            <el-table :data="alarmGames.filter(data => !gameRuleFilter || data.game.toLowerCase().includes(gameRuleFilter.toLowerCase()))" style="width: 100%">
              <el-table-column
                prop="id"
                label="游戏规则序号"
                width="200"
                v-if="false">
              </el-table-column>
              <el-table-column
                prop="game"
                label="游戏名"
                width="200"
                sortable>
              </el-table-column>
              <el-table-column
                prop="rule_id"
                label="发送规则"
                width="200"
                sortable>
              </el-table-column>
              <el-table-column
                width="200" align="right">
                <template slot="header" slot-scope="scope">
                  <el-input v-model="gameRuleFilter" size="medium" placeholder="输入游戏搜索"></el-input>
                </template>
                <template slot-scope="scope">
                <el-button
                size="mini"
                @click="handleEditGameRule(scope.$index, scope.row)">编辑</el-button>
                <el-button
                size="mini"
                type="danger"
                @click="handleDeleteGameRule(scope.$index, scope.row)">删除</el-button>
                </template>
              </el-table-column>
              <!--<el-table-column-->
                <!--label="操作"-->
                <!--width="100">-->
                <!--<template slot-scope="scope">-->
                  <!--<el-button @click="handleEditGameRule(scope.row)" type="text">编辑</el-button>-->
                <!--</template>-->
              <!--</el-table-column>-->
            </el-table>

            <!--游戏发送收件人编辑弹出表单-->
            <el-dialog :title="editGameRuleForm.title" :visible.sync="editGameRuleFormVisible" center>
              <el-form ref="form" :model="editGameRuleForm">
                <el-form-item label="游戏规则id" :label-width="formLabelWidth">
                  <el-input v-model="editGameRuleForm.id"></el-input>
                </el-form-item>
                <!--<el-form-item label="游戏" :label-width="formLabelWidth">-->
                  <!--<el-input v-model="editGameRuleForm.game"></el-input>-->
                <!--</el-form-item>-->
                <el-form-item label="游戏" :label-width="formLabelWidth">
                  <el-select v-model="editGameRuleForm.game" placeholder="请选择游戏" style="width: 100%">
                    <el-option v-for="(item, index) in games" :key="index" :label="item.gname" :value="item.gid"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="规则" :label-width="formLabelWidth">
                  <el-select v-model="editGameRuleForm.rule_id" placeholder="请选择规则" style="width: 100%">
                    <el-option v-for="(item, index) in rules" :key="index" :label="item.description" :value="item.id"></el-option>
                  </el-select>
                </el-form-item>
              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button @click="cancelEditGameRuleForm">取 消</el-button>
                <el-button type="primary" @click="submitEditGameRuleForm">确 定</el-button>
              </div>
            </el-dialog>

          </el-row>
        </el-tab-pane>
        <!--游戏发送收件人标签页-->
        <el-tab-pane label="游戏发送收件人" name="game_receivers" v-if="hasGameSettings">
          <el-row>
            <el-form :inline="true" :model="editGameReceiverForm" class="demo-form-inline" style="float: left">
              <el-form-item>
                <el-select v-model="editGameReceiverForm.game" placeholder="请选择游戏" style="float: left;" @change="handleSelectGameReceiverGame">
                  <el-option
                    v-for="item in alarmGames"
                    :key="item.game"
                    :label="item.game"
                    :value="item.game">
                  </el-option>
                </el-select>
              </el-form-item>
              <!--<el-form-item>-->
                <!--<el-input placeholder="请输入收件人" v-model="gameReceiverFilter">-->
                <!--</el-input>-->
              <!--</el-form-item>-->
              <el-form-item>
                <el-button type="danger" @click="handleEditGameReceiver" style="float: left;">编辑</el-button>
              </el-form-item>
            </el-form>
          </el-row>
          <el-row>
            <!--游戏发送收件人列表-->
          <el-table :data="gameReceivers.filter(data => !gameReceiverFilter || data.useridentity.toLowerCase().includes(gameReceiverFilter.toLowerCase()))" style="width: 100%">
            <el-table-column label="用户名" width="200" prop="useridentity" sortable>
              <template slot-scope="scope">
                <span>{{ scope.row.useridentity }}</span>
              </template>
            </el-table-column>
            <el-table-column label="邮箱" width="200" prop="emailaddress" sortable>
              <template slot-scope="scope">
                <span>{{ scope.row.emailaddress }}</span>
              </template>
            </el-table-column>
            <el-table-column
              width="200" align="right">
              <template slot="header" slot-scope="scope">
                <el-input v-model="gameReceiverFilter" size="medium" placeholder="输入收件人搜索"></el-input>
              </template>
              <!--<template slot-scope="scope">-->
                <!--<el-button-->
                  <!--size="mini"-->
                  <!--@click="handleEdit(scope.$index, scope.row)">编辑</el-button>-->
                <!--<el-button-->
                  <!--size="mini"-->
                  <!--type="danger"-->
                  <!--@click="handleDelete(scope.$index, scope.row)">删除</el-button>-->
              <!--</template>-->
            </el-table-column>
          </el-table>
            <!--游戏发送收件人编辑弹出表单-->
          <el-dialog title="编辑游戏收件人" :visible.sync="editGameReceiverFormVisible" center>
            <el-form ref="form" :model="editGameReceiverForm">
              <el-form-item label="游戏操作id" :label-width="formLabelWidth" v-show="false">
                <el-input v-model="editGameReceiverForm.id"></el-input>
              </el-form-item>
              <el-form-item label="收件人" :label-width="formLabelWidth">
                <el-select multiple v-model="editGameReceiverForm.user_id_list" placeholder="请选择收件人" style="width: 100%">
                  <el-option v-for="(item, index) in users" :key="index" :label="item.useridentity" :value="item.userid"></el-option>
                </el-select>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="cancelEditGameReceiverForm">取 消</el-button>
              <el-button type="primary" @click="submitEditGameReceiverForm">确 定</el-button>
            </div>
          </el-dialog>
          </el-row>
        </el-tab-pane>
      </el-tabs>
    </el-row>
  </el-main>
</template>

<script>
  import { updateAlarmRule, updateAlarmReceiver, updateGameRule, updateGameReceiver, getDetail, getInitialOptions } from "../api/api";

  export default {
    name: "page3",
    data() {
      return {
        // 游戏选项
        games: [],
        // gameValue: '',
        // 规则选项
        rules: [],
        // alarmRuleValue: '',
        // gameRuleValue: '',
        // 人员选项
        users: [],

        activeName: 'first',
        // 报警下是否按游戏分
        hasGameSettings: false,
       // 报警收件人
        alarmReceivers: [],
        // 报警下游戏
        alarmGames: [],
        // 报警收件人过滤
        alarmReceiverFilter: '',
        // 游戏收件人
        gameReceivers: [],
        // 游戏收件人过滤
        gameReceiverFilter: '',
        // 游戏发送规则
        gameRules: [],
        // 游戏规则过滤
        gameRuleFilter: '',
        // 默认报警表单
        alarmRuleForm: {
          'rule_id': '',
        },
        // 编辑报警收件人表单
        editAlarmReceiverForm: {
          'user_id_list': [],
        },
        editAlarmReceiverFormVisible: false,
        editGameRuleFormVisible: false,
        editGameReceiverFormVisible: false,
        // 游戏报警表单
        gameRuleForm: {
          'id': '',
          'game': '',
          'rule_id': '',
        },
        // 游戏报警表单规则
        gameRuleFormRules: {
          game: [
            { required: true, message: '请选择游戏', trigger: 'change' }
          ],
          rule_id: [
            { required: true, message: '请选择规则', trigger: 'change' }
          ]
        },
        // 编辑游戏规则表单
        editGameRuleForm: {
          'title': '',
          'id': '',
          'game': '',
          'rule_id': '',
        },
        // 编辑游戏收件人表单
        editGameReceiverForm: {
          'id': '',
          'user_id_list': [],
        },

        formLabelWidth: '120px',
        // 路由
        path: this.$router.currentRoute.path,
        // 弹出消息类型
        messageType: '',
      }
    },
    methods: {
      // 保存报警规则·
      handleSaveAlarmRule() {
        this.$confirm('确认保存？').then(() => {
          updateAlarmRule(this.alarmRuleForm, this.id).then(res => {
            let data = res.data;
            if (data.code === 1) {
              this.messageType = 'success';

            } else if (data.code === 0) {
              this.messageType = 'error';
            }
            this.alertMessage(data.message);
          });
        }).catch(() => {

        });
      },
      // 编辑报警收件人表单
      handleEditAlarmReceiver() {
        // 清空默认收件人
        this.editAlarmReceiverForm.user_id_list = [];
        // 填充默认收件人
        this.editAlarmReceiverForm.user_id_list = this.alarmReceivers.map(data => data.userid);
        this.editAlarmReceiverFormVisible = true;
      },

      // 提交报警收件人
      submitEditAlarmReceiverForm() {
        this.$confirm('确认保存？').then(() => {
          updateAlarmReceiver(this.editAlarmReceiverForm, this.id).then(res => {
            let data = res.data;
            if (data.code === 1) {
              this.messageType = 'success';
              let alarmData = data.alarm;
              let receiversId = alarmData.receivers.split(',').map(Number);
              this.alarmReceivers = this.users.filter(data => receiversId.indexOf(data.userid) !== -1);
            } else if (data.code === 0) {
              this.messageType = 'error';
            } else if (data.code === 2) {
              this.handleTokenExpired(data.message)
            }
            this.alertMessage(data.message);
          });
        })
          .catch((e) => {

          });
        this.editAlarmReceiverFormVisible = false;
      },
      cancelEditAlarmReceiverForm() {
        this.editAlarmReceiverFormVisible = false;
      },
      // 新增游戏规则
      handleAddGameRule() {
        this.editGameRuleForm.title = '新增游戏规则';
        this.editGameRuleForm.id = '';
        this.editGameRuleForm.game = '';
        this.editGameRuleForm.rule_id = '';
        this.editGameRuleFormVisible = true;
      },
      // 弹出编辑游戏规则表单
      handleEditGameRule(index, row) {
        this.editGameRuleForm.title = '编辑游戏规则';
        this.editGameRuleForm.id = row.id;
        this.editGameRuleForm.game = this.games.find(data => data.gname === row.game).gid;
        this.editGameRuleForm.rule_id = this.rules.find(data => data.description === row.rule_id).id;
        this.editGameRuleFormVisible = true;
      },
      // 删除游戏规则
      handleDeleteGameRule(index, row) {

      },
      // 提交编辑游戏规则表单
      submitEditGameRuleForm() {
        this.$confirm('确认保存？').then(() => {
          updateGameRule(this.editGameRuleForm, this.editGameRuleForm.id).then(res => {
            let data = res.data;
            if (data.code === 1) {
              this.messageType = 'success';
              let gameOperationData = data.game_operation;
              this.alarmGames.find(item => item.id === gameOperationData.id).rule_id = this.rules.find(item => item.id === gameOperationData.rules).description;
              this.editGameRuleFormVisible = false;
            } else if (data.code ===0) {
              this.messageType = 'error';
            }
            this.alertMessage(data.message);
          });
        })
          .catch((e) => {

          });
        this.editGameReceiverFormVisible = false;
      },
      // 取消编辑游戏规则表单
      cancelEditGameRuleForm() {
        this.editGameRuleFormVisible = false;
      },
      // 选择游戏修改游戏收件人表单信息
      handleSelectGameReceiverGame(value) {
        let selectedGame = this.alarmGames.find(data => data.game === value);
        this.editGameReceiverForm.id = selectedGame.id;
        // this.editGameReceiverForm.game = selectedGame.game;
        this.editGameReceiverForm.rule_id = selectedGame.rule_id;
        this.gameReceivers = selectedGame.receivers;
      },
      // 编辑游戏收件人表单
      handleEditGameReceiver() {
        if (this.editGameReceiverForm.id !== '') {
          this.editGameReceiverForm.user_id_list = [];
          // 填充默认收件人
          this.editGameReceiverForm.user_id_list = this.gameReceivers.map(data => data.userid);
          this.editGameReceiverFormVisible = true;
        } else {
          this.$message({
            showClose: true,
            message: '请先选择游戏',
            type: 'error'
          });
          return false;
        }
      },
      // 提交修改游戏收件人
      submitEditGameReceiverForm() {
        this.$confirm('确认保存？').then(() => {
          updateGameReceiver(this.editGameReceiverForm, this.editGameReceiverForm.id).then(res => {
            let data = res.data;
            if (data.code === 1) {
              this.messageType = 'success';
              let gameOperationData = data.game_operation;
              let receiversId = gameOperationData.receivers.split(',').map(Number);
              this.gameReceivers = this.users.filter(data => receiversId.indexOf(data.userid) !== -1);
            } else if (data.code ===0) {
              this.messageType = 'error';
            }
            this.alertMessage(data.message);
          });
        })
          .catch((e) => {

          });
        this.editGameReceiverFormVisible = false;
      },
      // 取消修改游戏收件人
      cancelEditGameReceiverForm() {
        this.editGameReceiverFormVisible = false;
      },
      // 获取报警细节信息
      getAlarmDetail() {
        getDetail(this.id).then(res => {
          let data = res.data;
          if (data.code ===1 ) {
            this.messageType = 'success';
            this.gameRuleForm.game = '';
            this.gameRuleForm.rule_id = '';
            this.editGameReceiverForm.id = '';
            this.editGameReceiverForm.game = '';
            this.gameReceivers = [];
            this.hasGameSettings = data.alarm_rule_dict.receivers_by_games;
            this.alarmRuleForm.rule_id = data.alarm_rule_dict.rule_id;
            this.alarmReceivers = data.alarm_rule_dict.receivers;
            // this.alarmGames = data.alarm_rule_dict.GameOperation_set;
            this.alarmGames = data.alarm_rule_dict.GameOperation_set.map(item => Object.assign(item, {
              'rule_id': this.rules.find(data => data.id === item.rule_id).description,
            }));
          }
          this.alertMessage(data.message);
        })
      },
      // 消息弹出
      alertMessage(message) {
        this.$notify({
          // title: '成功',
          message: message,
          type: this.messageType
        });
      },
      // token验证失败
      handleTokenExpired(message) {
        this.$message({
          showClose: true,
          message: message,
          type: 'error'
        });
        this.$router.push({path: '/login'})
      },
    },
    // 组件初始化
    created() {
      // 获取选项列表
      getInitialOptions().then(res => {
        let data = res.data;
        if (data.code === 1) {
          this.users = data.users;
          this.games = data.games;
          this.rules = data.rules;
          this.messageType = 'success';
        }
        this.alertMessage(data.message);
        // 获取默认激活的报警信息
        this.getAlarmDetail();
      });
    },
    computed: {
      // alarmReceiverFilterData() {
      //   if (this.alarmReceiverFilter) {
      //     return this.alarmReceivers.filter(data => {
      //       return Object.keys(data).some(key => {
      //         return String(data[key]).toLowerCase().indexOf(this.alarmReceiverFilter) > -1
      //       })
      //     })
      //   }
      //   return this.alarmReceivers
      // },
      // gameRuleFilterData() {
      //   if (this.gameRuleFilter) {
      //     return this.alarmGames.filter(data => {
      //       return Object.keys(data).some(key => {
      //         return String(data[key]).toLowerCase().indexOf(this.gameRuleFilter) > -1
      //       })
      //     })
      //   }
      //   return this.alarmGames
      // },
      gameReceiverFilterData() {
        if (this.gameReceiverFilter) {
          return this.gameReceivers.filter(data => {
            return Object.keys(data).some(key => {
              return String(data[key]).toLowerCase().indexOf(this.gameReceiverFilter) > -1
            })
          })
        }
        return this.gameReceivers
      }
    },
    // 父组件报警id
    props: ['id'],
    // 路由监控
    watch: {
      '$route': 'getAlarmDetail',
    },
  }
</script>

<style scoped>

</style>
