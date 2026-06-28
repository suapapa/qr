# Premium QR Code Studio - Docker Compose Deployment Guide

중앙에 맞춤 로고를 삽입하고 실시간 디자인 테마를 조합할 수 있는 프리미엄 QR 코드 생성 스튜디오입니다. 본 가이드는 Docker Compose를 사용하여 서비스를 쉽고 빠르게 프로덕션 및 로컬 환경에 배포하는 방법을 설명합니다.

FastAPI 기반의 고성능 이미지 합성 백엔드와 Nginx/Vanilla JS 기반의 글래스모피즘 웹 프론트엔드가 컨테이너 네트워크로 묶여 안전하고 효율적으로 동작합니다.

---

## 🚀 빠른 시작 (Quick Start)

서비스를 바로 구동하려면 시스템에 Docker 및 Docker Compose가 설치되어 있어야 합니다.

### 1. 서비스 구동
프로젝트 루트 디렉터리에서 다음 명령을 실행하여 프론트엔드와 백엔드를 빌드하고 백그라운드에서 구동합니다.

```bash
docker compose up -d --build
```

### 2. 접속 정보
컨테이너 구동이 완료되면 브라우저에서 다음 주소로 접속합니다.

*   **웹 UI (프론트엔드)**: [http://localhost:8081](http://localhost:8081)
*   **백엔드 API 헬스체크**: [http://localhost:8081/api/health](http://localhost:8081/api/health)

> [!NOTE]
> 프론트엔드 컨테이너의 Nginx가 내부적으로 `/api/` 경로의 요청을 백엔드 컨테이너(포트 8000)로 프록시해주기 때문에, 브라우저에서는 CORS 제약 없이 단일 포트(`8081`)를 통해 웹 서비스와 API를 모두 이용할 수 있습니다.

---

## ⚙️ 배포 커스터마이징 (Configuration)

### 1. 서비스 포트 변경
기본 포트(`8081`) 대신 다른 포트로 서비스를 열고 싶다면 [docker-compose.yml](file:///Users/suapapa/ws_suapapa/gen_qr/docker-compose.yml) 파일을 수정해야 합니다.

`frontend` 서비스의 `ports` 설정을 변경합니다. 예를 들어 외부 포트를 `80`으로 바꾸려면 아래와 같이 설정합니다.

```yaml
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "80:80"  # 외부 포트 8081을 80으로 변경
    depends_on:
      backend:
        condition: service_started
    restart: always
```

변경 후 컨테이너를 재구동합니다.
```bash
docker compose up -d
```

### 2. 시스템 기본 로고 교체
QR 생성기에서 기본적으로 노출되는 중앙 로고 이미지(`logo.png`)를 배포 단계에서 원하는 파일로 바꾸고 싶다면 두 가지 방법이 있습니다.

#### 방법 A: 빌드 전 파일 교체
컨테이너를 빌드하기 전, [backend/logo.png](file:///Users/suapapa/ws_suapapa/gen_qr/backend/logo.png) 파일을 다른 이미지로 교체한 후 다시 빌드합니다.
```bash
docker compose up -d --build
```

#### 방법 B: 볼륨 마운트 사용 (권장)
이미지를 다시 빌드하지 않고 호스트 컴퓨터의 로고 이미지를 컨테이너 내부에 직접 덮어씌울 수 있습니다. [docker-compose.yml](file:///Users/suapapa/ws_suapapa/gen_qr/docker-compose.yml)의 `backend` 서비스에 `volumes` 설정을 추가합니다.

```yaml
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    expose:
      - "8000"
    environment:
      - PYTHONUNBUFFERED=1
    volumes:
      - ./my_custom_logo.png:/app/logo.png  # 호스트의 파일을 컨테이너의 logo.png로 매핑
    restart: always
```

---

## 🛠️ 컨테이너 관리 명령어 (Operations)

| 작업 | 명령어 |
| :--- | :--- |
| **백그라운드 실행** | `docker compose up -d` |
| **종료 및 리소스 해제** | `docker compose down` |
| **전체 컨테이너 재빌드** | `docker compose up -d --build` |
| **컨테이너 로그 확인** | `docker compose logs -f` |
| **백엔드 로그만 확인** | `docker compose logs -f backend` |
| **프론트엔드 로그만 확인** | `docker compose logs -f frontend` |

---

## ⚠️ 트러블슈팅 (Troubleshooting)

### API 연결 실패 및 로드 불가
*   **증상**: 웹 브라우저 접속은 되나 QR 코드를 생성할 때 에러가 발생하거나 로딩 바가 멈추는 경우.
*   **해결 방법**: 백엔드 컨테이너가 정상적으로 동작 중인지 확인하십시오.
    ```bash
    docker compose ps
    ```
    만약 백엔드 컨테이너가 정상 구동 중이지 않다면 아래 명령으로 백엔드만 재시작해 로그를 점검하십시오.
    ```bash
    docker compose restart backend
    docker compose logs backend
    ```

### 컨테이너 헬스체크 실패
*   **증상**: 백엔드 컨테이너의 상태가 `unhealthy`로 표시되는 경우.
*   **해결 방법**: 백엔드 컨테이너가 API 서버를 띄우는 데 필요한 라이브러리 및 패키지가 올바르게 로드되었는지 확인하고, 컨테이너 터미널 내에서 아래 명령을 실행하여 수동으로 테스트해볼 수 있습니다.
    ```bash
    docker compose exec backend python -c 'import urllib.request; urllib.request.urlopen("http://localhost:8000/api/health")'
    ```
