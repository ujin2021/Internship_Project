### internship_project
node.js(express.js) + mysql <br>

#### 환경세팅
* (node, npm, pm2, express 설치)
* npm init(package.json 생성)
* npm install express --save
* npm install body-parser (third party module, json)
~~* npm install express mysql~~
> npm uninstall mysql --save
* npm install request --save
* npm install crypto --save (password 암호화)
* npm install jsonwebtoken (jwt)
* npm install console-stamp --save (로그에 time stamp)
* npm install axios cheerio --save (크롤링)
* npm install --save mysql2
* npm install -g nodemon
> 실행) nodemon app.js

#### 구현할 것
✅ email 중복체크 <br>
✅ signup (password 암호화, 복호화) <br>
✅ login (token 발급, 체크) <br>
✅ Home 화면) categoryList 보내주기 (토큰 필요x) <br>
✅ product crawling (python code, 저장은 aws db)
> 💭 cron tab 설정 

✅ category 선택 시) productList 보내주기 (토큰 필요x) <br>
> (product 정보 입력받기)

✅ 리뷰 - 리뷰list는 토큰 없이도 가능. 리뷰작성은 토큰 필요(만약 안보내주면 로그인 필요하다는 msg) <br>
✅ 좋아요(찜하기) - db에 없으면 좋아요 등록, db에 있으면 좋아요 삭제 <br>
⬜️ 조회 <br>
> 리뷰 수(+별점수), 좋아요 수, 조회수 count하는 table 생성하기(트리거?)

⬜️ 쿠폰 <br>
