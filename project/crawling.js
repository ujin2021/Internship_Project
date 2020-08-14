const axios = require('axios')
const cheerio = require('cheerio')
const request = require('request')
//const { url } = require('inspector')

// axios.get(`http://store.naver.com/sogum/api/businesses?start=1&display=20&query=%EC%8B%A4%EB%82%B4%EB%86%80%EC%9D%B4%ED%84%B0`)
//     .then(data => {
//         const $ = cheerio.load(data.data);
//         console.log('$:',$)
//     })
//     .then((response)=>{
//         console.log('response : ', response)
//     }).catch((err)=>{
//         console.error(err)
//     })

axios.get('https://store.naver.com/sogum/api/businesses?start=1&display=1000&query=%EC%84%9C%EC%9A%B8%EC%8B%9C+%EC%8B%A4%EB%82%B4%EB%86%80%EC%9D%B4%ED%84%B0&sortingOrder=reviewCount',
		{crossDomain : true,headers: {'Content-Type' : 'application/x-www.form-urlencoded', 'Access-Control_allow_Origin' : '*'}
})
.then(res => {
	console.log(res.data.items)
})
.catch(err => {
	console.error(err)
	throw err
})
