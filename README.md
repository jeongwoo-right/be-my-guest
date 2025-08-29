# 🏠 BeMyGuest (게스트하우스 검색/예약 서비스)

## 👥 팀원 소개
| <img alt="김성진 프로필" src="https://github.com/sungjin20.png" width="150px"> | <img alt="김정우 프로필" src="https://github.com/jeongwoo-right.png" width="150px"> | <img alt="김희선 프로필" src="https://github.com/xecond.png" width="150px"> | <img alt="배나연 프로필" src="https://github.com/baenavly.png" width="150px"> | <img alt="진윤기 프로필" src="https://github.com/YoonKiJin.png" width="150px"> |
| :----------------------------------------------------------------------------: | :----------------------------------------------------------------------------------: | :----------------------------------------------------------------------------: | :----------------------------------------------------------------------------: | :----------------------------------------------------------------------------: |
| **김성진**                                                                     | **김정우**                                                                          | **김희선**                                                                     | **배나연**                                                                     | **진윤기**                                                                     |
| [sungjin20](https://github.com/sungjin20)                                       | [jeongwoo-right](https://github.com/jeongwoo-right)                                  | [xecond](https://github.com/xecond)                                            | [baenavly](https://github.com/baenavly)                                        | [YoonKiJin](https://github.com/YoonKiJin)                                       |
| 리뷰 기능 및 마이페이지 UI                                                       | 찜 기능, 공통 레이아웃                                                         | 회원 관리, JWT 인증                                                           | 검색 기능, 공통 UI (tailwind 기반)                                                 | 게스트하우스 상세 기능 및 UI                                                      |

---

## 🗂️ 프로젝트 개요

**BeMyGuest**는 사용자가 게스트하우스를 손쉽게 **검색·예약·찜**할 수 있는 플랫폼입니다.  
여행자가 원하는 지역과 조건을 기반으로 게스트하우스를 탐색하고, 간단한 절차로 예약까지 완료할 수 있는 **원스톱 서비스**를 목표로 합니다.

### 🎯 프로젝트 목표
- 사용자 중심의 **간편한 예약 서비스 제공**  
- 게스트하우스 맞춤형 **검색 및 필터링 기능 구현**
- 나만의 관심 숙소를 저장할 수 있는 **위시리스트(찜하기)** 기능 제공  
- React + Spring Boot 기반의 **풀스택 아키텍처 학습**

### 🌟 주요 기능

- 🔍 **게스트하우스 검색** (지역/날짜/인원 수 조건 필터링 지원)  
- 📄 **상세 정보 확인** (소개글, 가격, 평점, 리뷰)  
- 🏷️ **예약 기능** (기간·인원 선택 및 가용 여부 확인)  
- ❤️ **찜하기(위시리스트)** (관심 숙소 저장 및 관리)  
---

## 📂 폴더 구조
```
📦 be-my-guest
├─ bemyguest-frontend/  # 프런트엔드 (React + TypeScript)
│ ├─ public/ # 정적 파일 (favicon, index.html 등)
│ ├─ tools/  # 게스트하우스 이미지 다운로드 자동화 코드
│ ├─ src/
│ │ ├─ assets/ # 이미지, 폰트 등 정적 자원
│ │ ├─ components/ # 재사용 가능한 UI 컴포넌트
│ │ ├─ hooks/ # 커스텀 훅
│ │ ├─ lib/ # 공용 라이브러리 및 유틸성 코드
│ │ ├─ pages/ # 페이지 단위 컴포넌트 (라우트 기준)
│ │ ├─ services/ # API 통신 모듈 (Axios 등)
│ │ ├─ styles/ # 전역 스타일, CSS/SCSS 모듈
│ │ └─ utils/ # 공통 유틸 함수
│ └─ package.json # 프런트엔드 설정
│
├─ bemyguest-backend/ # 백엔드 (Spring Boot, Gradle)
│ ├─ src/main/java/com/bemyguest/backend
│ │ ├─ configuration/ # 전역 설정 관련 (CORS, Security 등)
│ │ ├─ docs/ # API 문서 관련 (Swagger 등)
│ │ ├─ guesthouse/ # 게스트하우스 도메인 (Entity, Controller, Service)
│ │ ├─ reservation/ # 예약 도메인 (예약 처리 로직)
│ │ ├─ review/ # 리뷰 도메인 (후기/평점 관리)
│ │ ├─ search/ # 검색 기능 구현
│ │ ├─ user/ # 사용자 도메인 (회원가입/로그인/권한)
│ │ ├─ wish/ # 찜(위시리스트) 기능
│ │ └─ BemyguestBackendApplication.java # Spring Boot 실행 메인 클래스
│ │
│ ├─ src/main/resources/ # 설정 파일 (application.properties)
│ ├─ src/test/java/ # 테스트 코드
│ └─ build.gradle # Gradle 빌드 스크립트
│
└─ README.md
```

---

## 🚀 실행 방법 (Source Installation & Execution Guide)

### ✅ 1. Repository Clone
```bash
git clone https://github.com/jeongwoo-right/be-my-guest.git
```

### ✅ 2. Frontend 실행
```bash
cd be-my-guest/my-app
npm install
npm run dev
```

### ✅ 3. Backend 실행
1. IDE(STS/IntelliJ)에서 프로젝트 열기  
2. `BemyguestBackendApplication` 실행 → Run As → Spring Boot App  

### ✅ 4. DB 실행
MySQL에 `bemyguest` 데이터베이스 생성 후 `application.properties` 환경값에 연결 설정  

### ✅ 5. 최종 접속 확인
http://localhost:5173 (또는 Vite 출력 포트) 접속

---

## 🛠️ 기술 스택

### 💻 Frontend
[![My Skills](https://skillicons.dev/icons?i=react,ts,css)](https://skillicons.dev)  
- React (TypeScript)  
- React Router DOM을 통한 SPA 라우팅  
- Axios 기반 API 통신  

### 🧩 Backend
[![My Skills](https://skillicons.dev/icons?i=spring,java,gradle,mysql)](https://skillicons.dev)  
- Spring Boot (Java)  
- Gradle 기반 빌드/의존성 관리  
- JPA + Hibernate ORM  
- MySQL RDBMS  

### 🧰 Development Tools
[![My Skills](https://skillicons.dev/icons?i=github,vscode,gradle)](https://skillicons.dev)  
- GitHub로 버전 관리  
- VSCode / STS (Spring Tool Suite) 개발 환경  
- Node.js + npm 프론트엔드 관리  
- Gradle 백엔드 빌드  
