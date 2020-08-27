## internship_project
ubuntu(16.04, aws) + node.js(express.js) + mysql <br>
IDE : vscode (ubuntu와 ftp 연결) <br>
<a href='https://github.com/ujin2021/2020_summer_internship'>관련 피드백</a> <br>
<a href='https://user-images.githubusercontent.com/53362054/91158067-1914d280-e701-11ea-9b04-eb3f725ea048.png'>db tables</a> <br>
<a href='https://gist.github.com/56bcea1e2bf7f3b0ffe24ca9af6ac7a6.git'>db 스키마 정리</a>
<br>
### :crystal_ball: dependencies
* (node, npm, pm2, express 설치)
* npm init(package.json 생성)
* npm install express --save
* npm install body-parser (third party module, json)
* npm install -g nodemon
> 실행) nodemon app.js
<br>
"axios": "^0.19.2" <br>
"body-parser": "^1.19.0" <br>
"cheerio": "^1.0.0-rc.3" <br>
"console-stamp": "^0.2.9" <br>
"crypto": "^1.0.1" <br>
"express": "^4.17.1" <br>
"iconv": "^3.0.0" <br>
"jsonwebtoken": "^8.5.1" <br>
"mysql2": "^2.1.0" <br>
"request": "^2.88.2" <br>

<br>

### :crystal_ball: 구현할 것
<a href="https://gist.github.com/3af9d78e30050203a4c53a09edf60482.git">endpoint</a> <br>
✅ email 중복체크(POST) <br>
✅ signup(+password 암호화, 복호화)(POST)<br>
✅ login(+token 발급)(POST) <br>
✅ Home 화면) categoryList 보내주기(토큰 필요x)(GET)<br>
✅ product crawling (python code, 저장은 aws db)
> 💭 cron tab 설정  <br>
> cross domain문제일 수 있다고, axios header에 cross domain 추가해봤지만 여전히 되지 않음..

✅ category 선택 시) productList 보내주기(토큰 필요x)(POST) <br>
> (product 정보 입력받기)

✅ 리뷰 - 해당상품리뷰list(POST). 리뷰작성(+토큰필요, 만약 안보내주면 로그인 필요하다는 msg)(POST) <br>
✅ 평점 - 해당상품 리뷰시 db total평점에 +
✅ 좋아요(찜하기) - db에 없으면 좋아요 등록, db에 있으면 ~~좋아요 삭제~~  (POST)<br>
✅ 조회수, 최근본상품 (POST) <br>
✅ 해당회원의 좋아요 목록(+토큰필요)(GET) <br>

#### :sparkles: 리뷰, 좋아요, 조회 구현 
:hearts: 리뷰테이블, 좋아요 테이블, 조회테이블 -> 회원이 자신이 작성한 리뷰, 좋아요 해놓은 상품, 최근 본 상품을 띄워주기 위해 필요. <br>
:hearts: 리뷰수(+별점 평균), 좋아요수, 조회수 -> 따로 테이블 만들지 않고 상품 테이블안에 컬럼으로 추가하여 조회할 때마다 +1 하는 쿼리 작성 <br>
:hearts: delete를 하면 안되므로 각 테이블에 enable설정. 만약 좋아요를 눌렀다가 취소 -> enable을 true에서 false로 변경 <br>
:hearts: 최근 본 상품같은 경우, 같은 상품을 다시조회하면 시간만 업데이트 <br>
:hearts: 리뷰 별점평균은 평균을 바로 구하기 힘들어서 evaluation_average -> evaluation_total로 변경. 별점수를 계속 더하고, 필요한 순간에 evaluation_total / review_count 를 계산해주는게 낫다고 판단. <br>
:hearts: 리뷰, 조회 post가 올 때마다 count +1, 좋아요는 enable 을 true로 바꿀 땐 +1, false로 바꿀 땐 -1 해주었다. <br>

✅ 티켓 <br>
✅ 쿠폰 <br>

### :feet:좀더 나아가서 
* api 정리
* ~~sequelize 적용(설치 및 sequelize-auto 설정 완료 -> query 문을 orm으로 변경하기, db연결 확인하기)~~ => 일단은 query문을 써도 괜찮다. (개발자 수가 적을때, 사용하는 유저가 적을때) 그리고 아직 query문(join, inner join...)등을 완벽하게 쿼리문으로 작성할 수 있을때 orm으로 넘어가도 헷갈리지않음. 일단 하나를 완벽하게 한 후에 해도 늦지 않다
