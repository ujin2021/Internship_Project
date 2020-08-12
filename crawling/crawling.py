import urllib.request as request
from urllib import parse
import json
import pymysql
from db_setting import db
# 퍼센트 인코딩 : https://brownbears.tistory.com/501

base_url = "http://store.naver.com/sogum/api/businesses?start=1&display=10&query="
sorting = "&sortingOrder=reviewCount"

conn = pymysql.connect(host=db['host'], user=db['user'], password=db['password'], db=db['db'], charset=db['charset'])
curs = conn.cursor(pymysql.cursors.DictCursor)
sql = "INSERT INTO product (name, introduce, location, thumbnail, category, phone) VALUES (%s, %s, %s, %s, %s, %s)"

# 회원 location은 db저장 필요없음. 매장의 location은 db저장(table을 나눌까-주소 테이블)
# location : 서울 + category id : 2(실내놀이터)
loca = parse.quote('서울시')
cate = parse.quote('실내놀이터')
url = base_url+loca+'+'+cate+sorting# 인코딩 바꾸기
print('url : ', url)

req = request.urlopen(url)
res = req.readline()

j = json.loads(res)
data = j['items']
print('data : ', data, ', length : ', len(data)) # item 들만 가져오기

for i in range(0, len(data)):
    name = data[i]['name']
    introduce = data[i]['category']
    commonAddr = data[i]['commonAddr']
    addr = data[i]['addr']
    location = commonAddr + ' ' + addr
    thumbnail = data[i]['imageSrc']
    category = 2
    phone = data[i]['phone']
    
    
    params = (name, introduce, location, thumbnail, category, phone)
    curs.execute(sql, params)

conn.commit()
conn.close()

'''
ex) 실내놀이터
sql row : name/introduce/location/thumbnail/category/phone
-> category는 이미 지정되어있는거니까 맞는 id 넣어주면 된다.
json에서 key : name/(promotionTitle)/commonAddr+addr/imageSrc/2(실내놀이터)/phone
'''
