## internship_project
ubuntu(16.04, aws) + node.js(express.js) + mysql <br>
IDE : vscode (ubuntu - ftp) <br>
:pushpin: <a href='https://github.com/ujin2021/2020_summer_internship'>관련 피드백</a> <br>
:pushpin: <a href='https://github.com/ujin2021/internship_project/tree/master/models'>db tables</a> <br>
:pushpin: <a href="https://app.gitbook.com/@ujin2021/s/summer-internship/@merged">endpoint</a> <br>
:pushpin: <a href='https://github.com/ujin2021/internship_project/blob/master/project/package.json'>dependencies</a>
<br>

### :crystal_ball: 기능
✅ email 중복체크<br>
✅ signup <br>
✅ login(jwt 인증 기반) <br>
✅ category 별 product - product 의 ticket 구매, ticket 구매 시 coupon 사용, product 찜하기, product 리뷰, 평점 작성, ticket 사용<br>
> ✅ product crawling (python code, 저장은 db)
> 💭 cron tab 설정  <br>
✅ mypage - 찜한상품, 작성한 리뷰, 구매한 ticket, 사용/미사용 ticket, 보유한 쿠폰

#### :sparkles: 구현 상세
:hearts: product_likes : 사용자가 처음 찜하면 db저장, 이후에는 enable status로 찜하기 등록/취소 update <br>
:hearts: log_products : 사용자가 처음 상품을 조회하면 db저장, 이후에는 log_at 시간만 update <br>
:hearts: products : 사용자가 조회할때, 찜하기를 누르거나 취소할때, 리뷰를 작성할 때 count 증가/감소. 별점은 바로바로 계산하기 힘들기때문에 리뷰 등록시 별점수만큼 증가시킨 후, 상품 리스트 띄울 때 (별점수)/(리뷰수) 로 별점 평균 구함 <br>
:hearts: delete를 하면 안되므로 각 테이블에 enable설정. status로 확인/관리 <br>
:hearts: db transaction 구현 <br>
