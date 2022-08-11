<template>
  <div class="info">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <!-- s搜索区 -->
        <div class="container">
          <el-form inline size="small" :label-position="labelPosition">

            <el-form-item label="员工账号：" style="display:inline-block">
              <el-input v-model="infoForm.phone_like" clearable placeholder="请输入员工账号" />
            </el-form-item>

            <el-form-item label="员工姓名：" style="display:inline-block">
              <el-input v-model="infoForm.real_name_like" clearable placeholder="请输入员工姓名" />
            </el-form-item>

            <el-button class="ResetSearch mr10" size="small" type="reset" @click="reset('infoForm')">重置</el-button>
            <el-button label="default" size="small" type="primary" @click="infoSearch">查询</el-button>
          </el-form>
        </div>
        <!-- e搜索区 -->

        <el-button label="default" size="small" type="primary" @click="addClick()">新增员工</el-button>
        <!-- 👇可以改成在搜索去添加一个是否是已删除员工的搜索条件 -->
        <el-button v-if="is_del === 0" label="default" size="small" type="danger" @click="hadDelStaff">已删除员工
        </el-button>
        <el-button v-else label="default" size="small" type="success" @click="hadNodelStaff">在线员工</el-button>
      </div>

      <!-- s表格 -->
      <el-table :data="tableData.data" style="width: 100%" size="small" highlight-current-row>

        <el-table-column prop="real_name" label="员工" min-width="100" />

        <el-table-column prop="account" label="员工账号" min-width="100" />

        <el-table-column label="角色" min-width="100" prop="group_name">
          <template v-slot="scope">
            {{ getRoleName(scope.row) }}
          </template>
        </el-table-column>

        <!-- <el-table-column prop="state_name" label="员工状态" min-width="100" /> -->

        <el-table-column label="操作" min-width="120" fixed="right" align="center">
          <template v-slot="scope">
            <el-button v-if="!is_del" class="mr10" size="small" type="text" @click="changePwd(scope.row)">修改密码
            </el-button>
            <el-button
              v-if="!is_del && isMax(scope.row)"
              class="mr10"
              size="small"
              type="text"
              @click="edit(scope.row.admin_id)"
            >编辑
            </el-button>
            <el-button
              v-if="!is_del && isMax(scope.row)"
              class="mr10"
              size="small"
              type="text"
              @click="del(scope.row)"
            >删除
            </el-button>
            <!-- <el-button v-if="!is_del" type="text" size="small" class="mr10" @click="edit_state(scope.row)">编辑员工状态</el-button> -->
            <el-button v-if="is_del" type="text" size="small" class="mr10" @click="recover(scope.row)">恢复</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="block">
        <el-pagination
          :page-sizes="[10, 20, 40, 60, 80]"
          :page-size="infoForm.limit"
          :current-page="infoForm.page"
          layout="total, sizes, prev, pager, next, jumper"
          :total="tableData.total"
          @size-change="handle_size_change"
          @current-change="page_change"
        />
      </div>
      <!-- e表格 -->

    </el-card>

    <!-- s新增员工 -->
    <el-dialog title="新增员工" :visible.sync="add_visible" :close-on-click-modal="false" class="add_staff" width="70%">

      <el-form ref="addForm" :model="addForm" :rules="addRules">

        <el-form-item label="员工帐号：" :label-width="formLabelWidth" prop="account">
          <el-input
            v-model="addForm.account"
            autocomplete="off"
            placeholder="请输入员工帐号"
            @change="checkAccount(addForm.account)"
          />
        </el-form-item>

        <el-form-item label="员工姓名：" :label-width="formLabelWidth" prop="real_name">
          <el-input v-model="addForm.real_name" autocomplete="off" placeholder="请输入员工姓名" />
        </el-form-item>

        <!-- s总门店角色 -->

        <el-table
          :data="allAddWorkInfo"
          :header-cell-style="{background:'#F5F7FA',color:'#2F3033',fontWeight:'normal'}"
          highlight-current-row
          size="small"
          style="width: 100%"
        >
          <el-table-column label="请选择角色" min-width="100">
            <template v-slot="scope">
              <el-select
                v-model="scope.row.role_id"
                placeholder="请选择角色"
                @change="mySelect(scope.row,scope.$index,'allAddWorkInfo')"
              >
                <el-option
                  v-for="item in admin_role_list"
                  :key="item.role_id"
                  :label="item.role_name"
                  :value="item.role_id"
                />
              </el-select>
            </template>
          </el-table-column>

          <el-table-column label="操作" min-width="120" fixed="right" align="center">
            <template v-slot="scope">
              <el-button class="mr10" size="small" type="text" @click="allDelRole(scope.$index,'allAddWorkInfo')">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button class="addBtn" size="small" @click="allAddRole">添加</el-button>
        <!-- s总门店角色 -->

        <div style="margin-top: 10px;"></div>

      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addSubmit('addForm')">保存修改</el-button>
      </div>
    </el-dialog>
    <!-- e新增员工 -->

    <!-- s编辑员工信息 -->
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="edit_visible"
      class="add_staff"
      title="编辑员工"
      width="70%"
    >

      <el-form ref="editForm" :model="editForm" :rules="editRules">

        <el-form-item label="员工帐号：" :label-width="formLabelWidth" prop="account">
          <el-input v-model="editForm.account" autocomplete="off" disabled placeholder="请输入员工帐号" />
        </el-form-item>

        <el-form-item label="员工姓名：" :label-width="formLabelWidth" prop="real_name">
          <el-input v-model="editForm.real_name" autocomplete="off" placeholder="请输入员工姓名" />
        </el-form-item>

        <!-- s总门店角色 -->
        <el-table
          :data="allEditWorkInfo"
          :header-cell-style="{background:'#F5F7FA',color:'#2F3033',fontWeight:'normal'}"
          highlight-current-row
          size="small"
          style="width: 100%"
        >

          <el-table-column prop="role" label="总后台角色" min-width="100">
            <template v-slot="scope">
              <el-select
                v-model="scope.row.role_id"
                placeholder="请选择角色"
                @change="mySelect(scope.row,scope.$index,'allEditWorkInfo')"
              >
                <el-option
                  v-for="item in admin_role_list"
                  :key="item.role_id"
                  :label="item.role_name"
                  :value="item.role_id"
                />
              </el-select>
            </template>
          </el-table-column>

          <el-table-column align="center" fixed="right" label="操作" min-width="120">
            <template v-slot="scope">
              <el-button class="mr10" size="small" type="text" @click="allDelRole(scope.$index,'allEditWorkInfo')">
                删除
              </el-button>
            </template>
          </el-table-column>

        </el-table>
        <el-button class="editBtn" size="small" @click="allEditRole">添加</el-button>
        <!-- s总门店角色 -->
        <!-- s角色 -->
        <div style="margin-top: 10px;"></div>

      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="editSubmit('editForm')">保存修改</el-button>
      </div>
    </el-dialog>
    <!-- e编辑员工信息 -->

    <!-- s修改密码 -->
    <el-dialog :visible.sync="change_pwd_visible" class="changePwd" title="修改密码" width="50%">

      <el-form ref="changePwdForm" :model="changePwdForm" :rules="changePwdRules">

        <el-form-item label="登录名：" :label-width="formLabelWidth" prop="real_name">
          <el-input v-model="changePwdForm.real_name" autocomplete="off" disabled placeholder="请输入登录名" />
        </el-form-item>

        <el-form-item label="密码：" :label-width="formLabelWidth" prop="pwd">
          <el-input
            v-model="changePwdForm.pwd"
            autocomplete="off"
            placeholder="6-16位密码，必须包含数字字母"
            show-password
          />
        </el-form-item>

        <el-form-item label="确认密码：" :label-width="formLabelWidth" prop="cPwd">
          <el-input
            v-model="changePwdForm.cPwd"
            autocomplete="off"
            placeholder="6-16位密码，必须包含数字字母"
            show-password
          />
        </el-form-item>

      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="changePwdSubmit('changePwdForm')">确认</el-button>
      </div>
    </el-dialog>
    <!-- e修改密码 -->

  </div>
