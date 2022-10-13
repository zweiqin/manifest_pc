<template>
	<div class="setting">
		<el-card class="el-card">
			<!--      企业微信推送参数设置-->
			<el-form ref="setting_form" :model="setting_form" :rules="setting_rules" class="setting_form" label-width="140px">
				<el-form-item label="企业微信企业号" prop="corp_id">
					<el-input v-model="setting_form.corp_id" placeholder="请输入企业微信企业号"></el-input>
				</el-form-item>
				<el-form-item label="企业微信应用密钥" prop="corp_secret">
					<el-input v-model="setting_form.corp_secret" placeholder="请输入企业微信应用密钥" type="password"></el-input>
				</el-form-item>
				<el-form-item label="企业微信应用id" prop="agent_id">
					<el-input v-model="setting_form.agent_id" placeholder="请输入企业微信应用id"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="submitForm('setting_form')">保存</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="text" @click="pushTest()">测试推送</el-button>
				</el-form-item>
			</el-form>

		</el-card>
	</div>
</template>

<script>
import { GetConfig, SendTestMsg, UpdateConfig } from '@/api/company_wx'

export default {
	name: 'setting',
	data() {
		return {
			setting_form: {
				corp_id: '',
				corp_secret: '',
				agent_id: '',
				id: ''
			},
			setting_rules: {
				corp_id: [
					{ required: true, message: '请输入企业微信企业号', trigger: 'blur' }
				],
				corp_secret: [
					{ required: true, message: '请输入企业微信应用密钥', trigger: 'blur' }
				],
				agent_id: [
					{ required: true, message: '请输入企业微信应用id', trigger: 'blur' }
				]
			}
		}
	},
	created() {
		this.getSetting()
	},
	methods: {
		// 推送测试
		pushTest() {
			this.$confirm('确定要推送测试消息吗？', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				SendTestMsg()
					.then(() => {
						this.$message({
							type: 'success',
							message: '推送成功!'
						})
					})
					.catch((error) => {
						this.$message({
							type: 'error',
							message: '推送失败!'
						})
					})
			})
				.catch(() => {
					this.$message({
						type: 'info',
						message: '已取消推送'
					})
				})
		},
		getSetting() {
			GetConfig()
				.then((res) => {
					this.setting_form.corp_id = res.data.corp_id
					this.setting_form.corp_secret = res.data.corp_secret
					this.setting_form.agent_id = res.data.agent_id
					this.setting_form.id = res.data.id
				})
				.catch((err) => {
					this.$message.error(err.data.msg)
				})
		},
		submitForm(formName) {
			this.$confirm('确认保存吗？', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				this.$refs[formName].validate((valid) => {
					if (valid) {
						UpdateConfig(this.setting_form)
							.then((res) => {
								this.$message.success('保存成功')
							})
							.catch((err) => {
								this.$message.error(err.data.msg)
							})
					} else {
						this.$message.error('请填写完整信息')
						return false
					}
				})
			})
				.catch(() => {
					this.$message({
						type: 'info',
						message: '已取消保存'
					})
				})
		}
	}
}
</script>

<style lang='scss' scoped>
.setting {
  .el-card {
    margin: 20px;
  }
}
</style>
