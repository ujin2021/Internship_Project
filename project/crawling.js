var request = require('request')
var url = 'http://store.naver.com/sogum/api/businesses?start=1&display=10&query=%EC%84%9C%EC%9A%B8%EC%8B%9C+%EC%8B%A4%EB%82%B4%EB%86%80%EC%9D%B4%ED%84%B0&sortingOrder=reviewCount'
// get으로 json 가져오기
// start=[페이지 수], display=[가져올 갯수], query=(지역)+(지역)+(카테고리)
// 카테고리를 선택하면 query에 선택한 카테고리 넣어서 json가져오기
// 할일 : 
// 1. 선택한 카테고리에 맞는 url 만들고 요청하기
// 2. 가져온 정보 파싱해서 db저장
// 3. ubuntu에 프로젝트 올리고 crontab 설정하기
request({url:url, json:true}, function(err, res, JSON) {
    if(!err){
        console.log(JSON)
    }
    else{
        console.log(err)
    }
})