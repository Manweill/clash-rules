function main(config) {
  if (!config) return config;
  if (!config['proxy-providers']) config['proxy-providers'] = {};

  // 全局统一过滤规则：订阅里的节点名匹配不到这些词才保留
  var FILTER = '^(?!.*(群|邀请|返利|循环|官网|客服|网站|网址|获取|订阅|流量|到期|机场|下次|版本|官址|备用|过期|已用|联系|邮箱|工单|贩卖|通知|倒卖|防止|国内|地址|频道|无法|说明|使用|提示|特别|访问|支持|教程|关注|更新|作者|加入|USE|USED|TOTAL|EXPIRE|EMAIL|Panel|Channel|Author))';

  // 二维数组：每行 [provider名称, 订阅URL]
  var PROVIDERS = [
    ['airport-a', 'https://a.example.com/api/v1/client/subscribe?token=AAA'],
    ['airport-b', 'https://b.example.com/api/v1/client/subscribe?token=BBB'],
    ['airport-c', 'https://c.example.com/api/v1/client/subscribe?token=CCC'],
  ];

  for (var i = 0; i < PROVIDERS.length; i++) {
    var name = PROVIDERS[i][0];
    var url  = PROVIDERS[i][1];

    // 同名已存在则跳过，避免重复注入
    if (config['proxy-providers'][name]) continue;

    config['proxy-providers'][name] = {
      type: 'http',
      url: url,
      path: './providers/' + name + '.yaml',   // 文件名直接用 name
      interval: 86400,
      filter: FILTER,                          // 统一过滤
      'health-check': {
        enable: true,
        url: 'https://www.gstatic.com/generate_204',
        interval: 150,
      },
    };
  }

  return config;
}
