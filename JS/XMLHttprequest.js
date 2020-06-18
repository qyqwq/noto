<button id="myButton">点我</button>
myButton.addEventListener('click',function(){
	let request = new XMLHttpRequest()
	request.onreadystatechange = function(){	//尽量往上放，不会错过任何一个状态，放在下面的话会错过之前的状态
		console.log(request.readyState)
		if(request.readyState === 4){		//请求完成
			if(request.status === 200){			//请求成功
				let string = request.responseText
				//把符合 JSON 语法的String 转换成 JS 对应的 Object
				let object = window.JSON.parse(string)	//JSON.parse 是浏览器提供的，json3.js是著名的就是写JSON.parse的
			}else if(request.status === 400){	//请求失败
                console.log("错误信息：" + request.status)
			}
		}
	}
	request.open('POST','http://jack.com/8889/xxx')//配置 request
	request.send()
})