</template>

<script>
import { AdminSearch, GetUserInfo, OperateAdmin } from '@/api/admin'
import { GetRoleList } from '@/api/system_role'
import localstorage from '@/utils/localStorage'

export default {
  name: 'info',
  data() {
    return {
      new_role: { role_id: '' },
      formLabelWidth: '120px',
      tableData: {
        data: [],
        total: 0
      },
      labelPosition: 'right',
      is_del: 0, // 是否已删除员工列表，1是0否
      infoForm: {
        page: 1,
        limit: 10,
        is_del: 0,
        admin_type: 2,
        mer_id: localstorage.get('admin_info').mer_id,
        provider_id: 0,
        real_name_like: '',
        phone_like: ''
      },
      groupForm: {
        limit: 1,
        page: 1,
        status: 1,
        is_del: 0,
        is_all: 1,
        is_user: 0
      },
      state_list: [],
      select_state_list: [],
      // 组列表
      // group_list: [],
      // 总后台角色列表
      admin_role_list: [],
      // 商家角色列表
      mer_role_list: [],
      // 商家列表
      mer_list: [],
      // 新增员工
      add_visible: false,
      addForm: {
        account: '',
        real_name: '',
        department: '',
        admin_type: 2,
        mer_id: localstorage.get('admin_info').mer_id,
        provider_id: 0
      },
      // 总门店角色
      allAddWorkInfo: [],
      // 角色
      addWorkInfo: [],
      addRules: {
        account: [{ required: true, message: '员工帐号不能为空', change: 'blue' }],
        real_name: [{ required: true, message: '员工姓名不能为空', change: 'blue' }]
      },
      // 编辑
      // 新增员工
      edit_visible: false,
      editForm: {
        admin_id: '',
        account: '',
        real_name: '',
        department: '',
        admin_type: 2,
        mer_id: localstorage.get('admin_info').mer_id,
        provider_id: 0
      },
      // 总门店角色
      allEditWorkInfo: [],
      // 角色
      editWorkInfo: [],
      editRules: {
        account: [{ required: true, message: '员工帐号不能为空', change: 'blue' }],
        real_name: [{ required: true, message: '员工姓名不能为空', change: 'blue' }],
        nickname: [{ required: true, message: '支付宝姓名不能为空', change: 'blue' }],
        alipay_account: [{ required: true, message: '支付宝帐号不能为空', change: 'blue' }],
        group: [{ type: 'number', required: true, message: '员工分组不能为空', change: 'blue' }],
        scheduling_mer_id: [{ type: 'number', required: true, message: '所属门店不能为空', change: 'blue' }],
        is_operator: [{ type: 'number', required: true, change: 'blue' }]
      },
      // 修改密码
      change_pwd_visible: false,
      changePwdForm: {
        admin_id: '',
        real_name: '',
        pwd: '',
        cPwd: ''
      },
      changePwdRules: {
        pwd: [{ required: true, message: '密码不能为空', change: 'blue' }],
        cPwd: [{ required: true, message: '确认密码不能为空', change: 'blue' }]
      },

      // 编辑员工状态
      state_visible: false,
      stateForm: {
        admin_id: '',
        state_id: '',
        admin_roles_list: []
      },
      stateRules: {
        state_id: [{ required: true, message: '员工状态不能为空', change: 'blue' }]
      }
    }
  },
  mounted() {
    this.getList('')
    this.getAdminRole()
  },
  methods: {
    isMax(row) {
      if (row.admin_roles_list) {
        const roles = row.admin_roles_list
        let flag = true
        roles.forEach(item => {
          if (item.role_id === 2 || item.role_id === 3 || item.role_id === 4) {
            flag = false
          }
        })
        return flag
      }
    },
    getRoleName(row) {
      if (row.admin_roles_list) {
        const name = row.admin_roles_list.map(item => {
          return item.role_name
        })
        return name.join(',')
      }
    },
    // 打开新增页面
    addClick() {
      this.add_visible = true
      this.$nextTick(function () {
        this.$refs['addForm'].resetFields()
      })
      this.allAddWorkInfo = []
      this.addWorkInfo = []
    },
    // 根据admin_id取用户信息
    getAdminById(id) {
      this.allEditWorkInfo = []
      this.editWorkInfo = []
      GetUserInfo({ admin_id: id })
        .then(res => {
          const all = []
          const data = {}
          this.editForm.admin_id = id
          this.editForm.account = res.data.account
          this.editForm.real_name = res.data.real_name
          this.editForm.department = res.data.department
          this.editForm.admin_type = res.data.admin_type
          this.editForm.mer_id = res.data.mer_id
          this.editForm.provider_id = res.data.provider_id
          res.data.AdminRolesList.forEach(item => {
            data.role_id = item.role_id
            all.push(this.$deepClone(data))
          })
          this.allEditWorkInfo = all
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 检测帐号
    checkAccount(data) {
      const reg_phone = /^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/
      if (!reg_phone.test(data)) {
        this.$message.error('帐号必须为手机号码')
        this.addForm.account = ''
      }
    },
    mySelect(row, index, data) {
      const new_data = this.$deepClone(this[data])
      new_data.splice(index, 1)
      if (new_data.length > 0) {
        if (new_data.filter(item => item.role_id === row.role_id).length > 0) {
          this.$message.error('该角色已选，请不要重复选取。')
          this[data][index].role_id = ''
        }
      }
    },
    // 取总后台角色
    async getAdminRole() {
      await GetRoleList({
        role_type: 2,
        mer_id: localstorage.get('admin_info').mer_id,
        provider_id: 0,
        is_developers: 0
      })
        .then(res => {
          this.admin_role_list = res.data
        })
        .catch(err => {
          this.$message.error(err.data.data)
        })
    },

    // 查询
    infoSearch() {
      this.getList(1)
    },
    // 列表
    getList(num) {
      this.infoForm.page = num || this.infoForm.page
      const param = this.infoForm
      AdminSearch(param)
        .then(res => {
          this.tableData.data = res.data.items
          this.tableData.total = res.data.total
        }).catch(() => {
        })
    },
    // 分页
    page_change(page) {
      this.infoForm.page = page
      this.getList('')
    },
    handle_size_change(val) {
      this.infoForm.limit = val
      this.getList('')
    },
    // 重置
    reset() {
      this.infoForm = {
        page: 1,
        limit: 10,
        is_del: 0,
        admin_type: 2,
        mer_id: localstorage.get('admin_info').mer_id,
        provider_id: 0,
        real_name_like: '',
        phone_like: ''
      }
      this.is_del = 0
      this.getList('')
    },
    // 修改密码
    changePwd(e) {
      this.changePwdForm.admin_id = e.admin_id
      this.changePwdForm.real_name = e.real_name
      this.change_pwd_visible = true
    },
    // 编辑
    edit(e) {
      this.getAdminById(e)
      this.edit_visible = true
    },
    // 删除
    del(e) {
      this.$confirm('确定删除该用户?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        OperateAdmin({ admin_id: e.admin_id, is_del: 1 })
          .then(() => {
            this.$message.success('删除用户成功！')
            this.getList()
          })
      }).catch(() => {
      })
    },
    // 恢复
    recover(e) {
      this.$confirm('是否恢复该用户?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        OperateAdmin({ admin_id: e.admin_id, is_del: 0 })
          .then(() => {
            this.$message.success('恢复用户成功！')
            this.getList()
          })
      }).catch(() => {
      })
    },
    // 已删除员工
    hadDelStaff() {
      this.infoForm = {
        page: 1,
        limit: 10,
        is_del: 1,
        admin_type: 2,
        mer_id: localstorage.get('admin_info').mer_id,
        provider_id: 0,
        real_name_like: '',
        phone_like: ''
      }
      this.is_del = 1
      this.getList('')
    },
    // 在线员工
    hadNodelStaff() {
      this.infoForm = {
        page: 1,
        limit: 10,
        is_del: 0,
        admin_type: 2,
        mer_id: localstorage.get('admin_info').mer_id,
        provider_id: 0,
        real_name_like: '',
        phone_like: ''
      }
      this.is_del = 0
      this.getList('')
    },

    // s新增员工
    // 总角色-添加
    allAddRole() {
      this.allAddWorkInfo.push(this.$deepClone(this.new_role))
    },
    // 保存修改
    addSubmit(formName) {
      this.$refs[formName].validate(async valid => {
        // 若必填项不为空
        if (valid) {
          let flag = 0
          const add_data = {}
          const data = this.$deepClone(this.allAddWorkInfo)
          this.allAddWorkInfo.forEach(item => {
            if (item.role_id === '') {
              this.$message.error('请选择总后台角色！')
              flag = 1
              return false
            }
            this.addWorkInfo.forEach(item1 => {
              if (item1.role_id === '') {
                this.$message.error('请选择门店角色！')
                flag = 1
                return false
              }
              if (item1.mer_list.length === 0) {
                this.$message.error('店铺角色必须指定服务范围。')
                flag = 1
                return false
              }
            })
          })
          if (flag === 0) {
            data.push.apply(data, this.addWorkInfo)
            if (data.length === 0) {
              this.$message.error('请创建角色。')
            } else {
              add_data.account = this.addForm.account
              add_data.real_name = this.addForm.real_name
              add_data.department = this.addForm.department
              add_data.admin_type = this.addForm.admin_type
              add_data.mer_id = this.addForm.mer_id
              add_data.provider_id = this.addForm.provider_id
              const data2 = this.$deepClone(data)
              add_data.admin_roles_list = data2.map(item => {
                return item.role_id
              })

              OperateAdmin(add_data)
                .then(() => {
                  this.$message.success('新增成功！')
                  this.add_visible = false
                  this.getList()
                })
                .catch(err => {
                  this.$message.error(err.data.data)
                })
            }
          }
        } else {
          return false
        }
      })
    },
    // e新增员工

    // s编辑员工
    // 总角色-添加
    allEditRole() {
      this.allEditWorkInfo.push(this.$deepClone(this.new_role))
    },
    // 总角色-删除
    allDelRole(index, data) {
      this[data].splice(index, 1)
    },
    // 保存修改
    editSubmit(formName) {
      this.$refs[formName].validate(async valid => {
        // 若必填项不为空
        if (valid) {
          let flag = 0
          const add_data = {}
          const data = this.$deepClone(this.allEditWorkInfo)
          this.allEditWorkInfo.forEach(item => {
            if (item.role_id === '') {
              this.$message.error('请选择总后台角色！')
              flag = 1
              return false
            }
            this.editWorkInfo.forEach(item1 => {
              if (item1.role_id === '') {
                this.$message.error('请选择门店角色！')
                flag = 1
                return false
              }
              if (item1.mer_list.length === 0) {
                this.$message.error('店铺角色必须指定服务范围。')
                flag = 1
                return false
              }
            })
          })
          if (flag === 0) {
            data.push.apply(data, this.editWorkInfo)
            if (data.length === 0) {
              this.$message.error('请创建角色。')
            } else {
              add_data.admin_id = this.editForm.admin_id
              add_data.account = this.editForm.account
              add_data.real_name = this.editForm.real_name
              add_data.department = this.editForm.department
              add_data.admin_type = this.editForm.admin_type
              add_data.mer_id = this.editForm.mer_id
              add_data.provider_id = this.editForm.provider_id
              const data2 = this.$deepClone(data)
              add_data.admin_roles_list = data2.map(item => {
                return item.role_id
              })
              OperateAdmin(add_data)
                .then(() => {
                  this.$message.success('修改成功！')
                  this.edit_visible = false
                  this.getList()
                })
                .catch(err => {
                  this.$message.error(err.data.data)
                })
            }
          }
        } else {
          return false
        }
      })
    },
    // e编辑员工

    // 修改密码--确认
    changePwdSubmit(formName) {
      this.$refs[formName].validate(async valid => {
        // 若必填项不为空
        if (valid) {
          if (this.changePwdForm.pwd !== this.changePwdForm.cPwd) {
            this.$message.error('两次输入的密码不相同，请重新输入！')
            this.changePwdForm.pwd = ''
            this.changePwdForm.cPwd = ''
          } else {
            OperateAdmin({ admin_id: this.changePwdForm.admin_id, pwd: this.changePwdForm.cPwd })
              .then(() => {
                this.$message.success('更改密码成功！')
                this.change_pwd_visible = false
              })
              .catch(err => {
                this.$message.error(err.data.data)
              })
          }
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang='scss'>
.info {
  .box-card {
    margin: 20px 20px
  }

  .container {
    min-width: 821px;
  }

  .block {
    float: right;
  }

  .demo-table-expand {
    font-size: 0;
  }

  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }

  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }

  .add_staff {
    .el-form-item {
      margin-bottom: 20px;
    }

    ::v-deep .el-input__inner {
      text-align: left;
    }
  }

  .el-input__inner {
    text-align: left;
  }

  .end_input {
    display: block;
    position: absolute;
    top: 1px;
    left: 140px;
    width: 40px;
    height: 38px;
    line-height: 38px;
    border-radius: 0 8px 8px 0;
    font-size: 14px;
    color: #111111;
    text-align: center;
    background: rgba(0, 0, 0, 0.02);
  }

  .addBtn {
    margin-top: 10px;
  }
}

</style>
