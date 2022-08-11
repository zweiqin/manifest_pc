<template>
  <div class="power">
    <el-card class="box-card">
      <!-- s卡片 -->
      <div class="all_card">
        <!-- s添加新角色 -->
        <div class="add_card" @click="addClick()">
          <i class="el-icon-plus"></i>
          <span>添加新角色</span>
        </div>
        <!-- e添加新角色 -->

        <!-- s内容 -->  <!-- is_show_bottom判断是否显示编辑&删除，默认是0，即不显示 -->
        <div
          v-for="(item, index) in card_list"
          :key="index"
          class="content_card"
          @mouseleave="mouseLeave(item)"
          @mouseover="mouseOver(item)"
        >
          <!-- s左 -->
          <div :class="[item.card_name === '总部' ? 'l_total_bgc' : 'l_branch_bgc']" class="left">
            <el-image v-if="item.card_name === '总部'" :src="headquarters" fit="fill" style="width: 30%"></el-image>
            <el-image v-else :src="branchStore" fit="fill" style="width: 30%"></el-image>
            <div class="text">{{ item.card_name }}</div>
          </div>
          <!-- e左 -->
          <!-- s右 -->
          <div :class="[item.card_name === '总部' ? 'r_total_bgc' : 'r_branch_bgc']" class="right">
            <!-- 上 -->
            <div class="top">
              <span
                :class="[item.card_name === '总部' ? 'c_total_bgc' : 'c_branch_bgc']"
                class="circle"
              >{{ item.role_name.slice(0, 1) }}</span>
              <span class="text">{{ item.role_name }}</span>
            </div>
            <!-- 下 -->
            <div class="bottom">
              员工数 {{ item.num }}
            </div>
          </div>
          <!-- e右 -->

          <!-- s底部编辑&删除 -->
          <div v-show="item.is_show_bottom" class="bottom_pop">
            <div class="text">
              <el-button type="text" class="edit edit_mr" @click="edit(item)">编辑</el-button>
              <el-button type="text" class="edit" @click="del(item.role_id)">删除</el-button>
            </div>
          </div>
          <!-- e底部编辑&删除 -->
        </div>
        <!-- e内容 -->
      </div>
      <!-- e卡片 -->
    </el-card>

    <!-- s新增 -->
    <el-dialog title="新增角色" :visible.sync="add_visible" class="add" width="60%" :close-on-click-modal="false">

      <el-form ref="addForm" :model="addForm" :rules="addRules">

        <el-form-item label="角色名称：" :label-width="formLabelWidth" prop="role_name">
          <el-input v-model="addForm.role_name" autocomplete="off" placeholder="请输入角色名称" style="width: 198px" />
        </el-form-item>

        <el-tabs v-model="add_active_name">
          <el-tab-pane label="电脑端权限" name="first">
            <el-tree
              :data="add_pc_data"
              :props="add_pc_props"
              show-checkbox
              node-key="menu_id"
              :default-checked-keys="pc_check"
              @check="myPcCheck"
            >
            </el-tree>
          </el-tab-pane>

          <el-tab-pane label="手机端权限" name="second">
            <el-tree
              :data="add_phone_data"
              :props="add_phone_props"
              show-checkbox
              node-key="menu_id"
              :default-checked-keys="mobile_check"
              @check="myMobileCheck"
            >
            </el-tree>

          </el-tab-pane>
        </el-tabs>

      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addSubmit('addForm')">保存修改</el-button>
      </div>
    </el-dialog>
    <!-- e新增 -->

    <!-- s编辑 -->
    <el-dialog title="编辑角色" :visible.sync="edit_visible" class="edit" width="60%" :close-on-click-modal="false">

      <el-form ref="editForm" :model="editForm" :rules="editRules">

        <el-form-item label="角色名称：" :label-width="formLabelWidth" prop="role_name">
          <el-input v-model="editForm.role_name" autocomplete="off" placeholder="请输入角色名称" style="width: 198px" />
        </el-form-item>

        <el-form-item label="适用范围：" :label-width="formLabelWidth">
          <el-radio-group v-model="range" disabled>
            <el-radio :label="0">总后台</el-radio>
            <el-radio :label="1">服务商</el-radio>
            <el-radio :label="2">商户端</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-tabs v-model="edit_active_name">

          <el-tab-pane label="电脑端权限" name="first">
            <el-tree
              :data="add_pc_data"
              :props="add_pc_props"
              show-checkbox
              node-key="menu_id"
              :default-checked-keys="pc_check"
              @check="myPcCheck"
            >
            </el-tree>
          </el-tab-pane>

          <el-tab-pane label="手机端权限" name="second">
            <el-tree
              :data="add_phone_data"
              :props="add_phone_props"
              show-checkbox
              node-key="menu_id"
              :default-checked-keys="mobile_check"
              @check="myMobileCheck"
            >
            </el-tree>
          </el-tab-pane>
        </el-tabs>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="editSubmit('editForm')">保存修改</el-button>
      </div>
    </el-dialog>
    <!-- e编辑 -->
  </div>
