// 实现深拷贝函数
function DeepClone(data) {
  // 1.先判断拷贝的数据类型
  const type = JudgeType(data)
  let obj = null
  // 2. 数据类型不同，拷贝方式不同（主要分为对象与数组）
  if (type == 'array') {
    obj = []
    for (let i = 0; i < data.length; i++) {
      obj.push(DeepClone(data[i]))
    }
  } else if (type == 'object') {
    obj = {}
    for (let key in data) {
      if (data.hasOwnProperty(key)) {
        obj[key] = DeepClone(data[key])
      }
    }
  } else {
    return data
  }
  return obj
}

// 判断数据类型
function JudgeType(obj) {
  // toString 会返回对应不同的标签的构造函数
  const toString = Object.prototype.toString
  const map = {
    '[object Boolean]': 'boolean',
    '[object Number]': 'number',
    '[object String]': 'string',
    '[object Function]': 'function',
    '[object Array]': 'array',
    '[object Date]': 'date',
    '[object RegExp]': 'regExp',
    '[object Undefined]': 'undefined',
    '[object Null]': 'null',
    '[object Object]': 'object',
  }
  return map[toString.call(obj)]
}

export default function(value) {
  return new DeepClone(value);
}
