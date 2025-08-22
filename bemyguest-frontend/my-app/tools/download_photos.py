# PEXEL 에서 이미지 다운로드 자동화 코드

# 예시(터미널 입력)
# Pexels API Key를 입력하세요: ************
# 검색 키워드를 입력하세요 (예: house): house
# 다운로드할 이미지 개수를 입력하세요 (예: 20): 20
# 저장할 절대경로를 입력하세요: C:\Users\Desktop\photos


import os
import time
import math
import requests
import getpass

SIZE_KEY = "large"        # 'original', 'large2x', 'large', 'medium' 등
PER_PAGE = 80             # Pexels API 최대 허용값
SLEEP_BETWEEN_PAGES = 0.5

# === 실행 시 사용자 입력 ===
PEXELS_API_KEY = getpass.getpass("Pexels API Key를 입력하세요: ").strip()
QUERY = input("검색 키워드를 입력하세요 (예: house): ").strip()
TOTAL = int(input("다운로드할 이미지 개수를 입력하세요 (예: 510): ").strip())
OUT_DIR = input("저장할 절대경로를 입력하세요: ").strip()

BASE_URL = "https://api.pexels.com/v1/search"
HEADERS = {"Authorization": PEXELS_API_KEY}


def ensure_dir(path: str):
    os.makedirs(path, exist_ok=True)


def download_file(url: str, save_path: str) -> bool:
    if os.path.exists(save_path):
        return True
    try:
        with requests.get(url, stream=True, timeout=30) as r:
            r.raise_for_status()
            with open(save_path, "wb") as f:
                for chunk in r.iter_content(8192):
                    if chunk:
                        f.write(chunk)
        return True
    except Exception as e:
        print(f"[WARN] 다운로드 실패: {url} -> {e}")
        return False


def fetch_page(query: str, page: int, per_page: int = 80) -> dict:
    params = {"query": query, "page": page, "per_page": per_page}
    resp = requests.get(BASE_URL, headers=HEADERS, params=params, timeout=30)
    resp.raise_for_status()
    return resp.json()


def main():
    if not PEXELS_API_KEY:
        raise SystemExit("API 키를 입력해야 실행됩니다.")

    ensure_dir(OUT_DIR)

    pages_needed = math.ceil(TOTAL / PER_PAGE)
    downloaded = 0
    page = 1

    print(f"검색어='{QUERY}', 목표={TOTAL}장 저장 시작... (저장경로: {OUT_DIR})")

    while downloaded < TOTAL and page <= pages_needed:
        try:
            data = fetch_page(QUERY, page, PER_PAGE)
        except Exception as e:
            print(f"[ERROR] 페이지 {page} 요청 실패: {e}")
            time.sleep(5)
            continue

        photos = data.get("photos", [])
        if not photos:
            break

        for p in photos:
            if downloaded >= TOTAL:
                break

            src = p.get("src", {})
            url = src.get(SIZE_KEY) or src.get("original")
            if not url:
                continue

            filename = f"{downloaded + 1}.jpg"
            save_path = os.path.join(OUT_DIR, filename)

            if download_file(url, save_path):
                downloaded += 1
                if downloaded % 50 == 0 or downloaded == TOTAL:
                    print(f"진행률: {downloaded}/{TOTAL}")

        page += 1
        if downloaded < TOTAL:
            time.sleep(SLEEP_BETWEEN_PAGES)

    print(f"완료: {downloaded}장 다운로드됨 → {OUT_DIR}")


if __name__ == "__main__":
    main()