</template>
<script>
import { GetRoleListNoRoot, OperateRole } from '@/api/system_role'
import { GetMenuByType } from '@/api/system_menu'
import localstorage from '@/utils/localStorage'

export default {
  data() {
    return {
      // 修改时返回的pc端默认选中的节点
      pc_check: [],
      // 修改时返回的mobile端默认选中的节点
      mobile_check: [],
      // 选择好的pc端节点
      pc_menus: [],
      // 先择好的移动端节点
      mobile_menus: [],
      range: '2',
      // 总后台PC,移动端所有菜单
      admin_menu_list: {
        PcMenu: [],
        AppMenu: []
      },
      // 店铺后台PC,移动端所有菜单
      mer_menu_list: [],
      provider_menu_list: [],
      formLabelWidth: '120px',
      headquarters: require('@/assets/images/headquarters.png'),
      branchStore: require('@/assets/images/branchStore.png'),
      card_list: [],
      // 新增
      add_visible: false,
      addForm: {
        role_name: '',
        rules: '',
        rules_mobile: '',
        role_type: 2,
        mer_id: localstorage.get('admin_info').mer_id,
        provider_id: 0
      },
      addRules: {
        role_name: [{ required: true, message: '角色名称不能为空', change: 'blue' }]
      },
      // 新增-电脑端
      add_pc_props: {
        children: 'children',
        label: 'menu_name'
      },
      add_pc_data: [],
      // 新增-手机端
      add_phone_props: {
        children: 'children',
        label: 'menu_name'
      },
      add_phone_data: [],
      add_phone_mode: '',
      add_active_name: 'first',
      // 编辑
      edit_visible: false,
      editForm: {
        role_id: '',
        role_name: '',
        rules: '',
        rules_mobile: '',
        role_type: 2,
        mer_id: localstorage.get('admin_info').mer_id
      },
      editRules: {
        role_name: [{ required: true, message: '角色名称不能为空', change: 'blue' }]
      },
      // 编辑-电脑端
      edit_pc_props: {
        children: 'children',
        label: 'label'
      },
      edit_pc_data: [],
      // 编辑-手机端
      edit_phone_props: {
        children: 'children',
        label: 'label'
      },
      edit_phone_data: [],
      edit_phone_mode: '',
      edit_active_name: 'first'
    }
  },
  created() {
    this.getRoleList()
    this.getMenuList()
  },
  mounted() {},

  methods: {
    // 打开新增窗口
    addClick() {
      this.add_pc_data = this.admin_menu_list.PcMenu
      this.add_phone_data = this.admin_menu_list.AppMenu
      this.pc_check = []
      this.mobile_check = []
      this.range = 2
      this.$nextTick(function () {
        this.$refs['addForm'].resetFields()
      })
      this.add_visible = true
    },
    // 新增--树形控件--电脑端
    myPcCheck(nodeObj, selectedObj) {
      this.pc_menus = selectedObj.checkedKeys.concat(selectedObj.halfCheckedKeys)
      console.warn(this.pc_menus, '修改增加的pc端节点')
    },
    // 新增--树形控件--手机端
    myMobileCheck(nodeObj, selectedObj) {
      this.mobile_menus = selectedObj.checkedKeys.concat(selectedObj.halfCheckedKeys)
    },
    // 获取后台的菜单
    async getMenuList() {
      await GetMenuByType({ menu_type: 2 })
        .then(res => {
          this.admin_menu_list = res.data
          this.add_pc_data = this.admin_menu_list.PcMenu
          this.add_phone_data = this.admin_menu_list.AppMenu
        })
        .catch(err => {
          this.$message.error(err.data.data)
        })
    },
    // 获取所有权限
    getRoleList() {
      GetRoleListNoRoot({
        role_type: 2,
        mer_id: localstorage.get('admin_info').mer_id,
        provider_id: 0,
        is_developers: 0
      })
        .then(res => {
          res.data.map(item => {
            item.card_name = item.role_type === 0 ? '总部' : item.role_type === 1 ? '服务商' : '商户端'
            return item.card_name
          })
          this.card_list = res.data
        })
        .catch(err => {
          this.$message.error(err.data.data)
        })
    },
    // 鼠标移入时出现编辑&删除
    mouseOver(e) {
      e.is_show_bottom = 1
    },
    // 鼠标移出时隐藏编辑&删除
    mouseLeave(e) {
      e.is_show_bottom = 0
    },
    // 新增--确认
    addSubmit(formName) {
      this.$refs[formName].validate(async valid => {
        // 若必填项不为空
        if (valid) {
          let rules
          let rules_mobile = ''
          if (this.pc_menus.length > 0) {
            rules = this.$deepClone(this.pc_menus).join(',')
          } else {
            rules = ''
          }
          if (this.mobile_menus.length > 0) {
            rules_mobile = this.$deepClone(this.mobile_menus).join(',')
          }
          this.addForm.role_type = this.range
          this.addForm.rules = rules
          this.addForm.rules_mobile = rules_mobile

          OperateRole(this.addForm)
            .then(() => {
              this.add_visible = false
              this.$message.success('新增成功')
              this.getRoleList()
            })
            .catch(err => {
              this.$message.error(err.data.data)
            })
        } else {
          return false
        }
      })
    },
    // e新增

    // s编辑
    // 打开弹框
    edit(e) {
      this.add_pc_data = []
      this.add_phone_data = []

      this.add_pc_data = this.$deepClone(this.admin_menu_list.PcMenu)
      this.add_phone_data = this.$deepClone(this.admin_menu_list.AppMenu)

      this.range = e.role_type
      this.editForm.role_type = e.role_type
      this.editForm.rules = e.rules
      this.editForm.role_id = e.role_id
      this.editForm.role_name = e.role_name
      this.pc_check = e.rules.split(',') // 显示已勾选的菜单（定死了就无法改变，仅是初始化使用）
      this.pc_menus = this.$deepClone(this.pc_check) // 用于确定编辑时传给后端的菜单
      this.mobile_check = e.rules_mobile.split(',') // 显示已勾选的菜单（定死了就无法改变，仅是初始化使用）
      this.mobile_menus = this.$deepClone(this.mobile_check) // 用于确定编辑时传给后端的菜单
      this.edit_visible = true
    },
    // 编辑--确认
    editSubmit(formName) {
      this.$refs[formName].validate(async valid => {
        // 若必填项不为空
        if (valid) {
          console.warn(this.pc_menus, '提交显示的pc端节点')
          let rules
          let rules_mobile = ''
          if (this.pc_menus.length > 0) {
            rules = this.$deepClone(this.pc_menus).join(',')
          }
          if (this.mobile_menus.length > 0) {
            rules_mobile = this.$deepClone(this.mobile_menus).join(',')
          }
          this.editForm.role_type = this.range
          this.editForm.rules = rules
          this.editForm.rules_mobile = rules_mobile
          OperateRole(this.editForm)
            .then(() => {
              this.edit_visible = false
              this.$message.success('修改成功')
              this.getRoleList()
            })
            .catch(err => {
              this.$message.error(err.data.data)
            })
        } else {
          return false
        }
      })
    },
    // e编辑

    // 删除
    del(role_id) {
      this.$confirm('删除后角色将不可用', '确定删除此角色吗？', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        OperateRole({ role_id: role_id, status: 0 })
          .then(() => {
            this.$message.success('删除成功')
            this.getRoleList()
          })
          .catch(err => {
            this.$message.error(err.data.data)
          })
      }).catch(() => {

      })
    }
  }
}
</script>

