package com.cinevault.cinevault.model;

import jakarta.persistence.*;

@Entity
@Table(name = "series_networks")
public class SeriesNetwork {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "series_id")
    private Series series;

    @Column(name = "network_id")
    private Long networkId;

    @Column(name = "network_name")
    private String networkName;

    @Column(name = "logo_path")
    private String logoPath;

    @Column(name = "origin_country")
    private String originCountry;

    public SeriesNetwork() {}

    public SeriesNetwork(Long networkId, String networkName, String logoPath, String originCountry) {
        this.networkId = networkId;
        this.networkName = networkName;
        this.logoPath = logoPath;
        this.originCountry = originCountry;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Series getSeries() { return series; }
    public void setSeries(Series series) { this.series = series; }

    public Long getNetworkId() { return networkId; }
    public void setNetworkId(Long networkId) { this.networkId = networkId; }

    public String getNetworkName() { return networkName; }
    public void setNetworkName(String networkName) { this.networkName = networkName; }

    public String getLogoPath() { return logoPath; }
    public void setLogoPath(String logoPath) { this.logoPath = logoPath; }

    public String getOriginCountry() { return originCountry; }
    public void setOriginCountry(String originCountry) { this.originCountry = originCountry; }
} 