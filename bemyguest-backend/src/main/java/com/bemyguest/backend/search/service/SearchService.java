package com.bemyguest.backend.search.service;

import com.bemyguest.backend.search.dto.SearchRequest;
import com.bemyguest.backend.search.entity.Guesthouse;
import com.bemyguest.backend.search.repository.GuesthouseRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class SearchService {

    private final GuesthouseRepository guesthouseRepository;

    public SearchService(GuesthouseRepository guesthouseRepository) {
        this.guesthouseRepository = guesthouseRepository;
    }

    // (이전 단계) 기본 검색: region/guests만 적용
    @Transactional(readOnly = true)
    public List<Guesthouse> searchBasic(SearchRequest req) {
        validateDatesAndGuests(req);
        return guesthouseRepository.findByBasicFilters(req.getRegion(), req.getGuests());
    }

    // (이번 단계) 예약 겹침 제외 검색
    @Transactional(readOnly = true)
    public List<Guesthouse> searchAvailable(SearchRequest req) {
        validateDatesAndGuests(req);
        return guesthouseRepository.findAvailableGuesthouses(
                req.getRegion(),
                req.getGuests(),
                req.getStartDate(),
                req.getEndDate()
        );
    }

    // 공통 유효성
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
