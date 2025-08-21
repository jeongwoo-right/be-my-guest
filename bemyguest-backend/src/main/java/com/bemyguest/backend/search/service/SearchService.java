package com.bemyguest.backend.search.service;

import com.bemyguest.backend.search.dto.GuesthouseSummary;
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

    // (기존) 엔티티 반환 -> (변경) DTO 반환
    @Transactional(readOnly = true)
    public List<GuesthouseSummary> searchBasic(SearchRequest req) {
        validateDatesAndGuests(req);
        List<Guesthouse> entities =
                guesthouseRepository.findByBasicFilters(req.getRegion(), req.getGuests());
        return entities.stream().map(this::toSummary).toList();
    }

    // (기존) 엔티티 반환 -> (변경) DTO 반환
    @Transactional(readOnly = true)
    public List<GuesthouseSummary> searchAvailable(SearchRequest req) {
        validateDatesAndGuests(req);
        List<Guesthouse> entities =
                guesthouseRepository.findAvailableGuesthouses(
                        req.getRegion(),
                        req.getGuests(),
                        req.getStartDate(),
                        req.getEndDate()
                );
        return entities.stream().map(this::toSummary).toList();
    }

    // ----- 내부 유틸 -----
    private GuesthouseSummary toSummary(Guesthouse g) {
        return new GuesthouseSummary(
                g.getId(),
                g.getName(),
                g.getAddress(),
                g.getRegion() == null ? null : g.getRegion().toString(), // enum → 문자열
                g.getCapacity(),
                g.getPrice(),
                g.getDescription()
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
