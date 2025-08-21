package com.bemyguest.backend.guesthouse.service;

import com.bemyguest.backend.guesthouse.dto.GuesthouseDetailDto;
import com.bemyguest.backend.guesthouse.entity.Facilities;
import com.bemyguest.backend.guesthouse.entity.Guesthouse;
import com.bemyguest.backend.guesthouse.repository.GuesthouseRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service @RequiredArgsConstructor
public class GuesthouseService {

    private final GuesthouseRepository guesthouseRepository;

    @Transactional(readOnly = true)
    public GuesthouseDetailDto getDetail(Long id) {
        Guesthouse g = guesthouseRepository.findWithFacilitiesById(id)
            .orElseThrow(() -> new EntityNotFoundException("Guesthouse not found: " + id));

        Facilities f = g.getFacilities();

        return GuesthouseDetailDto.builder()
                .id(g.getId())
                .name(g.getName())
                .address(g.getAddress())
                .region(g.getRegion() != null ? g.getRegion().getKr() : null)          // String
                .capacity(g.getCapacity())      // capacity
                .price(g.getPrice())
                .description(g.getDescription())
                .wifi(f != null ? f.getWifi() : null)
                .parking(f != null ? f.getParking() : null)
                .breakfast(f != null ? f.getBreakfast() : null)
                .airConditioner(f != null ? f.getAirConditioner() : null)
                .tv(f != null ? f.getTv() : null)
                .laundry(f != null ? f.getLaundry() : null)
                .kitchen(f != null ? f.getKitchen() : null)
                .petAllowed(f != null ? f.getPetAllowed() : null)
                .build();
    }

}
