<template>
	<div class="team">
		<el-card class="el-card">
			<!-- 团队表格 -->
			<el-table :data="table_data.data" highlight-current-row size="small" style="width: 100%">
				<el-table-column label="团队名称" min-width="180" prop="name"></el-table-column>
				<el-table-column label="团队负责人" min-width="180">
					<template v-slot="scope">
						<span>{{ scope.row.manager_info.real_name }}</span>
					</template>
				</el-table-column>
				<!--  TODO: 修改成以表格形式展示      -->
				<el-table-column :show-overflow-tooltip="true" label="团队成员" min-width="300" prop="admin_list">
					<template v-slot="scope">
						<el-tag v-for="item in scope.row.user_list" :key="item.id">
							{{ item.real_name }}
						</el-tag>
					</template>
				</el-table-column>
				<el-table-column label="创建时间" min-width="180" prop="create_time"></el-table-column>
				<el-table-column label="操作" min-width="160">
					<template v-slot="scope">
						<el-button size="small" type="text" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
						<el-button size="small" type="text" @click="displayTeamList(scope.row)">查看团队成员</el-button>
					</template>
				</el-table-column>
			</el-table>
		</el-card>

		<!-- s团队编辑 -->
		<el-dialog :visible.sync="edit_visible" title="团队编辑" width="50%">
			<el-form ref="edit_form" :model="edit_form" :rules="edit_rules" label-width="120px">
				<el-form-item label="团队名称" prop="name">
					<el-input v-model="edit_form.name" disabled style="width: 200px"></el-input>
				</el-form-item>
				<el-form-item label="团队负责人" prop="manager_id">
					<el-select v-model="edit_form.manager_id" filterable @change="removeLeaderFromMember(edit_form.manager_id)">
						<el-option
							v-for="item in manager_options" :key="item.admin_id" :label="item.real_name"
							:value="item.admin_id"
						></el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<span style="color:#999999">{{ '提示：选择团队负责人之后，该人员将从团队成员列表中去除' }}</span>
				</el-form-item>
				<el-form-item label="团队成员" prop="admin_list">
					<el-select v-model="edit_form.admin_list" filterable multiple style="width:100%">
						<el-option
							v-for="item in admin_options" :key="item.admin_id" :label="item.real_name"
							:value="item.admin_id"
						></el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="edit_visible = false">取 消</el-button>
				<el-button type="primary" @click="submitForm('edit_form')">确 定</el-button>
			</span>
		</el-dialog>
		<!--e  团队编辑  -->

		<!--s 查看团队成员    -->
		<el-dialog :visible.sync="team_list_visible" title="团队成员" width="50%">
			<el-table :data="team_list" highlight-current-row size="small" style="width: 100%">
				<el-table-column label="id" min-width="180" prop="admin_id"></el-table-column>
				<el-table-column label="团队成员" min-width="180" prop="real_name"></el-table-column>
				<el-table-column label="手机号" min-width="180" prop="phone"></el-table-column>
			</el-table>
		</el-dialog>
		<!--e 查看团队成员   -->
	</div>
</template>

<script>
import { AdminSearch, GetTeamList, OperateTeam } from '@/api/admin'

export default {
	name: 'team',
	data() {
		return {
			table_data: {
				data: [],
				total: 0
			},
			edit_visible: false,
			edit_form: {
				id: '',
				name: '',
				manager_id: '',
				admin_list: []
			},
			edit_rules: {
				name: [
					{ required: true, message: '请输入团队名称', trigger: 'blur' }
				],
				manager_id: [ { required: true, message: '请选择团队负责人', trigger: 'change' } ],
				admin_list: [ { required: true, message: '请选择团队成员', trigger: 'change' } ]
			},
			manager_options: [],
			admin_options: [], // 可供选择的成员列表选项

			// 团队成员列表显示
			team_list_visible: false,
			team_list: []

		}
	},
	created() {
		this.getTeamList()
		this.getAdminList()
	},
	methods: {
		// 显示团队成员
		displayTeamList(row) {
			this.team_list_visible = true
			this.team_list = row.user_list
		},
		// 获取所有成员列表
		getAdminList() {
			AdminSearch()
				.then((res) => {
					this.manager_options = res.data.items
					this.admin_options = res.data.items
				})
				.catch((err) => {
					this.$message.error(err.data.msg)
				})
		},
		// 获取团队列表
		getTeamList() {
			GetTeamList()
				.then((res) => {
					this.table_data.data = res.data.items
					this.table_data.total = res.data.total
				})
				.catch((err) => {
					this.$message.error(err.msg)
				})
		},
		// 编辑团队成员
		handleEdit(index, row) {
			// console.log(index, row)
			this.edit_form.id = row.id
			this.edit_form.name = row.name
			this.edit_form.manager_id = Number(row.manager_info.admin_id)
			this.edit_form.admin_list = row.admin_list.split(',').map((item) => Number(item))

			// 初始化可供选择的成员列表选项
			this.removeLeaderFromMember(this.edit_form.manager_id)
			this.$nextTick(() => {
				this.edit_visible = true
			})
		},
		// 重新选择团队负责人时,去除团队成员列表可选的选项
		removeLeaderFromMember(id) {
			this.admin_options = this.manager_options.filter((item) => item.admin_id !== id)
			this.edit_form.admin_list.forEach((item, index) => {
				if (item === id) {
					this.edit_form.admin_list.splice(index, 1)
				}
			})
		},
		// 提交表单
		submitForm(formName) {
			this.$refs[formName].validate((valid) => {
				if (valid) {
					const params = {
						id: this.edit_form.id,
						name: this.edit_form.name,
						manager_id: String(this.edit_form.manager_id),
						admin_list: this.edit_form.admin_list.join(',')
					}
					OperateTeam(params)
						.then((res) => {
							this.$message.success('操作成功')
							this.edit_visible = false
							this.getTeamList()
						})
						.catch((err) => {
							this.$message.error(err.data.msg)
						})
				} else {
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
