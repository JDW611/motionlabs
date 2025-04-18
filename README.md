# Motionlabs 과제테스트

## 개요

엑셀 파일을 통해 환자 정보를 등록하고 환자 목록을 조회하는 서버 구축

## 기술 스택

| Name       | Version |
| ---------- | ------- |
| NestJS     | 9.2.0   |
| TypeScript | ^5.5.0  |
| TypeORM    | 0.3.10  |
| MySQL      | 8.0.41  |

## 2. 설치 및 실행 방법

### 설치

```bash
$ git clone https://github.com/JDW611/motionlabs.git

# install
$ yarn
```

### 환경변수 설정

프로젝트 내에 `.env.local`를 생성합니다.

```.env.local
# Application
PORT=3000

# Database
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=ekdns001
DB_DATABASE=motionlabs
DB_SYNCHRONIZE=true # true, 필수

```

### 실행

```bash
$ yarn serve
```

## 3. API 명세

-   swagger 문서
    > http://localhost:3000/api-docs

## 4. 성능 최적화

### Excel 중복 및 병합 처리

1. 데이터 유효성 검증

    - 엑셀 파일에서 파싱된 데이터는 `ExcelParserService`에서 각 행별로 유효성 검증
    - 이름, 전화번호 등 필수 필드 검증 및 형식 검사 수행

2. 환자 정보 병합 로직

    - 이름과 전화번호를 기준으로 그룹으로 환자를 구성(고유 식별키로 사용)
    - 차트번호 기반 병합 정책 적용:
        - 그룹의 레코드와 병합할 레코드가 모두 차트번호가 있는 경우: 차트번호가 동일한 경우만 병합
        - 한 레코드만 차트번호가 있는 경우: 차트번호 정보 유지하며 병합
        - 두 레코드 모두 차트번호가 없는 경우: 나머지 정보 통합하여 병합

3. 중복 제거 최적화
    - 환자 식별키(이름+전화번호)를 기준으로한 그룹핑을 하여 메모리 내 효율적인 중복 관리
    - 차트번호 충돌 케이스 별도 처리로 데이터 무결성 보장

### 데이터베이스 중복 및 병합 처리

1. 임시 테이블 활용 전략

    - 단일 트랜잭션 내에서 임시 테이블 생성하여 엑셀 데이터 저장
    - 임시 테이블과 환자 테이블 간 조인 연산으로 효율적인 비교 수행

2. 케이스별 처리 로직

    - 기존 디비 레코드 업데이트

        - [이름, 전화번호]가 같고 차트번호가 같거나 하나 이상이 NULL인 경우 -> UPDATE

    - 신규 환자 등록

        - 업데이트를 진행하지 않은 레코드의 경우 → 새 환자로 INSERT

3. 성능 최적화
    - 단일 쿼리를 통한 대량 데이터 처리로 DB 라운드트립 최소화
    - JOIN 기반 비교로 애플리케이션 로직 대신 DB 엔진의 최적화 활용
    - 트랜잭션 적용으로 데이터 일관성 보장 및 실패 시 롤백 처리

#### 성능

> MacBook Pro 14 M1 pro 32GB 기준

-   전체 소요 시간 : 1.975s
