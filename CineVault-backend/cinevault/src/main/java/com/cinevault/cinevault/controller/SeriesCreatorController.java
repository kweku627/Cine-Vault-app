package com.cinevault.cinevault.controller;

import com.cinevault.cinevault.model.SeriesCreator;
import com.cinevault.cinevault.repository.SeriesCreatorRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/series-creators")
public class SeriesCreatorController {
    private final SeriesCreatorRepository seriesCreatorRepository;

    public SeriesCreatorController(SeriesCreatorRepository seriesCreatorRepository) {
        this.seriesCreatorRepository = seriesCreatorRepository;
    }

    @GetMapping
    public List<SeriesCreator> getAllCreators() {
        return seriesCreatorRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<SeriesCreator> getCreator(@PathVariable Long id) {
        return seriesCreatorRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/series/{seriesId}")
    public List<SeriesCreator> getCreatorsBySeries(@PathVariable Long seriesId) {
        return seriesCreatorRepository.findBySeriesId(seriesId);
    }

    @GetMapping("/search")
    public List<SeriesCreator> searchCreators(@RequestParam String name) {
        return seriesCreatorRepository.findByCreatorNameContainingIgnoreCase(name);
    }

    @PostMapping
    public SeriesCreator createCreator(@RequestBody SeriesCreator creator) {
        return seriesCreatorRepository.save(creator);
    }

    @PutMapping("/{id}")
    public ResponseEntity<SeriesCreator> updateCreator(@PathVariable Long id, @RequestBody SeriesCreator creator) {
        if (!seriesCreatorRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        creator.setId(id);
        return ResponseEntity.ok(seriesCreatorRepository.save(creator));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCreator(@PathVariable Long id) {
        if (!seriesCreatorRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        seriesCreatorRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
} 