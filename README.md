## internship_project
ubuntu(16.04, aws) + node.js(express.js) + mysql <br>
IDE : vscode (ubuntu와 ftp 연결) <br>
<a href='https://github.com/ujin2021/2020_summer_internship'>관련 피드백</a> <br>
<a href='https://user-images.githubusercontent.com/53362054/91021473-cec32100-e62e-11ea-9ca7-6a4359213e6a.png'>현재 db</a>
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

### :feet:좀더 나아가서 
* db 조회하는 것이 중복이 많아서 좀더 간결하게 표현하고 싶은데 어떻게 할 것인가. -> 일단 함수별로 처리하는 것이 달라서 하나로 합칠 수 는 없고, 알아보니 Sequelize 라는 ORM이 있었다. 테이블 생성을 할 수 있고, crud작업 시 간결한 표현으로 나타낼 수 있다. (약간 django models.py와 migrations 느낌.)
