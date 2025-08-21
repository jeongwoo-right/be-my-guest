USE sdsdb;

-- 안전 실행을 위해
SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- 1) 회원
CREATE TABLE IF NOT EXISTS users (
  id           BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  email        VARCHAR(100)    NOT NULL,
  password     VARCHAR(255)    NOT NULL,
  nickname     VARCHAR(50)     NOT NULL,
  phone        VARCHAR(20)     NULL,
  gender       ENUM('M','F','N') NULL,
  role         ENUM('USER','ADMIN') NOT NULL DEFAULT 'USER',
  created_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2) 게스트하우스
-- region은 운영 편의상 ENUM으로 구성 (필요 시 별도 지역 테이블 권장)
CREATE TABLE IF NOT EXISTS guesthouses (
  id           BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name         VARCHAR(100)    NOT NULL,
  address      VARCHAR(255)    NOT NULL,
  region       ENUM('서울','경기','인천','부산','대구','대전','광주','울산','세종',
                    '강원','충북','충남','전북','전남','경북','경남','제주') NOT NULL,
  capacity     INT             NOT NULL,
  price        DECIMAL(10,2)   NOT NULL,
  description  TEXT            NULL,
  PRIMARY KEY (id),
  KEY idx_guesthouses_region (region)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2-1) 부대시설 (guesthouses : facilities = 1 : 1)
CREATE TABLE IF NOT EXISTS facilities (
  id               INT UNSIGNED NOT NULL AUTO_INCREMENT,
  guesthouse_id    BIGINT UNSIGNED NOT NULL,
  wifi             TINYINT(1) NOT NULL DEFAULT 0,
  parking          TINYINT(1) NOT NULL DEFAULT 0,
  breakfast        TINYINT(1) NOT NULL DEFAULT 0,
  air_conditioner  TINYINT(1) NOT NULL DEFAULT 0,
  tv               TINYINT(1) NOT NULL DEFAULT 0,
  laundry          TINYINT(1) NOT NULL DEFAULT 0,
  kitchen          TINYINT(1) NOT NULL DEFAULT 0,
  pet_allowed      TINYINT(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  UNIQUE KEY uk_facilities_guesthouse (guesthouse_id),             -- 1:1 보장
  CONSTRAINT fk_facilities_guesthouse
    FOREIGN KEY (guesthouse_id) REFERENCES guesthouses(id)
    ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3) 예약
-- 예약 겹침(동일 숙소에서 기간 중복 금지)은 DB 순수 제약만으로는 어려워
-- 보통 애플리케이션/트랜잭션 레벨 혹은 트리거로 제어합니다.
CREATE TABLE IF NOT EXISTS reservations (
  id             BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id        BIGINT UNSIGNED NOT NULL,
  guesthouse_id  BIGINT UNSIGNED NOT NULL,
  checkin_date   DATE            NOT NULL,
  checkout_date  DATE            NOT NULL,
  status         ENUM('RESERVED','CANCELLED','COMPLETED') NOT NULL DEFAULT 'RESERVED',
  created_at     DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at     DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_reservations_user   (user_id),
  KEY idx_reservations_house  (guesthouse_id),
  KEY idx_reservations_dates  (guesthouse_id, checkin_date, checkout_date),
  CONSTRAINT fk_reservations_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT fk_reservations_house
    FOREIGN KEY (guesthouse_id) REFERENCES guesthouses(id)
    ON UPDATE CASCADE ON DELETE CASCADE,
  -- 체크아웃은 체크인보다 뒤여야 함
  CHECK (checkout_date > checkin_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4) 리뷰
-- 한 예약당 리뷰는 최대 1개: reservation_id UNIQUE
-- (예약 status가 COMPLETED인지 검증은 애플리케이션/트리거에서 처리 권장)
CREATE TABLE IF NOT EXISTS reviews (
  id             BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  reservation_id BIGINT UNSIGNED NOT NULL,
  user_id        BIGINT UNSIGNED NOT NULL,
  guesthouse_id  BIGINT UNSIGNED NOT NULL,
  rating         INT             NOT NULL,
  content        TEXT            NOT NULL,
  created_at     DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at     DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_reviews_reservation (reservation_id),             -- 1:1 보장
  KEY idx_reviews_user       (user_id),
  KEY idx_reviews_guesthouse (guesthouse_id),
  CONSTRAINT fk_reviews_reservation
    FOREIGN KEY (reservation_id) REFERENCES reservations(id)
    ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT fk_reviews_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT fk_reviews_guesthouse
    FOREIGN KEY (guesthouse_id) REFERENCES guesthouses(id)
    ON UPDATE CASCADE ON DELETE CASCADE,
  CHECK (rating BETWEEN 1 AND 5)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5) 찜 (유저-숙소 중복 찜 방지 UNIQUE)
CREATE TABLE IF NOT EXISTS wishes (
  id             BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id        BIGINT UNSIGNED NOT NULL,
  guesthouse_id  BIGINT UNSIGNED NOT NULL,
  created_at     DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_wishes_user_house (user_id, guesthouse_id),
  KEY idx_wishes_user (user_id),
  KEY idx_wishes_house (guesthouse_id),
  CONSTRAINT fk_wishes_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT fk_wishes_house
    FOREIGN KEY (guesthouse_id) REFERENCES guesthouses(id)
    ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

SET FOREIGN_KEY_CHECKS = 1;
