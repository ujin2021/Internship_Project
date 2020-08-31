## internship_project
ubuntu(16.04, aws) + node.js(express.js) + mysql <br>
IDE : vscode (ubuntu와 ftp 연결) <br>
<a href='https://github.com/ujin2021/2020_summer_internship'>관련 피드백</a> <br>
<a href='https://github.com/ujin2021/internship_project/tree/master/models'>db tables</a> <br>
<br>
### :crystal_ball: <a href='https://github.com/ujin2021/internship_project/blob/master/project/package.json'>dependencies</a>

### :crystal_ball: 구현한 것
<a href="https://gist.github.com/3af9d78e30050203a4c53a09edf60482.git">endpoint</a> <br>
✅ email 중복체크<br>
✅ signup <br>
✅ login(jwt 인증 기반) <br>
✅ category 별 product - product 의 ticket 구매, ticket 구매 시 coupon 사용, product 찜하기, product 리뷰, 평점 작성, ticket 사용<br>
> ✅ product crawling (python code, 저장은 db)
> 💭 cron tab 설정  <br>
✅ mypage - 찜한상품, 작성한 리뷰, 구매한 ticket, 사용/미사용 ticket, 보유한 쿠폰

#### :sparkles: 리뷰, 좋아요, 조회 구현 
:hearts: 리뷰테이블, 좋아요 테이블, 조회테이블 -> 회원이 자신이 작성한 리뷰, 좋아요 해놓은 상품, 최근 본 상품을 띄워주기 위해 필요. <br>
:hearts: 리뷰수(+별점 평균), 좋아요수, 조회수 -> 따로 테이블 만들지 않고 상품 테이블안에 컬럼으로 추가하여 조회할 때마다 +1 <br>
:hearts: delete를 하면 안되므로 각 테이블에 enable설정. 만약 좋아요를 눌렀다가 취소 -> enable을 true에서 false로 변경 <br>
:hearts: 최근 본 상품같은 경우, 같은 상품을 다시조회하면 시간만 업데이트 <br>
:hearts: 리뷰 별점평균은 평균을 바로 구하기 힘들어서 evaluation_average -> evaluation_total로 변경. 별점수를 계속 더하고, 필요한 순간에 evaluation_total / review_count 를 계산해주는게 낫다고 판단. <br>
:hearts: 리뷰, 조회 post가 올 때마다 count +1, 좋아요는 enable 을 true로 바꿀 땐 +1, false로 바꿀 땐 -1 해주었다. <br>

### :feet:좀더 나아가서 
* api 정리
* ~~sequelize 적용(설치 및 sequelize-auto 설정 완료 -> query 문을 orm으로 변경하기, db연결 확인하기)~~ => 일단은 query문을 써도 괜찮다. (개발자 수가 적을때, 사용하는 유저가 적을때) 그리고 아직 query문(join, inner join...)등을 완벽하게 쿼리문으로 작성할 수 있을때 orm으로 넘어가도 헷갈리지않음. 일단 하나를 완벽하게 한 후에 해도 늦지 않다
