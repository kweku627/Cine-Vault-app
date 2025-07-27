package com.cinevault.cinevault.model;

import jakarta.persistence.*;

@Entity
@Table(name = "series_production_countries")
public class SeriesProductionCountry {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "series_id")
    private Series series;

    @Column(name = "country_code")
    private String countryCode;

    @Column(name = "country_name")
    private String countryName;

    public SeriesProductionCountry() {}

    public SeriesProductionCountry(String countryCode, String countryName) {
        this.countryCode = countryCode;
        this.countryName = countryName;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Series getSeries() { return series; }
    public void setSeries(Series series) { this.series = series; }

    public String getCountryCode() { return countryCode; }
    public void setCountryCode(String countryCode) { this.countryCode = countryCode; }

    public String getCountryName() { return countryName; }
    public void setCountryName(String countryName) { this.countryName = countryName; }
} 