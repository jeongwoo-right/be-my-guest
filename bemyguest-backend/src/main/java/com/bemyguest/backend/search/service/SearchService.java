package com.bemyguest.backend.search.service;

import com.bemyguest.backend.search.dto.GuesthouseSummary;
import com.bemyguest.backend.search.dto.SearchRequest;
import com.bemyguest.backend.search.entity.Guesthouse;
import com.bemyguest.backend.search.repository.GuesthouseRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class SearchService {

    private final GuesthouseRepository guesthouseRepository;

    public SearchService(GuesthouseRepository guesthouseRepository) {
        this.guesthouseRepository = guesthouseRepository;
    }

    @Transactional(readOnly = true)
    public Page<GuesthouseSummary> searchAvailable(SearchRequest req) {
        validateDatesAndGuests(req);

        Sort sort = buildSort(req.getSort(), req.getDir());
        Pageable pageable = PageRequest.of(req.getPage(), req.getSize(), sort);

        return guesthouseRepository
                .findAvailableGuesthouses(
                        req.getRegion(),
                        req.getGuests(),
                        req.getStartDate(),
                        req.getEndDate(),
                        pageable
                )
                .map(this::toSummary);
    }

    private Sort buildSort(String sortKey, String dir) {
        Sort.Direction direction =
                "desc".equalsIgnoreCase(dir) ? Sort.Direction.DESC : Sort.Direction.ASC;

        // 평점 정렬: ratingAvg 우선, 동률 시 ratingCount(내림차순), 그다음 name(오름차순)
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
