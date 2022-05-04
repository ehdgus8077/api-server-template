# API Server Template

---

## 개발 환경 & 스펙

- Node.js (16.15.0)
- yarn (npm 이 아닌 yarn 으로 통일)
- Typescript
- eslint
- Docker

## 사전 준비

- Node.js (16.15.0)
- yarn
- Typescript

## 시작

## 환경변수

- PORT: (optional) Server Port (default: 80)

### 시작

```
// 패키지 설치
yarn
// 실행
yarn start
```

### 도커로 시작

```
// 도커 이미지 빌드
docker build -t ts-api-server .
// 도커 컨테이너 실행
docker run -d -p 80:80 --name server ts-api-server
// 도커 컨테이너 로그 확인
docker logs -f server
// 도커 컨테이너 종료
docker rm -f server
```

### Test 실행

```
yarn test
```

### API 테스트하는 방법

- 서버 시작 후에 /api-docs 로 접속한다.
  ![swagger](https://user-images.githubusercontent.com/24893319/166458249-4d0ed3a0-3be9-49a6-b591-2f53d8cc4367.png)

## 파일 경로

- src
  - common: 상수 값이나 공통모듈
  - controller: API 제어하는 코드 모음
  - models: API 서버 객체
  - util: Util 코드
  - index.ts: 프로젝트 entrypoint
- test: Unit 테스트 코드 모음 (jest)
