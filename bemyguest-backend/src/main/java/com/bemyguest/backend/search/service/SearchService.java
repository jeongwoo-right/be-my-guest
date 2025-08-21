package com.bemyguest.backend.search.service;

import com.bemyguest.backend.search.dto.GuesthouseSummary;
import com.bemyguest.backend.search.dto.SearchRequest;
// ★ 변경: 엔티티 경로를 guesthouse 모듈 것으로 교체
import com.bemyguest.backend.guesthouse.entity.Guesthouse;

// ★ 변경: GuesthouseRepository → SearchRepository로 교체
import com.bemyguest.backend.search.repository.SearchRepository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class SearchService {

    // ★ 변경: 필드 타입/이름 변경 (GuesthouseRepository → SearchRepository)
    private final SearchRepository searchRepository;

    // ★ 변경: 생성자 주입 대상 변경
    public SearchService(SearchRepository searchRepository) {
        this.searchRepository = searchRepository;
    }

    /**
     * 예약 겹침 제외 + 페이징/정렬
     * - page/size/sort/dir 은 요청 DTO(SearchRequest)에서 받음
     */
    @Transactional(readOnly = true)
    public Page<GuesthouseSummary> searchAvailable(SearchRequest req) {
        validateDatesAndGuests(req);

        Sort sort = buildSort(req.getSort(), req.getDir());
        Pageable pageable = PageRequest.of(req.getPage(), req.getSize(), sort);

        // ★ 변경: searchRepository로 호출 대상 변경
        return searchRepository
                .findAvailableGuesthouses(
                        req.getRegion(),
                        req.getGuests(),
                        req.getStartDate(),
                        req.getEndDate(),
                        pageable
                )
                .map(this::toSummary);
    }

    // 정렬 규칙:
    // - rating: ratingAvg (dir), tie-break = ratingCount DESC, name ASC
    // - name: name (dir)
    // - default: price (dir)
    private Sort buildSort(String sortKey, String dir) {
        Sort.Direction direction =
                "desc".equalsIgnoreCase(dir) ? Sort.Direction.DESC : Sort.Direction.ASC;

        if ("rating".equalsIgnoreCase(sortKey)) {
            return Sort.by(
                    new Sort.Order(direction, "ratingAvg"),
                    new Sort.Order(Sort.Direction.DESC, "ratingCount"),
                    new Sort.Order(Sort.Direction.ASC, "name")
            );
        }

        if ("name".equalsIgnoreCase(sortKey)) {
            return Sort.by(new Sort.Order(direction, "name"));
        }

        // 기본: price
        return Sort.by(new Sort.Order(direction, "price"));
    }

    private GuesthouseSummary toSummary(Guesthouse g) {
        return new GuesthouseSummary(
                g.getId(),
                g.getName(),
                g.getAddress(),
                g.getRegion() == null ? null : g.getRegion().toString(),
                g.getCapacity(),
                g.getPrice(),
                g.getDescription(),
                // ★ 주의: Guesthouse 엔티티에 ratingAvg / ratingCount 게터가 존재해야 함
                g.getRatingAvg(),
                g.getRatingCount()
        );
    }

    private void validateDatesAndGuests(SearchRequest req) {
        if (req.getGuests() < 1) {
            throw new IllegalArgumentException("guests는 1 이상이어야 합니다.");
        }
        if (req.getStartDate() == null || req.getEndDate() == null) {
            throw new IllegalArgumentException("startDate와 endDate는 필수입니다. (yyyy-MM-dd)");
        }
        if (!req.getEndDate().isAfter(req.getStartDate())) {
            throw new IllegalArgumentException("endDate는 startDate 이후여야 합니다.");
        }
    }
}
