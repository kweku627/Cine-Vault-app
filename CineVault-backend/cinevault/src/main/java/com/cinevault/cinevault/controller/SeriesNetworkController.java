package com.cinevault.cinevault.controller;

import com.cinevault.cinevault.model.SeriesNetwork;
import com.cinevault.cinevault.repository.SeriesNetworkRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/series-networks")
public class SeriesNetworkController {
    private final SeriesNetworkRepository seriesNetworkRepository;

    public SeriesNetworkController(SeriesNetworkRepository seriesNetworkRepository) {
        this.seriesNetworkRepository = seriesNetworkRepository;
    }

    @GetMapping
    public List<SeriesNetwork> getAllNetworks() {
        return seriesNetworkRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<SeriesNetwork> getNetwork(@PathVariable Long id) {
        return seriesNetworkRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/series/{seriesId}")
    public List<SeriesNetwork> getNetworksBySeries(@PathVariable Long seriesId) {
        return seriesNetworkRepository.findBySeriesId(seriesId);
    }

    @GetMapping("/search")
    public List<SeriesNetwork> searchNetworks(@RequestParam String name) {
        return seriesNetworkRepository.findByNetworkNameContainingIgnoreCase(name);
    }

    @GetMapping("/country/{country}")
    public List<SeriesNetwork> getNetworksByCountry(@PathVariable String country) {
        return seriesNetworkRepository.findByOriginCountry(country);
    }

    @PostMapping
    public SeriesNetwork createNetwork(@RequestBody SeriesNetwork network) {
        return seriesNetworkRepository.save(network);
    }

    @PutMapping("/{id}")
    public ResponseEntity<SeriesNetwork> updateNetwork(@PathVariable Long id, @RequestBody SeriesNetwork network) {
        if (!seriesNetworkRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        network.setId(id);
        return ResponseEntity.ok(seriesNetworkRepository.save(network));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNetwork(@PathVariable Long id) {
        if (!seriesNetworkRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        seriesNetworkRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
} 