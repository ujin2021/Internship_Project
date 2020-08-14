## internship_project
ubuntu(16.04, aws) + node.js(express.js) + mysql <br>
IDE : vscode (ubuntu와 ftp 연결) <br>
<a href='https://github.com/ujin2021/2020_summer_internship'>관련 피드백</a>
<br>
### dependencies
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

### 구현할 것
✅ email 중복체크 <br>
✅ signup (password 암호화, 복호화) <br>
✅ login (token 발급, 체크) <br>
✅ Home 화면) categoryList 보내주기 (토큰 필요x) <br>
✅ product crawling (python code, 저장은 aws db)
> 💭 cron tab 설정  <br>
> cross domain문제일 수 있다고, axios header에 cross domain 추가해봤지만 여전히 되지 않음..

✅ category 선택 시) productList 보내주기 (토큰 필요x) <br>
> (product 정보 입력받기)

✅ 리뷰, 평점 - 리뷰list는 토큰 없이도 가능. 리뷰작성은 토큰 필요(만약 안보내주면 로그인 필요하다는 msg) <br>
✅ 좋아요(찜하기) - db에 없으면 좋아요 등록, db에 있으면 ~~좋아요 삭제~~ <br>
✅ 조회수, 최근본상품 
<br>

#### :sparkles: 리뷰, 좋아요, 조회 구현 
:hearts: 리뷰테이블, 좋아요 테이블, 조회테이블 -> 회원이 자신이 작성한 리뷰, 좋아요 해놓은 상품, 최근 본 상품을 띄워주기 위해 필요. <br>
:hearts: 리뷰수(+별점 평균), 좋아요수, 조회수 -> 따로 테이블 만들지 않고 상품 테이블안에 컬럼으로 추가하여 조회할 때마다 +1 하는 쿼리 작성 <br>
:hearts: delete를 하면 안되므로 각 테이블에 enable설정. 만약 좋아요를 눌렀다가 취소 -> enable을 true에서 false로 변경 <br>
:hearts: 최근 본 상품같은 경우, 같은 상품을 다시조회하면 시간만 업데이트 <br>
:hearts: 리뷰 별점평균은 평균을 바로 구하기 힘들어서 evaluation_average -> evaluation_total로 변경. 별점수를 계속 더하고, 필요한 순간에 evaluation_total / review_count 를 계산해주는게 낫다고 판단. <br>
:hearts: 리뷰, 조회 post가 올 때마다 count +1, 좋아요는 enable 을 true로 바꿀 땐 +1, false로 바꿀 땐 -1 해주었다. <br>

⬜️ 쿠폰 <br>

### 좀더 나아가서 :feet:
* 리뷰, 좋아요, 조회 구현할 때 그 테이블엔 저장이 되고, 카운트는 안되는 경우가 발생할 수 있음. -> 트랜잭션을 사용하려고 했는데, pool 설정이 다른 예제들과 달라서 똑같이 따라했더니 적용되지 않음
* 토큰 확인을 미들웨어로 구현 -> 미들웨어를 어떻게 구현할 것인가, 만약에 토큰을 안보내줬을 경우 어디서 res를 보내주는가
* db 조회하는 것이 중복이 많아서 좀더 간결하게 표현하고 싶은데 어떻게 할 것인가.
