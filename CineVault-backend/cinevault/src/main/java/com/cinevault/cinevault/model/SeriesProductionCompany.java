package com.cinevault.cinevault.model;

import jakarta.persistence.*;

@Entity
@Table(name = "series_production_companies")
public class SeriesProductionCompany {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "series_id")
    private Series series;

    @Column(name = "company_id")
    private Long companyId;

    @Column(name = "company_name")
    private String companyName;

    @Column(name = "logo_path")
    private String logoPath;

    @Column(name = "origin_country")
    private String originCountry;

    public SeriesProductionCompany() {}

    public SeriesProductionCompany(Long companyId, String companyName, String logoPath, String originCountry) {
        this.companyId = companyId;
        this.companyName = companyName;
        this.logoPath = logoPath;
        this.originCountry = originCountry;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Series getSeries() { return series; }
    public void setSeries(Series series) { this.series = series; }

    public Long getCompanyId() { return companyId; }
    public void setCompanyId(Long companyId) { this.companyId = companyId; }

    public String getCompanyName() { return companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }

    public String getLogoPath() { return logoPath; }
    public void setLogoPath(String logoPath) { this.logoPath = logoPath; }

    public String getOriginCountry() { return originCountry; }
    public void setOriginCountry(String originCountry) { this.originCountry = originCountry; }
} 