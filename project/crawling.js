const axios = require('axios')
const cheerio = require('cheerio')
const request = require('request')

axios.get(`http://store.naver.com/sogum/api/businesses?start=1&display=20&query=%EC%8B%A4%EB%82%B4%EB%86%80%EC%9D%B4%ED%84%B0`)
    .then(data => {
        const $ = cheerio.load(data.data);
        console.log('$:',$)
    })
    .then((response)=>{
        console.log('response : ', response)
    }).catch((err)=>{
        console.error(err)
    })

/*
axios({
	method: 'GET',
	url: `https://store.naver.com/sogum/api/businesses`
	//url: `https://store.naver.com/sogum/api/businesses`,
	//params: {
	//	start: 1,
	//	display: 20,
	//	query: `서울+양재동+실내놀이터`,
	//}
})
.then(res => {
	console.log(res)
})
.catch(err => {
	console.error(err)
	throw err
})
*/
