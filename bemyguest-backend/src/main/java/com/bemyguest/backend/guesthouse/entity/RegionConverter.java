package com.bemyguest.backend.guesthouse.entity;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = false)
public class RegionConverter implements AttributeConverter<Region, String> {
    @Override public String convertToDatabaseColumn(Region attribute) {
        return attribute == null ? null : attribute.getKr();
    }
    @Override public Region convertToEntityAttribute(String dbData) {
        return dbData == null ? null : Region.fromKr(dbData);
    }
}


