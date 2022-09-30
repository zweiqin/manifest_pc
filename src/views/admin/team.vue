<template>
  <div class="team">
    <el-card class="el-card">
      <!-- 团队表格 -->
      <el-table :data="table_data.data" highlight-current-row size="small" style="width: 100%">
        <el-table-column label="团队名称" min-width="180" prop="name"></el-table-column>
        <el-table-column label="团队负责人" min-width="180" prop="leader"></el-table-column>
        <!--  TODO: 修改成以表格形式展示      -->
        <el-table-column :show-overflow-tooltip="true" label="团队成员" min-width="300" prop="member">
          <template v-slot="scope">
            <el-tag v-for="item in scope.row.member_list" :key="item.id">
              {{ item.name }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" min-width="180" prop="create_time"></el-table-column>
        <el-table-column label="更新时间" min-width="180" prop="update_time"></el-table-column>
        <el-table-column label="操作" min-width="180">
          <template v-slot="scope">
            <el-button size="small" type="text" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 团队编辑 -->
    <el-dialog :visible.sync="edit_visible" title="团队编辑" width="50%">
      <el-form ref="edit_form" :model="edit_form" :rules="edit_rules" label-width="120px">
        <el-form-item label="团队名称" prop="name">
          <el-input v-model="edit_form.name" disabled style="width: 200px"></el-input>
        </el-form-item>
        <el-form-item label="团队负责人" prop="leader">
          <el-select v-model="edit_form.leader" filterable @change="removeLeaderFromMember(edit_form.leader)">
            <el-option v-for="item in admin_list" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <span style="color:#999999">{{ '提示：选择团队负责人之后，该人员将从团队成员列表中去除' }}</span>
        </el-form-item>
        <el-form-item label="团队成员" prop="member">
          <el-select v-model="edit_form.member" filterable multiple style="width:100%">
            <el-option v-for="item in member_options" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="edit_visible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('edit_form')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'team',
  data() {
    return {
      table_data: {
        data: [
          {
            name: '羊村',
            leader: '2',
            member: '2,3,4,5,6',
            member_list: [
              {
                id: 1,
                name: '喜羊羊'
              },
              {
                id: 2,
                name: '美羊羊'
              },
              {
                id: 3,
                name: '懒羊羊'
              },
              {
                id: 4,
                name: '沸羊羊'
              },
              {
                id: 5,
                name: '灰太狼'
              },
              {
                id: 6,
                name: '红太狼'
              }
            ],
            create_time: '2020-01-01 00:00:00',
            update_time: '2020-01-01 00:00:00'
          }
        ],
        total: 0
      },
      edit_visible: false,
      edit_form: {
        id: '',
        name: '',
        leader: '',
        member: []
      },
      edit_rules: {
        name: [
          { required: true, message: '请输入团队名称', trigger: 'blur' }
        ],
        leader: [{ required: true, message: '请选择团队负责人', trigger: 'change' }],
        member: [{ required: true, message: '请选择团队成员', trigger: 'change' }]
      },
      admin_list: [
        {
          id: 1,
          name: '喜羊羊'
        },
        {
          id: 2,
          name: '美羊羊'
        },
        {
          id: 3,
          name: '懒羊羊'
        },
        {
          id: 4,
          name: '沸羊羊'
        },
        {
          id: 5,
          name: '灰太狼'
        },
        {
          id: 6,
          name: '红太狼'
        }
      ],
      member_options: [] // 可供选择的成员列表选项
    }
  },
  created() {

  },
  methods: {
    // 编辑团队成员
    handleEdit(index, row) {
      // console.log(index, row)
      this.edit_visible = true
      this.edit_form.id = row.id
      this.edit_form.name = row.name
      this.edit_form.leader = Number(row.leader)
      this.edit_form.member = row.member.split(',').map((item) => {
        return Number(item)
      })

      // 初始化可供选择的成员列表选项
      this.removeLeaderFromMember(this.edit_form.leader)
    },
    // 重新选择团队负责人时,去除团队成员列表可选的选项
    removeLeaderFromMember(id) {
      this.member_options = this.admin_list.filter((item) => {
        return item.id !== id
      })
      this.edit_form.member.forEach((item, index) => {
        if (item === id) {
          console.log('===')
          this.edit_form.member.splice(index, 1)
        }
      })
    },
    // 提交表单
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.edit_visible = false
          this.$message({
            message: '提交成功',
            type: 'success'
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.team {
  .el-card {
    margin: 20px;
  }
}
</style>