<style lang="scss" scoped>
.power{
  .all_card{
    display: flex;
    flex-wrap: wrap; // flex允许换行
    .add_card{
      margin-left: 10px;
      width: 278px;
      height: 107px;
      border-radius: 10px;
      border: 1px solid #F9F9F9;
      background-color: #f3f3f3;
      color: #999999;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
    }
    .content_card{
      position: relative;
      margin-bottom: 10px;
      margin-left: 10px;
      width: 278px;
      height: 107px;
      border-radius: 10px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 14px;
      font-weight: 700;
      color: #ffffff;
      .l_total_bgc{
        background-color: #222133;
      }
      .l_branch_bgc{
        background-color: #051350;
      }
      .left{
        height: 100%;
        flex: 1.5;
        border-radius: 10px 0 0 10px;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column; // 垂直排列
        .text{
          margin-top: 10px;
        }
      }
      .r_total_bgc{
        background-color: #2C2B43;
      }
      .r_branch_bgc{
        background-color: #212F6E;
      }
      .right {
        height: 100%;
        flex: 3;
        border-radius: 0 10px 10px 0;
        padding: 27px 20px;

        .top {
          display: flex;
          align-items: center;
          font-size: 16px;

          .c_total_bgc {
            background-color: #E7AA69;
          }

          .c_branch_bgc {
            background-color: #236CF0;
          }
          .circle{
            font-size: 12px;
            border-radius: 50%;
            padding: 8px;
            margin-right: 10px;
          }
          .text{
            // 超过一行用省略号
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 1;
            line-clamp: 1;
            -webkit-box-orient: vertical;
          }
        }
        .bottom{
          font-size: 12px;
          margin-top: 10px;
        }
      }
      .bottom_pop{
        position: absolute;
        bottom: 0;
        background: rgba(0,0,0,.85);
        z-index: 2;
        height: 44px;
        line-height: 44px;
        width: 100%;
        padding-right: 20px;
        border-radius: 0 0 10px 10px;
        .text{
          float: right;
          .edit_mr{
            margin-right: 5px;
          }
          .edit{
            color: #ffffff;
          }:hover{
            text-decoration:underline
          }
        }
      }
    }
  }
  .phone_power{
    display: flex;
    flex-direction: column;
  }
}
</style>

