# Item_Simulater
 

시간이 조금 더 있었으면 도전과제도 해봤겠지만, 부족했던 관계로 필수과제만 완성했습니다! 주말이나 시간이 남는다면, 도전해보도록 하겠습니다!

0. 프로젝트 관리

   1. .env파일을 이용해서 민감한 정보(DB 계정 정보, API Key 등)를 관리합니다.
       - env파일이 도중에 사라지는 일이 있었어서, 새로운 레파지토리를 만들고, 다시 설치한 이후 코드를 복사해 온 일이 있었습니다.
   2. .gitignore 파일을 생성하여 .env 파일과 node_modules 폴더가 Github에 올라가지 않도록 설정합니다.
       - .gitignore 파일을 생성하여 설정했습니다.
   3. .prettierrc 파일을 생성하여 일정한 코드 포맷팅을 유지할 수 있도록 설정합니다.
       - .prettierrc.jsom 파일을 생성하여 설정했습니다.

1. AWS EC2 배포
    - 완료했습니다.


2. 인증 미들웨어 구현
    - JWT 사용해서 로그인을 구현하였고, authMiddleware를 만들어서 캐릭터 생성, 삭제, 조회 등의 기능을 조작할 수 있는 권한을 부여하였습니다.

      
3. 데이터베이스 모델링
Users {
  userId   Int    @id @default(autoincrement()) @map("userId")
  email    String @map("email")
  password String @map("password")
}

Items {
  item_code  Int    @id @default(autoincrement()) @map("itemId")
  item_name  String @map("item_name")
  item_stat  Json   @map("item_stat")
  item_price Int    @map("item_price")
}

Character {
  userId      Int    @map("userId")
  char_id     Int    @id @default(autoincrement()) @map("char_id")
  char_name   String @map("char_name")
  char_health Int    @map("char_health")
  char_power  Int    @map("char_power")
  char_money  Int    @map("char_money")
}

   - 위와 같은 방법으로 구현했습니다. Users와 Character는 1:n으로 userId를 이용해서 묶여있습니다.

     
4. API 구현하기
   - 회원가입 API
      - POST localhost:3018/api/sign-up => "email", "password"를 입력합니다. 중복되는 "email"은 승인되지 않습니다.
        
   - 로그인 API
      - POST localhost:3018/api/sign-in =>  "email", "password"를 입력합니다. authotization 쿠키에 Bearer 토큰 형식으로 JWT를 저장합니다.
        
   - 캐릭터 생성 API
      - POST localhost:3018/api/new => "char_name"을 입력합니다. JWT인증을 받아, 로그인한 유저의 userId 값이 포함되며, "char_id", "char_name", "char_health"(500), "char_power"(100), "char_money"(10000)이 생성됩니다.

   - 캐릭터 삭제 API
      - DELETE localhost:3018/api/delete => "char_name"을 입력합니다. JWT인증을 받아, 로그인한 유저의 캐릭터만 삭제가 가능합니다.

   - 캐릭터 상세 조회 API
      - GET localhost:3018/api/check/:char_name => "char_name", "char_health", "char_power", "char_money"가 조회됩니다. JWT인증을 받아, 로그인한 유저의 캐릭터가 아니면 "char_money"는 조회되지 않습니다.

   - 아이템 생성 API
      - POST localhost:3018/api/newitem => "item_code", "item_name", "item_stat", "item_price"를 입력합니다. "item_code"가 중복된다면 생성되지 않습니다. "item_stat"은 json형식으로 되어있어, "health", "power"를 받을 수 있습니다.
        
   - 아이템 수정 API
      - PUT localhost:3018/api/fixitem/:item_code => "item_name", "item_stat"을 입력합니다. parameter로 전달받은 "item_code"가 숫자이기 때문에, Number()을 이용해서 숫자열로 변경 후 API가 동작합니다.
   
   - 아이템 목록 조회 API
      - GET localhost:3018/api/itemlist => "item_code",	"item_name", "item_stat" {	"power",	"health" }, "item_price"가 모든 아이템을 대상으로 조회됩니다.

   - 아이템 상세 조회 API
      - GET localhost:3018/api/checkitem/:item_code => 입력한 "item_code"에 맞는 "item_code",	"item_name", "item_stat" {	"power",	"health" }, "item_price"가 조회됩니다.


5. 질문과 답변
   - 암호화방식
      - 단방향 암호화 방식입니다. 복호화가 불가능하기때문에, PW의 유출을 막을 수 있습니다.
        
   - 인증 방식
      - 다른 사용자가 토큰이 유출된 사용자의 권한을 가질 수 있습니다.
      - 일정 시간마다 같은 권한을 가진 다른 토큰을 부여하고, 기존의 토큰을 삭제하는 방법이 있습니다.

   - 인증과 인가
      - 인증은 사용자의 신분을 검증하는 작업이고, 인가는 사용자의 특정 작업 수행 권한이 있는지를 검증하는 작업입니다.
      - ID를 부여하고, 각 ID마다 수행할 수 있는 작업이 다릅니다.
      - 게임의 밸런스를 망가뜨릴 수 있습니다. 하지만, 적절한 범위내에서 확률을 통한 아이템 제작이 가능하다면, 아이템을 제작하는 작업도 충분히 재미를 느낄 수 있는 컨텐츠가 될 것이니다.

   - Http Status
      - 200 : 요청이 성공하여 사용자가 원하는 데이터값이나 토큰을 제공/부여합니다.
      - 201 : 요청이 성공하여 사용자의 이력 데이터가 저장되었습니다.
      - 401, 404, 409 : 잘못된 입력값을 받았거나, 데이터에 해당 정보가 없습니다.
      - 작업하면서, Http Status에 의미를 부여해야겠다는 생각을 하지 못했습니다. 이 질문을 보고 나서야 강의에서 들었던 내용이 생각났습니다. 다음 작업때는 신경쓰면서 작업해야겠다고 생각합니다.

   - 게임 경제
      - 재화가 캐릭터의 정보에 포함되어있으면, 데이터를 수정하여 재화를 늘릴 수 있습니다. 재화와 관련된 작업을 처리하는 다른 데이터베이스를 만들어, 보안성을 강화하는 방법이 있습니다.
      - 구입 가격을 수정하여, 기존과 다른 가격에 구입할 수 있으며, 데이터베이스에서 에러를 유발할 수 있습니다.
